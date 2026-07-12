import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const outputDirectory =
  process.env.EDITORIAL_METADATA_SUGGESTIONS_OUTPUT_DIR ??
  "artifacts/editorial-image-metadata-suggestions";

if (!projectId) {
  throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is required.");
}

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
  creator,
  attribution,
  license,
  licenseUrl,
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

function cleanTitle(value = "") {
  return value
    .replace(/\.[a-z0-9]{2,5}$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^\s+|\s+$/g, "")
    .replace(/\s*\([^)]*\)\s*$/g, "")
    .trim();
}

function sentenceCase(value) {
  if (!value) return value;
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function inferAltText(record) {
  const title = cleanTitle(record.title);
  if (!title) return null;

  const lower = title.toLowerCase();
  if (lower.includes("supporter")) return sentenceCase(`${title} at a rugby event`);
  if (lower.includes("stadium")) return sentenceCase(`${title} rugby stadium view`);
  if (lower.includes("pitch")) return sentenceCase(`${title} rugby pitch`);
  if (lower.includes("goal post") || lower.includes("goalposts") || lower.includes("rugby goal")) {
    return sentenceCase(`${title} showing rugby goalposts and pitch markings`);
  }
  if (lower.includes("rugby ball") || lower.includes("gilbert")) {
    return sentenceCase(`${title} showing a rugby ball on grass`);
  }
  if (lower.includes("referee")) return sentenceCase(`${title} showing rugby referees`);
  if (lower.includes("portrait") || lower.includes("group")) return sentenceCase(title);

  return sentenceCase(title);
}

function inferCaption(record) {
  const title = cleanTitle(record.title);
  if (!title) return null;

  const context = [record.venue, ...(record.teams ?? []), record.eventAlbum]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(" · ");

  return context ? `${sentenceCase(title)}. ${context}.` : `${sentenceCase(title)}.`;
}

function inferCredit(record) {
  if (record.sourceClassification === "the-rugby-panda-original") {
    return "Photo: The Rugby Panda";
  }

  if (!isBlank(record.attribution)) return record.attribution.trim();
  if (!isBlank(record.creator)) return `Photo: ${record.creator.trim()}`;
  if (!isBlank(record.source)) return `Photo: ${record.source.trim()}`;
  return null;
}

function inferCopyright(record) {
  if (record.sourceClassification === "the-rugby-panda-original") {
    return "© The Rugby Panda";
  }

  if (!isBlank(record.creator)) return `© ${record.creator.trim()}`;
  if (!isBlank(record.source)) return `© ${record.source.trim()}`;
  return null;
}

function inferTags(record) {
  const values = [
    ...(record.tags ?? []),
    ...(record.searchKeywords ?? []),
    ...(record.photoType ?? []),
    ...(record.teams ?? []),
    record.venue,
    record.eventAlbum,
    record.editorialCategory,
  ];

  return [...new Set(values.filter(Boolean).map((value) => String(value).trim()).filter(Boolean))].slice(0, 20);
}

function rightsBlockers(record) {
  if (record.sourceClassification === "the-rugby-panda-original") return [];

  const blockers = [];
  if (isBlank(record.sourceUrl) && isBlank(record.foreignLandingUrl) && isBlank(record.originalLandingPage)) {
    blockers.push("No source or landing-page URL is stored");
  }
  if (isBlank(record.license) && isBlank(record.rightsNotes)) {
    blockers.push("No licence or rights notes are stored");
  }
  if (isBlank(record.creator) && isBlank(record.source) && isBlank(record.attribution)) {
    blockers.push("No creator, source, or attribution is stored; credit cannot be suggested safely");
  }
  return blockers;
}

function readinessBand(record, blockers, suggestions) {
  const missing = ["altText", "caption", "publicCredit", "copyrightLine"].filter((field) => isBlank(record[field]));
  const unresolved = missing.filter((field) => isBlank(suggestions[field]));

  if (record.lifecycleStatus === "rejected" || record.lifecycleStatus === "archived") return "not-active";
  if (blockers.length > 0 || unresolved.length > 0) return "rights-review-required";
  if (missing.length > 0) return "metadata-review-ready";
  return "already-complete";
}

function buildSuggestion(record) {
  const suggestions = {
    altText: isBlank(record.altText) ? inferAltText(record) : null,
    caption: isBlank(record.caption) ? inferCaption(record) : null,
    publicCredit: isBlank(record.publicCredit) ? inferCredit(record) : null,
    copyrightLine: isBlank(record.copyrightLine) ? inferCopyright(record) : null,
    tags: isBlank(record.tags) ? inferTags(record) : null,
  };

  const blockers = rightsBlockers(record);
  const changedFields = Object.entries(suggestions)
    .filter(([, value]) => !isBlank(value))
    .map(([field]) => field);

  return {
    _id: record._id,
    title: record.title,
    lifecycleStatus: record.lifecycleStatus,
    usageApproved: record.usageApproved === true,
    sourceClassification: record.sourceClassification,
    readinessBand: readinessBand(record, blockers, suggestions),
    changedFields,
    suggestions,
    blockers,
    reviewRequired: changedFields.length > 0 || blockers.length > 0,
  };
}

function markdownReport(report) {
  const lines = [
    "# Editorial Image Metadata Suggestions",
    "",
    `Generated: ${report.generatedAt}`,
    `Dataset: ${report.dataset}`,
    "",
    "This report contains reviewable suggestions only. No Sanity records were changed.",
    "",
    "## Summary",
    "",
    `- Total records assessed: ${report.summary.total}`,
    `- Records with suggestions: ${report.summary.withSuggestions}`,
    `- Metadata review ready: ${report.summary.metadataReviewReady}`,
    `- Rights review required: ${report.summary.rightsReviewRequired}`,
    `- Already complete: ${report.summary.alreadyComplete}`,
    `- Not active: ${report.summary.notActive}`,
    "",
    "## Suggested records",
    "",
  ];

  const actionable = report.records.filter((record) => record.reviewRequired);
  if (actionable.length === 0) {
    lines.push("No suggestions or blockers were found.");
  }

  for (const record of actionable) {
    lines.push(`### ${record.title || "Untitled"} (${record._id})`, "");
    lines.push(`Readiness: ${record.readinessBand}`);
    lines.push(`Status: ${record.lifecycleStatus ?? "unset"}; usage approved: ${record.usageApproved ? "yes" : "no"}`, "");

    if (record.changedFields.length > 0) {
      lines.push("Suggested metadata:", "");
      for (const field of record.changedFields) {
        const value = record.suggestions[field];
        lines.push(`- **${field}:** ${Array.isArray(value) ? value.join(", ") : value}`);
      }
      lines.push("");
    }

    if (record.blockers.length > 0) {
      lines.push("Blocking review items:", "");
      for (const blocker of record.blockers) lines.push(`- ${blocker}`);
      lines.push("");
    }
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
const suggestions = records.map(buildSuggestion);

const report = {
  generatedAt: new Date().toISOString(),
  projectId,
  dataset,
  mode: "suggestions-only",
  summary: {
    total: suggestions.length,
    withSuggestions: suggestions.filter((record) => record.changedFields.length > 0).length,
    metadataReviewReady: suggestions.filter((record) => record.readinessBand === "metadata-review-ready").length,
    rightsReviewRequired: suggestions.filter((record) => record.readinessBand === "rights-review-required").length,
    alreadyComplete: suggestions.filter((record) => record.readinessBand === "already-complete").length,
    notActive: suggestions.filter((record) => record.readinessBand === "not-active").length,
  },
  records: suggestions,
};

await mkdir(outputDirectory, { recursive: true });
const jsonPath = path.join(outputDirectory, "editorial-image-metadata-suggestions.json");
const markdownPath = path.join(outputDirectory, "editorial-image-metadata-suggestions.md");
await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
await writeFile(markdownPath, markdownReport(report), "utf8");

console.log(JSON.stringify(report.summary, null, 2));
console.log(`Wrote ${jsonPath}`);
console.log(`Wrote ${markdownPath}`);

if (process.env.GITHUB_STEP_SUMMARY) {
  await writeFile(process.env.GITHUB_STEP_SUMMARY, markdownReport(report), { encoding: "utf8", flag: "a" });
}
