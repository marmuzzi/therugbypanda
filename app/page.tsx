import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <Image
        src="/landing-bg.png"
        alt=""
        fill
        priority
        className="object-cover object-center opacity-45"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/90" />

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-10 text-center">
        <div className="mb-6 flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <div className="relative h-28 w-36 md:h-32 md:w-44">
            <Image
              src="/rugby-panda-logo.png"
              alt="The Rugby Panda logo"
              fill
              priority
              className="object-contain"
            />
          </div>

          <div className="text-center md:text-left">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#2E7D32]">
              The
            </p>
            <h1 className="text-4xl font-black uppercase tracking-tight md:text-7xl">
              Rugby Panda
            </h1>
            <p className="mt-2 text-lg font-bold uppercase tracking-widest">
              Digital <span className="text-[#2E7D32]">Rugby</span> Newsroom
            </p>
          </div>
        </div>

        <p className="mt-6 text-2xl font-black uppercase md:text-4xl">
          We&apos;re building something special.
        </p>

        <h2 className="mt-3 text-6xl font-black uppercase text-[#2E7D32] md:text-8xl">
          Coming Soon
        </h2>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-gray-200 md:text-2xl">
          Digital rugby newsroom delivering{" "}
          <span className="font-bold text-[#2E7D32]">independent coverage, insight and analysis</span>{" "}
          of Irish and European rugby.
        </p>

        <div className="mt-10 grid max-w-5xl grid-cols-2 gap-5 text-left md:grid-cols-4">
          {[
            ["Independent", "No agendas. Just rugby."],
            ["Insightful", "Deeper analysis. Better understanding."],
            ["Irish at Heart", "Proudly covering Irish rugby."],
            ["European Perspective", "Tracking the game across Europe."],
          ].map(([title, text]) => (
            <div key={title} className="border-l border-[#2E7D32]/60 pl-4">
              <p className="font-black uppercase">{title}</p>
              <p className="mt-1 text-sm text-gray-300">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-8">
          <a
            href="https://www.facebook.com/TheRugbyPanda"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/30 px-6 py-3 text-sm font-bold uppercase tracking-widest transition hover:border-[#2E7D32] hover:text-[#2E7D32]"
          >
            Facebook
          </a>

          <a
            href="https://www.instagram.com/rugbypandamedia"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/30 px-6 py-3 text-sm font-bold uppercase tracking-widest transition hover:border-[#2E7D32] hover:text-[#2E7D32]"
          >
            Instagram
          </a>
        </div>
      </section>
    </main>
  );
}
