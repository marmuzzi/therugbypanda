import fs from "node:fs/promises";
import path from "node:path";

import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "hvg4b508";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const authToken = process.env.SANITY_API_TOKEN;
const inputPath = process.env.BRAND_ASSET_CANDIDATES_FILE ?? "data/brand-assets/candidate-collection-2026-07-05.json";

if (!authToken) {
  throw new Error("Missing Sanity write token environment variable.");
}

const client = createClient({ projectId, dataset, apiVersion, token: authToken, useCdn: false });

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

function text(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normaliseBrandType(value) {
  const brandType = text(value);

  if (brandType === "club") return "team";
  if (brandType === "governing-body") return "union";

  return brandType;
}

function normaliseLogoCandidate(value, fallbackFormat, index) {
  if (typeof value === "string") {
    return {
      _key: `candidateLogo${index}`,
      _type: "object",
      url: value,
      format: text(fallbackFormat),
      notes: "External candidate reference only. Do not hotlink publicly.",
    };
  }

  if (value && typeof value === "object" && typeof value.url === "string") {
    return {
      _key: text(value._key) ?? `candidateLogo${index}`,
      _type: "object",
      url: value.url,
      format: text(value.format) ?? text(fallbackFormat),
      notes: text(value.notes) ?? "External candidate reference only. Do not hotlink publicly.",
    };
  }

  return undefined;
}

function toLogoCandidates(candidate) {
  return Array.isArray(candidate.candidateLogoUrls)
    ? candidate.candidateLogoUrls
        .map((logoCandidate, index) => normaliseLogoCandidate(logoCandidate, candidate.logoFormat, index))
        .filter(Boolean)
    : [];
}

function toRawSourceMetadata(candidate) {
  const rawSourceMetadata = candidate.rawSourceMetadata ?? {};

  return {
    sourceFile: inputPath,
    ...rawSourceMetadata,
  };
}

function toBrandAsset(candidate) {
  const slug = slugify(candidate.officialBrandName ?? candidate.shortName);
  const rawSourceMetadata = toRawSourceMetadata(candidate);
  const candidateLogoUrls = toLogoCandidates(candidate);
  const firstLogoUrl = candidateLogoUrls.find((logoCandidate) => logoCandidate.url)?.url;

  return {
    _id: `brandAsset-candidate-${slug}`,
    _type: "brandAsset",
    title: candidate.officialBrandName,
    shortName: text(candidate.shortName),
    slug: { _type: "slug", current: slug },
    brandType: normaliseBrandType(candidate.brandType),
    status: "active",
    lifecycleStatus: "candidate",
    approvedForEditorialUse: false,
    rightsStatus: "editorial-trademark-use-only",
    website: text(candidate.officialWebsite),
    sourceUrl: text(candidate.sourcePageUrl),
    externalLogoUrl: text(firstLogoUrl),
    candidateLogoUrls,
    logoFormat: text(candidate.logoFormat),
    primaryColour: text(candidate.colours?.primary),
    secondaryColour: text(candidate.colours?.secondary),
    accentColour: text(candidate.colours?.accent),
    colourSource: text(candidate.colours?.source),
    rightsHolder: text(candidate.rightsHolder),
    usageNotes: text(candidate.rightsTrademarkNotes),
    acquisitionTimestamp: text(candidate.acquisitionTimestamp),
    apifyRunId: text(rawSourceMetadata.apifyRunId),
    apifyDatasetId: text(rawSourceMetadata.datasetId),
    rawSourceMetadata: JSON.stringify(rawSourceMetadata, null, 2),
    tags: ["brand-asset-candidate", "needs-review"],
  };
}

function getCandidates(collection) {
  if (Array.isArray(collection.candidates)) return collection.candidates;
  if (Array.isArray(collection.targetedResults)) return collection.targetedResults;

  return [];
}

const filePath = path.resolve(process.cwd(), inputPath);
const collection = JSON.parse(await fs.readFile(filePath, "utf8"));
const candidates = getCandidates(collection);

if (candidates.length === 0) {
  throw new Error(`No candidates found in ${inputPath}. Expected a top-level candidates or targetedResults array.`);
}

const documents = candidates.map(toBrandAsset);
const existingDocuments = await client.fetch(
  '*[_id in $ids]{_id,lifecycleStatus,approvedForEditorialUse,title}',
  { ids: documents.map((document) => document._id) },
);
const existingById = new Map(existingDocuments.map((document) => [document._id, document]));

let transaction = client.transaction();
let created = 0;
let updated = 0;
let skippedApproved = 0;

for (const document of documents) {
  const existingDocument = existingById.get(document._id);
  const isApproved = existingDocument?.approvedForEditorialUse === true || existingDocument?.lifecycleStatus === "approved";

  if (isApproved) {
    skippedApproved += 1;
    console.log(`Skipped approved brand asset: ${document.title} (${document._id})`);
    continue;
  }

  if (!existingDocument) {
    transaction = transaction.createIfNotExists(document);
    created += 1;
    continue;
  }

  transaction = transaction.patch(document._id, (patch) =>
    patch.set({
      title: document.title,
      shortName: document.shortName,
      slug: document.slug,
      brandType: document.brandType,
      status: "active",
      lifecycleStatus: "candidate",
      approvedForEditorialUse: false,
      rightsStatus: "editorial-trademark-use-only",
      website: document.website,
      sourceUrl: document.sourceUrl,
      externalLogoUrl: document.externalLogoUrl,
      candidateLogoUrls: document.candidateLogoUrls,
      logoFormat: document.logoFormat,
      primaryColour: document.primaryColour,
      secondaryColour: document.secondaryColour,
      accentColour: document.accentColour,
      colourSource: document.colourSource,
      rightsHolder: document.rightsHolder,
      usageNotes: document.usageNotes,
      acquisitionTimestamp: document.acquisitionTimestamp,
      apifyRunId: document.apifyRunId,
      apifyDatasetId: document.apifyDatasetId,
      rawSourceMetadata: document.rawSourceMetadata,
      tags: document.tags,
    }),
  );
  updated += 1;
}

if (created === 0 && updated === 0) {
  console.log(`No unapproved brand asset candidates needed importing or updating from ${inputPath}.`);
} else {
  await transaction.commit();
}

console.log(
  `Processed ${candidates.length} brand asset candidates from ${inputPath}: created ${created}, updated ${updated}, skipped approved ${skippedApproved}.`,
);
console.log(`Target dataset: ${projectId}/${dataset}.`);
