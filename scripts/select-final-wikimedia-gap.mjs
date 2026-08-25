import fs from "node:fs/promises";
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "hvg4b508";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const candidatePath = process.env.WIKIMEDIA_CANDIDATE_FILE ?? "/tmp/wikimedia-candidates.json";
const outputPath = process.env.WIKIMEDIA_REVIEW_FILE ?? "artifacts/final-seven/wikimedia-reviewed.json";
const targetCount = Number.parseInt(process.env.WIKIMEDIA_GAP_TARGET ?? "7", 10);

if (!token) throw new Error("Missing SANITY_API_TOKEN.");
if (!Number.isInteger(targetCount) || targetCount < 1) throw new Error("WIKIMEDIA_GAP_TARGET must be a positive integer.");

const discovery = JSON.parse(await fs.readFile(candidatePath, "utf8"));
const candidates = Array.isArray(discovery) ? discovery : discovery.candidates;
if (!Array.isArray(candidates)) throw new Error("Wikimedia discovery file has no candidates array.");

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const existing = await client.fetch(`*[_type == "editorialImage"]{sourceUrl,imageUrl,url}`);
const existingKeys = new Set(existing.flatMap((item) => [item.sourceUrl, item.imageUrl, item.url].filter(Boolean)));

const scopePreference = new Map([
  ["Ireland Women", 0],
  ["Munster", 1],
  ["Ulster", 2],
  ["Connacht", 3],
  ["Ireland Men", 4],
  ["European rugby", 5],
  ["URC opposition", 6],
  ["International", 7],
  ["Six Nations opposition", 8],
  ["Venues", 9],
]);

function isStrongPhotography(item) {
  if (item?.autoDecision !== "approve-candidate" || item?.rightsClear !== true || item?.recent !== true) return false;
  if (!Array.isArray(item.subjectEvidence) || item.subjectEvidence.length === 0) return false;
  if (typeof item.sourcePage !== "string" || !item.sourcePage.includes("commons.wikimedia.org/wiki/File:")) return false;
  if (typeof item.imageUrl !== "string" || !item.imageUrl.includes("upload.wikimedia.org/")) return false;
  if (existingKeys.has(item.sourcePage) || existingKeys.has(item.imageUrl)) return false;
  if (item.mime !== "image/jpeg") return false;
  if ((item.width ?? 0) < 1200 || (item.height ?? 0) < 800) return false;
  const text = `${item.title ?? ""} ${item.description ?? ""} ${item.categories ?? ""}`.toLowerCase();
  if (/\blogo\b|crest|badge|diagram|map|poster|programme cover/.test(text)) return false;
  return true;
}

const pool = candidates
  .filter(isStrongPhotography)
  .sort((a, b) => {
    const scopeA = scopePreference.get(a.scope) ?? 99;
    const scopeB = scopePreference.get(b.scope) ?? 99;
    if (scopeA !== scopeB) return scopeA - scopeB;
    if ((b.year ?? 0) !== (a.year ?? 0)) return (b.year ?? 0) - (a.year ?? 0);
    const areaA = (a.width ?? 0) * (a.height ?? 0);
    const areaB = (b.width ?? 0) * (b.height ?? 0);
    return areaB - areaA;
  });

const selected = [];
const perScope = new Map();
const usedQueries = new Set();
for (const item of pool) {
  if (selected.length >= targetCount) break;
  const scopeCount = perScope.get(item.scope) ?? 0;
  if (scopeCount >= 2) continue;
  if (usedQueries.has(item.query)) continue;
  selected.push({
    ...item,
    assistantDecision: "approve",
    assistantRationale: "Existing exact-subject discovery classified this as a recent, rights-clear approve-candidate. It is non-duplicate local-library photography with positive subject evidence and is selected under one-per-query / two-per-scope diversity caps.",
    reviewedAt: new Date().toISOString(),
  });
  perScope.set(item.scope, scopeCount + 1);
  usedQueries.add(item.query);
}

if (selected.length !== targetCount) {
  throw new Error(`Only ${selected.length} strong non-existing candidates satisfied the final-gap policy; required ${targetCount}. Refusing to weaken selection rules.`);
}

await fs.mkdir(outputPath.split("/").slice(0, -1).join("/"), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  sourceGeneratedAt: discovery.generatedAt,
  policy: {
    targetCount,
    recentOnly: true,
    rightsClearOnly: true,
    exactSubjectEvidenceRequired: true,
    photographyOnly: true,
    existingSanitySourcesExcluded: true,
    maxPerScope: 2,
    maxPerQuery: 1,
    gatesWeakened: false,
  },
  candidates: selected,
}, null, 2));

console.log(JSON.stringify({
  eligiblePool: pool.length,
  selected: selected.length,
  coverage: Object.fromEntries(perScope),
  items: selected.map((item) => ({ title: item.title, scope: item.scope, query: item.query, year: item.year, licence: item.licence, sourcePage: item.sourcePage })),
  outputPath,
}, null, 2));
