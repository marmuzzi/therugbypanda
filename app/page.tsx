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
        <div className="relative mx-auto min-h-[430px] max-w-[1600px] overflow-hidden sm:min-h-[450px] md:min-h-[470px] lg:min-h-[500px]">
          <img
            src={heroImage}
            alt={featured?.imageAlt ?? "Rugby stadium atmosphere"}
            className="absolute inset-0 h-full w-full object-cover object-center brightness-125 saturate-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent md:bg-gradient-to-r md:from-black/60 md:via-black/20 md:to-transparent" />

          <div className="relative z-10 mx-auto flex min-h-[430px] max-w-7xl items-end px-5 py-7 sm:min-h-[450px] sm:px-6 sm:py-9 md:min-h-[470px] md:items-center md:px-8 md:py-10 lg:min-h-[500px]">
            <article className="max-w-2xl rounded-2xl bg-black/15 p-5 backdrop-blur-[1px] sm:p-6 md:max-w-xl md:bg-transparent md:p-0 md:backdrop-blur-none lg:max-w-2xl">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#9BE564] sm:text-xs sm:tracking-[0.28em]">
                {featured?.category ?? (featured ? "Lead story" : "Coming soon")}
              </p>
              <h1 className="mt-2 max-w-[18ch] text-[2.15rem] font-black leading-[0.98] tracking-[-0.035em] text-white drop-shadow-lg sm:mt-3 sm:text-[2.7rem] md:max-w-[15ch] md:text-[3.5rem] lg:text-[4.25rem]">
                {featured?.title ?? "Irish rugby, told with context."}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-100 drop-shadow sm:mt-4 sm:text-base sm:leading-7 md:text-lg">
                {featured?.excerpt ??
                  "Independent coverage, analysis and stories from Ireland, the provinces, the URC and international rugby."}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-zinc-200 sm:mt-4 sm:text-[0.68rem]">
                {featured?.meta ? <span>{featured.meta}</span> : null}
                {featured?.meta ? (
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-zinc-400" />
                ) : null}
                <span>The Rugby Panda</span>
              </div>
              {featured ? (
                <a
                  href={featured.href}
                  className="mt-4 inline-flex items-center rounded-full bg-[#7CB342] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-zinc-950 transition hover:bg-[#9BE564] sm:mt-5"
                >
                  Read the full story
                </a>
              ) : null}
            </article>
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
