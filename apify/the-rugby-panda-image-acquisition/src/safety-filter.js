const blockedLicenseFragments = ["nc", "noncommercial", "non-commercial", "nd", "no-derivatives", "noderivatives"];

const blockedDomains = [
  "gettyimages.",
  "alamy.",
  "shutterstock.",
  "istockphoto.",
  "istock.",
  "adobestock.",
  "stock.adobe.",
  "dreamstime.",
  "depositphotos.",
  "123rf.",
  "agefotostock.",
  "rexfeatures.",
  "apimages.",
  "associatedpress.",
  "reutersagency.",
  "paimages.",
  "profimedia.",
  "imago-images.",
  "sportsfile.",
];

const purchaseFragments = [
  "license this image",
  "buy this image",
  "purchase this image",
  "rights-managed",
  "royalty-free stock",
  "stock photo",
  "editorial use only",
  "for purchase",
  "pricing",
];

function includesAny(value, fragments) {
  if (!value || typeof value !== "string") return false;
  const text = value.toLowerCase();
  return fragments.some((fragment) => text.includes(fragment));
}

function domainFromUrl(url) {
  if (!url || typeof url !== "string") return "";

  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

export function normalizeLicense(license) {
  if (!license || typeof license !== "string") return "";
  return license
    .trim()
    .toLowerCase()
    .replace(/^cc-/, "")
    .replace(/^cc\s+/, "")
    .replace(/^creative commons\s+/, "")
    .replace(/\s+/g, "-");
}

export function isAllowedLicense(license, allowedLicenses = []) {
  const normalized = normalizeLicense(license);
  const allowed = new Set(allowedLicenses.map(normalizeLicense));

  if (!normalized || !allowed.has(normalized)) return false;
  if (includesAny(normalized, blockedLicenseFragments)) return false;

  return true;
}

export function getSafetyDecision(candidate, allowedLicenses = []) {
  const license = normalizeLicense(candidate.license);
  const domainValues = [candidate.imageUrl, candidate.thumbnailUrl, candidate.sourceUrl, candidate.landingPageUrl, candidate.creatorUrl]
    .map(domainFromUrl)
    .filter(Boolean);
  const textValues = [
    candidate.title,
    candidate.description,
    candidate.attribution,
    candidate.sourceUrl,
    candidate.landingPageUrl,
    candidate.licenseUrl,
    candidate.creatorUrl,
    ...(candidate.tags ?? []),
  ].filter(Boolean);

  if (!isAllowedLicense(license, allowedLicenses)) {
    return {
      allowed: false,
      reason: `Rejected licence: ${license || "missing"}`,
    };
  }

  if (domainValues.some((domain) => blockedDomains.some((blocked) => domain.includes(blocked)))) {
    return {
      allowed: false,
      reason: "Rejected purchase/agency source domain",
    };
  }

  if (textValues.some((value) => includesAny(value, purchaseFragments))) {
    return {
      allowed: false,
      reason: "Rejected purchase/agency wording",
    };
  }

  return {
    allowed: true,
    reason: "Candidate passed automated acquisition filter. Manual validation still required before approval.",
  };
}

export function filterUnsafeCandidates(candidates, allowedLicenses = []) {
  const accepted = [];
  const rejected = [];

  for (const candidate of candidates) {
    const decision = getSafetyDecision(candidate, allowedLicenses);
    const enriched = {
      ...candidate,
      license: normalizeLicense(candidate.license),
      validationNotes: decision.reason,
    };

    if (decision.allowed) {
      accepted.push(enriched);
    } else {
      rejected.push({ ...enriched, rejectionReason: decision.reason });
    }
  }

  return { accepted, rejected };
}
