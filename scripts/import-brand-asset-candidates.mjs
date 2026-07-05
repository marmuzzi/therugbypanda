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

function toLogoCandidates(candidate) {
  return Array.isArray(candidate.candidateLogoUrls)
    ? candidate.candidateLogoUrls.filter(Boolean).map((url, index) => ({
        _key: `candidateLogo${index}`,
        _type: "object",
        url,
        format: text(candidate.logoFormat),
        notes: "External candidate reference only. Do not hotlink publicly.",
      }))
    : [];
}

function toBrandAsset(candidate) {
  const slug = slugify(candidate.officialBrandName ?? candidate.shortName);
  const rawSourceMetadata = candidate.rawSourceMetadata ?? {};
  const firstLogoUrl = candidate.candidateLogoUrls?.find(Boolean);

  return {
    _id: `brandAsset-candidate-${slug}`,
    _type: "brandAsset",
    title: candidate.officialBrandName,
    shortName: text(candidate.shortName),
    slug: { _type: "slug", current: slug },
    brandType: candidate.brandType,
    status: "active",
    lifecycleStatus: "candidate",
    approvedForEditorialUse: false,
    rightsStatus: "editorial-trademark-use-only",
    website: text(candidate.officialWebsite),
    sourceUrl: text(candidate.sourcePageUrl),
    externalLogoUrl: text(firstLogoUrl),
    candidateLogoUrls: toLogoCandidates(candidate),
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

const filePath = path.resolve(process.cwd(), inputPath);
const collection = JSON.parse(await fs.readFile(filePath, "utf8"));
const candidates = Array.isArray(collection.candidates) ? collection.candidates : [];

if (candidates.length === 0) {
  throw new Error(`No candidates found in ${inputPath}.`);
}

let transaction = client.transaction();
for (const candidate of candidates) {
  transaction = transaction.createIfNotExists(toBrandAsset(candidate));
}

await transaction.commit();
console.log(`Imported ${candidates.length} unapproved brand asset candidates into ${projectId}/${dataset}.`);
