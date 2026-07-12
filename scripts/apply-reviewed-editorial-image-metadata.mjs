import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const decisionsFile = process.env.EDITORIAL_METADATA_DECISIONS_FILE;
const applyChanges = process.env.EDITORIAL_METADATA_APPLY === "true";
const outputDirectory = process.env.EDITORIAL_METADATA_APPLY_OUTPUT_DIR ?? "artifacts/editorial-image-metadata-apply";

if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is required.");
if (!token) throw new Error("SANITY_API_TOKEN is required.");
if (!decisionsFile) throw new Error("EDITORIAL_METADATA_DECISIONS_FILE is required.");

const allowedFields = new Set(["altText", "caption", "publicCredit", "copyrightLine", "tags"]);
const source = JSON.parse(await readFile(decisionsFile, "utf8"));
if (source.dataset !== dataset) throw new Error(`Decision dataset ${source.dataset} does not match ${dataset}.`);
if (!Array.isArray(source.decisions)) throw new Error("decisions must be an array.");

function isBlank(value) {
  return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
}

async function sanityRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  if (!response.ok) throw new Error(`Sanity request failed (${response.status}): ${await response.text()}`);
  return response.json();
}

async function getDocument(id) {
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set("query", `*[_type == "editorialImage" && _id == $id][0]`);
  url.searchParams.set("$id", JSON.stringify(id));
  return (await sanityRequest(url)).result;
}

const results = [];
for (const decision of source.decisions) {
  const id = decision.documentId;
  if (!id || id.startsWith("drafts.")) {
    results.push({ documentId: id, status: "rejected", reason: "Draft or missing document ID" });
    continue;
  }
  if (!decision.reviewedBy || !decision.reviewedAt) {
    results.push({ documentId: id, status: "rejected", reason: "Missing review metadata" });
    continue;
  }

  const document = await getDocument(id);
  if (!document) {
    results.push({ documentId: id, status: "rejected", reason: "Editorial Image not found" });
    continue;
  }
  if (["rejected", "archived"].includes(document.lifecycleStatus)) {
    results.push({ documentId: id, status: "rejected", reason: `Inactive lifecycle: ${document.lifecycleStatus}` });
    continue;
  }

  const patch = {};
  const skipped = [];
  for (const [field, value] of Object.entries(decision.approvedFields ?? {})) {
    if (!allowedFields.has(field)) {
      skipped.push({ field, reason: "Field is not allow-listed" });
      continue;
    }
    if (isBlank(value)) {
      skipped.push({ field, reason: "Approved value is blank" });
      continue;
    }
    if (!isBlank(document[field])) {
      skipped.push({ field, reason: "Existing Sanity value is non-empty" });
      continue;
    }
    patch[field] = value;
  }

  if (Object.keys(patch).length === 0) {
    results.push({ documentId: id, title: document.title, status: "no-change", skipped });
    continue;
  }

  if (applyChanges) {
    const mutationUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}?returnIds=true`;
    await sanityRequest(mutationUrl, {
      method: "POST",
      body: JSON.stringify({ mutations: [{ patch: { id, set: patch } }] }),
    });
  }

  results.push({
    documentId: id,
    title: document.title,
    status: applyChanges ? "applied" : "dry-run",
    patch,
    skipped,
    reviewedBy: decision.reviewedBy,
    reviewedAt: decision.reviewedAt,
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  dataset,
  mode: applyChanges ? "apply" : "dry-run",
  summary: {
    decisions: results.length,
    applicable: results.filter((item) => item.status === "dry-run" || item.status === "applied").length,
    applied: results.filter((item) => item.status === "applied").length,
    noChange: results.filter((item) => item.status === "no-change").length,
    rejected: results.filter((item) => item.status === "rejected").length,
  },
  results,
};

await mkdir(outputDirectory, { recursive: true });
const jsonPath = path.join(outputDirectory, "editorial-image-metadata-apply.json");
const markdownPath = path.join(outputDirectory, "editorial-image-metadata-apply.md");
const lines = [
  "# Editorial Image Metadata Apply Report",
  "",
  `Generated: ${report.generatedAt}`,
  `Mode: ${report.mode}`,
  `Dataset: ${dataset}`,
  "",
  "## Summary",
  "",
  `- Decisions: ${report.summary.decisions}`,
  `- Applicable: ${report.summary.applicable}`,
  `- Applied: ${report.summary.applied}`,
  `- No change: ${report.summary.noChange}`,
  `- Rejected: ${report.summary.rejected}`,
  "",
  "## Results",
  "",
];
for (const item of results) {
  lines.push(`- ${item.documentId}: ${item.status}${item.reason ? ` — ${item.reason}` : ""}`);
}
await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
await writeFile(markdownPath, `${lines.join("\n")}\n`, "utf8");
if (process.env.GITHUB_STEP_SUMMARY) await writeFile(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`, { encoding: "utf8", flag: "a" });
console.log(JSON.stringify(report.summary, null, 2));
