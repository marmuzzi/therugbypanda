import { createHash } from "node:crypto";
import { createClient } from "next-sanity";

const API = "https://api.pexels.com/v1/search";
const apiKey = process.env.PEXELS_API_KEY;
const sanityToken = process.env.SANITY_API_TOKEN;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "hvg4b508";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const importLimit = Math.max(1, Math.min(5000, Number.parseInt(process.env.PEXELS_IMPORT_LIMIT ?? "1500", 10)));
const perQuery = Math.max(10, Math.min(80, Number.parseInt(process.env.PEXELS_PER_QUERY ?? "80", 10)));
const concurrency = Math.max(1, Math.min(6, Number.parseInt(process.env.PEXELS_CONCURRENCY ?? "4", 10)));
if (!apiKey) throw new Error("Missing PEXELS_API_KEY.");
if (!sanityToken) throw new Error("Missing SANITY_API_TOKEN.");

const client = createClient({ projectId, dataset, apiVersion, token: sanityToken, useCdn: false });

// Pexels metadata is intentionally treated as generic/contextual only. We never assign
// these imports as exact named-player, named-coach, named-team, or exact-match imagery.
const queries = [
  ["rugby-action", "rugby union match"],
  ["rugby-player", "rugby player"],
  ["rugby-scrum", "rugby scrum"],
  ["rugby-lineout", "rugby lineout"],
  ["rugby-tackle", "rugby tackle"],
  ["rugby-training", "rugby training"],
  ["rugby-stadium", "rugby stadium"],
  ["rugby-crowd", "rugby fans stadium"],
  ["rugby-ball", "rugby ball field"],
  ["womens-rugby", "women rugby"],
];

const blocked = /\b(american football|nfl|soccer|football helmet|baseball|basketball|cricket|hockey)\b/i;
const rugbySignal = /\brugby\b/i;

function category(scope) { return scope === "womens-rugby" ? "womens-rugby" : "rugby-culture"; }
function photoType(scope) {
  if (scope.includes("stadium")) return "stadium";
  if (scope.includes("scrum")) return "scrum";
  if (scope.includes("lineout")) return "lineout";
  if (scope.includes("tackle")) return "tackle";
  if (scope.includes("training")) return "training";
  if (scope.includes("crowd")) return "crowd";
  return "action";
}

async function search(scope, query) {
  const url = new URL(API);
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(perQuery));
  url.searchParams.set("orientation", "landscape");
  const response = await fetch(url, { headers: { Authorization: apiKey } });
  if (!response.ok) throw new Error(`Pexels search failed ${response.status}: ${query}`);
  const payload = await response.json();
  return (payload.photos ?? []).map((p) => {
    const alt = String(p.alt ?? "");
    const evidence = `${query} ${alt}`;
    const relevant = rugbySignal.test(evidence) && !blocked.test(evidence);
    const imageUrl = p.src?.large2x ?? p.src?.large ?? p.src?.original;
    return {
      scope, query, id: String(p.id), alt, evidence, relevant,
      sourcePage: p.url, imageUrl, width: Number(p.width ?? 0), height: Number(p.height ?? 0),
      photographer: p.photographer, photographerUrl: p.photographer_url,
    };
  }).filter((x) => x.relevant && x.sourcePage && x.imageUrl && x.width >= 1200 && x.height >= 600);
}

