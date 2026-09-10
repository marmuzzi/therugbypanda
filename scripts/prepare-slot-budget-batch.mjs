import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";
import { selectFreshPositions } from "../lib/editorial/StoryFreshness.ts";
import { isCurrentPackageEditorialInputId } from "../lib/editorial/CurrentPackageIdentity.ts";

const PACKAGE_SIZE=5, MIN_IRISH=3, DAILY_CEILING_USD=0.75, NORMAL_TARGET_USD=0.40;
const batchPath=process.env.BATCH_PATH||"data/editorial-acquisition/current-editorial-acquisition-batch.json";
const recentPath=process.env.RECENT_EDITORIAL_POSITIONS_PATH||"data/editorial-acquisition/recent-editorial-positions.json";
const projectId=process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset=process.env.NEXT_PUBLIC_SANITY_DATASET||"production", apiVersion=process.env.NEXT_PUBLIC_SANITY_API_VERSION||"2025-01-01", token=process.env.SANITY_API_TOKEN;
if(!projectId||!token)throw new Error("Slot-budget planning requires Sanity project ID and token.");
const IRISH_CATEGORY=new Set(["Ireland","Leinster","Munster","Ulster","Connacht"]); const IRISH_PRIMARY=/\b(?:ireland|irish|irfu|leinster|munster|ulster|connacht)\b/i;
const candidateText=(c)=>[c?.title,c?.summary,c?.subject,c?.development,c?.editorialAngle,c?.editorialPosition?.subject,c?.editorialPosition?.development,c?.editorialPosition?.angle,...(Array.isArray(c?.sourceRecords)?c.sourceRecords.flatMap((s)=>[s?.title,s?.excerpt]):[])].filter(Boolean).join(" ");
const isIrish=(c)=>IRISH_CATEGORY.has(c?.suggestedCategory)||IRISH_PRIMARY.test(candidateText(c));
const operationalDate=()=>new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Dublin",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
const normaliseUrl=(value="")=>{try{const url=new URL(String(value));url.hash="";return url.toString();}catch{return String(value).trim();}};
const candidateSourceUrls=(candidate)=>new Set((Array.isArray(candidate?.sourceRecords)?candidate.sourceRecords:[]).map((source)=>normaliseUrl(source?.url)).filter(Boolean));
const retainedSourceUrls=(draft)=>new Set((Array.isArray(draft?.sourceNotes)?draft.sourceNotes:[]).map((note)=>normaliseUrl(note?.url)).filter(Boolean));
const overlapCount=(left,right)=>{let count=0;for(const value of left)if(right.has(value))count+=1;return count;};
const packageDate=operationalDate();
const batch=JSON.parse(await fs.readFile(path.resolve(batchPath),"utf8")); const recentRaw=JSON.parse(await fs.readFile(path.resolve(recentPath),"utf8")); const recentPositions=Array.isArray(recentRaw)?recentRaw:recentRaw.positions;
if(!Array.isArray(batch?.candidates)||!Array.isArray(recentPositions))throw new Error("Slot-budget planning fail-closed: batch or recent positions are invalid.");
const client=createClient({projectId,dataset,apiVersion,token,useCdn:false,perspective:"raw"});
const retainedRaw=await client.fetch(`*[_type == "article" && _id in path("drafts.**") && morningPackageEligible == true && coalesce(automationContentClass, "production") == "production"] {editorialInputId,sourceNotes}`);
const retainedDrafts=(Array.isArray(retainedRaw)?retainedRaw:[]).filter((draft)=>isCurrentPackageEditorialInputId(draft?.editorialInputId,packageDate));
const retainedIds=new Set(retainedDrafts.map((d)=>d.editorialInputId).filter(Boolean));
const retainedClusters=retainedDrafts.map((draft)=>({id:draft.editorialInputId,urls:retainedSourceUrls(draft)}));
const retainedCount=Math.min(PACKAGE_SIZE,retainedIds.size), missingSlots=Math.max(0,PACKAGE_SIZE-retainedCount);
const retainedIrishCount=Math.max(0,Number(batch?.packageDiversity?.retainedIrishCount||0)); const irishNeeded=Math.max(0,MIN_IRISH-retainedIrishCount);

