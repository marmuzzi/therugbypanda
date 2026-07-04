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
    return {
      title: "Category not found | The Rugby Panda",
    };
  }

  const title = `${category.title} rugby news | The Rugby Panda`;
  const description =
    category.description ?? `Independent rugby coverage, analysis and context for ${category.title}.`;
  const url = categoryUrl(category.slug);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
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

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />

      <section className="border-b border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-6 md:py-20">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#4CAF50]">
            Category
          </p>
          <h1 className="mt-4 text-5xl font-black leading-none tracking-tight md:text-7xl">
            {category.title}
          </h1>
          {category.description ? (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
              {category.description}
            </p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-6 md:py-16">
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
