import fs from "node:fs/promises";
import path from "node:path";

const [inputPath] = process.argv.slice(2);
if (!inputPath) {
  console.error("Usage: node scripts/import-editorial-acquisition-batch.mjs <batch.json>");
  process.exit(1);
}

const baseUrl = (process.env.EDITORIAL_API_BASE_URL || "https://therugbypanda.ie").replace(/\/$/, "");
const secret = process.env.EDITORIAL_AUTOMATION_SECRET?.trim();
const dryRun = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";

if (!secret && !dryRun) {
  throw new Error("EDITORIAL_AUTOMATION_SECRET is required unless DRY_RUN=1.");
}

const raw = await fs.readFile(path.resolve(inputPath), "utf8");
const batch = JSON.parse(raw);

if (batch?.schemaVersion !== "1.0" || !Array.isArray(batch?.candidates) || batch.candidates.length === 0) {
  throw new Error("Invalid editorial acquisition batch.");
}

function buildRequest(candidate) {
  const retrievedAt = batch.acquiredAt || new Date().toISOString();
  const sourceRecords = candidate.sourceRecords.map((source) => ({ ...source, retrievedAt }));
  const sourceIds = sourceRecords.map((source) => source.id);
  return {
    story: {
      id: candidate.id,
      title: candidate.title,
      summary: candidate.summary,
      sourceRecords,
      discoveredAt: retrievedAt,
      suggestedCategory: candidate.suggestedCategory,
    },
    factLedger: {
      facts: candidate.facts.map((claim, index) => ({
        id: `${candidate.id}-fact-${index + 1}`,
        claim,
        status: "confirmed",
        confidence: 98,
        sourceIds,
        usableInDraft: true,
      })),
      unsupportedClaims: [],
      conflicts: [],
    },
    createSanityDraft: true,
    qaMode: false,
  };
}

const results = [];
for (const candidate of batch.candidates) {
  const payload = buildRequest(candidate);
  if (dryRun) {
    results.push({ id: candidate.id, status: "dry-run", payload });
    continue;
  }

  const response = await fetch(`${baseUrl}/api/editorial/draft`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${secret}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({ error: "Non-JSON response" }));
  results.push({ id: candidate.id, status: response.status, ok: response.ok, body });

  if (!response.ok) {
    console.error(JSON.stringify(results, null, 2));
    process.exit(2);
  }
}

console.log(JSON.stringify({ batchId: batch.batchId, results }, null, 2));
