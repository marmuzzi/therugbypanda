import ArticleCard from "@/components/ArticleCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getHomepageArticles } from "@/lib/cms";

const sections = [
  { label: "News", href: "/" },
  { label: "Provinces", href: "/categories/provinces" },
  { label: "Ireland", href: "/categories/ireland" },
  { label: "URC", href: "/categories/urc" },
  { label: "International", href: "/categories/international" },
  { label: "About", href: "/about" },
];

export default async function Home() {
  const { featured, latest } = await getHomepageArticles();
  const secondaryArticles = featured
    ? latest.filter((article) => article.title !== featured.title)
    : latest;
  const provinceArticles = latest.filter((article) =>
    ["Leinster", "Munster", "Ulster", "Connacht"].includes(article.section ?? ""),
  );
  const analysisArticles = latest.filter((article) =>
    ["Analysis", "Column", "Notebook"].some((label) => article.meta?.includes(label) || article.category.includes(label)),
  );
  const heroImage = featured?.image ?? "/landing-bg.png";

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />

      <section className="border-b border-zinc-800 bg-zinc-950 text-white">
        <div className="mx-auto max-w-6xl px-5 py-6 md:px-6 md:py-8">
          <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900 shadow-2xl md:min-h-[680px]">
            <img
              src={heroImage}
              alt={featured?.imageAlt ?? "Rugby stadium atmosphere"}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/25" />

            <div className="relative z-10 flex min-h-[620px] flex-col justify-between p-6 md:min-h-[680px] md:p-10 lg:p-12">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-[#9BE564] backdrop-blur-sm">
                  The Rugby Panda newsroom
                </p>
                <p className="rounded-full border border-white/15 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-200 backdrop-blur-sm">
                  Independent Irish rugby coverage
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_320px] lg:items-end">
                <article className="max-w-4xl">
                  <p className="text-sm font-black uppercase tracking-[0.3em] text-[#9BE564]">
                    {featured ? "Lead story" : "Coming soon"}
                  </p>
                  <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight text-white drop-shadow-lg md:text-7xl lg:text-8xl">
                    {featured?.title ?? "Irish rugby, told with context."}
                  </h1>
                  <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-200 drop-shadow md:text-xl">
                    {featured?.excerpt ??
                      "A visual preview of The Rugby Panda: match coverage, analysis and stories from Ireland, the provinces, the URC and international rugby."}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-300">
                    {featured?.meta ? <span>{featured.meta}</span> : null}
                    {featured?.meta ? <span aria-hidden="true" className="h-1 w-1 rounded-full bg-zinc-500" /> : null}
                    <span>The Rugby Panda</span>
                  </div>
                  {featured ? (
                    <a
                      href={featured.href}
                      className="mt-8 inline-flex rounded-full bg-[#4CAF50] px-6 py-3 text-sm font-black uppercase tracking-wider text-zinc-950 transition hover:bg-[#9BE564]"
                    >
                      Read the lead story
                    </a>
                  ) : null}
                </article>

                <aside className="rounded-3xl border border-white/15 bg-black/40 p-6 backdrop-blur-md">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-[#9BE564]">
                    Coverage focus
                  </p>
                  <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight text-white">
                    Four provinces. Ireland. Europe. One clear voice.
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-zinc-300">
                    Match understanding, squad context, tactical trends and the stories that explain why the rugby matters.
                  </p>
                </aside>
              </div>
            </div>
          </div>
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
            Live stories are powered by the canonical hosted Sanity CMS.
          </p>
        </div>

        {secondaryArticles.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {secondaryArticles.map((article) => (
              <ArticleCard key={article.href} {...article} />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl border border-dashed border-zinc-300 p-8 text-sm font-semibold text-zinc-500">
            No published articles yet. Seed or publish CMS content to fill this section.
          </p>
        )}
      </section>

      {provinceArticles.length ? (
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
                Leinster, Munster, Ulster and Connacht coverage from live CMS articles.
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
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-6 md:py-16">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2E7D32]">
            Sections
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
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
