import fs from "node:fs/promises";
import path from "node:path";

const inputPath = process.env.CURRENT_SOURCE_DISCOVERY_PATH || "data/editorial-acquisition/current-source-discovery.json";
const outputPath = process.env.CURRENT_ACQUISITION_BATCH_PATH || "data/editorial-acquisition/current-editorial-acquisition-batch.json";
const discovery = JSON.parse(await fs.readFile(path.resolve(inputPath), "utf8"));
if (discovery?.schemaVersion !== "1.0" || !Array.isArray(discovery.leads)) throw new Error("Current acquisition bridge fail-closed: invalid discovery evidence.");

const stop = new Set(["rugby","the","a","an","and","or","of","to","for","in","on","at","with","from","as","is","are","was","were","be","been","being","this","that","these","those","after","before","over","under","into","out","up","down","new","latest","says","say"]);
const rugbySignals = /\b(rugby|union|irfu|rfu|urc|united rugby championship|six nations|champions cup|challenge cup|epcr|leinster|munster|ulster|connacht|springboks?|all blacks?|wallabies|pumas|lions tour|test match|test series|rugby championship|fly[- ]?half|out[- ]?half|scrum[- ]?half|scrum|lineout|line-out|try|tries|conversion|prop|hooker|lock|flanker|back[- ]?row|centre|winger|full[- ]?back|rugby squad|rugby club|rugby internationals?)\b/i;
const explicitNonRugby = /\b(boxing|boxer|fight week|ringwalk|golf|superbike|motorbike|cycling|cyclist|5k|athletics|hurling|camogie|gaa|gaelic football|soccer|premier league|dundee united|kilmarnock|goal drought|architecture|cost[- ]of[- ]living|chemtrails?|migrants? protest)\b/i;
const genericTitlePatterns = [
  /^the\s*42(?:\s*-\s*the\s*42)?$/i,
  /^[-\s]*auth\.englandrugby\.com$/i,
  /^untitled design\b/i,
  /^(?:jon newcombe|josh raisey)\s*-\s*rugbypass\.com$/i,
  /^(?:urc|rugby|news|home)\s*-\s*[^-]+$/i,
  /\bnews, squad & players\b/i,
];

