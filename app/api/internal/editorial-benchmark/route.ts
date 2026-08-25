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

type BenchmarkModel = "gpt-5" | "gpt-5-mini";
type BenchmarkRequest = {
  model: BenchmarkModel;
  story: RawStoryInput;
  factLedger: FactLedger;
  styleProfileId?: ArticleStyleProfileId;
};

type CanonicalCandidate = (typeof benchmarkBatch.candidates)[number];

function authorised(request: NextRequest) {
  const expected = process.env.EDITORIAL_AUTOMATION_SECRET?.trim();
  return Boolean(expected) && request.headers.get("authorization") === `Bearer ${expected}`;
}

function canonicalRequest(candidate: CanonicalCandidate, index: number, model: BenchmarkModel): BenchmarkRequest {
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
      suggestedCategory: candidate.suggestedCategory,
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

async function runBenchmark(body: BenchmarkRequest) {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  const previousModel = process.env.OPENAI_EDITORIAL_MODEL;

  try {
    if (!ALLOWED_MODELS.has(body.model) || !body.story || !body.factLedger) {
      return NextResponse.json({ error: "model, story and factLedger are required." }, { status: 400 });
    }

    process.env.OPENAI_EDITORIAL_MODEL = body.model;
    const editorial = new EditorialBrain().evaluate(body.story, { factLedger: body.factLedger });
    if (editorial.decision !== "draft") {
      return NextResponse.json({ status: editorial.decision, requestId, model: body.model, editorial, persisted: false });
    }

    console.info("Editorial benchmark started", {
      requestId,
      inputId: body.story.id,
      model: body.model,
      styleProfileId: body.styleProfileId ?? null,
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
      article: publicationReview.article,
      publicationReview,
      durationMs: Date.now() - startedAt,
      persisted: false,
    });
  } catch (error) {
    console.error("Editorial benchmark failed", {
      requestId,
      inputId: body.story?.id,
      model: body.model,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({
      status: "benchmark-failed",
      requestId,
      model: body.model,
      inputId: body.story?.id,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startedAt,
      persisted: false,
    }, { status: 500 });
  } finally {
    if (previousModel === undefined) delete process.env.OPENAI_EDITORIAL_MODEL;
    else process.env.OPENAI_EDITORIAL_MODEL = previousModel;
  }
}

export async function GET(request: NextRequest) {
  if (process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ error: "Benchmark route is disabled in production." }, { status: 403 });
  }
  const model = request.nextUrl.searchParams.get("model") as BenchmarkModel | null;
  const candidateIndex = Number.parseInt(request.nextUrl.searchParams.get("candidate") ?? "", 10);
  if (!model || !ALLOWED_MODELS.has(model) || !Number.isInteger(candidateIndex) || candidateIndex < 0 || candidateIndex >= benchmarkBatch.candidates.length) {
    return NextResponse.json({ error: "Use ?model=gpt-5-mini&candidate=0..4 on a preview deployment." }, { status: 400 });
  }
  return runBenchmark(canonicalRequest(benchmarkBatch.candidates[candidateIndex], candidateIndex, model));
}

export async function POST(request: NextRequest) {
  if (!authorised(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ error: "Benchmark route is disabled in production." }, { status: 403 });
  }
  return runBenchmark((await request.json()) as BenchmarkRequest);
}
