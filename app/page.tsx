import ArticleCard from "@/components/ArticleCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  analysisArticles,
  featuredArticle,
  latestArticles,
  provinceArticles,
  sections,
} from "@/lib/articles";

export default function Home() {
  const secondaryArticles = latestArticles.filter(
    (article) => article.title !== featuredArticle.title,
  );

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />

      <section className="border-b border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:px-6 md:py-16 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)] lg:items-stretch">
          <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#4CAF50]">
              Lead story
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-none tracking-tight md:text-7xl">
              {featuredArticle.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300 md:text-xl">
              {featuredArticle.excerpt}
            </p>
            <a
              href={featuredArticle.href}
              className="mt-8 inline-flex rounded-full bg-[#4CAF50] px-6 py-3 text-sm font-black uppercase tracking-wider text-zinc-950 transition hover:bg-[#9BE564]"
            >
              Read the preview
            </a>
          </article>

          <aside className="rounded-[2rem] border border-white/10 bg-white p-6 text-zinc-950 md:p-8">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2E7D32]">
              Editor’s note
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight">
              Built for Irish rugby readers who want context.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              The Rugby Panda is taking shape as an independent newsroom for the four provinces, Ireland, the URC and Europe.
            </p>
            <div className="mt-6 rounded-2xl bg-zinc-100 p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                Coverage focus
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Match understanding, squad context, tactical trends and stories that explain why the rugby matters.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-6 md:py-16">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2E7D32]">
              Latest
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">
              Fresh from the newsroom
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-zinc-500">
            Sample editorial cards are being used while the publishing workflow and content index are built.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {secondaryArticles.map((article) => (
            <ArticleCard key={article.title} {...article} />
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-6 md:py-16">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2E7D32]">
                Provinces
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">
                Four provinces, one newsroom
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-zinc-500">
              Leinster, Munster, Ulster and Connacht coverage will become dedicated destinations as the site grows.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {provinceArticles.map((article) => (
              <ArticleCard key={article.title} {...article} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:px-6 md:py-16 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2E7D32]">
            Analysis
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">
            Stories with a second layer
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {analysisArticles.map((article) => (
              <ArticleCard key={article.title} {...article} />
            ))}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-zinc-200 bg-zinc-950 p-6 text-white md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#4CAF50]">
            Reader support
          </p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight">
            Help build an independent rugby newsroom.
          </h2>
          <p className="mt-4 text-sm leading-6 text-zinc-300">
            Sponsorship, newsletter and support tools will be added carefully, always outside the editorial copy and clearly labelled.
          </p>
        </aside>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-6 md:py-16">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2E7D32]">
            Sections
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {sections.map((section) => (
              <a
                key={section.label}
                href={section.href}
                className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-lg font-black text-zinc-950 transition hover:border-[#2E7D32] hover:text-[#2E7D32]"
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
