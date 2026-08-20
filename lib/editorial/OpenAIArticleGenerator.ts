import type { GeneratedArticleDraft } from "./ArticleDraftTypes";
import {
  getArticleStyleProfile,
  selectArticleStyleProfile,
  type ArticleStyleProfile,
  type ArticleStyleProfileId,
} from "./ArticleStyleProfile";
import { assessDraftQuality, DRAFT_READY_LIMITS, type DraftQualityReport } from "./DraftQualityGuard";
import type { EditorialBrainResult, RawStoryInput } from "./EditorialTypes";
import { assessArticleOriginality, type OriginalityReport } from "./OriginalityGuard";
import { RUGBY_PANDA_EDITORIAL_CHARTER } from "./PromptBuilder";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_TIMEOUT_MS = 45_000;
const MAX_GENERATION_ATTEMPTS = 3;
const MIN_RETRY_TIMEOUT_MS = 20_000;

const ARTICLE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "standfirst", "seoTitle", "seoDescription", "keyPoints", "body", "disclosure", "sourceNotes"],
  properties: {
    title: { type: "string" },
    standfirst: { type: "string" },
    seoTitle: { type: "string" },
    seoDescription: { type: "string" },
    keyPoints: { type: "array", minItems: 2, maxItems: 6, items: { type: "string" } },
    body: {
      type: "array",
      minItems: 1,
      maxItems: 7,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["heading", "paragraphs"],
        properties: {
          heading: { type: ["string", "null"] },
          paragraphs: { type: "array", minItems: 1, maxItems: 8, items: { type: "string" } },
        },
      },
    },
    disclosure: { type: "string" },
    sourceNotes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["sourceId", "publisher", "url", "usage"],
        properties: {
          sourceId: { type: "string" },
          publisher: { type: "string" },
          url: { type: "string" },
          usage: { type: "string" },
        },
      },
    },
  },
} as const;

type ResponsesPayload = {
  id?: string;
  model?: string;
  status?: string;
  error?: { message?: string } | null;
  incomplete_details?: { reason?: string } | null;
  usage?: { input_tokens?: number; output_tokens?: number; total_tokens?: number };
  output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string; refusal?: string }> }>;
};

type GenerateArticleOptions = {
  targetLengthWords?: string;
  timeoutMs?: number;
  styleProfileId?: ArticleStyleProfileId;
};

function sourceProvenance(story: RawStoryInput) {
  return story.sourceRecords.map((source) => ({
    sourceId: source.id,
    publisher: source.publisher,
    title: source.title,
    url: source.url,
    publishedAt: source.publishedAt,
    isPrimarySource: source.isPrimarySource === true,
  }));
}

function retryOverlapFragments(report?: OriginalityReport) {
  if (!report) return [];
  return report.findings
    .filter((finding) => finding.longestSharedRun > 11 && finding.longestSharedPhrase)
    .map((finding) => ({
      sourceId: finding.sourceId,
      publisher: finding.publisher,
      consecutiveWords: finding.longestSharedRun,
      phrase: finding.longestSharedPhrase,
    }));
}

