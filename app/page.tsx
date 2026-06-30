import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="relative w-full max-w-[720px] aspect-[2/3]">
        <Image
          src="/coming-soon.png"
          alt="The Rugby Panda"
          fill
          priority
          className="object-contain"
        />

        {/* Social links overlay */}
        <div className="absolute left-1/2 top-[74%] -translate-x-1/2 flex gap-[74px]">
          <a
            href="https://instagram.com/therugbypanda"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="h-12 w-12"
          />
          <a
            href="https://x.com/therugbypanda"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="h-12 w-12"
          />
          <a
            href="https://facebook.com/therugbypanda"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="h-12 w-12"
          />
        </div>
      </div>
    </main>
  );
}
