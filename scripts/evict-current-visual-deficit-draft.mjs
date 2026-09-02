import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const planPath = process.env.IMAGE_PLAN_PATH || "daily-article-image-plan-after-acquisition.json";
const outputPath = process.env.VISUAL_EVICTION_OUTPUT || "data/editorial-images/current-visual-deficit-eviction.json";
const MIN_ASSIGNMENT_SAFE_IMAGES = 2; // one hero + at least one meaningful inline image

if (!projectId || !token) throw new Error("Visual-deficit recovery requires Sanity project ID and token.");

function operationalDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Dublin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

const plan = JSON.parse(await fs.readFile(path.resolve(planPath), "utf8"));
const packageDate = operationalDate();
if (plan?.packageDate !== packageDate || !Array.isArray(plan?.plans) || plan.plans.length !== 5) {
  throw new Error(`Visual recovery requires the exact five-article Dublin package for ${packageDate}.`);
}

// MEDIA-011 depth=3 is a quality target, not a forced-placement requirement.
// A draft is image-unfulfillable only when it lacks the minimum two assignment-safe
// local images required by the delivery contract: one hero and one meaningful inline.
const unfulfillable = plan.plans
  .filter((item) => Number(item?.localCandidateCount || 0) < MIN_ASSIGNMENT_SAFE_IMAGES)
  .sort((a, b) => Number(a.localCandidateCount || 0) - Number(b.localCandidateCount || 0));
if (unfulfillable.length === 0) {
  const result = { status: "no-image-unfulfillable-draft", packageDate, evicted: [], minimumAssignmentSafeImages: MIN_ASSIGNMENT_SAFE_IMAGES };
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

// Bounded recovery: never discard multiple accepted stories in one visual-recovery pass.
const target = unfulfillable[0];
if (!String(target.editorialInputId || "").startsWith(`current-${packageDate}-`)) {
  throw new Error("Refusing to evict a draft outside the exact current package.");
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
const draft = await client.fetch(`*[
  _type == "article" &&
  _id == $id &&
  _id in path("drafts.**") &&
  morningPackageEligible == true &&
  automationContentClass == "production" &&
  editorialInputId == $editorialInputId
][0]{_id,title,editorialInputId,morningPackageEligible}`, {
  id: target.articleId,
  editorialInputId: target.editorialInputId,
});
if (!draft) throw new Error(`Current visual-deficit draft ${target.editorialInputId} is not eligible in Sanity; refusing ambiguous recovery.`);

await client.patch(draft._id).set({ morningPackageEligible: false, automationContentClass: "production" }).commit();

const result = {
  status: "evicted-one-image-unfulfillable-draft",
  packageDate,
  evicted: [{
    articleId: draft._id,
    editorialInputId: draft.editorialInputId,
    title: draft.title,
    localCandidateCount: Number(target.localCandidateCount || 0),
    deficit: Number(target.deficit || 0),
    reason: `targeted image acquisition exhausted with fewer than ${MIN_ASSIGNMENT_SAFE_IMAGES} assignment-safe local images`,
  }],
  minimumAssignmentSafeImages: MIN_ASSIGNMENT_SAFE_IMAGES,
  preservedSlots: 4,
  boundedReplacementLimit: 1,
};
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
