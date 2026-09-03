import fs from "node:fs/promises";
import path from "node:path";

const registryPath = process.env.EDITORIAL_SOURCE_REGISTRY || "data/editorial-sources/source-registry.json";
const outputPath = process.env.CURRENT_SOURCE_DISCOVERY_PATH || "data/editorial-acquisition/current-source-discovery.json";
const maxAgeHours = Number(process.env.DISCOVERY_MAX_AGE_HOURS || 36);
// The morning package must survive Publication Review rejection without weakening review.
// Use a wider but still bounded no-model discovery pass so same-day recovery has reserve stories.
const perSourceLimit = Number(process.env.DISCOVERY_PER_SOURCE_LIMIT || 12);
const corroborationSeedLimit = Number(process.env.DISCOVERY_CORROBORATION_SEED_LIMIT || 48);
const corroborationPerSeedLimit = Number(process.env.DISCOVERY_CORROBORATION_PER_SEED_LIMIT || 8);
const now = new Date();
const googleWindowDays = maxAgeHours > 24 ? 2 : 1;

const registry = JSON.parse(await fs.readFile(path.resolve(registryPath), "utf8"));
const sources = (registry.sources || []).filter((source) => source.allowDiscovery === true);
if (!sources.length) throw new Error("Current-source discovery fail-closed: source registry has no discovery-enabled sources.");

const rugbySignals = /\b(rugby|union|irfu|rfu|urc|united rugby championship|six nations|champions cup|challenge cup|epcr|leinster|munster|ulster|connacht|springboks?|all blacks?|wallabies|pumas|test match|test series|rugby championship|fly[- ]?half|out[- ]?half|scrum[- ]?half|scrum|lineout|try|conversion|prop|hooker|lock|flanker|back[- ]?row|centre|winger|full[- ]?back|squad|captain|coach)\b/i;
const explicitNonRugby = /\b(boxing|boxer|fight week|ringwalk|golf|superbike|motorbike|cycling|cyclist|5k|athletics|hurling|camogie|gaa|gaelic football|soccer|premier league|formula one|f1|katie taylor|loi|league of ireland|solheim|vuelta)\b/i;
const genericSeedPatterns = [
  /^the\s*42(?:\s*-\s*the\s*42)?$/i,
  /^[-\s]*rugby football union$/i,
  /^[-\s]*united rugby championship(?:\s*-\s*united rugby championship)?$/i,
  /^resource library\s*-\s*irish rugby$/i,
  /^discipline\s*-\s*irish rugby$/i,
  /^inside sport\b/i,
  /\bnews, squad & players\b/i,
];
const queryStop = new Set(["the","rugby","irish","ireland","england","new","south","north","united","championship","bbc","planet","business","post","times","independent","sport","sports","news","all","blacks","springboks","wallabies","leinster","munster","ulster","connacht","global","series"]);

