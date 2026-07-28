export const EDITORIAL_SCORE_CATEGORIES = [
  "accuracy",
  "grammar",
  "readability",
  "seo",
  "rugbyVoice",
  "originality",
] as const;

export type EditorialScoreCategory = (typeof EDITORIAL_SCORE_CATEGORIES)[number];

export type EditorialCategoryScore = {
  score: number;
  explanation: string;
  findings: string[];
};

export type EditorialScorecard = Record<EditorialScoreCategory, EditorialCategoryScore> & {
  overall: number;
  status: "strong" | "needs-attention" | "substantial-problems" | "blocking";
  summary: string;
  accuracyNotice: string;
};

export const EDITORIAL_SCORE_WEIGHTS: Record<EditorialScoreCategory, number> = {
  accuracy: 0.3,
  grammar: 0.15,
  readability: 0.15,
  seo: 0.1,
  rugbyVoice: 0.2,
  originality: 0.1,
};

export const EDITORIAL_SCORE_TARGETS: Record<EditorialScoreCategory | "overall", number> = {
  accuracy: 95,
  grammar: 95,
  readability: 90,
  seo: 90,
  rugbyVoice: 90,
  originality: 95,
  overall: 90,
};

export const RUGBY_PANDA_EDITORIAL_DNA = {
  mission:
    "Explain Irish and European rugby with accuracy, judgement and personality, helping readers understand not only what happened but why it matters.",
  voice: [
    "informed, direct and conversational",
    "consequence-driven rather than event-list driven",
    "confident without pretending certainty",
    "specific and fair in criticism",
    "restrained rather than breathless",
    "written in Irish English",
  ],
  reward: [
    "clear explanation of why events matter",
    "tactical insight grounded in supplied facts",
    "natural sentence and paragraph variation",
    "credible editorial judgement",
    "precise rugby-union terminology",
    "original synthesis rather than source imitation",
  ],
  penalise: [
    "generic sports writing",
    "corporate language",
    "flat chronological summaries",
    "obvious AI phrasing",
    "repetitive sentence openings, paragraph lengths or rhythm",
    "excessive passive voice or em dashes",
    "keyword stuffing",
    "vague claims or unsupported tactical conclusions",
    "generic hype and rugby clichés",
  ],
  prohibitedPhrases: [
    "clash of titans",
    "massive statement",
    "epic encounter",
    "mouth-watering clash",
    "sent shockwaves",
    "wrote their name into history",
    "left everything on the pitch",
    "game of two halves",
    "overall",
    "in conclusion",
    "it is worth noting",
    "furthermore",
    "moreover",
    "not only",
  ],
  accuracyRules: [
    "Never invent facts, quotations, statistics, injuries, selections, motives or certainty.",
    "Use the supplied fact ledger and source records as the support boundary.",
    "Distinguish verified facts, apparent internal consistency and facts requiring human verification.",
    "A high score is not proof that every fact has been independently verified.",
  ],
} as const;

export function calculateWeightedEditorialScore(
  scores: Pick<EditorialScorecard, EditorialScoreCategory>,
): number {
  const weighted = EDITORIAL_SCORE_CATEGORIES.reduce(
    (total, category) => total + scores[category].score * EDITORIAL_SCORE_WEIGHTS[category],
    0,
  );
  return Math.round(weighted);
}

export function editorialScoreStatus(score: number): EditorialScorecard["status"] {
  if (score >= 90) return "strong";
  if (score >= 85) return "needs-attention";
  return "substantial-problems";
}

export function buildEditorialDnaPrompt(): string {
  const dna = RUGBY_PANDA_EDITORIAL_DNA;
  return [
    `Mission: ${dna.mission}`,
    `Voice: ${dna.voice.join("; ")}.`,
    `Reward: ${dna.reward.join("; ")}.`,
    `Penalise: ${dna.penalise.join("; ")}.`,
    `Prohibited phrases: ${dna.prohibitedPhrases.join("; ")}.`,
    `Accuracy rules: ${dna.accuracyRules.join("; ")}.`,
  ].join("\n");
}
