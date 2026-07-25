import {
  buildEditorialDnaPrompt,
  calculateWeightedEditorialScore,
  editorialScoreStatus,
  type EditorialScorecard,
} from "./EditorialDna";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_TIMEOUT_MS = 45_000;

export type AiEditorialFindingSeverity = "blocking" | "warning" | "suggestion";
export type AiEditorialFindingCategory =
  | "spelling"
  | "grammar"
  | "awkward-phrasing"
  | "unsupported-claim"
  | "speculation-presented-as-fact"
  | "readability"
  | "seo"
  | "headline"
  | "standfirst"
  | "rugby-voice"
  | "originality";

export type AiEditorialFinding = {
  severity: AiEditorialFindingSeverity;
  category: AiEditorialFindingCategory;
  message: string;
  excerpt: string;
  recommendation: string;
};

export type AiEditorialReview = {
  findings: AiEditorialFinding[];
  scorecard: EditorialScorecard;
};

export type AiEditorialReviewInput = {
  title: string;
  standfirst: string;
  bodyText: string;
  seoTitle: string;
  seoDescription: string;
  sourceRecords: Array<{ id?: string; title?: string; publisher?: string; url?: string }>;
  factLedger: {
    facts: Array<{ id?: string; claim?: string; status?: string; confidence?: number; usableInDraft?: boolean }>;
    unsupportedClaims: string[];
    conflicts: string[];
  };
};

const categoryScoreSchema = {
  type: "object",
  additionalProperties: false,
  required: ["score", "explanation", "findings"],
  properties: {
    score: { type: "integer", minimum: 0, maximum: 100 },
    explanation: { type: "string" },
    findings: { type: "array", items: { type: "string" } },
  },
} as const;

const EDITORIAL_REVIEW_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["findings", "scorecard"],
  properties: {
    findings: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["severity", "category", "message", "excerpt", "recommendation"],
        properties: {
          severity: { type: "string", enum: ["blocking", "warning", "suggestion"] },
          category: {
            type: "string",
            enum: [
              "spelling",
              "grammar",
              "awkward-phrasing",
              "unsupported-claim",
              "speculation-presented-as-fact",
              "readability",
              "seo",
              "headline",
              "standfirst",
              "rugby-voice",
              "originality",
            ],
          },
          message: { type: "string" },
          excerpt: { type: "string" },
          recommendation: { type: "string" },
        },
      },
    },
    scorecard: {
      type: "object",
      additionalProperties: false,
      required: [
        "accuracy",
        "grammar",
        "readability",
        "seo",
        "rugbyVoice",
        "originality",
        "summary",
        "accuracyNotice",
      ],
      properties: {
        accuracy: categoryScoreSchema,
        grammar: categoryScoreSchema,
        readability: categoryScoreSchema,
        seo: categoryScoreSchema,
        rugbyVoice: categoryScoreSchema,
        originality: categoryScoreSchema,
        summary: { type: "string" },
        accuracyNotice: { type: "string" },
      },
    },
  },
} as const;

type RawScorecard = Omit<EditorialScorecard, "overall" | "status">;

type ResponsesPayload = {
  status?: string;
  error?: { message?: string } | null;
  incomplete_details?: { reason?: string } | null;
  output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string; refusal?: string }> }>;
};

function extractOutputText(payload: ResponsesPayload): string | undefined {
  for (const item of payload.output ?? []) {
    if (item.type !== "message") continue;
    for (const part of item.content ?? []) {
      if (part.type === "output_text" && part.text) return part.text;
      if (part.type === "refusal" && part.refusal) {
        throw new Error(`OpenAI refused editorial review: ${part.refusal}`);
      }
    }
  }
  return undefined;
}

function normaliseReview(review: { findings: AiEditorialFinding[]; scorecard: RawScorecard }): AiEditorialReview {
  const overall = calculateWeightedEditorialScore(review.scorecard);
  return {
    findings: review.findings,
    scorecard: {
      ...review.scorecard,
      overall,
      status: editorialScoreStatus(overall),
    },
  };
}

export async function runAiEditorialReview(input: AiEditorialReviewInput): Promise<AiEditorialReview> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_EDITORIAL_REVIEW_MODEL ?? process.env.OPENAI_EDITORIAL_MODEL ?? "gpt-5",
        store: false,
        instructions: [
          "You are the meticulous Irish-English editorial reviewer for The Rugby Panda.",
          buildEditorialDnaPrompt(),
          "Return only the requested JSON schema. Do not rewrite or modify the article.",
          "Score Accuracy, Grammar, Readability, SEO, Rugby Voice and Originality independently from 0 to 100.",
          "Accuracy carries the greatest importance. Do not present the score as proof of independent factual verification.",
          "For accuracy, distinguish supported facts, apparent internal consistency and facts requiring human verification.",
          "Use blocking only for a material factual-support or misleading-certainty concern; warning for clear editorial errors; suggestion for improvements.",
          "Compare article copy only with the supplied fact ledger and source records. Do not invent missing facts.",
          "Keep excerpts short, explanations concise and recommendations actionable. Return an empty findings array when no findings are warranted.",
        ].join("\n"),
        input: JSON.stringify(input),
        text: {
          format: {
            type: "json_schema",
            name: "rugby_panda_ai_editorial_review",
            strict: true,
            schema: EDITORIAL_REVIEW_SCHEMA,
          },
        },
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`OpenAI editorial review failed (${response.status}): ${details.slice(0, 500)}`);
    }

    const payload = (await response.json()) as ResponsesPayload;
    if (payload.status === "failed") throw new Error(`OpenAI editorial review failed: ${payload.error?.message ?? "unknown error"}`);
    if (payload.status === "incomplete") throw new Error(`OpenAI editorial review was incomplete: ${payload.incomplete_details?.reason ?? "unknown reason"}`);
    const outputText = extractOutputText(payload);
    if (!outputText) throw new Error("OpenAI returned no structured editorial review output.");

    try {
      return normaliseReview(JSON.parse(outputText) as { findings: AiEditorialFinding[]; scorecard: RawScorecard });
    } catch (error) {
      throw new Error(`OpenAI returned invalid structured editorial review JSON: ${error instanceof Error ? error.message : "parse failed"}`);
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("OpenAI editorial review exceeded the 45-second safety timeout.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
