import fs from "node:fs/promises";
import path from "node:path";

const registryPath = process.env.EDITORIAL_SOURCE_REGISTRY || "data/editorial-sources/source-registry.json";
const outputPath = process.env.CURRENT_SOURCE_DISCOVERY_PATH || "data/editorial-acquisition/current-source-discovery.json";
const maxAgeHours = Number(process.env.DISCOVERY_MAX_AGE_HOURS || 36);
const perSourceLimit = Number(process.env.DISCOVERY_PER_SOURCE_LIMIT || 8);
const now = new Date();

const registry = JSON.parse(await fs.readFile(path.resolve(registryPath), "utf8"));
const sources = (registry.sources || []).filter((source) => source.allowDiscovery === true);
if (!sources.length) throw new Error("Current-source discovery fail-closed: source registry has no discovery-enabled sources.");

function decodeXml(value = "") {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function tag(block, name) {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"));
  return decodeXml(match?.[1] || "");
}
function parseItems(xml) {
  return [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].map((match) => ({
    title: tag(match[1], "title"), link: tag(match[1], "link"), description: tag(match[1], "description"), publishedAt: tag(match[1], "pubDate"),
  })).filter((item) => item.title && item.link);
}
function withinWindow(value) {
  const time = Date.parse(value);
  return Number.isFinite(time) && now.getTime() - time >= 0 && now.getTime() - time <= maxAgeHours * 3600000;
}
function cleanTitle(title) {
  return title.replace(/\s+-\s+[^-]{2,80}$/, "").trim();
}
function identity(item) {
  const title = cleanTitle(item.title);
  return { subject: title, development: item.description || title, angle: `Current development: ${title}`, occurredAt: new Date(item.publishedAt).toISOString() };
}

const results = [];
for (const source of sources.sort((a, b) => (b.ownerPriority || 0) - (a.ownerPriority || 0))) {
  const query = encodeURIComponent(`rugby site:${source.domain} when:1d`);
  const feedUrl = `https://news.google.com/rss/search?q=${query}&hl=en-IE&gl=IE&ceid=IE:en`;
  try {
    const response = await fetch(feedUrl, { headers: { "user-agent": "TheRugbyPanda/1.0 current-source-discovery" }, signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const items = parseItems(await response.text()).filter((item) => withinWindow(item.publishedAt)).slice(0, perSourceLimit);
    results.push({ source: { name: source.name, domain: source.domain, tier: source.tier, ownerPriority: source.ownerPriority, defaultEvidenceRole: source.defaultEvidenceRole }, status: "ok", feedUrl, items: items.map((item, index) => ({ id: `${source.domain}-${Date.parse(item.publishedAt)}-${index + 1}`, ...item, editorialPosition: identity(item) })) });
  } catch (error) {
    results.push({ source: { name: source.name, domain: source.domain, tier: source.tier, ownerPriority: source.ownerPriority }, status: "fetch-failed", error: error instanceof Error ? error.message : String(error), items: [] });
  }
}

const leads = results.flatMap((result) => result.items.map((item) => ({ ...item, source: result.source }))).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
const successfulSources = results.filter((result) => result.status === "ok").length;
if (successfulSources < 2 || leads.length < 5) throw new Error(`Current-source discovery fail-closed: only ${successfulSources} sources and ${leads.length} current leads available.`);

const output = { schemaVersion: "1.0", discoveredAt: now.toISOString(), maxAgeHours, registryUpdatedAt: registry.updatedAt, successfulSources, failedSources: results.length - successfulSources, leadCount: leads.length, leads, sourceRuns: results };
await fs.mkdir(path.dirname(path.resolve(outputPath)), { recursive: true });
await fs.writeFile(path.resolve(outputPath), `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ currentSourceDiscovery: "passed", successfulSources, failedSources: output.failedSources, leadCount: leads.length, outputPath }, null, 2));