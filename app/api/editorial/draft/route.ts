import { NextRequest, NextResponse } from "next/server";

import type { FactLedger, RawStoryInput } from "@/lib/editorial/EditorialTypes";
import { EditorialBrain } from "@/lib/editorial/EditorialBrain";
import { generateArticleDraft } from "@/lib/editorial/OpenAIArticleGenerator";
import { createSanityArticleDraft, validateSanityConnectivity } from "@/lib/editorial/SanityDraftWriter";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_STUDIO_ORIGIN = "https://therugbypanda.sanity.studio";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_STUDIO_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  Vary: "Origin",
};

type DraftRequest = {
  story: RawStoryInput;
  factLedger: FactLedger;
  createSanityDraft?: boolean;
  editorialImageId?: string;
  dryRun?: boolean;
  qaMode?: boolean;
};

function jsonResponse(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      ...corsHeaders,
      ...(init?.headers ?? {}),
    },
  });
}

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.EDITORIAL_AUTOMATION_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return jsonResponse({ error: "Unauthorized" }, { status: 401 });
  }

  const requestId = crypto.randomUUID();
  const startedAt = Date.now();

  try {
    const body = (await request.json()) as DraftRequest;
    if (!body.story || !body.factLedger) {
      return jsonResponse({ error: "story and factLedger are required" }, { status: 400 });
    }

    console.info("Editorial pipeline started", {
      requestId,
      inputId: body.story.id,
      dryRun: body.dryRun === true,
      qaMode: body.qaMode === true,
    });

    const editorial = new EditorialBrain().evaluate(body.story, { factLedger: body.factLedger });
    console.info("Editorial Brain completed", {
      requestId,
      inputId: body.story.id,
      decision: editorial.decision,
      score: editorial.score.total,
      confidence: editorial.confidence,
      durationMs: Date.now() - startedAt,
    });

    if (editorial.decision !== "draft") {
      return jsonResponse({
        status: editorial.decision,
        editorial,
        message: "No article was generated because the Editorial Brain did not approve this story for drafting.",
      });
    }

    if (body.dryRun === true) {
      const sanity = await validateSanityConnectivity(editorial.category);
      const checks = {
        authentication: true,
        requestShape: true,
        editorialBrain: true,
        editorialDecision: editorial.decision,
        openAiConfigured: Boolean(process.env.OPENAI_API_KEY),
        openAiModel: process.env.OPENAI_EDITORIAL_MODEL ?? "gpt-5",
        structuredSchemaConfigured: true,
        sanity,
      };
      console.info("Editorial dry run completed", {
        requestId,
        inputId: body.story.id,
        durationMs: Date.now() - startedAt,
      });
      return jsonResponse({ status: "dry-run-passed", editorial, checks, requestId });
    }

    console.info("Editorial OpenAI stage starting", { requestId, inputId: body.story.id });
    const article = await generateArticleDraft(body.story, editorial, {
      targetLengthWords: body.qaMode === true ? "250-400" : "700-1100",
      timeoutMs: body.qaMode === true ? 42_000 : 45_000,
    });
    const pkg = { editorial, article };

    if (body.createSanityDraft === false) {
      return jsonResponse({ status: "generated", ...pkg, requestId });
    }

    console.info("Editorial Sanity draft stage starting", { requestId, inputId: body.story.id });
    const sanityDraft = await createSanityArticleDraft(pkg, {
      editorialImageId: body.editorialImageId,
      story: body.story,
    });
    console.info("Editorial pipeline completed", {
      requestId,
      inputId: body.story.id,
      sanityDraftId: sanityDraft.id,
      durationMs: Date.now() - startedAt,
    });
    return jsonResponse({ status: "draft-created", editorial, article, sanityDraft, requestId });
  } catch (error) {
    console.error("Editorial draft pipeline failed", {
      requestId,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : "Editorial draft pipeline failed",
    });
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Editorial draft pipeline failed", requestId },
      { status: 500 },
    );
  }
}
