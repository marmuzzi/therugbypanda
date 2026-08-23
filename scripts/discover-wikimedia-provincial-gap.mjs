import fs from "node:fs/promises";
import path from "node:path";

const API = "https://commons.wikimedia.org/w/api.php";
const outputPath = process.env.WIKIMEDIA_OUTPUT ?? "data/editorial-images/wikimedia-provincial-gap-candidates.json";
const recentFloor = 2025;
const searchYears = [2026, 2025];
const perQueryApprovalCap = 2;
const perScopeApprovalCap = 10;

const targets = [
  {
    scope: "Leinster",
    players: ["Garry Ringrose", "James Ryan", "Dan Sheehan", "Caelan Doris", "Hugo Keenan", "James Lowe", "Jamison Gibson-Park", "Tadhg Furlong", "Jack Conan", "Ronan Kelleher", "Joe McCarthy", "Ciaran Frawley", "Sam Prendergast", "Jamie Osborne"],
  },
  {
    scope: "Munster",
    players: ["Tadhg Beirne", "Jack Crowley", "Craig Casey", "Calvin Nash", "Tom Ahern", "Peter O'Mahony", "Jeremy Loughman", "Edwin Edogbo", "Tom Farrell"],
  },
  {
    scope: "Ulster",
    players: ["Jacob Stockdale", "Stuart McCloskey", "Iain Henderson", "Nick Timoney", "Tom Stewart", "Tom O'Toole", "Nathan Doak", "Cormac Izuchukwu"],
  },
  {
    scope: "Connacht",
    players: ["Bundee Aki", "Mack Hansen", "Finlay Bealham", "Cian Prendergast", "Cathal Forde", "Paul Boyle", "Dave Heffernan"],
  },
];

const allowedLicences = /^(CC BY(?:-SA)?(?: [234]\.0)?|CC0|Public domain)/i;
const blocked = /\b(logo|crest|flag|kit template|shirt template|svg|diagram|rugby league)\b/i;

function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}
function escapeRegExp(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function extractYear(...values) {
  const match = values.filter(Boolean).join(" ").match(/\b(20\d{2})\b/);
  return match ? Number(match[1]) : null;
}

async function searchPlayer(scope, player, searchYear) {
  const query = `\"${player}\" rugby ${searchYear}`;
  const url = new URL(API);
  const params = {
    action: "query", format: "json", generator: "search", gsrnamespace: "6",
    gsrsearch: query, gsrlimit: "20", prop: "imageinfo", iiprop: "url|size|mime|extmetadata",
  };
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const response = await fetch(url, { headers: { "User-Agent": "TheRugbyPanda/1.0 (editorial image discovery; hello@therugbypanda.ie)" } });
  if (!response.ok) throw new Error(`Commons search failed ${response.status} for ${query}`);
  const payload = await response.json();
  return Object.values(payload?.query?.pages ?? {}).map((page) => {
    const info = page.imageinfo?.[0] ?? {};
    const meta = info.extmetadata ?? {};
    const title = String(page.title ?? "").replace(/^File:/, "");
    const description = stripHtml(meta.ImageDescription?.value);
    const categories = stripHtml(meta.Categories?.value);
    const subjectText = `${title} ${description} ${categories}`;
    const evidence = new RegExp(`\\b${escapeRegExp(player)}\\b`, "i").test(subjectText) ? [player] : [];
    const licence = stripHtml(meta.LicenseShortName?.value);
    const dateText = stripHtml(meta.DateTimeOriginal?.value || meta.DateTime?.value);
    const year = extractYear(dateText, title, description);
    const recent = year !== null && year >= recentFloor;
    const rightsClear = allowedLicences.test(licence) && Boolean(meta.LicenseUrl?.value || /CC0|Public domain/i.test(licence));
    const usableRaster = /^image\/(jpeg|png|webp)$/i.test(info.mime ?? "") && Number(info.width ?? 0) >= 1200 && Number(info.height ?? 0) >= 600;
    const autoDecision = blocked.test(subjectText) || !usableRaster || evidence.length === 0 || !recent
      ? "reject"
      : rightsClear ? "approve-candidate" : "owner-review";
    return {
      source: "Wikimedia Commons", scope, query, searchYear, title, description, categories,
      sourcePage: info.descriptionurl, imageUrl: info.url, width: info.width, height: info.height, mime: info.mime,
      creator: stripHtml(meta.Artist?.value), credit: stripHtml(meta.Credit?.value), licence,
      licenceUrl: meta.LicenseUrl?.value ?? null, dateText: dateText || null, year, recent,
      rightsClear, subjectEvidence: evidence, autoDecision,
    };
  });
}

const all = [];
for (const target of targets) {
  for (const player of target.players) {
    for (const searchYear of searchYears) all.push(...await searchPlayer(target.scope, player, searchYear));
  }
}
const deduped = [...new Map(all.filter((x) => x.imageUrl).map((x) => [x.imageUrl, x])).values()];
deduped.sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0) || (b.width ?? 0) - (a.width ?? 0));

const playerCounts = new Map();
const scopeCounts = new Map();
for (const item of deduped) {
  if (item.autoDecision !== "approve-candidate") continue;
  const playerKey = `${item.scope}:${item.subjectEvidence[0] ?? item.query}`;
  const q = playerCounts.get(playerKey) ?? 0;
  const s = scopeCounts.get(item.scope) ?? 0;
  if (q >= perQueryApprovalCap || s >= perScopeApprovalCap) {
    item.autoDecision = "diversity-hold";
    continue;
  }
  playerCounts.set(playerKey, q + 1);
  scopeCounts.set(item.scope, s + 1);
}

const counts = deduped.reduce((acc, item) => {
  acc[item.autoDecision] = (acc[item.autoDecision] ?? 0) + 1;
  return acc;
}, {});
const approved = deduped.filter((x) => x.autoDecision === "approve-candidate");
const coverage = approved.reduce((acc, item) => {
  acc[item.scope] = (acc[item.scope] ?? 0) + 1;
  return acc;
}, {});
const ownerReviewRate = deduped.length ? (counts["owner-review"] ?? 0) / deduped.length : 0;
const recentApprovalRate = approved.length ? approved.filter((x) => x.recent).length / approved.length : 0;
const maxScopeShare = approved.length ? Math.max(...Object.values(coverage)) / approved.length : 0;

const output = {
  generatedAt: new Date().toISOString(),
  policy: { recentFloor, searchYears, perPlayerApprovalCap: perQueryApprovalCap, perScopeApprovalCap, ownerReviewTargetMaximum: 0.05, relevantImageOrNoImage: true },
  counts, coverage, ownerReviewRate, recentApprovalRate, maxScopeShare, candidates: deduped,
};
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ total: deduped.length, counts, coverage, ownerReviewRate, recentApprovalRate, maxScopeShare, outputPath }, null, 2));
if (ownerReviewRate > 0.05) throw new Error(`Owner-review rate ${(ownerReviewRate * 100).toFixed(1)}% exceeds 5%.`);
