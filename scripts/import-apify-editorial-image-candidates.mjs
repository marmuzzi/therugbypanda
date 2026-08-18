import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "hvg4b508";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const sanityToken = process.env.SANITY_API_TOKEN;
const apifyToken = process.env.APIFY_TOKEN;
const manifestPath = process.env.EDITORIAL_IMAGE_COLLECTION_FILE ?? "data/editorial-images/apify-collection-2026-08-18.json";
const importLimit = Number.parseInt(process.env.EDITORIAL_IMAGE_IMPORT_LIMIT ?? "240", 10);
const minimumImport = Number.parseInt(process.env.EDITORIAL_IMAGE_MINIMUM_IMPORT ?? "200", 10);

if (!sanityToken) throw new Error("Missing SANITY_API_TOKEN.");
if (!Number.isFinite(importLimit) || importLimit < minimumImport) throw new Error("EDITORIAL_IMAGE_IMPORT_LIMIT must be >= minimum import target.");

const client = createClient({ projectId, dataset, apiVersion, token: sanityToken, useCdn: false });
const manifest = JSON.parse(await fs.readFile(path.resolve(process.cwd(), manifestPath), "utf8"));

const allowedLicences = new Set(["by", "by-sa", "cc0", "pdm"]);
const blockedTitlePatterns = [
  /\b(flag|kit|livery|aircraft|airline|letter of congratulations|contract signing|under[- ]?1[0-9]|school|college)\b/i,
  /\b(logo|crest|jersey template|shirt template)\b/i,
];
const blockedExtensions = new Set(["svg", "gif"]);
const rugbySignals = /\b(rugby|leinster|munster|ulster|connacht|ireland|world cup|heineken|champions cup|challenge cup|pro12|pro14|urc|sportsground|aviva|murrayfield|six nations|nations championship)\b/i;

const scopeRules = {
  Leinster: /\bleinster\b/i,
  Munster: /\bmunster\b/i,
  Ulster: /\bulster\b/i,
  Connacht: /\bconnacht\b/i,
  "Ireland Women": /\b(ireland|irish)\b/i,
  "Ireland Women / current named players": /\b(ireland|irish)\b/i,
  "Ireland Men / Aviva": /\b(ireland|irish|aviva)\b/i,
  "Ireland players": /\b(ireland|irish|rwc|world cup)\b/i,
  "Ireland international": /\b(ireland|irish|aviva|international|world cup)\b/i,
  "Ireland / Rugby World Cup": /\b(ireland|irish|world cup|rwc)\b/i,
  URC: /\b(urc|united rugby championship|pro12|pro14|leinster|munster|ulster|connacht|glasgow|edinburgh|scarlets|ospreys|cardiff|dragons|zebre|benetton|bulls|sharks|stormers|lions)\b/i,
  "Six Nations": /\b(six nations|england|france|ireland|italy|scotland|wales)\b/i,
  "Nations Championship": /\b(nations championship|argentina|australia|england|fiji|france|ireland|italy|japan|new zealand|scotland|south africa|wales)\b/i,
  "Champions Cup": /\b(champions cup|heineken|european cup|epcr|leinster|munster|ulster|connacht|toulouse|la rochelle|leicester|saracens|harlequins|bath|northampton|exeter|glasgow|edinburgh|bordeaux|clermont|racing)\b/i,
  "Challenge Cup": /\b(challenge cup|epcr|connacht|ulster|edinburgh|cardiff|scarlets|ospreys|gloucester|bath|bristol|newcastle|perpignan|montpellier|lyon|pau|benetton|zebre)\b/i,
};

const scopeMinimums = {
  Leinster: 8,
  Munster: 15,
  Ulster: 8,
  Connacht: 15,
  "Ireland Women": 50,
  "Ireland Men": 15,
  "European competitions": 16,
};

