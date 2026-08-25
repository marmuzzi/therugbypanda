import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "hvg4b508";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;

if (!token) throw new Error("Missing SANITY_API_TOKEN.");

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const candidates = await client.fetch(`*[
  _type == "editorialImage" &&
  !(_id in path("drafts.**")) &&
  usageApproved == true &&
  lifecycleStatus in ["approved", "published"] &&
  !defined(image.asset._ref) &&
  defined(imageUrl) &&
  sourceUrl match "*commons.wikimedia.org*" &&
  defined(attribution) &&
  (defined(licenseUrl) || license in ["cc0", "public-domain", "public domain"])
]{
  _id,title,altText,caption,publicCredit,copyrightLine,editorialRating,
  imageUrl,sourceUrl,attribution,license,licenseUrl,rightsNotes
}`);

function clean(value) {
  return typeof value === "string" && value.trim() ? value.replace(/\s+/g, " ").trim() : undefined;
}

function licenceLabel(record) {
  const url = clean(record.licenseUrl)?.toLowerCase() ?? "";
  if (url.includes("publicdomain/zero/1.0")) return "CC0 1.0";
  const match = url.match(/licenses\/(by(?:-sa)?)\/(\d\.\d)/);
  if (match) return `CC ${match[1].toUpperCase()} ${match[2]}`;
  const raw = clean(record.license)?.toLowerCase();
  if (raw === "cc0") return "CC0 1.0";
  if (raw === "by") return "CC BY";
  if (raw === "by-sa") return "CC BY-SA";
  return clean(record.license) ?? "Open licence";
}

function creatorFromAttribution(value) {
  const attribution = clean(value);
  if (!attribution) return undefined;
  const slash = attribution.match(/^(.+?)\s*\/\s*CC\b/i);
  if (slash) return slash[1].trim().replace(/^"|"$/g, "");
  const verbose = attribution.match(/\bby\s+(.+?)\s+is licensed under\b/i);
  return verbose?.[1]?.trim().replace(/^"|"$/g, "");
}

function extension(contentType) {
  if (/png/i.test(contentType)) return ".png";
  if (/webp/i.test(contentType)) return ".webp";
  return ".jpg";
}

let localized = 0;
let failed = 0;
const results = [];

for (const record of candidates) {
  try {
    const response = await fetch(record.imageUrl, {
      headers: { "User-Agent": "TheRugbyPanda/1.0 (approved media localization; hello@therugbypanda.ie)" },
    });
    if (!response.ok) throw new Error(`download returned ${response.status}`);
    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    if (!/^image\/(jpeg|png|webp)/i.test(contentType)) throw new Error(`unsupported content type ${contentType}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 20_000) throw new Error(`image too small (${buffer.length} bytes)`);

    const title = clean(record.title) ?? record._id;
    const filename = `${record._id.replace(/[^a-zA-Z0-9._-]+/g, "-")}${extension(contentType)}`;
    const asset = await client.assets.upload("image", buffer, { filename, contentType });
    const credit = clean(record.attribution);
    const licence = licenceLabel(record);
    const creator = creatorFromAttribution(record.attribution);
    const copyrightLine = licence.startsWith("CC0")
      ? `${licence}${creator ? ` · ${creator}` : ""}`
      : `${creator ? `© ${creator} · ` : ""}${licence}`;
    const rightsNotes = [
      clean(record.rightsNotes),
      `Approved open-licence source localized into Sanity on 2026-08-25. Preserve source URL, attribution and licence on public use.`,
    ].filter(Boolean).join(" ");

    const patch = {
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: clean(record.altText) ?? title,
        caption: clean(record.caption) ?? title,
      },
      altText: clean(record.altText) ?? title,
      caption: clean(record.caption) ?? title,
      publicCredit: clean(record.publicCredit) ?? credit,
      copyrightLine: clean(record.copyrightLine) ?? copyrightLine,
      editorialRating: record.editorialRating ?? 3,
      rightsNotes,
    };

    if (!patch.publicCredit) throw new Error("no usable public credit");
    await client.patch(record._id).set(patch).commit();
    localized += 1;
    results.push({ id: record._id, title, status: "localized", assetId: asset._id, licence });
  } catch (error) {
    failed += 1;
    results.push({ id: record._id, title: record.title, status: "failed", error: error instanceof Error ? error.message : String(error) });
  }
}

console.log(JSON.stringify({ eligible: candidates.length, localized, failed, results }, null, 2));
if (failed > 0) throw new Error(`${failed} approved Wikimedia image localization(s) failed; successful localizations remain safely recorded.`);
