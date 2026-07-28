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
  | "originality"
  | "ai-likeness";

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
  voiceAssessment: {
    aiLikeness: "low" | "moderate" | "high";
    rugbyPandaTone: "strong-match" | "partial-match" | "weak-match";
    explanation: string;
  };
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
  required: ["findings", "scorecard", "voiceAssessment"],
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
              "ai-likeness",
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
    voiceAssessment: {
      type: "object",
      additionalProperties: false,
      required: ["aiLikeness", "rugbyPandaTone", "explanation"],
      properties: {
        aiLikeness: { type: "string", enum: ["low", "moderate", "high"] },
        rugbyPandaTone: {
          type: "string",
          enum: ["strong-match", "partial-match", "weak-match"],
        },
        explanation: { type: "string" },
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

function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function styleRisk(input: AiEditorialReviewInput) {
  const body = input.bodyText.trim();
  const bodySentences = sentences(body);
  const paragraphs = body.split(/\n\s*\n/).map((value) => value.trim()).filter(Boolean);
  const sentenceLengths = bodySentences.map((sentence) => sentence.split(/\s+/).filter(Boolean).length);
  const shortSentences = sentenceLengths.filter((length) => length <= 7).length;
  const shortParagraphs = paragraphs.filter((paragraph) => paragraph.split(/\s+/).length <= 12).length;
  const firstWords = bodySentences.map((sentence) => sentence.toLowerCase().match(/^[a-z']+/)?.[0]).filter(Boolean) as string[];
  const repeatedOpenings = firstWords.length - new Set(firstWords).size;
  const templatePatterns = [
    /not (?:only|because).{0,80}(?:but|quite)/gi,
    /whether you(?:'|’)ve/gi,
    /there(?:'|’)s a good chance/gi,
    /thoughtful analysis/gi,
    /context(?:,| and) clarity/gi,
    /the game we all love/gi,
    /why things happen,? not only what happened/gi,
    /\bwe love\b/gi,
    /\bclear reporting\b/gi,
  ];
  const patternHits = templatePatterns.reduce((total, pattern) => total + (body.match(pattern)?.length ?? 0), 0);
  const concreteSignals = body.match(/\b(?:\d+|Ireland|Leinster|Munster|Ulster|Connacht|URC|Six Nations|Champions Cup|Aviva|Croke Park|Thomond|RDS)\b/gi)?.length ?? 0;
  const rhythmRisk = bodySentences.length >= 5 && (shortSentences / bodySentences.length >= 0.35 || repeatedOpenings >= 2);
  const fragmentRisk = paragraphs.length >= 4 && shortParagraphs / paragraphs.length >= 0.4;
  const genericRisk = patternHits >= 2 || (body.split(/\s+/).length >= 120 && concreteSignals < 3);
  const riskPoints = Number(rhythmRisk) + Number(fragmentRisk) + Number(genericRisk) + Number(patternHits >= 4);

  return {
    level: riskPoints >= 3 ? "high" as const : riskPoints >= 1 ? "moderate" as const : "low" as const,
    rhythmRisk,
    fragmentRisk,
    genericRisk,
    patternHits,
  };
}

function capScore(score: number, maximum: number): number {
  return Math.min(score, maximum);
}

function normaliseReview(
  review: {
    findings: AiEditorialFinding[];
    scorecard: RawScorecard;
    voiceAssessment: AiEditorialReview["voiceAssessment"];
  },
  input: AiEditorialReviewInput,
): AiEditorialReview {
  const risk = styleRisk(input);
  const findings = [...review.findings];
  const hasAiFinding = findings.some((finding) => finding.category === "ai-likeness");

  if (risk.level !== "low" && !hasAiFinding) {
    findings.unshift({
      severity: risk.level === "high" ? "blocking" : "warning",
      category: "ai-likeness",
      message: risk.level === "high"
        ? "Publication risk is high: the prose contains multiple formulaic, repetitive or list-like signals."
        : "Publication risk is moderate: the prose contains detectable formulaic or repetitive signals.",
      excerpt: input.bodyText.slice(0, 180).replace(/\s+/g, " "),
      recommendation: "Rewrite with article-specific reporting, varied sentence lengths, fewer slogan-like fragments and a less symmetrical paragraph rhythm.",
    });
  }

  if (risk.fragmentRisk && !findings.some((finding) => finding.category === "readability" && finding.message.includes("fragment"))) {
    findings.push({
      severity: "warning",
      category: "readability",
      message: "Too many short standalone paragraphs create a mechanical, list-like rhythm.",
      excerpt: "Several paragraphs contain twelve words or fewer.",
      recommendation: "Combine related thoughts into fuller paragraphs and vary sentence and paragraph length.",
    });
  }

  const scorecard: RawScorecard = {
    ...review.scorecard,
    readability: {
      ...review.scorecard.readability,
      score: risk.level === "high" ? capScore(review.scorecard.readability.score, 58) : risk.level === "moderate" ? capScore(review.scorecard.readability.score, 72) : review.scorecard.readability.score,
    },
    rugbyVoice: {
      ...review.scorecard.rugbyVoice,
      score: risk.genericRisk ? capScore(review.scorecard.rugbyVoice.score, 68) : review.scorecard.rugbyVoice.score,
    },
    originality: {
      ...review.scorecard.originality,
      score: risk.level === "high" ? capScore(review.scorecard.originality.score, 52) : risk.level === "moderate" ? capScore(review.scorecard.originality.score, 70) : review.scorecard.originality.score,
    },
  };

  const modelLevel = review.voiceAssessment.aiLikeness;
  const rank = { low: 0, moderate: 1, high: 2 } as const;
  const aiLikeness = rank[risk.level] > rank[modelLevel] ? risk.level : modelLevel;
  const voiceAssessment = {
    ...review.voiceAssessment,
    aiLikeness,
    rugbyPandaTone: risk.genericRisk && review.voiceAssessment.rugbyPandaTone === "strong-match"
      ? "partial-match" as const
      : review.voiceAssessment.rugbyPandaTone,
    explanation: `${review.voiceAssessment.explanation} Conservative style gate: ${risk.level} publication risk based on sentence rhythm, paragraph structure and generic phrasing.`,
  };

  const overall = calculateWeightedEditorialScore(scorecard);
  return {
    findings,
    voiceAssessment,
    scorecard: {
      ...scorecard,
      overall,
      status: findings.some((finding) => finding.severity === "blocking") ? "blocking" : editorialScoreStatus(overall),
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
          "You are the conservative Irish-English publication gate for The Rugby Panda.",
          buildEditorialDnaPrompt(),
          "Return only the requested JSON schema. Do not rewrite or modify the article.",
          "Never award a perfect score. Scores above 90 require exceptional, publication-ready copy with concrete reporting and no material weaknesses.",
          "Treat promotional mission statements, slogan chains, repeated sentence openings, many short standalone paragraphs, symmetrical phrasing and generic conclusions as publication-risk signals.",
          "A confident or polished tone is not evidence of originality. Look actively for formulaic rhythm, predictable contrasts, generic authority language, repeated rhetorical structures and low information density.",
          "Classify AI-likeness as low only when prose has varied syntax and paragraph length, specific reporting detail, natural transitions and no repeated templates.",
          "Classify AI-likeness as moderate when any meaningful machine-like signal is present and high when multiple signals reinforce each other.",
          "Use blocking for high publication risk, material factual-support concerns or misleading certainty; warning for moderate publication risk and clear editorial weaknesses.",
          "When a draft is generic brand copy rather than reported journalism, reduce Originality, Rugby Voice and Readability scores accordingly.",
          "Assess Rugby Panda tone against the supplied Editorial DNA, but do not let brand alignment cancel AI-like or repetitive writing signals.",
          "Accuracy carries the greatest importance. Do not present the score as proof of independent factual verification.",
          "Compare article copy only with the supplied fact ledger and source records. Do not invent missing facts.",
          "Keep excerpts short, explanations concise and recommendations actionable.",
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
      return normaliseReview(JSON.parse(outputText) as {
        findings: AiEditorialFinding[];
        scorecard: RawScorecard;
        voiceAssessment: AiEditorialReview["voiceAssessment"];
      }, input);
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
