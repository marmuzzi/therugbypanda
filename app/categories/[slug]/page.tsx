import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArticleCard from "@/components/ArticleCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { categoryUrl, getCategoryPage } from "@/lib/cms";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getCategoryPage(slug);

  if (!category) {
    return { title: "Category not found | The Rugby Panda" };
  }

  const title = `${category.title} rugby news | The Rugby Panda`;
  const description =
    category.description ?? `Independent rugby coverage, analysis and context for ${category.title}.`;
  const url = categoryUrl(category.slug);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "The Rugby Panda",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const { category, articles } = await getCategoryPage(slug);

  if (!category) notFound();

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />

      <section className="border-b border-zinc-800 bg-zinc-950 text-white">
        <div className="mx-auto max-w-6xl px-5 py-4 md:px-6 md:py-5">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-[#4CAF50]">
            {category.title} rugby
          </p>
          <div className="mt-1 flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-8">
            <h1 className="text-3xl font-black leading-none tracking-tight md:text-4xl">
              {category.title}
            </h1>
            {category.description ? (
              <p className="max-w-2xl text-sm leading-6 text-zinc-300 md:text-right">
                {category.description}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-6 md:py-12">
        {articles.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.href} {...article} featured={false} />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl border border-dashed border-zinc-300 p-8 text-sm font-semibold text-zinc-500">
            No published articles in this category yet.
          </p>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
