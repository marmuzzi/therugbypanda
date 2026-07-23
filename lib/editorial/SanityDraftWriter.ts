import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import type { EditorialDraftPackage } from "./ArticleDraftTypes";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function textBlock(text: string, style: "normal" | "h2" = "normal") {
  const key = crypto.randomUUID().replaceAll("-", "").slice(0, 12);
  return {
    _type: "block",
    _key: key,
    style,
    markDefs: [],
    children: [{ _type: "span", _key: `${key}span`, marks: [], text }],
  };
}

function portableTextBody(article: EditorialDraftPackage["article"]) {
  return article.body.flatMap((section) => [
    ...(section.heading ? [textBlock(section.heading, "h2")] : []),
    ...section.paragraphs.map((paragraph) => textBlock(paragraph)),
  ]);
}

export async function createSanityArticleDraft(pkg: EditorialDraftPackage) {
  const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_AUTH_TOKEN;
  if (!projectId || !dataset) throw new Error("Sanity project configuration is missing.");
  if (!token) throw new Error("SANITY_API_TOKEN or SANITY_AUTH_TOKEN is not configured.");

  const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: "raw",
  });

  const category = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == "category" && (title == $title || slug.current == $slug)][0]{_id}`,
    { title: pkg.editorial.category, slug: slugify(pkg.editorial.category) },
  );

  if (!category?._id) {
    throw new Error(`No Sanity category found for ${pkg.editorial.category}.`);
  }

  const slug = slugify(pkg.article.title);
  const documentId = `drafts.article-${pkg.editorial.inputId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

  const document = {
    _id: documentId,
    _type: "article",
    title: pkg.article.title,
    slug: { _type: "slug", current: slug },
    standfirst: pkg.article.standfirst,
    publishedAt: new Date().toISOString(),
    readingTime: `${Math.max(3, Math.ceil(JSON.stringify(pkg.article.body).split(/\s+/).length / 220))} min read`,
    isLead: false,
    category: { _type: "reference", _ref: category._id },
    keyPoints: pkg.article.keyPoints,
    body: portableTextBody(pkg.article),
    seoTitle: pkg.article.seoTitle,
    seoDescription: pkg.article.seoDescription,
  };

  const result = await writeClient.createOrReplace(document);
  return { id: result._id, slug, studioIntent: `/intent/edit/id=${result._id};type=article/` };
}
