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
const TEAM_GROUPS = [
  { id: "leinster", terms: ["leinster"] }, { id: "munster", terms: ["munster"] }, { id: "ulster", terms: ["ulster"] }, { id: "connacht", terms: ["connacht"] },
  { id: "ireland", terms: ["ireland", "irish rugby"] }, { id: "new-zealand", terms: ["new zealand", "all blacks"] },
  { id: "south-africa", terms: ["south africa", "springboks", "boks"] }, { id: "england", terms: ["england", "red roses"] },
  { id: "scotland", terms: ["scotland"] }, { id: "wales", terms: ["wales"] }, { id: "france", terms: ["france", "les bleus"] },
  { id: "italy", terms: ["italy"] }, { id: "australia", terms: ["australia", "wallabies"] }, { id: "argentina", terms: ["argentina", "pumas"] },
  { id: "fiji", terms: ["fiji"] }, { id: "japan", terms: ["japan"] }, { id: "samoa", terms: ["samoa"] }, { id: "tonga", terms: ["tonga"] },
];
const TEAM_TERMS = TEAM_GROUPS.flatMap((group) => group.terms.map((term) => term.replace(/\b\w/g, (c) => c.toUpperCase())));
const CONTEXT_GROUPS = [
  { team: "Leinster", terms: ["leinster", "rds", "donnybrook"] }, { team: "Munster", terms: ["munster", "thomond park", "limerick"] },
  { team: "Ulster", terms: ["ulster", "kingspan stadium", "belfast"] }, { team: "Connacht", terms: ["connacht", "dexcom stadium", "sportsground", "galway"] },
];
const NON_RUGBY_VISUAL = /\b(derelict building|left me all alone|house|residential|street scene)\b/i;
const NON_PERSON_TERMS = new Set([...TEAM_TERMS, "Rugby", "URC", "United Rugby", "Champions Cup", "Challenge Cup", "Six Nations", "World Cup", "Global Series", "Academy", "Thomond Park", "Aviva Stadium", "Dexcom Stadium", "Kingspan Stadium", "Affidea Stadium"]);
const NON_PERSON_WORDS = new Set(["rugby","stadium","championship","cup","club","football","union","province","provinces","ireland","leinster","munster","ulster","connacht","nations","united","champions","challenge","european","aviva","kingspan","affidea","sportsground","thomond","dexcom","rds","urc","world","series","league","team","academy","blacks","springboks","boks","zealand","africa","wallabies","england","scotland","wales","france","italy","australia","autumn"]);
const GENERIC_WORDS = new Set(["rugby","match","game","team","teams","player","players","season","squad","coach","coaching","article","news","preview","depth","fresh","live","makes","gives","could","change","return","academy","front","row"]);

