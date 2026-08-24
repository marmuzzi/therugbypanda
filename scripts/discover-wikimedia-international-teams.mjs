import fs from "node:fs/promises";
import path from "node:path";

const API = "https://commons.wikimedia.org/w/api.php";
const outputPath = process.env.WIKIMEDIA_OUTPUT ?? "data/editorial-images/wikimedia-international-team-candidates.json";
const recentFloor = 2025;
const searchYears = [2026, 2025];
const perTeamApprovalCap = 2;
const teams = ["France national rugby union team","England national rugby union team","Scotland national rugby union team","Wales national rugby union team","Italy national rugby union team","South Africa national rugby union team","New Zealand national rugby union team","Australia national rugby union team","Argentina national rugby union team","Japan national rugby union team","Fiji national rugby union team","Georgia national rugby union team"];
const aliases = {
  "France national rugby union team":["France rugby","France national rugby union team"],
  "England national rugby union team":["England rugby","England national rugby union team"],
  "Scotland national rugby union team":["Scotland rugby","Scotland national rugby union team"],
  "Wales national rugby union team":["Wales rugby","Wales national rugby union team"],
  "Italy national rugby union team":["Italy rugby","Italy national rugby union team"],
  "South Africa national rugby union team":["South Africa rugby","Springboks"],
  "New Zealand national rugby union team":["New Zealand rugby","All Blacks"],
  "Australia national rugby union team":["Australia rugby","Wallabies"],
  "Argentina national rugby union team":["Argentina rugby","Los Pumas"],
  "Japan national rugby union team":["Japan rugby","Brave Blossoms"],
  "Fiji national rugby union team":["Fiji rugby","Flying Fijians"],
  "Georgia national rugby union team":["Georgia rugby","Lelos"]
};
const allowedLicences = /^(CC BY(?:-SA)?(?: [234]\.0)?|CC0|Public domain)/i;
const blocked = /\b(logo|crest|badge|emblem|flag|kit template|shirt template|jersey template|svg|diagram|rugby league)\b/i;
const stripHtml = (v="") => String(v).replace(/<[^>]*>/g," ").replace(/&nbsp;/g," ").replace(/\s+/g," ").trim();
const esc = (v) => v.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const yearOf = (...v) => { const m=v.filter(Boolean).join(" ").match(/\b(20\d{2})\b/); return m?Number(m[1]):null; };
const hasTeam = (text,team) => (aliases[team]??[team]).some(a=>new RegExp(`\\b${esc(a)}\\b`,`i`).test(text));

async function searchTeam(team, searchYear) {
  const query=`\"${aliases[team]?.[0]??team}\" rugby ${searchYear}`;
  const url=new URL(API); for (const [k,v] of Object.entries({action:"query",format:"json",generator:"search",gsrnamespace:"6",gsrsearch:query,gsrlimit:"20",prop:"imageinfo",iiprop:"url|size|mime|extmetadata"})) url.searchParams.set(k,v);
  const r=await fetch(url,{headers:{"User-Agent":"TheRugbyPanda/1.0 (editorial image discovery; hello@therugbypanda.ie)"}}); if(!r.ok) throw new Error(`Commons search failed ${r.status} for ${query}`);
  const p=await r.json(); return Object.values(p?.query?.pages??{}).map(page=>{
    const info=page.imageinfo?.[0]??{}, meta=info.extmetadata??{}, title=String(page.title??"").replace(/^File:/,""), description=stripHtml(meta.ImageDescription?.value), categories=stripHtml(meta.Categories?.value), text=`${title} ${description} ${categories}`;
    const evidence=hasTeam(text,team)?[team]:[], licence=stripHtml(meta.LicenseShortName?.value), dateText=stripHtml(meta.DateTimeOriginal?.value||meta.DateTime?.value), year=yearOf(dateText,title,description), recent=year!==null&&year>=recentFloor;
    const rightsClear=allowedLicences.test(licence)&&Boolean(meta.LicenseUrl?.value||/CC0|Public domain/i.test(licence));
    const usable=/^image\/(jpeg|png|webp)$/i.test(info.mime??"")&&Number(info.width??0)>=1200&&Number(info.height??0)>=600;
    const autoDecision=blocked.test(text)||!usable||!evidence.length||!recent?"reject":rightsClear?"approve-candidate":"owner-review";
    return {source:"Wikimedia Commons",scope:team,query,searchYear,title,description,categories,sourcePage:info.descriptionurl,imageUrl:info.url,width:info.width,height:info.height,mime:info.mime,creator:stripHtml(meta.Artist?.value),credit:stripHtml(meta.Credit?.value),licence,licenceUrl:meta.LicenseUrl?.value??null,dateText:dateText||null,year,recent,rightsClear,subjectEvidence:evidence,autoDecision};
  });
}
const all=[]; for(const team of teams) for(const y of searchYears) all.push(...await searchTeam(team,y));
const deduped=[...new Map(all.filter(x=>x.imageUrl).map(x=>[x.imageUrl,x])).values()].sort((a,b)=>Number(b.year??0)-Number(a.year??0)||(b.width??0)-(a.width??0));
const tc=new Map(); for(const x of deduped){if(x.autoDecision!=="approve-candidate")continue; const n=tc.get(x.scope)??0; if(n>=perTeamApprovalCap)x.autoDecision="diversity-hold"; else tc.set(x.scope,n+1);}
const counts={},coverage={}; for(const x of deduped){counts[x.autoDecision]=(counts[x.autoDecision]??0)+1;if(x.autoDecision==="approve-candidate")coverage[x.scope]=(coverage[x.scope]??0)+1;}
const approved=deduped.filter(x=>x.autoDecision==="approve-candidate"), ownerReviewRate=deduped.length?(counts["owner-review"]??0)/deduped.length:0, recentApprovalRate=approved.length?approved.filter(x=>x.recent).length/approved.length:0, maxScopeShare=approved.length?Math.max(...Object.values(coverage))/approved.length:0;
const output={generatedAt:new Date().toISOString(),policy:{recentFloor,searchYears,perTeamApprovalCap,ownerReviewTargetMaximum:.05,exactTeamEvidenceRequired:true,relevantImageOrNoImage:true},counts,coverage,ownerReviewRate,recentApprovalRate,maxScopeShare,candidates:deduped};
await fs.mkdir(path.dirname(outputPath),{recursive:true}); await fs.writeFile(outputPath,`${JSON.stringify(output,null,2)}\n`); console.log(JSON.stringify({total:deduped.length,counts,coverage,ownerReviewRate,recentApprovalRate,maxScopeShare,outputPath},null,2)); if(ownerReviewRate>.05)throw new Error(`Owner-review rate ${(ownerReviewRate*100).toFixed(1)}% exceeds 5%.`);
