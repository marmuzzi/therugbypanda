const negativeTerms = [
  "getty",
  "gettyimages",
  "alamy",
  "shutterstock",
  "istock",
  "istockphoto",
  "adobe stock",
  "dreamstime",
  "depositphotos",
  "123rf",
  "ap images",
  "associated press",
  "reuters",
  "pa images",
  "sportsfile",
  "editorial use only",
  "rights managed",
  "rights-managed",
  "stock photo",
  "buy image",
  "license image",
  "non commercial",
  "noncommercial",
  "no derivatives",
];

const wikimediaPreferredTerms = ["filetype:bitmap", "-insource:/Getty/i", "-insource:/Alamy/i", "-insource:/Shutterstock/i"];

export function buildOpenverseQuery(query) {
  return query.trim();
}

export function buildWikimediaQuery(query) {
  const exclusions = negativeTerms.map((term) => `-${JSON.stringify(term)}`).join(" ");
  return `${query.trim()} ${exclusions} ${wikimediaPreferredTerms.join(" ")}`.trim();
}

export function openverseLicenseParams(allowedLicenses = []) {
  const normalized = allowedLicenses
    .map((license) => license.toLowerCase().trim())
    .filter(Boolean);

  return normalized.length ? normalized.join(",") : "cc0,pdm,by,by-sa";
}

export function blockedQueryTerms() {
  return [...negativeTerms];
}
