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
  getArticleBySlug,
  getContinueReading,
  getFeaturedImage,
  portableTextToSections,
} from "@/lib/cms";

const baseUrl = "https://therugbypanda.ie";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article not found | The Rugby Panda" };
  }

  const description = article.standfirst ?? "Independent Irish and European rugby coverage from The Rugby Panda.";
  const image = getFeaturedImage(article);

  return {
    title: `${article.title} | The Rugby Panda`,
    description,
    alternates: {
      canonical: `/articles/${slug}`,
    },
    openGraph: {
      title: article.title,
      description,
      type: "article",
      url: `${baseUrl}/articles/${slug}`,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      images: image ? [{ url: image.src, alt: image.alt }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: article.title,
      description,
      images: image ? [image.src] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [cmsArticle, continueReading] = await Promise.all([
    getArticleBySlug(slug),
    getContinueReading(slug),
  ]);

  if (!cmsArticle) {
    notFound();
  }

  const category = [cmsArticle.category, cmsArticle.province ?? cmsArticle.competition]
    .filter(Boolean)
    .join(" • ");
  const sections = portableTextToSections(cmsArticle.body);
  const featuredImage = getFeaturedImage(cmsArticle);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: cmsArticle.title,
    description: cmsArticle.standfirst,
    datePublished: cmsArticle.publishedAt,
    dateModified: cmsArticle.updatedAt ?? cmsArticle.publishedAt,
    mainEntityOfPage: `${baseUrl}/articles/${slug}`,
    image: featuredImage ? [featuredImage.src] : undefined,
    author: {
      "@type": "Organization",
      name: "The Rugby Panda",
    },
    publisher: {
      "@type": "Organization",
      name: "The Rugby Panda",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/rugby-panda-logo.png`,
      },
    },
  };

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <SiteHeader />

      <ArticleHeader
        category={category || "News"}
        title={cmsArticle.title}
        subtitle={cmsArticle.standfirst ?? ""}
        published={articleDateLabel(cmsArticle.publishedAt)}
        updated={articleDateLabel(cmsArticle.updatedAt ?? cmsArticle.publishedAt)}
        readingTime={cmsArticle.readingTime ?? "Read"}
      />

      {featuredImage ? (
        <figure className="mx-auto max-w-6xl px-5 pb-10 md:px-6">
          <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-100">
            <img src={featuredImage.src} alt={featuredImage.alt} className="aspect-[16/9] w-full object-cover" />
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
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#2E7D32]">
              The Rugby Panda
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Independent Irish and European rugby coverage, built around context, analysis and match understanding.
            </p>
          </div>

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
