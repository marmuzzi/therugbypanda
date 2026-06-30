import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      <Image
        src="/coming-soon.png"
        alt="The Rugby Panda"
        fill
        priority
        className="object-contain md:object-cover"
      />

      <div className="absolute inset-0 bg-black/5" />

      {/* Clickable social icons */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[73.5%] flex items-center justify-center gap-[88px]">
        <a
          href="https://instagram.com/therugbypanda"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="block h-16 w-16"
        />

        <a
          href="https://x.com/therugbypanda"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X"
          className="block h-16 w-16"
        />

        <a
          href="https://facebook.com/therugbypanda"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="block h-16 w-16"
        />
      </div>
    </main>
  );
}