function generationInput(
  story: RawStoryInput,
  editorial: EditorialBrainResult,
  targetLengthWords: string,
  style: ArticleStyleProfile,
  originalityFeedback?: OriginalityReport,
  qualityFeedback?: DraftQualityReport,
) {
  const overlapFragments = retryOverlapFragments(originalityFeedback);
  return JSON.stringify({
    assignment: editorial.brief,
    classification: {
      storyType: editorial.storyType,
      category: editorial.category,
      priority: editorial.priority,
      confidence: editorial.confidence,
      needsHumanFactCheck: editorial.needsHumanFactCheck,
    },
    evidence: {
      factLedger: editorial.factLedger,
      sourceProvenance: sourceProvenance(story),
      storyIdentity: { id: story.id, title: story.title },
      compositionBoundary: [
        "Treat the fact ledger as semantic evidence, not prose to imitate.",
        "Source excerpts and source body text are deliberately withheld from generation to reduce source-shaped phrasing.",
        "Use source provenance to understand which publishers support the evidence and to populate sourceNotes accurately.",
        "Do not echo fact-ledger claim wording when a natural independent sentence can express the same supported fact.",
      ],
    },
    editorialStyle: {
      profile: style.id,
      label: style.generationLabel,
      instructions: style.generationInstructions,
      presentationIntent: style.presentation,
      variationRules: [
        "Do not default to a fixed three-section article structure.",
        "The body may contain from one to seven sections according to the story and assigned style.",
        "A section heading may be null. Do not add a heading merely to satisfy a template.",
        "Vary paragraph and sentence length naturally; avoid symmetrical paragraph rhythm.",
        "Do not use the same headline construction, opening rhythm and conclusion pattern across stories.",
        "Avoid stacked metaphors, slogan-like fragments, generic clever-sounding conclusions and repeated rhetorical contrasts.",
        "Use figurative language sparingly. Prefer precise rugby reporting to laboratory/platform/driver/gears-style metaphor chains.",
        "Key points are editorial metadata; do not turn them into a repeated reader-facing formula inside the body.",
      ],
    },
    ...(originalityFeedback ? {
      originalityRetry: {
        instruction: [
          "The previous draft was rejected by the deterministic originality gate. Recompose the article independently from the semantic evidence; do not merely edit the rejected wording.",
          "For every listed overlap fragment, do not reproduce that phrase as one contiguous sequence. Preserve supported names and facts, but split long name/fact lists across sentences, alter their order where meaning allows, and use independent sentence construction.",
          "The deterministic thresholds remain unchanged, so the replacement must genuinely clear the gate.",
        ],
        reasons: originalityFeedback.reasons,
        overlapFragments,
      },
    } : {}),
    ...(qualityFeedback ? {
      draftReadyRetry: {
        instruction: "The previous draft failed deterministic Draft Ready checks. Rewrite the affected fields or paragraphs while preserving supported facts, the assigned style and original composition. Clear every listed issue; do not merely truncate text mid-sentence.",
        issues: qualityFeedback.issues,
      },
    } : {}),
    requirements: {
      originalComposition: true,
      preserveUncertainty: true,
      targetLengthWords,
      useOnlySupportedClaims: true,
      synthesizeAcrossAllAvailableSources: true,
      compareAndReconcileSources: true,
      preferPrimarySourcesForHardFacts: true,
      useReputableSecondarySourcesForContextAndAnalysis: true,
      doNotStructureArticleAsASourceBySourceSummary: true,
      produceAddedEditorialValueBeyondAnySingleSource: true,
      concreteRugbyDetail: true,
      nameSupportedPeopleAndTeams: true,
      previewStoriesNeedWhatToWatch: true,
      noReaderFacingEditorialProcess: true,
      draftReadyRules: [
        `Headline must be ${DRAFT_READY_LIMITS.headlineCharacters} characters or fewer.`,
        `Standfirst must be ${DRAFT_READY_LIMITS.standfirstCharacters} characters or fewer.`,
        `SEO title must be ${DRAFT_READY_LIMITS.seoTitleCharacters} characters or fewer.`,
        `SEO description must be ${DRAFT_READY_LIMITS.seoDescriptionCharacters} characters or fewer.`,
        `Every body paragraph must be ${DRAFT_READY_LIMITS.paragraphWords} words or fewer.`,
        "Avoid filler words such as just, simply, really, clearly, obviously, basically and actually; never repeat one as a verbal tic.",
        "Qualify tactical projections and causal analysis with can, could, may, likely or similar language when the outcome is not an established fact.",
        "Use concrete, verifiable rugby detail only when supported by the fact ledger. Never invent statistics, targets, quotes or historical comparisons to sound authoritative.",
        "Prefer precise rugby terminology over decorative metaphor. Avoid multiple metaphors in the same passage.",
      ],
      originalityRules: [
        "Write independently from the evidence. Do not rewrite or lightly paraphrase any source article.",
        "Do not follow a source's sentence order, paragraph order, rhetorical structure or distinctive phrasing.",
        "Never copy a source sentence. Avoid using eight or more consecutive words from any source except unavoidable proper names or official competition/team titles.",
        "Facts may be the same; expression, analysis, structure and transitions must be original Rugby Panda composition.",
        "Synthesize facts from different publishers into a new reader-focused argument and add supported implications or what-to-watch analysis.",
      ],
      disclosureInstruction: "INTERNAL EDITOR NOTE ONLY: briefly list anything that still needs checking. Never repeat this disclosure or any editorial-process explanation in the article body, headline, standfirst, SEO fields or key points.",
    },
  });
}

function extractOutputText(payload: ResponsesPayload): string | undefined {
  for (const item of payload.output ?? []) {
    if (item.type !== "message") continue;
    for (const part of item.content ?? []) {
      if (part.type === "output_text" && part.text) return part.text;
      if (part.type === "refusal" && part.refusal) throw new Error(`OpenAI refused article generation: ${part.refusal}`);
    }
  }
  return undefined;
}

function rawStoryOriginalityText(story: RawStoryInput): string {
  return [story.title, story.summary, story.bodyText].filter(Boolean).join("\n\n");
}

function parseGeneratedArticle(payload: ResponsesPayload): GeneratedArticleDraft {
  if (payload.status === "failed") throw new Error(`OpenAI generation failed: ${payload.error?.message ?? "unknown error"}`);
  if (payload.status === "incomplete") throw new Error(`OpenAI generation was incomplete: ${payload.incomplete_details?.reason ?? "unknown reason"}`);
  const outputText = extractOutputText(payload);
  if (!outputText) throw new Error("OpenAI returned no structured article output in the response output array.");
  try {
    return JSON.parse(outputText) as GeneratedArticleDraft;
  } catch (error) {
    throw new Error(`OpenAI returned invalid structured article JSON: ${error instanceof Error ? error.message : "parse failed"}`);
  }
}

