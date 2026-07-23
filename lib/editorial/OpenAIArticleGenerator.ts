import type { GeneratedArticleDraft } from "./ArticleDraftTypes";
import type { EditorialBrainResult, RawStoryInput } from "./EditorialTypes";
import { buildEditorialSystemPrompt } from "./PromptBuilder";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

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

function generationInput(story: RawStoryInput, editorial: EditorialBrainResult) {
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
      targetLengthWords: "700-1100",
      useOnlySupportedClaims: true,
    },
  });
}

export async function generateArticleDraft(
  story: RawStoryInput,
  editorial: EditorialBrainResult,
): Promise<GeneratedArticleDraft> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_EDITORIAL_MODEL ?? "gpt-5",
      store: false,
      instructions: buildEditorialSystemPrompt(),
      input: generationInput(story, editorial),
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

  const payload = (await response.json()) as { output_text?: string };
  if (!payload.output_text) throw new Error("OpenAI returned no structured article output.");

  return JSON.parse(payload.output_text) as GeneratedArticleDraft;
}
