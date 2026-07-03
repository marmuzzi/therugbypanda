import { featuredArticle, latestArticles, type ArticleSummary } from "@/lib/articles";
import { sanityFetch, urlForImage } from "@/lib/sanity";

type SanityImage = {
  asset?: {
    _ref?: string;
    _type?: "reference";
  };
  alt?: string;
};

type SanityArticleSummary = {
  title: string;
  slug?: string;
  standfirst?: string;
  publishedAt?: string;
  readingTime?: string;
  isLead?: boolean;
  category?: string;
  province?: string;
  competition?: string;
  featuredImage?: SanityImage;
};

export type CmsArticle = {
  title: string;
  slug?: string;
  standfirst?: string;
  publishedAt?: string;
  updatedAt?: string;
  readingTime?: string;
  category?: string;
  province?: string;
  competition?: string;
  tags?: string[];
  keyPoints?: string[];
  body?: Array<{ _type?: string; children?: Array<{ text?: string }>; style?: string }>;
};

const homepageArticlesQuery = `*[_type == "article"] | order(isLead desc, publishedAt desc)[0...12]{
  title,
  "slug": slug.current,
  standfirst,
  publishedAt,
  readingTime,
  isLead,
  "category": category->title,
  "province": province->title,
  "competition": competition->title,
  featuredImage
}`;

const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  standfirst,
  publishedAt,
  updatedAt,
  readingTime,
  "category": category->title,
  "province": province->title,
  "competition": competition->title,
  "tags": tags[]->title,
  keyPoints,
  body
}`;

function formatDate(date?: string) {
  if (!date) return undefined;

  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatCategory(article: SanityArticleSummary) {
  return [article.category, article.province ?? article.competition].filter(Boolean).join(" • ");
}

function mapArticleSummary(article: SanityArticleSummary): ArticleSummary {
  const published = formatDate(article.publishedAt);
  const image = article.featuredImage?.asset?._ref
    ? urlForImage(article.featuredImage).width(1200).height(800).url()
    : undefined;

  return {
    category: formatCategory(article) || "News",
    title: article.title,
    excerpt: article.standfirst ?? "",
    href: article.slug ? `/articles/${article.slug}` : "#",
    meta: [article.readingTime, published].filter(Boolean).join(" • ") || "News",
    featured: article.isLead,
    section: article.province ?? article.competition ?? article.category,
    image,
    imageAlt: article.featuredImage?.alt,
  };
}

export async function getHomepageArticles() {
  const cmsArticles = await sanityFetch<SanityArticleSummary[]>({ query: homepageArticlesQuery });

  if (!cmsArticles?.length) {
    return {
      featured: featuredArticle,
      latest: latestArticles,
    };
  }

  const mapped = cmsArticles.map(mapArticleSummary);

  return {
    featured: mapped.find((article) => article.featured) ?? mapped[0],
    latest: mapped,
  };
}

export async function getArticleBySlug(slug: string) {
  return sanityFetch<CmsArticle>({ query: articleBySlugQuery, params: { slug } });
}

export function portableTextToSections(body: CmsArticle["body"] = []) {
  const sections: Array<{ heading?: string; paragraphs: string[] }> = [];

  body.forEach((block) => {
    if (block._type !== "block") return;

    const text = block.children?.map((child) => child.text ?? "").join("").trim();
    if (!text) return;

    if (block.style === "h2") {
      sections.push({ heading: text, paragraphs: [] });
      return;
    }

    const currentSection = sections.at(-1) ?? { paragraphs: [] };
    currentSection.paragraphs.push(text);

    if (!sections.length) {
      sections.push(currentSection);
    }
  });

  return sections.filter((section) => section.heading || section.paragraphs.length);
}

export function articleDateLabel(date?: string) {
  return formatDate(date) ?? "Draft";
}
