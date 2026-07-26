import ArticleCard from "@/components/ArticleCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { articleDateLabel, articleLabel, getPublishedArticles } from "@/lib/cms";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

function normalise(value: string) {
  return value.trim().toLocaleLowerCase("en-IE");
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const searchTerm = normalise(query);
  const articles = await getPublishedArticles();
  const results = searchTerm
    ? articles.filter((article) =>
        [
          article.title,
          article.standfirst,
          article.category,
          article.province,
          article.competition,
        ]
          .filter(Boolean)
          .some((value) => normalise(value ?? "").includes(searchTerm)),
      )
    : [];

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-6 md:py-16">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#2E7D32]">
          Search
        </p>
        <h1 className="mt-5 max-w-4xl text-5xl font-black leading-none tracking-tight md:text-7xl">
          Search The Rugby Panda
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600 md:text-xl">
          Find published coverage by article title, topic, province, competition or category.
        </p>

        <form action="/search" method="get" className="mt-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 md:p-8">
          <label htmlFor="search" className="block text-sm font-black uppercase tracking-[0.25em] text-zinc-500">
            Search published articles
          </label>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              id="search"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search articles, teams, competitions..."
              className="min-h-12 flex-1 rounded-full border border-zinc-300 bg-white px-5 text-base text-zinc-950 outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
            />
            <button
              type="submit"
              className="min-h-12 rounded-full bg-[#003D2B] px-6 text-sm font-black uppercase tracking-wider text-white transition hover:bg-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
            >
              Search
            </button>
          </div>
        </form>

        {query ? (
          <section className="mt-12" aria-live="polite">
            <div className="flex flex-col gap-2 border-b border-zinc-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2E7D32]">
                  Results
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight">
                  {results.length} {results.length === 1 ? "article" : "articles"} for “{query}”
                </h2>
              </div>
            </div>

            {results.length > 0 ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {results.map((article) => (
                  <ArticleCard
                    key={article.slug}
                    category={articleLabel(article)}
                    title={article.title}
                    excerpt={article.standfirst ?? "Read the latest coverage from The Rugby Panda."}
                    href={`/articles/${article.slug}`}
                    meta={articleDateLabel(article.publishedAt)}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-8">
                <h2 className="text-2xl font-black tracking-tight">No matching articles found</h2>
                <p className="mt-3 max-w-2xl leading-7 text-zinc-600">
                  Try a broader term such as Ireland, Leinster, URC, international or a player name.
                </p>
              </div>
            )}
          </section>
        ) : (
          <div className="mt-12 rounded-3xl border border-zinc-200 bg-zinc-50 p-8">
            <h2 className="text-2xl font-black tracking-tight">Start with a rugby topic</h2>
            <p className="mt-3 max-w-2xl leading-7 text-zinc-600">
              Search for a province, competition, international team, player or story.
            </p>
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
