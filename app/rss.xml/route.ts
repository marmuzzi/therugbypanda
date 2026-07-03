import { getFeedArticles } from "@/lib/cms";

const baseUrl = "https://therugbypanda.ie";

function escapeXml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const articles = await getFeedArticles();
  const items = (articles ?? [])
    .map((article) => {
      const url = `${baseUrl}/articles/${article.slug}`;
      const pubDate = article.publishedAt ? new Date(article.publishedAt).toUTCString() : new Date().toUTCString();

      return `
        <item>
          <title>${escapeXml(article.title)}</title>
          <link>${url}</link>
          <guid>${url}</guid>
          <description>${escapeXml(article.standfirst)}</description>
          <category>${escapeXml(article.category)}</category>
          <pubDate>${pubDate}</pubDate>
        </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>The Rugby Panda</title>
        <link>${baseUrl}</link>
        <description>Independent Irish and European rugby coverage from The Rugby Panda.</description>
        <language>en-ie</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${items}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
