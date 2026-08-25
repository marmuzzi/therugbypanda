import fs from "node:fs/promises";

const path = "lib/editorial/OpenAIArticleGenerator.ts";
const source = await fs.readFile(path, "utf8");

const before = `function applyDeterministicPresentationRepair(article: GeneratedArticleDraft): GeneratedArticleDraft {
  return {
    ...article,
    body: article.body.map((section) => ({
      ...section,
      heading: section.heading && isFormulaicHeading(section.heading) ? null : section.heading,
      paragraphs: section.paragraphs.flatMap((paragraph) => splitLongParagraph(paragraph, DRAFT_READY_LIMITS.paragraphWords)),
    })),
  };
}`;

const after = `function clipMetadataAtBoundary(value: string, maxCharacters: number, sentenceLike = false): string {
  const trimmed = value.trim();
  if (trimmed.length <= maxCharacters) return trimmed;

  const candidate = trimmed.slice(0, maxCharacters + 1);
  const sentenceFloor = Math.floor(maxCharacters * 0.6);
  const sentenceBoundary = Math.max(candidate.lastIndexOf("."), candidate.lastIndexOf("?"), candidate.lastIndexOf("!"));
  if (sentenceLike && sentenceBoundary >= sentenceFloor) return candidate.slice(0, sentenceBoundary + 1).trim();

  const wordBoundary = candidate.lastIndexOf(" ");
  const clipped = candidate
    .slice(0, wordBoundary > Math.floor(maxCharacters * 0.65) ? wordBoundary : maxCharacters)
    .replace(/[,:;\\-–—\\s]+$/u, "")
    .trim();

  if (!sentenceLike || /[.!?]$/.test(clipped)) return clipped;
  return clipped.length < maxCharacters ? \`\${clipped}.\` : clipped;
}

function applyDeterministicPresentationRepair(article: GeneratedArticleDraft): GeneratedArticleDraft {
  return {
    ...article,
    title: clipMetadataAtBoundary(article.title, DRAFT_READY_LIMITS.headlineCharacters),
    standfirst: clipMetadataAtBoundary(article.standfirst, DRAFT_READY_LIMITS.standfirstCharacters, true),
    seoTitle: clipMetadataAtBoundary(article.seoTitle, DRAFT_READY_LIMITS.seoTitleCharacters),
    seoDescription: clipMetadataAtBoundary(article.seoDescription, DRAFT_READY_LIMITS.seoDescriptionCharacters, true),
    body: article.body.map((section) => ({
      ...section,
      heading: section.heading && isFormulaicHeading(section.heading) ? null : section.heading,
      paragraphs: section.paragraphs.flatMap((paragraph) => splitLongParagraph(paragraph, DRAFT_READY_LIMITS.paragraphWords)),
    })),
  };
}`;

if (!source.includes(before)) throw new Error("Expected presentation-repair block was not found; refusing to patch an unexpected source version.");
const next = source.replace(before, after);
await fs.writeFile(path, next, "utf8");
console.log("Applied deterministic metadata boundary repair to OpenAIArticleGenerator.ts");
