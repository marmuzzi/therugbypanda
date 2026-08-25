import { NextRequest, NextResponse } from "next/server";

import type { ArticleStyleProfileId } from "@/lib/editorial/ArticleStyleProfile";
import type { FactLedger, RawStoryInput } from "@/lib/editorial/EditorialTypes";
import { EditorialBrain } from "@/lib/editorial/EditorialBrain";
import { generateArticleDraft } from "@/lib/editorial/OpenAIArticleGenerator";
import { runPublicationReviewCycle } from "@/lib/editorial/PublicationReviewCycle";

export const runtime = "nodejs";
export const maxDuration = 240;

const ALLOWED_MODELS = new Set(["gpt-5", "gpt-5-mini"]);

type BenchmarkRequest = {
  model: "gpt-5" | "gpt-5-mini";
  story: RawStoryInput;
  factLedger: FactLedger;
  styleProfileId?: ArticleStyleProfileId;
};

function authorised(request: NextRequest) {
  const expected = process.env.EDITORIAL_AUTOMATION_SECRET?.trim();
  return Boolean(expected) && request.headers.get("authorization") === `Bearer ${expected}`;
}

export async function POST(request: NextRequest) {
  if (!authorised(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ error: "Benchmark route is disabled in production." }, { status: 403 });
  }

  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  const previousModel = process.env.OPENAI_EDITORIAL_MODEL;

  try {
    const body = (await request.json()) as BenchmarkRequest;
    if (!ALLOWED_MODELS.has(body.model) || !body.story || !body.factLedger) {
      return NextResponse.json({ error: "model, story and factLedger are required." }, { status: 400 });
    }

    process.env.OPENAI_EDITORIAL_MODEL = body.model;
    const editorial = new EditorialBrain().evaluate(body.story, { factLedger: body.factLedger });
    if (editorial.decision !== "draft") {
      return NextResponse.json({ status: editorial.decision, requestId, model: body.model, editorial });
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
      editorial,
      article: publicationReview.article,
      publicationReview,
      durationMs: Date.now() - startedAt,
      persisted: false,
    });
  } catch (error) {
    console.error("Editorial benchmark failed", {
      requestId,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({
      status: "benchmark-failed",
      requestId,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startedAt,
      persisted: false,
    }, { status: 500 });
  } finally {
    if (previousModel === undefined) delete process.env.OPENAI_EDITORIAL_MODEL;
    else process.env.OPENAI_EDITORIAL_MODEL = previousModel;
  }
}
