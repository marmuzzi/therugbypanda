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

type RankedEditorialImage = {
  image: ApprovedEditorialImage;
  score: number;
  exactSubjects: string[];
};

type InlineEditorialImage = {
  subject: string;
  image: ApprovedEditorialImage;
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
  "homepage", "card", "gallery", "international", "news", "provinces", "province", "urc", "preview", "window",
]);
const NON_PERSON_PROPER_NOUN_TERMS = new Set([
  "rugby", "stadium", "championship", "cup", "club", "football", "union", "province", "provinces", "ireland",
  "leinster", "munster", "ulster", "connacht", "nations", "united", "champions", "challenge", "european", "aviva",
  "kingspan", "sportsground", "thomond", "rds", "urc", "world", "series", "league", "team", "academy",
]);
const MIN_AUTOMATIC_IMAGE_RELEVANCE_SCORE = 12;
const MAX_INLINE_IMAGES = 3;

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

function cleanGeneratedText(value: string): string {
  return value
    .replace(/\\([*_#-])/g, "$1")
    .replace(/^#{1,6}\s+/, "")
    .replace(/^[-*]\s+/, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .trim();
}

function textBlock(text: string, style: "normal" | "h2" = "normal") {
  const key = crypto.randomUUID().replaceAll("-", "").slice(0, 12);
  return { _type: "block", _key: key, style, markDefs: [], children: [{ _type: "span", _key: `${key}span`, marks: [], text: cleanGeneratedText(text) }] };
}

function toPortableImage(editorialImage: ApprovedEditorialImage) {
  return {
    ...editorialImage.image,
    _type: "image" as const,
    _key: crypto.randomUUID().replaceAll("-", "").slice(0, 12),
    alt: editorialImage.altText ?? editorialImage.title ?? "Rugby editorial image",
    caption: editorialImage.caption,
    photographer: editorialImage.publicCredit ?? editorialImage.creditLine ?? editorialImage.photographer,
    source: editorialImage.source ?? editorialImage.sourceName,
    rights: [editorialImage.copyrightLine ?? editorialImage.copyright, editorialImage.rightsNotes].filter(Boolean).join(" — ") || undefined,
  };
}

function portableTextBody(article: EditorialDraftPackage["article"], inlineImages: InlineEditorialImage[]) {
  const placedAssets = new Set<string>();
  const blocks: Array<Record<string, unknown>> = [];

  for (const section of article.body) {
    if (section.heading) blocks.push(textBlock(section.heading, "h2"));

    for (const paragraph of section.paragraphs) {
      blocks.push(textBlock(paragraph));
      const paragraphText = paragraph.toLowerCase();
      const match = inlineImages.find(({ subject, image }) => (
        !placedAssets.has(image.image.asset._ref) && paragraphText.includes(subject.toLowerCase())
      ));
      if (match) {
        blocks.push(toPortableImage(match.image));
        placedAssets.add(match.image.image.asset._ref);
      }
    }
  }

  for (const inline of inlineImages) {
    if (!placedAssets.has(inline.image.image.asset._ref)) {
      blocks.push(toPortableImage(inline.image));
      placedAssets.add(inline.image.image.asset._ref);
    }
  }

  return blocks;
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

function rawDescriptiveImageText(image: ApprovedEditorialImage): string {
  return [image.title, image.altText, image.caption]
    .filter(Boolean)
    .join(" ");
}

function descriptiveImageText(image: ApprovedEditorialImage): string {
  return rawDescriptiveImageText(image).toLowerCase();
}

function imageSearchText(image: ApprovedEditorialImage): string {
  return [
    descriptiveImageText(image),
    image.editorialCategory,
    ...(image.photoType ?? []),
    ...(image.suggestedUse ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function articleText(pkg: EditorialDraftPackage): string {
  return [
    pkg.article.title,
    pkg.article.standfirst,
    pkg.editorial.category,
    pkg.editorial.storyType,
    pkg.editorial.brief.angle,
    ...pkg.article.body.flatMap((section) => [section.heading ?? "", ...section.paragraphs]),
    pkg.editorial.sourceRecords.map((source) => `${source.publisher} ${source.title ?? ""}`).join(" "),
  ]
    .filter(Boolean)
    .join(" ");
}

function meaningfulStoryTerms(storyText: string): string[] {
  return [...new Set(
    storyText
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((term) => term.length >= 4 && !GENERIC_RUGBY_TERMS.has(term)),
  )];
}

function subjectPhrases(pkg: EditorialDraftPackage): string[] {
  const text = [
    pkg.article.title,
    pkg.article.standfirst,
    pkg.editorial.brief.angle,
    ...pkg.article.body.flatMap((section) => [section.heading ?? "", ...section.paragraphs]),
  ].join(" ");
  const matches = text.match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+(?:\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+){1,3}\b/g) ?? [];
  return [...new Set(matches.map((match) => match.trim()).filter((match) => match.length >= 6))];
}

function namedPersonPhrasesFromImage(image: ApprovedEditorialImage): string[] {
  const matches = rawDescriptiveImageText(image).match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+(?:\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+){1,3}\b/g) ?? [];
  return [...new Set(matches.map((match) => match.trim()).filter((match) => {
    const terms = match.toLowerCase().split(/[^a-zà-öø-ÿ'’.-]+/).filter(Boolean);
    if (terms.length < 2) return false;
    return !terms.some((term) => NON_PERSON_PROPER_NOUN_TERMS.has(term));
  }))];
}

function imageHasConflictingProvince(image: ApprovedEditorialImage, storyText: string): boolean {
  const haystack = descriptiveImageText(image);
  const storyProvince = PROVINCE_TERMS.find((province) => storyText.toLowerCase().includes(province));
  if (!storyProvince) return false;
  const imageProvinces = PROVINCE_TERMS.filter((province) => haystack.includes(province));
  return imageProvinces.length > 0 && !imageProvinces.includes(storyProvince);
}

function exactSubjectMatches(image: ApprovedEditorialImage, subjects: string[]): string[] {
  const descriptive = descriptiveImageText(image);
  return subjects.filter((subject) => descriptive.includes(subject.toLowerCase()));
}

function imageHasConflictingNamedPerson(image: ApprovedEditorialImage, storyText: string, exactSubjects: string[]): boolean {
  if (exactSubjects.length > 0) return false;
  const lowerStory = storyText.toLowerCase();
  const namedPeople = namedPersonPhrasesFromImage(image);
  if (namedPeople.length === 0) return false;
  return !namedPeople.some((person) => lowerStory.includes(person.toLowerCase()));
}

function storyRequiresWomenEvidence(storyText: string): boolean {
  return /\bwomen(?:'s)?\b|\bwomens\b|\bfemale\b/i.test(storyText);
}

function hasRequiredSubjectEvidence(image: ApprovedEditorialImage, storyText: string, exactSubjects: string[]): boolean {
  if (exactSubjects.length > 0) return true;

  const descriptive = descriptiveImageText(image);
  const lowerStory = storyText.toLowerCase();
  const storyProvince = PROVINCE_TERMS.find((province) => lowerStory.includes(province));
  if (storyProvince) return descriptive.includes(storyProvince);

  if (lowerStory.includes("ireland")) {
    if (!descriptive.includes("ireland")) return false;
    if (storyRequiresWomenEvidence(storyText)) {
      return /\bwomen(?:'s)?\b|\bwomens\b|\bfemale\b/.test(descriptive);
    }
    return true;
  }

  const terms = meaningfulStoryTerms(storyText);
  return terms.filter((term) => descriptive.includes(term)).length >= 2;
}

function imageRelevanceScore(image: ApprovedEditorialImage, storyText: string, subjects: string[]): RankedEditorialImage {
  const searchText = imageSearchText(image);
  const descriptive = descriptiveImageText(image);
  const exactSubjects = exactSubjectMatches(image, subjects);
  if (imageHasConflictingProvince(image, storyText) && exactSubjects.length === 0) {
    return { image, score: Number.NEGATIVE_INFINITY, exactSubjects };
  }
  if (imageHasConflictingNamedPerson(image, storyText, exactSubjects)) {
    return { image, score: Number.NEGATIVE_INFINITY, exactSubjects };
  }
  if (!hasRequiredSubjectEvidence(image, storyText, exactSubjects)) {
    return { image, score: Number.NEGATIVE_INFINITY, exactSubjects };
  }

  const terms = meaningfulStoryTerms(storyText);
  const termScore = terms.reduce((score, term) => {
    if (!descriptive.includes(term)) return score;
    return score + (term.length >= 8 ? 5 : term.length >= 6 ? 3 : 2);
  }, 0);
  const exactSubjectScore = exactSubjects.length * 30;
  const useScore = image.suggestedUse?.some((use) => use === "hero-image" || use === "article-header") ? 4 : 0;
  const provinceBonus = PROVINCE_TERMS.some((province) => storyText.toLowerCase().includes(province) && descriptive.includes(province)) ? 18 : 0;
  const irelandBonus = storyText.toLowerCase().includes("ireland") && descriptive.includes("ireland") ? 12 : 0;
  const womenBonus = storyRequiresWomenEvidence(storyText) && /\bwomen(?:'s)?\b|\bwomens\b|\bfemale\b/.test(descriptive) ? 14 : 0;
  const genericImage = GENERIC_IMAGE_TERMS.some((term) => searchText.includes(term));
  const storyIsAboutBrand = GENERIC_IMAGE_TERMS.some((term) => storyText.toLowerCase().includes(term));
  const genericPenalty = genericImage && !storyIsAboutBrand ? 40 : 0;

  return {
    image,
    score: termScore + exactSubjectScore + useScore + provinceBonus + irelandBonus + womenBonus - genericPenalty,
    exactSubjects,
  };
}

async function fetchApprovedImages(writeClient: ReturnType<typeof createClient>): Promise<ApprovedEditorialImage[]> {
  return writeClient.fetch<ApprovedEditorialImage[]>(
    `*[_type == "editorialImage" && !(_id in path("drafts.**")) && usageApproved == true && lifecycleStatus in ["approved", "published"] && defined(image.asset._ref)] | order(_updatedAt desc)[0...500]{${APPROVED_IMAGE_PROJECTION}}`,
  );
}

async function fetchRecentlyUsedMorningAssets(writeClient: ReturnType<typeof createClient>): Promise<Set<string>> {
  const cutoff = new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString();
  const rows = await writeClient.fetch<Array<{ featured?: string; inline?: string[] }>>(
    `*[_type == "article" && _id in path("drafts.**") && morningPackageEligible == true && _updatedAt >= $cutoff]{
      "featured": featuredImage.asset._ref,
      "inline": body[_type == "image"].asset._ref
    }`,
    { cutoff },
  );
  return new Set(rows.flatMap((row) => [row.featured, ...(row.inline ?? [])]).filter((value): value is string => Boolean(value)));
}

async function selectEditorialImages(
  writeClient: ReturnType<typeof createClient>,
  pkg: EditorialDraftPackage,
  editorialImageId?: string,
): Promise<{ hero?: ApprovedEditorialImage; inline: InlineEditorialImage[] }> {
  const storyText = articleText(pkg);
  const subjects = subjectPhrases(pkg);

  if (editorialImageId) {
    const publishedId = normaliseDocumentId(editorialImageId);
    const image = await writeClient.fetch<ApprovedEditorialImage | null>(
      `*[_type == "editorialImage" && _id in [$publishedId, $draftId] && usageApproved == true && lifecycleStatus in ["approved", "published"] && defined(image.asset._ref)][0]{${APPROVED_IMAGE_PROJECTION}}`,
      { publishedId, draftId: `drafts.${publishedId}` },
    );
    if (!image) throw new Error(`Editorial Image ${editorialImageId} is unavailable, lacks a Sanity asset, or is not approved for use.`);
    const ranked = imageRelevanceScore(image, storyText, subjects);
    if (!Number.isFinite(ranked.score) || ranked.score < MIN_AUTOMATIC_IMAGE_RELEVANCE_SCORE) {
      throw new Error(`Editorial Image ${editorialImageId} failed strict subject-relevance validation for ${pkg.editorial.inputId}.`);
    }
    return { hero: image, inline: [] };
  }

  const [images, usedAssets] = await Promise.all([
    fetchApprovedImages(writeClient),
    fetchRecentlyUsedMorningAssets(writeClient),
  ]);
  if (images.length === 0) return { inline: [] };

  const ranked = images
    .map((image) => imageRelevanceScore(image, storyText, subjects))
    .filter((candidate) => Number.isFinite(candidate.score) && candidate.score >= MIN_AUTOMATIC_IMAGE_RELEVANCE_SCORE)
    .filter((candidate) => !usedAssets.has(candidate.image.image.asset._ref))
    .sort((left, right) => right.score - left.score);

  const inline: InlineEditorialImage[] = [];
  const inlineAssets = new Set<string>();
  const usedSubjects = new Set<string>();

  for (const candidate of ranked) {
    const subject = candidate.exactSubjects.find((value) => !usedSubjects.has(value.toLowerCase()));
    if (!subject) continue;
    const assetRef = candidate.image.image.asset._ref;
    if (inlineAssets.has(assetRef)) continue;
    inline.push({ subject, image: candidate.image });
    inlineAssets.add(assetRef);
    usedSubjects.add(subject.toLowerCase());
    if (inline.length >= MAX_INLINE_IMAGES) break;
  }

  const hero = ranked.find((candidate) => !inlineAssets.has(candidate.image.image.asset._ref))?.image;
  if (!hero && inline.length === 0) {
    console.info("No sufficiently relevant approved Editorial Image found", {
      inputId: pkg.editorial.inputId,
      category: pkg.editorial.category,
    });
  }

  return { hero, inline };
}

function toFeaturedImage(editorialImage: ApprovedEditorialImage) {
  const { _key: _ignoredKey, ...image } = toPortableImage(editorialImage);
  void _ignoredKey;
  return image;
}

export async function createSanityArticleDraft(pkg: EditorialDraftPackage, options: DraftWriterOptions = {}) {
  const writeClient = createWriteClient();
  const taxonomy = taxonomyForEditorialCategory(pkg.editorial.category);
  const [category, province, competition, imageSelection] = await Promise.all([
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
    selectEditorialImages(writeClient, pkg, options.editorialImageId),
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
    ...(imageSelection.hero ? { featuredImage: toFeaturedImage(imageSelection.hero) } : {}),
    keyPoints: pkg.article.keyPoints,
    body: portableTextBody(pkg.article, imageSelection.inline),
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
    editorialImageId: imageSelection.hero?._id,
    inlineEditorialImageIds: imageSelection.inline.map(({ image }) => image._id),
    automationContentClass,
    morningPackageEligible,
    studioIntent: `/intent/edit/id=${result._id};type=article`,
  };
}
