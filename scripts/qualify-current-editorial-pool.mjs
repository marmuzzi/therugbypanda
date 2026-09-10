import fs from "node:fs/promises";
import path from "node:path";
import { selectFreshPositions } from "../lib/editorial/StoryFreshness.ts";

const batchPath = path.resolve(process.env.BATCH_PATH || "data/editorial-acquisition/current-editorial-acquisition-batch.json");
const recentPath = path.resolve(process.env.RECENT_EDITORIAL_POSITIONS_PATH || "data/editorial-acquisition/recent-editorial-positions.json");
const reportPath = path.resolve(process.env.EDITORIAL_POOL_REPORT_PATH || "data/editorial-acquisition/current-editorial-pool.json");
const targetPool = Math.max(5, Number.parseInt(process.env.EDITORIAL_POOL_TARGET || "8", 10) || 8);
const minPackage = 5;

const batch = JSON.parse(await fs.readFile(batchPath, "utf8"));
const recentRaw = JSON.parse(await fs.readFile(recentPath, "utf8"));
const recentPositions = Array.isArray(recentRaw) ? recentRaw : recentRaw.positions;
if (!Array.isArray(batch?.candidates) || !Array.isArray(recentPositions)) {
  throw new Error("Canonical editorial pool fail-closed: invalid acquisition batch or recent positions.");
}

const positions = batch.candidates.map((candidate) => ({
  id: candidate.id,
  subject: candidate.editorialPosition?.subject || candidate.title || "",
  development: candidate.editorialPosition?.development || candidate.summary || "",
  angle: candidate.editorialPosition?.angle || candidate.summary || "",
  occurredAt: candidate.editorialPosition?.occurredAt || candidate.primaryPublishedAt,
}));
const freshness = selectFreshPositions(positions, recentPositions, positions.length);
const freshIds = new Set(freshness.selected.map((position) => position.id));
const eligible = batch.candidates.filter((candidate) => freshIds.has(candidate.id));
const rejected = batch.candidates.filter((candidate) => !freshIds.has(candidate.id)).map((candidate) => ({
  id: candidate.id,
  title: candidate.title,
  status: "duplicate-or-stale",
}));

batch.candidates = eligible;
batch.editorialPool = {
  checkedAt: new Date().toISOString(),
  targetPool,
  minimumPackage: minPackage,
  inputCount: positions.length,
  eligibleCount: eligible.length,
  reserveCount: Math.max(0, eligible.length - minPackage),
  status: eligible.length >= targetPool ? "target-met" : eligible.length >= minPackage ? "package-met-reserve-thin" : "insufficient",
  rejected,
};
await fs.writeFile(batchPath, `${JSON.stringify(batch, null, 2)}\n`, "utf8");
await fs.writeFile(reportPath, `${JSON.stringify(batch.editorialPool, null, 2)}\n`, "utf8");

if (eligible.length < minPackage) {
  throw new Error(`Canonical editorial pool fail-closed: only ${eligible.length}/${minPackage} eligible positions; free discovery must expand before paid generation.`);
}
console.log(JSON.stringify({ canonicalEditorialPool: "passed", ...batch.editorialPool }, null, 2));
