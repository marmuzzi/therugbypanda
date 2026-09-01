// sanity/components/EditorialReview/types.ts

export type WorkflowHistoryEvent = {
  _key?: string; action?: string; fromStatus?: string; toStatus?: string; actor?: string; note?: string; occurredAt?: string;
};
export type SourceRecord = { id?: string; title?: string; publisher?: string; url?: string; publishedAt?: string; isPrimarySource?: boolean };
export type FactRecord = { id?: string; claim?: string; status?: string; confidence?: number; sourceIds?: string[]; notes?: string; usableInDraft?: boolean };
export type PortableTextMember = { _key?: string; _type?: string; style?: string; children?: Array<{ _key?: string; _type?: string; text?: string; marks?: string[] }>; [key: string]: unknown };

export type ReviewArticle = {
  _id: string; title?: string; standfirst?: string; body?: PortableTextMember[]; seoTitle?: string; seoDescription?: string;
  workflowStatus?: string; workflowUpdatedAt?: string; rejectionReason?: string; rejectionCount?: number; replacementRequired?: boolean;
  editorialConfidence?: number; needsHumanFactCheck?: boolean; editorialAngle?: string; audiencePromise?: string; editorialStoryType?: string;
  editorialInputId?: string; morningPackageEligible?: boolean; automationContentClass?: string;
  sourceRecords?: SourceRecord[]; factLedger?: { facts?: FactRecord[]; unsupportedClaims?: string[]; conflicts?: string[] }; workflowHistory?: WorkflowHistoryEvent[];
  featuredImageUrl?: string; featuredImageAlt?: string; featuredImageCaption?: string; featuredImageCredit?: string; slug?: string; readingTime?: string;
  isLead?: boolean; useBrandImage?: boolean; category?: { _id?: string; title?: string }; author?: { _id?: string; name?: string };
  province?: { _id?: string; title?: string }; competition?: { _id?: string; title?: string }; tags?: Array<{ _id?: string; title?: string }>;
};

export type EditorialAction = "submit" | "approve" | "reject" | "publish" | "unpublish" | "reopen" | "archive" | "restore" | "discard";
export type EditorialIssueSeverity = "blocking" | "warning" | "info";
export type EditorialIssueCategory = "content" | "seo" | "readability" | "journalism";
export type EditorialIssue = { id: string; severity: EditorialIssueSeverity; category: EditorialIssueCategory; message: string };
export type EditorialReview = { issues: EditorialIssue[]; score: number; readiness: "Ready" | "Needs review" | "Blocking"; wordCount: number; blockingCount: number; warningCount: number };
export type AiEditorialFindingSeverity = "blocking" | "warning" | "suggestion";
export type AiEditorialFindingCategory = "spelling" | "grammar" | "awkward-phrasing" | "unsupported-claim" | "speculation-presented-as-fact" | "readability" | "seo" | "headline" | "standfirst" | "rugby-voice" | "originality" | "ai-likeness";
export type AiEditorialFinding = { severity: AiEditorialFindingSeverity; category: AiEditorialFindingCategory; message: string; excerpt: string; recommendation: string };
export type AiEditorialVoiceAssessment = { aiLikeness: "low" | "moderate" | "high"; rugbyPandaTone: "strong-match" | "partial-match" | "weak-match"; explanation: string };
export type EditableDraft = { title: string; standfirst: string; bodyText: string; seoTitle: string; seoDescription: string };
