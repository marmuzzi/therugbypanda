import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createClient } from "next-sanity";

const API = "https://commons.wikimedia.org/w/api.php";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "hvg4b508";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const importLimit = Math.max(1, Number.parseInt(process.env.BULK_IMAGE_IMPORT_LIMIT ?? "10000", 10));
const perScope = Math.max(10, Math.min(500, Number.parseInt(process.env.BULK_IMAGE_PER_SCOPE ?? "200", 10)));
const concurrency = Math.max(1, Math.min(6, Number.parseInt(process.env.BULK_IMAGE_CONCURRENCY ?? "4", 10)));
const targetedOnly = process.env.BULK_IMAGE_TARGETED_ONLY === "1";
const targetPath = process.env.BULK_IMAGE_TARGETS_PATH ?? "data/editorial-images/acquisition-targets-2026-27.json";
if (!token) throw new Error("Missing SANITY_API_TOKEN.");

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const allowedLicences = /^(CC BY(?:-SA)?(?: [234]\.0)?|CC0|Public domain)/i;
const blocked = /\b(logo|crest|flag|kit template|shirt template|diagram|line-?up|map|coat of arms)\b/i;
const rugbyEvidence = /\b(rugby|rugby union|six nations|united rugby championship|urc|heineken cup|champions cup|challenge cup|all blacks|springboks|wallabies|pumas)\b/i;

const baseScopes = [
  ["Leinster", "Leinster Rugby"], ["Munster", "Munster Rugby"], ["Ulster", "Ulster Rugby"], ["Connacht", "Connacht Rugby"],
  ["Ireland", "Ireland rugby union"], ["Ireland Women", "Ireland women's rugby union"],
  ["Six Nations", "Six Nations rugby"], ["URC", "United Rugby Championship rugby"], ["Champions Cup", "European Rugby Champions Cup"], ["Challenge Cup", "EPCR Challenge Cup rugby"],
  ["New Zealand", "All Blacks rugby"], ["South Africa", "Springboks rugby"], ["Australia", "Wallabies rugby"], ["Argentina", "Argentina Pumas rugby"],
  ["England", "England rugby union"], ["Scotland", "Scotland rugby union"], ["Wales", "Wales rugby union"], ["France", "France rugby union"], ["Italy", "Italy rugby union"],
  ["Fiji", "Fiji rugby union"], ["Japan", "Japan rugby union"], ["Samoa", "Samoa rugby union"], ["Tonga", "Tonga rugby union"],
  ["Bulls", "Bulls rugby union"], ["Sharks", "Sharks rugby union"], ["Stormers", "Stormers rugby union"], ["Lions", "Lions South Africa rugby"],
  ["Glasgow Warriors", "Glasgow Warriors rugby"], ["Edinburgh", "Edinburgh Rugby"], ["Ospreys", "Ospreys rugby"], ["Scarlets", "Scarlets rugby"], ["Cardiff", "Cardiff Rugby"], ["Dragons", "Dragons RFC rugby"],
  ["Benetton", "Benetton Rugby Treviso"], ["Zebre", "Zebre Parma rugby"],
  ["Toulouse", "Stade Toulousain rugby"], ["La Rochelle", "Stade Rochelais rugby"], ["Bordeaux", "Union Bordeaux Begles rugby"], ["Toulon", "RC Toulon rugby"], ["Racing 92", "Racing 92 rugby"],
  ["Leicester Tigers", "Leicester Tigers rugby"], ["Saracens", "Saracens rugby"], ["Harlequins", "Harlequins rugby union"], ["Northampton Saints", "Northampton Saints rugby"], ["Bath", "Bath Rugby"], ["Exeter Chiefs", "Exeter Chiefs rugby"],
  ["Rugby Stadium", "rugby union stadium"], ["Rugby Scrum", "rugby union scrum"], ["Rugby Lineout", "rugby union lineout"], ["Rugby Tackle", "rugby union tackle"], ["Rugby Training", "rugby union training"], ["Rugby Crowd", "rugby union crowd supporters"],
].map(([scope, query]) => ({ scope, query, kind: "general", requiredSignal: undefined }));

