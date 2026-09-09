import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";
import { isCurrentPackageEditorialInputId } from "../lib/editorial/CurrentPackageIdentity.ts";
import { scoreOfficialVideo } from "../lib/editorial/OfficialVideoRelevance.ts";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const registryPath = path.resolve(process.env.OFFICIAL_VIDEO_SOURCE_REGISTRY ?? "data/editorial-media/official-video-sources.json");
const outputPath = path.resolve(process.env.OFFICIAL_VIDEO_EMBED_REPORT ?? "data/editorial-media/current-official-video-embed-readiness.json");
const MAX_VIDEO_AGE_DAYS = Math.max(1, Number.parseInt(process.env.OFFICIAL_VIDEO_MAX_AGE_DAYS ?? "30", 10) || 30);

if (!projectId || !token) throw new Error("Official video acquisition requires Sanity project ID and token.");

function operationalDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Dublin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
function cleanXml(value = "") {
  return String(value).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
}
function parseYouTubeFeed(xml) {
  const entries = [];
  for (const match of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const entry = match[1];
    const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]?.trim();
    const title = cleanXml(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
    const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1]?.trim();
    if (videoId && title) entries.push({ videoId, title, publishedAt });
  }
  return entries;
}
function storyText(article) {
  return [article.title, article.standfirst, article.editorialAngle, article.sourceStoryTitle].filter(Boolean).join(" ").toLowerCase();
}
function relevantSources(article, sources) {
  const lower = storyText(article);
  return sources.filter((source) => Array.isArray(source.terms) && source.terms.some((term) => lower.includes(String(term).toLowerCase())));
}
function withinAge(publishedAt) {
  const time = Date.parse(publishedAt ?? "");
  return Number.isFinite(time) && Date.now() - time <= MAX_VIDEO_AGE_DAYS * 86_400_000 && time <= Date.now() + 3_600_000;
}
function existingVerifiedEmbed(article) {
  return (article.socialEmbeds ?? []).find((embed) => embed?.isOfficialSource === true && /^https:\/\//i.test(String(embed?.url ?? "")) && String(embed?.sourceLabel ?? "").trim());
}
function insertEmbed(body, embed) {
  if ((body ?? []).some((item) => item?._type === "socialEmbed" && item?.url === embed.url)) return body;
  const next = [...(body ?? [])];
  let blocks = 0;
  let insertAt = next.length;
  for (let index = 0; index < next.length; index += 1) {
    if (next[index]?._type === "block") blocks += 1;
    if (blocks >= 3) { insertAt = index + 1; break; }
  }
  next.splice(insertAt, 0, embed);
  return next;
}
function stableKey(articleId, videoId) {
  const seed = `${articleId}:${videoId}`.replace(/[^a-zA-Z0-9]/g, "");
  return `officialvideo${seed.slice(-20)}`;
}

const registry = JSON.parse(await fs.readFile(registryPath, "utf8"));
if (registry?.schemaVersion !== "1.0" || !Array.isArray(registry.sources) || registry.sources.length === 0) throw new Error("Official video source registry is invalid.");
const packageDate = operationalDate();
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
const eligible = await client.fetch(`*[
  _type == "article" && _id in path("drafts.**") && morningPackageEligible == true &&
  coalesce(automationContentClass, "production") == "production" &&
  (!defined(workflowStatus) || workflowStatus in ["draft","submitted","in-review","review","under-review","approved"])
] | order(coalesce(editorialGeneratedAt,_updatedAt) desc) {
  _id,title,standfirst,editorialAngle,sourceStoryTitle,editorialInputId,workflowStatus,body,
  "socialEmbeds":body[_type=="socialEmbed"]{platform,url,sourceLabel,isOfficialSource}
}`);
const articles = (Array.isArray(eligible) ? eligible : []).filter((article) => isCurrentPackageEditorialInputId(article.editorialInputId, packageDate));
if (articles.length !== 5 || new Set(articles.map((article) => article.editorialInputId)).size !== 5) {
  throw new Error(`Mandatory embed acquisition requires exactly five unique ${packageDate} package drafts; found ${articles.length}.`);
}

const feedCache = new Map();
async function videosFor(source) {
  if (feedCache.has(source.channelId)) return feedCache.get(source.channelId);
  const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(source.channelId)}`, { headers: { "user-agent": "TheRugbyPanda/1.0 editorial-media" } });
  if (!response.ok) throw new Error(`Official YouTube feed ${source.sourceLabel} failed (${response.status}).`);
  const videos = parseYouTubeFeed(await response.text()).filter((video) => withinAge(video.publishedAt));
  feedCache.set(source.channelId, videos);
  return videos;
}

const report = [];
for (const article of articles) {
  const existing = existingVerifiedEmbed(article);
  if (existing) {
    report.push({ articleId: article._id, editorialInputId: article.editorialInputId, title: article.title, status: "existing-verified-official-embed", sourceLabel: existing.sourceLabel, url: existing.url });
    continue;
  }

  const sources = relevantSources(article, registry.sources);
  const candidates = [];
  for (const source of sources) {
    const videos = await videosFor(source);
    for (const video of videos) {
      const relevance = scoreOfficialVideo(article, { title: video.title, publishedAt: video.publishedAt, sourceLabel: source.sourceLabel });
      if (relevance.passed) candidates.push({ source, video, relevance });
    }
  }
  candidates.sort((a, b) => b.relevance.score - a.relevance.score || Date.parse(b.video.publishedAt ?? "") - Date.parse(a.video.publishedAt ?? ""));
  const selected = candidates[0];
  if (!selected) {
    report.push({ articleId: article._id, editorialInputId: article.editorialInputId, title: article.title, status: "blocked-no-story-specific-official-video", checkedSources: sources.map((source) => source.sourceLabel) });
    continue;
  }

  const embed = {
    _type: "socialEmbed",
    _key: stableKey(article._id, selected.video.videoId),
    platform: "youtube",
    url: `https://www.youtube.com/watch?v=${selected.video.videoId}`,
    caption: `Official ${selected.source.sourceLabel} video: ${selected.video.title}`,
    sourceLabel: selected.source.sourceLabel,
    isOfficialSource: true,
  };
  const body = insertEmbed(article.body, embed);
  await client.patch(article._id).set({ body }).commit();
  const readback = await client.fetch(`*[_id==$id][0]{"embeds":body[_type=="socialEmbed"]{url,sourceLabel,isOfficialSource}}`, { id: article._id });
  const verified = (readback?.embeds ?? []).some((item) => item.url === embed.url && item.isOfficialSource === true && item.sourceLabel === embed.sourceLabel);
  report.push({ articleId: article._id, editorialInputId: article.editorialInputId, title: article.title, status: verified ? "applied-and-readback-verified" : "readback-failed", sourceLabel: embed.sourceLabel, url: embed.url, videoTitle: selected.video.title, relevanceScore: selected.relevance.score, relevance: selected.relevance });
  if (!verified) throw new Error(`Official video readback verification failed for ${article._id}.`);
}

const ready = report.filter((item) => ["existing-verified-official-embed", "applied-and-readback-verified"].includes(item.status));
const result = { generatedAt: new Date().toISOString(), packageDate, required: 5, ready: ready.length, blocked: report.length - ready.length, maxVideoAgeDays: MAX_VIDEO_AGE_DAYS, articles: report, failClosed: true };
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (ready.length !== 5) throw new Error(`Mandatory official video gate fail-closed: only ${ready.length}/5 current articles have verified story-specific official embeds.`);
