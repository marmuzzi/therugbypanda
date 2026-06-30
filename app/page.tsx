import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5] flex items-center justify-center px-6">
      <section className="max-w-3xl text-center">

        <Image
          src="/rugby-panda-logo.svg"
          alt="The Rugby Panda"
          width={180}
          height={180}
          priority
          className="mx-auto mb-8"
        />

        <p className="uppercase tracking-[0.4em] text-[#2E7D32] text-sm font-semibold mb-4">
          COMING SOON
        </p>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          THE RUGBY PANDA
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-3">
          Independent Irish Rugby Journalism
        </p>

        <p className="text-gray-400 max-w-2xl mx-auto leading-8 mb-12">
          Covering Leinster Rugby, Ireland, the URC and European Rugby with
          match reports, tactical analysis and responsible AI-assisted
          journalism.
        </p>

        <div className="flex justify-center items-center gap-8 text-sm uppercase tracking-[0.2em] font-medium">

          <a
            href="https://instagram.com/therugbypanda"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-[#2E7D32]"
          >
            Instagram
          </a>

          <a
            href="https://x.com/therugbypanda"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-[#2E7D32]"
          >
            X
          </a>

          <a
            href="https://facebook.com/therugbypanda"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-[#2E7D32]"
          >
            Facebook
          </a>

        </div>

        <div className="mt-16 border-t border-white/10 pt-8">

          <p className="text-gray-500 text-sm">
            Launching for the 2026/27 Rugby Season
          </p>

          <p className="mt-2 text-xs text-gray-600">
            Follow the journey as we build Ireland's newest independent rugby publication.
          </p>

        </div>

      </section>
    </main>
  );
}
