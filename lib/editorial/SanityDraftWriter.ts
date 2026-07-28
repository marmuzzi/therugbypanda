import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import type { EditorialDraftPackage } from "./ArticleDraftTypes";
import type { RawStoryInput } from "./EditorialTypes";

type ApprovedEditorialImage = {
  _id: string;
  title?: string;
  altText?: string;
  caption?: string;
  editorialCategory?: string;
  photoType?: string;
  suggestedUse?: string[];
  publicCredit?: string;
  creditLine?: string;
  photographer?: string;
  copyrightLine?: string;
  copyright?: string;
  source?: string;
  sourceName?: string;
  rightsNotes?: string;
  image: {
    _type?: "image";
    asset: { _type?: "reference"; _ref: string };
    crop?: Record<string, number>;
    hotspot?: Record<string, number>;
  };
};

type DraftWriterOptions = {
  editorialImageId?: string;
  story?: RawStoryInput;
  replacementOf?: string;
};

function slugify(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);
}

function textBlock(text: string, style: "normal" | "h2" = "normal") {
  const key = crypto.randomUUID().replaceAll("-", "").slice(0, 12);
  return { _type: "block", _key: key, style, markDefs: [], children: [{ _type: "span", _key: `${key}span`, marks: [], text }] };
}

function portableTextBody(article: EditorialDraftPackage["article"]) {
  return article.body.flatMap((section) => [
    ...(section.heading ? [textBlock(section.heading, "h2")] : []),
    ...section.paragraphs.map((paragraph) => textBlock(paragraph)),
  ]);
}

function normaliseDocumentId(value: string): string {
  return value.replace(/^drafts\./, "");
}

function createWriteClient() {
  const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_AUTH_TOKEN;
  if (!projectId || !dataset) throw new Error("Sanity project configuration is missing.");
  if (!token) throw new Error("SANITY_API_TOKEN or SANITY_AUTH_TOKEN is not configured.");
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
}

export async function validateSanityConnectivity(categoryTitle: string) {
  const client = createWriteClient();
  const category = await client.fetch<{ _id: string } | null>(
    `*[_type == "category" && (title == $title || slug.current == $slug)][0]{_id}`,
    { title: categoryTitle, slug: slugify(categoryTitle) },
  );
  if (!category?._id) throw new Error(`No Sanity category found for ${categoryTitle}.`);
  return { connected: true, projectId, dataset, categoryId: category._id };
}

const APPROVED_IMAGE_PROJECTION = `_id,title,altText,caption,editorialCategory,photoType,suggestedUse,publicCredit,creditLine,photographer,copyrightLine,copyright,source,sourceName,rightsNotes,image`;

function imageSearchText(image: ApprovedEditorialImage): string {
  return [image.title, image.altText, image.caption, image.editorialCategory, image.photoType]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function imageRelevanceScore(image: ApprovedEditorialImage, searchTerms: string[]): number {
  const haystack = imageSearchText(image);
  const termScore = searchTerms.reduce((score, term) => score + (term.length > 2 && haystack.includes(term) ? 3 : 0), 0);
  const useScore = image.suggestedUse?.some((use) => use === "hero-image" || use === "article-header") ? 4 : 0;
  return termScore + useScore;
}

async function fetchApprovedEditorialImage(
  writeClient: ReturnType<typeof createClient>,
  pkg: EditorialDraftPackage,
  editorialImageId?: string,
): Promise<ApprovedEditorialImage | undefined> {
  if (editorialImageId) {
    const publishedId = normaliseDocumentId(editorialImageId);
    const image = await writeClient.fetch<ApprovedEditorialImage | null>(
      `*[_type == "editorialImage" && _id in [$publishedId, $draftId] && usageApproved == true && lifecycleStatus in ["approved", "published"] && defined(image.asset._ref)][0]{${APPROVED_IMAGE_PROJECTION}}`,
      { publishedId, draftId: `drafts.${publishedId}` },
    );
    if (!image) throw new Error(`Editorial Image ${editorialImageId} is unavailable, lacks a Sanity asset, or is not approved for use.`);
    return image;
  }

  const images = await writeClient.fetch<ApprovedEditorialImage[]>(
    `*[_type == "editorialImage" && !(_id in path("drafts.**")) && usageApproved == true && lifecycleStatus in ["approved", "published"] && defined(image.asset._ref)] | order(_updatedAt desc)[0...100]{${APPROVED_IMAGE_PROJECTION}}`,
  );
  if (images.length === 0) return undefined;

  const searchTerms = [
    pkg.article.title,
    pkg.article.standfirst,
    pkg.editorial.category,
    pkg.editorial.storyType,
    pkg.editorial.brief.angle,
  ]
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 2);

  return [...images].sort((left, right) => imageRelevanceScore(right, searchTerms) - imageRelevanceScore(left, searchTerms))[0];
}

