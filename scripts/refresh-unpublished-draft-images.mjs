import { writeFileSync } from "node:fs";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const apply = process.env.APPLY_CHANGES === "true";
const maxDrafts = Math.max(1, Number(process.env.MAX_DRAFTS ?? 30));
const minImprovement = Math.max(0, Number(process.env.MIN_SCORE_IMPROVEMENT ?? 15));

if (!projectId || !token) throw new Error("Sanity configuration is required.");

const TEAM_GROUPS = [
  ["leinster", ["leinster"]], ["munster", ["munster"]], ["ulster", ["ulster"]], ["connacht", ["connacht"]],
  ["ireland", ["ireland", "irish rugby"]], ["new-zealand", ["new zealand", "all blacks"]],
  ["south-africa", ["south africa", "springboks", "boks"]], ["england", ["england", "red roses"]],
  ["scotland", ["scotland"]], ["wales", ["wales"]], ["france", ["france", "les bleus"]],
  ["italy", ["italy"]], ["australia", ["australia", "wallabies"]], ["argentina", ["argentina", "pumas"]],
  ["fiji", ["fiji"]], ["japan", ["japan"]], ["samoa", ["samoa"]], ["tonga", ["tonga"]],
];
const GENERIC = new Set(["rugby","match","matches","game","games","team","teams","player","players","coach","coaches","season","story","article","news","today","latest","could","would","their","about","after","before","against","between","under","over","from","with","into","this","that"]);
const NON_PERSON = new Set(["Rugby Panda","United Rugby Championship","Champions Cup","Challenge Cup","Six Nations","World Cup","All Blacks","South Africa","New Zealand","Irish Rugby"]);
const BAD_VISUAL = /\b(depression|mental health|house|residential|street scene|building|property|real estate|kitchen|bedroom)\b/i;