const budget=await client.fetch(`*[_id == $id][0]{reservedUsd,events[]{purpose,amountUsd}}`,{id:`editorial-ai-budget-${packageDate}`});
const paidAttemptedIds=new Set((Array.isArray(budget?.events)?budget.events:[]).map((event)=>String(event?.purpose||"")).filter((purpose)=>purpose.startsWith("production-draft:")).map((purpose)=>purpose.slice("production-draft:".length)).filter(Boolean));
const explicitExclusions=new Set(String(process.env.SLOT_BUDGET_EXCLUDE_IDS||"").split(",").map((value)=>value.trim()).filter(Boolean));
const excludedIds=new Set([...paidAttemptedIds,...explicitExclusions]);
const duplicateOfRetained=[];
const available=batch.candidates.filter((candidate)=>{
  if(retainedIds.has(candidate.id)||excludedIds.has(candidate.id))return false;
  const urls=candidateSourceUrls(candidate);
  const duplicate=retainedClusters.find((cluster)=>overlapCount(urls,cluster.urls)>=2);
  if(duplicate){duplicateOfRetained.push({id:candidate.id,duplicateOf:duplicate.id,sharedSourceCount:overlapCount(urls,duplicate.urls)});return false;}
  return true;
});
const positions=available.map((c)=>({id:c.id,subject:c.editorialPosition?.subject||c.title||"",development:c.editorialPosition?.development||c.summary||"",angle:c.editorialPosition?.angle||c.summary||"",occurredAt:c.editorialPosition?.occurredAt||c.primaryPublishedAt}));
const freshness=selectFreshPositions(positions,recentPositions,available.length); const freshIds=new Set(freshness.selected.map((p)=>p.id)); const fresh=available.filter((c)=>freshIds.has(c.id)); const freshIrish=fresh.filter(isIrish);
if(freshIrish.length<irishNeeded)throw new Error(`Slot-budget planning Ireland-first fail-closed before model spend: only ${freshIrish.length}/${irishNeeded} fresh Irish-connected candidates remain after production-history freshness.`);
const selected=[]; const selectedIds=new Set();
for(const c of freshIrish.slice(0,irishNeeded)){selected.push(c);selectedIds.add(c.id);} for(const c of fresh){if(selected.length>=missingSlots)break;if(selectedIds.has(c.id))continue;selected.push(c);selectedIds.add(c.id);}
if(selected.length<missingSlots)throw new Error(`Slot-budget planning fail-closed before model spend: only ${selected.length}/${missingSlots} fresh candidates can be assigned one-to-one to missing slots.`);
const selectedIrishCount=selected.filter(isIrish).length; if(selectedIrishCount<irishNeeded)throw new Error(`Slot-budget planning internal quota failure: selected ${selectedIrishCount}/${irishNeeded} required Irish-connected candidates.`);
batch.slotBudgetPlan={operationalDate:packageDate,dailyCeilingUsd:DAILY_CEILING_USD,normalTargetUsd:NORMAL_TARGET_USD,reservationPerSlotUsd:0.055,retainedCount,retainedIrishCount,missingSlots,irishNeeded,selectedIrishCount,paidAttemptLimit:missingSlots,replacementPaidAttempts:0,selectedIds:selected.map((c)=>c.id),excludedPreviouslyPaidIds:[...paidAttemptedIds],explicitExcludedIds:[...explicitExclusions],duplicateOfRetained,plannedAt:new Date().toISOString()}; batch.candidates=selected;
await fs.writeFile(path.resolve(batchPath),`${JSON.stringify(batch,null,2)}\n`); console.log(JSON.stringify({slotBudgetPlan:"passed",retainedCount,retainedIrishCount,missingSlots,irishNeeded,selectedIrishCount,paidAttemptLimit:missingSlots,replacementPaidAttempts:0,selectedIds:batch.slotBudgetPlan.selectedIds,excludedPreviouslyPaidIds:[...paidAttemptedIds],explicitExcludedIds:[...explicitExclusions],duplicateOfRetained,reservedUsd:Number(budget?.reservedUsd||0),normalTargetUsd:NORMAL_TARGET_USD,dailyCeilingUsd:DAILY_CEILING_USD,rejectedByFreshness:freshness.rejected.length},null,2));
