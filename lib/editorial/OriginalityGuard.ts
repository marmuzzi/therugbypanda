import type { GeneratedArticleDraft } from "./ArticleDraftTypes";
import type { SourceRecord } from "./EditorialTypes";

export type OriginalityFinding = {
  sourceId: string;
  publisher: string;
  longestSharedRun: number;
  sixGramCoverage: number;
  matchedSixGrams: number;
};

export type OriginalityReport = {
  passed: boolean;
  findings: OriginalityFinding[];
  reasons: string[];
};

const MAX_LONGEST_SHARED_RUN = 11;
const MAX_SIX_GRAM_COVERAGE = 0.28;
const MIN_SOURCE_WORDS_FOR_COVERAGE = 24;
const MIN_MATCHED_SIX_GRAMS_FOR_FAILURE = 3;

function normalizeWords(value: string): string[] {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9'-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function articleText(article: GeneratedArticleDraft): string {
  return [
    article.title,
    article.standfirst,
    ...article.keyPoints,
    ...article.body.flatMap((section) => [section.heading ?? "", ...section.paragraphs]),
  ]
    .filter(Boolean)
    .join(" ");
}

function sourceText(source: SourceRecord): string {
  return [source.title, source.excerpt, source.bodyText].filter(Boolean).join(" ");
}

function longestSharedContiguousRun(left: string[], right: string[]): number {
  if (left.length === 0 || right.length === 0) return 0;
  const previous = new Array(right.length + 1).fill(0) as number[];
  let longest = 0;

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = new Array(right.length + 1).fill(0) as number[];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      if (left[leftIndex - 1] === right[rightIndex - 1]) {
        current[rightIndex] = previous[rightIndex - 1] + 1;
        longest = Math.max(longest, current[rightIndex]);
      }
    }
    for (let index = 0; index < current.length; index += 1) previous[index] = current[index];
  }

  return longest;
}

function ngrams(words: string[], size: number): string[] {
  if (words.length < size) return [];
  return Array.from({ length: words.length - size + 1 }, (_, index) => words.slice(index, index + size).join(" "));
}

export function assessArticleOriginality(article: GeneratedArticleDraft, sources: SourceRecord[]): OriginalityReport {
  const articleWords = normalizeWords(articleText(article));
  const articleSixGrams = new Set(ngrams(articleWords, 6));
  const reasons: string[] = [];

  const findings = sources.map((source) => {
    const sourceWords = normalizeWords(sourceText(source));
    const sourceSixGrams = ngrams(sourceWords, 6);
    const matchedSixGrams = sourceSixGrams.filter((gram) => articleSixGrams.has(gram)).length;
    const sixGramCoverage = sourceSixGrams.length > 0 ? matchedSixGrams / sourceSixGrams.length : 0;
    const longestSharedRun = longestSharedContiguousRun(articleWords, sourceWords);

    if (longestSharedRun > MAX_LONGEST_SHARED_RUN) {
      reasons.push(`${source.publisher} (${source.id}) shares ${longestSharedRun} consecutive normalized words with the draft.`);
    }

    if (
      sourceWords.length >= MIN_SOURCE_WORDS_FOR_COVERAGE &&
      matchedSixGrams >= MIN_MATCHED_SIX_GRAMS_FOR_FAILURE &&
      sixGramCoverage > MAX_SIX_GRAM_COVERAGE
    ) {
      reasons.push(
        `${source.publisher} (${source.id}) has ${(sixGramCoverage * 100).toFixed(1)}% six-word phrase coverage in the draft.`,
      );
    }

    return {
      sourceId: source.id,
      publisher: source.publisher,
      longestSharedRun,
      sixGramCoverage,
      matchedSixGrams,
    };
  });

  return { passed: reasons.length === 0, findings, reasons };
}
