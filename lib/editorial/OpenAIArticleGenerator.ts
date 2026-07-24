import type { GeneratedArticleDraft } from "./ArticleDraftTypes";
import type { EditorialBrainResult, RawStoryInput } from "./EditorialTypes";
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
    keyPoints: { type: "array", minItems: 3, maxItems: 6, items: { type: "string" } },
    body: {
      type: "array",
      minItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["heading", "paragraphs"],
        properties: {
          heading: { type: ["string", "null"] },
          paragraphs: { type: "array", minItems: 1, items: { type: "string" } },
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

function generationInput(story: RawStoryInput, editorial: EditorialBrainResult, targetLengthWords: string) {
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
    requirements: {
      originalComposition: true,
      humanApprovalRequired: true,
      preserveUncertainty: true,
      targetLengthWords,
      useOnlySupportedClaims: true,
      disclosureInstruction: "State briefly what remains unconfirmed or requires the human editor's check. Do not add an AI disclosure.",
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

export async function generateArticleDraft(
  story: RawStoryInput,
  editorial: EditorialBrainResult,
  options: GenerateArticleOptions = {},
): Promise<GeneratedArticleDraft> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

  const timeoutMs = Math.min(Math.max(options.timeoutMs ?? DEFAULT_TIMEOUT_MS, 5_000), 50_000);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();

  try {
    console.info("Editorial OpenAI generation started", {
      inputId: editorial.inputId,
      model: process.env.OPENAI_EDITORIAL_MODEL ?? "gpt-5",
      targetLengthWords: options.targetLengthWords ?? "700-1100",
      timeoutMs,
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
        input: generationInput(story, editorial, options.targetLengthWords ?? "700-1100"),
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
    });

    if (payload.status === "failed") {
      throw new Error(`OpenAI generation failed: ${payload.error?.message ?? "unknown error"}`);
    }
    if (payload.status === "incomplete") {
      throw new Error(`OpenAI generation was incomplete: ${payload.incomplete_details?.reason ?? "unknown reason"}`);
    }

    const outputText = extractOutputText(payload);
    if (!outputText) throw new Error("OpenAI returned no structured article output in the response output array.");

    try {
      return JSON.parse(outputText) as GeneratedArticleDraft;
    } catch (error) {
      throw new Error(`OpenAI returned invalid structured article JSON: ${error instanceof Error ? error.message : "parse failed"}`);
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`OpenAI generation exceeded the ${Math.round(timeoutMs / 1000)}-second safety timeout.`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
