import { writeFileSync } from "node:fs";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("Sanity production credentials are required.");

function dublinDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Dublin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
async function query(groq, params = {}) {
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set("query", groq);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(`$${key}`, JSON.stringify(value));
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`Sanity query failed ${response.status}: ${await response.text()}`);
  return (await response.json()).result;
}

const date = dublinDate();
const prefix = `current-${date}-*`;
const articles = await query(`*[_type == "article" && _id in path("drafts.**") && morningPackageEligible == true && automationContentClass == "production" && editorialInputId match $prefix] | order(_updatedAt desc)[0...5]{
  _id,title,standfirst,editorialInputId,editorialStyleProfile,reviewStatus,
  "featuredImage": {"assetRef":featuredImage.asset._ref,"alt":featuredImage.alt,"caption":featuredImage.caption,"source":featuredImage.source,"rights":featuredImage.rights,"photographer":featuredImage.photographer},
  "inlineImages":body[_type == "image"]{"assetRef":asset._ref,"alt":alt,"caption":caption,"source":source,"rights":rights},
  "headingCount":count(body[_type == "block" && style == "h2"]),
  "headings":body[_type == "block" && style == "h2"]{ "text":pt::text(@) }
}`, { prefix });

const heroRefs = articles.map((article) => article.featuredImage?.assetRef).filter(Boolean);
const heroLibraryMatches = await query(`*[_type == "editorialImage" && image.asset._ref in $refs]{_id,title,altText,caption,subject,team,event,usageApproved,lifecycleStatus,source,sourceName,rightsNotes,"assetRef":image.asset._ref}`, { refs: heroRefs });

const brandAssets = await query(`*[_type == "brandAsset"] | order(title asc){
  _id,title,shortName,brandType,country,lifecycleStatus,approvedForEditorialUse,rightsStatus,rightsHolder,sourceUrl,externalLogoUrl,
  "primaryLogoAsset":primaryLogo.asset._ref,"lightLogoAsset":lightLogo.asset._ref,"darkLogoAsset":darkLogo.asset._ref,
  candidateLogoUrls
}`);

const coreBrandPatterns = [
  /Ireland/i,/Leinster/i,/Munster/i,/Ulster/i,/Connacht/i,
  /South Africa|Springbok/i,/New Zealand|All Black/i,/England/i,/France/i,/Scotland/i,/Wales/i,/Italy/i,/Australia|Wallab/i,/Argentina|Puma/i,
  /United Rugby Championship|URC/i,/Six Nations/i,/Champions Cup/i,/Challenge Cup/i
];
const coreBrands = brandAssets.filter((asset) => coreBrandPatterns.some((pattern) => pattern.test(`${asset.title ?? ""} ${asset.shortName ?? ""}`)));
const summary = {
  date,
  articleCount: articles.length,
  heroCount: articles.filter((article) => article.featuredImage?.assetRef).length,
  inlineCounts: Object.fromEntries(articles.map((article) => [article.editorialInputId, article.inlineImages?.length ?? 0])),
  heroLibraryMatchCount: heroLibraryMatches.length,
  brandAssetCount: brandAssets.length,
  approvedBrandAssetCount: brandAssets.filter((asset) => asset.approvedForEditorialUse === true && asset.lifecycleStatus === "approved").length,
  approvedLocalBrandAssetCount: brandAssets.filter((asset) => asset.approvedForEditorialUse === true && asset.lifecycleStatus === "approved" && asset.primaryLogoAsset).length,
  coreBrandCount: coreBrands.length,
  coreBrandApprovedLocalCount: coreBrands.filter((asset) => asset.approvedForEditorialUse === true && asset.lifecycleStatus === "approved" && asset.primaryLogoAsset).length
};
const output = { generatedAt: new Date().toISOString(), summary, articles, heroLibraryMatches, coreBrands };
writeFileSync("launch-content-audit.json", `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output, null, 2));
