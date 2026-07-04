import { getPublishedArticles, getPublishedCategories, siteUrl } from "@/lib/cms";

export const revalidate = 300;

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function sitemapUrl(url: string, lastModified?: string, priority = "0.7") {
  const lastmod = lastModified ? `<lastmod>${escapeXml(new Date(lastModified).toISOString())}</lastmod>` : "";

  return `<url><loc>${escapeXml(url)}</loc>${lastmod}<priority>${priority}</priority></url>`;
}

export async function GET() {
  const [articles, categories] = await Promise.all([getPublishedArticles(), getPublishedCategories()]);
  const now = new Date().toISOString();
  const urls = [
    sitemapUrl(siteUrl("/"), now, "1.0"),
    ...categories.map((category) => sitemapUrl(siteUrl(`/categories/${category.slug}`), now, "0.8")),
    ...articles.map((article) =>
      sitemapUrl(siteUrl(`/articles/${article.slug}`), article.updatedAt ?? article.publishedAt, "0.9"),
    ),
  ];

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
