import { buildContextualDataCard } from "../lib/editorial/ContextualDataCardBuilder.ts";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is required.");
if (!token) throw new Error("SANITY_API_TOKEN is required.");

const CURRENT_INPUT_IDS = [
  "auto004-fresh-leinster-carbery-20260824",
  "auto004-fresh-ulster-henderson-depth-20260824",
  "auto004-fresh-connacht-frontrow-20260824",
  "auto004-fresh-munster-academy-20260824",
  "auto004-fresh-ireland-women-wxv-20260824",
];
const MAX_INLINE_IMAGES = 3;
const NON_PERSON_TERMS = new Set([
  "Ireland", "Leinster", "Munster", "Ulster", "Connacht", "Rugby", "URC", "United Rugby",
  "Champions Cup", "Challenge Cup", "Six Nations", "World Cup", "Global Series", "Academy",
]);

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
  const matches = text.match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+(?:\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+){1,2}\b/g) ?? [];
  return [...new Set(matches.map((value) => value.trim()))]
    .filter((value) => !NON_PERSON_TERMS.has(value))
    .filter((value) => value.split(/\s+/).every((part) => !NON_PERSON_TERMS.has(part)));
}

function descriptiveImageText(image) {
  return [image.title, image.altText, image.caption].filter(Boolean).join(" ").toLowerCase();
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

function enrichBodyWithInlineImages(article, images, globallyUsedAssets) {
  const body = [...(article.body ?? [])];
  const text = articleText(article);
  const subjects = subjectPhrases(text);
  const existingAssets = new Set(body.filter((block) => block?._type === "image").map((block) => block?.asset?._ref).filter(Boolean));
  const selected = [];
  const selectedSubjects = new Set();

  for (const subject of subjects) {
    const subjectLower = subject.toLowerCase();
    const paragraphIndex = body.findIndex((block) => block?._type === "block" && block.style !== "h2" && blockText(block).toLowerCase().includes(subjectLower));
    if (paragraphIndex < 0) continue;
    const image = images.find((candidate) =>
      candidate.assetRef
      && !globallyUsedAssets.has(candidate.assetRef)
      && !existingAssets.has(candidate.assetRef)
      && descriptiveImageText(candidate).includes(subjectLower),
    );
    if (!image || selectedSubjects.has(subjectLower)) continue;
    selected.push({ subject, image, paragraphKey: body[paragraphIndex]?._key });
    selectedSubjects.add(subjectLower);
    globallyUsedAssets.add(image.assetRef);
    if (selected.length >= MAX_INLINE_IMAGES) break;
  }

  if (selected.length === 0) return { body, added: [] };
  const output = [];
  for (const block of body) {
    output.push(block);
    const match = selected.find((item) => item.paragraphKey === block?._key);
    if (match) output.push(portableImage(match.image));
  }
  return { body: output, added: selected.map(({ subject, image }) => ({ subject, imageId: image._id, imageTitle: image.title ?? null })) };
}

const articles = await query(`*[_type == "article" && _id in path("drafts.**") && morningPackageEligible == true && editorialInputId in $ids] | order(editorialInputId asc){
  _id,title,standfirst,seoTitle,seoDescription,keyPoints,body,sourceNotes,factLedger,editorialStoryType,editorialInputId,
  "categoryLabel": coalesce(province->title, category->title),
  "featuredAsset": featuredImage.asset._ref
}`, { ids: CURRENT_INPUT_IDS });

if (articles.length !== 5) throw new Error(`Expected exactly five current morning drafts, found ${articles.length}. Fail closed.`);

const images = await query(`*[_type == "editorialImage" && !(_id in path("drafts.**")) && usageApproved == true && lifecycleStatus in ["approved", "published"] && defined(image.asset._ref)] | order(_updatedAt desc)[0...500]{
  _id,title,altText,caption,publicCredit,creditLine,photographer,copyrightLine,copyright,source,sourceName,rightsNotes,
  "assetRef": image.asset._ref,
  "assetUrl": image.asset->url
}`);

const globallyUsedAssets = new Set();
for (const article of articles) {
  if (article.featuredAsset) globallyUsedAssets.add(article.featuredAsset);
  for (const block of article.body ?? []) if (block?._type === "image" && block?.asset?._ref) globallyUsedAssets.add(block.asset._ref);
}

const summary = [];
for (const article of articles) {
  const generated = generatedArticleShape(article);
  let card = buildContextualDataCard(generated, {
    category: article.categoryLabel ?? "Rugby",
    storyType: article.editorialStoryType ?? "news",
    factLedger: article.factLedger,
  });

  if (card?.kind === "player") {
    const subjectLower = card.title.toLowerCase();
    const portrait = images.find((candidate) =>
      candidate.assetUrl
      && candidate.assetRef
      && !globallyUsedAssets.has(candidate.assetRef)
      && descriptiveImageText(candidate).includes(subjectLower),
    );
    if (portrait) {
      card = { ...card, imageUrl: portrait.assetUrl, imageAlt: portrait.altText ?? portrait.title ?? card.title };
      globallyUsedAssets.add(portrait.assetRef);
    }
  }

  const inline = enrichBodyWithInlineImages(article, images, globallyUsedAssets);
  const set = {};
  if (card) set.contextualDataCard = card;
  if (inline.added.length > 0) set.body = inline.body;

  if (Object.keys(set).length > 0) await mutate([{ patch: { id: article._id, set } }]);
  const verified = await query(`*[_id == $id][0]{
    _id,title,contextualDataCard,"inlineAssets":body[_type == "image"].asset._ref
  }`, { id: article._id });

  if (card && (!verified?.contextualDataCard || (verified.contextualDataCard.rows?.length ?? 0) < 2)) {
    throw new Error(`Contextual card verification failed for ${article._id}.`);
  }
  for (const added of inline.added) {
    if (!(verified?.inlineAssets ?? []).includes(images.find((image) => image._id === added.imageId)?.assetRef)) {
      throw new Error(`Inline image verification failed for ${article._id}: ${added.imageId}.`);
    }
  }

  summary.push({
    articleId: article._id,
    title: article.title,
    contextualCard: card ? { title: card.title, kind: card.kind, rows: card.rows.length, portrait: Boolean(card.imageUrl) } : null,
    inlineAdded: inline.added,
    totalInlineImages: verified?.inlineAssets?.length ?? 0,
  });
}

console.log(JSON.stringify({ status: "enriched-and-verified", articleCount: summary.length, summary }, null, 2));
