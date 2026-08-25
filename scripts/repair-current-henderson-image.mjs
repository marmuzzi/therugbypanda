const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is required.");
if (!token) throw new Error("SANITY_API_TOKEN is required.");

async function query(groq, params = {}) {
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set("query", groq);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(`$${key}`, JSON.stringify(value));
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`Sanity query failed (${response.status}): ${await response.text()}`);
  return (await response.json()).result;
}

async function mutate(mutations) {
  const response = await fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}?returnIds=true`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations }),
  });
  if (!response.ok) throw new Error(`Sanity mutation failed (${response.status}): ${await response.text()}`);
  return response.json();
}

const article = await query(`*[_type == "article" && _id in path("drafts.**") && morningPackageEligible == true && title match "*Henderson*"] | order(_updatedAt desc)[0]{
  _id,title,standfirst,"bodyText": pt::text(body),"featuredAsset": featuredImage.asset._ref
}`);

if (!article?._id) throw new Error("No current morning-package Henderson draft found; fail closed.");
if (!article.featuredAsset) {
  console.log(JSON.stringify({ status: "no-featured-image", articleId: article._id, title: article.title }, null, 2));
  process.exit(0);
}

const currentImage = await query(`*[_type == "editorialImage" && image.asset._ref == $asset][0]{
  _id,title,altText,caption,"assetRef": image.asset._ref
}`, { asset: article.featuredAsset });

const articleText = [article.title, article.standfirst, article.bodyText].filter(Boolean).join(" ").toLowerCase();
const currentMetadata = [currentImage?.title, currentImage?.altText, currentImage?.caption].filter(Boolean).join(" ");
const wrongNamedPerson = /\bpaddy\s+jackson\b/i.test(currentMetadata) && !/\bpaddy\s+jackson\b/i.test(articleText);

if (!wrongNamedPerson) {
  console.log(JSON.stringify({
    status: "current-image-not-confirmed-wrong",
    articleId: article._id,
    title: article.title,
    currentImageId: currentImage?._id ?? null,
    currentImageTitle: currentImage?.title ?? null,
  }, null, 2));
  process.exit(0);
}

const replacement = await query(`*[_type == "editorialImage" && usageApproved == true && lifecycleStatus in ["approved", "published"] && defined(image.asset._ref) && (
  lower(title) match "*iain henderson*" || lower(altText) match "*iain henderson*" || lower(caption) match "*iain henderson*" ||
  lower(title) match "*henderson*" || lower(altText) match "*henderson*" || lower(caption) match "*henderson*"
)] | order(_updatedAt desc)[0]{
  _id,title,altText,caption,publicCredit,creditLine,photographer,copyrightLine,copyright,source,sourceName,rightsNotes,image
}`);

let mutation;
let expectedAsset = null;
if (replacement?.image?.asset?._ref) {
  expectedAsset = replacement.image.asset._ref;
  const featuredImage = {
    ...replacement.image,
    _type: "image",
    alt: replacement.altText ?? replacement.title ?? "Iain Henderson",
    caption: replacement.caption,
    photographer: replacement.publicCredit ?? replacement.creditLine ?? replacement.photographer,
    source: replacement.source ?? replacement.sourceName,
    rights: [replacement.copyrightLine ?? replacement.copyright, replacement.rightsNotes].filter(Boolean).join(" — ") || undefined,
  };
  mutation = { patch: { id: article._id, set: { featuredImage } } };
} else {
  mutation = { patch: { id: article._id, unset: ["featuredImage"] } };
}

await mutate([mutation]);
const verified = await query(`*[_id == $id][0]{_id,title,"featuredAsset": featuredImage.asset._ref}`, { id: article._id });

if (expectedAsset && verified?.featuredAsset !== expectedAsset) {
  throw new Error(`Replacement image did not persist: expected ${expectedAsset}, got ${verified?.featuredAsset ?? "none"}`);
}
if (!expectedAsset && verified?.featuredAsset) {
  throw new Error(`Wrong image removal did not persist: still ${verified.featuredAsset}`);
}

console.log(JSON.stringify({
  status: expectedAsset ? "replaced-and-verified" : "removed-and-verified",
  articleId: article._id,
  title: article.title,
  oldImageId: currentImage?._id ?? null,
  oldImageTitle: currentImage?.title ?? null,
  replacementImageId: replacement?._id ?? null,
  replacementImageTitle: replacement?.title ?? null,
  verifiedFeaturedAsset: verified?.featuredAsset ?? null,
}, null, 2));
