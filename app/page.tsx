import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <Image
        src="/landing-bg.png"
        alt=""
        fill
        priority
        className="object-cover object-center opacity-40"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/95" />

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-10 text-center">
        <Image
          src="/rugby-panda-logo.png"
          alt="The Rugby Panda logo"
          width={180}
          height={180}
          priority
          className="mb-6"
        />

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.4em] text-[#2E7D32]">
          Digital Rugby Newsroom
        </p>

        <h1 className="text-5xl font-black uppercase tracking-tight md:text-8xl">
          The Rugby Panda
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-200 md:text-2xl">
          Digital rugby newsroom delivering{" "}
          <span className="font-bold text-[#2E7D32]">
            independent coverage, insight and analysis
          </span>{" "}
          of Irish and European rugby.
        </p>

        <div className="my-10 h-px w-40 bg-[#2E7D32]" />

        <p className="text-xl font-black uppercase tracking-widest md:text-3xl">
          Launching for the 2026/27 season
        </p>

        <div className="mt-10 flex items-center gap-6">
          <a
            href="https://www.instagram.com/rugbypandamedia"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-lg font-black transition hover:border-[#2E7D32] hover:text-[#2E7D32]"
          >
            IG
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=61591161347126"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-lg font-black transition hover:border-[#2E7D32] hover:text-[#2E7D32]"
          >
            FB
          </a>
        </div>
      </section>
    </main>
  );
}
