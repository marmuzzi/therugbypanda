import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "hvg4b508";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;

if (!token) throw new Error("Missing SANITY_API_TOKEN.");

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const records = await client.fetch(`*[_type == "editorialImage" && !(_id in path("drafts.**")) && usageApproved == true && lifecycleStatus in ["approved", "published"] && defined(image.asset._ref)]{
  _id,title,altText,caption,publicCredit,copyrightLine,editorialRating,sourceClassification,sourceName,photographer,rightsHolder,licence,license,attribution,creditLine
}`);

function clean(value) {
  return typeof value === "string" && value.trim() ? value.replace(/\s+/g, " ").trim() : undefined;
}

function deriveCredit(record) {
  if (record.sourceClassification === "the-rugby-panda-original") return "Photo: The Rugby Panda";
  return clean(record.creditLine)
    ?? clean(record.attribution)
    ?? (clean(record.photographer) ? `Photo: ${clean(record.photographer)}${clean(record.sourceName) ? ` / ${clean(record.sourceName)}` : ""}` : undefined)
    ?? clean(record.sourceName)
    ?? clean(record.rightsHolder);
}

function deriveCopyright(record) {
  if (record.sourceClassification === "the-rugby-panda-original") return "© The Rugby Panda";
  const licence = clean(record.licence) ?? clean(record.license);
  const holder = clean(record.rightsHolder) ?? clean(record.photographer);
  if (licence && /^(CC0|Public domain)/i.test(licence)) return `${licence}${clean(record.sourceName) ? ` · ${clean(record.sourceName)}` : ""}`;
  if (holder && licence) return `© ${holder} · ${licence}`;
  if (licence) return licence;
  return holder ? `© ${holder}` : undefined;
}

let patched = 0;
let unchanged = 0;
let unresolved = 0;
for (const record of records) {
  const patch = {};
  const title = clean(record.title);
  if (!clean(record.altText) && title) patch.altText = title;
  if (!clean(record.caption) && title) patch.caption = title;
  if (!clean(record.publicCredit)) {
    const value = deriveCredit(record);
    if (value) patch.publicCredit = value;
  }
  if (!clean(record.copyrightLine)) {
    const value = deriveCopyright(record);
    if (value) patch.copyrightLine = value;
  }
  if (record.editorialRating === undefined || record.editorialRating === null) patch.editorialRating = 3;

  if (Object.keys(patch).length === 0) {
    unchanged += 1;
    continue;
  }

  if ((!clean(record.publicCredit) && !patch.publicCredit) || (!clean(record.copyrightLine) && !patch.copyrightLine)) {
    unresolved += 1;
    continue;
  }

  await client.patch(record._id).set(patch).commit();
  patched += 1;
}

console.log(JSON.stringify({ eligible: records.length, patched, unchanged, unresolved }, null, 2));
