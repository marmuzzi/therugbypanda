export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5] flex items-center justify-center px-6">
      <section className="text-center max-w-3xl">
        <div className="mx-auto mb-8 h-32 w-32 rounded-full border border-[#2E7D32] flex items-center justify-center bg-[#111]">
          <div className="text-6xl">🐼</div>
        </div>

        <p className="uppercase tracking-[0.35em] text-[#2E7D32] text-sm mb-4">
          Coming Soon
        </p>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          The Rugby Panda
        </h1>

        <p className="text-xl md:text-2xl text-[#BDBDBD] mb-4">
          Independent Irish Rugby Journalism
        </p>

        <p className="text-[#BDBDBD] mb-10">
          Covering Leinster, Ireland, URC and European rugby with match insight,
          analysis and responsible AI-assisted reporting.
        </p>

        <div className="flex justify-center gap-6 text-sm uppercase tracking-widest">
          <a
            href="https://instagram.com/therugbypanda"
            target="_blank"
            className="hover:text-[#2E7D32]"
          >
            Instagram
          </a>

          <a
            href="https://x.com/therugbypanda"
            target="_blank"
            className="hover:text-[#2E7D32]"
          >
            X
          </a>

          <a
            href="https://facebook.com/therugbypanda"
            target="_blank"
            className="hover:text-[#2E7D32]"
          >
            Facebook
          </a>
        </div>

        <p className="mt-12 text-xs text-[#777]">
          Launching for the 2026/27 rugby season.
        </p>
      </section>
    </main>
  );
}
