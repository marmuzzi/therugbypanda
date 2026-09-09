import { createClient } from "next-sanity";
import { isCurrentPackageEditorialInputId } from "../lib/editorial/CurrentPackageIdentity.ts";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("Daily-package preflight requires Sanity project ID and token.");

const packageDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Dublin",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });

// morningPackageEligible is a daily reservation, not a permanent entitlement. Historical
// eligible drafts must never leak into a later Dublin operational day merely because a GROQ
// `match` expression behaves more broadly than an exact string prefix.
const eligibleDrafts = await client.fetch(`*[
  _type == "article" &&
  _id in path("drafts.**") &&
  morningPackageEligible == true &&
  coalesce(automationContentClass, "production") == "production"
]{_id,title,editorialInputId,editorialGeneratedAt,_createdAt}`);
const staleDrafts = (Array.isArray(eligibleDrafts) ? eligibleDrafts : [])
  .filter((draft) => !isCurrentPackageEditorialInputId(draft?.editorialInputId, packageDate));
for (const draft of staleDrafts) {
  await client.patch(draft._id).set({
    morningPackageEligible: false,
    automationContentClass: "production",
  }).commit();
}

const accepted = await client.fetch(
  `count(*[_type == "editorialAutomationEvidence" && kind == "daily-package-direct-zoho" && packageDate == $packageDate && status == "accepted"])`,
  { packageDate },
);
const skip = Number(accepted) > 0;
const result = {
  packageDate,
  acceptedEvidenceCount: Number(accepted),
  skip,
  exactCurrentDayIdentity: true,
  staleEligibleDraftsEvicted: staleDrafts.length,
  staleEvictions: staleDrafts.map((draft) => ({
    id: draft._id,
    editorialInputId: draft.editorialInputId,
    title: draft.title,
  })),
};
console.log(JSON.stringify(result, null, 2));
if (process.env.GITHUB_OUTPUT) {
  const fs = await import("node:fs/promises");
  await fs.appendFile(
    process.env.GITHUB_OUTPUT,
    `skip=${skip ? "true" : "false"}\npackage_date=${packageDate}\nstale_evicted=${staleDrafts.length}\n`,
  );
}
