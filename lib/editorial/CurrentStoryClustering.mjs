const STOP = new Set(["rugby","the","a","an","and","or","of","to","for","in","on","at","with","from","as","is","are","was","were","be","been","being","this","that","these","those","after","before","over","under","into","out","up","down","new","latest","says","say","united","championship","match","live","stats","sport","sports","news","report","ireland","irish","england","bbc","planet","rugbypass","super","league"]);
const GENERIC_PROPER = new Set(["the","rugby","irish","ireland","england","new","south","north","united","championship","bbc","planet","business","post","times","independent","sport","sports","news","all","blacks","springboks","wallabies","leinster","munster","ulster","connacht","rte"]);
const TEAM_ANCHORS = ["leinster","munster","ulster","connacht","ireland","zebre","brumbies","waratahs","exeter","england","scotland","wales","france","springboks","all blacks","wallabies"];

function clean(value="") { return String(value ?? "").replace(/\s+/g," ").trim(); }
function tokenList(value="") { return clean(value).toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9\s-]/g," ").split(/\s+/).filter((v)=>v.length>2&&!STOP.has(v)); }
function tokenSet(value="") { return new Set(tokenList(value)); }
export function similarity(a,b) { const A=tokenSet(a), B=tokenSet(b); if(!A.size||!B.size)return 0; const shared=[...A].filter((x)=>B.has(x)).length; return shared/Math.min(A.size,B.size); }
export function sharedTokenCount(a,b) { const A=tokenSet(a), B=tokenSet(b); return [...A].filter((x)=>B.has(x)).length; }
function properTokens(value="") {
  return new Set((clean(value).match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]{3,}\b/g) ?? [])
    .map((v)=>v.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[’']/g,""))
    .filter((v)=>!GENERIC_PROPER.has(v)));
}
function teamAnchors(value="") {
  const lower=clean(value).toLowerCase();
  return new Set(TEAM_ANCHORS.filter((team)=>new RegExp(`\\b${team.replace(/ /g,"\\s+")}\\b`,"i").test(lower)));
}
function intersects(a,b){ return [...a].some((v)=>b.has(v)); }
function sharedDistinctiveProper(a,b){ return intersects(properTokens(a),properTokens(b)); }
function hoursApart(a,b){ const delta=Math.abs(Date.parse(a)-Date.parse(b)); return Number.isFinite(delta)?delta/3600000:Number.POSITIVE_INFINITY; }

/**
 * Cluster differently worded reports of the same current rugby development.
 * A single shared secondary person is not enough. For low lexical-overlap
 * stories we require a shared distinctive proper-name token plus a shared team
 * anchor, which captures e.g. "Hansen" + "Connacht" while preventing Ian
 * Madigan commentary about Leinster from being merged into his Tom Wood/Munster
 * comments merely because both headlines contain "Madigan".
 */
export function sameCurrentRugbyStory(seed,candidate){
  if(hoursApart(seed?.publishedAt,candidate?.publishedAt)>36)return false;
  const seedTitle=clean(seed?.title), candidateTitle=clean(candidate?.title);
  const titleScore=similarity(seedTitle,candidateTitle);
  const sharedTitle=sharedTokenCount(seedTitle,candidateTitle);
  const seedDev=clean(seed?.editorialPosition?.development||seed?.description||"");
  const candidateDev=clean(candidate?.editorialPosition?.development||candidate?.description||"");
  const developmentScore=similarity(seedDev,candidateDev);

  if(sharedTitle>=4 && titleScore>=0.60)return true;
  if(sharedTitle>=4 && developmentScore>=0.65)return true;

  const sharedProper=sharedDistinctiveProper(seedTitle,candidateTitle);
  const sharedTeam=intersects(teamAnchors(`${seedTitle} ${seedDev}`),teamAnchors(`${candidateTitle} ${candidateDev}`));
  if(sharedProper && sharedTeam && sharedTitle>=1)return true;

  return false;
}