function cleanText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function extensionFor(url) {
  const clean = String(url ?? "").split(/[?#]/)[0];
  const match = clean.match(/\.([a-zA-Z0-9]+)$/);
  return match?.[1]?.toLowerCase();
}

function sourceMetadataText(item) {
  return [
    item.title,
    ...(Array.isArray(item.tags) ? item.tags : []),
    item.creator,
    item.attribution,
    item.provider,
    item.source,
  ]
    .filter(Boolean)
    .join(" ");
}

function contextualText(item, run) {
  return [sourceMetadataText(item), run.query, run.scope].filter(Boolean).join(" ");
}

function normaliseSignal(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasRequiredSignal(item, run) {
  const requiredSignals = Array.isArray(run.requiredSignals) ? run.requiredSignals.filter(Boolean) : [];
  if (requiredSignals.length === 0) return true;
  const haystack = normaliseSignal(sourceMetadataText(item));
  return requiredSignals.some((signal) => {
    const needle = normaliseSignal(signal);
    return needle.length >= 3 && haystack.includes(needle);
  });
}

function normalizedScope(scope) {
  if (scope.startsWith("Ireland Women")) return "Ireland Women";
  if (scope.startsWith("Ireland Men") || scope === "Ireland players" || scope === "Ireland international" || scope === "Ireland / Rugby World Cup") return "Ireland Men";
  if (scope === "Champions Cup" || scope === "Challenge Cup") return scope;
  if (["Leinster", "Munster", "Ulster", "Connacht"].includes(scope)) return scope;
  return scope;
}

function scopeMatches(item, run) {
  const rule = scopeRules[run.scope];
  if (!rule) return true;
  return rule.test(sourceMetadataText(item));
}

function candidateAllowed(item, run) {
  const title = cleanText(item.title);
  const imageUrl = cleanText(item.url);
  const landingUrl = cleanText(item.foreign_landing_url);
  const licence = cleanText(item.license)?.toLowerCase();
  if (!title || !imageUrl || !landingUrl || !licence || !allowedLicences.has(licence)) return false;
  if (item.mature === true) return false;
  if (blockedTitlePatterns.some((pattern) => pattern.test(title))) return false;
  if (blockedExtensions.has(extensionFor(imageUrl))) return false;
  const width = Number(item.width);
  const height = Number(item.height);
  if (Number.isFinite(width) && Number.isFinite(height) && (width < 600 || height < 400)) return false;

  const metadataText = sourceMetadataText(item);
  if (!rugbySignals.test(metadataText)) return false;
  if (!scopeMatches(item, run)) return false;
  if (!hasRequiredSignal(item, run)) return false;
  return true;
}

function extractEventDate(title) {
  const compact = title.match(/\b(20\d{2})(\d{2})(\d{2})\b/);
  if (compact) return `${compact[1]}-${compact[2]}-${compact[3]}`;
  const year = title.match(/\b(20\d{2})\b/);
  return year ? `${year[1]}-01-01` : undefined;
}

function inferCompetition(text) {
  if (/2025 Rugby World Cup \(Women\)|women.*world cup/i.test(text)) return "Women's Rugby World Cup";
  if (/world cup|\bRWC\b/i.test(text)) return "Rugby World Cup";
  if (/champions cup|heineken cup|european cup/i.test(text)) return "European Rugby Champions Cup";
  if (/challenge cup/i.test(text)) return "EPCR Challenge Cup";
  if (/\bURC\b|united rugby championship|pro12|pro14/i.test(text)) return "United Rugby Championship";
  if (/six nations/i.test(text)) return "Six Nations";
  if (/nations championship/i.test(text)) return "Nations Championship";
  return undefined;
}

function inferTeam(scope, text) {
  for (const team of ["Leinster", "Munster", "Ulster", "Connacht"]) {
    if (new RegExp(`\\b${team}\\b`, "i").test(text)) return `${team} Rugby`;
  }
  if (scope.startsWith("Ireland Women")) return "Ireland Women";
  if (scope.startsWith("Ireland") || /\bIreland\b/i.test(text)) return "Ireland";
  return undefined;
}

function inferPeople(title, scope) {
  const womenMatch = title.match(/\d{6}\s+(.+)$/);
  if (scope.startsWith("Ireland Women") && womenMatch) return [womenMatch[1].trim()];
  const cleaned = title.replace(/^File:/, "").replace(/\.(jpg|jpeg|png|webp)$/i, "").replace(/\b20\d{2}\b.*$/i, "").trim();
  if (/^[A-ZÀ-ÖØ-Ý][\p{L}'’-]+(?:\s+[A-ZÀ-ÖØ-Ý][\p{L}'’.-]+){1,3}$/u.test(cleaned)) return [cleaned];
  return [];
}

function inferPhotoType(title, scope) {
  const text = `${title} ${scope}`.toLowerCase();
  if (/stadium|sportsground|murrayfield|aviva/.test(text)) return "stadium";
  if (/training|warmup|warm-up/.test(text)) return "training";
  if (/referee|officiating|nigel owens/.test(text)) return "referee";
  if (/portrait|player|coach|\b20\d{2}\b/.test(text) && !/ v | vs |final|match/.test(text)) return "portrait";
  return "action";
}

function editorialCategory(scope) {
  if (scope.startsWith("Ireland Women")) return "womens-rugby";
  if (scope.startsWith("Ireland") || scope === "international rugby" || scope === "Six Nations" || scope === "Nations Championship") return "international";
  if (scope === "training") return "training";
  return "club-rugby";
}

function suggestedUse(photoType) {
  if (photoType === "stadium") return ["article-header", "homepage-card", "category-banner"];
  if (photoType === "portrait") return ["article-header", "homepage-card", "gallery"];
  if (photoType === "training") return ["article-header", "gallery", "social-media"];
  return ["article-header", "homepage-card", "gallery"];
}

async function fetchDataset(run) {
  const endpoint = new URL(`https://api.apify.com/v2/datasets/${run.datasetId}/items`);
  endpoint.searchParams.set("clean", "true");
  endpoint.searchParams.set("format", "json");
  endpoint.searchParams.set("limit", String(Math.max(run.returned ?? run.resultsWanted ?? 20, 20)));
  if (apifyToken) endpoint.searchParams.set("token", apifyToken);
  const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Apify dataset ${run.datasetId} returned ${response.status}. ${apifyToken ? "" : "APIFY_TOKEN may be required."}`);
  const items = await response.json();
  if (!Array.isArray(items)) throw new Error(`Unexpected Apify dataset response for ${run.datasetId}.`);
  return items;
}

const rawCandidates = [];
for (const run of manifest.runs) {
  if (!run.datasetId || !run.returned) continue;
  const items = await fetchDataset(run);
  for (const item of items) {
    if (candidateAllowed(item, run)) rawCandidates.push({ item, run });
  }
}

const deduped = [];
const seen = new Set();
for (const entry of rawCandidates) {
  const keys = [entry.item.id, entry.item.url, entry.item.foreign_landing_url].filter(Boolean).map(String);
  if (keys.some((key) => seen.has(key))) continue;
  keys.forEach((key) => seen.add(key));
  deduped.push(entry);
}

const priority = ["Ireland Women", "Leinster", "Munster", "Ulster", "Connacht", "Ireland Men", "Champions Cup", "Challenge Cup", "URC", "Six Nations", "Nations Championship", "international rugby", "professional players", "match action", "training", "stadiums", "coaches"];
deduped.sort((a, b) => {
  const aIndex = priority.indexOf(normalizedScope(a.run.scope));
  const bIndex = priority.indexOf(normalizedScope(b.run.scope));
  return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
});

const selected = deduped.slice(0, importLimit);
if (selected.length < minimumImport) {
  throw new Error(`Only ${selected.length} relevant deduplicated candidates remained after filtering; required at least ${minimumImport}.`);
}

const existing = await client.fetch(
  `*[_type == "editorialImage" && (sourceRecordId in $ids || imageUrl in $urls || sourceUrl in $sources)]{_id,sourceRecordId,imageUrl,sourceUrl,lifecycleStatus,usageApproved}`,
  {
    ids: selected.map(({ item }) => item.id).filter(Boolean),
    urls: selected.map(({ item }) => item.url).filter(Boolean),
    sources: selected.map(({ item }) => item.foreign_landing_url).filter(Boolean),
  },
);
const existingKeys = new Set(existing.flatMap((record) => [record.sourceRecordId, record.imageUrl, record.sourceUrl].filter(Boolean)));
const newSelected = selected.filter(({ item }) => !existingKeys.has(item.id) && !existingKeys.has(item.url) && !existingKeys.has(item.foreign_landing_url));

if (newSelected.length < minimumImport) {
  throw new Error(`Only ${newSelected.length} genuinely new candidates remained after Sanity deduplication; required at least ${minimumImport}.`);
}

let transaction = client.transaction();
const importedAt = new Date().toISOString();
const scopeCounts = new Map();

for (const { item, run } of newSelected) {
  const title = cleanText(item.title);
  const text = contextualText(item, run);
  const scope = normalizedScope(run.scope);
  const photoType = inferPhotoType(title, scope);
  const people = inferPeople(title, scope);
  const competitionEvent = inferCompetition(text);
  const sourceName = cleanText(item.provider) ?? cleanText(item.source) ?? "Openverse";
  const idHash = createHash("sha1").update(`${item.id}|${item.url}|${item.foreign_landing_url}`).digest("hex").slice(0, 20);

  const document = {
    _id: `media-candidate-apify-${idHash}`,
    _type: "editorialImage",
    title,
    url: item.url,
    imageUrl: item.url,
    thumbnail: cleanText(item.thumbnail),
    altText: title,
    caption: title,
    lifecycleStatus: "candidate",
    usageApproved: false,
    editorialCategory: editorialCategory(scope),
    photoType,
    editorialValue: extractEventDate(title) ? "historical" : "seasonal",
    suggestedUse: suggestedUse(photoType),
    sourceClassification: "open-licence",
    sourceName,
    sourceUrl: item.foreign_landing_url,
    sourcePageTitle: title,
    creatorUrl: cleanText(item.creator_url),
    photographer: cleanText(item.creator),
    rightsHolder: cleanText(item.creator),
    licence: item.license_version ? `${String(item.license).toUpperCase()} ${item.license_version}` : String(item.license).toUpperCase(),
    licenceUrl: cleanText(item.license_url),
    rightsNotes: "Candidate only. Openverse licence metadata captured during acquisition; human rights/editorial review remains mandatory before approval or publication. Do not hotlink publicly.",
    attribution: cleanText(item.attribution),
    creditLine: cleanText(item.creator),
    team: inferTeam(scope, text),
    people,
    competitionEvent,
    eventDate: extractEventDate(title),
    acquisitionScope: scope,
    acquisitionQuery: run.query ?? run.keyword,
    sourceIndexedAt: cleanText(item.indexed_on),
    sourceProvider: sourceName,
    sourceRecordId: String(item.id),
    sourceActorRunId: run.runId,
    sourceDatasetId: run.datasetId,
    importedAt,
  };

  transaction = transaction.createIfNotExists(document);
  scopeCounts.set(scope, (scopeCounts.get(scope) ?? 0) + 1);
}

await transaction.commit();

const coverage = Object.fromEntries([...scopeCounts.entries()].sort(([a], [b]) => a.localeCompare(b)));
const europeanCount = (coverage["Champions Cup"] ?? 0) + (coverage["Challenge Cup"] ?? 0);
for (const [scope, minimum] of Object.entries(scopeMinimums)) {
  const count = scope === "European competitions" ? europeanCount : (coverage[scope] ?? 0);
  if (count < minimum) console.warn(`Coverage warning: ${scope} imported ${count}, target minimum ${minimum}.`);
}

console.log(JSON.stringify({ rawAccepted: rawCandidates.length, deduplicated: deduped.length, selected: selected.length, existingMatches: existing.length, imported: newSelected.length, coverage }, null, 2));
console.log(`Imported ${newSelected.length} new candidate-only editorial images into ${projectId}/${dataset}. usageApproved=false for every imported record.`);
