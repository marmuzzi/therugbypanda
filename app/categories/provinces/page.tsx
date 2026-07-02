import ArticleCard from "@/components/ArticleCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { latestArticles } from "@/lib/articles";

export default function ProvincesCategoryPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />

      <section className="border-b border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-6 md:py-20">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#4CAF50]">
            Category
          </p>
          <h1 className="mt-4 text-5xl font-black leading-none tracking-tight md:text-7xl">
            Provinces
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            Coverage and analysis across Leinster, Munster, Ulster and Connacht.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-6 md:py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((article) => (
            <ArticleCard key={article.title} {...article} featured={false} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
