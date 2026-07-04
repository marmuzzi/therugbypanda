import { buildWikimediaQuery } from "./query-builder.js";
import { wikimediaToCandidate } from "./transformer.js";

const WIKIMEDIA_ENDPOINT = "https://commons.wikimedia.org/w/api.php";

export async function searchWikimedia({ query, resultsPerQuery }) {
  const searchUrl = new URL(WIKIMEDIA_ENDPOINT);
  searchUrl.searchParams.set("action", "query");
  searchUrl.searchParams.set("format", "json");
  searchUrl.searchParams.set("generator", "search");
  searchUrl.searchParams.set("gsrnamespace", "6");
  searchUrl.searchParams.set("gsrsearch", buildWikimediaQuery(query));
  searchUrl.searchParams.set("gsrlimit", String(resultsPerQuery));
  searchUrl.searchParams.set("prop", "imageinfo");
  searchUrl.searchParams.set("iiprop", "url|size|mime|extmetadata");
  searchUrl.searchParams.set("iiurlwidth", "1200");
  searchUrl.searchParams.set("origin", "*");

  const response = await fetch(searchUrl, {
    headers: {
      "User-Agent": "The Rugby Panda Image Acquisition/0.1",
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Wikimedia request failed for "${query}": ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  const pages = Object.values(payload?.query?.pages ?? {});

  return pages
    .map((page) => wikimediaToCandidate(page, page.imageinfo?.[0], query))
    .filter((candidate) => candidate.imageUrl && candidate.sourceUrl && candidate.license);
}
