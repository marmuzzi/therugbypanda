import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { sameCurrentRugbyStory, similarity } from "../lib/editorial/CurrentStoryClustering.mjs";

const inputPath = process.env.CURRENT_SOURCE_DISCOVERY_PATH || "data/editorial-acquisition/current-source-discovery.json";
const outputPath = process.env.CURRENT_ACQUISITION_BATCH_PATH || "data/editorial-acquisition/current-editorial-acquisition-batch.json";
const discovery = JSON.parse(await fs.readFile(path.resolve(inputPath), "utf8"));
if (discovery?.schemaVersion !== "1.0" || !Array.isArray(discovery.leads)) throw new Error("Current acquisition bridge fail-closed: invalid discovery evidence.");

const rugbySignals = /\b(rugby|union|irfu|rfu|urc|united rugby championship|six nations|champions cup|challenge cup|epcr|leinster|munster|ulster|connacht|springboks?|all blacks?|wallabies|pumas|lions tour|test match|test series|rugby championship|fly[- ]?half|out[- ]?half|scrum[- ]?half|scrum|lineout|line-out|try|tries|conversion|prop|hooker|lock|flanker|back[- ]?row|centre|winger|full[- ]?back|rugby squad|rugby club|rugby internationals?)\b/i;
const explicitNonRugbyIdentity = /\b(boxing|boxer|fight week|ringwalk|golf|superbike|motorbike|cycling|cyclist|5k|athletics|hurling|camogie|gaa|gaelic football|soccer|football association|fai cup|league of ireland|shelbourne|bohemians|shamrock rovers|premier league|champions league|dundee united|kilmarnock|goal drought|architecture|cost[- ]of[- ]living|chemtrails?|migrants? protest|manchester united|man united|ipswich|sailing|ilca)\b/i;
const genericTitlePatterns = [
  /^the\s*42(?:\s*-\s*the\s*42)?$/i,
  /^[-\s]*auth\.englandrugby\.com$/i,
  /^[-\s]*united rugby championship(?:\s*-\s*united rugby championship)?$/i,
  /^untitled design\b/i,
  /^(?:jon newcombe|josh raisey)\s*-\s*rugbypass\.com$/i,
  /^(?:urc|rugby|news|home)\s*-\s*[^-]+$/i,
  /\bnews, squad & players\b/i,
  /^discipline\s*-\s*irish rugby$/i,
  /^resource library\s*-\s*irish rugby$/i,
  /^inside sport\s*-\s*\d{1,2}\s+\w+\s+\d{4}/i,
  /^the greatest rivalry\s*-\s*united rugby championship/i,
  /^england rugby\s*-\s*rugby football union$/i,
  /^-\s*rugby football union$/i,
];

