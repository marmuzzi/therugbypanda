import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";
import { isCurrentPackageEditorialInputId } from "../lib/editorial/CurrentPackageIdentity.ts";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const rulesPath = path.resolve(process.env.VERIFIED_STORY_EMBED_OVERRIDES ?? "data/editorial-media/verified-story-embed-overrides.json");
const outputPath = path.resolve(process.env.VERIFIED_STORY_EMBED_REPORT ?? "data/editorial-media/current-verified-story-embed-overrides.json");

if (!projectId || !token) throw new Error("Verified story embed overrides require Sanity project ID and token.");

function operationalDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Dublin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
function textOf(block) {
  return (block?.children ?? []).map((child) => child?.text ?? "").join(" ");
}
function storyText(article) {
  return [
    article.title,
    article.standfirst,
    article.editorialAngle,
    article.sourceStoryTitle,
    ...(article.body ?? []).filter((item) => item?._type === "block").map(textOf),
  ].filter(Boolean).join(" ").toLowerCase();
}
function existingOfficialEmbed(article) {
  return (article.socialEmbeds ?? []).find((embed) => embed?.isOfficialSource === true && /^https:\/\//i.test(String(embed?.url ?? "")));
}
function insertEmbed(body, embed) {
  const next = [...(body ?? [])];
  if (next.some((item) => item?._type === "socialEmbed" && item?.url === embed.url)) return next;
  let blockCount = 0;
  let insertAt = next.length;
  for (let index = 0; index < next.length; index += 1) {
    if (next[index]?._type === "block") blockCount += 1;
    if (blockCount >= 2) { insertAt = index + 1; break; }
  }
  next.splice(insertAt, 0, embed);
  return next;
}
function stableKey(ruleId, articleId) {
  const seed = `${ruleId}:${articleId}`.replace(/[^a-zA-Z0-9]/g, "");
  return `verifiedembed${seed.slice(-18)}`;
}
function matchingRule(article, rules) {
  const text = storyText(article);
  return rules.find((rule) => Array.isArray(rule.matchAll) && rule.matchAll.length > 0 && rule.matchAll.every((term) => text.includes(String(term).toLowerCase())));
}

const config = JSON.parse(await fs.readFile(rulesPath, "utf8"));
if (config?.schemaVersion !== "1.0" || !Array.isArray(config.rules)) throw new Error("Verified story embed override registry is invalid.");

const packageDate = operationalDate();
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
const eligible = await client.fetch(`*[
  _type == "article" && _id in path("drafts.**") && morningPackageEligible == true &&
  coalesce(automationContentClass, "production") == "production" &&
  (!defined(workflowStatus) || workflowStatus in ["draft","submitted","in-review","review","under-review","approved"])
] | order(coalesce(editorialGeneratedAt,_updatedAt) asc) {
  _id,title,standfirst,editorialAngle,sourceStoryTitle,editorialInputId,body,
  "socialEmbeds":body[_type=="socialEmbed"]{platform,url,sourceLabel,isOfficialSource}
}`);
const articles = (Array.isArray(eligible) ? eligible : []).filter((article) => isCurrentPackageEditorialInputId(article.editorialInputId, packageDate));

const report = [];
for (const article of articles) {
  const existing = existingOfficialEmbed(article);
  if (existing) {
    report.push({ articleId: article._id, editorialInputId: article.editorialInputId, title: article.title, status: "existing-official-embed", url: existing.url, sourceLabel: existing.sourceLabel });
    continue;
  }
  const rule = matchingRule(article, config.rules);
  if (!rule) {
    report.push({ articleId: article._id, editorialInputId: article.editorialInputId, title: article.title, status: "no-exact-override" });
    continue;
  }
  const embed = {
    _type: "socialEmbed",
    _key: stableKey(rule.id, article._id),
    platform: rule.platform,
    url: rule.url,
    caption: rule.caption,
    sourceLabel: rule.sourceLabel,
    isOfficialSource: true,
  };
  const body = insertEmbed(article.body, embed);
  await client.patch(article._id).set({ body }).commit();
  const readback = await client.fetch(`*[_id==$id][0]{"embeds":body[_type=="socialEmbed"]{url,sourceLabel,isOfficialSource}}`, { id: article._id });
  const verified = (readback?.embeds ?? []).some((item) => item.url === rule.url && item.sourceLabel === rule.sourceLabel && item.isOfficialSource === true);
  report.push({ articleId: article._id, editorialInputId: article.editorialInputId, title: article.title, status: verified ? "applied-and-readback-verified" : "readback-failed", ruleId: rule.id, url: rule.url, sourceLabel: rule.sourceLabel });
  if (!verified) throw new Error(`Verified story embed readback failed for ${article._id}.`);
}

const result = { generatedAt: new Date().toISOString(), packageDate, articleCount: articles.length, rules: config.rules.length, articles: report, failClosedOnMutation: true };
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
