import { createClient } from "next-sanity";
import { isCurrentPackageEditorialInputId } from "../lib/editorial/CurrentPackageIdentity.ts";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("Duplicate retained-draft sanitation requires Sanity project ID and token.");

function operationalDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Dublin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
function normaliseUrl(value = "") {
  try { const url = new URL(String(value)); url.hash = ""; return url.toString(); } catch { return String(value).trim(); }
}
function sourceUrls(draft) {
  return new Set((Array.isArray(draft?.sourceNotes) ? draft.sourceNotes : []).map((note) => normaliseUrl(note?.url)).filter(Boolean));
}
function overlapCount(left, right) {
  let count = 0; for (const value of left) if (right.has(value)) count += 1; return count;
}

const packageDate = operationalDate();
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
const draftsRaw = await client.fetch(`*[
  _type == "article" && _id in path("drafts.**") && morningPackageEligible == true &&
  coalesce(automationContentClass, "production") == "production"
] | order(coalesce(editorialGeneratedAt,_createdAt) asc) {_id,title,editorialInputId,editorialGeneratedAt,_createdAt,sourceNotes}`);
const drafts = (Array.isArray(draftsRaw) ? draftsRaw : []).filter((draft) => isCurrentPackageEditorialInputId(draft.editorialInputId, packageDate));
const kept = [];
const evicted = [];
for (const draft of drafts) {
  const urls = sourceUrls(draft);
  const duplicateOf = kept.find((prior) => overlapCount(urls, prior.urls) >= 2);
  if (!duplicateOf) {
    kept.push({ draft, urls });
    continue;
  }
  await client.patch(draft._id).set({ morningPackageEligible: false, automationContentClass: "production" }).commit();
  evicted.push({
    articleId: draft._id,
    editorialInputId: draft.editorialInputId,
    title: draft.title,
    duplicateOf: duplicateOf.draft.editorialInputId,
    duplicateTitle: duplicateOf.draft.title,
    sharedSourceCount: overlapCount(urls, duplicateOf.urls),
    reason: "same-current-day-corroboration-source-cluster",
  });
}
const result = { packageDate, inspected: drafts.length, retainedAfter: kept.length, evictedCount: evicted.length, evicted, failClosed: true };
console.log(JSON.stringify(result, null, 2));
