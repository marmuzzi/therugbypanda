import type { GeneratedArticleDraft } from "./ArticleDraftTypes";

export type DraftQualityIssue = {
  code: "headline-length" | "standfirst-length" | "seo-title-length" | "seo-description-length" | "paragraph-length" | "filler-repetition";
  message: string;
  value: number;
  limit: number;
  excerpt?: string;
};

export type DraftQualityReport = {
  passed: boolean;
  issues: DraftQualityIssue[];
};

export const DRAFT_READY_LIMITS = {
  headlineCharacters: 70,
  standfirstCharacters: 220,
  seoTitleCharacters: 60,
  seoDescriptionCharacters: 160,
  paragraphWords: 120,
  repeatedFillerOccurrences: 2,
} as const;

const FILLER_WORDS = ["just", "simply", "really", "clearly", "obviously", "basically", "actually"] as const;

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function occurrences(value: string, word: string): number {
  return value.match(new RegExp(`\\b${word}\\b`, "gi"))?.length ?? 0;
}

function articleBodyText(article: GeneratedArticleDraft): string {
  return article.body.flatMap((section) => section.paragraphs).join(" ");
}

export function assessDraftQuality(article: GeneratedArticleDraft): DraftQualityReport {
  const issues: DraftQualityIssue[] = [];

  if (article.title.length > DRAFT_READY_LIMITS.headlineCharacters) {
    issues.push({ code: "headline-length", message: "Headline exceeds the Draft Ready character limit.", value: article.title.length, limit: DRAFT_READY_LIMITS.headlineCharacters, excerpt: article.title });
  }
  if (article.standfirst.length > DRAFT_READY_LIMITS.standfirstCharacters) {
    issues.push({ code: "standfirst-length", message: "Standfirst exceeds the Draft Ready character limit.", value: article.standfirst.length, limit: DRAFT_READY_LIMITS.standfirstCharacters, excerpt: article.standfirst });
  }
  if (article.seoTitle.length > DRAFT_READY_LIMITS.seoTitleCharacters) {
    issues.push({ code: "seo-title-length", message: "SEO title exceeds the Draft Ready character limit.", value: article.seoTitle.length, limit: DRAFT_READY_LIMITS.seoTitleCharacters, excerpt: article.seoTitle });
  }
  if (article.seoDescription.length > DRAFT_READY_LIMITS.seoDescriptionCharacters) {
    issues.push({ code: "seo-description-length", message: "SEO description exceeds the Draft Ready character limit.", value: article.seoDescription.length, limit: DRAFT_READY_LIMITS.seoDescriptionCharacters, excerpt: article.seoDescription });
  }

  article.body.forEach((section, sectionIndex) => {
    section.paragraphs.forEach((paragraph, paragraphIndex) => {
      const words = wordCount(paragraph);
      if (words > DRAFT_READY_LIMITS.paragraphWords) {
        issues.push({
          code: "paragraph-length",
          message: `Body paragraph ${sectionIndex + 1}.${paragraphIndex + 1} exceeds the Draft Ready word limit.`,
          value: words,
          limit: DRAFT_READY_LIMITS.paragraphWords,
          excerpt: paragraph.slice(0, 180),
        });
      }
    });
  });

  const bodyText = articleBodyText(article);
  for (const filler of FILLER_WORDS) {
    const count = occurrences(bodyText, filler);
    if (count > DRAFT_READY_LIMITS.repeatedFillerOccurrences) {
      issues.push({
        code: "filler-repetition",
        message: `Repeated filler word detected: “${filler}” appears ${count} times.`,
        value: count,
        limit: DRAFT_READY_LIMITS.repeatedFillerOccurrences,
        excerpt: filler,
      });
    }
  }

  return { passed: issues.length === 0, issues };
}
