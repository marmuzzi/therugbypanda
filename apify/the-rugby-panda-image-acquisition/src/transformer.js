import { normalizeLicense } from "./safety-filter.js";

function compactArray(values) {
  return Array.from(new Set((values ?? []).filter((value) => typeof value === "string" && value.trim()).map((value) => value.trim())));
}

export function baseCandidate({
  source,
  query,
  title,
  description,
  imageUrl,
  thumbnailUrl,
  sourceUrl,
  landingPageUrl,
  creator,
  creatorUrl,
  license,
  licenseUrl,
  attribution,
  width,
  height,
  tags,
}) {
  return {
    externalId: `${source}:${landingPageUrl ?? sourceUrl ?? imageUrl}`,
    title: title || query,
    description,
    imageUrl,
    thumbnailUrl,
    sourceUrl: sourceUrl ?? landingPageUrl,
    landingPageUrl: landingPageUrl ?? sourceUrl,
    creator,
    creatorUrl,
    license: normalizeLicense(license),
    licenseUrl,
    attribution,
    width: Number.isFinite(width) ? width : undefined,
    height: Number.isFinite(height) ? height : undefined,
    provider: source,
    acquisitionSource: "apify",
    acquisitionActor: "the-rugby-panda-image-acquisition",
    acquisitionQuery: query,
    sourceClassification: "Open Licence",
    lifecycleStatus: "Candidate",
    tags: compactArray([...(tags ?? []), query, source]),
    usageApproved: false,
    acquiredAt: new Date().toISOString(),
  };
}

export function openverseToCandidate(item, query) {
  return baseCandidate({
    source: "openverse",
    query,
    title: item.title,
    description: item.description,
    imageUrl: item.url,
    thumbnailUrl: item.thumbnail,
    sourceUrl: item.foreign_landing_url || item.url,
    landingPageUrl: item.foreign_landing_url || item.url,
    creator: item.creator,
    creatorUrl: item.creator_url,
    license: item.license,
    licenseUrl: item.license_url,
    attribution: item.attribution || [item.title, item.creator, item.license].filter(Boolean).join(" / "),
    width: item.width,
    height: item.height,
    tags: Array.isArray(item.tags) ? item.tags.map((tag) => tag.name || tag).filter(Boolean) : [],
  });
}

export function wikimediaToCandidate(page, imageInfo, query) {
  const metadata = imageInfo?.extmetadata ?? {};
  const title = page.title?.replace(/^File:/, "") ?? query;
  const creator = metadata.Artist?.value?.replace(/<[^>]+>/g, "") || undefined;
  const license = metadata.LicenseShortName?.value || metadata.License?.value;
  const licenseUrl = metadata.LicenseUrl?.value;
  const description = metadata.ImageDescription?.value?.replace(/<[^>]+>/g, "") || undefined;
  const sourceUrl = imageInfo?.descriptionurl;

  return baseCandidate({
    source: "wikimedia",
    query,
    title,
    description,
    imageUrl: imageInfo?.url,
    thumbnailUrl: imageInfo?.thumburl,
    sourceUrl,
    landingPageUrl: sourceUrl,
    creator,
    creatorUrl: undefined,
    license,
    licenseUrl,
    attribution: [creator, license].filter(Boolean).join(" / "),
    width: imageInfo?.width,
    height: imageInfo?.height,
    tags: ["wikimedia commons"],
  });
}
