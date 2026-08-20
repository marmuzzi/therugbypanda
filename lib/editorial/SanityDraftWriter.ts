import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import type { EditorialDraftPackage } from "./ArticleDraftTypes";
import type { EditorialCategory, RawStoryInput } from "./EditorialTypes";

type ApprovedEditorialImage = {
  _id: string;
  title?: string;
  altText?: string;
  caption?: string;
  editorialCategory?: string;
  photoType?: string[];
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

export type AutomationContentClass = "production" | "qa" | "test";

type DraftWriterOptions = {
  editorialImageId?: string;
  story?: RawStoryInput;
  replacementOf?: string;
  automationContentClass?: AutomationContentClass;
  morningPackageEligible?: boolean;
};

type SanityTaxonomyTarget = {
  categoryTitle: "News" | "Provinces" | "Ireland" | "URC" | "International";
  provinceTitle?: "Leinster" | "Munster" | "Ulster" | "Connacht";
  competitionTitle?: "URC" | "International";
};

const PROVINCE_CATEGORIES = new Set<EditorialCategory>(["Leinster", "Munster", "Ulster", "Connacht"]);
const PROVINCE_TERMS = ["leinster", "munster", "ulster", "connacht"] as const;
const GENERIC_IMAGE_TERMS = ["rugby panda", "panda logo", "brand logo", "newsroom logo", "the rugby panda"];
const GENERIC_RUGBY_TERMS = new Set([
  "rugby", "match", "game", "team", "teams", "player", "players", "supporter", "supporters", "stadium", "pitch",
  "season", "preseason", "friendly", "fixture", "fixtures", "squad", "coach", "coaching", "crowd", "article", "header",
  "homepage", "card", "gallery", "international", "news", "provinces", "province", "urc",
]);
const MIN_AUTOMATIC_IMAGE_RELEVANCE_SCORE = 8;

function taxonomyForEditorialCategory(category: EditorialCategory): SanityTaxonomyTarget {
  if (PROVINCE_CATEGORIES.has(category)) {
    return {
      categoryTitle: "Provinces",
      provinceTitle: category as SanityTaxonomyTarget["provinceTitle"],
    };
  }

  switch (category) {
    case "Ireland":
      return { categoryTitle: "Ireland" };
    case "URC":
      return { categoryTitle: "URC", competitionTitle: "URC" };
    case "Europe":
      return { categoryTitle: "International", competitionTitle: "International" };
    case "Opinion":
      return { categoryTitle: "News" };
    default:
      return { categoryTitle: "News" };
  }
}

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

export async function validateSanityConnectivity(editorialCategory: EditorialCategory) {
  const client = createWriteClient();
  const taxonomy = taxonomyForEditorialCategory(editorialCategory);
  const category = await client.fetch<{ _id: string } | null>(
    `*[_type == "category" && (title == $title || slug.current == $slug)][0]{_id}`,
    { title: taxonomy.categoryTitle, slug: slugify(taxonomy.categoryTitle) },
  );
  if (!category?._id) throw new Error(`No Sanity category found for ${taxonomy.categoryTitle}.`);
  return { connected: true, projectId, dataset, categoryId: category._id };
}

const APPROVED_IMAGE_PROJECTION = `_id,title,altText,caption,editorialCategory,photoType,suggestedUse,publicCredit,creditLine,photographer,copyrightLine,copyright,source,sourceName,rightsNotes,image`;

function imageSearchText(image: ApprovedEditorialImage): string {
  return [
    image.title,
    image.altText,
    image.caption,
    image.editorialCategory,
    ...(image.photoType ?? []),
    ...(image.suggestedUse ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function stableHash(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function imageHasConflictingProvince(image: ApprovedEditorialImage, storyText: string): boolean {
  const haystack = imageSearchText(image);
  const storyProvince = PROVINCE_TERMS.find((province) => storyText.includes(province));
  if (!storyProvince) return false;
  const imageProvinces = PROVINCE_TERMS.filter((province) => haystack.includes(province));
  return imageProvinces.length > 0 && !imageProvinces.includes(storyProvince);
}

function meaningfulStoryTerms(storyText: string): string[] {
  return [...new Set(
    storyText
      .split(/[^a-z0-9]+/)
      .filter((term) => term.length >= 4 && !GENERIC_RUGBY_TERMS.has(term)),
  )];
}

function hasRequiredSubjectEvidence(image: ApprovedEditorialImage, storyText: string): boolean {
  const haystack = imageSearchText(image);
  const storyProvince = PROVINCE_TERMS.find((province) => storyText.includes(province));
  if (storyProvince) return haystack.includes(storyProvince);

  if (storyText.includes("ireland")) return haystack.includes("ireland");

  const terms = meaningfulStoryTerms(storyText);
  return terms.some((term) => haystack.includes(term));
}

function imageRelevanceScore(image: ApprovedEditorialImage, searchTerms: string[], storyText: string): number {
  const haystack = imageSearchText(image);
  if (imageHasConflictingProvince(image, storyText)) return Number.NEGATIVE_INFINITY;
  if (!hasRequiredSubjectEvidence(image, storyText)) return Number.NEGATIVE_INFINITY;

  const uniqueTerms = [...new Set(searchTerms)];
  const termScore = uniqueTerms.reduce((score, term) => {
    if (term.length < 3 || GENERIC_RUGBY_TERMS.has(term) || !haystack.includes(term)) return score;
    return score + (term.length >= 7 ? 5 : term.length >= 5 ? 3 : 2);
  }, 0);
  const useScore = image.suggestedUse?.some((use) => use === "hero-image" || use === "article-header") ? 4 : 0;
  const provinceBonus = PROVINCE_TERMS.some((province) => storyText.includes(province) && haystack.includes(province)) ? 18 : 0;
  const irelandBonus = storyText.includes("ireland") && haystack.includes("ireland") ? 12 : 0;
  const genericImage = GENERIC_IMAGE_TERMS.some((term) => haystack.includes(term));
  const storyIsAboutBrand = GENERIC_IMAGE_TERMS.some((term) => storyText.includes(term));
  const genericPenalty = genericImage && !storyIsAboutBrand ? 30 : 0;
  return termScore + useScore + provinceBonus + irelandBonus - genericPenalty;
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
    `*[_type == "editorialImage" && !(_id in path("drafts.**")) && usageApproved == true && lifecycleStatus in ["approved", "published"] && defined(image.asset._ref)] | order(_updatedAt desc)[0...200]{${APPROVED_IMAGE_PROJECTION}}`,
  );
  if (images.length === 0) return undefined;

  const storyText = [
    pkg.article.title,
    pkg.article.standfirst,
    pkg.editorial.category,
    pkg.editorial.storyType,
    pkg.editorial.brief.angle,
    pkg.editorial.sourceRecords.map((source) => `${source.publisher} ${source.title ?? ""}`).join(" "),
  ]
    .join(" ")
    .toLowerCase();
  const searchTerms = storyText
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 2);

  const ranked = images
    .map((image) => ({ image, score: imageRelevanceScore(image, searchTerms, storyText) }))
    .filter((candidate) => Number.isFinite(candidate.score))
    .sort((left, right) => right.score - left.score);

  const bestScore = ranked[0]?.score ?? Number.NEGATIVE_INFINITY;
  if (bestScore < MIN_AUTOMATIC_IMAGE_RELEVANCE_SCORE) {
    console.info("No sufficiently relevant approved Editorial Image found", {
      inputId: pkg.editorial.inputId,
      category: pkg.editorial.category,
      bestScore: Number.isFinite(bestScore) ? bestScore : null,
    });
    return undefined;
  }

  const relevantPool = ranked
    .filter((candidate) => candidate.score >= MIN_AUTOMATIC_IMAGE_RELEVANCE_SCORE && candidate.score >= bestScore - 2)
    .slice(0, 8);
  return relevantPool[stableHash(`${pkg.article.title}|${pkg.editorial.inputId}`) % relevantPool.length]?.image;
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
  const taxonomy = taxonomyForEditorialCategory(pkg.editorial.category);
  const [category, province, competition, editorialImage] = await Promise.all([
    writeClient.fetch<{ _id: string } | null>(
      `*[_type == "category" && (title == $title || slug.current == $slug)][0]{_id}`,
      { title: taxonomy.categoryTitle, slug: slugify(taxonomy.categoryTitle) },
    ),
    taxonomy.provinceTitle
      ? writeClient.fetch<{ _id: string } | null>(
          `*[_type == "province" && (title == $title || slug.current == $slug)][0]{_id}`,
          { title: taxonomy.provinceTitle, slug: slugify(taxonomy.provinceTitle) },
        )
      : Promise.resolve(null),
    taxonomy.competitionTitle
      ? writeClient.fetch<{ _id: string } | null>(
          `*[_type == "competition" && (title == $title || slug.current == $slug)][0]{_id}`,
          { title: taxonomy.competitionTitle, slug: slugify(taxonomy.competitionTitle) },
        )
      : Promise.resolve(null),
    fetchApprovedEditorialImage(writeClient, pkg, options.editorialImageId),
  ]);

  if (!category?._id) throw new Error(`No Sanity category found for ${taxonomy.categoryTitle}.`);
  if (taxonomy.provinceTitle && !province?._id) throw new Error(`No Sanity province found for ${taxonomy.provinceTitle}.`);
  if (taxonomy.competitionTitle && !competition?._id) throw new Error(`No Sanity competition found for ${taxonomy.competitionTitle}.`);

  const now = new Date().toISOString();
  const slug = slugify(pkg.article.title);
  const documentId = `drafts.article-${pkg.editorial.inputId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  const automationContentClass = options.automationContentClass ?? "production";
  const morningPackageEligible = options.morningPackageEligible ?? automationContentClass === "production";
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
    ...(province ? { province: { _type: "reference", _ref: province._id } } : {}),
    ...(competition ? { competition: { _type: "reference", _ref: competition._id } } : {}),
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
    automationContentClass,
    morningPackageEligible,
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
  return {
    id: result._id,
    slug,
    workflowStatus: "draft",
    editorialImageId: editorialImage?._id,
    automationContentClass,
    morningPackageEligible,
    studioIntent: `/intent/edit/id=${result._id};type=article`,
  };
}
