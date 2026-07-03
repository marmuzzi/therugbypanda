import type { ArticleSummary } from "@/lib/articles";
import { sanityFetch, urlForImage } from "@/lib/sanity/client";

export type SanityArticleSummary = {
  title: string;
  standfirst?: string;
  slug?: string;
  publishedAt?: string;
  readingTime?: string;
  isLead?: boolean;
  category?: string;
  province?: string;
  competition?: string;
  featuredImage?: {
    asset?: { _ref?: string };
    alt?: string;
  };
};

const homeArticlesQuery = `*[_type == "article" && defined(slug.current)] | order(coalesce(isLead, false) desc, publishedAt desc)[0...12] {
  title,
  standfirst,
  "slug": slug.current,
  publishedAt,
  readingTime,
  isLead,
  "category": category->title,
  "province": province->title,
  "competition": competition->title,
  featuredImage
}`;

function formatPublishedDate(date?: string) {
  if (!date) {
    return "Preview";
  }

  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function toArticleSummary(article: SanityArticleSummary): ArticleSummary {
  const section = article.province ?? article.competition ?? article.category ?? "News";
  const image = article.featuredImage?.asset
    ? urlForImage(article.featuredImage).width(1200).height(800).fit("crop").url()
    : undefined;

  return {
    category: [article.category, article.province ?? article.competition].filter(Boolean).join(" • ") || "News",
    title: article.title,
    excerpt: article.standfirst ?? "Fresh reporting and analysis from The Rugby Panda newsroom.",
    href: article.slug ? `/articles/${article.slug}` : "#",
    meta: [article.readingTime, formatPublishedDate(article.publishedAt)].filter(Boolean).join(" • "),
    featured: article.isLead,
    section,
    image,
    imageAlt: article.featuredImage?.alt ?? article.title,
  };
}

export async function getHomePageArticles() {
  const articles = await sanityFetch<SanityArticleSummary[]>({
    query: homeArticlesQuery,
    tags: ["articles"],
  });

  if (!articles?.length) {
    return null;
  }

  const summaries = articles.map(toArticleSummary);
  const featured = summaries.find((article) => article.featured) ?? summaries[0];

  return {
    featured,
    latest: summaries,
    provinces: summaries.filter((article) =>
      ["Leinster", "Munster", "Ulster", "Connacht"].includes(article.section ?? ""),
    ),
    analysis: summaries.filter((article) =>
      ["Analysis", "Column", "Notebook"].some((label) => article.meta.includes(label) || article.category.includes(label)),
    ),
  };
}
