import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />

      <section className="mx-auto max-w-5xl px-5 py-16 md:px-6 md:py-24">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#2E7D32]">
          About The Rugby Panda
        </p>
        <h1 className="mt-5 max-w-4xl text-5xl font-black leading-none tracking-tight md:text-7xl">
          Independent rugby coverage, built with trust first.
        </h1>
        <p className="mt-8 max-w-3xl text-xl leading-9 text-zinc-600">
          The Rugby Panda is an independent digital rugby newsroom covering Irish and European rugby with context, analysis and match understanding.
        </p>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto grid max-w-5xl gap-8 px-5 py-12 md:grid-cols-3 md:px-6 md:py-16">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <h2 className="text-xl font-black tracking-tight text-zinc-950">Serious</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              A publication-first approach, not a fan blog or content farm.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <h2 className="text-xl font-black tracking-tight text-zinc-950">Independent</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Coverage that puts readers, context and rugby understanding ahead of noise.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <h2 className="text-xl font-black tracking-tight text-zinc-950">Irish at heart</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Focused on the four provinces, Ireland, the URC and European rugby.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
