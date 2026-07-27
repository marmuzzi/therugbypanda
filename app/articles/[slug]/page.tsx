import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArticleBody from "@/components/ArticleBody";
import ArticleHeader from "@/components/ArticleHeader";
import ContinueReading from "@/components/ContinueReading";
import KeyPoints from "@/components/KeyPoints";
import ReaderSupport from "@/components/ReaderSupport";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import TagList from "@/components/TagList";
import {
  articleDateLabel,
  articleLabel,
  articleUrl,
  getArticleBySlug,
  getContinueReading,
  getFeaturedImage,
  portableTextToSections,
  siteUrl,
  type CmsArticle,
  type FeaturedImage,
} from "@/lib/cms";
import { sanityFetch, urlForImage } from "@/lib/sanity";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

type ApprovedEditorialImage = {
  title?: string;
  altText?: string;
  image?: {
    asset?: { _ref?: string; _type?: "reference" };
    alt?: string;
  };
};

const approvedEditorialImagesQuery = `*[
  _type == "editorialImage" &&
  lifecycleStatus == "approved" &&
  usageApproved == true &&
  sourceClassification == "the-rugby-panda-original" &&
  defined(image.asset)
] | order(editorialRating desc, title asc)[0...24]{
  title,
  altText,
  image
}`;

function stableIndex(value: string, size: number) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return size ? hash % size : 0;
}

async function resolveFeaturedImage(article: CmsArticle): Promise<FeaturedImage | undefined> {
  const assigned = getFeaturedImage(article);
  if (assigned) return assigned;

  const approvedImages =
    (await sanityFetch<ApprovedEditorialImage[]>({ query: approvedEditorialImagesQuery })) ?? [];
  if (!approvedImages.length) return undefined;

  const selected = approvedImages[stableIndex(article.title, approvedImages.length)];
  const src = selected.image?.asset?._ref
    ? urlForImage(selected.image).width(1600).height(900).fit("crop").url()
    : undefined;

  if (!src) return undefined;

  return {
    src,
    alt: selected.image?.alt ?? selected.altText ?? selected.title ?? article.title,
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article not found | The Rugby Panda" };
  }

  const featuredImage = await resolveFeaturedImage(article);
  const title = `${article.title} | The Rugby Panda`;
  const description = article.standfirst ?? "Independent Irish and European rugby coverage from The Rugby Panda.";
  const url = article.slug ? articleUrl(article.slug) : siteUrl("/");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "The Rugby Panda",
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      section: articleLabel(article),
      images: featuredImage ? [{ url: featuredImage.src, alt: featuredImage.alt || article.title }] : undefined,
    },
    twitter: {
      card: featuredImage ? "summary_large_image" : "summary",
      title,
      description,
      images: featuredImage ? [featuredImage.src] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [cmsArticle, continueReading] = await Promise.all([
    getArticleBySlug(slug),
    getContinueReading(slug),
  ]);

  if (!cmsArticle) notFound();

  const category = [cmsArticle.category, cmsArticle.province ?? cmsArticle.competition]
    .filter(Boolean)
    .join(" • ");
  const sections = portableTextToSections(cmsArticle.body);
  const featuredImage = await resolveFeaturedImage(cmsArticle);
  const canonicalUrl = cmsArticle.slug ? articleUrl(cmsArticle.slug) : siteUrl("/");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: cmsArticle.title,
    description: cmsArticle.standfirst,
    datePublished: cmsArticle.publishedAt,
    dateModified: cmsArticle.updatedAt ?? cmsArticle.publishedAt,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    articleSection: articleLabel(cmsArticle),
    image: featuredImage ? [featuredImage.src] : undefined,
    publisher: {
      "@type": "Organization",
      name: "The Rugby Panda",
      url: siteUrl("/"),
      logo: siteUrl("/rugby-panda-logo.png"),
    },
  };

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ArticleHeader
        category={category || "News"}
        title={cmsArticle.title}
        subtitle={cmsArticle.standfirst ?? ""}
        published={articleDateLabel(cmsArticle.publishedAt)}
        updated={articleDateLabel(cmsArticle.updatedAt ?? cmsArticle.publishedAt)}
        readingTime={cmsArticle.readingTime ?? "Read"}
      />

      {featuredImage ? (
        <figure className="mx-auto max-w-6xl px-5 pt-8 pb-10 md:px-6 md:pt-10">
          <div className={`overflow-hidden rounded-[2rem] border border-zinc-200 ${cmsArticle.useBrandImage ? "bg-white p-8 md:p-12" : "bg-zinc-100"}`}>
            <img
              src={featuredImage.src}
              alt={featuredImage.alt}
              className={cmsArticle.useBrandImage ? "mx-auto max-h-[420px] w-full object-contain" : "aspect-[16/9] w-full object-cover"}
            />
          </div>
          {featuredImage.caption || featuredImage.credit ? (
            <figcaption className="mt-3 text-sm leading-6 text-zinc-500">
              {[featuredImage.caption, featuredImage.credit].filter(Boolean).join(" — ")}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-20 md:grid-cols-[minmax(0,1fr)_320px] md:px-6">
        <div className="min-w-0 space-y-12">
          {cmsArticle.keyPoints?.length ? <KeyPoints points={cmsArticle.keyPoints} /> : null}
          {sections.length ? (
            <ArticleBody sections={sections} />
          ) : (
            <p className="rounded-3xl border border-dashed border-zinc-300 p-8 text-sm font-semibold text-zinc-500">
              This article has no body content yet.
            </p>
          )}
          <ReaderSupport
            title="Independent rugby coverage takes time."
            body="Future partner placements will sit clearly outside the editorial copy, helping support the newsroom without interrupting the reader experience."
          />
          {cmsArticle.tags?.length ? <TagList tags={cmsArticle.tags} /> : null}
          {continueReading.length ? <ContinueReading articles={continueReading} /> : null}
        </div>

        <aside className="space-y-6 md:pt-2">
          <div className="rounded-3xl border border-zinc-200 p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
              Newsletter
            </p>
            <h2 className="mt-3 text-xl font-black tracking-tight text-zinc-950">
              Follow the newsroom build
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Newsletter sign-up will be added in a later version as the publishing workflow develops.
            </p>
          </div>
        </aside>
      </div>

      <SiteFooter />
    </main>
  );
}
