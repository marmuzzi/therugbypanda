import fs from "node:fs/promises";
import path from "node:path";

const API = "https://commons.wikimedia.org/w/api.php";
const planPath = process.env.IMAGE_PLAN_PATH ?? "daily-article-image-plan.json";
const outputPath = process.env.WIKIMEDIA_OUTPUT ?? "data/editorial-images/daily-deficit-candidates.json";
const perQuery = Math.min(Number.parseInt(process.env.WIKIMEDIA_RESULTS_PER_QUERY ?? "20", 10), 40);
const maxQueriesPerArticle = Math.max(1, Number.parseInt(process.env.IMAGE_MAX_QUERIES_PER_ARTICLE ?? "5", 10));
const allowedLicences = /^(CC BY(?:-SA)?(?: [234]\.0)?|CC0|Public domain)/i;
const blocked = /\b(logo|crest|flag|kit template|shirt template|svg|diagram|line-?up)\b/i;
const teams = ["Leinster", "Munster", "Ulster", "Connacht", "Ireland", "New Zealand", "All Blacks", "South Africa", "Springboks", "England", "Scotland", "Wales", "France", "Italy", "Australia", "Wallabies", "Argentina", "Pumas", "Fiji", "Japan", "Samoa", "Tonga"];

function stripHtml(value = "") { return String(value).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim(); }
function norm(value = "") { return stripHtml(value).normalize("NFKD").toLowerCase(); }
function yearFrom(...values) { const m = values.filter(Boolean).join(" ").match(/\b(20\d{2})\b/); return m ? Number(m[1]) : null; }
function articleWomenSpecific(plan) { return /\bwomen(?:'s)?\b|\bwomens\b|\bfemale\b|\bgirls\b/i.test(`${plan.title ?? ""}`); }
function primaryTeam(plan) { const value = norm(plan.title); return teams.find((team) => value.includes(team.toLowerCase())) ?? null; }
function rugbyGenderEvidence(value) {
  const text = norm(value);
  return /(?:women|womens|girls|female).{0,45}rugby|rugby.{0,45}(?:women|womens|girls|female)/i.test(text);
}
function subjectEvidenceFor(plan, evidenceText) {
  const text = norm(evidenceText);
  const evidence = [];
  const team = primaryTeam(plan);
  if (team && text.includes(team.toLowerCase())) evidence.push(team);
  const women = articleWomenSpecific(plan);
  if (women && rugbyGenderEvidence(text)) evidence.push("women/girls rugby");
  if (!women && /\brugby\b/i.test(text)) evidence.push("rugby");
  const titlePeople = String(plan.title ?? "").match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+\b/g) ?? [];
  for (const person of titlePeople) {
    if (teams.includes(person)) continue;
    if (text.includes(norm(person))) evidence.push(person);
  }
  if (team && !evidence.includes(team)) return [];
  if (women && !evidence.includes("women/girls rugby")) return [];
  if (!women && !/\brugby\b/i.test(text)) return [];
  return [...new Set(evidence)];
}

async function search(plan, query) {
  const url = new URL(API);
  Object.entries({ action:"query", format:"json", generator:"search", gsrnamespace:"6", gsrsearch:query, gsrlimit:String(perQuery), prop:"imageinfo", iiprop:"url|size|mime|extmetadata" }).forEach(([k,v]) => url.searchParams.set(k,v));
  const response = await fetch(url, { headers:{ "User-Agent":"TheRugbyPanda/1.0 (daily editorial image deficit discovery; hello@therugbypanda.ie)" } });
  if (!response.ok) throw new Error(`Commons search failed ${response.status} for ${query}`);
  const payload = await response.json();
  return Object.values(payload?.query?.pages ?? {}).map((page) => {
    const info = page.imageinfo?.[0] ?? {};
    const meta = info.extmetadata ?? {};
    const title = String(page.title ?? "").replace(/^File:/, "");
    const description = stripHtml(meta.ImageDescription?.value);
    const categories = stripHtml(meta.Categories?.value);
    const evidenceText = `${title} ${description} ${categories}`;
    const licence = stripHtml(meta.LicenseShortName?.value);
    const dateText = stripHtml(meta.DateTimeOriginal?.value || meta.DateTime?.value);
    const year = yearFrom(dateText, title, description);
    const subjectEvidence = subjectEvidenceFor(plan, evidenceText);
    const exactSubject = subjectEvidence.length > 0;
    const usableRaster = /^image\/(jpeg|png|webp)$/i.test(info.mime ?? "") && Number(info.width ?? 0) >= 1200 && Number(info.height ?? 0) >= 600;
    const rightsClear = allowedLicences.test(licence) && Boolean(meta.LicenseUrl?.value || /CC0|Public domain/i.test(licence));
    const autoDecision = blocked.test(evidenceText) || !usableRaster || !exactSubject ? "reject" : rightsClear ? "approve-candidate" : "owner-review";
    return {
      articleId:plan.articleId, editorialInputId:plan.editorialInputId, article:plan.title,
      query, source:"Wikimedia Commons", title, description, categories,
      sourcePage:info.descriptionurl, imageUrl:info.url, width:info.width, height:info.height, mime:info.mime,
      creator:stripHtml(meta.Artist?.value), credit:stripHtml(meta.Credit?.value), licence,
      licenceUrl:meta.LicenseUrl?.value ?? null, dateText:dateText || null, year,
      recent:Number(year ?? 0) >= 2024, exactSubject, subjectEvidence, scope: primaryTeam(plan) ?? "Rugby",
      rightsClear, autoDecision, decision:autoDecision,
    };
  });
}

const plan = JSON.parse(await fs.readFile(planPath, "utf8"));
if (plan.articleCount !== 5 || !Array.isArray(plan.plans) || plan.plans.length !== 5) throw new Error("MEDIA-011 fail-closed: image plan must contain exactly five articles.");
const deficits = plan.plans.filter((x) => Number(x.deficit ?? 0) > 0);
const all = [];
for (const article of deficits) {
  const queries = [...new Set(article.acquisitionQueries ?? [])].slice(0, maxQueriesPerArticle);
  if (!queries.length) throw new Error(`MEDIA-011 fail-closed: ${article.title} has an image deficit but no targeted acquisition query.`);
  for (const query of queries) all.push(...await search(article, query));
}
const deduped = [...new Map(all.filter((x) => x.imageUrl).map((x) => [x.imageUrl, x])).values()];
deduped.sort((a,b) => Number(b.recent)-Number(a.recent) || Number(b.year ?? 0)-Number(a.year ?? 0) || Number(b.width ?? 0)-Number(a.width ?? 0));
const counts = deduped.reduce((acc,x) => { acc[x.autoDecision]=(acc[x.autoDecision]??0)+1; return acc; },{});
const byArticle = {};
for (const x of deduped.filter((x) => x.autoDecision === "approve-candidate")) byArticle[x.article] = (byArticle[x.article] ?? 0) + 1;
const result = { generatedAt:new Date().toISOString(), contract:"MEDIA-011 dynamic daily deficit acquisition", sourcePlanGeneratedAt:plan.generatedAt, deficitArticleCount:deficits.length, totalDeficit:plan.totalDeficit, counts, byArticle, candidates:deduped };
await fs.mkdir(path.dirname(outputPath), { recursive:true });
await fs.writeFile(outputPath, `${JSON.stringify(result,null,2)}\n`);
console.log(JSON.stringify({deficitArticleCount:deficits.length,totalDeficit:plan.totalDeficit,totalCandidates:deduped.length,counts,byArticle},null,2));