const targets = JSON.parse(await readFile(targetPath, "utf8"));
const targetedScopes = [];
const seenTargets = new Set();
function addTarget(scope, query, kind, requiredSignal = scope) {
  const key = `${kind}:${scope}`.toLowerCase();
  if (seenTargets.has(key)) return;
  seenTargets.add(key);
  targetedScopes.push({ scope, query, kind, requiredSignal });
}

for (const team of [...new Set([...(targets.priorityTeams ?? []), ...(targets.urcTeams ?? []), ...(targets.nationsChampionshipTeams ?? [])])]) {
  addTarget(team, `${team} rugby`, "team", team);
}
for (const player of targets.priorityIrelandPlayers ?? []) addTarget(player, `"${player}" rugby`, "player", player);
for (const coach of targets.priorityCoaches ?? []) addTarget(coach.name, `"${coach.name}" rugby ${coach.team}`, "coach", coach.name);
for (const venue of targets.priorityVenues ?? []) addTarget(venue, `"${venue}" rugby`, "stadium", venue);

const scopes = targetedOnly ? targetedScopes : [...targetedScopes, ...baseScopes];
console.log(JSON.stringify({ targetedOnly, scopeCount: scopes.length, importLimit, perScope, concurrency, targetPath }, null, 2));

function stripHtml(value = "") { return String(value).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim(); }
function clean(value) { const v = stripHtml(value); return v || undefined; }
function normalize(value = "") { return stripHtml(value).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim(); }
function extension(mime = "") { if (/png/i.test(mime)) return ".png"; if (/webp/i.test(mime)) return ".webp"; return ".jpg"; }
function photoType(text, kind) { if (kind === "stadium") return "stadium"; if (kind === "player" || kind === "coach") return /portrait|headshot/i.test(text) ? "portrait" : "action"; const t = text.toLowerCase(); if (/stadium|ground|arena/.test(t)) return "stadium"; if (/scrum/.test(t)) return "scrum"; if (/lineout|line-out/.test(t)) return "lineout"; if (/tackle/.test(t)) return "tackle"; if (/training|warm.?up/.test(t)) return "training"; if (/crowd|supporter|fan/.test(t)) return "crowd"; if (/portrait|headshot/.test(t)) return "portrait"; return "action"; }
function category(kind, scope) { if (kind === "stadium") return "rugby-culture"; if (scope === "Ireland Women") return "womens-rugby"; if (kind === "player" || kind === "coach" || ["Ireland","England","Scotland","Wales","France","Italy","Argentina","Australia","Fiji","Japan","New Zealand","South Africa"].includes(scope)) return "international"; return "club-rugby"; }
function credit(creator) { return creator ? `Photo: ${creator} / Wikimedia Commons` : "Wikimedia Commons"; }
function copyrightLine(creator, licence) { if (/^(CC0|Public domain)/i.test(licence)) return `${licence} · Wikimedia Commons`; return creator ? `© ${creator} · ${licence}` : `${licence} · Wikimedia Commons`; }
function exactSignalPresent(evidence, requiredSignal) {
  if (!requiredSignal) return true;
  const haystack = normalize(evidence);
  const needle = normalize(requiredSignal);
  if (!needle) return false;
  if (haystack.includes(needle)) return true;
  const tokens = needle.split(" ").filter((x) => x.length >= 3 && !["rugby","dhl","vodacom","hollywoodbets","stadium"].includes(x));
  return tokens.length > 0 && tokens.every((token) => haystack.includes(token));
}

