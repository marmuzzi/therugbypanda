import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";
import { selectFreshPositions } from "../lib/editorial/StoryFreshness.ts";
import { excludePreviouslyPaidCandidates, productionDraftAttemptedIds } from "../lib/editorial/PaidAttemptEligibility.ts";

const batchPath = path.resolve(process.env.BATCH_PATH || "data/editorial-acquisition/current-editorial-acquisition-batch.json");
const recentPath = path.resolve(process.env.RECENT_EDITORIAL_POSITIONS_PATH || "data/editorial-acquisition/recent-editorial-positions.json");
const reportPath = path.resolve(process.env.EDITORIAL_POOL_REPORT_PATH || "data/editorial-acquisition/current-editorial-pool.json");
const packageSize = 5;
const reserveTarget = Math.max(0, Number.parseInt(process.env.EDITORIAL_POOL_RESERVE || "3", 10) || 0);
const strict = process.env.EDITORIAL_POOL_STRICT === "1";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("Canonical editorial pool requires Sanity project ID and token for paid-attempt eligibility.");

const operationalDate = () => new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Dublin", year: "numeric", month: "2-digit", day: "2-digit",
}).format(new Date());

const batch = JSON.parse(await fs.readFile(batchPath, "utf8"));
const recentRaw = JSON.parse(await fs.readFile(recentPath, "utf8"));
const recentPositions = Array.isArray(recentRaw) ? recentRaw : recentRaw.positions;
if (!Array.isArray(batch?.candidates) || !Array.isArray(recentPositions)) {
  throw new Error("Canonical editorial pool fail-closed: invalid acquisition batch or recent positions.");
}

const packageDate = operationalDate();
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
const budget = await client.fetch(`*[_id == $id][0]{reservedUsd,events[]{purpose,amountUsd}}`, { id: `editorial-ai-budget-${packageDate}` });
const paidAttemptedIds = productionDraftAttemptedIds(budget?.events);
const paidEligibility = excludePreviouslyPaidCandidates(batch.candidates, paidAttemptedIds);

const retainedCount = Math.min(packageSize, Math.max(0, Number(batch?.provenance?.concreteEvidenceGate?.retainedEligibleCount || 0)));
const missingSlots = Math.max(0, packageSize - retainedCount);
const minimumEligible = missingSlots;
const targetEligible = missingSlots === 0 ? 0 : missingSlots + reserveTarget;
const positions = paidEligibility.eligible.map((candidate) => ({
  id: candidate.id,
  subject: candidate.editorialPosition?.subject || candidate.title || "",
  development: candidate.editorialPosition?.development || candidate.summary || "",
  angle: candidate.editorialPosition?.angle || candidate.summary || "",
  occurredAt: candidate.editorialPosition?.occurredAt || candidate.primaryPublishedAt,
}));
const freshness = selectFreshPositions(positions, recentPositions, positions.length);
const freshIds = new Set(freshness.selected.map((position) => position.id));
const eligible = paidEligibility.eligible.filter((candidate) => freshIds.has(candidate.id));
const rejected = [
  ...paidEligibility.excluded.map((candidate) => ({ id: candidate.id, title: candidate.title, status: "already-paid-today" })),
  ...paidEligibility.eligible.filter((candidate) => !freshIds.has(candidate.id)).map((candidate) => ({
    id: candidate.id,
    title: candidate.title,
    status: "duplicate-or-stale",
  })),
];
const packageSufficient = eligible.length >= minimumEligible;
const targetMet = eligible.length >= targetEligible;

batch.candidates = eligible;
batch.editorialPool = {
  checkedAt: new Date().toISOString(),
  packageDate,
  packageSize,
  retainedCount,
  missingSlots,
  reserveTarget,
  minimumEligible,
  targetEligible,
  inputCount: batch.candidates.length + rejected.length,
  unpaidInputCount: paidEligibility.eligible.length,
  previouslyPaidExcludedCount: paidEligibility.excluded.length,
  previouslyPaidExcludedIds: paidEligibility.excluded.map((candidate) => candidate.id),
  reservedUsd: Number(budget?.reservedUsd || 0),
  eligibleCount: eligible.length,
  reserveCount: Math.max(0, eligible.length - missingSlots),
  packageSufficient,
  targetMet,
  status: targetMet ? "target-met" : packageSufficient ? "package-met-reserve-thin" : "refill-required",
  rejected,
};
await fs.writeFile(batchPath, `${JSON.stringify(batch, null, 2)}\n`, "utf8");
await fs.writeFile(reportPath, `${JSON.stringify(batch.editorialPool, null, 2)}\n`, "utf8");
if (process.env.GITHUB_OUTPUT) {
  await fs.appendFile(process.env.GITHUB_OUTPUT, `sufficient=${targetMet}\npackage_sufficient=${packageSufficient}\neligible_count=${eligible.length}\ntarget_eligible=${targetEligible}\nminimum_eligible=${minimumEligible}\nmissing_slots=${missingSlots}\n`);
}
if (!packageSufficient && strict) {
  throw new Error(`Canonical editorial pool fail-closed after free refill: retained ${retainedCount}, missing ${missingSlots}, unpaid fresh eligible ${eligible.length}/${minimumEligible} minimum; reserve target ${reserveTarget} (${targetEligible} total) was not treated as mandatory.`);
}
console.log(JSON.stringify({ canonicalEditorialPool: targetMet ? "target-met" : packageSufficient ? "package-met-reserve-thin" : "refill-required", ...batch.editorialPool }, null, 2));
