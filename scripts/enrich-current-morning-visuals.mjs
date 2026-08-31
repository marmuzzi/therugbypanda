import { readFileSync, writeFileSync } from "node:fs";
import { buildContextualDataCard } from "../lib/editorial/ContextualDataCardBuilder.ts";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const planPath = process.env.IMAGE_PLAN_PATH ?? "daily-article-image-plan-after-acquisition.json";

if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is required.");
if (!token) throw new Error("SANITY_API_TOKEN is required.");

const MAX_INLINE_IMAGES = 2;
const TEAM_TERMS = [
  "Leinster", "Munster", "Ulster", "Connacht", "Ireland", "New Zealand", "All Blacks", "South Africa", "Springboks",
  "England", "Scotland", "Wales", "France", "Italy", "Australia", "Wallabies", "Argentina", "Pumas", "Fiji", "Japan", "Samoa", "Tonga",
];
const NON_PERSON_TERMS = new Set([
  ...TEAM_TERMS,
  "Rugby", "URC", "United Rugby", "Champions Cup", "Challenge Cup", "Six Nations", "World Cup", "Global Series", "Academy",
  "Thomond Park", "Aviva Stadium", "Dexcom Stadium", "Kingspan Stadium", "Affidea Stadium",
]);
const NON_PERSON_WORDS = new Set([
  "rugby", "stadium", "championship", "cup", "club", "football", "union", "province", "provinces", "ireland",
  "leinster", "munster", "ulster", "connacht", "nations", "united", "champions", "challenge", "european", "aviva",
  "kingspan", "affidea", "sportsground", "thomond", "dexcom", "rds", "urc", "world", "series", "league", "team", "academy",
  "blacks", "springboks", "zealand", "africa", "wallabies", "england", "scotland", "wales", "france", "italy", "australia",
]);
const GENERIC_WORDS = new Set([
  "rugby", "match", "game", "team", "teams", "player", "players", "season", "squad", "coach", "coaching", "article",
  "news", "preview", "depth", "fresh", "live", "makes", "gives", "could", "change", "return", "academy", "front", "row",
]);

function operationalDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Dublin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

async function query(groq, params = {}) {
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set("query", groq);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(`$${key}`, JSON.stringify(value));
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`Sanity query failed (${response.status}): ${await response.text()}`);
  return (await response.json()).result;
}

