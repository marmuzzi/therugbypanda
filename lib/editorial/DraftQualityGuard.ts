import type { GeneratedArticleDraft } from "./ArticleDraftTypes";

export type DraftQualityIssue = {
  code:
    | "headline-length"
    | "standfirst-length"
    | "seo-title-length"
    | "seo-description-length"
    | "paragraph-length"
    | "filler-repetition"
    | "markdown-syntax"
    | "formulaic-heading";
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
const BANNED_GENERIC_HEADINGS = new Set([
  "why this matters now",
  "why this matters",
  "what you need to know",
  "the bigger picture",
  "what happens next",
  "what comes next",
  "the bottom line",
]);

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function occurrences(value: string, word: string): number {
  return value.match(new RegExp(`\\b${word}\\b`, "gi"))?.length ?? 0;
}

function articleBodyText(article: GeneratedArticleDraft): string {
  return article.body.flatMap((section) => section.paragraphs).join(" ");
}

function containsMarkdownSyntax(value: string): boolean {
  const trimmed = value.trim();
  return /\\\*\\\*/.test(value)
    || /\*\*[^*]+\*\*/.test(value)
    || /^#{1,6}\s+/.test(trimmed)
    || /^\\[-*]\s+/.test(trimmed)
    || /^[-*]\s+/.test(trimmed)
    || /`{1,3}[^`]+`{1,3}/.test(value);
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
    if (section.heading) {
      const heading = section.heading.trim();
      if (containsMarkdownSyntax(heading)) {
        issues.push({
          code: "markdown-syntax",
          message: `Section heading ${sectionIndex + 1} contains Markdown syntax instead of structured article formatting.`,
          value: 1,
          limit: 0,
          excerpt: heading.slice(0, 180),
        });
      }
      if (BANNED_GENERIC_HEADINGS.has(heading.toLowerCase())) {
        issues.push({
          code: "formulaic-heading",
          message: `Generic newsroom heading detected: “${heading}”. Use a story-specific heading or no heading.`,
          value: 1,
          limit: 0,
          excerpt: heading,
        });
      }
    }

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
      if (containsMarkdownSyntax(paragraph)) {
        issues.push({
          code: "markdown-syntax",
          message: `Body paragraph ${sectionIndex + 1}.${paragraphIndex + 1} contains Markdown syntax instead of clean structured text.`,
          value: 1,
          limit: 0,
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