function toFeaturedImage(editorialImage: ApprovedEditorialImage) {
  return {
    ...editorialImage.image,
    _type: "image",
    alt: editorialImage.altText ?? editorialImage.title ?? "Rugby editorial image",
    caption: editorialImage.caption,
    photographer: editorialImage.publicCredit ?? editorialImage.creditLine ?? editorialImage.photographer,
    source: editorialImage.source ?? editorialImage.sourceName,
    rights: [editorialImage.copyrightLine ?? editorialImage.copyright, editorialImage.rightsNotes].filter(Boolean).join(" — ") || undefined,
  };
}

export async function createSanityArticleDraft(pkg: EditorialDraftPackage, options: DraftWriterOptions = {}) {
  const writeClient = createWriteClient();
  const [category, editorialImage] = await Promise.all([
    writeClient.fetch<{ _id: string } | null>(
      `*[_type == "category" && (title == $title || slug.current == $slug)][0]{_id}`,
      { title: pkg.editorial.category, slug: slugify(pkg.editorial.category) },
    ),
    fetchApprovedEditorialImage(writeClient, pkg, options.editorialImageId),
  ]);

  if (!category?._id) throw new Error(`No Sanity category found for ${pkg.editorial.category}.`);

  const now = new Date().toISOString();
  const slug = slugify(pkg.article.title);
  const documentId = `drafts.article-${pkg.editorial.inputId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  const document = {
    _id: documentId,
    _type: "article",
    title: pkg.article.title,
    slug: { _type: "slug", current: slug },
    standfirst: pkg.article.standfirst,
    publishedAt: now,
    readingTime: `${Math.max(3, Math.ceil(JSON.stringify(pkg.article.body).split(/\s+/).length / 220))} min read`,
    isLead: false,
    category: { _type: "reference", _ref: category._id },
    ...(editorialImage ? { featuredImage: toFeaturedImage(editorialImage) } : {}),
    keyPoints: pkg.article.keyPoints,
    body: portableTextBody(pkg.article),
    seoTitle: pkg.article.seoTitle,
    seoDescription: pkg.article.seoDescription,
    editorialInputId: pkg.editorial.inputId,
    editorialDecision: pkg.editorial.decision,
    editorialStoryType: pkg.editorial.storyType,
    editorialPriority: pkg.editorial.priority,
    editorialScore: pkg.editorial.score,
    editorialConfidence: pkg.editorial.confidence,
    needsHumanFactCheck: pkg.editorial.needsHumanFactCheck,
    editorialAngle: pkg.editorial.brief.angle,
    audiencePromise: pkg.editorial.brief.audiencePromise,
    editorialBrief: pkg.editorial.brief,
    factLedger: pkg.editorial.factLedger,
    sourceRecords: pkg.editorial.sourceRecords,
    sourceNotes: pkg.article.sourceNotes,
    generationDisclosure: pkg.article.disclosure,
    generationSchemaVersion: pkg.editorial.schemaVersion,
    editorialGeneratedAt: pkg.editorial.generatedAt,
    ...(options.story ? {
      sourceStoryTitle: options.story.title,
      sourceStorySummary: options.story.summary,
      sourceStoryBodyText: options.story.bodyText,
      sourceStoryDiscoveredAt: options.story.discoveredAt,
    } : {}),
    ...(options.replacementOf ? {
      replacementOf: { _type: "reference", _ref: normaliseDocumentId(options.replacementOf), _weak: true },
    } : {}),
    workflowStatus: "draft",
    workflowUpdatedAt: now,
    workflowHistory: [{
      _key: crypto.randomUUID().replaceAll("-", "").slice(0, 12),
      _type: "object",
      action: options.replacementOf ? "generate-replacement" : "generate",
      fromStatus: options.replacementOf ? "rejected" : "candidate",
      toStatus: "draft",
      actor: "editorial-automation",
      occurredAt: now,
    }],
    replacementRequired: false,
    rejectionCount: 0,
  };

  const result = await writeClient.createOrReplace(document);
  return { id: result._id, slug, workflowStatus: "draft", editorialImageId: editorialImage?._id, studioIntent: `/intent/edit/id=${result._id};type=article/` };
}
