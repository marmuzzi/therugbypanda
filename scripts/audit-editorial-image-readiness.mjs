import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const outputDirectory = process.env.EDITORIAL_IMAGE_AUDIT_OUTPUT_DIR ?? "artifacts/editorial-image-audit";

if (!projectId) {
  throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is required.");
}

const requiredMetadataFields = [
  "title",
  "altText",
  "caption",
  "publicCredit",
  "copyrightLine",
  "sourceClassification",
  "editorialCategory",
  "editorialRating",
  "editorialValue",
  "suggestedUse",
  "lifecycleStatus",
];

const query = `*[_type == "editorialImage"] | order(_createdAt asc) {
  _id,
  _createdAt,
  _updatedAt,
  title,
  altText,
  caption,
  publicCredit,
  copyrightLine,
  sourceClassification,
  source,
  sourceUrl,
  foreignLandingUrl,
  originalLandingPage,
  license,
  licenseUrl,
  attribution,
  rightsNotes,
  lifecycleStatus,
  usageApproved,
  editorialCategory,
  editorialRating,
  editorialValue,
  suggestedUse,
  photoType,
  eventAlbum,
  venue,
  teams,
  tags,
  searchKeywords,
  orientation,
  width,
  height,
  dimensions,
  thumbnail,
  url,
  imageUrl,
  "assetRef": image.asset._ref
}`;

function isBlank(value) {
  return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
}

function duplicateGroups(records, keySelector) {
  const groups = new Map();

  for (const record of records) {
    const key = keySelector(record);
    if (!key) continue;
    const existing = groups.get(key) ?? [];
    existing.push(record._id);
    groups.set(key, existing);
  }

  return [...groups.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([key, ids]) => ({ key, ids }));
}

function publicationIssues(record) {
  const issues = [];
  const hasRenderableImage = Boolean(record.assetRef || record.imageUrl || record.url);

  if (!hasRenderableImage) issues.push("No Sanity asset or imported image URL");

  for (const field of requiredMetadataFields) {
    if (isBlank(record[field])) issues.push(`Missing ${field}`);
  }

  if (record.lifecycleStatus === "approved" && record.usageApproved !== true) {
    issues.push("Lifecycle is approved but usageApproved is not true");
  }

  if (record.usageApproved === true && record.lifecycleStatus !== "approved" && record.lifecycleStatus !== "published") {
    issues.push("usageApproved is true but lifecycle is not approved or published");
  }

  if (record.sourceClassification === "the-rugby-panda-original") {
    if (record.publicCredit !== "Photo: The Rugby Panda") issues.push("Original photo has incorrect public credit");
    if (record.copyrightLine !== "© The Rugby Panda") issues.push("Original photo has incorrect copyright line");
  }

  if (record.sourceClassification !== "the-rugby-panda-original") {
    if (isBlank(record.sourceUrl) && isBlank(record.foreignLandingUrl) && isBlank(record.originalLandingPage)) {
      issues.push("External image has no source or landing-page URL");
    }
    if (isBlank(record.license) && isBlank(record.rightsNotes)) {
      issues.push("External image has no licence or rights notes");
    }
  }

  return issues;
}

function markdownReport(report) {
  const lines = [
    "# Editorial Image Readiness Audit",
    "",
    `Generated: ${report.generatedAt}`,
    `Dataset: ${report.dataset}`,
    "",
    "## Summary",
    "",
    `- Total records: ${report.summary.total}`,
    `- Publication ready: ${report.summary.publicationReady}`,
    `- Needs attention: ${report.summary.needsAttention}`,
    `- Approved or published: ${report.summary.approvedOrPublished}`,
    `- Approved/published but not ready: ${report.summary.approvedButNotReady}`,
    `- Duplicate asset groups: ${report.summary.duplicateAssetGroups}`,
    `- Duplicate source groups: ${report.summary.duplicateSourceGroups}`,
    "",
    "## Records needing attention",
    "",
  ];

  if (report.recordsNeedingAttention.length === 0) {
    lines.push("No readiness issues found.");
  } else {
    for (const record of report.recordsNeedingAttention) {
      lines.push(`### ${record.title || "Untitled"} (${record._id})`);
      lines.push("");
      lines.push(`Status: ${record.lifecycleStatus ?? "unset"}; usage approved: ${record.usageApproved === true ? "yes" : "no"}`);
      lines.push("");
      for (const issue of record.issues) lines.push(`- ${issue}`);
      lines.push("");
    }
  }

  if (report.duplicates.assets.length > 0) {
    lines.push("## Duplicate Sanity assets", "");
    for (const group of report.duplicates.assets) lines.push(`- ${group.key}: ${group.ids.join(", ")}`);
    lines.push("");
  }

  if (report.duplicates.sources.length > 0) {
    lines.push("## Duplicate source references", "");
    for (const group of report.duplicates.sources) lines.push(`- ${group.key}: ${group.ids.join(", ")}`);
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

async function fetchRecords() {
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set("query", query);

  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    throw new Error(`Sanity query failed (${response.status}): ${await response.text()}`);
  }

  const payload = await response.json();
  return payload.result ?? [];
}

const records = await fetchRecords();
const auditedRecords = records.map((record) => {
  const issues = publicationIssues(record);
  return {
    ...record,
    publicationReady: issues.length === 0,
    issues,
  };
});

const duplicateAssets = duplicateGroups(auditedRecords, (record) => record.assetRef);
const duplicateSources = duplicateGroups(
  auditedRecords,
  (record) => record.imageUrl || record.url || record.sourceUrl || record.foreignLandingUrl || record.originalLandingPage,
);

const approvedOrPublished = auditedRecords.filter(
  (record) => record.lifecycleStatus === "approved" || record.lifecycleStatus === "published" || record.usageApproved === true,
);

const report = {
  generatedAt: new Date().toISOString(),
  projectId,
  dataset,
  summary: {
    total: auditedRecords.length,
    publicationReady: auditedRecords.filter((record) => record.publicationReady).length,
    needsAttention: auditedRecords.filter((record) => !record.publicationReady).length,
    approvedOrPublished: approvedOrPublished.length,
    approvedButNotReady: approvedOrPublished.filter((record) => !record.publicationReady).length,
    duplicateAssetGroups: duplicateAssets.length,
    duplicateSourceGroups: duplicateSources.length,
  },
  duplicates: {
    assets: duplicateAssets,
    sources: duplicateSources,
  },
  recordsNeedingAttention: auditedRecords
    .filter((record) => !record.publicationReady)
    .map(({ _id, title, lifecycleStatus, usageApproved, sourceClassification, issues }) => ({
      _id,
      title,
      lifecycleStatus,
      usageApproved,
      sourceClassification,
      issues,
    })),
  records: auditedRecords,
};

await mkdir(outputDirectory, { recursive: true });
const jsonPath = path.join(outputDirectory, "editorial-image-readiness.json");
const markdownPath = path.join(outputDirectory, "editorial-image-readiness.md");
await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
await writeFile(markdownPath, markdownReport(report), "utf8");

console.log(JSON.stringify(report.summary, null, 2));
console.log(`Wrote ${jsonPath}`);
console.log(`Wrote ${markdownPath}`);

if (process.env.GITHUB_STEP_SUMMARY) {
  await writeFile(process.env.GITHUB_STEP_SUMMARY, markdownReport(report), { encoding: "utf8", flag: "a" });
}
