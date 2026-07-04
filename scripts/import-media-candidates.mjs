import { readFile } from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "hvg4b508";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const inputPath = process.argv[2] ?? "data/media/apify-candidates.json";

const allowedLicenses = new Set(["cc0", "pdm", "by", "by-sa"]);
const blockedLicenses = new Set(["by-nc", "by-nc-sa", "by-nc-nd", "by-nd"]);
const allowedSourceClassifications = new Set([
  "The Rugby Panda Original",
  "Editorial Partner",
  "Open Licence",
  "Historic Archive",
]);
const allowedLifecycleStatuses = new Set(["Candidate", "Pending Validation", "Approved", "Published", "Archived"]);

if (!token) {
  console.error("Missing SANITY_API_TOKEN. Set a Sanity write token before importing media candidates.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

function requiredString(value, fieldName, index) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Candidate ${index + 1} is missing required field: ${fieldName}`);
  }

  return value.trim();
}

function stringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim());
}

function normalizedLicense(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function candidateId(candidate) {
  const stableInput = [candidate.externalId, candidate.imageUrl, candidate.sourceUrl, candidate.landingPageUrl]
    .filter(Boolean)
    .join("|");
  const hash = createHash("sha1").update(stableInput || randomUUID()).digest("hex").slice(0, 16);
  return `media-candidate-${hash}`;
}

function normalizeCandidate(candidate, index) {
  const title = requiredString(candidate.title, "title", index);
  const imageUrl = requiredString(candidate.imageUrl, "imageUrl", index);
  const sourceUrl = requiredString(candidate.sourceUrl ?? candidate.landingPageUrl, "sourceUrl", index);
  const license = normalizedLicense(candidate.license);
  const sourceClassification = candidate.sourceClassification ?? "Open Licence";
  const lifecycleStatus = candidate.lifecycleStatus ?? "Candidate";
  const usageApproved = Boolean(candidate.usageApproved);

  if (!allowedSourceClassifications.has(sourceClassification)) {
    throw new Error(`Candidate ${index + 1} has unsupported sourceClassification: ${sourceClassification}`);
  }

  if (!allowedLifecycleStatuses.has(lifecycleStatus)) {
    throw new Error(`Candidate ${index + 1} has unsupported lifecycleStatus: ${lifecycleStatus}`);
  }

  if (usageApproved && !allowedLicenses.has(license)) {
    throw new Error(`Candidate ${index + 1} cannot be usageApproved with licence: ${license || "missing"}`);
  }

  if (blockedLicenses.has(license)) {
    throw new Error(`Candidate ${index + 1} uses blocked licence for publication workflow: ${license}`);
  }

  if (usageApproved && lifecycleStatus === "Candidate") {
    throw new Error(`Candidate ${index + 1} cannot be usageApproved while lifecycleStatus is Candidate.`);
  }

  return {
    _id: candidateId({ ...candidate, imageUrl, sourceUrl }),
    _type: "editorialImage",
    title,
    imageUrl,
    thumbnailUrl: candidate.thumbnailUrl,
    sourceUrl,
    landingPageUrl: candidate.landingPageUrl ?? sourceUrl,
    creator: candidate.creator,
    creatorUrl: candidate.creatorUrl,
    license,
    licenseUrl: candidate.licenseUrl,
    attribution: candidate.attribution,
    width: Number.isFinite(candidate.width) ? candidate.width : undefined,
    height: Number.isFinite(candidate.height) ? candidate.height : undefined,
    provider: candidate.provider,
    acquisitionSource: candidate.acquisitionSource ?? "apify",
    acquisitionActor: candidate.acquisitionActor,
    acquisitionQuery: candidate.acquisitionQuery,
    sourceClassification,
    lifecycleStatus,
    editorialCategory: candidate.editorialCategory ?? "Evergreen",
    photoType: stringArray(candidate.photoType),
    tags: stringArray(candidate.tags),
    searchKeywords: stringArray(candidate.searchKeywords),
    orientation: candidate.orientation,
    editorialRating: Number.isFinite(candidate.editorialRating) ? candidate.editorialRating : 3,
    editorialValue: candidate.editorialValue ?? "Evergreen",
    suggestedUse: stringArray(candidate.suggestedUse),
    publicCredit: candidate.publicCredit,
    copyrightLine: candidate.copyrightLine,
    usageApproved,
    validationNotes: candidate.validationNotes,
    acquiredAt: candidate.acquiredAt ?? new Date().toISOString(),
  };
}

const raw = await readFile(inputPath, "utf8");
const candidates = JSON.parse(raw);

if (!Array.isArray(candidates)) {
  throw new Error("Input file must contain an array of media candidates.");
}

const normalized = candidates.map(normalizeCandidate);
const transaction = client.transaction();

for (const candidate of normalized) {
  transaction.createOrReplace(candidate);
}

await transaction.commit();
console.log(`Imported ${normalized.length} media candidate records into ${projectId}/${dataset}.`);