async function query(groq, params = {}) {
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set("query", groq);
  for (const [k,v] of Object.entries(params)) url.searchParams.set(`$${k}`, JSON.stringify(v));
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!r.ok) throw new Error(`Sanity query failed ${r.status}: ${await r.text()}`);
  return (await r.json()).result;
}
async function mutate(mutations) {
  const r = await fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}?returnIds=true`, {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify({ mutations }),
  });
  if (!r.ok) throw new Error(`Sanity mutation failed ${r.status}: ${await r.text()}`);
  return r.json();
}
function blockText(b) { return (b?.children ?? []).map(c => c?.text ?? "").join("").trim(); }
function articleText(a) { return [a.title,a.standfirst,...(a.body ?? []).filter(b=>b?._type==="block").map(blockText)].filter(Boolean).join(" "); }
function imageText(i) { return [i.title,i.altText,i.caption,i.subject,i.team,i.competitionEvent,...(i.people ?? [])].filter(Boolean).join(" "); }
function teamsIn(v) {
  const s = String(v ?? "").toLowerCase();
  return TEAM_GROUPS.filter(([,terms]) => terms.some(t => s.includes(t))).map(([id]) => id);
}
function namesIn(v) {
  const out = String(v ?? "").match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+(?:\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+){1,3}\b/g) ?? [];
  return [...new Set(out.map(x=>x.trim()).filter(x=>!NON_PERSON.has(x)))];
}
function meaningful(v) {
  return [...new Set(String(v ?? "").toLowerCase().split(/[^a-z0-9à-öø-ÿ]+/).filter(x=>x.length>=5 && !GENERIC.has(x)))];
}
function hardPass(article, image) {
  const aText = articleText(article).toLowerCase();
  const iText = imageText(image);
  if (!image.assetRef || BAD_VISUAL.test(iText)) return false;
  const aTeams = teamsIn(aText), iTeams = teamsIn(iText);
  if (iTeams.some(t => !aTeams.includes(t))) return false;
  const imagePeople = (image.people?.length ? image.people : namesIn(iText)).map(String);
  if (imagePeople.some(p => !aText.includes(p.toLowerCase()))) return false;
  const womenStory = /\bwomen(?:'s)?\b|\bfemale\b|\bgirls\b/i.test(aText);
  const womenImage = /\bwomen(?:'s)?\b|\bfemale\b|\bgirls\b/i.test(iText);
  if (womenStory !== womenImage && (womenStory || womenImage)) return false;
  return true;
}
function score(article, image) {
  if (!hardPass(article, image)) return -Infinity;
  const aText = articleText(article).toLowerCase();
  const iText = imageText(image).toLowerCase();
  const people = (image.people?.length ? image.people : namesIn(imageText(image))).map(String);
  const exactPeople = people.filter(p=>aText.includes(p.toLowerCase())).length;
  const aTeams = teamsIn(aText), iTeams = teamsIn(iText);
  const teamHits = iTeams.filter(t=>aTeams.includes(t)).length;
  const shared = meaningful(aText).filter(t=>iText.includes(t)).length;
  if (!exactPeople && !teamHits && shared < 2) return -Infinity;
  return exactPeople * 100 + teamHits * 35 + Math.min(shared, 8) * 4;
}
function imageBlock(image) {
  return {
    _type: "image", _key: crypto.randomUUID().replaceAll("-", "").slice(0,12), asset: { _type: "reference", _ref: image.assetRef },
    alt: image.altText ?? image.title ?? "Rugby editorial image", caption: image.caption,
    photographer: image.publicCredit ?? image.creditLine ?? image.photographer,
    source: image.source ?? image.sourceName,
    rights: [image.copyrightLine ?? image.copyright, image.rightsNotes].filter(Boolean).join(" — ") || undefined,
  };
}

const drafts = await query(`*[_type=="article" && _id in path("drafts.**") && coalesce(automationContentClass,"production") == "production" && coalesce(workflowStatus,"draft") != "published" && !defined(publishedAt)] | order(_updatedAt desc)[0...$limit]{_id,title,standfirst,body,workflowStatus,morningPackageEligible,_updatedAt,"featuredAsset":featuredImage.asset._ref}`, { limit: maxDrafts });
const images = await query(`*[_type=="editorialImage" && !(_id in path("drafts.**")) && usageApproved==true && lifecycleStatus in ["approved","published"] && defined(image.asset._ref)]{_id,title,altText,caption,subject,team,people,competitionEvent,publicCredit,creditLine,photographer,copyrightLine,copyright,source,sourceName,rightsNotes,"assetRef":image.asset._ref}`);
const byAsset = new Map(images.map(i=>[i.assetRef,i]));
const summary = { apply, scannedDrafts: drafts.length, libraryImages: images.length, updated: 0, unchanged: 0, noSafeMatch: 0, drafts: [] };

for (const article of drafts) {
  const ranked = images.map(image=>({ image, score: score(article,image) })).filter(x=>Number.isFinite(x.score)).sort((a,b)=>b.score-a.score);
  const best = ranked[0];
  const current = article.featuredAsset ? byAsset.get(article.featuredAsset) : null;
  const currentScore = current ? score(article,current) : -Infinity;
  const shouldReplace = !!best && (!Number.isFinite(currentScore) || best.score >= currentScore + minImprovement);
  const record = { id: article._id, title: article.title, currentAsset: article.featuredAsset ?? null, currentScore: Number.isFinite(currentScore)?currentScore:null, bestAsset: best?.image.assetRef ?? null, bestScore: best?.score ?? null, action: "unchanged" };
  if (!best) { record.action = "no-safe-match"; summary.noSafeMatch++; summary.drafts.push(record); continue; }
  if (!shouldReplace) { summary.unchanged++; summary.drafts.push(record); continue; }

  const textBlocks = (article.body ?? []).filter(b=>b?._type !== "image");
  const inlineCandidates = ranked.filter(x=>x.image.assetRef !== best.image.assetRef).slice(0,2).map(x=>x.image);
  const body = [...textBlocks];
  if (inlineCandidates[0] && body.length > 3) body.splice(Math.min(3, body.length), 0, imageBlock(inlineCandidates[0]));
  if (inlineCandidates[1] && body.length > 7) body.splice(Math.min(7, body.length), 0, imageBlock(inlineCandidates[1]));

  record.action = apply ? "updated" : "would-update";
  record.inlineAssets = inlineCandidates.map(i=>i.assetRef);
  if (apply) {
    await mutate([{ patch: { id: article._id, set: { featuredImage: imageBlock(best.image), body, "imageRefresh.lastRunAt": new Date().toISOString(), "imageRefresh.strategy": "full-library-deterministic" } } }]);
    summary.updated++;
  }
  summary.drafts.push(record);
}

writeFileSync("draft-image-refresh-summary.json", JSON.stringify(summary,null,2));
console.log(JSON.stringify({ scannedDrafts: summary.scannedDrafts, libraryImages: summary.libraryImages, updated: summary.updated, unchanged: summary.unchanged, noSafeMatch: summary.noSafeMatch, apply }));
