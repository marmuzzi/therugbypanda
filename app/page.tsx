import Image from "next/image";

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Desktop */}
      <Image
        src="/coming-soon-desktop.png"
        alt="The Rugby Panda"
        fill
        priority
        className="hidden md:block object-cover object-center"
      />

      {/* Mobile */}
      <Image
        src="/coming-soon-mobile.png"
        alt="The Rugby Panda"
        fill
        priority
        className="block md:hidden object-cover object-top"
      />

      <div className="absolute inset-0 bg-black/5" />

      {/* Desktop social links */}
      <div className="hidden md:flex absolute left-1/2 top-[73%] -translate-x-1/2 gap-[135px]">
        <a href="https://instagram.com/therugbypanda" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="h-16 w-16" />
        <a href="https://x.com/therugbypanda" target="_blank" rel="noopener noreferrer" aria-label="X" className="h-16 w-16" />
        <a href="https://facebook.com/therugbypanda" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="h-16 w-16" />
      </div>

      {/* Mobile social links */}
      <div className="flex md:hidden absolute left-1/2 top-[74%] -translate-x-1/2 gap-[74px]">
        <a href="https://instagram.com/therugbypanda" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="h-12 w-12" />
        <a href="https://x.com/therugbypanda" target="_blank" rel="noopener noreferrer" aria-label="X" className="h-12 w-12" />
        <a href="https://facebook.com/therugbypanda" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="h-12 w-12" />
      </div>
    </main>
  );
}