const discovered = [];
for (const [scope, query] of queries) {
  try {
    const items = await search(scope, query);
    discovered.push(...items);
    console.log(`DISCOVER ${scope}: ${items.length}`);
  } catch (error) {
    console.warn(`DISCOVER_FAIL ${scope}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const deduped = [...new Map(discovered.map((x) => [`pexels:${x.id}`, x])).values()];
const existing = await client.fetch(`*[_type == "editorialImage" && !(_id in path("drafts.**")) && sourceProvider == "Pexels"]{sourceRecordId}`);
const existingIds = new Set(existing.map((x) => String(x.sourceRecordId ?? "")).filter(Boolean));
const queue = deduped.filter((x) => !existingIds.has(x.id)).slice(0, importLimit);
console.log(JSON.stringify({ provider:"Pexels", discovered: discovered.length, uniqueCandidates: deduped.length, existing: existingIds.size, queued: queue.length, importLimit }, null, 2));

let imported = 0, failed = 0, skipped = 0;
const coverage = {};
async function importOne(item) {
  if (existingIds.has(item.id)) { skipped += 1; return; }
  try {
    const response = await fetch(item.imageUrl);
    if (!response.ok) throw new Error(`download ${response.status}`);
    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    if (!/^image\/(jpeg|png|webp)/i.test(contentType)) throw new Error(`unsupported ${contentType}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 50_000) throw new Error(`small file ${buffer.length}`);
    const hash = createHash("sha1").update(`pexels:${item.id}`).digest("hex").slice(0, 20);
    const filename = `pexels-rugby-${item.id}.jpg`;
    const asset = await client.assets.upload("image", buffer, { filename, contentType });
    const caption = item.alt || `${item.scope.replace(/-/g, " ")} photograph`;
    const credit = item.photographer ? `Photo: ${item.photographer} / Pexels` : "Pexels";
    await client.createOrReplace({
      _id:`editorialImage-pexels-${hash}`, _type:"editorialImage", title:caption,
      image:{ _type:"image", asset:{_type:"reference",_ref:asset._id}, alt:caption, caption, photographer:item.photographer, source:"Pexels", rights:`Pexels licence · ${credit}` },
      altText:caption, caption, lifecycleStatus:"approved", usageApproved:true,
      editorialCategory:category(item.scope), photoType:photoType(item.scope), editorialValue:"generic", editorialRating:3,
      suggestedUse:["article-context","homepage-card","gallery"],
      sourceClassification:"stock-licence", sourceName:"Pexels", sourceUrl:item.sourcePage,
      photographer:item.photographer, rightsHolder:item.photographer,
      licence:"Pexels licence", licenceUrl:"https://www.pexels.com/license/",
      rightsNotes:"Generic/contextual rugby stock image imported from Pexels. Do not use as an exact depiction of a named player, coach, team, match or event unless separately verified.",
      attribution:credit, creditLine:credit, publicCredit:credit, copyrightLine:credit,
      acquisitionScope:item.scope, acquisitionQuery:item.query, sourceProvider:"Pexels", sourceRecordId:item.id,
      width:item.width, height:item.height, orientation:"landscape", searchKeywords:[item.scope,"rugby","generic","contextual"],
      importedAt:new Date().toISOString()
    });
    existingIds.add(item.id); imported += 1; coverage[item.scope] = (coverage[item.scope] ?? 0) + 1;
    if (imported % 25 === 0) console.log(`IMPORTED ${imported}/${queue.length}`);
  } catch (error) {
    failed += 1;
    console.warn(`IMPORT_FAIL ${item.id} :: ${error instanceof Error ? error.message : String(error)}`);
  }
}
for (let i = 0; i < queue.length; i += concurrency) await Promise.all(queue.slice(i, i + concurrency).map(importOne));

const summary = { generatedAt:new Date().toISOString(), provider:"Pexels", discovered:discovered.length, uniqueCandidates:deduped.length, queued:queue.length, imported, skipped, failed, coverage, openAiCalls:0 };
console.log(JSON.stringify(summary, null, 2));
if (process.env.GITHUB_STEP_SUMMARY) {
  const fs = await import("node:fs/promises");
  await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `## Pexels Rugby Import\n\n- Discovered: ${summary.discovered}\n- Unique candidates: ${summary.uniqueCandidates}\n- Queued: ${summary.queued}\n- Imported: ${summary.imported}\n- Failed: ${summary.failed}\n- OpenAI calls: 0\n`);
}
if (failed > Math.max(25, Math.ceil(queue.length * 0.15))) process.exitCode = 1;
