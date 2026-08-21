import fs from "node:fs/promises";
import path from "node:path";

const API = "https://commons.wikimedia.org/w/api.php";
const outputPath = process.env.WIKIMEDIA_OUTPUT ?? "data/editorial-images/wikimedia-candidates.json";
const perQuery = Math.min(Number.parseInt(process.env.WIKIMEDIA_RESULTS_PER_QUERY ?? "20", 10), 50);
const currentYear = new Date().getUTCFullYear();
const recentFloor = currentYear - 2;

const targets = [
  { scope: "Ireland Men", subjects: ["Ireland", "Irish", "Six Nations", "Garry Ringrose", "Dan Sheehan", "Caelan Doris"], queries: ["2025 Six Nations Italy Ireland", "2025 Ireland rugby union", "Garry Ringrose 2025", "Dan Sheehan 2025", "Caelan Doris 2025"] },
  { scope: "Ireland Women", subjects: ["Ireland", "Irish", "Ireland women", "Women's Rugby World Cup"], queries: ["2025 Rugby World Cup Women Ireland", "2025 Ireland women rugby Japan", "2025 Ireland women rugby Spain"] },
  { scope: "Leinster", subjects: ["Leinster", "Garry Ringrose"], queries: ["Leinster Rugby 2025", "Leinster Rugby 2026", "Garry Ringrose Leinster 2025"] },
  { scope: "Munster", subjects: ["Munster Rugby", "Thomond Park"], queries: ["\"Munster Rugby\" 2025", "\"Munster Rugby\" 2026", "\"Thomond Park\" rugby"] },
  { scope: "Ulster", subjects: ["Ulster Rugby", "Kingspan Stadium", "Affidea Stadium"], queries: ["\"Ulster Rugby\" 2025", "\"Ulster Rugby\" 2026", "\"Kingspan Stadium\" rugby", "\"Affidea Stadium\" rugby"] },
  { scope: "Connacht", subjects: ["Connacht Rugby", "Dexcom Stadium", "Sportsground Galway"], queries: ["\"Connacht Rugby\" 2025", "\"Connacht Rugby\" 2026", "\"Dexcom Stadium\" rugby", "\"Sportsground Galway\" rugby"] },
  { scope: "URC", subjects: ["United Rugby Championship", "URC"], queries: ["\"United Rugby Championship\" 2025 rugby", "\"United Rugby Championship\" 2026 rugby"] },
  { scope: "Six Nations", subjects: ["Six Nations"], queries: ["\"Six Nations\" 2025 rugby", "\"Six Nations\" 2026 rugby"] },
];

const allowedLicences = /^(CC BY(?:-SA)?(?: [234]\.0)?|CC0|Public domain)/i;
const blocked = /\b(logo|crest|flag|kit template|shirt template|svg|diagram|line-?up)\b/i;
function stripHtml(value = "") { return String(value).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim(); }
function escapeRegExp(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function yearFrom(...values) { const match = values.filter(Boolean).join(" ").match(/\b(20\d{2})\b/); return match ? Number(match[1]) : null; }
function subjectEvidence(subjectText, subjects) {
  const normalized = subjectText.normalize("NFKD");
  return subjects.filter((subject) => new RegExp(`\\b${escapeRegExp(subject)}\\b`, "i").test(normalized));
}

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
    const exactSignal = evidence.length > 0;
    const recent = year !== null && year >= recentFloor;
    const usableRaster = /^image\/(jpeg|png|webp)$/i.test(info.mime ?? "") && Number(info.width ?? 0) >= 1000;
    const rightsClear = allowedLicences.test(licence) && Boolean(meta.LicenseUrl?.value || /CC0|Public domain/i.test(licence));
    const autoDecision = blocked.test(subjectText) || !usableRaster || !exactSignal ? "reject" : rightsClear ? "approve-candidate" : "owner-review";
    return { source: "Wikimedia Commons", scope: target.scope, query, title, description, categories, sourcePage: info.descriptionurl, imageUrl: info.url, thumbnailUrl: info.thumburl, width: info.width, height: info.height, mime: info.mime, creator: stripHtml(meta.Artist?.value), credit: stripHtml(meta.Credit?.value), licence, licenceUrl: meta.LicenseUrl?.value ?? null, dateText: dateText || null, year, recent, rightsClear, exactSignal, subjectEvidence: evidence, autoDecision };
  });
}

const all = [];
for (const target of targets) for (const query of target.queries) all.push(...await search(target, query));
const deduped = [...new Map(all.filter((x) => x.imageUrl).map((x) => [x.imageUrl, x])).values()];
deduped.sort((a,b) => Number(b.recent) - Number(a.recent) || Number(b.rightsClear) - Number(a.rightsClear));
const counts = deduped.reduce((acc, x) => { acc[x.autoDecision] = (acc[x.autoDecision] ?? 0) + 1; return acc; }, {});
const approved = deduped.filter((x) => x.autoDecision === "approve-candidate");
const recentApprovalRate = approved.length ? approved.filter((x) => x.recent).length / approved.length : 0;
const ownerReviewRate = deduped.length ? (counts["owner-review"] ?? 0) / deduped.length : 0;
const output = { generatedAt: new Date().toISOString(), policy: { recentFloor, majorityRecentRequired: true, ownerReviewTargetMaximum: 0.05, relevantImageOrNoImage: true }, counts, recentApprovalRate, ownerReviewRate, candidates: deduped };
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify(output, null, 2));
console.log(JSON.stringify({ total: deduped.length, counts, recentApprovalRate, ownerReviewRate, outputPath }, null, 2));
if (ownerReviewRate > 0.05) console.warn(`Owner-review rate ${(ownerReviewRate*100).toFixed(1)}% exceeds 5% target; tighten automated rights/relevance rules before owner review.`);
if (approved.length && recentApprovalRate < 0.5) console.warn(`Recent approval-candidate rate ${(recentApprovalRate*100).toFixed(1)}% is below majority target; do not scale this source/query mix yet.`);
