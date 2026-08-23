import fs from "node:fs/promises";
import path from "node:path";

const API = "https://commons.wikimedia.org/w/api.php";
const outputPath = process.env.WIKIMEDIA_OUTPUT ?? "data/editorial-images/wikimedia-european-club-candidates.json";
const recentFloor = 2025;
const searchYears = [2026, 2025];
const perTeamApprovalCap = 2;

const teams = [
  "Stade Toulousain",
  "Union Bordeaux Bègles",
  "Stade Rochelais",
  "RC Toulon",
  "ASM Clermont Auvergne",
  "Racing 92",
  "Bath Rugby",
  "Northampton Saints",
  "Leicester Tigers",
  "Saracens",
  "Harlequins",
  "Bristol Bears",
  "Gloucester Rugby",
  "Sale Sharks",
  "Exeter Chiefs",
  "Montpellier Hérault Rugby",
];

const aliases = {
  "Stade Toulousain": ["Stade Toulousain", "Toulouse rugby"],
  "Union Bordeaux Bègles": ["Union Bordeaux Bègles", "Bordeaux Bègles"],
  "Stade Rochelais": ["Stade Rochelais", "La Rochelle rugby"],
  "RC Toulon": ["RC Toulon", "Toulon rugby"],
  "ASM Clermont Auvergne": ["ASM Clermont Auvergne", "Clermont rugby"],
  "Racing 92": ["Racing 92"],
  "Bath Rugby": ["Bath Rugby"],
  "Northampton Saints": ["Northampton Saints"],
  "Leicester Tigers": ["Leicester Tigers"],
  "Saracens": ["Saracens rugby"],
  "Harlequins": ["Harlequins rugby"],
  "Bristol Bears": ["Bristol Bears rugby"],
  "Gloucester Rugby": ["Gloucester Rugby"],
  "Sale Sharks": ["Sale Sharks rugby"],
  "Exeter Chiefs": ["Exeter Chiefs rugby"],
  "Montpellier Hérault Rugby": ["Montpellier Hérault Rugby", "Montpellier rugby"],
};

const allowedLicences = /^(CC BY(?:-SA)?(?: [234]\.0)?|CC0|Public domain)/i;
const blocked = /\b(logo|crest|badge|emblem|flag|kit template|shirt template|jersey template|svg|diagram|rugby league)\b/i;

function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}
function escapeRegExp(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function extractYear(...values) {
  const match = values.filter(Boolean).join(" ").match(/\b(20\d{2})\b/);
  return match ? Number(match[1]) : null;
}
function hasTeamEvidence(text, team) {
  return (aliases[team] ?? [team]).some((alias) => new RegExp(`\\b${escapeRegExp(alias)}\\b`, "i").test(text));
}

async function searchTeam(team, searchYear) {
  const primaryAlias = aliases[team]?.[0] ?? team;
  const query = `\"${primaryAlias}\" rugby ${searchYear}`;
  const url = new URL(API);
  const params = {
    action: "query", format: "json", generator: "search", gsrnamespace: "6",
    gsrsearch: query, gsrlimit: "20", prop: "imageinfo", iiprop: "url|size|mime|extmetadata",
  };
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
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
    const evidence = hasTeamEvidence(subjectText, team) ? [team] : [];
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
      source: "Wikimedia Commons", scope: team, query, searchYear, title, description, categories,
      sourcePage: info.descriptionurl, imageUrl: info.url, width: info.width, height: info.height, mime: info.mime,
      creator: stripHtml(meta.Artist?.value), credit: stripHtml(meta.Credit?.value), licence,
      licenceUrl: meta.LicenseUrl?.value ?? null, dateText: dateText || null, year, recent,
      rightsClear, subjectEvidence: evidence, autoDecision,
    };
  });
}

const all = [];
for (const team of teams) {
  for (const searchYear of searchYears) all.push(...await searchTeam(team, searchYear));
}
const deduped = [...new Map(all.filter((item) => item.imageUrl).map((item) => [item.imageUrl, item])).values()];
deduped.sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0) || (b.width ?? 0) - (a.width ?? 0));

const teamCounts = new Map();
for (const item of deduped) {
  if (item.autoDecision !== "approve-candidate") continue;
  const count = teamCounts.get(item.scope) ?? 0;
  if (count >= perTeamApprovalCap) {
    item.autoDecision = "diversity-hold";
    continue;
  }
  teamCounts.set(item.scope, count + 1);
}

const counts = deduped.reduce((acc, item) => {
  acc[item.autoDecision] = (acc[item.autoDecision] ?? 0) + 1;
  return acc;
}, {});
const approved = deduped.filter((item) => item.autoDecision === "approve-candidate");
const coverage = approved.reduce((acc, item) => {
  acc[item.scope] = (acc[item.scope] ?? 0) + 1;
  return acc;
}, {});
const ownerReviewRate = deduped.length ? (counts["owner-review"] ?? 0) / deduped.length : 0;
const recentApprovalRate = approved.length ? approved.filter((item) => item.recent).length / approved.length : 0;
const maxScopeShare = approved.length ? Math.max(...Object.values(coverage)) / approved.length : 0;

const output = {
  generatedAt: new Date().toISOString(),
  policy: {
    recentFloor,
    searchYears,
    perTeamApprovalCap,
    ownerReviewTargetMaximum: 0.05,
    exactTeamEvidenceRequired: true,
    relevantImageOrNoImage: true,
  },
  counts,
  coverage,
  ownerReviewRate,
  recentApprovalRate,
  maxScopeShare,
  candidates: deduped,
};
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ total: deduped.length, counts, coverage, ownerReviewRate, recentApprovalRate, maxScopeShare, outputPath }, null, 2));
if (ownerReviewRate > 0.05) throw new Error(`Owner-review rate ${(ownerReviewRate * 100).toFixed(1)}% exceeds 5%.`);
