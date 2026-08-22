import fs from "node:fs/promises";
import path from "node:path";

const API = "https://commons.wikimedia.org/w/api.php";
const outputPath = process.env.WIKIMEDIA_OUTPUT ?? "data/editorial-images/wikimedia-candidates.json";
const perQuery = Math.min(Number.parseInt(process.env.WIKIMEDIA_RESULTS_PER_QUERY ?? "15", 10), 30);
const currentYear = new Date().getUTCFullYear();
const recentFloor = currentYear - 2;
const perQueryApprovalCap = 4;
const perScopeApprovalCap = 24;

// Diversity is deliberate: exact recent fixtures/players first, then teams/venues.
const targets = [
  { scope: "Ireland Men", subjects: ["Ireland", "Irish", "Six Nations", "Garry Ringrose", "Dan Sheehan", "Caelan Doris", "Tadhg Beirne", "James Ryan"], queries: ["2025 Six Nations Italy Ireland", "2025 Six Nations Ireland France", "2025 Six Nations Ireland England", "Garry Ringrose 2025 rugby", "Dan Sheehan 2025 rugby", "Caelan Doris 2025 rugby", "Tadhg Beirne 2025 rugby", "James Ryan 2025 rugby"] },
  { scope: "Ireland Women", subjects: ["Ireland", "Irish", "Ireland women", "Women's Rugby World Cup"], queries: ["2025 Rugby World Cup Women Ireland Spain", "2025 Rugby World Cup Women Ireland Japan", "2025 Rugby World Cup Women Ireland New Zealand"] },
  { scope: "Leinster", subjects: ["Leinster", "Garry Ringrose", "James Ryan", "Dan Sheehan"], queries: ["Leinster Rugby 2025", "Leinster Rugby 2026", "Garry Ringrose Leinster 2025", "James Ryan Leinster 2025"] },
  { scope: "Munster", subjects: ["Munster Rugby", "Thomond Park", "Tadhg Beirne", "Jack Crowley"], queries: ["\"Munster Rugby\" 2025", "\"Munster Rugby\" 2026", "Tadhg Beirne Munster 2025", "Jack Crowley Munster 2025", "\"Thomond Park\" rugby"] },
  { scope: "Ulster", subjects: ["Ulster Rugby", "Kingspan Stadium", "Affidea Stadium", "Jacob Stockdale"], queries: ["\"Ulster Rugby\" 2025", "\"Ulster Rugby\" 2026", "Jacob Stockdale 2025 rugby", "\"Kingspan Stadium\" rugby", "\"Affidea Stadium\" rugby"] },
  { scope: "Connacht", subjects: ["Connacht Rugby", "Dexcom Stadium", "Sportsground Galway", "Bundee Aki"], queries: ["\"Connacht Rugby\" 2025", "\"Connacht Rugby\" 2026", "Bundee Aki 2025 rugby", "\"Dexcom Stadium\" rugby", "\"Sportsground Galway\" rugby"] },
  { scope: "URC opposition", subjects: ["Glasgow Warriors", "Edinburgh Rugby", "Cardiff Rugby", "Scarlets", "Ospreys", "Benetton Rugby", "Stormers", "Bulls", "Sharks"], queries: ["Glasgow Warriors 2025 rugby", "Edinburgh Rugby 2025", "Cardiff Rugby 2025", "Scarlets rugby 2025", "Ospreys rugby 2025", "Benetton Rugby 2025", "Stormers rugby 2025", "Bulls rugby 2025", "Sharks rugby 2025"] },
  { scope: "Six Nations opposition", subjects: ["England", "France", "Scotland", "Wales", "Italy", "Six Nations"], queries: ["2025 Six Nations England rugby", "2025 Six Nations France rugby", "2025 Six Nations Scotland rugby", "2025 Six Nations Wales rugby", "2025 Six Nations Italy rugby"] },
  { scope: "European rugby", subjects: ["Champions Cup", "Challenge Cup", "Toulouse", "Bordeaux", "La Rochelle", "Leicester Tigers", "Northampton Saints"], queries: ["2025 Champions Cup rugby Toulouse", "2025 Champions Cup rugby Bordeaux", "2025 Champions Cup rugby La Rochelle", "2025 Champions Cup Leicester Tigers", "2025 Champions Cup Northampton Saints", "2025 Challenge Cup rugby"] },
  { scope: "International", subjects: ["South Africa", "New Zealand", "Australia", "Argentina", "Japan", "Fiji", "rugby union"], queries: ["South Africa rugby union 2025", "New Zealand rugby union 2025", "Australia rugby union 2025", "Argentina rugby union 2025", "Japan rugby union 2025", "Fiji rugby union 2025"] },
  { scope: "Venues", subjects: ["Aviva Stadium", "Thomond Park", "Murrayfield", "Twickenham", "Principality Stadium", "Stade de France", "Stadio Olimpico"], queries: ["Aviva Stadium rugby 2025", "Thomond Park rugby", "Murrayfield rugby 2025", "Twickenham rugby 2025", "Principality Stadium rugby 2025", "Stade de France rugby 2025", "Stadio Olimpico rugby 2025"] },
];

