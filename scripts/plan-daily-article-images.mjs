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
const GENERIC = new Set(["rugby","article","season","team","teams","player","players","coach","coaching","return","preview","final","depth","women","womens","irish"]);

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
function tokens(value = "") {
  return [...new Set(lower(value).split(/[^a-z0-9à-öø-ÿ'’.-]+/).filter((x) => x.length >= 5 && !GENERIC.has(x)))];
}
function namedPhrases(value = "") {
  const matches = text(value).match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+(?:\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+){1,3}\b/g) ?? [];
  return [...new Set(matches.map(text).filter((x) => !TEAMS.includes(x)))];
}
function storyWomenSpecific(value = "") { return /\bwomen(?:'s)?\b|\bwomens\b|\bfemale\b/i.test(value); }
function imageText(image) { return [image.title,image.altText,image.caption,image.subject,image.team,image.event].filter(Boolean).join(" "); }

function scoreCandidate(article, image) {
  if (!image.assetRef) return Number.NEGATIVE_INFINITY;
  const story = [article.title, article.standfirst].filter(Boolean).join(" ");
  const storyLower = lower(story);
  const meta = lower(imageText(image));
  const storyTeams = TEAMS.filter((team) => storyLower.includes(team.toLowerCase()));
  const imageTeams = TEAMS.filter((team) => meta.includes(team.toLowerCase()));
  if (storyTeams.length && imageTeams.length && !storyTeams.some((team) => imageTeams.includes(team))) return Number.NEGATIVE_INFINITY;
  if (storyWomenSpecific(story) && meta.includes("ireland") && !storyWomenSpecific(meta)) return Number.NEGATIVE_INFINITY;

  const people = namedPhrases(story);
  const exactPeople = people.filter((person) => meta.includes(person.toLowerCase()));
  const shared = tokens(story).filter((term) => meta.includes(term));
  const teamMatch = storyTeams.some((team) => meta.includes(team.toLowerCase()));
  if (!exactPeople.length && !teamMatch && shared.length < 2) return Number.NEGATIVE_INFINITY;
  return exactPeople.length * 100 + (teamMatch ? 35 : 0) + Math.min(shared.length, 8) * 5;
}

function acquisitionQueries(article) {
  const story = [article.title, article.standfirst].filter(Boolean).join(" ");
  const people = namedPhrases(story).slice(0, 3);
  const team = TEAMS.find((x) => lower(story).includes(x.toLowerCase()));
  const queries = [];
  for (const person of people) {
    queries.push(`${person} rugby 2026`, `${person} ${team ?? "rugby"}`, `${person} rugby 2025`);
  }
  if (team) queries.push(`${team} rugby 2026`, `${team} rugby stadium 2026`);
  return [...new Set(queries)].slice(0, 8);
}

const packageDate = operationalDate();
const packageInputPrefix = `current-${packageDate}-*`;
const articles = await query(`*[_type == "article" && _id in path("drafts.**") && morningPackageEligible == true && automationContentClass == "production" && editorialInputId match $packageInputPrefix] | order(_updatedAt desc)[0...5]{
  _id,title,standfirst,editorialInputId,_updatedAt,
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

const packageUsed = new Set();
const plans = articles.map((article) => {
  const ranked = images
    .filter((image) => !packageUsed.has(image.assetRef))
    .map((image) => ({ image, score: scoreCandidate(article, image) }))
    .filter(({ score }) => Number.isFinite(score) && score >= 35)
    .sort((a,b) => b.score - a.score);

  const candidates = ranked.slice(0, targetDepth).map(({ image, score }) => ({
    imageId:image._id, assetRef:image.assetRef, title:image.title ?? null, score,
    subject:image.subject ?? null, team:image.team ?? null, event:image.event ?? null,
    captureDate:image.captureDate ?? null, source:image.source ?? image.sourceName ?? null,
    rights:image.rightsNotes ?? null, credit:image.publicCredit ?? image.creditLine ?? null,
  }));
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
  generatedAt:new Date().toISOString(),
  packageDate,
  packageInputPrefix,
  contract:"MEDIA-011 daily reusable image-depth plan",
  targetPerArticle:targetDepth,
  articleCount:plans.length,
  articlesMeetingTarget:plans.filter((x) => x.deficit === 0).length,
  totalLocalCandidates:plans.reduce((sum,x) => sum + x.localCandidateCount,0),
  totalDeficit:plans.reduce((sum,x) => sum + x.deficit,0),
  failClosed:true,
  plans,
};
writeFileSync("daily-article-image-plan.json", `${JSON.stringify(result,null,2)}\n`, "utf8");
console.log(JSON.stringify({packageDate,articleCount:result.articleCount,articlesMeetingTarget:result.articlesMeetingTarget,totalLocalCandidates:result.totalLocalCandidates,totalDeficit:result.totalDeficit},null,2));
