import type { EditorialBrainResult } from "./EditorialTypes";

export type ContextualDataCardKind = "player" | "comparison" | "team" | "match";

export type ContextualDataCardRow = {
  label: string;
  value: string;
  sourceIds: string[];
};

export type ContextualDataCard = {
  kind: ContextualDataCardKind;
  title: string;
  subtitle?: string;
  rows: ContextualDataCardRow[];
  note?: string;
};

export interface GeneratedArticleDraft {
  title: string;
  standfirst: string;
  seoTitle: string;
  seoDescription: string;
  keyPoints: string[];
  body: Array<{
    heading?: string;
    paragraphs: string[];
  }>;
  contextualDataCard?: ContextualDataCard | null;
  disclosure: string;
  sourceNotes: Array<{
    sourceId: string;
    publisher: string;
    url: string;
    usage: string;
  }>;
}

export interface EditorialDraftPackage {
  editorial: EditorialBrainResult;
  article: GeneratedArticleDraft;
}
