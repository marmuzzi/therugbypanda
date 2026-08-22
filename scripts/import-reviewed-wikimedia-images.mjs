import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "hvg4b508";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const reviewPath = process.env.WIKIMEDIA_REVIEW_FILE ?? "data/editorial-images/wikimedia-reviewed.json";

if (!token) throw new Error("Missing SANITY_API_TOKEN.");

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const review = JSON.parse(await fs.readFile(path.resolve(process.cwd(), reviewPath), "utf8"));
const candidates = Array.isArray(review) ? review : review.candidates;
if (!Array.isArray(candidates)) throw new Error("Review file must be an array or contain a candidates array.");

const approved = candidates.filter((item) =>
  item?.assistantDecision === "approve" &&
  item?.autoDecision === "approve-candidate" &&
  item?.rightsClear === true &&
  typeof item?.imageUrl === "string" && item.imageUrl &&
  typeof item?.sourcePage === "string" && item.sourcePage &&
  Array.isArray(item?.subjectEvidence) && item.subjectEvidence.length > 0,
);

if (approved.length === 0) throw new Error("No assistant-approved Wikimedia candidates found.");

const sourcePages = approved.map((item) => item.sourcePage);
const imageUrls = approved.map((item) => item.imageUrl);
const existing = await client.fetch(
  `*[_type == "editorialImage" && (sourceUrl in $sourcePages || imageUrl in $imageUrls || url in $imageUrls)]{_id,sourceUrl,imageUrl,url}`,
  { sourcePages, imageUrls },
);
const existingKeys = new Set(existing.flatMap((item) => [item.sourceUrl, item.imageUrl, item.url].filter(Boolean)));

function clean(value) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.replace(/\s+/g, " ").trim();
  return trimmed || undefined;
}

function extensionFromMime(mime = "") {
  if (/png/i.test(mime)) return ".png";
  if (/webp/i.test(mime)) return ".webp";
  return ".jpg";
}

function editorialCategory(scope = "") {
  if (scope === "Ireland Women") return "womens-rugby";
  if (["Ireland Men", "Six Nations opposition", "International"].includes(scope)) return "international";
  return "club-rugby";
}

function photoType(item) {
  const text = `${item.title ?? ""} ${item.description ?? ""} ${item.categories ?? ""}`.toLowerCase();
  if (/stadium|ground|arena|murrayfield|twickenham|thomond|aviva/.test(text)) return "stadium";
  if (/portrait|headshot/.test(text)) return "portrait";
  if (/training|warm.?up/.test(text)) return "training";
  return "action";
}

function creditLine(item) {
  const creator = clean(item.creator) ?? clean(item.credit) ?? "Wikimedia Commons contributor";
  return `${creator} / Wikimedia Commons`;
}

let imported = 0;
let skippedExisting = 0;
let failed = 0;
const coverage = {};
const recentImported = [];

for (const item of approved) {
  if (existingKeys.has(item.sourcePage) || existingKeys.has(item.imageUrl)) {
    skippedExisting += 1;
    continue;
  }

  try {
    const response = await fetch(item.imageUrl, {
      headers: { "User-Agent": "TheRugbyPanda/1.0 (editorial media ingestion; hello@therugbypanda.ie)" },
    });
    if (!response.ok) throw new Error(`Image download returned ${response.status}`);
    const contentType = response.headers.get("content-type") ?? item.mime ?? "image/jpeg";
    if (!/^image\/(jpeg|png|webp)/i.test(contentType)) throw new Error(`Unsupported content type ${contentType}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 50_000) throw new Error(`Downloaded image is unexpectedly small (${buffer.length} bytes)`);

    const idHash = createHash("sha1").update(item.sourcePage).digest("hex").slice(0, 20);
    const filenameBase = String(item.title ?? `wikimedia-${idHash}`)
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100) || `wikimedia-${idHash}`;
    const filename = `${filenameBase}${extensionFromMime(contentType)}`;
    const asset = await client.assets.upload("image", buffer, { filename, contentType });
    const creator = clean(item.creator) ?? clean(item.credit);
    const licence = clean(item.licence);
    const licenceUrl = clean(item.licenceUrl);
    const credit = creditLine(item);
    const title = clean(item.title) ?? "Wikimedia rugby image";
    const description = clean(item.description);

    await client.createOrReplace({
      _id: `editorialImage-wikimedia-${idHash}`,
      _type: "editorialImage",
      title,
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: description ?? title,
        caption: description ?? title,
        photographer: creator,
        source: "Wikimedia Commons",
        rights: [licence, licenceUrl, credit].filter(Boolean).join(" · "),
      },
      altText: description ?? title,
      caption: description ?? title,
      lifecycleStatus: "approved",
      usageApproved: true,
      editorialCategory: editorialCategory(item.scope),
      photoType: photoType(item),
      editorialValue: item.recent ? "seasonal" : "historical",
      suggestedUse: ["article-header", "homepage-card", "gallery"],
      team: Array.isArray(item.subjectEvidence) && item.subjectEvidence.length === 1 ? item.subjectEvidence[0] : undefined,
      sourceClassification: "open-licence",
      sourceName: "Wikimedia Commons",
      sourceUrl: item.sourcePage,
      sourcePageTitle: title,
      photographer: creator,
      rightsHolder: creator,
      licence,
      licenceUrl,
      rightsNotes: `Assistant-reviewed and approved for editorial reuse. Preserve licence and attribution. Public credit: ${credit}.`,
      attribution: credit,
      creditLine: credit,
      acquisitionScope: clean(item.scope),
      acquisitionQuery: clean(item.query),
      eventDate: typeof item.dateText === "string" && /^20\d{2}-\d{2}-\d{2}/.test(item.dateText) ? item.dateText.slice(0, 10) : undefined,
      sourceProvider: "Wikimedia Commons",
      sourceRecordId: item.sourcePage,
      importedAt: new Date().toISOString(),
      rawImport: JSON.stringify(item, null, 2),
    });

    existingKeys.add(item.sourcePage);
    existingKeys.add(item.imageUrl);
    imported += 1;
    coverage[item.scope] = (coverage[item.scope] ?? 0) + 1;
    recentImported.push(Boolean(item.recent));
  } catch (error) {
    failed += 1;
    console.error(`Failed ${item.title ?? item.sourcePage}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const recentRate = recentImported.length ? recentImported.filter(Boolean).length / recentImported.length : 0;
console.log(JSON.stringify({ approvedInput: approved.length, imported, skippedExisting, failed, coverage, recentRate }, null, 2));
if (failed > 0) throw new Error(`${failed} Wikimedia imports failed; partial successful imports remain recorded and deduplication makes retry safe.`);
