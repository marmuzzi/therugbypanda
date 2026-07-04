import { buildOpenverseQuery, openverseLicenseParams } from "./query-builder.js";
import { openverseToCandidate } from "./transformer.js";

const OPENVERSE_ENDPOINT = "https://api.openverse.org/v1/images/";

export async function searchOpenverse({ query, resultsPerQuery, allowedLicenses }) {
  const url = new URL(OPENVERSE_ENDPOINT);
  url.searchParams.set("q", buildOpenverseQuery(query));
  url.searchParams.set("page_size", String(resultsPerQuery));
  url.searchParams.set("license", openverseLicenseParams(allowedLicenses));
  url.searchParams.set("mature", "false");

  const response = await fetch(url, {
    headers: {
      "User-Agent": "The Rugby Panda Image Acquisition/0.1",
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Openverse request failed for "${query}": ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  const results = Array.isArray(payload.results) ? payload.results : [];

  return results
    .map((item) => openverseToCandidate(item, query))
    .filter((candidate) => candidate.imageUrl && candidate.sourceUrl && candidate.license);
}