async function discover({ scope, query, kind, requiredSignal }) {
  const url = new URL(API);
  Object.entries({ action:"query", format:"json", generator:"search", gsrnamespace:"6", gsrsearch:query, gsrlimit:String(perScope), prop:"imageinfo", iiprop:"url|size|mime|extmetadata" }).forEach(([k,v]) => url.searchParams.set(k,v));
  const response = await fetch(url, { headers:{ "User-Agent":"TheRugbyPanda/1.0 (targeted open-licence rugby library; hello@therugbypanda.ie)" } });
  if (!response.ok) throw new Error(`Commons search failed ${response.status}: ${query}`);
  const payload = await response.json();
  return Object.values(payload?.query?.pages ?? {}).map((page) => {
    const info = page.imageinfo?.[0] ?? {}; const meta = info.extmetadata ?? {};
    const title = String(page.title ?? "").replace(/^File:/, "");
    const description = stripHtml(meta.ImageDescription?.value); const categories = stripHtml(meta.Categories?.value);
    const evidence = `${title} ${description} ${categories}`; const licence = stripHtml(meta.LicenseShortName?.value);
    const licenceUrl = clean(meta.LicenseUrl?.value); const creator = clean(meta.Artist?.value) ?? clean(meta.Credit?.value);
    const width = Number(info.width ?? 0); const height = Number(info.height ?? 0); const mime = String(info.mime ?? "");
    const rightsClear = allowedLicences.test(licence) && Boolean(licenceUrl || /CC0|Public domain/i.test(licence));
    const subjectSignal = exactSignalPresent(evidence, requiredSignal);
    const relevant = (rugbyEvidence.test(evidence) || kind === "stadium") && subjectSignal && !blocked.test(evidence);
    const usable = /^image\/(jpeg|png|webp)$/i.test(mime) && width >= 1200 && height >= 600;
    return { scope, query, kind, requiredSignal, title, description, categories, sourcePage:info.descriptionurl, imageUrl:info.url, width, height, mime, licence, licenceUrl, creator, rightsClear, subjectSignal, relevant, usable, evidence };
  }).filter((x) => x.sourcePage && x.imageUrl && x.rightsClear && x.subjectSignal && x.relevant && x.usable);
}

const discovered = [];
for (const target of scopes) {
  try { const items = await discover(target); discovered.push(...items); console.log(`DISCOVER ${target.kind} ${target.scope}: ${items.length}`); }
  catch (error) { console.warn(`DISCOVER_FAIL ${target.scope}: ${error instanceof Error ? error.message : String(error)}`); }
}

const deduped = [...new Map(discovered.map((x) => [x.sourcePage, x])).values()];
const existing = await client.fetch(`*[_type == "editorialImage" && !(_id in path("drafts.**")) && defined(sourceUrl)]{sourceUrl}`);
const existingSources = new Set(existing.map((x) => x.sourceUrl).filter(Boolean));
const queue = deduped.filter((x) => !existingSources.has(x.sourcePage)).slice(0, importLimit);
console.log(JSON.stringify({ discovered: discovered.length, uniqueCandidates: deduped.length, existingSourceCount: existingSources.size, queued: queue.length, importLimit }, null, 2));

