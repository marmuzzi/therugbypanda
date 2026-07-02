import ArticleCard from "@/components/ArticleCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { latestArticles, sections } from "@/lib/articles";

export default function Home() {
  const [featuredArticle, ...secondaryArticles] = latestArticles;

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />

      <section className="border-b border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-6 md:py-24">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#4CAF50]">
            Independent Irish and European rugby coverage
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-none tracking-tight md:text-7xl">
            The Rugby Panda newsroom is taking shape.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300 md:text-xl">
            Context, analysis and match understanding across the four Irish provinces, Ireland, the URC and European rugby.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-6 md:py-16">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2E7D32]">
              Latest
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">
              Rugby coverage with context
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-zinc-500">
            This v0.2 homepage uses sample editorial cards while the newsroom structure, CMS and publishing workflow are built out.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
          <ArticleCard {...featuredArticle} />

          <div className="grid gap-6">
            {secondaryArticles.map((article) => (
              <ArticleCard key={article.title} {...article} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-6 md:py-16">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2E7D32]">
            Sections
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sections.map((section) => (
              <a
                key={section}
                href={`/categories/${section.toLowerCase()}`}
                className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-lg font-black text-zinc-950 transition hover:border-[#2E7D32] hover:text-[#2E7D32]"
              >
                {section}
              </a>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
