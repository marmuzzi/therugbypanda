import { articleLabel, getPublishedArticles, siteUrl } from "@/lib/cms";

export const revalidate = 300;

function escapeXml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const articles = await getPublishedArticles();
  const latestDate = articles[0]?.updatedAt ?? articles[0]?.publishedAt ?? new Date().toISOString();
  const items = articles
    .slice(0, 20)
    .map((article) => {
      const url = siteUrl(`/articles/${article.slug}`);
      const publishedDate = article.publishedAt ? new Date(article.publishedAt).toUTCString() : new Date().toUTCString();

      return `<item>
<title>${escapeXml(article.title)}</title>
<link>${escapeXml(url)}</link>
<guid isPermaLink="true">${escapeXml(url)}</guid>
<description>${escapeXml(article.standfirst ?? "")}</description>
<category>${escapeXml(articleLabel(article))}</category>
<pubDate>${publishedDate}</pubDate>
</item>`;
    })
    .join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>The Rugby Panda</title>
<link>${escapeXml(siteUrl("/"))}</link>
<description>Independent Irish and European rugby coverage, insight and analysis.</description>
<language>en-ie</language>
<lastBuildDate>${new Date(latestDate).toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>`, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