function tokenList(value="") { return value.toLowerCase().replace(/[^a-z0-9\s'-]/g," ").split(/\s+/).filter((v)=>v.length>2&&!stop.has(v)); }
function tokens(value="") { return new Set(tokenList(value)); }
function similarity(a,b) { const A=tokens(a), B=tokens(b); if(!A.size||!B.size) return 0; const shared=[...A].filter((x)=>B.has(x)).length; return shared/Math.min(A.size,B.size); }
function sharedTokenCount(a,b) { const A=tokens(a), B=tokens(b); return [...A].filter((x)=>B.has(x)).length; }
function canonicalUrl(value="") { try { const u=new URL(value); ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid"].forEach((k)=>u.searchParams.delete(k)); return u.toString(); } catch { return value; } }
function clean(value="") { return String(value ?? "").replace(/\s+/g," ").trim(); }
function isGenericLead(lead) {
  const title=clean(lead.title);
  const link=clean(lead.link);
  if(title.length<18 || link.includes("/auth")) return true;
  return genericTitlePatterns.some((pattern)=>pattern.test(title));
}
function relevanceText(lead) {
  return `${clean(lead.title)} ${clean(lead.description)}`.replace(/\bRugby Park\b/gi," ");
}
function isRugbyRelevant(lead) {
  if(isGenericLead(lead)) return false;
  const text=relevanceText(lead);
  if(explicitNonRugby.test(text)) return false;
  return rugbySignals.test(text);
}
function sourceRecord(lead,index) {
  const publisher = clean(lead.source?.name || lead.source?.domain || "Unknown source");
  const title = clean(lead.title);
  const description = clean(lead.description || "");
  return {
    id:`source-${index+1}`,
    publisher,
    url:canonicalUrl(lead.link),
    title,
    publishedAt:lead.publishedAt,
    excerpt:description || undefined,
    bodyText:description || undefined,
    isPrimarySource:lead.source?.defaultEvidenceRole === "primary"
  };
}
function suggestedCategoryFor(value="") {
  if (/\bleinster\b/i.test(value)) return "Leinster";
  if (/\bmunster\b/i.test(value)) return "Munster";
  if (/\bulster\b/i.test(value)) return "Ulster";
  if (/\bconnacht\b/i.test(value)) return "Connacht";
  if (/\b(ireland|irish rugby|six nations|andy farrell)\b/i.test(value)) return "Ireland";
  if (/\b(urc|united rugby championship)\b/i.test(value)) return "URC";
  if (/\b(champions cup|challenge cup|epcr|european rugby)\b/i.test(value)) return "Europe";
  return undefined;
}
function hoursApart(a,b) { const delta=Math.abs(Date.parse(a)-Date.parse(b)); return Number.isFinite(delta)?delta/3600000:Number.POSITIVE_INFINITY; }
function sameStory(seed,candidate) {
  const titleScore=similarity(seed.title,candidate.title);
  const developmentScore=similarity(seed.editorialPosition?.development||seed.description||"",candidate.editorialPosition?.development||candidate.description||"");
  const sharedTitle=sharedTokenCount(seed.title,candidate.title);
  const nearInTime=hoursApart(seed.publishedAt,candidate.publishedAt)<=36;
  return Math.max(titleScore,developmentScore)>=0.42 || (nearInTime && sharedTitle>=2 && Math.max(titleScore,developmentScore)>=0.30);
}
function isSafeContextCorroboration(seed,lead) {
  if(isGenericLead(lead) || explicitNonRugby.test(relevanceText(lead))) return false;
  return sameStory(seed,lead) && (similarity(seed.title,lead.title)>=0.38 || sharedTokenCount(seed.title,lead.title)>=3);
}
function sourcePriority(lead) {
  const tier = Number(lead.source?.tier ?? 99);
  const ownerPriority = Number(lead.source?.ownerPriority ?? 0);
  return (100 - Math.min(tier,99)) * 100 + ownerPriority;
}

const leads = discovery.leads.filter((lead)=>lead.title&&lead.link&&lead.publishedAt);
const rugbySeeds = leads.filter(isRugbyRelevant);
const rejectedNonRugby = leads.length-rugbySeeds.length;

// Build each corroborated development independently. Secondary evidence is deliberately reusable
// across seed evaluation: globally marking a corroborating lead as "used" caused an early broad
// cluster to consume evidence needed by later distinct developments. Freshness/deduplication belongs
// after candidate construction where subject + development + angle can be judged explicitly.
const clusters=[];
for (const seed of rugbySeeds) {
  const corroborators = leads
    .filter((candidate) => {
      if ((candidate.id||candidate.link)===(seed.id||seed.link)) return false;
      if (seed.source?.domain && seed.source.domain===candidate.source?.domain) return false;
      return sameStory(seed,candidate) && (isRugbyRelevant(candidate)||isSafeContextCorroboration(seed,candidate));
    })
    .sort((a,b) => sourcePriority(b)-sourcePriority(a));

  const chosen=[seed];
  const domains=new Set([seed.source?.domain].filter(Boolean));
  for (const corroborator of corroborators) {
    const domain=corroborator.source?.domain;
    if (!domain || domains.has(domain)) continue;
    chosen.push(corroborator);
    domains.add(domain);
    if (chosen.length>=4) break;
  }
  if(domains.size>=2) clusters.push(chosen);
}

const candidateDrafts=clusters.map((members)=>{
  const primary=[...members].sort((a,b)=>sourcePriority(b)-sourcePriority(a))[0] || members[0];
  const sourceRecords=members.map(sourceRecord);
  const facts=[...new Set(members.flatMap((lead)=>[clean(lead.title),clean(lead.description||"")]).filter((v)=>v.length>=20))].slice(0,8);
  const subject=clean(primary.editorialPosition?.subject||primary.title);
  const development=clean(primary.editorialPosition?.development||primary.description||primary.title);
  return {
    primaryPublishedAt: primary.publishedAt,
    title:clean(primary.title),
    summary:development,
    suggestedCategory:suggestedCategoryFor(`${subject} ${development} ${primary.title}`),
    editorialPosition:{ subject, development, angle:`Independent multi-source rugby update on ${subject}`, occurredAt:primary.editorialPosition?.occurredAt||primary.publishedAt },
    sourceRecords,
    facts
  };
}).filter((candidate)=>candidate.sourceRecords.length>=2&&candidate.facts.length>=2);

// Remove only near-identical candidate identities here. Deliberately keep closely related but distinct
// developments for the production-history freshness selector rather than collapsing them via shared evidence.
const deduped=[];
for (const candidate of candidateDrafts) {
  const duplicate=deduped.some((existing)=>
    similarity(existing.editorialPosition.subject,candidate.editorialPosition.subject)>=0.90 &&
    similarity(existing.editorialPosition.development,candidate.editorialPosition.development)>=0.90
  );
  if(!duplicate) deduped.push(candidate);
}

const candidates=deduped.map((candidate,index)=>({
  id:`current-${new Date(candidate.primaryPublishedAt).toISOString().slice(0,10)}-${index+1}`,
  title:candidate.title,
  summary:candidate.summary,
  suggestedCategory:candidate.suggestedCategory,
  editorialPosition:candidate.editorialPosition,
  sourceRecords:candidate.sourceRecords,
  facts:candidate.facts
}));

if(candidates.length<5) throw new Error(`Current acquisition bridge fail-closed: only ${candidates.length} corroborated rugby candidates after rejecting ${rejectedNonRugby} non-rugby/generic leads; recovery requires a broad candidate pool before freshness.`);
const output={ schemaVersion:"1.0", batchId:`current-${new Date(discovery.discoveredAt||Date.now()).toISOString().slice(0,10)}`, acquiredAt:discovery.discoveredAt||new Date().toISOString(), provenance:{ discoveryPath:inputPath, leadCount:discovery.leadCount, rugbySeedCount:rugbySeeds.length, rejectedNonRugby, successfulSources:discovery.successfulSources, clustering:"rugby-relevance+independent-seed-cross-domain-corroboration-v4", preDedupedClusters:clusters.length }, candidates };
await fs.mkdir(path.dirname(path.resolve(outputPath)),{recursive:true});
await fs.writeFile(path.resolve(outputPath),`${JSON.stringify(output,null,2)}\n`);
console.log(JSON.stringify({currentAcquisitionBridge:"passed",rugbySeedCount:rugbySeeds.length,rejectedNonRugby,preDedupedClusters:clusters.length,corroboratedCandidates:candidates.length,outputPath},null,2));
