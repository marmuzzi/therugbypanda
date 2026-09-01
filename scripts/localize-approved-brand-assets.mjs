import path from "node:path";
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "hvg4b508";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
if (!token) throw new Error("Missing SANITY_API_TOKEN.");
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const records = await client.fetch(`*[_type == "brandAsset" && approvedForEditorialUse == true && lifecycleStatus == "approved" && !defined(primaryLogo.asset._ref)] | order(title asc) {_id,title,shortName,rightsStatus,rightsHolder,sourceUrl,usageNotes,externalLogoUrl,candidateLogoUrls}`);

function clean(value) { return typeof value === "string" && value.trim() ? value.trim() : undefined; }
function candidatesFor(record) {
  return [...new Set([clean(record.externalLogoUrl), ...(Array.isArray(record.candidateLogoUrls) ? record.candidateLogoUrls.map((item) => clean(item?.url)) : [])].filter(Boolean))];
}
function isUsableCandidate(url) {
  const lower = url.toLowerCase();
  if (/favicon|apple-touch-icon|site-icon|cropped-.*icon|\.ico(?:[?#]|$)/i.test(lower)) return false;
  return /\.(svg|png|webp|jpe?g)(?:[?#]|$)/i.test(lower);
}
function extensionFor(url, contentType) {
  if (/svg/i.test(contentType)) return ".svg";
  if (/png/i.test(contentType)) return ".png";
  if (/webp/i.test(contentType)) return ".webp";
  if (/jpe?g/i.test(contentType)) return ".jpg";
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  return [".svg", ".png", ".webp", ".jpg", ".jpeg"].includes(ext) ? ext : ".img";
}

let localized = 0, noStrongCandidate = 0, failed = 0;
const results = [];
for (const record of records) {
  // These URLs live on an already human-approved brandAsset record. Official sites commonly serve marks from
  // first-party CDNs (CloudFront/Sotic/InCrowd), so requiring the candidate hostname to equal sourceUrl wrongly
  // blocks approved assets. Keep the important safety boundary here: approved record + explicit candidate URL +
  // real image format + no favicon. Public rendering still uses only the resulting local Sanity asset.
  const url = candidatesFor(record).find(isUsableCandidate);
  if (!url) { noStrongCandidate += 1; results.push({ id: record._id, title: record.title, status: "no-strong-candidate" }); continue; }
  try {
    const response = await fetch(url, { headers: { "User-Agent": "TheRugbyPanda/1.0 (approved editorial brand asset localization; hello@therugbypanda.ie)" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = (response.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    if (!new Set(["image/svg+xml", "image/png", "image/webp", "image/jpeg"]).has(contentType)) throw new Error(`Unsupported content type ${contentType || "unknown"}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 512) throw new Error("Downloaded logo is implausibly small");
    if (bytes.length > 10 * 1024 * 1024) throw new Error("Downloaded logo exceeds 10 MB safety limit");
    const filename = `${record._id.replace(/[^a-zA-Z0-9_-]+/g, "-")}${extensionFor(url, contentType)}`;
    const asset = await client.assets.upload("image", bytes, { filename, contentType });
    await client.patch(record._id).set({ primaryLogo: { _type: "image", asset: { _type: "reference", _ref: asset._id }, alt: `${record.shortName ?? record.title} logo`, caption: `${record.title} official mark`, source: record.rightsHolder ?? record.title, rights: record.usageNotes ?? "Approved for editorial/trademark use in coverage about the represented rugby entity." }, logoFormat: contentType }).commit();
    localized += 1; results.push({ id: record._id, title: record.title, status: "localized", url, contentType, bytes: bytes.length, assetId: asset._id });
  } catch (error) { failed += 1; results.push({ id: record._id, title: record.title, status: "failed", url, error: error instanceof Error ? error.message : String(error) }); }
}
console.log(JSON.stringify({ approvedMissingLocal: records.length, localized, noStrongCandidate, failed, results }, null, 2));
if (failed > 0) process.exitCode = 2;
