import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <Image
        src="/landing-bg.png"
        alt=""
        fill
        priority
        className="object-cover object-center opacity-80"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/80" />

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-10 text-center">
        <Image
          src="/rugby-panda-logo.png"
          alt="The Rugby Panda logo"
          width={150}
          height={150}
          priority
          className="mb-6 drop-shadow-2xl"
        />

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.45em] text-[#2E7D32]">
          Digital Rugby Newsroom
        </p>

        <h1 className="text-5xl font-black uppercase tracking-tight md:text-8xl">
          The Rugby Panda
        </h1>

        <div className="my-4 h-px w-24 bg-[#2E7D32]" />

        <p className="max-w-3xl text-lg leading-8 text-gray-100 md:text-2xl">
          Digital rugby newsroom delivering{" "}
          <span className="font-bold text-[#4CAF50]">
            independent coverage, insight and analysis
          </span>{" "}
          of Irish and European rugby.
        </p>

        <div className="my-10 h-px w-80 max-w-full bg-[#2E7D32]/70" />

        <p className="text-xl font-black uppercase tracking-[0.25em] text-[#4CAF50] md:text-3xl">
          Launching for the 2026/27 season
        </p>

        <div className="mt-10 flex items-center gap-8">
          <a
            href="https://www.instagram.com/rugbypandamedia"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-14 w-14 items-center justify-center rounded-full border border-[#2E7D32]/80 transition hover:bg-[#2E7D32]"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
              <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 12 16.5 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 12 14.5 2.5 2.5 0 0 0 12 9.5ZM17.5 6.5a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z" />
            </svg>
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=61591161347126"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="flex h-14 w-14 items-center justify-center rounded-full border border-[#2E7D32]/80 transition hover:bg-[#2E7D32]"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
              <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.2-1.5 1.5-1.5h1.7V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2V11H8v3h2.7v8h2.8Z" />
            </svg>
          </a>
        </div>
      </section>
    </main>
  );
}
