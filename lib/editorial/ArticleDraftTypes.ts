import type { EditorialBrainResult } from "./EditorialTypes";

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
