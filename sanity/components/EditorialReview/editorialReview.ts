import { countWords } from "./formatting";
import { bodyToText } from "./portableText";

import type {
  ReviewArticle,
  EditableDraft,
  EditorialIssue,
  EditorialReview,
} from "./types";

export function createEditorialReview(
  article: ReviewArticle,
  draft: EditableDraft,
): EditorialReview {

const issues: EditorialIssue[] = [];
  const addIssue = (
    id: string,
    severity: EditorialIssueSeverity,
    category: EditorialIssueCategory,
    message: string,
  ) => {
    issues.push({ id, severity, category, message });
  };
  const headline = draft.title.trim();
  const standfirst = draft.standfirst.trim();
  const body = draft.bodyText.trim();
  const seoTitle = draft.seoTitle.trim();
  const seoDescription = draft.seoDescription.trim();
  const wordCount = countWords(body);

  if (!headline)
    addIssue(
      "missing-headline",
      "blocking",
      "content",
      "Add a headline before approval.",
    );
  if (!standfirst)
    addIssue(
      "missing-standfirst",
      "blocking",
      "content",
      "Add a standfirst before approval.",
    );
  if (!body)
    addIssue(
      "missing-body",
      "blocking",
      "content",
      "Add article body copy before approval.",
    );
  if (!seoTitle)
    addIssue(
      "missing-seo-title",
      "blocking",
      "seo",
      "Add an SEO title before approval.",
    );
  if (!seoDescription)
    addIssue(
      "missing-seo-description",
      "blocking",
      "seo",
      "Add an SEO description before approval.",
    );
  if ((article.factLedger?.unsupportedClaims ?? []).length > 0)
    addIssue(
      "unsupported-claims",
      "blocking",
      "journalism",
      "Resolve unsupported claims in the fact ledger.",
    );
  if ((article.factLedger?.conflicts ?? []).length > 0)
    addIssue(
      "fact-ledger-conflicts",
      "blocking",
      "journalism",
      "Resolve conflicts in the fact ledger.",
    );
  if (article.needsHumanFactCheck)
    addIssue(
      "human-fact-check",
      "blocking",
      "journalism",
      "A human fact-check is required before approval.",
    );

  if (!article.featuredImageUrl)
    addIssue(
      "missing-featured-image",
      "warning",
      "content",
      "Assign an approved featured image.",
    );
  if (headline.length > 70)
    addIssue(
      "headline-too-long",
      "warning",
      "content",
      "Headline exceeds 70 characters.",
    );
  if (standfirst.length > 220)
    addIssue(
      "standfirst-too-long",
      "warning",
      "content",
      "Standfirst exceeds 220 characters.",
    );
  if (wordCount < 250)
    addIssue(
      "body-too-short",
      "warning",
      "readability",
      "Article body is shorter than 250 words.",
    );
  if (seoTitle.length > 60)
    addIssue(
      "seo-title-too-long",
      "warning",
      "seo",
      "SEO title exceeds 60 characters.",
    );
  if (seoDescription.length > 160)
    addIssue(
      "seo-description-too-long",
      "warning",
      "seo",
      "SEO description exceeds 160 characters.",
    );
  if (body.split(/\n\s*\n/).some((paragraph) => countWords(paragraph) > 120))
    addIssue(
      "paragraph-too-long",
      "warning",
      "readability",
      "At least one paragraph exceeds 120 words.",
    );

  if (headline.length > 0 && headline.length < 25)
    addIssue(
      "headline-too-short",
      "info",
      "content",
      "Headline is shorter than 25 characters.",
    );
  if (seoDescription.length > 0 && seoDescription.length < 110)
    addIssue(
      "seo-description-too-short",
      "info",
      "seo",
      "SEO description is shorter than 110 characters.",
    );
  const fillerWords = [
    "actually",
    "basically",
    "just",
    "quite",
    "really",
    "simply",
    "very",
  ];
  const lowerCaseBody = body.toLowerCase();
  fillerWords.forEach((word) => {
    const occurrences =
      lowerCaseBody.match(new RegExp(`\\b${word}\\b`, "g"))?.length ?? 0;
    if (occurrences >= 3)
      addIssue(
        `repeated-filler-${word}`,
        "info",
        "readability",
        `Repeated filler word detected: “${word}” appears ${occurrences} times.`,
      );
  });

  const blockingCount = issues.filter(
    (issue) => issue.severity === "blocking",
  ).length;
  const warningCount = issues.filter(
    (issue) => issue.severity === "warning",
  ).length;
  const score = Math.max(
    0,
    100 -
      blockingCount * 18 -
      warningCount * 7 -
      issues.filter((issue) => issue.severity === "info").length * 2,
  );
  return {
    issues,
    score,
    readiness:
      blockingCount > 0 ? "Blocking" : score >= 80 ? "Ready" : "Needs review",
    wordCount,
    blockingCount,
    warningCount,
  };
}

export function articleToEditable(
  article: ReviewArticle,
): EditableDraft {
  return {
    title: article.title ?? "",
    standfirst: article.standfirst ?? "",
    bodyText: bodyToText(article.body),
    seoTitle: article.seoTitle ?? "",
    seoDescription: article.seoDescription ?? "",
  };
}
