import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "hvg4b508";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error("Missing SANITY_API_TOKEN.");
  process.exit(1);
}

const repoRoot = process.cwd();
const manifestPath = process.argv[2] ?? "data/media/rugby-panda-originals-2026-07-04-manifest.json";
const zipPath = process.argv[3] ?? "data/media/rugby-panda-originals-2026-07-04.zip";
const tmpDir = path.join(repoRoot, ".tmp-rugby-panda-originals");
const extractDir = path.join(tmpDir, "photos");

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, manifestPath), "utf8"));

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

function extensionFor(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".heif", ".heic"].includes(ext)) return ext;
  return ".jpg";
}

function mimeFor(fileName) {
  const ext = extensionFor(fileName);
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".heif") return "image/heif";
  if (ext === ".heic") return "image/heic";
  return "image/jpeg";
}

function asSanityStringArray(values = []) {
  return Array.isArray(values) ? values.filter(Boolean) : [];
}

fs.rmSync(tmpDir, { recursive: true, force: true });
fs.mkdirSync(extractDir, { recursive: true });

const absoluteZipPath = path.join(repoRoot, zipPath);
if (!fs.existsSync(absoluteZipPath)) {
  throw new Error(`Missing ZIP file: ${absoluteZipPath}`);
}

execFileSync("unzip", ["-q", absoluteZipPath, "-d", extractDir]);

function resolveExtractedPhoto(sourceFile) {
  const candidates = [
    path.join(extractDir, sourceFile),
    path.join(extractDir, "photos", sourceFile),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  throw new Error(`Photo from manifest not found in ZIP: ${sourceFile}`);
}

let imported = 0;

for (const item of manifest) {
  const imagePath = resolveExtractedPhoto(item.sourceFile);

  const asset = await client.assets.upload("image", fs.createReadStream(imagePath), {
    filename: item.sourceFile,
    contentType: mimeFor(item.sourceFile),
  });

  const documentId = `editorialImage-original-${slugify(item.sourceFile.replace(/\.[^.]+$/, ""))}`;

  await client.createOrReplace({
    _id: documentId,
    _type: "editorialImage",
    title: item.title,
    image: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
      alt: item.altText,
      caption: item.caption,
      photographer: "The Rugby Panda",
      source: "The Rugby Panda Original",
      rights: "Original Rugby Panda photography. Public attribution: Photo: The Rugby Panda. Copyright: © The Rugby Panda.",
    },
    altText: item.altText,
    caption: item.caption,
    lifecycleStatus: "approved",
    usageApproved: true,
    editorialRating: item.editorialRating,
    editorialCategory: item.editorialCategory,
    photoType: asSanityStringArray(item.photoType),
    eventAlbum: item.eventAlbum,
    venue: item.venue,
    teams: asSanityStringArray(item.teams),
    tags: asSanityStringArray(item.tags),
    editorialValue: item.editorialValue,
    suggestedUse: asSanityStringArray(item.suggestedUse),
    sourceClassification: "the-rugby-panda-original",
    publicCredit: "Photo: The Rugby Panda",
    copyrightLine: "© The Rugby Panda",
    creator: "The Rugby Panda",
    source: "The Rugby Panda Original",
    rightsNotes: "Original Rugby Panda photography. Public attribution must remain Photo: The Rugby Panda.",
    importedAt: new Date().toISOString(),
    rawImport: JSON.stringify(item, null, 2),
  });

  imported += 1;
}

fs.rmSync(tmpDir, { recursive: true, force: true });
console.log(`Imported ${imported} Rugby Panda original photos into ${projectId}/${dataset}.`);
