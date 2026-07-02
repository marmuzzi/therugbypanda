import Image from "next/image";

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <Image
        src="/landing-page.png"
        alt="The Rugby Panda - Digital Rugby Newsroom"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Clickable social links */}
      <div className="absolute left-1/2 bottom-[4.5%] flex -translate-x-1/2 gap-[62px] md:gap-[76px]">
        <a
          href="https://www.facebook.com/TheRugbyPanda"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="The Rugby Panda on Facebook"
          className="h-10 w-10 md:h-12 md:w-12"
        />

        <a
          href="https://www.instagram.com/rugbypandamedia"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="The Rugby Panda on Instagram"
          className="h-10 w-10 md:h-12 md:w-12"
        />
      </div>
    </main>
  );
}
