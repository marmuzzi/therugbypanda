const categoryLimits = {
  Equipment: 8,
  Evergreen: 10,
  "Rugby Culture": 8,
  Officials: 5,
  Training: 8,
  International: 8,
  Grassroots: 8,
  "Women's Rugby": 8,
};

function sourceTrust(candidate) {
  const provider = (candidate.provider ?? "").toLowerCase();
  const sourceUrl = (candidate.sourceUrl ?? "").toLowerCase();
  const landingPageUrl = (candidate.landingPageUrl ?? "").toLowerCase();

  if (provider === "wikimedia") return 100;
  if (provider === "openverse" && (sourceUrl.includes("commons.wikimedia.org") || landingPageUrl.includes("commons.wikimedia.org"))) return 98;
  if (sourceUrl.includes("rawpixel.com") || landingPageUrl.includes("rawpixel.com")) return 95;
  if (sourceUrl.includes("flickr.com") || landingPageUrl.includes("flickr.com")) return 85;
  if (provider === "openverse") return 75;

  return 60;
}

function metadataCompleteness(candidate) {
  const fields = [
    candidate.title,
    candidate.imageUrl,
    candidate.sourceUrl,
    candidate.license,
    candidate.licenseUrl,
    candidate.attribution,
    candidate.width,
    candidate.height,
    candidate.acquisitionQuery,
  ];

  const complete = fields.filter(Boolean).length;
  return Math.round((complete / fields.length) * 100);
}

function editorialQuality(candidate) {
  let score = 50;
  const width = Number(candidate.width) || 0;
  const height = Number(candidate.height) || 0;
  const pixels = width * height;
  const orientation = candidate.orientation;
  const category = candidate.editorialCategory;
  const title = (candidate.title ?? "").toLowerCase();

  if (pixels >= 3000000) score += 20;
  else if (pixels >= 1200000) score += 14;
  else if (pixels >= 700000) score += 8;
  else score -= 12;

  if (orientation === "landscape") score += 14;
  if (orientation === "portrait") score -= 8;
  if (orientation === "square") score -= 2;

  if (["Equipment", "Rugby Culture", "Evergreen"].includes(category)) score += 8;
  if (category === "Officials") score -= 4;

  if (title.includes("gilbert") || title.includes("stadium") || title.includes("supporters") || title.includes("rugby pitch")) score += 8;
  if (title.startsWith("img") || title.startsWith("_mg_") || title.includes("(")) score -= 4;

  return Math.max(0, Math.min(100, score));
}

function diversityKey(candidate) {
  const category = candidate.editorialCategory ?? "Uncategorised";
  const type = (candidate.photoType ?? ["unknown"])[0];
  const query = candidate.acquisitionQuery ?? "unknown";
  return `${category}:${type}:${query}`;
}

function scoreCandidate(candidate) {
  const trust = sourceTrust(candidate);
  const quality = editorialQuality(candidate);
  const metadata = metadataCompleteness(candidate);
  const relevance = Number(candidate.rugbyRelevanceScore) || 0;
  const overall = Math.round((relevance * 0.4) + (quality * 0.3) + (trust * 0.2) + (metadata * 0.1));

  return {
    ...candidate,
    sourceTrustScore: trust,
    editorialQualityScore: quality,
    metadataCompletenessScore: metadata,
    overallMediaScore: overall,
    diversityKey: diversityKey(candidate),
  };
}

export function rankCandidates(candidates, { maxCandidates = 100 } = {}) {
  const scored = candidates
    .map(scoreCandidate)
    .sort((a, b) => b.overallMediaScore - a.overallMediaScore || b.sourceTrustScore - a.sourceTrustScore);

  const selected = [];
  const categoryCounts = new Map();
  const diversityCounts = new Map();

  for (const candidate of scored) {
    const category = candidate.editorialCategory ?? "Uncategorised";
    const categoryLimit = categoryLimits[category] ?? 8;
    const categoryCount = categoryCounts.get(category) ?? 0;
    const diversityCount = diversityCounts.get(candidate.diversityKey) ?? 0;

    if (categoryCount >= categoryLimit) continue;
    if (diversityCount >= 3) continue;

    selected.push({
      ...candidate,
      rankingPosition: selected.length + 1,
      recommendedForImport: true,
    });

    categoryCounts.set(category, categoryCount + 1);
    diversityCounts.set(candidate.diversityKey, diversityCount + 1);

    if (selected.length >= maxCandidates) break;
  }

  const rejectedByDiversity = scored
    .filter((candidate) => !selected.some((selectedCandidate) => selectedCandidate.externalId === candidate.externalId))
    .map((candidate) => ({
      ...candidate,
      recommendedForImport: false,
      rejectionReason: "Rejected by diversity limiter or candidate cap.",
    }));

  return { selected, rejectedByDiversity };
}
