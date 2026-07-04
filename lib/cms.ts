import { sanityFetch, urlForImage } from "@/lib/sanity";

export type ArticleSummary = {
  category: string;
  title: string;
  excerpt: string;
  href: string;
  meta?: string;
  featured?: boolean;
  section?: string;
  image?: string;
  imageAlt?: string;
};

export type SectionLink = {
  label: string;
  href: string;
};

type SanityImage = {
  asset?: {
    _ref?: string;
    _type?: "reference";
  };
  alt?: string;
  caption?: string;
  photographer?: string;
  source?: string;
  rights?: string;
};

type SanityArticleSummary = {
  title: string;
  slug?: string;
  standfirst?: string;
  publishedAt?: string;
  readingTime?: string;
  isLead?: boolean;
  category?: string;
  categorySlug?: string;
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
  categorySlug?: string;
  province?: string;
  competition?: string;
  tags?: string[];
  keyPoints?: string[];
  featuredImage?: SanityImage;
  body?: Array<{ _type?: string; children?: Array<{ text?: string }>; style?: string }>;
};

export type CmsCategory = {
  title: string;
  slug: string;
  description?: string;
};

export type CmsSitemapArticle = {
  title: string;
  slug: string;
  standfirst?: string;
  publishedAt?: string;
  updatedAt?: string;
  category?: string;
  categorySlug?: string;
  province?: string;
  competition?: string;
};

const articleSummaryFields = `
  title,
  "slug": slug.current,
  standfirst,
  publishedAt,
  readingTime,
  isLead,
  "category": category->title,
  "categorySlug": category->slug.current,
  "province": province->title,
  "competition": competition->title,
  featuredImage
`;

const homepageArticlesQuery = `*[_type == "article" && defined(slug.current)] | order(isLead desc, publishedAt desc)[0...12]{${articleSummaryFields}}`;

const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  standfirst,
  publishedAt,
  updatedAt,
  readingTime,
  "category": category->title,
  "categorySlug": category->slug.current,
  "province": province->title,
  "competition": competition->title,
  "tags": tags[]->title,
  keyPoints,
  featuredImage,
  body
}`;

const continueReadingQuery = `*[_type == "article" && defined(slug.current) && slug.current != $slug] | order(publishedAt desc)[0...3]{${articleSummaryFields}}`;

const categoryLinksQuery = `*[_type == "category" && defined(slug.current)] | order(title asc){
  title,
  "slug": slug.current
}`;

const categoryBySlugQuery = `*[_type == "category" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  description
}`;

const categoryArticlesQuery = `*[_type == "article" && defined(slug.current) && category->slug.current == $slug] | order(publishedAt desc)[0...24]{${articleSummaryFields}}`;

const sitemapArticlesQuery = `*[_type == "article" && defined(slug.current)] | order(publishedAt desc){
  title,
  "slug": slug.current,
  standfirst,
  publishedAt,
  updatedAt,
  "category": category->title,
  "categorySlug": category->slug.current,
  "province": province->title,
  "competition": competition->title
}`;

const sitemapCategoriesQuery = `*[_type == "category" && defined(slug.current)] | order(title asc){
  title,
  "slug": slug.current,
  description
}`;

const primarySectionOrder = ["Provinces", "Ireland", "URC", "Europe"];

function formatDate(date?: string) {
  if (!date) return undefined;

  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function uniqueLabels(labels: Array<string | undefined>) {
  const seen = new Set<string>();

  return labels.filter((label): label is string => {
    if (!label || seen.has(label)) return false;

    seen.add(label);
    return true;
  });
}

function formatCategory(article: SanityArticleSummary | CmsArticle | CmsSitemapArticle) {
  return uniqueLabels([article.category, article.province, article.competition]).join(" • ");
}

function imageUrl(image?: SanityImage) {
  return image?.asset?._ref ? urlForImage(image).width(1200).height(800).url() : undefined;
}

function mapArticleSummary(article: SanityArticleSummary): ArticleSummary {
  const published = formatDate(article.publishedAt);

  return {
    category: formatCategory(article) || "News",
    title: article.title,
    excerpt: article.standfirst ?? "",
    href: article.slug ? `/articles/${article.slug}` : "#",
    meta: [article.readingTime, published].filter(Boolean).join(" • ") || undefined,
    featured: article.isLead,
    section: article.province ?? article.competition ?? article.category,
    image: imageUrl(article.featuredImage),
    imageAlt: article.featuredImage?.alt,
  };
}

export function siteUrl(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `https://therugbypanda.ie${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function articleUrl(slug: string) {
  return siteUrl(`/articles/${slug}`);
}

export function categoryUrl(slug: string) {
  return siteUrl(`/categories/${slug}`);
}

export function articleLabel(article: CmsArticle | CmsSitemapArticle) {
  return formatCategory(article) || "News";
}

export async function getHomepageArticles() {
  const cmsArticles = await sanityFetch<SanityArticleSummary[]>({ query: homepageArticlesQuery });
  const mapped = cmsArticles?.map(mapArticleSummary) ?? [];

  return {
    featured: mapped.find((article) => article.featured) ?? mapped[0] ?? null,
    latest: mapped,
  };
}

export async function getArticleBySlug(slug: string) {
  return sanityFetch<CmsArticle>({ query: articleBySlugQuery, params: { slug } });
}

export async function getContinueReading(slug: string) {
  const articles = await sanityFetch<SanityArticleSummary[]>({ query: continueReadingQuery, params: { slug } });
  return articles?.map(mapArticleSummary) ?? [];
}

export async function getSectionLinks(): Promise<SectionLink[]> {
  const categories = await sanityFetch<Array<{ title: string; slug: string }>>({ query: categoryLinksQuery });
  const categoryLinks =
    categories?.map((category) => ({
      label: category.title,
      href: `/categories/${category.slug}`,
    })) ?? [];
  const sortedCategoryLinks = categoryLinks.sort((a, b) => {
    const aIndex = primarySectionOrder.indexOf(a.label);
    const bIndex = primarySectionOrder.indexOf(b.label);

    if (aIndex !== -1 || bIndex !== -1) {
      return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) - (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex);
    }

    return a.label.localeCompare(b.label);
  });

  return [
    { label: "News", href: "/" },
    ...sortedCategoryLinks.filter((section) => section.href !== "/categories/news"),
  ];
}

export async function getCategoryPage(slug: string) {
  const [category, articles] = await Promise.all([
    sanityFetch<CmsCategory>({ query: categoryBySlugQuery, params: { slug } }),
    sanityFetch<SanityArticleSummary[]>({ query: categoryArticlesQuery, params: { slug } }),
  ]);

  return {
    category,
    articles: articles?.map(mapArticleSummary) ?? [],
  };
}

export async function getPublishedArticles() {
  return (await sanityFetch<CmsSitemapArticle[]>({ query: sitemapArticlesQuery })) ?? [];
}

export async function getPublishedCategories() {
  return (await sanityFetch<CmsCategory[]>({ query: sitemapCategoriesQuery })) ?? [];
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

export function getFeaturedImage(article?: CmsArticle | null) {
  const image = imageUrl(article?.featuredImage);

  if (!image) return null;

  return {
    src: image,
    alt: article?.featuredImage?.alt ?? "",
    caption: article?.featuredImage?.caption,
    credit: [article?.featuredImage?.photographer, article?.featuredImage?.source].filter(Boolean).join(" / "),
  };
}
