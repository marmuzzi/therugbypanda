import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";
import { isCurrentPackageEditorialInputId } from "../lib/editorial/CurrentPackageIdentity.ts";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const rulesPath = path.resolve(process.env.VERIFIED_STORY_EMBED_OVERRIDES ?? "data/editorial-media/verified-story-embed-overrides.json");
const outputPath = path.resolve(process.env.EMBED_FIRST_LOCAL_MEDIA_REPORT ?? "data/editorial-media/current-embed-first-local-media-removal.json");

if (!projectId || !token) throw new Error("Embed-first local-media cleanup requires Sanity project ID and token.");

function operationalDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Dublin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
function textOf(block) {
  return (block?.children ?? []).map((child) => child?.text ?? "").join(" ");
}
function storyText(article) {
  return [article.title, article.standfirst, article.editorialAngle, article.sourceStoryTitle, ...(article.body ?? []).filter((item) => item?._type === "block").map(textOf)].filter(Boolean).join(" ").toLowerCase();
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
  "featuredAsset":featuredImage.asset._ref,
  "inlineImageCount":count(body[_type=="image"]),
  "socialEmbeds":body[_type=="socialEmbed"]{url,sourceLabel,isOfficialSource}
}`);
const articles = (Array.isArray(eligible) ? eligible : []).filter((article) => isCurrentPackageEditorialInputId(article.editorialInputId, packageDate));
const report = [];

for (const article of articles) {
  const rule = matchingRule(article, config.rules);
  if (!rule) continue;
  const exactEmbedPresent = (article.socialEmbeds ?? []).some((embed) => embed?.isOfficialSource === true && embed?.url === rule.url && embed?.sourceLabel === rule.sourceLabel);
  if (!exactEmbedPresent) throw new Error(`Refusing to remove local media from ${article._id}: exact verified embed is not present.`);

  const body = (article.body ?? []).filter((item) => item?._type !== "image");
  let patch = client.patch(article._id).set({ body });
  if (article.featuredAsset) patch = patch.unset(["featuredImage"]);
  await patch.commit();

  const readback = await client.fetch(`*[_id==$id][0]{"featuredAsset":featuredImage.asset._ref,"inlineImageCount":count(body[_type=="image"]),"embeds":body[_type=="socialEmbed"]{url,sourceLabel,isOfficialSource}}`, { id: article._id });
  const embedVerified = (readback?.embeds ?? []).some((embed) => embed?.url === rule.url && embed?.sourceLabel === rule.sourceLabel && embed?.isOfficialSource === true);
  const clean = !readback?.featuredAsset && Number(readback?.inlineImageCount ?? 0) === 0 && embedVerified;
  if (!clean) throw new Error(`Embed-first local media cleanup readback failed for ${article._id}.`);
  report.push({ articleId: article._id, editorialInputId: article.editorialInputId, title: article.title, ruleId: rule.id, removedFeaturedImage: Boolean(article.featuredAsset), removedInlineImageCount: Number(article.inlineImageCount ?? 0), embedUrl: rule.url, status: "embed-only-readback-verified" });
}

const result = { generatedAt: new Date().toISOString(), packageDate, cleanedArticleCount: report.length, articles: report, policy: "exact official embed replaces weak local imagery" };
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
