import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const planPath = process.env.IMAGE_PLAN_PATH || "daily-article-image-plan-after-acquisition.json";
const outputPath = process.env.VISUAL_EVICTION_OUTPUT || "data/editorial-images/current-visual-deficit-eviction.json";
const acquisitionBatchPath = process.env.CURRENT_ACQUISITION_BATCH_PATH || "data/editorial-acquisition/current-editorial-acquisition-batch.json";
const MIN_ASSIGNMENT_SAFE_IMAGES = 2;
const VISUAL_RECOVERY_CANDIDATE_RESERVE = Math.max(0, Number.parseInt(process.env.VISUAL_RECOVERY_CANDIDATE_RESERVE || "1", 10) || 0);

if (!projectId || !token) throw new Error("Visual-deficit recovery requires Sanity project ID and token.");

function operationalDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Dublin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

async function excludeEvictedCandidateFromRecoveryBatch(editorialInputId, packageDate) {
  const resolved = path.resolve(acquisitionBatchPath);
  const batch = JSON.parse(await fs.readFile(resolved, "utf8"));
  if (batch?.schemaVersion !== "1.0" || batch?.packageDate !== packageDate || !Array.isArray(batch?.candidates)) {
    throw new Error(`Visual recovery cannot safely mutate the acquisition batch for ${packageDate}.`);
  }

  const before = batch.candidates.length;
  const matchingCount = batch.candidates.filter((candidate) => candidate?.id === editorialInputId).length;
  if (matchingCount > 1) {
    throw new Error(`Visual recovery found duplicate candidate ${editorialInputId} in the acquisition batch; refusing ambiguous recovery.`);
  }

  batch.candidates = batch.candidates.filter((candidate) => candidate?.id !== editorialInputId);
  const removed = before - batch.candidates.length;
  if (removed !== 0 && removed !== 1) {
    throw new Error(`Visual recovery expected to exclude at most one candidate ${editorialInputId}, removed ${removed}.`);
  }

  batch.provenance = {
    ...(batch.provenance ?? {}),
    visualEvictionExclusions: [
      ...new Set([...(batch.provenance?.visualEvictionExclusions ?? []), editorialInputId]),
    ],
  };
  await fs.writeFile(resolved, `${JSON.stringify(batch, null, 2)}\n`);
  return {
    batchPath: acquisitionBatchPath,
    candidateCountBefore: before,
    candidateCountAfter: batch.candidates.length,
    candidateWasPresent: matchingCount === 1,
  };
}

function reapplyPackageDiversityBeforeReplacement() {
  const result = spawnSync(process.execPath, ["scripts/enforce-current-package-diversity.mjs"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      BATCH_PATH: acquisitionBatchPath,
      MAX_PACKAGE_MATCHUP_STORIES: process.env.MAX_PACKAGE_MATCHUP_STORIES || "2",
      MAX_PACKAGE_TEAM_STORIES: process.env.MAX_PACKAGE_TEAM_STORIES || "2",
      PACKAGE_RECOVERY_CANDIDATE_RESERVE: String(VISUAL_RECOVERY_CANDIDATE_RESERVE),
    },
    encoding: "utf8",
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error || result.status !== 0) {
    throw new Error(`Visual recovery diversity recheck failed before replacement generation (status ${result.status ?? "unknown"}).`);
  }
  return {
    status: "passed",
    maxPerMatchup: Number(process.env.MAX_PACKAGE_MATCHUP_STORIES || 2),
    maxPerTeam: Number(process.env.MAX_PACKAGE_TEAM_STORIES || 2),
    recoveryCandidateReserve: VISUAL_RECOVERY_CANDIDATE_RESERVE,
  };
}

const plan = JSON.parse(await fs.readFile(path.resolve(planPath), "utf8"));
const packageDate = operationalDate();
if (plan?.packageDate !== packageDate || !Array.isArray(plan?.plans) || plan.plans.length !== 5) {
  throw new Error(`Visual recovery requires the exact five-article Dublin package for ${packageDate}.`);
}

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
const batchExclusion = await excludeEvictedCandidateFromRecoveryBatch(draft.editorialInputId, packageDate);
const diversityRecheck = reapplyPackageDiversityBeforeReplacement();

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
  batchExclusion,
  diversityRecheck,
  minimumAssignmentSafeImages: MIN_ASSIGNMENT_SAFE_IMAGES,
  preservedSlots: 4,
  boundedReplacementLimit: 1,
};
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
