import ArticleCard from "@/components/ArticleCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getHomepageArticles } from "@/lib/cms";

const sections = [
  { label: "News", href: "/news" },
  { label: "Provinces", href: "/categories/provinces" },
  { label: "URC", href: "/categories/urc" },
  { label: "International", href: "/categories/international" },
  { label: "About", href: "/about" },
];

export default async function Home() {
  const { featured, latest } = await getHomepageArticles();
  const nonFeaturedArticles = featured
    ? latest.filter((article) => article.href !== featured.href)
    : latest;
  const secondaryArticles = nonFeaturedArticles;
  const provinceArticles = nonFeaturedArticles.filter((article) =>
    ["Leinster", "Munster", "Ulster", "Connacht"].includes(article.section ?? ""),
  );
  const analysisArticles = nonFeaturedArticles.filter((article) =>
    ["Analysis", "Column", "Notebook"].some(
      (label) => article.meta?.includes(label) || article.category.includes(label),
    ),
  );
  const heroImage = featured?.image ?? "/landing-bg.png";

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />

      <section className="border-b border-zinc-800 bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[minmax(0,0.88fr)_minmax(520px,1.12fr)]">
          <div className="flex min-h-[390px] items-center px-5 py-12 sm:px-8 md:min-h-[430px] md:px-12 lg:min-h-[500px] lg:px-16 xl:px-24">
            <article className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#9BE564]">
                {featured?.category ?? (featured ? "Lead story" : "Coming soon")}
              </p>
              <h1 className="mt-4 max-w-[14ch] text-[2.6rem] font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-[3.25rem] lg:text-[4.35rem]">
                {featured?.title ?? "Irish rugby, told with context."}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300 md:text-lg">
                {featured?.excerpt ??
                  "Independent coverage, analysis and stories from Ireland, the provinces, the URC and international rugby."}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-zinc-400">
                {featured?.meta ? <span>{featured.meta}</span> : null}
                {featured?.meta ? (
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-zinc-600" />
                ) : null}
                <span>The Rugby Panda</span>
              </div>
              {featured ? (
                <a
                  href={featured.href}
                  className="mt-6 inline-flex items-center rounded-full bg-[#7CB342] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-zinc-950 transition hover:bg-[#9BE564]"
                >
                  Read the full story
                </a>
              ) : null}
            </article>
          </div>

          <div className="relative min-h-[300px] overflow-hidden border-t border-zinc-800 lg:min-h-[500px] lg:border-l lg:border-t-0">
            <img
              src={heroImage}
              alt={featured?.imageAlt ?? "Rugby stadium atmosphere"}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent lg:bg-gradient-to-r lg:from-black/20 lg:via-transparent lg:to-transparent" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2E7D32]">Latest</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">
              Fresh from the newsroom
            </h2>
          </div>
          <a href="/news" className="text-sm font-black text-[#2E7D32] hover:underline">
            View all news →
          </a>
        </div>

        {secondaryArticles.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {secondaryArticles.map((article) => (
              <ArticleCard key={article.href} {...article} />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl border border-dashed border-zinc-300 p-8 text-sm font-semibold text-zinc-500">
            No published articles yet.
          </p>
        )}
      </section>

      {provinceArticles.length ? (
        <section className="border-y border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-14">
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
                The latest stories from Leinster, Munster, Ulster and Connacht.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {provinceArticles.map((article) => (
                <ArticleCard key={article.href} {...article} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {analysisArticles.length ? (
        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:px-8 md:py-14 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2E7D32]">
              Analysis
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">
              Stories with a second layer
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {analysisArticles.map((article) => (
                <ArticleCard key={article.href} {...article} />
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
      ) : null}

      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-14">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2E7D32]">
            Explore
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {sections.map((section) => (
              <a
                key={section.href}
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