const allowedLicences = /^(CC BY(?:-SA)?(?: [234]\.0)?|CC0|Public domain)/i;
const blocked = /\b(logo|crest|flag|kit template|shirt template|svg|diagram|line-?up)\b/i;
function stripHtml(value = "") { return String(value).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim(); }
function escapeRegExp(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function yearFrom(...values) { const match = values.filter(Boolean).join(" ").match(/\b(20\d{2})\b/); return match ? Number(match[1]) : null; }
function subjectEvidence(subjectText, subjects) { return subjects.filter((subject) => new RegExp(`\\b${escapeRegExp(subject)}\\b`, "i").test(subjectText.normalize("NFKD"))); }

async function search(target, query) {
  const url = new URL(API);
  Object.entries({ action: "query", format: "json", generator: "search", gsrnamespace: "6", gsrsearch: query, gsrlimit: String(perQuery), prop: "imageinfo", iiprop: "url|size|mime|extmetadata" }).forEach(([k,v]) => url.searchParams.set(k,v));
  const response = await fetch(url, { headers: { "User-Agent": "TheRugbyPanda/1.0 (editorial image discovery; hello@therugbypanda.ie)" } });
  if (!response.ok) throw new Error(`Commons search failed ${response.status} for ${query}`);
  const payload = await response.json();
  return Object.values(payload?.query?.pages ?? {}).map((page) => {
    const info = page.imageinfo?.[0] ?? {};
    const meta = info.extmetadata ?? {};
    const title = String(page.title ?? "").replace(/^File:/, "");
    const description = stripHtml(meta.ImageDescription?.value);
    const categories = stripHtml(meta.Categories?.value);
    const licence = stripHtml(meta.LicenseShortName?.value);
    const dateText = stripHtml(meta.DateTimeOriginal?.value || meta.DateTime?.value);
    const year = yearFrom(dateText, title, description);
    const subjectText = `${title} ${description} ${categories}`;
    const evidence = subjectEvidence(subjectText, target.subjects);
    const recent = year !== null && year >= recentFloor;
    const usableRaster = /^image\/(jpeg|png|webp)$/i.test(info.mime ?? "") && Number(info.width ?? 0) >= 1200;
    const rightsClear = allowedLicences.test(licence) && Boolean(meta.LicenseUrl?.value || /CC0|Public domain/i.test(licence));
    const autoDecision = blocked.test(subjectText) || !usableRaster || evidence.length === 0 ? "reject" : rightsClear ? "approve-candidate" : "owner-review";
    return { source: "Wikimedia Commons", scope: target.scope, query, title, description, categories, sourcePage: info.descriptionurl, imageUrl: info.url, width: info.width, height: info.height, mime: info.mime, creator: stripHtml(meta.Artist?.value), credit: stripHtml(meta.Credit?.value), licence, licenceUrl: meta.LicenseUrl?.value ?? null, dateText: dateText || null, year, recent, rightsClear, subjectEvidence: evidence, autoDecision };
  });
}

const all = [];
for (const target of targets) for (const query of target.queries) all.push(...await search(target, query));
const deduped = [...new Map(all.filter((x) => x.imageUrl).map((x) => [x.imageUrl, x])).values()];
deduped.sort((a,b) => Number(b.recent) - Number(a.recent) || Number(b.rightsClear) - Number(a.rightsClear) || (b.width ?? 0) - (a.width ?? 0));

// Cap approvals by query (proxy for fixture/event) and scope so easy collections cannot swamp the library.
const queryCounts = new Map();
const scopeCounts = new Map();
for (const item of deduped) {
  if (item.autoDecision !== "approve-candidate") continue;
  const q = queryCounts.get(item.query) ?? 0;
  const s = scopeCounts.get(item.scope) ?? 0;
  if (q >= perQueryApprovalCap || s >= perScopeApprovalCap) {
    item.autoDecision = "diversity-hold";
    continue;
  }
  queryCounts.set(item.query, q + 1);
  scopeCounts.set(item.scope, s + 1);
}

const counts = deduped.reduce((acc, x) => { acc[x.autoDecision] = (acc[x.autoDecision] ?? 0) + 1; return acc; }, {});
const approved = deduped.filter((x) => x.autoDecision === "approve-candidate");
const coverage = approved.reduce((acc, x) => { acc[x.scope] = (acc[x.scope] ?? 0) + 1; return acc; }, {});
const recentApprovalRate = approved.length ? approved.filter((x) => x.recent).length / approved.length : 0;
const ownerReviewRate = deduped.length ? (counts["owner-review"] ?? 0) / deduped.length : 0;
const maxScopeShare = approved.length ? Math.max(0, ...Object.values(coverage)) / approved.length : 0;
const output = { generatedAt: new Date().toISOString(), policy: { recentFloor, majorityRecentRequired: true, ownerReviewTargetMaximum: 0.05, perQueryApprovalCap, perScopeApprovalCap, relevantImageOrNoImage: true }, counts, coverage, recentApprovalRate, ownerReviewRate, maxScopeShare, candidates: deduped };
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify(output, null, 2));
console.log(JSON.stringify({ total: deduped.length, counts, coverage, recentApprovalRate, ownerReviewRate, maxScopeShare, outputPath }, null, 2));
if (ownerReviewRate > 0.05) console.warn(`Owner-review rate ${(ownerReviewRate*100).toFixed(1)}% exceeds 5% target; tighten rules before owner review.`);
if (approved.length && recentApprovalRate < 0.5) console.warn(`Recent approval-candidate rate ${(recentApprovalRate*100).toFixed(1)}% is below majority target; do not scale yet.`);
if (approved.length && maxScopeShare > 0.2) console.warn(`Largest scope is ${(maxScopeShare*100).toFixed(1)}% of approvals; broaden acquisition before import.`);
