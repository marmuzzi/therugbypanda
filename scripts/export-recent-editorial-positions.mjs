import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "hvg4b508";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const outputPath = process.env.RECENT_EDITORIAL_POSITIONS_PATH?.trim() || "data/editorial-acquisition/recent-editorial-positions.json";
const lookbackDays = Math.max(2, Number.parseInt(process.env.EDITORIAL_FRESHNESS_LOOKBACK_DAYS || "14", 10) || 14);

if (!token) throw new Error("Missing SANITY_API_TOKEN; freshness history cannot be exported safely.");

function operationalDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Dublin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const since = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000).toISOString();
const currentPrefix = `current-${operationalDate()}-*`;

const rows = await client.fetch(`*[
  _type == "article" &&
  automationContentClass == "production" &&
  coalesce(editorialGeneratedAt, _updatedAt) >= $since &&
  !(editorialInputId match $currentPrefix && morningPackageEligible != true)
] | order(coalesce(editorialGeneratedAt, _updatedAt) desc) {
  _id,
  title,
  editorialAngle,
  sourceStoryTitle,
  sourceStorySummary,
  sourceStoryDiscoveredAt,
  editorialGeneratedAt,
  _updatedAt
}`, { since, currentPrefix });

if (!Array.isArray(rows)) throw new Error("Sanity freshness-history query did not return an array.");

const positions = rows.map((row) => ({
  id: row._id,
  subject: row.sourceStoryTitle || row.title || "",
  development: row.sourceStorySummary || row.title || "",
  angle: row.editorialAngle || row.sourceStorySummary || row.title || "",
  occurredAt: row.sourceStoryDiscoveredAt || row.editorialGeneratedAt || row._updatedAt,
})).filter((position) => position.subject && position.development && position.angle);

if (positions.length === 0) {
  throw new Error(`Freshness fail-closed: no production editorial positions found in Sanity for the last ${lookbackDays} days.`);
}

await fs.mkdir(path.dirname(path.resolve(outputPath)), { recursive: true });
await fs.writeFile(path.resolve(outputPath), `${JSON.stringify({
  schemaVersion: "1.0",
  generatedAt: new Date().toISOString(),
  source: "sanity-production",
  lookbackDays,
  positions,
}, null, 2)}\n`, "utf8");

console.log(JSON.stringify({ outputPath, lookbackDays, positionCount: positions.length, source: "sanity-production", excludedIneligibleCurrentDay: true }, null, 2));
