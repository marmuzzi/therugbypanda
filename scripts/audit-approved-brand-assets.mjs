import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "hvg4b508";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const outputPath = process.env.BRAND_ASSET_AUDIT_OUTPUT ?? "data/brand-assets/approved-brand-localization-audit.json";

if (!token) throw new Error("Missing SANITY_API_TOKEN.");
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const records = await client.fetch(`*[_type == "brandAsset" && approvedForEditorialUse == true && lifecycleStatus == "approved"] | order(title asc) {
  _id,title,shortName,brandType,country,rightsStatus,rightsHolder,sourceUrl,usageNotes,externalLogoUrl,candidateLogoUrls,
  "primaryLogoAsset": primaryLogo.asset._ref,
  "lightLogoAsset": lightLogo.asset._ref,
  "darkLogoAsset": darkLogo.asset._ref
}`);

function clean(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function host(value) {
  try { return new URL(value).hostname.toLowerCase().replace(/^www\./, ""); } catch { return undefined; }
}

function candidateAssessment(record) {
  const candidates = [
    ...(clean(record.externalLogoUrl) ? [{ url: clean(record.externalLogoUrl), notes: "externalLogoUrl" }] : []),
    ...(Array.isArray(record.candidateLogoUrls) ? record.candidateLogoUrls.map((item) => ({ url: clean(item?.url), notes: clean(item?.notes), format: clean(item?.format) })) : []),
  ].filter((item) => item.url);

  const sourceHost = host(record.sourceUrl);
  return candidates.map((candidate) => {
    const url = candidate.url;
    const candidateHost = host(url);
    const lower = url.toLowerCase();
    const explicitImageExtension = /\.(svg|png|webp|jpe?g)(?:[?#]|$)/i.test(lower);
    const faviconLike = /favicon|apple-touch-icon|site-icon|cropped-.*icon|\.ico(?:[?#]|$)/i.test(lower) || /favicon/i.test(candidate.notes ?? "");
    const likelyOfficialHost = Boolean(sourceHost && candidateHost && (candidateHost === sourceHost || candidateHost.endsWith(`.${sourceHost}`)));
    const trustedMediaHost = /(?:wikimedia\.org|wikipedia\.org|wp\.com|cloudfront\.net|sanity\.io)$/i.test(candidateHost ?? "");
    const localizationCandidate = !faviconLike && explicitImageExtension && (likelyOfficialHost || trustedMediaHost);
    return { ...candidate, candidateHost, sourceHost, explicitImageExtension, faviconLike, likelyOfficialHost, trustedMediaHost, localizationCandidate };
  });
}

const audited = records.map((record) => {
  const candidates = candidateAssessment(record);
  const localReady = Boolean(record.primaryLogoAsset);
  const strongCandidates = candidates.filter((candidate) => candidate.localizationCandidate);
  return {
    ...record,
    localReady,
    candidates,
    strongLocalizationCandidates: strongCandidates,
    localizationStatus: localReady ? "already-local" : strongCandidates.length > 0 ? "strong-candidate" : "manual-source-resolution-needed",
  };
});

const summary = {
  approved: audited.length,
  alreadyLocal: audited.filter((record) => record.localReady).length,
  strongCandidate: audited.filter((record) => record.localizationStatus === "strong-candidate").length,
  manualSourceResolutionNeeded: audited.filter((record) => record.localizationStatus === "manual-source-resolution-needed").length,
};

await fs.mkdir(path.dirname(path.resolve(process.cwd(), outputPath)), { recursive: true });
await fs.writeFile(path.resolve(process.cwd(), outputPath), `${JSON.stringify({ generatedAt: new Date().toISOString(), summary, records: audited }, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
