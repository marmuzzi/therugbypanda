import ArticleCard from "@/components/ArticleCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getCategoryPage } from "@/lib/cms";

export default async function ProvincesCategoryPage() {
  const { category, articles } = await getCategoryPage("provinces");

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />

      <section className="border-b border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-6 md:py-20">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#4CAF50]">
            Category
          </p>
          <h1 className="mt-4 text-5xl font-black leading-none tracking-tight md:text-7xl">
            {category?.title ?? "Provinces"}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            {category?.description ?? "Coverage and analysis across Leinster, Munster, Ulster and Connacht."}
          </p>
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
            No published province articles yet.
          </p>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
