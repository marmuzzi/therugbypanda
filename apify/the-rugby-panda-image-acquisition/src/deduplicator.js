function normalizeUrl(url) {
  if (!url || typeof url !== "string") return "";

  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.search = "";
    return parsed.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return url.trim().toLowerCase();
  }
}

export function deduplicateCandidates(candidates) {
  const seen = new Set();
  const deduped = [];

  for (const candidate of candidates) {
    const key = normalizeUrl(candidate.imageUrl) || normalizeUrl(candidate.landingPageUrl) || normalizeUrl(candidate.sourceUrl);
    if (!key || seen.has(key)) continue;

    seen.add(key);
    deduped.push(candidate);
  }

  return deduped;
}