let imported = 0, skipped = 0, failed = 0;
const coverage = {};
const coverageByKind = {};
async function importOne(item) {
  if (existingSources.has(item.sourcePage)) { skipped += 1; return; }
  try {
    const response = await fetch(item.imageUrl, { headers:{ "User-Agent":"TheRugbyPanda/1.0 (editorial media ingestion; hello@therugbypanda.ie)" } });
    if (!response.ok) throw new Error(`download ${response.status}`);
    const contentType = response.headers.get("content-type") ?? item.mime;
    if (!/^image\/(jpeg|png|webp)/i.test(contentType)) throw new Error(`unsupported ${contentType}`);
    const buffer = Buffer.from(await response.arrayBuffer()); if (buffer.length < 50_000) throw new Error(`small file ${buffer.length}`);
    const hash = createHash("sha1").update(item.sourcePage).digest("hex").slice(0, 20);
    const filename = `${String(item.title).replace(/[^a-zA-Z0-9._-]+/g,"-").slice(0,90) || `rugby-${hash}`}${extension(contentType)}`;
    const asset = await client.assets.upload("image", buffer, { filename, contentType });
    const caption = item.description || item.title; const publicCredit = credit(item.creator); const copyright = copyrightLine(item.creator, item.licence);
    const people = ["player","coach"].includes(item.kind) ? [item.scope] : undefined;
    await client.createOrReplace({
      _id:`editorialImage-wikimedia-targeted-${hash}`, _type:"editorialImage", title:item.title,
      image:{ _type:"image", asset:{_type:"reference",_ref:asset._id}, alt:caption, caption, photographer:item.creator, source:"Wikimedia Commons", rights:[item.licence,item.licenceUrl,publicCredit].filter(Boolean).join(" · ") },
      altText:caption, caption, lifecycleStatus:"approved", usageApproved:true, editorialCategory:category(item.kind,item.scope), photoType:photoType(item.evidence,item.kind), editorialValue:"historical", editorialRating:4,
      suggestedUse:["article-header","homepage-card","gallery"], team:item.kind === "team" ? item.scope : undefined, people,
      competitionEvent:item.kind === "stadium" ? item.scope : undefined,
      sourceClassification:"open-licence", sourceName:"Wikimedia Commons", sourceUrl:item.sourcePage, sourcePageTitle:item.title, photographer:item.creator, rightsHolder:item.creator,
      licence:item.licence, licenceUrl:item.licenceUrl, rightsNotes:`Open-licence Wikimedia asset imported by deterministic targeted subject and rights gates. Exact subject signal required: ${item.requiredSignal}. Preserve attribution. ${publicCredit}`,
      attribution:publicCredit, creditLine:publicCredit, publicCredit, copyrightLine:copyright, acquisitionScope:item.scope, acquisitionQuery:item.query, sourceProvider:"Wikimedia Commons", sourceRecordId:item.sourcePage,
      width:item.width, height:item.height, orientation:item.width >= item.height ? "landscape" : "portrait", searchKeywords:[item.scope,item.kind,"rugby"], importedAt:new Date().toISOString()
    });
    existingSources.add(item.sourcePage); imported += 1; coverage[item.scope] = (coverage[item.scope] ?? 0) + 1; coverageByKind[item.kind] = (coverageByKind[item.kind] ?? 0) + 1;
    if (imported % 25 === 0) console.log(`IMPORTED ${imported}/${queue.length}`);
  } catch (error) { failed += 1; console.warn(`IMPORT_FAIL ${item.scope} :: ${item.title} :: ${error instanceof Error ? error.message : String(error)}`); }
}

for (let i = 0; i < queue.length; i += concurrency) await Promise.all(queue.slice(i, i + concurrency).map(importOne));
const summary = { generatedAt:new Date().toISOString(), targetedOnly, scopeCount:scopes.length, discovered:discovered.length, uniqueCandidates:deduped.length, queued:queue.length, imported, skipped, failed, coverage, coverageByKind, openAiCalls:0 };
console.log(JSON.stringify(summary, null, 2));
if (process.env.GITHUB_STEP_SUMMARY) {
  const fs = await import("node:fs/promises");
  await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `## Targeted Rugby Image Import\n\n- Target import ceiling: ${importLimit}\n- Target scopes: ${summary.scopeCount}\n- Discovered: ${summary.discovered}\n- Unique rights-safe exact-subject candidates: ${summary.uniqueCandidates}\n- Imported: ${summary.imported}\n- Failed: ${summary.failed}\n- OpenAI calls: 0\n`);
}
if (failed > Math.max(25, Math.floor(queue.length * 0.15))) throw new Error(`Bulk import failure rate too high: ${failed}/${queue.length}`);
