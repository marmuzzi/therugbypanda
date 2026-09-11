import { NextRequest, NextResponse } from "next/server";
import type { ArticleStyleProfileId } from "@/lib/editorial/ArticleStyleProfile";
import { reserveEditorialAiBudget } from "@/lib/editorial/AiDailyBudget";
import { enrichSanityDraftWithContextualCard } from "@/lib/editorial/ContextualDataCardEnricher";
import type { FactLedger, RawStoryInput } from "@/lib/editorial/EditorialTypes";
import { EditorialBrain } from "@/lib/editorial/EditorialBrain";
import { notifyDraftCreated } from "@/lib/editorial/EditorialNotifications";
import { generateArticleDraft } from "@/lib/editorial/OpenAIArticleGenerator";
import { createSanityArticleDraft, validateSanityConnectivity } from "@/lib/editorial/SanityDraftWriter";

export const runtime = "nodejs";
export const maxDuration = 240;
const ALLOWED_STUDIO_ORIGIN = "https://therugbypanda.sanity.studio";
const EDITORIAL_GENERATION_TIMEOUT_MS = 135_000;
const DEFAULT_GENERATION_MODEL = "gpt-5.6-terra";
const DEFAULT_REVIEW_MODEL = "gpt-5.6-luna";
const DRAFT_PIPELINE_BUDGET_RESERVATION_USD = 0.055;
const MATCH_LIKE = /\b(?:match|test|round|fixture|final|semi-final|quarter-final|trial|friendly|beat|defeat|win|won|loss|lost|draw|score|kick-?off|victory|overpower(?:ed)?)\b/i;
const COMPLETED_MATCH = /\b(?:beat|defeat(?:ed)?|won|loss|lost|draw|victory|overpower(?:ed)?|edged|thrashed)\b/i;
const SQUAD_SELECTION = /\b(?:squad|selection|selected|named|line-?up|team named|uncapped|retained|roster)\b/i;
const DATE_DETAIL = /\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december|today|tonight|yesterday|tomorrow)\b|\b\d{1,2}[\s/-](?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|\d{1,2})\b/i;
const SCORE_DETAIL = /\b\d{1,3}\s*[-–:]\s*\d{1,3}\b/;
const VENUE_DETAIL = /\b(?:stadium|park|ground|arena|sportsground|aviva|thomond|kingspan|dexcom|rds|croke park|eden park|cape town|auckland|dublin|limerick|belfast|galway|cork|soweto)\b/i;
const PLAYER_COACH_DETAIL = /\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]{2,}\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]{2,}\b/g;
const GENERIC_PERSON_NAMES = /^(?:irish independent|planet rugby|united rugby|rugby football|world rugby|the rugby|new zealand|south africa|red roses)$/i;
const GENERIC_PERSON_PREFIXES = new Set(["returning", "former", "current", "latest", "uncapped", "injured", "fit-again", "two-time"]);
const corsHeaders = { "Access-Control-Allow-Origin": ALLOWED_STUDIO_ORIGIN, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Authorization, Content-Type", Vary: "Origin" };

type DraftRequest = { story: RawStoryInput; factLedger: FactLedger; createSanityDraft?: boolean; editorialImageId?: string; dryRun?: boolean; qaMode?: boolean; notificationMode?: "draft" | "package"; styleProfileId?: ArticleStyleProfileId; };
type FinalSourceNote = { sourceId?: string; publisher?: string; url?: string; };
function jsonResponse(body: unknown, init?: ResponseInit) { return NextResponse.json(body, { ...init, headers: { ...corsHeaders, ...(init?.headers ?? {}) } }); }
function isAuthorized(request: NextRequest): boolean { const secret = process.env.EDITORIAL_AUTOMATION_SECRET; return Boolean(secret && request.headers.get("authorization") === `Bearer ${secret}`); }
function personNames(value: string) { return (value.match(PLAYER_COACH_DETAIL) ?? []).map((name) => name.replace(/[’']/g, "'")).filter((name) => { if (GENERIC_PERSON_NAMES.test(name)) return false; const [first] = name.toLowerCase().split(/\s+/); return !GENERIC_PERSON_PREFIXES.has(first); }); }
function namedPeople(value: string) { return new Set(personNames(value).map((name) => name.toLowerCase())); }
function assertPersonIdentityCoherence(story: RawStoryInput, factEvidence: string) {
  const primary = personNames(story.title); const evidenceNames = personNames(factEvidence);
  for (const primaryName of primary) { const [primaryFirst, ...primaryRest] = primaryName.toLowerCase().split(/\s+/); const primaryLast = primaryRest.at(-1); if (!primaryLast) continue; const collision = evidenceNames.find((name) => { const [first, ...rest] = name.toLowerCase().split(/\s+/); return rest.at(-1) === primaryLast && first !== primaryFirst; }); if (collision) throw new Error(`Pre-generation evidence gate failed: person-identity collision for surname ${primaryLast}; story names ${primaryName} but usable facts also contain ${collision}. Require coherent same-person evidence before OpenAI spend.`); }
}
function assertPreGenerationEvidence(story: RawStoryInput, factLedger: FactLedger) {
  const usableFacts = (Array.isArray(factLedger.facts) ? factLedger.facts : []).filter((fact) => fact.usableInDraft && fact.status !== "disputed" && String(fact.claim || "").trim().length >= 25);
  const factEvidence = usableFacts.map((fact) => fact.claim).filter(Boolean).join(" ");
  const evidence = [story.title, story.summary, ...story.sourceRecords.flatMap((source) => [source.title, source.excerpt, source.bodyText]), factEvidence].filter(Boolean).join(" ");
  const storyIdentity = `${story.title} ${story.summary ?? ""}`;
  assertPersonIdentityCoherence(story, factEvidence);
  if (MATCH_LIKE.test(storyIdentity)) { const detailClasses = [DATE_DETAIL.test(evidence), SCORE_DETAIL.test(evidence), VENUE_DETAIL.test(evidence), namedPeople(evidence).size > 0].filter(Boolean).length; if (usableFacts.length < 2 || detailClasses < 2) throw new Error(`Pre-generation evidence gate failed: match/trial story has ${usableFacts.length} usable substantive facts and ${detailClasses}/4 concrete match-detail classes; require at least 2 facts and 2 detail classes before OpenAI spend.`); if (COMPLETED_MATCH.test(storyIdentity) && !SCORE_DETAIL.test(factEvidence)) throw new Error("Pre-generation evidence gate failed: completed-match story has no final score in the usable fact ledger; do not ask the model or Publication Review to reconstruct basic match facts."); }
  if (SQUAD_SELECTION.test(storyIdentity) && namedPeople(factEvidence).size < 2) throw new Error(`Pre-generation evidence gate failed: squad/selection story has only ${namedPeople(factEvidence).size} named people in the usable fact ledger; require at least 2 before OpenAI spend.`);
}
function assertFinalSourceIntegrity(article: { sourceNotes?: FinalSourceNote[] }, story: RawStoryInput) { const notes = Array.isArray(article.sourceNotes) ? article.sourceNotes : []; const sourceById = new Map(story.sourceRecords.map((source) => [source.id, source])); const validNotes = notes.filter((note) => { const sourceId = String(note.sourceId ?? "").trim(); const publisher = String(note.publisher ?? "").trim(); const url = String(note.url ?? "").trim(); const source = sourceById.get(sourceId); return Boolean(source && publisher && /^https?:\/\//i.test(url) && String(source.publisher ?? "").trim().toLowerCase() === publisher.toLowerCase()); }); const publishers = new Set(validNotes.map((note) => String(note.publisher).trim().toLowerCase())); if (notes.length < 2 || validNotes.length !== notes.length || publishers.size < 2) throw new Error(`Final source-integrity gate failed: ${notes.length} source notes, ${validNotes.length} mapped to supplied evidence, ${publishers.size} distinct publishers; minimum is 2 valid notes from 2 publishers.`); }
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return jsonResponse({ error: "Unauthorized" }, { status: 401 });
  const requestId = crypto.randomUUID(); const startedAt = Date.now();
  try {
    const body = (await request.json()) as DraftRequest; if (!body.story || !body.factLedger) return jsonResponse({ error: "story and factLedger are required" }, { status: 400 });
    console.info("Editorial pipeline started", { requestId, inputId: body.story.id, dryRun: body.dryRun === true, qaMode: body.qaMode === true, notificationMode: body.notificationMode ?? "draft", styleProfileId: body.styleProfileId ?? null });
    assertPreGenerationEvidence(body.story, body.factLedger);
    const editorial = new EditorialBrain().evaluate(body.story, { factLedger: body.factLedger });
    console.info("Editorial Brain completed", { requestId, inputId: body.story.id, decision: editorial.decision, score: editorial.score.total, confidence: editorial.confidence, durationMs: Date.now() - startedAt });
    if (editorial.decision !== "draft") return jsonResponse({ status: editorial.decision, editorial, message: "No article was generated because the Editorial Brain did not approve this story for drafting." });
    process.env.OPENAI_EDITORIAL_MODEL ??= DEFAULT_GENERATION_MODEL; process.env.OPENAI_EDITORIAL_REVIEW_MODEL ??= DEFAULT_REVIEW_MODEL; process.env.OPENAI_EDITORIAL_REPAIR_MODEL ??= DEFAULT_REVIEW_MODEL;
    if (body.dryRun === true) { const sanity = await validateSanityConnectivity(editorial.category); return jsonResponse({ status: "dry-run-passed", editorial, checks: { authentication: true, requestShape: true, editorialBrain: true, editorialDecision: editorial.decision, preGenerationEvidence: true, openAiConfigured: Boolean(process.env.OPENAI_API_KEY), openAiModel: process.env.OPENAI_EDITORIAL_MODEL, reviewModel: process.env.OPENAI_EDITORIAL_REVIEW_MODEL, dailyAiBudgetUsd: 0.40, draftPipelineReservationUsd: DRAFT_PIPELINE_BUDGET_RESERVATION_USD, structuredSchemaConfigured: true, publicationReviewConfigured: true, contextualCardEnrichmentConfigured: true, sanity }, requestId }); }
    const budget = await reserveEditorialAiBudget({ requestId, purpose: body.qaMode === true ? `qa-draft:${body.story.id}` : `production-draft:${body.story.id}`, amountUsd: DRAFT_PIPELINE_BUDGET_RESERVATION_USD });
    console.info("Editorial AI budget reserved", { requestId, inputId: body.story.id, ...budget });
    const generatedArticle = await generateArticleDraft(body.story, editorial, { targetLengthWords: body.qaMode === true ? "250-400" : "700-1100", timeoutMs: EDITORIAL_GENERATION_TIMEOUT_MS, styleProfileId: body.styleProfileId });
    const { runPublicationReviewCycle } = await import("@/lib/editorial/PublicationReviewCycle");
    const publicationReview = await runPublicationReviewCycle(generatedArticle, editorial, body.story);
    const article = publicationReview.article; assertFinalSourceIntegrity(article, body.story); const pkg = { editorial, article };
    if (body.createSanityDraft === false) return jsonResponse({ status: "generated", ...pkg, publicationReview, budget, requestId });
    const sanityDraft = await createSanityArticleDraft(pkg, { editorialImageId: body.editorialImageId, story: body.story, automationContentClass: body.qaMode === true ? "qa" : "production", morningPackageEligible: body.qaMode !== true });
    let contextualCard: Awaited<ReturnType<typeof enrichSanityDraftWithContextualCard>> | { status: "failed"; error: string }; try { contextualCard = await enrichSanityDraftWithContextualCard(sanityDraft.id, pkg); } catch (error) { contextualCard = { status: "failed", error: error instanceof Error ? error.message : "Contextual card enrichment failed" }; console.warn("Contextual card enrichment failed", { requestId, inputId: body.story.id, error: contextualCard.error }); }
    const notification = body.qaMode === true
      ? { status: "suppressed" as const, eventId: null, reason: "qa-draft" }
      : body.notificationMode === "package"
        ? { status: "suppressed" as const, eventId: null, reason: "package-awaiting-mandatory-media" }
        : await notifyDraftCreated({ articleId: sanityDraft.id, articleTitle: article.title, actor: "editorial-automation", occurredAt: new Date().toISOString(), submissionNote: "A new draft is ready for editorial review." });
    console.info("Editorial pipeline completed", { requestId, inputId: body.story.id, sanityDraftId: sanityDraft.id, notificationStatus: notification.status, notificationEventId: notification.eventId, notificationReason: "reason" in notification ? notification.reason : null, morningPackageEligible: sanityDraft.morningPackageEligible, contextualCardStatus: contextualCard.status, publicationReviewCorrected: publicationReview.corrected, review1Issues: publicationReview.review1.issues.length, review2Issues: publicationReview.review2.issues.length, budgetReservedAfterUsd: budget.reservedAfterUsd, durationMs: Date.now() - startedAt });
    return jsonResponse({ status: "draft-created", editorial, article, publicationReview, sanityDraft, contextualCard, notification, budget, requestId });
  } catch (error) { console.error("Editorial draft pipeline failed", { requestId, durationMs: Date.now() - startedAt, error: error instanceof Error ? error.message : "Editorial draft pipeline failed" }); return jsonResponse({ error: error instanceof Error ? error.message : "Editorial draft pipeline failed", requestId }, { status: 500 }); }
}