function decodeXml(value = "") {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function tag(block, name) {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"));
  return decodeXml(match?.[1] || "");
}
function sourceTag(block) {
  const match = block.match(/<source(?:\s+url="([^"]+)")?[^>]*>([\s\S]*?)<\/source>/i);
  if (!match) return { name: "", url: "" };
  return { name: decodeXml(match[2] || ""), url: decodeXml(match[1] || "") };
}
function parseItems(xml) {
  return [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].map((match) => ({
    title: tag(match[1], "title"), link: tag(match[1], "link"), description: tag(match[1], "description"), publishedAt: tag(match[1], "pubDate"), googleSource: sourceTag(match[1]),
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
function canonicalDomain(value = "") {
  try { return new URL(value).hostname.toLowerCase().replace(/^www\./, ""); } catch { return String(value || "").toLowerCase().replace(/^www\./, ""); }
}
function registrySourceForDomain(value = "") {
  const domain = canonicalDomain(value);
  return sources.find((source) => domain === canonicalDomain(source.domain) || domain.endsWith(`.${canonicalDomain(source.domain)}`));
}
function sourceSnapshot(source) {
  return { name: source.name, domain: source.domain, tier: source.tier, ownerPriority: source.ownerPriority, defaultEvidenceRole: source.defaultEvidenceRole };
}
function dedupeKey(item, source) {
  return `${canonicalDomain(source?.domain)}|${cleanTitle(item.title).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()}`;
}
function isRugbySeed(lead) {
  const title = cleanTitle(lead.title);
  const text = `${title} ${lead.description || ""}`;
  if (title.length < 24 || genericSeedPatterns.some((pattern) => pattern.test(title))) return false;
  if (explicitNonRugby.test(text)) return false;
  return rugbySignals.test(text);
}
function queryTitle(title = "") {
  return cleanTitle(title).replace(/^[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]{2,}\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]{2,}:\s*/, "");
}
function seedQuery(title = "") {
  const cleaned = queryTitle(title).replace(/[“”"'‘’]/g, " ").replace(/\s+/g, " ").trim();
  const fullNames = cleaned.match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]{2,}\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]{2,}\b/g) ?? [];
  for (const name of fullNames) {
    const parts = name.toLowerCase().split(/\s+/);
    if (parts.some((part) => queryStop.has(part))) continue;
    return `"${name}"`;
  }
  const proper = (cleaned.match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]{3,}\b/g) ?? [])
    .filter((token) => !queryStop.has(token.toLowerCase()))
    .slice(0, 3);
  if (proper.length) return proper.join(" ");
  const words = cleaned.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((word) => word.length >= 5 && !queryStop.has(word)).slice(0, 4);
  return words.join(" ");
}

const results = [];
for (const source of sources.sort((a, b) => (b.ownerPriority || 0) - (a.ownerPriority || 0))) {
  const query = encodeURIComponent(`rugby site:${source.domain} when:${googleWindowDays}d`);
  const feedUrl = `https://news.google.com/rss/search?q=${query}&hl=en-IE&gl=IE&ceid=IE:en`;
  try {
    const response = await fetch(feedUrl, { headers: { "user-agent": "TheRugbyPanda/1.0 current-source-discovery" }, signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const items = parseItems(await response.text()).filter((item) => withinWindow(item.publishedAt)).slice(0, perSourceLimit);
    results.push({ source: sourceSnapshot(source), status: "ok", feedUrl, items: items.map((item, index) => ({ id: `${source.domain}-${Date.parse(item.publishedAt)}-${index + 1}`, title: item.title, link: item.link, description: item.description, publishedAt: item.publishedAt, editorialPosition: identity(item) })) });
  } catch (error) {
    results.push({ source: { name: source.name, domain: source.domain, tier: source.tier, ownerPriority: source.ownerPriority }, status: "fetch-failed", error: error instanceof Error ? error.message : String(error), items: [] });
  }
}

const rawInitialLeads = results.flatMap((result) => result.items.map((item) => ({ ...item, source: result.source }))).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
const initialSeen = new Set();
const initialLeads = rawInitialLeads.filter((lead) => {
  const key = dedupeKey(lead, lead.source);
  if (initialSeen.has(key)) return false;
  initialSeen.add(key);
  return true;
});
const seen = new Set(initialLeads.map((lead) => dedupeKey(lead, lead.source)));
const querySeen = new Set();
const corroborationSeeds = [];
for (const lead of initialLeads) {
  if (!isRugbySeed(lead)) continue;
  const q = seedQuery(lead.title);
  const key = q.toLowerCase();
  if (!q || querySeen.has(key)) continue;
  querySeen.add(key);
  corroborationSeeds.push({ ...lead, corroborationQuery: q });
  if (corroborationSeeds.length >= corroborationSeedLimit) break;
}

const corroborationRuns = await Promise.all(corroborationSeeds.map(async (seed, seedIndex) => {
  const q = seed.corroborationQuery;
  const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(`${q} rugby when:${googleWindowDays}d`)}&hl=en-IE&gl=IE&ceid=IE:en`;
  try {
    const response = await fetch(feedUrl, { headers: { "user-agent": "TheRugbyPanda/1.0 current-source-corroboration" }, signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const parsed = parseItems(await response.text()).filter((item) => withinWindow(item.publishedAt));
    const items = [];
    for (const item of parsed) {
      const matchedSource = registrySourceForDomain(item.googleSource?.url);
      if (!matchedSource) continue;
      if (canonicalDomain(matchedSource.domain) === canonicalDomain(seed.source?.domain)) continue;
      const key = dedupeKey(item, matchedSource);
      if (seen.has(key)) continue;
      seen.add(key);
      items.push({
        id: `corroboration-${seedIndex + 1}-${matchedSource.domain}-${Date.parse(item.publishedAt)}-${items.length + 1}`,
        title: item.title,
        link: item.link,
        description: item.description,
        publishedAt: item.publishedAt,
        editorialPosition: identity(item),
        source: sourceSnapshot(matchedSource),
        corroborationSeedId: seed.id,
      });
      if (items.length >= corroborationPerSeedLimit) break;
    }
    return { seedId: seed.id, query: q, status: "ok", feedUrl, items };
  } catch (error) {
    return { seedId: seed.id, query: q, status: "fetch-failed", feedUrl, error: error instanceof Error ? error.message : String(error), items: [] };
  }
}));

const corroborationLeads = corroborationRuns.flatMap((run) => run.items || []);
const leads = [...initialLeads, ...corroborationLeads].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
const successfulSources = results.filter((result) => result.status === "ok").length;
if (successfulSources < 2 || leads.length < 5) throw new Error(`Current-source discovery fail-closed: only ${successfulSources} sources and ${leads.length} current leads available.`);

const output = {
  schemaVersion: "1.0",
  discoveredAt: now.toISOString(),
  maxAgeHours,
  registryUpdatedAt: registry.updatedAt,
  successfulSources,
  failedSources: results.length - successfulSources,
  leadCount: leads.length,
  initialLeadCount: initialLeads.length,
  corroborationLeadCount: corroborationLeads.length,
  corroborationSeedCount: corroborationSeeds.length,
  discoveryLimits: { perSourceLimit, corroborationSeedLimit, corroborationPerSeedLimit },
  leads,
  sourceRuns: results,
  corroborationRuns,
};
await fs.mkdir(path.dirname(path.resolve(outputPath)), { recursive: true });
await fs.writeFile(path.resolve(outputPath), `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ currentSourceDiscovery: "passed", successfulSources, failedSources: output.failedSources, leadCount: leads.length, initialLeadCount: initialLeads.length, corroborationLeadCount: corroborationLeads.length, corroborationSeedCount: corroborationSeeds.length, discoveryLimits: output.discoveryLimits, maxAgeHours, googleWindowDays, outputPath }, null, 2));