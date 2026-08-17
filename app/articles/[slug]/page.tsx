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
  siteUrl,
} from "@/lib/cms";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return { title: "Article not found | The Rugby Panda" };

  const featuredImage = getFeaturedImage(article);
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
  const featuredImage = getFeaturedImage(cmsArticle);
  const editorialImage = cmsArticle.useBrandImage ? undefined : featuredImage;
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

      <div className="mx-auto max-w-[920px] px-5 pb-20 pt-7 md:px-6 md:pt-9">
        {editorialImage ? (
          <figure className="mb-9">
            <div className="overflow-hidden rounded-2xl bg-zinc-100">
              <img
                src={editorialImage.src}
                alt={editorialImage.alt}
                className="h-[220px] w-full object-cover sm:h-[280px] md:h-[340px]"
              />
            </div>
            {editorialImage.caption || editorialImage.credit ? (
              <figcaption className="mt-2 text-xs leading-5 text-zinc-500">
                {[editorialImage.caption, editorialImage.credit].filter(Boolean).join(" — ")}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <div className="space-y-10">
          {cmsArticle.body?.length ? (
            <ArticleBody body={cmsArticle.body} />
          ) : (
            <p className="rounded-3xl border border-dashed border-zinc-300 p-8 text-sm font-semibold text-zinc-500">
              This article has no body content yet.
            </p>
          )}

          {cmsArticle.keyPoints?.length ? <KeyPoints points={cmsArticle.keyPoints} /> : null}

          <ReaderSupport
            title="Independent rugby coverage takes time."
            body="Future partner placements will sit clearly outside the editorial copy, helping support the newsroom without interrupting the reader experience."
          />
          {cmsArticle.tags?.length ? <TagList tags={cmsArticle.tags} /> : null}
          {continueReading.length ? <ContinueReading articles={continueReading} /> : null}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
