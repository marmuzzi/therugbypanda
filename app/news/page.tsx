import type { Metadata } from "next";

import ArticleCard from "@/components/ArticleCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getNewsArticles } from "@/lib/cms";

export const metadata: Metadata = {
  title: "News",
  description: "All published rugby news and analysis from The Rugby Panda newsroom.",
};

export default async function NewsPage() {
  const articles = await getNewsArticles();

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />

      <section className="border-b border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-12">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#9BE564]">Newsroom</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">All news</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
            Every published story from The Rugby Panda, ordered from newest to oldest.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        {articles.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.href} {...article} />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl border border-dashed border-zinc-300 p-8 text-sm font-semibold text-zinc-500">
            No published articles yet.
          </p>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
