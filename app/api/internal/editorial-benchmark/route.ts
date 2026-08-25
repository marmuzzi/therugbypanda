import { NextRequest, NextResponse } from "next/server";

import benchmarkBatch from "@/data/editorial-acquisition/auto004-2026-08-24-fresh.json";
import type { ArticleStyleProfileId } from "@/lib/editorial/ArticleStyleProfile";
import type { FactLedger, RawStoryInput } from "@/lib/editorial/EditorialTypes";
import { EditorialBrain } from "@/lib/editorial/EditorialBrain";
import { generateArticleDraft } from "@/lib/editorial/OpenAIArticleGenerator";
import { runPublicationReviewCycle } from "@/lib/editorial/PublicationReviewCycle";

export const runtime = "nodejs";
export const maxDuration = 240;

const ALLOWED_MODELS = new Set(["gpt-5", "gpt-5-mini"]);
const PACKAGE_STYLE_PROFILES = ["news-desk", "analysis-led", "feature-led", "notebook", "explainer"] as const;
const ALLOWED_CATEGORIES = new Set(["Leinster", "Ulster", "Connacht", "Munster", "Ireland", "URC", "Europe", "Opinion"] as const);

type BenchmarkModel = "gpt-5" | "gpt-5-mini";
type CanonicalCandidate = (typeof benchmarkBatch.candidates)[number];
type SuggestedCategory = NonNullable<RawStoryInput["suggestedCategory"]>;
type BenchmarkRequest = { model: BenchmarkModel; candidate: number };
type ResolvedBenchmarkRequest = {
  model: BenchmarkModel;
  story: RawStoryInput;
  factLedger: FactLedger;
  styleProfileId: ArticleStyleProfileId;
};

function authorised(request: NextRequest) {
  const expected = process.env.EDITORIAL_AUTOMATION_SECRET?.trim();
  return Boolean(expected) && request.headers.get("authorization") === `Bearer ${expected}`;
}

function typedCategory(value: string): SuggestedCategory | undefined {
  return ALLOWED_CATEGORIES.has(value as SuggestedCategory) ? value as SuggestedCategory : undefined;
}

function canonicalRequest(candidate: CanonicalCandidate, index: number, model: BenchmarkModel): ResolvedBenchmarkRequest {
  const retrievedAt = benchmarkBatch.acquiredAt;
  const sourceRecords = candidate.sourceRecords.map((source) => ({ ...source, retrievedAt }));
  const sourceIds = sourceRecords.map((source) => source.id);
  return {
    model,
    story: {
      id: candidate.id,
      title: candidate.title,
      summary: candidate.summary,
      sourceRecords,
      discoveredAt: retrievedAt,
      suggestedCategory: typedCategory(candidate.suggestedCategory),
    },
    factLedger: {
      facts: candidate.facts.map((claim, factIndex) => ({
        id: `${candidate.id}-fact-${factIndex + 1}`,
        claim,
        status: "confirmed",
        confidence: 98,
        sourceIds,
        usableInDraft: true,
      })),
      unsupportedClaims: [],
      conflicts: [],
    },
    styleProfileId: PACKAGE_STYLE_PROFILES[index % PACKAGE_STYLE_PROFILES.length],
  };
}

async function runBenchmark(body: ResolvedBenchmarkRequest) {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  const previousModel = process.env.OPENAI_EDITORIAL_MODEL;

  try {
    process.env.OPENAI_EDITORIAL_MODEL = body.model;
    const editorial = new EditorialBrain().evaluate(body.story, { factLedger: body.factLedger });
    if (editorial.decision !== "draft") {
      return NextResponse.json({ status: editorial.decision, requestId, model: body.model, inputId: body.story.id, persisted: false });
    }

    console.info("Editorial benchmark started", {
      requestId,
      inputId: body.story.id,
      model: body.model,
      styleProfileId: body.styleProfileId,
    });

    const generatedArticle = await generateArticleDraft(body.story, editorial, {
      targetLengthWords: "700-1100",
      timeoutMs: 120_000,
      styleProfileId: body.styleProfileId,
    });
    const publicationReview = await runPublicationReviewCycle(generatedArticle, editorial, body.story);

    console.info("Editorial benchmark completed", {
      requestId,
      inputId: body.story.id,
      model: body.model,
      durationMs: Date.now() - startedAt,
      corrected: publicationReview.corrected,
      review1Issues: publicationReview.review1.issues.length,
      review1Blocking: publicationReview.review1.issues.filter((issue) => issue.severity === "critical" || issue.severity === "high").length,
      review2Issues: publicationReview.review2.issues.length,
      review2Blocking: publicationReview.review2.issues.filter((issue) => issue.severity === "critical" || issue.severity === "high").length,
      title: publicationReview.article.title,
    });

    return NextResponse.json({
      status: "benchmark-passed",
      requestId,
      model: body.model,
      inputId: body.story.id,
      styleProfileId: body.styleProfileId,
      title: publicationReview.article.title,
      standfirst: publicationReview.article.standfirst,
      publicationReview,
      durationMs: Date.now() - startedAt,
      persisted: false,
    });
  } catch (error) {
    console.error("Editorial benchmark failed", {
      requestId,
      inputId: body.story.id,
      model: body.model,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({
      status: "benchmark-failed",
      requestId,
      model: body.model,
      inputId: body.story.id,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startedAt,
      persisted: false,
    }, { status: 500 });
  } finally {
    if (previousModel === undefined) delete process.env.OPENAI_EDITORIAL_MODEL;
    else process.env.OPENAI_EDITORIAL_MODEL = previousModel;
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ready",
    benchmarkMode: "controlled-canonical-package",
    candidateCount: benchmarkBatch.candidates.length,
    allowedModels: [...ALLOWED_MODELS],
    persisted: false,
  });
}

export async function POST(request: NextRequest) {
  if (!authorised(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as BenchmarkRequest;
  if (!ALLOWED_MODELS.has(body.model) || !Number.isInteger(body.candidate) || body.candidate < 0 || body.candidate >= benchmarkBatch.candidates.length) {
    return NextResponse.json({ error: "model must be gpt-5 or gpt-5-mini and candidate must be 0..4." }, { status: 400 });
  }
  return runBenchmark(canonicalRequest(benchmarkBatch.candidates[body.candidate], body.candidate, body.model));
}
