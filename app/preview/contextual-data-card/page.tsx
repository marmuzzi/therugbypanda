import ContextualDataCard from "@/components/ContextualDataCard";

export default function ContextualDataCardPreviewPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-5 py-12 text-zinc-950">
      <div className="mx-auto max-w-[1040px]">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2E7D32]">Visual preview</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Contextual article data card</h1>
          <p className="mt-3 max-w-2xl text-lg leading-7 text-zinc-600">Branch-only preview of the reusable player snapshot treatment. The production component is data-driven and only renders evidence-backed rows.</p>
        </div>

        <div className="grid items-start gap-10 rounded-[32px] bg-white p-6 shadow-sm md:p-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="space-y-6">
            <h2 className="text-3xl font-black tracking-tight">Carbery's return adds a different question at Leinster</h2>
            <p className="text-xl leading-9 text-zinc-700">The value is not simply that Joey Carbery has returned. The more interesting rugby question is how his experience changes Leinster's options around Sam Prendergast, game management and selection at 10.</p>
            <p className="text-xl leading-9 text-zinc-700">On desktop the snapshot sits beside the copy and remains available as the reader moves through the article. On mobile it moves naturally into the article flow.</p>
          </article>

          <div className="lg:sticky lg:top-8">
            <ContextualDataCard card={{
              kind: "player",
              title: "Joey Carbery",
              subtitle: "Leinster · fly-half / full-back",
              rows: [
                { label: "First Leinster spell", value: "37 appearances · 101 points" },
                { label: "Left Leinster", value: "2018" },
                { label: "Returned", value: "2026/27 season" },
                { label: "Recent club", value: "Bordeaux-Bègles" },
                { label: "Current status", value: "Rehabbing ACL injury" },
              ],
              note: "Only verified, story-relevant fields are shown. Missing or uncertain data is omitted rather than estimated.",
            }} />
          </div>
        </div>
      </div>
    </main>
  );
}
