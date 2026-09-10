import fs from "node:fs/promises";
import path from "node:path";
import { selectFreshPositions } from "../lib/editorial/StoryFreshness.ts";

const batchPath = path.resolve(process.env.BATCH_PATH || "data/editorial-acquisition/current-editorial-acquisition-batch.json");
const recentPath = path.resolve(process.env.RECENT_EDITORIAL_POSITIONS_PATH || "data/editorial-acquisition/recent-editorial-positions.json");
const reportPath = path.resolve(process.env.PRODUCTION_HISTORY_FRESHNESS_REPORT_PATH || "data/editorial-acquisition/current-production-history-freshness.json");

const batch = JSON.parse(await fs.readFile(batchPath, "utf8"));
const recentRaw = JSON.parse(await fs.readFile(recentPath, "utf8"));
const recentPositions = Array.isArray(recentRaw) ? recentRaw : recentRaw.positions;
if (!Array.isArray(batch?.candidates) || !Array.isArray(recentPositions)) {
  throw new Error("Production-history freshness filter fail-closed: batch or recent positions are invalid.");
}

const positions = batch.candidates.map((candidate) => ({
  id: candidate.id,
  subject: candidate.editorialPosition?.subject || candidate.title || "",
  development: candidate.editorialPosition?.development || candidate.summary || "",
  angle: candidate.editorialPosition?.angle || candidate.summary || "",
  occurredAt: candidate.editorialPosition?.occurredAt || candidate.primaryPublishedAt,
}));
const result = selectFreshPositions(positions, recentPositions, positions.length);
const freshIds = new Set(result.selected.map((position) => position.id));
const before = batch.candidates.length;
const retained = batch.candidates.filter((candidate) => freshIds.has(candidate.id));
const rejected = batch.candidates.filter((candidate) => !freshIds.has(candidate.id)).map((candidate) => ({ id: candidate.id, title: candidate.title }));

if (retained.length < 5) {
  throw new Error(`Production-history freshness filter fail-closed before diversity/model spend: only ${retained.length}/5 fresh candidates remain.`);
}

batch.candidates = retained;
batch.productionHistoryFreshness = {
  checkedAt: new Date().toISOString(),
  before,
  after: retained.length,
  rejectedCount: rejected.length,
  rejected,
};
await fs.writeFile(batchPath, `${JSON.stringify(batch, null, 2)}\n`, "utf8");
await fs.writeFile(reportPath, `${JSON.stringify(batch.productionHistoryFreshness, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ productionHistoryFreshness: "passed", before, after: retained.length, rejectedCount: rejected.length, rejected }, null, 2));
