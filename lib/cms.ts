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

export type FeaturedImage = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
};

export type ArticleBodySection = {
  heading?: string;
  paragraphs: string[];
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

const categoryBySlugQuery = `*[_type == "category" && slug.current in $slugs][0]{
  title,
  "slug": slug.current,
  description
}`;

const categoryArticlesQuery = `*[_type == "article" && defined(slug.current) && category->slug.current in $slugs] | order(publishedAt desc)[0...24]{${articleSummaryFields}}`;

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

const primarySectionOrder = ["Provinces", "Ireland", "URC", "International"];

function categorySlugs(slug: string) {
  return slug === "international" ? ["international", "europe"] : [slug];
}

function normaliseCategory(category?: CmsCategory | null): CmsCategory | null {
  if (!category) return null;

  if (category.slug === "europe") {
    return {
      ...category,
      title: "International",
      slug: "international",
      description:
        category.description ??
        "International rugby coverage, including major test windows, tournaments and cross-border storylines.",
    };
  }

  return category;
}

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
  const category = article.category === "Europe" ? "International" : article.category;
  const competition = article.competition === "Europe" ? "International" : article.competition;

  return uniqueLabels([category, article.province, competition]).join(" • ");
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

export function articleDateLabel(date?: string) {
  return formatDate(date) ?? "Date to be confirmed";
}

export function getFeaturedImage(article: CmsArticle): FeaturedImage | undefined {
  const src = imageUrl(article.featuredImage);

  if (!src) return undefined;

  return {
    src,
    alt: article.featuredImage?.alt ?? article.title,
    caption: article.featuredImage?.caption,
    credit: [article.featuredImage?.photographer, article.featuredImage?.source]
      .filter(Boolean)
      .join(" / ") || article.featuredImage?.rights,
  };
}

export function portableTextToSections(body: CmsArticle["body"]): ArticleBodySection[] {
  if (!body?.length) return [];

  const sections: ArticleBodySection[] = [];

  for (const block of body) {
    const text = block.children?.map((child) => child.text ?? "").join("").trim();

    if (!text) continue;

    if (block.style === "h2") {
      sections.push({ heading: text, paragraphs: [] });
      continue;
    }

    const currentSection = sections.at(-1);

    if (currentSection) {
      currentSection.paragraphs.push(text);
    } else {
      sections.push({ paragraphs: [text] });
    }
  }

  return sections.filter((section) => section.heading || section.paragraphs.length > 0);
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
    categories?.map((category) => {
      const normalised = normaliseCategory({ title: category.title, slug: category.slug });
      return {
        label: normalised?.title ?? category.title,
        href: `/categories/${normalised?.slug ?? category.slug}`,
      };
    }) ?? [];
  const dedupedCategoryLinks = categoryLinks.filter(
    (category, index, all) => all.findIndex((item) => item.href === category.href) === index,
  );
  const sortedCategoryLinks = dedupedCategoryLinks.sort((a, b) => {
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
  const slugs = categorySlugs(slug);
  const [category, articles] = await Promise.all([
    sanityFetch<CmsCategory>({ query: categoryBySlugQuery, params: { slugs } }),
    sanityFetch<SanityArticleSummary[]>({ query: categoryArticlesQuery, params: { slugs } }),
  ]);

  return {
    category: normaliseCategory(category),
    articles: articles?.map(mapArticleSummary) ?? [],
  };
}

export async function getSitemapArticles(): Promise<CmsSitemapArticle[]> {
  return (await sanityFetch<CmsSitemapArticle[]>({ query: sitemapArticlesQuery })) ?? [];
}

export async function getSitemapCategories(): Promise<CmsCategory[]> {
  const categories = await sanityFetch<CmsCategory[]>({ query: sitemapCategoriesQuery });

  return categories?.map(normaliseCategory).filter((category): category is CmsCategory => Boolean(category)) ?? [];
}

export async function getPublishedArticles(): Promise<CmsSitemapArticle[]> {
  return getSitemapArticles();
}

export async function getPublishedCategories(): Promise<CmsCategory[]> {
  return getSitemapCategories();
}
