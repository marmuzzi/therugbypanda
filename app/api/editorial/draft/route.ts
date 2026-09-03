import { NextRequest, NextResponse } from "next/server";

import type { ArticleStyleProfileId } from "@/lib/editorial/ArticleStyleProfile";
import { enrichSanityDraftWithContextualCard } from "@/lib/editorial/ContextualDataCardEnricher";
import type { FactLedger, RawStoryInput } from "@/lib/editorial/EditorialTypes";
import { EditorialBrain } from "@/lib/editorial/EditorialBrain";
import { notifyDraftCreated } from "@/lib/editorial/EditorialNotifications";
import { generateArticleDraft } from "@/lib/editorial/OpenAIArticleGenerator";
import { runPublicationReviewCycle } from "@/lib/editorial/PublicationReviewCycle";
import { createSanityArticleDraft, validateSanityConnectivity } from "@/lib/editorial/SanityDraftWriter";

export const runtime = "nodejs";
export const maxDuration = 240;

const ALLOWED_STUDIO_ORIGIN = "https://therugbypanda.sanity.studio";
const EDITORIAL_GENERATION_TIMEOUT_MS = 135_000;

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
  notificationMode?: "draft" | "package";
  styleProfileId?: ArticleStyleProfileId;
};

type FinalSourceNote = {
  sourceId?: string;
  publisher?: string;
  url?: string;
};

function jsonResponse(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: { ...corsHeaders, ...(init?.headers ?? {}) },
  });
}

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.EDITORIAL_AUTOMATION_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

function assertFinalSourceIntegrity(article: { sourceNotes?: FinalSourceNote[] }, story: RawStoryInput) {
  const notes = Array.isArray(article.sourceNotes) ? article.sourceNotes : [];
  const sourceById = new Map(story.sourceRecords.map((source) => [source.id, source]));
  const validNotes = notes.filter((note) => {
    const sourceId = String(note.sourceId ?? "").trim();
    const publisher = String(note.publisher ?? "").trim();
    const url = String(note.url ?? "").trim();
    const source = sourceById.get(sourceId);
    return Boolean(
      source
      && publisher
      && /^https?:\/\//i.test(url)
      && String(source.publisher ?? "").trim().toLowerCase() === publisher.toLowerCase(),
    );
  });
  const publishers = new Set(validNotes.map((note) => String(note.publisher).trim().toLowerCase()));

  if (notes.length < 2 || validNotes.length !== notes.length || publishers.size < 2) {
    throw new Error(
      `Final source-integrity gate failed: ${notes.length} source notes, ${validNotes.length} mapped to supplied evidence, ${publishers.size} distinct publishers; minimum is 2 valid notes from 2 publishers.`,
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return jsonResponse({ error: "Unauthorized" }, { status: 401 });

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
      notificationMode: body.notificationMode ?? "draft",
      styleProfileId: body.styleProfileId ?? null,
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
        reviewModel: process.env.OPENAI_EDITORIAL_REVIEW_MODEL ?? "gpt-5-mini",
        structuredSchemaConfigured: true,
        publicationReviewConfigured: true,
        contextualCardEnrichmentConfigured: true,
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
    const generatedArticle = await generateArticleDraft(body.story, editorial, {
      targetLengthWords: body.qaMode === true ? "250-400" : "700-1100",
      timeoutMs: EDITORIAL_GENERATION_TIMEOUT_MS,
      styleProfileId: body.styleProfileId,
    });

    console.info("Publication review cycle starting", { requestId, inputId: body.story.id });
    const publicationReview = await runPublicationReviewCycle(generatedArticle, editorial, body.story);
    const article = publicationReview.article;
    assertFinalSourceIntegrity(article, body.story);
    const pkg = { editorial, article };

    if (body.createSanityDraft === false) {
      return jsonResponse({ status: "generated", ...pkg, publicationReview, requestId });
    }

    console.info("Editorial Sanity draft stage starting", { requestId, inputId: body.story.id });
    const sanityDraft = await createSanityArticleDraft(pkg, {
      editorialImageId: body.editorialImageId,
      story: body.story,
      automationContentClass: body.qaMode === true ? "qa" : "production",
      morningPackageEligible: body.qaMode !== true,
    });

    let contextualCard: Awaited<ReturnType<typeof enrichSanityDraftWithContextualCard>> | { status: "failed"; error: string };
    try {
      contextualCard = await enrichSanityDraftWithContextualCard(sanityDraft.id, pkg);
    } catch (error) {
      contextualCard = { status: "failed", error: error instanceof Error ? error.message : "Contextual card enrichment failed" };
      console.warn("Contextual card enrichment failed", { requestId, inputId: body.story.id, error: contextualCard.error });
    }

    const notification = body.notificationMode === "package"
      ? { status: "suppressed" as const, eventId: null, reason: "consolidated-morning-package" }
      : await notifyDraftCreated({
          articleId: sanityDraft.id,
          articleTitle: article.title,
          actor: "editorial-automation",
          occurredAt: new Date().toISOString(),
          submissionNote: "A new draft is ready for editorial review and one-click publication.",
        });

    console.info("Editorial pipeline completed", {
      requestId,
      inputId: body.story.id,
      sanityDraftId: sanityDraft.id,
      notificationStatus: notification.status,
      notificationEventId: notification.eventId,
      morningPackageEligible: sanityDraft.morningPackageEligible,
      contextualCardStatus: contextualCard.status,
      publicationReviewCorrected: publicationReview.corrected,
      review1Issues: publicationReview.review1.issues.length,
      review2Issues: publicationReview.review2.issues.length,
      durationMs: Date.now() - startedAt,
    });
    return jsonResponse({ status: "draft-created", editorial, article, publicationReview, sanityDraft, contextualCard, notification, requestId });
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