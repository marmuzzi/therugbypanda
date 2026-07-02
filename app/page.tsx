import ArticleCard from "@/components/ArticleCard";
import SiteHeader from "@/components/SiteHeader";

const latestArticles = [
  {
    category: "Provinces • Leinster",
    title: "Leinster season preview: building towards another defining campaign",
    excerpt:
      "A first look at the storylines, selection questions and European ambitions shaping Leinster’s 2026/27 season.",
    href: "/articles/leinster-season-preview-2026",
    meta: "6 min read • 2 July 2026",
    featured: true,
  },
  {
    category: "Ireland",
    title: "Ireland’s depth chart questions before the autumn window",
    excerpt:
      "The early selection debates that could matter most once the international calendar returns.",
    href: "#",
    meta: "Preview",
  },
  {
    category: "URC",
    title: "The URC storylines that could shape the opening month",
    excerpt:
      "Fixture rhythm, squad rotation and early momentum will define how contenders settle into the campaign.",
    href: "#",
    meta: "Preview",
  },
  {
    category: "Europe",
    title: "Why game management still decides the biggest European nights",
    excerpt:
      "Control matters, but knockout rugby often turns on adaptation, pressure and precision after momentum swings.",
    href: "#",
    meta: "Analysis",
  },
];

const sections = [
  "Leinster",
  "Munster",
  "Ulster",
  "Connacht",
  "Ireland",
  "URC",
  "Europe",
];

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
                href="#"
                className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-lg font-black text-zinc-950 transition hover:border-[#2E7D32] hover:text-[#2E7D32]"
              >
                {section}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
