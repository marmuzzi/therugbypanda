import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />

      <section className="mx-auto max-w-5xl px-5 py-16 md:px-6 md:py-24">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#2E7D32]">
          Search
        </p>
        <h1 className="mt-5 max-w-4xl text-5xl font-black leading-none tracking-tight md:text-7xl">
          Search The Rugby Panda
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600 md:text-xl">
          Full site search will be added when the publishing workflow and content index are ready. For now, this page keeps the navigation path in place.
        </p>

        <div className="mt-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 md:p-8">
          <label htmlFor="search" className="block text-sm font-black uppercase tracking-[0.25em] text-zinc-500">
            Search coming soon
          </label>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              id="search"
              type="search"
              placeholder="Search articles, teams, competitions..."
              disabled
              className="min-h-12 flex-1 rounded-full border border-zinc-300 bg-white px-5 text-base text-zinc-500"
            />
            <button
              type="button"
              disabled
              className="min-h-12 rounded-full bg-[#003D2B] px-6 text-sm font-black uppercase tracking-wider text-white opacity-60"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
