import { writeFileSync } from "node:fs";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const targetDepth = Number.parseInt(process.env.IMAGE_CANDIDATE_TARGET ?? "3", 10);

if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is required.");
if (!token) throw new Error("SANITY_API_TOKEN is required.");
if (!Number.isFinite(targetDepth) || targetDepth < 1) throw new Error("IMAGE_CANDIDATE_TARGET must be >= 1.");

const TEAMS = ["Leinster", "Munster", "Ulster", "Connacht", "Ireland", "New Zealand", "All Blacks", "South Africa", "Springboks", "England", "Scotland", "Wales", "France", "Italy", "Australia", "Wallabies", "Argentina", "Pumas", "Fiji", "Japan", "Samoa", "Tonga"];
const GENERIC = new Set(["rugby","article","season","team","teams","player","players","coach","coaching","return","preview","final","depth","women","womens","girls","irish"]);
const GENERIC_INLINE = new Set(["rugby","match","game","team","teams","player","players","season","squad","coach","coaching","article","news","preview","depth","fresh","live","makes","gives","could","change","return","academy","front","row"]);
const CONTEXT_GROUPS = [
  { team: "Leinster", terms: ["leinster", "rds", "donnybrook"] },
  { team: "Munster", terms: ["munster", "thomond park", "limerick"] },
  { team: "Ulster", terms: ["ulster", "kingspan stadium", "belfast"] },
  { team: "Connacht", terms: ["connacht", "dexcom stadium", "sportsground", "galway"] },
];
const NON_RUGBY_VISUAL = /\b(derelict building|left me all alone|house|residential|street scene)\b/i;
const NON_PERSON_TERMS = new Set([
  ...TEAMS,
  "Rugby", "URC", "United Rugby", "Champions Cup", "Challenge Cup", "Six Nations", "World Cup", "Global Series", "Academy",
  "Thomond Park", "Aviva Stadium", "Dexcom Stadium", "Kingspan Stadium", "Affidea Stadium",
]);
const NON_PERSON_WORDS = new Set([
  "rugby", "stadium", "championship", "cup", "club", "football", "union", "province", "provinces", "ireland",
  "leinster", "munster", "ulster", "connacht", "nations", "united", "champions", "challenge", "european", "aviva",
  "kingspan", "affidea", "sportsground", "thomond", "dexcom", "rds", "urc", "world", "series", "league", "team", "academy",
  "blacks", "springboks", "zealand", "africa", "wallabies", "england", "scotland", "wales", "france", "italy", "australia",
]);

async function query(groq, params = {}) {
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set("query", groq);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(`$${key}`, JSON.stringify(value));
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`Sanity query failed (${response.status}): ${await response.text()}`);
  return (await response.json()).result;
}

function operationalDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Dublin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
function text(value = "") { return String(value ?? "").replace(/\s+/g, " ").trim(); }
function lower(value = "") { return text(value).toLowerCase(); }
function blockText(block) { return (block?.children ?? []).map((child) => child?.text ?? "").join("").trim(); }
function articleParagraphs(article) { return (article.body ?? []).filter((block) => block?._type === "block" && block.style !== "h2").map(blockText).filter(Boolean); }
function articleHeader(article) { return [article.title, article.standfirst].filter(Boolean).join(" "); }
function tokens(value = "") { return [...new Set(lower(value).split(/[^a-z0-9à-öø-ÿ'’.-]+/).filter((x) => x.length >= 5 && !GENERIC.has(x)))]; }
function inlineTerms(value = "") { return [...new Set(lower(value).split(/[^a-z0-9à-öø-ÿ]+/).filter((x) => x.length >= 5 && !GENERIC_INLINE.has(x)))]; }
function namedPhrases(value = "") {
  const matches = text(value).match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+(?:\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+){1,3}\b/g) ?? [];
  return [...new Set(matches.map(text).filter((x) => !TEAMS.includes(x)))];
}
function storyWomenSpecific(value = "") { return /\bwomen(?:'s)?\b|\bwomens\b|\bfemale\b|\bgirls\b/i.test(value); }
function imageText(image) { return [image.title,image.altText,image.caption,image.subject,image.team,image.event].filter(Boolean).join(" "); }
function namedPersonPhrasesFromImage(image) {
  const matches = imageText(image).match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+(?:\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+){1,3}\b/g) ?? [];
  return [...new Set(matches.map(text).filter((match) => {
    if (NON_PERSON_TERMS.has(match)) return false;
    const terms = match.toLowerCase().split(/[^a-zà-öø-ÿ'’.-]+/).filter(Boolean);
    if (terms.length < 2) return false;
    return !terms.some((term) => NON_PERSON_WORDS.has(term));
  }))];
}

function contextConflict(primaryTitleLower, storyLower, imageMeta) {
  const primaryGroups = CONTEXT_GROUPS.filter((group) => group.terms.some((term) => primaryTitleLower.includes(term)));
  const storyGroups = CONTEXT_GROUPS.filter((group) => group.terms.some((term) => storyLower.includes(term)));
  const imageGroups = CONTEXT_GROUPS.filter((group) => group.terms.some((term) => imageMeta.includes(term)));
  if (!imageGroups.length) return false;
  if (primaryGroups.length) return imageGroups.some((imageGroup) => !primaryGroups.some((primaryGroup) => imageGroup.team === primaryGroup.team));
  if (!storyGroups.length) return true;
  return !storyGroups.some((storyGroup) => imageGroups.some((imageGroup) => imageGroup.team === storyGroup.team));
}

function baseRelevance(article, image) {
  if (!image.assetRef) return Number.NEGATIVE_INFINITY;
  const header = articleHeader(article);
  const story = [header, ...articleParagraphs(article)].filter(Boolean).join(" ");
  const titleLower = lower(article.title);
  const headerLower = lower(header);
  const storyLower = lower(story);
  const meta = lower(imageText(image));
  if (NON_RUGBY_VISUAL.test(meta)) return Number.NEGATIVE_INFINITY;
  if (contextConflict(titleLower, storyLower, meta)) return Number.NEGATIVE_INFINITY;
  const imagePeople = namedPersonPhrasesFromImage(image);
  if (imagePeople.some((person) => !storyLower.includes(person.toLowerCase()))) return Number.NEGATIVE_INFINITY;
  const titleTeams = TEAMS.filter((team) => titleLower.includes(team.toLowerCase()));
  const primaryTeams = TEAMS.filter((team) => headerLower.includes(team.toLowerCase()));
  const imageTeams = TEAMS.filter((team) => meta.includes(team.toLowerCase()));
  if (titleTeams.length && imageTeams.length && imageTeams.some((team) => !titleTeams.includes(team))) return Number.NEGATIVE_INFINITY;
  if (!titleTeams.length && primaryTeams.length && imageTeams.length && !primaryTeams.some((team) => imageTeams.includes(team))) return Number.NEGATIVE_INFINITY;
  const storyIsWomen = storyWomenSpecific(header);
  const imageIsWomen = storyWomenSpecific(meta);
  if (storyIsWomen !== imageIsWomen) return Number.NEGATIVE_INFINITY;
  const people = namedPhrases(story);
  const exactPeople = people.filter((person) => meta.includes(person.toLowerCase()));
  const shared = tokens(story).filter((term) => meta.includes(term));
  const teamMatch = (titleTeams.length ? titleTeams : primaryTeams).some((team) => meta.includes(team.toLowerCase()));
  if (!exactPeople.length && !teamMatch && shared.length < 2) return Number.NEGATIVE_INFINITY;
  return exactPeople.length * 100 + (teamMatch ? 35 : 0) + Math.min(shared.length, 8) * 5;
}

function inlineRelevance(article, image) {
  const meta = lower(imageText(image));
  const paragraphs = articleParagraphs(article);
  let best = Number.NEGATIVE_INFINITY;
  for (const paragraph of paragraphs) {
    const paragraphLower = lower(paragraph);
    const paragraphTeams = TEAMS.filter((team) => paragraphLower.includes(team.toLowerCase()));
    const teamMatch = paragraphTeams.some((team) => meta.includes(team.toLowerCase()));
    const shared = inlineTerms(paragraph).filter((term) => meta.includes(term));
    const people = namedPhrases(paragraph);
    const personMatch = people.some((person) => meta.includes(person.toLowerCase()));
    if (!personMatch && !teamMatch && shared.length < 2) continue;
    best = Math.max(best, (personMatch ? 50 : 0) + (teamMatch ? 24 : 0) + Math.min(shared.length, 5) * 4);
  }
  return best;
}

function scoreCandidate(article, image) {
  const base = baseRelevance(article, image);
  if (!Number.isFinite(base)) return Number.NEGATIVE_INFINITY;
  const inline = inlineRelevance(article, image);
  if (!Number.isFinite(inline) || inline < 20) return Number.NEGATIVE_INFINITY;
  return base + Math.min(inline, 40);
}
function candidateShape(image, score, sourceRole = "library") {
  return {
    imageId:image._id, assetRef:image.assetRef, title:image.title ?? null, score, sourceRole,
    subject:image.subject ?? null, team:image.team ?? null, event:image.event ?? null,
    captureDate:image.captureDate ?? null, source:image.source ?? image.sourceName ?? null,
    rights:image.rightsNotes ?? null, credit:image.publicCredit ?? image.creditLine ?? null,
  };
}

function acquisitionQueries(article) {
  const header = articleHeader(article);
  const headerLower = lower(header);
  const team = TEAMS.find((x) => headerLower.includes(x.toLowerCase()));
  const queries = [];
  if (storyWomenSpecific(header)) {
    const ageGrade = /\bu[- ]?18\b/i.test(header) ? "U18" : null;
    if (team && ageGrade) queries.push(`${team} ${ageGrade} Girls rugby`, `${team} ${ageGrade} Women rugby`, `${team} Girls Interprovincial rugby`, `${team} Under 18 Girls rugby`);
    if (team) queries.push(`${team} women rugby`, `${team} girls rugby`);
    return [...new Set(queries)].slice(0, 8);
  }
  const people = namedPhrases(header).filter((phrase) => !/\b(?:U-?\d+|Girls|Women|Rugby|Leinster|Munster|Ulster|Connacht|Ireland)\b/i.test(phrase)).slice(0, 3);
  for (const person of people) queries.push(`${person} rugby 2026`, `${person} ${team ?? "rugby"}`, `${person} rugby 2025`);
  if (team) queries.push(`${team} rugby 2026`, `${team} rugby stadium 2026`);
  return [...new Set(queries)].slice(0, 8);
}

const packageDate = operationalDate();
const packageInputPrefix = `current-${packageDate}-*`;
const articles = await query(`*[_type == "article" && _id in path("drafts.**") && morningPackageEligible == true && automationContentClass == "production" && editorialInputId match $packageInputPrefix] | order(_updatedAt desc)[0...5]{
  _id,title,standfirst,body,editorialInputId,_updatedAt,
  "featuredAsset":featuredImage.asset._ref,
  "inlineAssets":body[_type == "image"].asset._ref
}`, { packageInputPrefix });
if (articles.length !== 5) throw new Error(`Expected exactly five current-package drafts for ${packageDate}, found ${articles.length}. Fail closed.`);
if (new Set(articles.map((x) => x.editorialInputId).filter(Boolean)).size !== 5) throw new Error("Current-package drafts do not have five distinct editorialInputId values. Fail closed.");

const images = await query(`*[_type == "editorialImage" && !(_id in path("drafts.**")) && usageApproved == true && lifecycleStatus in ["approved","published"] && defined(image.asset._ref)] | order(_updatedAt desc)[0...1000]{
  _id,title,altText,caption,subject,team,event,captureDate,source,sourceName,rightsNotes,publicCredit,creditLine,
  "assetRef":image.asset._ref,
  "assetUrl":image.asset->url
}`);
const imageByAsset = new Map(images.map((image) => [image.assetRef, image]));
const packageUsed = new Set();
const plans = articles.map((article) => {
  const existingSafe = [];
  const featured = imageByAsset.get(article.featuredAsset);
  const featuredScore = featured ? baseRelevance(article, featured) : Number.NEGATIVE_INFINITY;
  if (featured && Number.isFinite(featuredScore) && !packageUsed.has(featured.assetRef)) existingSafe.push(candidateShape(featured, featuredScore, "existing-featured"));
  for (const assetRef of article.inlineAssets ?? []) {
    if (existingSafe.length >= targetDepth) break;
    const image = imageByAsset.get(assetRef);
    if (!image || packageUsed.has(image.assetRef) || existingSafe.some((item) => item.assetRef === image.assetRef)) continue;
    const base = baseRelevance(article, image);
    const inline = inlineRelevance(article, image);
    if (Number.isFinite(base) && Number.isFinite(inline) && inline >= 20) existingSafe.push(candidateShape(image, base + Math.min(inline, 40), "existing-inline"));
  }

  const reserved = new Set(existingSafe.map((item) => item.assetRef));
  const ranked = images
    .filter((image) => !packageUsed.has(image.assetRef) && !reserved.has(image.assetRef))
    .map((image) => ({ image, score: scoreCandidate(article, image) }))
    .filter(({ score }) => Number.isFinite(score) && score >= 55)
    .sort((a,b) => b.score - a.score);
  const candidates = [...existingSafe, ...ranked.map(({ image, score }) => candidateShape(image, score))].slice(0, targetDepth);
  for (const candidate of candidates) packageUsed.add(candidate.assetRef);
  const deficit = Math.max(0, targetDepth - candidates.length);
  return {
    articleId:article._id,
    editorialInputId:article.editorialInputId,
    title:article.title,
    updatedAt:article._updatedAt,
    existingFeaturedAsset:article.featuredAsset ?? null,
    existingInlineAssets:article.inlineAssets ?? [],
    candidateTarget:targetDepth,
    localCandidateCount:candidates.length,
    candidates,
    deficit,
    acquisitionRequired:deficit > 0,
    acquisitionQueries:deficit > 0 ? acquisitionQueries(article) : [],
  };
});

const result = {
  generatedAt:new Date().toISOString(), packageDate, packageInputPrefix,
  contract:"MEDIA-011 daily reusable image-depth plan", targetPerArticle:targetDepth,
  articleCount:plans.length, articlesMeetingTarget:plans.filter((x) => x.deficit === 0).length,
  totalLocalCandidates:plans.reduce((sum,x) => sum + x.localCandidateCount,0),
  totalDeficit:plans.reduce((sum,x) => sum + x.deficit,0), failClosed:true, plans,
};
writeFileSync("daily-article-image-plan.json", `${JSON.stringify(result,null,2)}\n`, "utf8");
console.log(JSON.stringify({packageDate,articleCount:result.articleCount,articlesMeetingTarget:result.articlesMeetingTarget,totalLocalCandidates:result.totalLocalCandidates,totalDeficit:result.totalDeficit},null,2));