function canonicalUrl(value="") { try { const u=new URL(value); ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid"].forEach((k)=>u.searchParams.delete(k)); return u.toString(); } catch { return value; } }
function clean(value="") { return String(value ?? "").replace(/\s+/g," ").trim(); }
function normaliseIdentity(value="") { return clean(value).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g," ").trim(); }
function operationalDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Dublin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
const packageDate = operationalDate();
function stableCandidateId(candidate) {
  const material = [candidate.editorialPosition.subject, candidate.editorialPosition.development].map(normaliseIdentity).join("|");
  const fingerprint = createHash("sha256").update(material).digest("hex").slice(0,12);
  return `current-${packageDate}-${fingerprint}`;
}
function isGenericLead(lead) {
  const title=clean(lead.title), link=clean(lead.link);
  if(title.length<18 || link.includes("/auth")) return true;
  return genericTitlePatterns.some((pattern)=>pattern.test(title));
}
function relevanceText(lead) { return `${clean(lead.title)} ${clean(lead.description)}`.replace(/\bRugby Park\b/gi," "); }
function hasExplicitNonRugbyIdentity(lead) { return explicitNonRugbyIdentity.test(clean(lead.title)); }
function isRugbyRelevant(lead) {
  if(isGenericLead(lead) || hasExplicitNonRugbyIdentity(lead)) return false;
  return rugbySignals.test(relevanceText(lead));
}
function isSafeContextCorroboration(seed, lead) {
  if(isGenericLead(lead) || hasExplicitNonRugbyIdentity(lead)) return false;
  return sameCurrentRugbyStory(seed, lead);
}
function sourceRecord(lead,index) {
  const publisher = clean(lead.source?.name || lead.source?.domain || "Unknown source");
  const title = clean(lead.title), description = clean(lead.description || "");
  return { id:`source-${index+1}`, publisher, url:canonicalUrl(lead.link), title, publishedAt:lead.publishedAt, excerpt:description || undefined, bodyText:description || undefined, isPrimarySource:lead.source?.defaultEvidenceRole === "primary" || lead.source?.defaultEvidenceRole === "primary-evidence" };
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
function sourcePriority(lead) {
  const tierValue = String(lead.source?.tier ?? "").toLowerCase();
  const tierScore = tierValue === "primary" ? 3 : tierValue === "trusted" ? 2 : tierValue === "supplementary" ? 1 : Number(lead.source?.tier ?? 0) || 0;
  return tierScore * 1000 + Number(lead.source?.ownerPriority ?? 0);
}

const leads = discovery.leads.filter((lead)=>lead.title&&lead.link&&lead.publishedAt);
const rugbySeeds = leads.filter(isRugbyRelevant);
const rejectedNonRugby = leads.length-rugbySeeds.length;
const clusters=[];

for (const seed of rugbySeeds) {
  const corroborators = leads
    .filter((candidate) => {
      if ((candidate.id||candidate.link)===(seed.id||seed.link)) return false;
      if (seed.source?.domain && seed.source.domain===candidate.source?.domain) return false;
      if (!sameCurrentRugbyStory(seed,candidate)) return false;
      return isRugbyRelevant(candidate) || isSafeContextCorroboration(seed,candidate);
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
  return { primaryPublishedAt: primary.publishedAt, title:clean(primary.title), summary:development, suggestedCategory:suggestedCategoryFor(`${subject} ${development} ${primary.title}`), editorialPosition:{ subject, development, angle:`Independent multi-source rugby update on ${subject}`, occurredAt:primary.editorialPosition?.occurredAt||primary.publishedAt }, sourceRecords, facts };
}).filter((candidate)=>candidate.sourceRecords.length>=2&&candidate.facts.length>=2);

const deduped=[];
for (const candidate of candidateDrafts) {
  const duplicate=deduped.some((existing)=> similarity(existing.editorialPosition.subject,candidate.editorialPosition.subject)>=0.90 && similarity(existing.editorialPosition.development,candidate.editorialPosition.development)>=0.90 );
  if(!duplicate) deduped.push(candidate);
}

const candidates=deduped.map((candidate)=>({ id:stableCandidateId(candidate), title:candidate.title, summary:candidate.summary, suggestedCategory:candidate.suggestedCategory, editorialPosition:candidate.editorialPosition, sourceRecords:candidate.sourceRecords, facts:candidate.facts }));
if(candidates.length<5) throw new Error(`Current acquisition bridge fail-closed: only ${candidates.length} coherent corroborated rugby candidates after rejecting ${rejectedNonRugby} non-rugby/generic leads; recovery requires five genuinely cross-source stories before model spend.`);

const output={ schemaVersion:"1.0", batchId:`current-${packageDate}`, acquiredAt:discovery.discoveredAt||new Date().toISOString(), packageDate, provenance:{ discoveryPath:inputPath, leadCount:discovery.leadCount, initialLeadCount:discovery.initialLeadCount, corroborationLeadCount:discovery.corroborationLeadCount, rugbySeedCount:rugbySeeds.length, rejectedNonRugby, successfulSources:discovery.successfulSources, clustering:"person-team-coherent+independent-cross-domain-corroboration-v10", preDedupedClusters:clusters.length }, candidates };
await fs.mkdir(path.dirname(path.resolve(outputPath)),{recursive:true});
await fs.writeFile(path.resolve(outputPath),`${JSON.stringify(output,null,2)}\n`);
console.log(JSON.stringify({currentAcquisitionBridge:"passed",packageDate,rugbySeedCount:rugbySeeds.length,rejectedNonRugby,preDedupedClusters:clusters.length,corroboratedCandidates:candidates.length,stableCandidateIds:true,clustering:output.provenance.clustering,outputPath},null,2));
