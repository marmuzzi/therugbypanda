import fs from "node:fs/promises";
import path from "node:path";

const inputPath = process.env.CURRENT_SOURCE_DISCOVERY_PATH || "data/editorial-acquisition/current-source-discovery.json";
const outputPath = process.env.CURRENT_ACQUISITION_BATCH_PATH || "data/editorial-acquisition/current-editorial-acquisition-batch.json";
const discovery = JSON.parse(await fs.readFile(path.resolve(inputPath), "utf8"));
if (discovery?.schemaVersion !== "1.0" || !Array.isArray(discovery.leads)) throw new Error("Current acquisition bridge fail-closed: invalid discovery evidence.");

const stop = new Set(["rugby","the","a","an","and","or","of","to","for","in","on","at","with","from","as","is","are","was","were","be","been","being","this","that","these","those","after","before","over","under","into","out","up","down","new","latest","says","say"]);
function tokens(value="") { return new Set(value.toLowerCase().replace(/[^a-z0-9\s'-]/g," ").split(/\s+/).filter((v)=>v.length>2&&!stop.has(v))); }
function similarity(a,b) { const A=tokens(a), B=tokens(b); if(!A.size||!B.size) return 0; const shared=[...A].filter((x)=>B.has(x)).length; return shared/Math.min(A.size,B.size); }
function canonicalUrl(value="") { try { const u=new URL(value); ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid"].forEach((k)=>u.searchParams.delete(k)); return u.toString(); } catch { return value; } }
function clean(value="") { return value.replace(/\s+/g," ").trim(); }
function sourceRecord(lead,index) { return { id:`source-${index+1}`, name:lead.source?.name||lead.source?.domain||"Unknown source", url:canonicalUrl(lead.link), title:clean(lead.title), publishedAt:lead.publishedAt, evidenceRole:lead.source?.defaultEvidenceRole||"corroboration" }; }

const leads = discovery.leads.filter((lead)=>lead.title&&lead.link&&lead.publishedAt);
const used = new Set();
const clusters=[];
for(let i=0;i<leads.length;i++) {
  if(used.has(i)) continue;
  const seed=leads[i];
  const members=[seed]; used.add(i);
  for(let j=i+1;j<leads.length;j++) {
    if(used.has(j)) continue;
    const candidate=leads[j];
    const sameDomain=seed.source?.domain&&seed.source.domain===candidate.source?.domain;
    const score=Math.max(similarity(seed.title,candidate.title), similarity(seed.editorialPosition?.development||seed.description||"",candidate.editorialPosition?.development||candidate.description||""));
    if(!sameDomain&&score>=0.48) { members.push(candidate); used.add(j); }
  }
  const domains=new Set(members.map((m)=>m.source?.domain).filter(Boolean));
  if(domains.size>=2) clusters.push(members);
}

const candidates=clusters.map((members,index)=>{
  const primary=members[0];
  const sourceRecords=members.map(sourceRecord);
  const facts=[...new Set(members.flatMap((lead)=>[clean(lead.title),clean(lead.description||"")]).filter((v)=>v.length>=20))].slice(0,8);
  const subject=clean(primary.editorialPosition?.subject||primary.title);
  const development=clean(primary.editorialPosition?.development||primary.description||primary.title);
  return {
    id:`current-${new Date(primary.publishedAt).toISOString().slice(0,10)}-${index+1}`,
    title:clean(primary.title), summary:development, suggestedCategory:"Rugby",
    editorialPosition:{ subject, development, angle:`Independent multi-source update on ${subject}`, occurredAt:primary.editorialPosition?.occurredAt||primary.publishedAt },
    sourceRecords, facts
  };
}).filter((candidate)=>candidate.sourceRecords.length>=2&&candidate.facts.length>=2);

if(candidates.length<5) throw new Error(`Current acquisition bridge fail-closed: only ${candidates.length} corroborated multi-source candidates; exactly five fresh survivors require at least five candidates.`);
const output={ schemaVersion:"1.0", batchId:`current-${new Date(discovery.discoveredAt||Date.now()).toISOString().slice(0,10)}`, acquiredAt:discovery.discoveredAt||new Date().toISOString(), provenance:{ discoveryPath:inputPath, leadCount:discovery.leadCount, successfulSources:discovery.successfulSources }, candidates };
await fs.mkdir(path.dirname(path.resolve(outputPath)),{recursive:true});
await fs.writeFile(path.resolve(outputPath),`${JSON.stringify(output,null,2)}\n`);
console.log(JSON.stringify({currentAcquisitionBridge:"passed",corroboratedCandidates:candidates.length,outputPath},null,2));