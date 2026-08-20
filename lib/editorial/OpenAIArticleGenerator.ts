import type { GeneratedArticleDraft } from "./ArticleDraftTypes";
import type { EditorialBrainResult, RawStoryInput } from "./EditorialTypes";
import { assessArticleOriginality } from "./OriginalityGuard";
import { RUGBY_PANDA_EDITORIAL_CHARTER } from "./PromptBuilder";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_TIMEOUT_MS = 45_000;

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
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
      refusal?: string;
    }>;
  }>;
};

type GenerateArticleOptions = {
  targetLengthWords?: string;
  timeoutMs?: number;
};

type StyleProfile = {
  id: string;
  instructions: string[];
};

const STYLE_PROFILES: StyleProfile[] = [
  {
    id: "news-desk",
    instructions: [
      "Use a crisp news-led opening that delivers the development immediately.",
      "Prefer short-to-medium paragraphs and restrained analysis after the core facts.",
      "Use no more than two subheadings; omit them entirely if the story flows better without them.",
      "Use a direct factual headline rather than a colon-led or question headline.",
    ],
  },
  {
    id: "analyst",
    instructions: [
      "Open with the consequence or rugby significance rather than simply repeating the announcement.",
      "Build an analytical narrative with fewer, longer sections and deeper paragraphs.",
      "Use descriptive subheadings only where they genuinely change the argument.",
      "Finish on the implication, selection battle or tactical question supporters should watch.",
    ],
  },
  {
    id: "match-notebook",
    instructions: [
      "Write with the pace of a rugby correspondent's notebook: concrete detail first, context woven through it.",
      "Mix short punchy paragraphs with occasional longer explanatory paragraphs.",
      "Use several brief sections only when they help separate distinct talking points.",
      "Avoid a generic summary conclusion; end on a specific player, contest, fixture or unresolved question.",
    ],
  },
  {
    id: "feature",
    instructions: [
      "Use a scene-setting or context-led opening before revealing the central argument naturally.",
      "Prefer flowing prose and minimal subheadings; one substantial section with several paragraphs is acceptable.",
      "Vary paragraph length and sentence cadence noticeably.",
      "Use a more character- or narrative-led headline while remaining accurate and unsensational.",
    ],
  },
  {
    id: "supporter-preview",
    instructions: [
      "Frame the story around what supporters should notice next and why it matters.",
      "Use an energetic but credible opening and concrete names, combinations, selection calls or fixtures.",
      "Use two to four useful subheadings if the story contains distinct watch-points, but do not force symmetry.",
      "End with a forward-looking observation rather than restating the introduction.",
    ],
  },
];

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function styleProfileFor(story: RawStoryInput): StyleProfile {
  return STYLE_PROFILES[stableHash(story.id) % STYLE_PROFILES.length];
}

function generationInput(story: RawStoryInput, editorial: EditorialBrainResult, targetLengthWords: string, style: StyleProfile) {
  return JSON.stringify({
    assignment: editorial.brief,
    classification: {
      storyType: editorial.storyType,
      category: editorial.category,
      priority: editorial.priority,
      confidence: editorial.confidence,
      needsHumanFactCheck: editorial.needsHumanFactCheck,
    },
    factLedger: editorial.factLedger,
    sources: story.sourceRecords,
    sourceMaterial: {
      title: story.title,
      summary: story.summary,
      bodyText: story.bodyText,
    },
    editorialStyle: {
      profile: style.id,
      instructions: style.instructions,
      variationRules: [
        "Do not default to a fixed three-section article structure.",
        "The body may contain from one to seven sections according to the story and assigned style.",
        "A section heading may be null. Do not add a heading merely to satisfy a template.",
        "Vary paragraph length naturally. Do not make every section contain the same number of paragraphs.",
        "Do not use the same headline construction, opening rhythm and conclusion pattern across stories.",
        "Key points are editorial metadata; do not turn them into a repeated reader-facing formula inside the body.",
      ],
    },
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
      if (part.type === "refusal" && part.refusal) {
        throw new Error(`OpenAI refused article generation: ${part.refusal}`);
      }
    }
  }
  return undefined;
}

function rawStoryOriginalityText(story: RawStoryInput): string {
  return [story.title, story.summary, story.bodyText].filter(Boolean).join("\n\n");
}

export async function generateArticleDraft(
  story: RawStoryInput,
  editorial: EditorialBrainResult,
  options: GenerateArticleOptions = {},
): Promise<GeneratedArticleDraft> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

  const timeoutMs = Math.min(Math.max(options.timeoutMs ?? DEFAULT_TIMEOUT_MS, 5_000), 110_000);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();
  const style = styleProfileFor(story);

  try {
    console.info("Editorial OpenAI generation started", {
      inputId: editorial.inputId,
      model: process.env.OPENAI_EDITORIAL_MODEL ?? "gpt-5",
      targetLengthWords: options.targetLengthWords ?? "700-1100",
      timeoutMs,
      styleProfile: style.id,
    });

    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_EDITORIAL_MODEL ?? "gpt-5",
        store: false,
        instructions: RUGBY_PANDA_EDITORIAL_CHARTER,
        input: generationInput(story, editorial, options.targetLengthWords ?? "700-1100", style),
        text: {
          format: {
            type: "json_schema",
            name: "rugby_panda_article_draft",
            strict: true,
            schema: ARTICLE_SCHEMA,
          },
        },
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
      durationMs: Date.now() - startedAt,
      usage: payload.usage,
      styleProfile: style.id,
    });

    if (payload.status === "failed") {
      throw new Error(`OpenAI generation failed: ${payload.error?.message ?? "unknown error"}`);
    }
    if (payload.status === "incomplete") {
      throw new Error(`OpenAI generation was incomplete: ${payload.incomplete_details?.reason ?? "unknown reason"}`);
    }

    const outputText = extractOutputText(payload);
    if (!outputText) throw new Error("OpenAI returned no structured article output in the response output array.");

    let article: GeneratedArticleDraft;
    try {
      article = JSON.parse(outputText) as GeneratedArticleDraft;
    } catch (error) {
      throw new Error(`OpenAI returned invalid structured article JSON: ${error instanceof Error ? error.message : "parse failed"}`);
    }

    const rawStoryMaterial = rawStoryOriginalityText(story);
    const originality = assessArticleOriginality(
      article,
      story.sourceRecords,
      rawStoryMaterial
        ? [{ id: `${story.id}:raw-story-material`, publisher: "Acquired story material", text: rawStoryMaterial }]
        : [],
    );
    console.info("Editorial originality check completed", {
      inputId: editorial.inputId,
      passed: originality.passed,
      findings: originality.findings,
      styleProfile: style.id,
    });
    if (!originality.passed) {
      throw new Error(`Originality gate rejected draft: ${originality.reasons.join(" ")}`);
    }

    return article;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`OpenAI generation exceeded the ${Math.round(timeoutMs / 1000)}-second safety timeout.`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
