import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";
import { isCurrentPackageEditorialInputId } from "../lib/editorial/CurrentPackageIdentity.ts";
import { namedPeople, recognisedTeams, specificTokens } from "../lib/editorial/OfficialVideoRelevance.ts";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const outputPath = path.resolve(process.env.STRICT_IMAGE_REPORT || "data/editorial-media/current-strict-image-readiness.json");
const PACKAGE_SIZE = 5;
if (!projectId || !token) throw new Error("Strict image assignment requires Sanity project ID and token.");

function operationalDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Dublin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
function textOfBlock(block) { return (block?.children ?? []).map((child) => child?.text ?? "").join(" ").trim(); }
function articleText(article) { return [article.title, article.standfirst, ...(article.body ?? []).filter((block) => block?._type === "block").map(textOfBlock)].filter(Boolean).join(" "); }
function imageText(image) { return [image.title,image.altText,image.caption,image.subject,image.team,image.competitionEvent,...(Array.isArray(image.people)?image.people:[])].filter(Boolean).join(" "); }
function norm(value="") { return String(value).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9' -]+/g," ").replace(/\s+/g," ").trim(); }
function imagePeople(image) {
  if (Array.isArray(image.people) && image.people.length) return [...new Set(image.people.map(String).filter(Boolean))];
  return namedPeople(imageText(image));
}
function scoreImage(article, image) {
  if (!image?.assetRef) return Number.NEGATIVE_INFINITY;
  const story = articleText(article); const storyLower=norm(story); const imageLower=norm(imageText(image));
  const storyPeople=namedPeople(story); const candidatePeople=imagePeople(image);
  const conflictingPeople=candidatePeople.filter((person)=>!storyLower.includes(norm(person)));
  if (conflictingPeople.length) return Number.NEGATIVE_INFINITY;
  const exactPeople=storyPeople.filter((person)=>imageLower.includes(norm(person)));
  const storyTeams=recognisedTeams(story); const imageTeams=recognisedTeams(imageText(image));
  if (imageTeams.length && storyTeams.length && imageTeams.some((team)=>!storyTeams.includes(team))) return Number.NEGATIVE_INFINITY;
  if (imageTeams.length && !storyTeams.length) return Number.NEGATIVE_INFINITY;
  const teamOverlap=storyTeams.filter((team)=>imageTeams.includes(team));
  const shared=specificTokens(`${article.title ?? ""} ${article.standfirst ?? ""}`).filter((token)=>imageLower.includes(token));
  // Named-person images must be exact; anonymous/team images are allowed only when the team is directly relevant.
  if (candidatePeople.length > 0 && exactPeople.length === 0) return Number.NEGATIVE_INFINITY;
  if (exactPeople.length === 0 && teamOverlap.length === 0 && shared.length < 2) return Number.NEGATIVE_INFINITY;
  return exactPeople.length*100 + teamOverlap.length*40 + Math.min(shared.length,5)*8 + (candidatePeople.length===0 && teamOverlap.length>0 ? 10 : 0);
}
function portableImage(image, withKey=true) {
  const value={ _type:"image", asset:{_type:"reference",_ref:image.assetRef}, alt:image.altText ?? image.title ?? "Relevant rugby editorial image", caption:image.caption, photographer:image.publicCredit ?? image.creditLine ?? image.photographer, source:image.source ?? image.sourceName, rights:[image.copyrightLine ?? image.copyright,image.rightsNotes].filter(Boolean).join(" — ") || undefined };
  if(withKey) value._key=crypto.randomUUID().replaceAll("-","").slice(0,12);
  return value;
}
function insertInline(body, image) {
  const textOnly=(body ?? []).filter((block)=>block?._type!=="image");
  let textBlocks=0, insertAt=textOnly.length;
  for(let i=0;i<textOnly.length;i+=1){ if(textOnly[i]?._type==="block") textBlocks+=1; if(textBlocks>=3){insertAt=i+1;break;} }
  const next=[...textOnly]; next.splice(insertAt,0,portableImage(image,true)); return next;
}

const packageDate=operationalDate();
const client=createClient({projectId,dataset,apiVersion,token,useCdn:false,perspective:"raw"});
const rawArticles=await client.fetch(`*[_type=="article" && _id in path("drafts.**") && morningPackageEligible==true && coalesce(automationContentClass,"production")=="production"] | order(coalesce(editorialGeneratedAt,_createdAt) asc){_id,title,standfirst,body,editorialInputId,"featuredAsset":featuredImage.asset._ref}`);
const articles=(Array.isArray(rawArticles)?rawArticles:[]).filter((article)=>isCurrentPackageEditorialInputId(article.editorialInputId,packageDate));
if(articles.length<1||articles.length>PACKAGE_SIZE||new Set(articles.map((article)=>article.editorialInputId)).size!==articles.length) throw new Error(`Strict image assignment requires 1-${PACKAGE_SIZE} unique current-day drafts; found ${articles.length}.`);
const images=await client.fetch(`*[_type=="editorialImage" && !(_id in path("drafts.**")) && usageApproved==true && lifecycleStatus in ["approved","published"]]{_id,title,altText,caption,subject,team,people,competitionEvent,publicCredit,creditLine,photographer,copyrightLine,copyright,source,sourceName,rightsNotes,"assetRef":image.asset._ref}`);
const used=new Set(); const report=[];
for(const article of articles){
  const ranked=(Array.isArray(images)?images:[]).map((image)=>({image,score:scoreImage(article,image)})).filter((item)=>Number.isFinite(item.score)&&item.score>=40&&!used.has(item.image.assetRef)).sort((a,b)=>b.score-a.score);
  const hero=ranked[0]?.image; const inline=ranked.find((item)=>item.image.assetRef!==hero?.assetRef)?.image;
  if(!hero||!inline){ report.push({articleId:article._id,editorialInputId:article.editorialInputId,title:article.title,status:"blocked-insufficient-strict-images",candidateCount:ranked.length}); continue; }
  used.add(hero.assetRef); used.add(inline.assetRef);
  const featured=portableImage(hero,false); const body=insertInline(article.body,inline);
  await client.patch(article._id).set({featuredImage:featured,body}).commit();
  const verified=await client.fetch(`*[_id==$id][0]{"featuredAsset":featuredImage.asset._ref,"inlineAssets":body[_type=="image"].asset._ref}`,{id:article._id});
  const ok=verified?.featuredAsset===hero.assetRef && Array.isArray(verified?.inlineAssets) && verified.inlineAssets.includes(inline.assetRef);
  report.push({articleId:article._id,editorialInputId:article.editorialInputId,title:article.title,status:ok?"applied-and-readback-verified":"readback-failed",hero:{imageId:hero._id,assetRef:hero.assetRef,title:hero.title,team:hero.team,people:hero.people??[]},inline:{imageId:inline._id,assetRef:inline.assetRef,title:inline.title,team:inline.team,people:inline.people??[]}});
  if(!ok) throw new Error(`Strict image readback failed for ${article.editorialInputId}.`);
}
const ready=report.filter((item)=>item.status==="applied-and-readback-verified");
const result={generatedAt:new Date().toISOString(),packageDate,requiredArticleCount:PACKAGE_SIZE,currentArticleCount:articles.length,ready:ready.length,blocked:report.length-ready.length,fullPackageImageReady:articles.length===PACKAGE_SIZE&&ready.length===PACKAGE_SIZE,articles:report,failClosedPerArticle:true};
await fs.mkdir(path.dirname(outputPath),{recursive:true}); await fs.writeFile(outputPath,`${JSON.stringify(result,null,2)}\n`); console.log(JSON.stringify(result,null,2));
