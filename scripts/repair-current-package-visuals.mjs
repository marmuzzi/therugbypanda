import { writeFileSync } from "node:fs";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("Sanity production credentials are required.");

const TEAM_GROUPS = [
  { id: "leinster", terms: ["leinster"] }, { id: "munster", terms: ["munster"] },
  { id: "ulster", terms: ["ulster"] }, { id: "connacht", terms: ["connacht"] },
  { id: "ireland", terms: ["ireland", "irish rugby"] },
  { id: "new-zealand", terms: ["new zealand", "all blacks"] },
  { id: "south-africa", terms: ["south africa", "springboks", "boks"] },
  { id: "england", terms: ["england", "red roses"] }, { id: "france", terms: ["france", "les bleus"] },
  { id: "scotland", terms: ["scotland"] }, { id: "wales", terms: ["wales"] },
  { id: "italy", terms: ["italy"] }, { id: "australia", terms: ["australia", "wallabies"] },
  { id: "argentina", terms: ["argentina", "pumas"] }, { id: "fiji", terms: ["fiji"] },
  { id: "japan", terms: ["japan"] }, { id: "samoa", terms: ["samoa"] }, { id: "tonga", terms: ["tonga"] },
];
const GENERIC = new Set(["rugby","match","matches","game","games","team","teams","player","players","coach","coaching","season","article","news","fresh","today","could","would","their","about","after","before","against"]);
const NON_RUGBY = /\b(house|residential|street scene|building|landscape|restaurant|hotel)\b/i;
const EXPLICIT_MEN = /\bmen(?:'s)?\b|\bmale\b/i;
const EXPLICIT_WOMEN = /\bwomen(?:'s)?\b|\bfemale\b|\bgirls\b/i;

function dublinDate() { return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Dublin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); }
async function query(groq, params = {}) {
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`); url.searchParams.set("query", groq);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(`$${key}`, JSON.stringify(value));
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`Sanity query failed ${response.status}: ${await response.text()}`); return (await response.json()).result;
}
async function mutate(mutations) {
  const response = await fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ mutations }) });
  if (!response.ok) throw new Error(`Sanity mutation failed ${response.status}: ${await response.text()}`);
}
function blockText(block) { return (block?.children ?? []).map((child) => child?.text ?? "").join("").trim(); }
function imageText(image) { return [image.title,image.altText,image.caption,image.subject,image.team,image.event].filter(Boolean).join(" "); }
function groupsIn(value) { const lower = String(value ?? "").toLowerCase(); return TEAM_GROUPS.filter((group) => group.terms.some((term) => lower.includes(term))).map((group) => group.id); }
function words(value) { return [...new Set(String(value ?? "").toLowerCase().split(/[^a-z0-9à-öø-ÿ]+/).filter((word) => word.length >= 5 && !GENERIC.has(word)))]; }
function namedPeople(value) { const matches = String(value ?? "").match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+\b/g) ?? []; return [...new Set(matches.filter((name) => !TEAM_GROUPS.some((group) => group.terms.includes(name.toLowerCase()))))]; }
function portableImage(image) { return { _type: "image", _key: crypto.randomUUID().replaceAll("-", "").slice(0, 12), asset: { _type: "reference", _ref: image.assetRef }, alt: image.altText ?? image.title ?? "Rugby editorial image", caption: image.caption, photographer: image.publicCredit ?? image.creditLine ?? image.photographer, source: image.source ?? image.sourceName, rights: [image.copyrightLine ?? image.copyright, image.rightsNotes].filter(Boolean).join(" — ") || undefined }; }
function negativeConflict(article, image) {
  const header = `${article.title ?? ""} ${article.standfirst ?? ""}`; const story = `${header} ${(article.body ?? []).filter((b) => b?._type === "block").map(blockText).join(" ")}`; const meta = imageText(image);
  if (!image.assetRef || NON_RUGBY.test(meta)) return true;
  const primaryTeams = groupsIn(header), imageTeams = groupsIn(meta);
  if (imageTeams.length && primaryTeams.length && !imageTeams.some((team) => primaryTeams.includes(team))) return true;
  if (imageTeams.length && !primaryTeams.length) return true;
  if (namedPeople(meta).some((person) => !story.toLowerCase().includes(person.toLowerCase()))) return true;
  if (EXPLICIT_WOMEN.test(header) && EXPLICIT_MEN.test(meta)) return true;
  if (!EXPLICIT_WOMEN.test(header) && EXPLICIT_WOMEN.test(meta)) return true;
  return false;
}
function relevance(article, image, paragraph = null) {
  if (negativeConflict(article, image)) return -Infinity;
  const header = `${article.title ?? ""} ${article.standfirst ?? ""}`; const meta = imageText(image); const target = paragraph ?? header;
  const exactPeople = namedPeople(target).filter((person) => meta.toLowerCase().includes(person.toLowerCase()));
  const imageTeams = groupsIn(meta); const teamMatches = groupsIn(target).filter((team) => imageTeams.includes(team)); const shared = words(target).filter((word) => meta.toLowerCase().includes(word));
  if (!exactPeople.length && !teamMatches.length && shared.length < 2) return -Infinity;
  return exactPeople.length * 100 + teamMatches.length * 45 + Math.min(shared.length, 8) * 5;
}

const date = dublinDate(); const prefix = `current-${date}-*`;
const articles = await query(`*[_type == "article" && _id in path("drafts.**") && morningPackageEligible == true && automationContentClass == "production" && editorialInputId match $prefix] | order(_updatedAt desc)[0...5]{_id,title,standfirst,body,editorialInputId,"currentHero":featuredImage.asset._ref}`, { prefix });
if (articles.length !== 5 || new Set(articles.map((a) => a.editorialInputId)).size !== 5) throw new Error(`Expected exact current package of five for ${date}.`);
const images = await query(`*[_type == "editorialImage" && !(_id in path("drafts.**")) && usageApproved == true && lifecycleStatus in ["approved","published"] && defined(image.asset._ref)] | order(_updatedAt desc)[0...1000]{_id,title,altText,caption,subject,team,event,source,sourceName,rightsNotes,publicCredit,creditLine,photographer,copyrightLine,copyright,"assetRef":image.asset._ref}`);
const byAsset = new Map(images.map((image) => [image.assetRef, image])); const globallyUsed = new Set(); const summary = [];
for (const article of articles) {
  const rankedHero = images.map((image) => ({ image, score: relevance(article, image) })).filter(({ image, score }) => !globallyUsed.has(image.assetRef) && Number.isFinite(score) && score >= 45).sort((a,b) => b.score - a.score);
  let hero = rankedHero[0];
  if (!hero && article.currentHero) { const current = byAsset.get(article.currentHero); if (current && !globallyUsed.has(current.assetRef) && !negativeConflict(article, current)) hero = { image: current, score: 1, retained: true }; }
  if (!hero) throw new Error(`No defensible rights-approved hero for ${article.title}.`); globallyUsed.add(hero.image.assetRef);
  const cleanBody = (article.body ?? []).filter((block) => block?._type !== "image"); const selections = [];
  for (const block of cleanBody) {
    if (block?._type !== "block" || block.style === "h2") continue; const paragraph = blockText(block); if (!paragraph) continue;
    const ranked = images.map((image) => ({ image, score: relevance({ ...article, body: cleanBody }, image, paragraph) })).filter(({ image, score }) => !globallyUsed.has(image.assetRef) && image.assetRef !== hero.image.assetRef && Number.isFinite(score) && score >= 45).sort((a,b) => b.score - a.score);
    if (ranked[0]) { selections.push({ ...ranked[0], afterKey: block._key }); globallyUsed.add(ranked[0].image.assetRef); } if (selections.length === 2) break;
  }
  const body = []; for (const block of cleanBody) { body.push(block); const selected = selections.find((item) => item.afterKey === block?._key); if (selected) body.push(portableImage(selected.image)); }
  const featuredImage = portableImage(hero.image); delete featuredImage._key; await mutate([{ patch: { id: article._id, set: { featuredImage, body } } }]);
  summary.push({ editorialInputId: article.editorialInputId, title: article.title, hero: { title: hero.image.title, team: hero.image.team, score: hero.score, retained: Boolean(hero.retained) }, inline: selections.map((x) => ({ title: x.image.title, team: x.image.team, score: x.score })), inlineCount: selections.length });
}
const verify = await query(`*[_type == "article" && _id in path("drafts.**") && morningPackageEligible == true && automationContentClass == "production" && editorialInputId match $prefix] | order(_updatedAt desc)[0...5]{editorialInputId,title,"hero":featuredImage.asset._ref,"inline":body[_type == "image"].asset._ref}`, { prefix });
for (const article of verify) if (!article.hero) throw new Error(`Hero readback failed for ${article.title}.`);
writeFileSync("current-package-visual-repair.json", `${JSON.stringify({ date, status: "verified", articles: summary, readback: verify }, null, 2)}\n`); console.log(JSON.stringify({ date, status: "verified", articleCount: summary.length, articles: summary }, null, 2));
