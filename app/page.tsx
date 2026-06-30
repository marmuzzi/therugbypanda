import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">

      <Image
        src="/coming-soon.png"
        alt="The Rugby Panda"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/10" />

      {/* Clickable social icons */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[27%] flex gap-24">

        <a
          href="https://instagram.com/therugbypanda"
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16"
        />

        <a
          href="https://x.com/therugbypanda"
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16"
        />

        <a
          href="https://facebook.com/therugbypanda"
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16"
        />

      </div>

    </main>
  );
}
