import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "hvg4b508";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;

if (!token) throw new Error("Missing SANITY_API_TOKEN.");

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const records = await client.fetch(`*[_type == "editorialImage" && !(_id in path("drafts.**")) && sourceName == "Wikimedia Commons" && usageApproved == true && lifecycleStatus in ["approved", "published"] && defined(image.asset._ref)]{
  _id,title,caption,altText,photographer,rightsHolder,licence,licenceUrl,attribution,creditLine,publicCredit,copyrightLine,editorialRating,sourceUrl,rightsNotes
}`);

function clean(value) {
  return typeof value === "string" && value.trim() ? value.replace(/\s+/g, " ").trim() : undefined;
}

function publicCredit(record) {
  return clean(record.publicCredit)
    ?? clean(record.creditLine)
    ?? (clean(record.attribution) ? clean(record.attribution) : undefined)
    ?? (clean(record.photographer) ? `Photo: ${clean(record.photographer)} / Wikimedia Commons` : "Wikimedia Commons");
}

function copyrightLine(record) {
  if (clean(record.copyrightLine)) return clean(record.copyrightLine);
  const licence = clean(record.licence) ?? "Open licence";
  const holder = clean(record.rightsHolder) ?? clean(record.photographer);
  if (/^(CC0|Public domain)/i.test(licence)) return `${licence} · Wikimedia Commons`;
  return holder ? `© ${holder} · ${licence}` : `${licence} · Wikimedia Commons`;
}

let patched = 0;
let unchanged = 0;
for (const record of records) {
  const patch = {};
  if (!clean(record.publicCredit)) patch.publicCredit = publicCredit(record);
  if (!clean(record.copyrightLine)) patch.copyrightLine = copyrightLine(record);
  if (record.editorialRating === undefined || record.editorialRating === null) patch.editorialRating = 3;

  if (Object.keys(patch).length === 0) {
    unchanged += 1;
    continue;
  }
  await client.patch(record._id).set(patch).commit();
  patched += 1;
}

console.log(JSON.stringify({ eligible: records.length, patched, unchanged }, null, 2));
