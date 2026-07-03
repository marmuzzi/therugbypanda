import type { MetadataRoute } from "next";

import { getSectionLinks, getSitemapArticles } from "@/lib/cms";

const baseUrl = "https://therugbypanda.ie";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [sections, articles] = await Promise.all([getSectionLinks(), getSitemapArticles()]);
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...sections
      .filter((section) => section.href !== "/")
      .map((section) => ({
        url: `${baseUrl}${section.href}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
    ...(articles ?? []).map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: article.updatedAt ?? article.publishedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
