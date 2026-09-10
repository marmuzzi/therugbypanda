import fs from "node:fs/promises";
import path from "node:path";
import { selectFreshPositions } from "../lib/editorial/StoryFreshness.ts";

const batchPath = path.resolve(process.env.BATCH_PATH || "data/editorial-acquisition/current-editorial-acquisition-batch.json");
const recentPath = path.resolve(process.env.RECENT_EDITORIAL_POSITIONS_PATH || "data/editorial-acquisition/recent-editorial-positions.json");
const reportPath = path.resolve(process.env.EDITORIAL_POOL_REPORT_PATH || "data/editorial-acquisition/current-editorial-pool.json");
const packageSize = 5;
const reserveTarget = Math.max(0, Number.parseInt(process.env.EDITORIAL_POOL_RESERVE || "3", 10) || 0);
const strict = process.env.EDITORIAL_POOL_STRICT === "1";

const batch = JSON.parse(await fs.readFile(batchPath, "utf8"));
const recentRaw = JSON.parse(await fs.readFile(recentPath, "utf8"));
const recentPositions = Array.isArray(recentRaw) ? recentRaw : recentRaw.positions;
if (!Array.isArray(batch?.candidates) || !Array.isArray(recentPositions)) {
  throw new Error("Canonical editorial pool fail-closed: invalid acquisition batch or recent positions.");
}

const retainedCount = Math.min(packageSize, Math.max(0, Number(batch?.provenance?.concreteEvidenceGate?.retainedEligibleCount || 0)));
const missingSlots = Math.max(0, packageSize - retainedCount);
const requiredEligible = missingSlots === 0 ? 0 : missingSlots + reserveTarget;
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
const sufficient = eligible.length >= requiredEligible;

batch.candidates = eligible;
batch.editorialPool = {
  checkedAt: new Date().toISOString(),
  packageSize,
  retainedCount,
  missingSlots,
  reserveTarget,
  requiredEligible,
  inputCount: positions.length,
  eligibleCount: eligible.length,
  reserveCount: Math.max(0, eligible.length - missingSlots),
  sufficient,
  status: sufficient ? "target-met" : "refill-required",
  rejected,
};
await fs.writeFile(batchPath, `${JSON.stringify(batch, null, 2)}\n`, "utf8");
await fs.writeFile(reportPath, `${JSON.stringify(batch.editorialPool, null, 2)}\n`, "utf8");
if (process.env.GITHUB_OUTPUT) {
  await fs.appendFile(process.env.GITHUB_OUTPUT, `sufficient=${sufficient}\neligible_count=${eligible.length}\nrequired_eligible=${requiredEligible}\nmissing_slots=${missingSlots}\n`);
}
if (!sufficient && strict) {
  throw new Error(`Canonical editorial pool fail-closed after free refill: retained ${retainedCount}, missing ${missingSlots}, eligible ${eligible.length}/${requiredEligible} including reserve ${reserveTarget}.`);
}
console.log(JSON.stringify({ canonicalEditorialPool: sufficient ? "passed" : "refill-required", ...batch.editorialPool }, null, 2));
