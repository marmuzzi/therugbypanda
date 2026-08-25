import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_AUTH_TOKEN;

if (!projectId || !token) {
  throw new Error("Sanity project/token configuration is required.");
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
const id = "drafts.article-auto004-fresh-ulster-henderson-depth-20260824";
const expectedPrefix = "With Iain Henderson out for months after hip surgery, Ulster’s September friendlies at Edinburgh (4 Sept) and home to Ospreys (11 Sept) double as leadership trials in the pack";
const repaired = `${expectedPrefix}.`;

const article = await client.fetch(`*[_id == $id][0]{_id,standfirst,morningPackageEligible,automationContentClass}`, { id });
if (!article) throw new Error(`Expected draft ${id} was not found.`);
if (article.automationContentClass !== "production" || article.morningPackageEligible !== true) {
  throw new Error(`Refusing to patch ${id}: it is not a production morning-package draft.`);
}
if (article.standfirst === repaired) {
  console.log(JSON.stringify({ status: "already-repaired", id, standfirst: repaired }, null, 2));
  process.exit(0);
}
if (typeof article.standfirst !== "string" || !article.standfirst.startsWith(expectedPrefix)) {
  throw new Error(`Refusing to patch ${id}: standfirst no longer matches the measured incomplete value.`);
}
if (!/(?:—|–|\band\b|\bwith\b|\bfor\b|\bto\b|\bof\b|\bthe\b|\bback-row)\s*$/i.test(article.standfirst.trim())) {
  throw new Error(`Refusing to patch ${id}: standfirst is not recognisably incomplete.`);
}
if (repaired.length > 220) throw new Error(`Repaired standfirst exceeds 220 characters (${repaired.length}).`);

await client.patch(id).set({ standfirst: repaired }).commit();
const verified = await client.fetch(`*[_id == $id][0]{_id,standfirst}`, { id });
if (verified?.standfirst !== repaired) throw new Error("Sanity verification did not return the repaired standfirst.");

console.log(JSON.stringify({ status: "repaired-and-verified", id, standfirst: repaired, length: repaired.length }, null, 2));
