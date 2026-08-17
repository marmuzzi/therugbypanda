import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#2E7D32]">
              About The Rugby Panda
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.04em] md:text-6xl">
              Independent rugby journalism with an Irish point of view.
            </h1>
          </div>

          <div className="border-l-4 border-[#7CB342] pl-6">
            <p className="text-lg leading-8 text-zinc-600">
              The Rugby Panda is a digital newsroom covering Ireland, the four provinces, the URC and European rugby with reporting, analysis and clear editorial judgement.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-10 md:grid-cols-3 md:px-8 md:py-12">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2E7D32]">Coverage</p>
            <h2 className="mt-3 text-xl font-black tracking-tight text-zinc-950">Irish rugby first</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Ireland, Leinster, Munster, Ulster and Connacht, with the competitions that shape their seasons.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2E7D32]">Approach</p>
            <h2 className="mt-3 text-xl font-black tracking-tight text-zinc-950">Context over noise</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              We go beyond the scoreline to explain the decisions, performances and moments that shape the game.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2E7D32]">Standards</p>
            <h2 className="mt-3 text-xl font-black tracking-tight text-zinc-950">Independent and accountable</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              No agendas, no clickbait and no manufactured outrage. Just independent rugby coverage built on accuracy, fairness and respect for the game.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-12">
        <div className="grid gap-6 rounded-3xl bg-zinc-950 p-7 text-white md:grid-cols-[1fr_auto] md:items-center md:p-9">
          <div>
            <h2 className="text-2xl font-black tracking-tight md:text-3xl">The game. The people. The stories.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
              The newsroom is being built for regular, credible coverage rather than volume for its own sake.
            </p>
          </div>
          <a href="/news" className="inline-flex rounded-full bg-[#7CB342] px-5 py-3 text-xs font-black uppercase tracking-wider text-zinc-950 hover:bg-[#9BE564]">
            Read the latest
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
