import type { GeneratedArticleDraft } from "./ArticleDraftTypes";
import { assessDraftQuality } from "./DraftQualityGuard";
import type { EditorialBrainResult, RawStoryInput } from "./EditorialTypes";
import { assessArticleOriginality } from "./OriginalityGuard";
import { RUGBY_PANDA_EDITORIAL_CHARTER } from "./PromptBuilder";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const REVIEW_MODEL = process.env.OPENAI_EDITORIAL_REVIEW_MODEL ?? "gpt-5-mini";
const REVIEW_TIMEOUT_MS = 25_000;
const CORRECTION_TIMEOUT_MS = 35_000;
const STANDFIRST_LIMIT = 220;
const SEO_TITLE_LIMIT = 60;
const SEO_DESCRIPTION_LIMIT = 160;

export type PublicationReviewSeverity = "critical" | "high" | "medium" | "low";
export type PublicationReviewIssue = {
  severity: PublicationReviewSeverity;
  category: "facts" | "originality" | "structure" | "style" | "formatting" | "clarity" | "rugby-value";
  message: string;
  recommendation: string;
};

export type PublicationReview = {
  verdict: "pass" | "revise";
  issues: PublicationReviewIssue[];
  strengths: string[];
};

export type PublicationReviewCycleResult = {
  article: GeneratedArticleDraft;
  review1: PublicationReview;
  review2: PublicationReview;
  corrected: boolean;
};

const REVIEW_SCHEMA = {
  type: "object", additionalProperties: false, required: ["verdict", "issues", "strengths"],
  properties: {
    verdict: { type: "string", enum: ["pass", "revise"] },
    issues: { type: "array", maxItems: 12, items: { type: "object", additionalProperties: false, required: ["severity", "category", "message", "recommendation"], properties: { severity: { type: "string", enum: ["critical", "high", "medium", "low"] }, category: { type: "string", enum: ["facts", "originality", "structure", "style", "formatting", "clarity", "rugby-value"] }, message: { type: "string" }, recommendation: { type: "string" } } } },
    strengths: { type: "array", maxItems: 6, items: { type: "string" } },
  },
} as const;

const ARTICLE_SCHEMA = {
  type: "object", additionalProperties: false, required: ["title", "standfirst", "seoTitle", "seoDescription", "keyPoints", "body", "disclosure", "sourceNotes"],
  properties: {
    title: { type: "string" }, standfirst: { type: "string" }, seoTitle: { type: "string" }, seoDescription: { type: "string" },
    keyPoints: { type: "array", minItems: 2, maxItems: 6, items: { type: "string" } },
    body: { type: "array", minItems: 1, maxItems: 7, items: { type: "object", additionalProperties: false, required: ["heading", "paragraphs"], properties: { heading: { type: ["string", "null"] }, paragraphs: { type: "array", minItems: 1, maxItems: 8, items: { type: "string" } } } } },
    disclosure: { type: "string" },
    sourceNotes: { type: "array", items: { type: "object", additionalProperties: false, required: ["sourceId", "publisher", "url", "usage"], properties: { sourceId: { type: "string" }, publisher: { type: "string" }, url: { type: "string" }, usage: { type: "string" } } } },
  },
} as const;

type ResponsesPayload = { status?: string; error?: { message?: string } | null; incomplete_details?: { reason?: string } | null; output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string; refusal?: string }> }>; usage?: { input_tokens?: number; output_tokens?: number; total_tokens?: number } };

function outputText(payload: ResponsesPayload): string {
  if (payload.status === "failed") throw new Error(`Publication review failed: ${payload.error?.message ?? "unknown error"}`);
  if (payload.status === "incomplete") throw new Error(`Publication review incomplete: ${payload.incomplete_details?.reason ?? "unknown reason"}`);
  for (const item of payload.output ?? []) { if (item.type !== "message") continue; for (const part of item.content ?? []) { if (part.type === "refusal" && part.refusal) throw new Error(`Publication review refused: ${part.refusal}`); if (part.type === "output_text" && part.text) return part.text; } }
  throw new Error("Publication review returned no structured output.");
}

async function structuredCall<T>(input: string, schema: object, name: string, timeoutMs = REVIEW_TIMEOUT_MS): Promise<{ value: T; usage?: ResponsesPayload["usage"] }> {
  const apiKey = process.env.OPENAI_API_KEY; if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(OPENAI_RESPONSES_URL, { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, signal: controller.signal, body: JSON.stringify({ model: REVIEW_MODEL, store: false, instructions: RUGBY_PANDA_EDITORIAL_CHARTER, input, text: { format: { type: "json_schema", name, strict: true, schema } } }) });
    if (!response.ok) throw new Error(`Publication review API failed (${response.status}): ${(await response.text()).slice(0, 500)}`);
    const payload = (await response.json()) as ResponsesPayload; return { value: JSON.parse(outputText(payload)) as T, usage: payload.usage };
  } finally { clearTimeout(timeout); }
}

