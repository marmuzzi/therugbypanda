export const STORY_TYPES = [
  "breaking-news",
  "news",
  "analysis",
  "opinion",
  "feature",
  "match-report",
  "transfer-watch",
  "rumour-roundup",
  "speculation",
] as const;

export type StoryType = (typeof STORY_TYPES)[number];

export const EDITORIAL_CATEGORIES = [
  "Ireland",
  "Leinster",
  "Munster",
  "Ulster",
  "Connacht",
  "URC",
  "Europe",
  "Opinion",
] as const;

export type EditorialCategory = (typeof EDITORIAL_CATEGORIES)[number];
export type EditorialPriority = "low" | "medium" | "high" | "urgent";
export type EvidenceStatus = "confirmed" | "strongly-reported" | "speculative" | "disputed";
export type EditorialDecision = "reject" | "hold" | "draft";

export interface SourceRecord {
  id: string;
  url: string;
  publisher: string;
  title: string;
  publishedAt?: string;
  retrievedAt: string;
  excerpt?: string;
  author?: string;
  isPrimarySource?: boolean;
}

export interface RawStoryInput {
  id: string;
  title: string;
  summary?: string;
  bodyText?: string;
  sourceRecords: SourceRecord[];
  discoveredAt: string;
  suggestedCategory?: EditorialCategory;
  relatedPublishedSlugs?: string[];
}

export interface FactRecord {
  id: string;
  claim: string;
  status: EvidenceStatus;
  confidence: number;
  sourceIds: string[];
  notes?: string;
  usableInDraft: boolean;
}

export interface FactLedger {
  facts: FactRecord[];
  unsupportedClaims: string[];
  conflicts: string[];
}

export interface StoryScore {
  total: number;
  relevance: number;
  freshness: number;
  readerInterest: number;
  distinctiveness: number;
  sourceStrength: number;
  rationale: string[];
}

export interface EditorialBrief {
  angle: string;
  audiencePromise: string;
  keyQuestions: string[];
  requiredContext: string[];
  prohibitedApproaches: string[];
}

export interface EditorialBrainResult {
  inputId: string;
  decision: EditorialDecision;
  storyType: StoryType;
  category: EditorialCategory;
  priority: EditorialPriority;
  score: StoryScore;
  confidence: number;
  needsHumanFactCheck: boolean;
  suggestedHeadline: string;
  suggestedSeoTitle: string;
  suggestedMetaDescription: string;
  tags: string[];
  featuredImageSearchBrief: string;
  brief: EditorialBrief;
  factLedger: FactLedger;
  sourceRecords: SourceRecord[];
  generatedAt: string;
  schemaVersion: "1.0";
}
