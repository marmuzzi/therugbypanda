import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArticleBody from "@/components/ArticleBody";
import ArticleHeader from "@/components/ArticleHeader";
import ContextualDataCard from "@/components/ContextualDataCard";
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
  type CmsArticle,
} from "@/lib/cms";

type ArticlePageProps = { params: Promise<{ slug: string }> };
type Presentation = "news" | "analysis" | "feature" | "notebook" | "explainer";

function presentationFor(article: CmsArticle): Presentation {
  const labels = [article.category, article.competition, ...(article.tags ?? [])].join(" ").toLowerCase();
  const headings = article.body?.filter((block) => block.style === "h2").length ?? 0;
  const keyPoints = article.keyPoints?.length ?? 0;
  if (/opinion|analysis/.test(labels)) return "analysis";
  if (/explainer|guide|preview/.test(labels) || keyPoints >= 4) return "explainer";
  if (/feature|interview|profile/.test(labels)) return "feature";
  if (headings >= 3) return "notebook";
  return "news";
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };
  const featuredImage = getFeaturedImage(article);
  const pageTitle = article.title;
  const socialTitle = `${article.title} | The Rugby Panda`;
  const description = article.standfirst ?? "Independent Irish and European rugby coverage from The Rugby Panda.";
  const url = article.slug ? articleUrl(article.slug) : siteUrl("/");
  return {
    title: pageTitle, description, alternates: { canonical: url },
    openGraph: { title: socialTitle, description, url, siteName: "The Rugby Panda", type: "article", publishedTime: article.publishedAt, modifiedTime: article.updatedAt ?? article.publishedAt, section: articleLabel(article), images: featuredImage ? [{ url: featuredImage.src, alt: featuredImage.alt || article.title }] : undefined },
    twitter: { card: featuredImage ? "summary_large_image" : "summary", title: socialTitle, description, images: featuredImage ? [featuredImage.src] : undefined },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [cmsArticle, continueReading] = await Promise.all([getArticleBySlug(slug), getContinueReading(slug)]);
  if (!cmsArticle) notFound();

  const category = [cmsArticle.category, cmsArticle.province ?? cmsArticle.competition].filter(Boolean).join(" • ");
  const featuredImage = getFeaturedImage(cmsArticle);
  const editorialImage = cmsArticle.useBrandImage ? undefined : featuredImage;
  const canonicalUrl = cmsArticle.slug ? articleUrl(cmsArticle.slug) : siteUrl("/");
  const presentation = presentationFor(cmsArticle);
  const beforeBody = presentation === "analysis" || presentation === "explainer";
  const wideHero = presentation === "feature";
  const insetHero = presentation === "analysis";
  const notebook = presentation === "notebook";
  const imageClassName = wideHero ? "h-[300px] w-full object-cover sm:h-[420px] md:h-[540px]" : insetHero ? "h-[230px] w-full object-cover sm:h-[300px] md:h-[360px]" : notebook ? "h-[250px] w-full object-cover sm:h-[330px] md:h-[410px]" : "h-[230px] w-full object-cover sm:h-[300px] md:h-[370px]";
  const shellClassName = wideHero ? "max-w-[1180px] pt-4 md:pt-6" : notebook ? "max-w-[1040px] pt-8 md:pt-10" : "max-w-[1040px] pt-7 md:pt-9";
  const bodyClassName = wideHero ? "mx-auto max-w-[760px] space-y-12" : notebook ? "md:ml-[12%] max-w-[760px] space-y-8" : insetHero ? "mx-auto max-w-[720px] space-y-10" : "space-y-10";
  const jsonLd = { "@context": "https://schema.org", "@type": "NewsArticle", headline: cmsArticle.title, description: cmsArticle.standfirst, datePublished: cmsArticle.publishedAt, dateModified: cmsArticle.updatedAt ?? cmsArticle.publishedAt, mainEntityOfPage: canonicalUrl, url: canonicalUrl, articleSection: articleLabel(cmsArticle), image: featuredImage ? [featuredImage.src] : undefined, publisher: { "@type": "Organization", name: "The Rugby Panda", url: siteUrl("/"), logo: siteUrl("/rugby-panda-logo.png") } };

  const imageFigure = editorialImage ? (
    <figure className={insetHero ? "mb-8 md:ml-auto md:w-[76%]" : wideHero ? "mb-12" : notebook ? "mb-8 md:w-[88%]" : "mb-9"}>
      <div className={wideHero ? "overflow-hidden bg-zinc-100" : "overflow-hidden rounded-2xl bg-zinc-100"}>
        <img src={editorialImage.src} alt={editorialImage.alt} className={imageClassName} />
      </div>
      {editorialImage.caption || editorialImage.credit ? <figcaption className="mt-2 text-xs leading-5 text-zinc-500">{[editorialImage.caption, editorialImage.credit].filter(Boolean).join(" — ")}</figcaption> : null}
    </figure>
  ) : null;

  const articleBody = cmsArticle.body?.length ? <ArticleBody body={cmsArticle.body} /> : <p className="rounded-3xl border border-dashed border-zinc-300 p-8 text-sm font-semibold text-zinc-500">This article has no body content yet.</p>;

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleHeader category={category || "News"} title={cmsArticle.title} subtitle={cmsArticle.standfirst ?? ""} published={articleDateLabel(cmsArticle.publishedAt)} updated={articleDateLabel(cmsArticle.updatedAt ?? cmsArticle.publishedAt)} readingTime={cmsArticle.readingTime ?? "Read"} />
      <div className={`mx-auto px-5 pb-20 md:px-6 ${shellClassName}`}>
        {presentation !== "notebook" ? imageFigure : null}
        <div className={bodyClassName}>
          {beforeBody && cmsArticle.keyPoints?.length ? <KeyPoints points={cmsArticle.keyPoints} /> : null}
          {presentation === "notebook" ? imageFigure : null}
          {cmsArticle.contextualDataCard ? (
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10">
              {articleBody}
              <div className="order-first lg:order-none lg:sticky lg:top-24">
                <ContextualDataCard card={cmsArticle.contextualDataCard} />
              </div>
            </div>
          ) : articleBody}
          {!beforeBody && cmsArticle.keyPoints?.length ? <KeyPoints points={cmsArticle.keyPoints} /> : null}
          <ReaderSupport title="Independent rugby coverage takes time." body="Future partner placements will sit clearly outside the editorial copy, helping support the newsroom without interrupting the reader experience." />
          {cmsArticle.tags?.length ? <TagList tags={cmsArticle.tags} /> : null}
          {continueReading.length ? <ContinueReading articles={continueReading} /> : null}
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