function reviewInput(article: GeneratedArticleDraft, editorial: EditorialBrainResult, story: RawStoryInput, pass: 1 | 2) {
  return JSON.stringify({ assignment: `Publication Review #${pass} for a Rugby Panda draft. Judge whether it is genuinely ready for the owner to read.`, article, editorialBrief: editorial.brief, factLedger: editorial.factLedger, sourceProvenance: story.sourceRecords.map(({ id, publisher, title, url, publishedAt, isPrimarySource }) => ({ id, publisher, title, url, publishedAt, isPrimarySource })), winningKeys: ["diversity of angle and structure", "original synthesis rather than source-shaped rewriting", "genuine rugby curiosity", "facts grounded in supported stats, datapoints and names", "useful tactical or strategic rugby insight where evidence supports it", "natural human newsroom voice", "a unique reason for this article to exist"], hardRules: ["No invented facts, numbers, quotes or causal claims.", "No raw or escaped Markdown markers.", "No generic headings such as Why this matters now, What you need to know, The bigger picture or What happens next.", "The opening starts with the story itself.", "Do not reward verbosity, formulaic sectioning, repetitive bolding, generic conclusions or AI-sounding rhetorical patterns.", "Only critical/high issues block publication readiness. Medium/low observations should be specific and genuinely useful, not stylistic nitpicking."] });
}

function correctionInput(article: GeneratedArticleDraft, review: PublicationReview, editorial: EditorialBrainResult) {
  return JSON.stringify({ assignment: "Make one bounded publication-quality correction pass. Return the complete corrected article.", article, reviewIssues: review.issues, factLedger: editorial.factLedger, constraints: ["Fix every critical/high issue and worthwhile medium issue without turning the article into a different story.", "Use only supported facts in the fact ledger; introduce no new names, numbers, quotes or claims.", "Preserve originality and the article's assigned editorial identity.", "Prefer natural prose changes over adding headings, lists, bold markers or explanatory boilerplate.", "Generated strings are structured plain text, not Markdown.", "Do not add Why this matters now, What you need to know, The bigger picture or What happens next headings.", "Keep sourceNotes and internal disclosure accurate.", `Hard metadata limits: standfirst <=${STANDFIRST_LIMIT}, SEO title <=${SEO_TITLE_LIMIT}, SEO description <=${SEO_DESCRIPTION_LIMIT} characters.`] });
}

function blockingIssues(review: PublicationReview) { return review.issues.filter((issue) => issue.severity === "critical" || issue.severity === "high"); }
function rawStoryMaterial(story: RawStoryInput) { return [story.title, story.summary, story.bodyText].filter(Boolean).join("\n\n"); }
function clipAtWordBoundary(value: string, max: number) { if (value.length <= max) return value; const clipped = value.slice(0, max + 1); const boundary = clipped.lastIndexOf(" "); return clipped.slice(0, boundary > Math.floor(max * 0.65) ? boundary : max).replace(/[,:;\-–—\s]+$/u, "").trim(); }
function repairReviewMetadata(article: GeneratedArticleDraft): GeneratedArticleDraft { return { ...article, standfirst: clipAtWordBoundary(article.standfirst, STANDFIRST_LIMIT), seoTitle: clipAtWordBoundary(article.seoTitle, SEO_TITLE_LIMIT), seoDescription: clipAtWordBoundary(article.seoDescription, SEO_DESCRIPTION_LIMIT) }; }

function assertDeterministicGates(article: GeneratedArticleDraft, story: RawStoryInput) {
  const quality = assessDraftQuality(article);
  const originality = assessArticleOriginality(article, story.sourceRecords, rawStoryMaterial(story) ? [{ id: `${story.id}:raw-story-material`, publisher: "Acquired story material", text: rawStoryMaterial(story) }] : []);
  if (!quality.passed || !originality.passed) throw new Error(`Post-review deterministic gate failed: ${[...quality.issues.map((issue) => issue.message), ...originality.reasons].join(" ")}`);
}

export async function runPublicationReviewCycle(article: GeneratedArticleDraft, editorial: EditorialBrainResult, story: RawStoryInput): Promise<PublicationReviewCycleResult> {
  const first = await structuredCall<PublicationReview>(reviewInput(article, editorial, story, 1), REVIEW_SCHEMA, "rugby_panda_publication_review_1");
  const review1 = first.value; const needsCorrection = review1.verdict === "revise" || blockingIssues(review1).length > 0;
  let correctedArticle = article;
  if (needsCorrection) { const correction = await structuredCall<GeneratedArticleDraft>(correctionInput(article, review1, editorial), ARTICLE_SCHEMA, "rugby_panda_publication_correction", CORRECTION_TIMEOUT_MS); correctedArticle = repairReviewMetadata(correction.value); assertDeterministicGates(correctedArticle, story); }
  const second = await structuredCall<PublicationReview>(reviewInput(correctedArticle, editorial, story, 2), REVIEW_SCHEMA, "rugby_panda_publication_review_2");
  const review2 = second.value; const blocking = blockingIssues(review2); if (blocking.length > 0) throw new Error(`Publication Review #2 rejected article: ${blocking.map((issue) => `${issue.category}: ${issue.message}`).join(" ")}`);
  correctedArticle = repairReviewMetadata(correctedArticle); assertDeterministicGates(correctedArticle, story);
  console.info("Publication review cycle completed", { inputId: editorial.inputId, model: REVIEW_MODEL, corrected: needsCorrection, review1Issues: review1.issues.length, review1Blocking: blockingIssues(review1).length, review2Issues: review2.issues.length, review2Blocking: blocking.length, review1Usage: first.usage, review2Usage: second.usage });
  return { article: correctedArticle, review1, review2, corrected: needsCorrection };
}
