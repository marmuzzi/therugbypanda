import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "hvg4b508";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const target = Number.parseInt(process.env.EDITORIAL_IMAGE_LOCAL_FLOOR ?? "200", 10);

if (!token) throw new Error("Missing SANITY_API_TOKEN.");
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const records = await client.fetch(`*[
  _type == "editorialImage" &&
  !(_id in path("drafts.**")) &&
  defined(image.asset._ref)
]{
  _id,title,altText,caption,publicCredit,copyrightLine,sourceClassification,sourceUrl,
  foreignLandingUrl,originalLandingPage,license,rightsNotes,lifecycleStatus,usageApproved,
  editorialCategory,editorialRating,editorialValue,suggestedUse,"assetRef":image.asset._ref
}`);

const required = ["title","altText","caption","publicCredit","copyrightLine","sourceClassification","editorialCategory","editorialRating","editorialValue","suggestedUse","lifecycleStatus"];
const blank = (value) => value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);

function issues(record) {
  const found = [];
  for (const field of required) if (blank(record[field])) found.push(`Missing ${field}`);
  if (record.lifecycleStatus === "approved" && record.usageApproved !== true) found.push("approved without usageApproved");
  if (record.usageApproved === true && !["approved","published"].includes(record.lifecycleStatus)) found.push("usageApproved lifecycle mismatch");
  if (record.sourceClassification !== "the-rugby-panda-original") {
    if (blank(record.sourceUrl) && blank(record.foreignLandingUrl) && blank(record.originalLandingPage)) found.push("external image has no source URL");
    if (blank(record.license) && blank(record.rightsNotes)) found.push("external image has no licence/rights notes");
  }
  if (record.sourceClassification === "the-rugby-panda-original") {
    if (record.publicCredit !== "Photo: The Rugby Panda") found.push("original public credit mismatch");
    if (record.copyrightLine !== "© The Rugby Panda") found.push("original copyright mismatch");
  }
  return found;
}

const audited = records.map((record) => ({ id: record._id, title: record.title, issues: issues(record) }));
const ready = audited.filter((record) => record.issues.length === 0);
const approvedReady = ready.filter((readyRecord) => {
  const source = records.find((record) => record._id === readyRecord.id);
  return source && (source.usageApproved === true || ["approved","published"].includes(source.lifecycleStatus));
});
const result = {
  generatedAt: new Date().toISOString(),
  target,
  localAssets: records.length,
  localPublicationReady: ready.length,
  localApprovedPublicationReady: approvedReady.length,
  gapToTarget: Math.max(0, target - ready.length),
  targetMet: ready.length >= target,
  recordsNeedingAttention: audited.filter((record) => record.issues.length > 0),
};
console.log(JSON.stringify(result, null, 2));
if (process.env.GITHUB_STEP_SUMMARY) {
  const summary = `## Strict local Editorial Image floor\n\n- Local assets: ${result.localAssets}\n- Local publication-ready: **${result.localPublicationReady}**\n- Target: **${target}**\n- Gap: **${result.gapToTarget}**\n- Target met: **${result.targetMet ? "yes" : "no"}**\n`;
  const { appendFile } = await import("node:fs/promises");
  await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
}
