import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import type { EditorialDraftPackage } from "./ArticleDraftTypes";
import type { RawStoryInput } from "./EditorialTypes";

type ApprovedEditorialImage = {
  _id: string;
  title?: string;
  altText?: string;
  caption?: string;
  publicCredit?: string;
  copyrightLine?: string;
  source?: string;
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

async function fetchApprovedEditorialImage(writeClient: ReturnType<typeof createClient>, editorialImageId?: string): Promise<ApprovedEditorialImage | undefined> {
  if (!editorialImageId) return undefined;
  const publishedId = normaliseDocumentId(editorialImageId);
  const image = await writeClient.fetch<ApprovedEditorialImage | null>(
    `*[_type == "editorialImage" && _id in [$publishedId, $draftId] && usageApproved == true && lifecycleStatus in ["approved", "published"] && defined(image.asset._ref)][0]{_id,title,altText,caption,publicCredit,copyrightLine,source,rightsNotes,image}`,
    { publishedId, draftId: `drafts.${publishedId}` },
  );
  if (!image) throw new Error(`Editorial Image ${editorialImageId} is unavailable, lacks a Sanity asset, or is not approved for use.`);
  return image;
}

function toFeaturedImage(editorialImage: ApprovedEditorialImage) {
  return {
    ...editorialImage.image,
    _type: "image",
    alt: editorialImage.altText ?? editorialImage.title ?? "Rugby editorial image",
    caption: editorialImage.caption,
    photographer: editorialImage.publicCredit,
    source: editorialImage.source,
    rights: [editorialImage.copyrightLine, editorialImage.rightsNotes].filter(Boolean).join(" — ") || undefined,
  };
}

export async function createSanityArticleDraft(pkg: EditorialDraftPackage, options: DraftWriterOptions = {}) {
  const writeClient = createWriteClient();
  const [category, editorialImage] = await Promise.all([
    writeClient.fetch<{ _id: string } | null>(
      `*[_type == "category" && (title == $title || slug.current == $slug)][0]{_id}`,
      { title: pkg.editorial.category, slug: slugify(pkg.editorial.category) },
    ),
    fetchApprovedEditorialImage(writeClient, options.editorialImageId),
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