export async function generateArticleDraft(
  story: RawStoryInput,
  editorial: EditorialBrainResult,
  options: GenerateArticleOptions = {},
): Promise<GeneratedArticleDraft> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

  const timeoutMs = Math.min(Math.max(options.timeoutMs ?? DEFAULT_TIMEOUT_MS, 5_000), 110_000);
  const startedAt = Date.now();
  const style = options.styleProfileId ? getArticleStyleProfile(options.styleProfileId) : selectArticleStyleProfile(story.id, editorial.storyType);
  const targetLengthWords = options.targetLengthWords ?? "700-1100";
  const rawStoryMaterial = rawStoryOriginalityText(story);
  let originalityFeedback: OriginalityReport | undefined;
  let qualityFeedback: DraftQualityReport | undefined;

  for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const remainingMs = timeoutMs - (Date.now() - startedAt);
    if (remainingMs < MIN_RETRY_TIMEOUT_MS) {
      const failures = [
        ...(originalityFeedback?.reasons ?? []),
        ...(qualityFeedback?.issues.map((issue) => issue.message) ?? []),
      ];
      if (failures.length > 0) throw new Error(`Draft Ready gate rejected draft after ${attempt - 1} attempt(s): ${failures.join(" ")}`);
      throw new Error(`OpenAI generation exceeded the ${Math.round(timeoutMs / 1000)}-second safety timeout.`);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), remainingMs);
    const attemptStartedAt = Date.now();

    try {
      console.info("Editorial OpenAI generation started", {
        inputId: editorial.inputId,
        model: process.env.OPENAI_EDITORIAL_MODEL ?? "gpt-5",
        targetLengthWords,
        timeoutMs: remainingMs,
        styleProfile: style.id,
        attempt,
        sourceProseIncluded: false,
        draftReadyRetry: Boolean(qualityFeedback),
      });

      const response = await fetch(OPENAI_RESPONSES_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: process.env.OPENAI_EDITORIAL_MODEL ?? "gpt-5",
          store: false,
          instructions: RUGBY_PANDA_EDITORIAL_CHARTER,
          input: generationInput(story, editorial, targetLengthWords, style, originalityFeedback, qualityFeedback),
          text: { format: { type: "json_schema", name: "rugby_panda_article_draft", strict: true, schema: ARTICLE_SCHEMA } },
        }),
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(`OpenAI generation failed (${response.status}): ${details.slice(0, 500)}`);
      }

      const payload = (await response.json()) as ResponsesPayload;
      console.info("Editorial OpenAI generation completed", {
        inputId: editorial.inputId,
        responseId: payload.id,
        model: payload.model,
        status: payload.status,
        durationMs: Date.now() - attemptStartedAt,
        totalDurationMs: Date.now() - startedAt,
        usage: payload.usage,
        styleProfile: style.id,
        attempt,
      });

      const article = parseGeneratedArticle(payload);
      const originality = assessArticleOriginality(
        article,
        story.sourceRecords,
        rawStoryMaterial ? [{ id: `${story.id}:raw-story-material`, publisher: "Acquired story material", text: rawStoryMaterial }] : [],
      );
      const quality = assessDraftQuality(article);
      console.info("Editorial Draft Ready checks completed", {
        inputId: editorial.inputId,
        originalityPassed: originality.passed,
        qualityPassed: quality.passed,
        originalityFindings: originality.findings,
        qualityIssues: quality.issues,
        styleProfile: style.id,
        attempt,
      });

      if (originality.passed && quality.passed) return article;
      originalityFeedback = originality.passed ? undefined : originality;
      qualityFeedback = quality.passed ? undefined : quality;

      if (attempt === MAX_GENERATION_ATTEMPTS) {
        const failures = [
          ...(originalityFeedback?.reasons ?? []),
          ...(qualityFeedback?.issues.map((issue) => issue.message) ?? []),
        ];
        throw new Error(`Draft Ready gate rejected draft after ${attempt} attempt(s): ${failures.join(" ")}`);
      }

      console.warn("Editorial Draft Ready retry scheduled", {
        inputId: editorial.inputId,
        styleProfile: style.id,
        attempt,
        originalityReasons: originalityFeedback?.reasons ?? [],
        overlapFragments: retryOverlapFragments(originalityFeedback),
        qualityIssues: qualityFeedback?.issues ?? [],
        remainingMs: timeoutMs - (Date.now() - startedAt),
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") throw new Error(`OpenAI generation exceeded the ${Math.round(timeoutMs / 1000)}-second safety timeout.`);
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error("OpenAI generation failed before producing a Draft Ready article.");
}