async function mutate(mutations) {
  const response = await fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}?returnIds=true`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations }),
  });
  if (!response.ok) throw new Error(`Sanity mutation failed (${response.status}): ${await response.text()}`);
  return response.json();
}

function blockText(block) {
  return (block?.children ?? []).map((child) => child?.text ?? "").join("").trim();
}

function articleText(article) {
  return [article.title, article.standfirst, ...(article.body ?? []).filter((block) => block?._type === "block").map(blockText)]
    .filter(Boolean).join(" ");
}

function subjectPhrases(text) {
  const matches = text.match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+(?:\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+){1,3}\b/g) ?? [];
  return [...new Set(matches.map((value) => value.trim()))]
    .filter((value) => value.length >= 6)
    .filter((value) => !NON_PERSON_TERMS.has(value));
}

function descriptiveImageText(image) {
  return [image.title, image.altText, image.caption, image.subject, image.team, image.event].filter(Boolean).join(" ");
}

function namedPersonPhrasesFromImage(image) {
  const matches = descriptiveImageText(image).match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+(?:\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+){1,3}\b/g) ?? [];
  return [...new Set(matches.map((match) => match.trim()).filter((match) => {
    if (NON_PERSON_TERMS.has(match)) return false;
    const terms = match.toLowerCase().split(/[^a-zà-öø-ÿ'’.-]+/).filter(Boolean);
    if (terms.length < 2) return false;
    return !terms.some((term) => NON_PERSON_WORDS.has(term));
  }))];
}

function portableImage(image) {
  const key = crypto.randomUUID().replaceAll("-", "").slice(0, 12);
  return {
    _type: "image",
    _key: key,
    asset: { _type: "reference", _ref: image.assetRef },
    alt: image.altText ?? image.title ?? "Rugby editorial image",
    caption: image.caption,
    photographer: image.publicCredit ?? image.creditLine ?? image.photographer,
    source: image.source ?? image.sourceName,
    rights: [image.copyrightLine ?? image.copyright, image.rightsNotes].filter(Boolean).join(" — ") || undefined,
  };
}

function generatedArticleShape(article) {
  return {
    title: article.title ?? "",
    standfirst: article.standfirst ?? "",
    seoTitle: article.seoTitle ?? "",
    seoDescription: article.seoDescription ?? "",
    keyPoints: article.keyPoints ?? [],
    body: [{
      heading: null,
      paragraphs: (article.body ?? []).filter((block) => block?._type === "block" && block.style !== "h2").map(blockText).filter(Boolean),
    }],
    disclosure: "",
    sourceNotes: article.sourceNotes ?? [],
  };
}

function meaningfulTerms(text) {
  return [...new Set(text.toLowerCase().split(/[^a-z0-9à-öø-ÿ]+/).filter((term) => term.length >= 5 && !GENERIC_WORDS.has(term)))];
}

function storyRequiresWomenEvidence(text) {
  return /\bwomen(?:'s)?\b|\bwomens\b|\bfemale\b/i.test(text);
}

function candidateScore(image, paragraph, fullArticleText, subjects) {
  if (!image.assetRef) return Number.NEGATIVE_INFINITY;
  const imageText = descriptiveImageText(image).toLowerCase();
  const paragraphLower = paragraph.toLowerCase();
  const articleLower = fullArticleText.toLowerCase();

  const namedPeople = namedPersonPhrasesFromImage(image);
  if (namedPeople.some((person) => !articleLower.includes(person.toLowerCase()))) return Number.NEGATIVE_INFINITY;

  const articleTeams = TEAM_TERMS.filter((team) => articleLower.includes(team.toLowerCase()));
  const imageTeams = TEAM_TERMS.filter((team) => imageText.includes(team.toLowerCase()));
  if (articleTeams.length > 0 && imageTeams.length > 0 && !articleTeams.some((team) => imageTeams.includes(team))) return Number.NEGATIVE_INFINITY;

  if (storyRequiresWomenEvidence(fullArticleText) && imageText.includes("ireland") && !/\bwomen(?:'s)?\b|\bwomens\b|\bfemale\b/.test(imageText)) {
    return Number.NEGATIVE_INFINITY;
  }

  const exactSubjects = subjects.filter((subject) => paragraphLower.includes(subject.toLowerCase()) && imageText.includes(subject.toLowerCase()));
  const paragraphTeam = TEAM_TERMS.find((team) => paragraphLower.includes(team.toLowerCase()) && imageText.includes(team.toLowerCase()));
  const sharedTerms = meaningfulTerms(paragraph).filter((term) => imageText.includes(term));

  if (exactSubjects.length === 0 && !paragraphTeam && sharedTerms.length < 2) return Number.NEGATIVE_INFINITY;
  return (exactSubjects.length * 50) + (paragraphTeam ? 24 : 0) + Math.min(sharedTerms.length, 5) * 4;
}

function enrichBodyWithInlineImages(article, allowedImages, heroAssetRef) {
  const textBlocks = (article.body ?? []).filter((block) => block?._type !== "image");
  const fullText = articleText({ ...article, body: textBlocks });
  const subjects = subjectPhrases(fullText);
  const selected = [];
  const used = new Set([heroAssetRef].filter(Boolean));

  for (const block of textBlocks) {
    if (block?._type !== "block" || block.style === "h2") continue;
    const paragraph = blockText(block);
    if (!paragraph) continue;
    const ranked = allowedImages
      .filter((candidate) => candidate.assetRef && !used.has(candidate.assetRef))
      .map((candidate) => ({ image: candidate, score: candidateScore(candidate, paragraph, fullText, subjects) }))
      .filter(({ score }) => Number.isFinite(score) && score >= 20)
      .sort((a, b) => b.score - a.score);
    const best = ranked[0];
    if (!best) continue;
    selected.push({ image: best.image, paragraphKey: block._key, score: best.score });
    used.add(best.image.assetRef);
    if (selected.length >= MAX_INLINE_IMAGES) break;
  }

  const output = [];
  for (const block of textBlocks) {
    output.push(block);
    const match = selected.find((item) => item.paragraphKey === block?._key);
    if (match) output.push(portableImage(match.image));
  }
  return { body: output, added: selected };
}

const plan = JSON.parse(readFileSync(planPath, "utf8"));
const packageDate = operationalDate();
const packagePrefix = `current-${packageDate}-`;
if (plan.packageDate !== packageDate || !Array.isArray(plan.plans) || plan.plans.length !== 5) {
  throw new Error(`Image plan is not the exact current Dublin package (${packageDate}). Fail closed.`);
}
const planIds = plan.plans.map((item) => item.editorialInputId);
if (new Set(planIds).size !== 5 || planIds.some((id) => !String(id).startsWith(packagePrefix))) {
  throw new Error("Image plan does not contain five distinct current-package editorialInputIds. Fail closed.");
}

const articles = await query(`*[_type == "article" && _id in path("drafts.**") && morningPackageEligible == true && automationContentClass == "production" && editorialInputId in $ids] | order(editorialInputId asc){
  _id,title,standfirst,seoTitle,seoDescription,keyPoints,body,sourceNotes,factLedger,editorialStoryType,editorialInputId,
  "categoryLabel": coalesce(province->title, category->title),
  "featuredAsset": featuredImage.asset._ref
}`, { ids: planIds });
if (articles.length !== 5) throw new Error(`Expected exactly five current-package morning drafts, found ${articles.length}. Fail closed.`);

const candidateAssetRefs = [...new Set(plan.plans.flatMap((item) => item.candidates ?? []).map((item) => item.assetRef).filter(Boolean))];
const images = candidateAssetRefs.length ? await query(`*[_type == "editorialImage" && !(_id in path("drafts.**")) && usageApproved == true && lifecycleStatus in ["approved", "published"] && image.asset._ref in $assetRefs]{
  _id,title,altText,caption,subject,team,event,publicCredit,creditLine,photographer,copyrightLine,copyright,source,sourceName,rightsNotes,
  "assetRef": image.asset._ref,
  "assetUrl": image.asset->url
}`, { assetRefs: candidateAssetRefs }) : [];
const imageByAsset = new Map(images.map((image) => [image.assetRef, image]));
const globallyUsedAssets = new Set();
const summary = [];

for (const article of articles) {
  const articlePlan = plan.plans.find((item) => item.editorialInputId === article.editorialInputId);
  if (!articlePlan) throw new Error(`No image plan for ${article.editorialInputId}.`);
  const allowedImages = (articlePlan.candidates ?? []).map((item) => imageByAsset.get(item.assetRef)).filter(Boolean);
  const hero = allowedImages.find((image) => image.assetRef && !globallyUsedAssets.has(image.assetRef));
  if (!hero) throw new Error(`No verified relevant hero candidate for ${article.editorialInputId}. Fail closed before Zoho.`);
  globallyUsedAssets.add(hero.assetRef);

  const inline = enrichBodyWithInlineImages(article, allowedImages.filter((image) => !globallyUsedAssets.has(image.assetRef)), hero.assetRef);
  if (inline.added.length < 1) throw new Error(`No meaningful inline image for ${article.editorialInputId}. Fail closed before Zoho.`);
  for (const item of inline.added) globallyUsedAssets.add(item.image.assetRef);

  const generated = generatedArticleShape({ ...article, body: inline.body });
  let card = buildContextualDataCard(generated, {
    category: article.categoryLabel ?? "Rugby",
    storyType: article.editorialStoryType ?? "news",
    factLedger: article.factLedger,
  });
  if (card?.kind === "player") {
    const subjectLower = card.title.toLowerCase();
    const portrait = allowedImages.find((candidate) =>
      candidate.assetUrl
      && candidate.assetRef
      && !globallyUsedAssets.has(candidate.assetRef)
      && descriptiveImageText(candidate).toLowerCase().includes(subjectLower)
      && !namedPersonPhrasesFromImage(candidate).some((person) => person.toLowerCase() !== subjectLower && !articleText(article).toLowerCase().includes(person.toLowerCase())),
    );
    if (portrait) {
      card = { ...card, imageUrl: portrait.assetUrl, imageAlt: portrait.altText ?? portrait.title ?? card.title };
      globallyUsedAssets.add(portrait.assetRef);
    }
  }

  const heroValue = portableImage(hero);
  delete heroValue._key;
  const set = { featuredImage: heroValue, body: inline.body };
  if (card) set.contextualDataCard = card;
  await mutate([{ patch: { id: article._id, set } }]);

  const verified = await query(`*[_id == $id][0]{
    _id,title,editorialInputId,"featuredAsset":featuredImage.asset._ref,contextualDataCard,"inlineAssets":body[_type == "image"].asset._ref
  }`, { id: article._id });
  if (verified?.editorialInputId !== article.editorialInputId || verified?.featuredAsset !== hero.assetRef) {
    throw new Error(`Hero image verification failed for ${article.editorialInputId}.`);
  }
  if ((verified?.inlineAssets?.length ?? 0) < 1 || (verified?.inlineAssets?.length ?? 0) > MAX_INLINE_IMAGES) {
    throw new Error(`Inline image-depth verification failed for ${article.editorialInputId}: ${verified?.inlineAssets?.length ?? 0}.`);
  }
  if (card && (!verified?.contextualDataCard || (verified.contextualDataCard.rows?.length ?? 0) < 2)) {
    throw new Error(`Contextual card verification failed for ${article.editorialInputId}.`);
  }

  summary.push({
    articleId: article._id,
    editorialInputId: article.editorialInputId,
    title: article.title,
    hero: { imageId: hero._id, assetRef: hero.assetRef, title: hero.title ?? null },
    inlineImages: inline.added.map(({ image, score }) => ({ imageId: image._id, assetRef: image.assetRef, title: image.title ?? null, score })),
    contextualCard: card ? { title: card.title, kind: card.kind, rows: card.rows.length, portrait: Boolean(card.imageUrl) } : null,
  });
}

const result = { status: "current-package-enriched-and-verified", packageDate, articleCount: summary.length, summary };
writeFileSync("visual-enrichment-summary.json", `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
