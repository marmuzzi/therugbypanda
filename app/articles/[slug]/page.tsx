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

function presentationVariant(slug: string): number {
  let hash = 0;
  for (const character of slug) hash = (Math.imul(hash, 31) + character.charCodeAt(0)) | 0;
  return Math.abs(hash) % 3;
}

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
  const variant = presentationVariant(cmsArticle.slug ?? slug);
  const showKeyPointsBeforeBody = variant === 1 && Boolean(cmsArticle.keyPoints?.length);
  const imageClassName =
    variant === 2
      ? "h-[260px] w-full object-cover sm:h-[340px] md:h-[430px]"
      : variant === 1
        ? "h-[210px] w-full object-cover sm:h-[260px] md:h-[310px]"
        : "h-[220px] w-full object-cover sm:h-[280px] md:h-[340px]";
  const imageFrameClassName = variant === 2 ? "overflow-hidden bg-zinc-100" : "overflow-hidden rounded-2xl bg-zinc-100";
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

      <div className={`mx-auto px-5 pb-20 md:px-6 ${variant === 2 ? "max-w-[1080px] pt-5 md:pt-7" : "max-w-[920px] pt-7 md:pt-9"}`}>
        {editorialImage ? (
          <figure className={variant === 1 ? "mb-7 md:ml-auto md:w-[78%]" : "mb-9"}>
            <div className={imageFrameClassName}>
              <img src={editorialImage.src} alt={editorialImage.alt} className={imageClassName} />
            </div>
            {editorialImage.caption || editorialImage.credit ? (
              <figcaption className="mt-2 text-xs leading-5 text-zinc-500">
                {[editorialImage.caption, editorialImage.credit].filter(Boolean).join(" — ")}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <div className={variant === 2 ? "mx-auto max-w-[820px] space-y-10" : "space-y-10"}>
          {showKeyPointsBeforeBody ? <KeyPoints points={cmsArticle.keyPoints ?? []} /> : null}

          {cmsArticle.body?.length ? (
            <ArticleBody body={cmsArticle.body} />
          ) : (
            <p className="rounded-3xl border border-dashed border-zinc-300 p-8 text-sm font-semibold text-zinc-500">
              This article has no body content yet.
            </p>
          )}

          {!showKeyPointsBeforeBody && cmsArticle.keyPoints?.length ? <KeyPoints points={cmsArticle.keyPoints} /> : null}

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