function operationalDate() { return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Dublin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); }
async function query(groq, params = {}) {
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`); url.searchParams.set("query", groq);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(`$${key}`, JSON.stringify(value));
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`Sanity query failed (${response.status}): ${await response.text()}`); return (await response.json()).result;
}
async function mutate(mutations) {
  const response = await fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}?returnIds=true`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ mutations }) });
  if (!response.ok) throw new Error(`Sanity mutation failed (${response.status}): ${await response.text()}`); return response.json();
}
function blockText(block) { return (block?.children ?? []).map((child) => child?.text ?? "").join("").trim(); }
function articleText(article) { return [article.title, article.standfirst, ...(article.body ?? []).filter((block) => block?._type === "block").map(blockText)].filter(Boolean).join(" "); }
function groupsIn(value) { const lower = String(value ?? "").toLowerCase(); return TEAM_GROUPS.filter((group) => group.terms.some((term) => lower.includes(term))).map((group) => group.id); }
function subjectPhrases(text) {
  const matches = text.match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+(?:\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+){1,3}\b/g) ?? [];
  return [...new Set(matches.map((value) => value.trim()))].filter((value) => value.length >= 6).filter((value) => !NON_PERSON_TERMS.has(value));
}
function descriptiveImageText(image) { return [image.title,image.altText,image.caption,image.subject,image.team,image.competitionEvent].filter(Boolean).join(" "); }
function storyRequiresWomenEvidence(text) { return /\bwomen(?:'s)?\b|\bwomens\b|\bfemale\b|\bgirls\b/i.test(text); }
function imageHasWomenEvidence(text) { return /\bwomen(?:'s)?\b|\bwomens\b|\bfemale\b|\bgirls\b/i.test(text); }
function contextConflict(primaryTitleLower, articleLower, imageLower) {
  const primaryGroups = CONTEXT_GROUPS.filter((group) => group.terms.some((term) => primaryTitleLower.includes(term)));
  const articleGroups = CONTEXT_GROUPS.filter((group) => group.terms.some((term) => articleLower.includes(term)));
  const imageGroups = CONTEXT_GROUPS.filter((group) => group.terms.some((term) => imageLower.includes(term)));
  if (!imageGroups.length) return false;
  if (primaryGroups.length) return imageGroups.some((imageGroup) => !primaryGroups.some((primaryGroup) => imageGroup.team === primaryGroup.team));
  if (!articleGroups.length) return true;
  return !articleGroups.some((articleGroup) => imageGroups.some((imageGroup) => imageGroup.team === articleGroup.team));
}
function namedPersonPhrasesFromImage(image) {
  if (Array.isArray(image.people) && image.people.length) return [...new Set(image.people.filter(Boolean).map(String))];
  const matches = descriptiveImageText(image).match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+(?:\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+){1,3}\b/g) ?? [];
  return [...new Set(matches.map((match) => match.trim()).filter((match) => {
    if (NON_PERSON_TERMS.has(match)) return false;
    const terms = match.toLowerCase().split(/[^a-zà-öø-ÿ'’.-]+/).filter(Boolean);
    return terms.length >= 2 && !terms.some((term) => NON_PERSON_WORDS.has(term));
  }))];
}
function imagePassesHardContext(articleTitleValue, articleTextValue, image) {
  const articleLower = articleTextValue.toLowerCase(); const titleLower = String(articleTitleValue ?? "").toLowerCase(); const imageLower = descriptiveImageText(image).toLowerCase();
  if (NON_RUGBY_VISUAL.test(imageLower) || contextConflict(titleLower, articleLower, imageLower)) return false;
  const titleTeams = groupsIn(articleTitleValue); const articleTeams = groupsIn(articleTextValue); const imageTeams = groupsIn(descriptiveImageText(image));
  if (imageTeams.length && !articleTeams.length) return false;
  if (titleTeams.length && imageTeams.some((team) => !titleTeams.includes(team))) return false;
  if (!titleTeams.length && imageTeams.some((team) => !articleTeams.includes(team))) return false;
  if (namedPersonPhrasesFromImage(image).some((person) => !articleLower.includes(person.toLowerCase()))) return false;
  if (storyRequiresWomenEvidence(articleTextValue) && !imageHasWomenEvidence(imageLower)) return false;
  if (!storyRequiresWomenEvidence(articleTextValue) && imageHasWomenEvidence(imageLower)) return false;
  return true;
}
function portableImage(image) {
  const key = crypto.randomUUID().replaceAll("-", "").slice(0, 12);
  return { _type: "image", _key: key, asset: { _type: "reference", _ref: image.assetRef }, alt: image.altText ?? image.title ?? "Rugby editorial image", caption: image.caption, photographer: image.publicCredit ?? image.creditLine ?? image.photographer, source: image.source ?? image.sourceName, rights: [image.copyrightLine ?? image.copyright, image.rightsNotes].filter(Boolean).join(" — ") || undefined };
}
function generatedArticleShape(article) { return { title: article.title ?? "", standfirst: article.standfirst ?? "", seoTitle: article.seoTitle ?? "", seoDescription: article.seoDescription ?? "", keyPoints: article.keyPoints ?? [], body: [{ heading: null, paragraphs: (article.body ?? []).filter((block) => block?._type === "block" && block.style !== "h2").map(blockText).filter(Boolean) }], disclosure: "", sourceNotes: article.sourceNotes ?? [] }; }
function meaningfulTerms(text) { return [...new Set(text.toLowerCase().split(/[^a-z0-9à-öø-ÿ]+/).filter((term) => term.length >= 5 && !GENERIC_WORDS.has(term)))]; }
function candidateScore(image, paragraph, articleTitle, fullArticleText, subjects) {
  if (!image.assetRef || !imagePassesHardContext(articleTitle, fullArticleText, image)) return Number.NEGATIVE_INFINITY;
  const imageText = descriptiveImageText(image).toLowerCase(); const paragraphLower = paragraph.toLowerCase();
  const exactSubjects = subjects.filter((subject) => paragraphLower.includes(subject.toLowerCase()) && imageText.includes(subject.toLowerCase()));
  const paragraphTeams = groupsIn(paragraph); const imageTeams = groupsIn(imageText); const paragraphTeam = paragraphTeams.some((team) => imageTeams.includes(team));
  const sharedTerms = meaningfulTerms(paragraph).filter((term) => imageText.includes(term));
  const namedPeople = namedPersonPhrasesFromImage(image); const exactPeople = namedPeople.filter((person) => paragraphLower.includes(person.toLowerCase()));
  if (exactSubjects.length === 0 && exactPeople.length === 0 && !paragraphTeam && sharedTerms.length < 2) return Number.NEGATIVE_INFINITY;
  return (exactPeople.length * 80) + (exactSubjects.length * 50) + (paragraphTeam ? 24 : 0) + Math.min(sharedTerms.length, 5) * 4;
}
function enrichBodyWithInlineImages(article, allowedImages, heroAssetRef) {
  const textBlocks = (article.body ?? []).filter((block) => block?._type !== "image"); const fullText = articleText({ ...article, body: textBlocks }); const subjects = subjectPhrases(fullText); const selected = []; const used = new Set([heroAssetRef].filter(Boolean));
  for (const block of textBlocks) {
    if (block?._type !== "block" || block.style === "h2") continue; const paragraph = blockText(block); if (!paragraph) continue;
    const ranked = allowedImages.filter((candidate) => candidate.assetRef && !used.has(candidate.assetRef)).map((candidate) => ({ image: candidate, score: candidateScore(candidate, paragraph, article.title, fullText, subjects) })).filter(({ score }) => Number.isFinite(score) && score >= 20).sort((a, b) => b.score - a.score);
    const best = ranked[0]; if (!best) continue; selected.push({ image: best.image, paragraphKey: block._key, score: best.score }); used.add(best.image.assetRef); if (selected.length >= MAX_INLINE_IMAGES) break;
  }
  const output = []; for (const block of textBlocks) { output.push(block); const match = selected.find((item) => item.paragraphKey === block?._key); if (match) output.push(portableImage(match.image)); }
  return { body: output, added: selected };
}

const plan = JSON.parse(readFileSync(planPath, "utf8")); const packageDate = operationalDate(); const packagePrefix = `current-${packageDate}-`;
if (plan.packageDate !== packageDate || !Array.isArray(plan.plans) || plan.plans.length !== 5) throw new Error(`Image plan is not the exact current Dublin package (${packageDate}). Fail closed.`);
const planIds = plan.plans.map((item) => item.editorialInputId);
if (new Set(planIds).size !== 5 || planIds.some((id) => !String(id).startsWith(packagePrefix))) throw new Error("Image plan does not contain five distinct current-package editorialInputIds. Fail closed.");
const articles = await query(`*[_type == "article" && _id in path("drafts.**") && morningPackageEligible == true && automationContentClass == "production" && editorialInputId in $ids] | order(editorialInputId asc){_id,title,standfirst,seoTitle,seoDescription,keyPoints,body,sourceNotes,factLedger,editorialStoryType,editorialInputId,"categoryLabel":coalesce(province->title,category->title),"featuredAsset":featuredImage.asset._ref}`, { ids: planIds });
if (articles.length !== 5) throw new Error(`Expected exactly five current-package morning drafts, found ${articles.length}. Fail closed.`);
const candidateAssetRefs = [...new Set(plan.plans.flatMap((item) => [
  ...(item.candidates ?? []).map((candidate) => candidate.assetRef),
  item.existingFeaturedAsset,
  ...(item.existingInlineAssets ?? []),
]).filter(Boolean))];
const images = candidateAssetRefs.length ? await query(`*[_type == "editorialImage" && !(_id in path("drafts.**")) && usageApproved == true && lifecycleStatus in ["approved","published"] && image.asset._ref in $assetRefs]{_id,title,altText,caption,subject,team,people,competitionEvent,publicCredit,creditLine,photographer,copyrightLine,copyright,source,sourceName,rightsNotes,"assetRef":image.asset._ref,"assetUrl":image.asset->url}`, { assetRefs: candidateAssetRefs }) : [];
const imageByAsset = new Map(images.map((image) => [image.assetRef, image])); const globallyUsedAssets = new Set(); const summary = [];
for (const article of articles) {
  const articlePlan = plan.plans.find((item) => item.editorialInputId === article.editorialInputId); if (!articlePlan) throw new Error(`No image plan for ${article.editorialInputId}.`);
  const fullArticleText = articleText(article);
  const articleAssetRefs = [...new Set([
    ...(articlePlan.candidates ?? []).map((item) => item.assetRef),
    articlePlan.existingFeaturedAsset,
    ...(articlePlan.existingInlineAssets ?? []),
  ].filter(Boolean))];
  const allowedImages = articleAssetRefs.map((assetRef) => imageByAsset.get(assetRef)).filter(Boolean).filter((image) => imagePassesHardContext(article.title, fullArticleText, image));
  const heroSubjects = subjectPhrases(fullArticleText); const heroTarget = `${article.title ?? ""} ${article.standfirst ?? ""}`;
  const rankedHeroes = allowedImages.filter((image) => image.assetRef && !globallyUsedAssets.has(image.assetRef)).map((image) => ({ image, score: candidateScore(image, heroTarget, article.title, fullArticleText, heroSubjects) })).filter(({ score }) => Number.isFinite(score)).sort((a,b) => b.score - a.score);
  const existingHero = imageByAsset.get(articlePlan.existingFeaturedAsset);
  const existingHeroScore = existingHero && !globallyUsedAssets.has(existingHero.assetRef) ? candidateScore(existingHero, heroTarget, article.title, fullArticleText, heroSubjects) : Number.NEGATIVE_INFINITY;
  const hero = Number.isFinite(existingHeroScore) ? existingHero : rankedHeroes[0]?.image;
  if (!hero) throw new Error(`No verified relevant hero candidate for ${article.editorialInputId}. Fail closed before Zoho.`); globallyUsedAssets.add(hero.assetRef);
  const inline = enrichBodyWithInlineImages(article, allowedImages.filter((image) => !globallyUsedAssets.has(image.assetRef)), hero.assetRef);
  if (inline.added.length < 1) throw new Error(`No meaningful inline image for ${article.editorialInputId}. Fail closed before Zoho.`); for (const item of inline.added) globallyUsedAssets.add(item.image.assetRef);
  const generated = generatedArticleShape({ ...article, body: inline.body }); let card = buildContextualDataCard(generated, { category: article.categoryLabel ?? "Rugby", storyType: article.editorialStoryType ?? "news", factLedger: article.factLedger });
  if (card?.kind === "player") {
    const subjectLower = card.title.toLowerCase(); const portrait = allowedImages.find((candidate) => candidate.assetUrl && candidate.assetRef && !globallyUsedAssets.has(candidate.assetRef) && descriptiveImageText(candidate).toLowerCase().includes(subjectLower) && !namedPersonPhrasesFromImage(candidate).some((person) => person.toLowerCase() !== subjectLower && !fullArticleText.toLowerCase().includes(person.toLowerCase())));
    if (portrait) { card = { ...card, imageUrl: portrait.assetUrl, imageAlt: portrait.altText ?? portrait.title ?? card.title }; globallyUsedAssets.add(portrait.assetRef); }
  }
  const heroValue = portableImage(hero); delete heroValue._key; const set = { featuredImage: heroValue, body: inline.body }; if (card) set.contextualDataCard = card; await mutate([{ patch: { id: article._id, set } }]);
  const verified = await query(`*[_id == $id][0]{_id,title,editorialInputId,"featuredAsset":featuredImage.asset._ref,contextualDataCard,"inlineAssets":body[_type == "image"].asset._ref}`, { id: article._id });
  if (verified?.editorialInputId !== article.editorialInputId || verified?.featuredAsset !== hero.assetRef) throw new Error(`Hero image verification failed for ${article.editorialInputId}.`);
  if ((verified?.inlineAssets?.length ?? 0) < 1 || (verified?.inlineAssets?.length ?? 0) > MAX_INLINE_IMAGES) throw new Error(`Inline image-depth verification failed for ${article.editorialInputId}: ${verified?.inlineAssets?.length ?? 0}.`);
  if (card && (!verified?.contextualDataCard || (verified.contextualDataCard.rows?.length ?? 0) < 2)) throw new Error(`Contextual card verification failed for ${article.editorialInputId}.`);
  summary.push({ articleId: article._id, editorialInputId: article.editorialInputId, title: article.title, hero: { imageId: hero._id, assetRef: hero.assetRef, title: hero.title ?? null, team: hero.team ?? null, people: hero.people ?? [] }, inlineImages: inline.added.map(({ image, score }) => ({ imageId: image._id, assetRef: image.assetRef, title: image.title ?? null, team: image.team ?? null, people: image.people ?? [], score })), contextualCard: card ? { title: card.title, kind: card.kind, rows: card.rows.length, portrait: Boolean(card.imageUrl) } : null });
}
const result = { status: "current-package-enriched-and-verified", packageDate, articleCount: summary.length, summary };
writeFileSync("visual-enrichment-summary.json", `${JSON.stringify(result, null, 2)}\n`, "utf8"); console.log(JSON.stringify(result, null, 2));
