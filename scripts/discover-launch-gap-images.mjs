import fs from "node:fs/promises";
import path from "node:path";

const API = "https://commons.wikimedia.org/w/api.php";
const outputPath = process.env.WIKIMEDIA_OUTPUT ?? "data/editorial-images/launch-gap-candidates.json";
const perQuery = Math.min(Number.parseInt(process.env.WIKIMEDIA_RESULTS_PER_QUERY ?? "30", 10), 50);
const allowedLicences = /^(CC BY(?:-SA)?(?: [234]\.0)?|CC0|Public domain)/i;
const blocked = /\b(logo|crest|flag|kit template|shirt template|svg|diagram|line-?up)\b/i;

const targets = [
  { article: "Joey Carbery / Leinster", subject: "Joey Carbery", queries: ["Joey Carbery rugby", "Joey Carbery Bordeaux rugby", "Joey Carbery Munster rugby", "Joey Carbery Leinster rugby"] },
  { article: "Joey Carbery / Leinster", subject: "Sam Prendergast", queries: ["Sam Prendergast rugby", "Sam Prendergast Leinster rugby"] },
  { article: "Connacht front-row depth", subject: "Francois van Wyk", queries: ["Francois van Wyk rugby", "Francois van Wyk Bath rugby", "Francois van Wyk Northampton rugby"] },
  { article: "Connacht front-row depth", subject: "Thomas Connolly", queries: ["Thomas Connolly rugby Connacht", "Thomas Connolly Cornish Pirates rugby"] },
  { article: "Connacht front-row depth", subject: "Finlay Bealham", queries: ["Finlay Bealham rugby", "Finlay Bealham Connacht rugby", "Finlay Bealham Ireland rugby 2025"] },
  { article: "Iain Henderson / Ulster", subject: "Iain Henderson", queries: ["Iain Henderson rugby 2025", "Iain Henderson Ireland rugby 2025", "Iain Henderson Ulster rugby"] },
];

function stripHtml(value = "") { return String(value).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim(); }
function norm(value = "") { return stripHtml(value).normalize("NFKD").toLowerCase(); }
function subjectPresent(text, subject) { return norm(text).includes(norm(subject)); }
function yearFrom(...values) { const match = values.filter(Boolean).join(" ").match(/\b(20\d{2})\b/); return match ? Number(match[1]) : null; }

async function search(target, query) {
  const url = new URL(API);
  Object.entries({ action: "query", format: "json", generator: "search", gsrnamespace: "6", gsrsearch: query, gsrlimit: String(perQuery), prop: "imageinfo", iiprop: "url|size|mime|extmetadata" }).forEach(([k,v]) => url.searchParams.set(k,v));
  const response = await fetch(url, { headers: { "User-Agent": "TheRugbyPanda/1.0 (launch-gap editorial image discovery; hello@therugbypanda.ie)" } });
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
    const evidenceText = `${title} ${description} ${categories}`;
    const exactSubject = subjectPresent(evidenceText, target.subject);
    const usableRaster = /^image\/(jpeg|png|webp)$/i.test(info.mime ?? "") && Number(info.width ?? 0) >= 1200;
    const rightsClear = allowedLicences.test(licence) && Boolean(meta.LicenseUrl?.value || /CC0|Public domain/i.test(licence));
    const decision = blocked.test(evidenceText) || !usableRaster || !exactSubject ? "reject" : rightsClear ? "approve-candidate" : "owner-review";
    return { article: target.article, subject: target.subject, query, source: "Wikimedia Commons", title, description, categories, sourcePage: info.descriptionurl, imageUrl: info.url, width: info.width, height: info.height, mime: info.mime, creator: stripHtml(meta.Artist?.value), credit: stripHtml(meta.Credit?.value), licence, licenceUrl: meta.LicenseUrl?.value ?? null, dateText: dateText || null, year, exactSubject, rightsClear, decision };
  });
}

const all = [];
for (const target of targets) for (const query of target.queries) all.push(...await search(target, query));
const deduped = [...new Map(all.filter((x) => x.imageUrl).map((x) => [x.imageUrl, x])).values()];
deduped.sort((a,b) => Number(b.year ?? 0) - Number(a.year ?? 0) || Number(b.width ?? 0) - Number(a.width ?? 0));
const counts = deduped.reduce((acc, x) => { acc[x.decision] = (acc[x.decision] ?? 0) + 1; return acc; }, {});
const bySubject = {};
for (const x of deduped.filter((x) => x.decision === "approve-candidate")) bySubject[x.subject] = (bySubject[x.subject] ?? 0) + 1;
const output = { generatedAt: new Date().toISOString(), purpose: "Close measured launch visual-depth gaps without generic filler", targets, counts, bySubject, candidates: deduped };
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify(output, null, 2));
console.log(JSON.stringify({ total: deduped.length, counts, bySubject, outputPath }, null, 2));