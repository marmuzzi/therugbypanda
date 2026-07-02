import Image from "next/image";
import Link from "next/link";

const navigationItems = [
  { label: "Provinces", href: "#" },
  { label: "Ireland", href: "#" },
  { label: "URC", href: "#" },
  { label: "Europe", href: "#" },
  { label: "About", href: "#" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-6 md:py-4">
        <Link href="/" className="flex items-center gap-3" aria-label="The Rugby Panda home">
          <Image
            src="/rugby-panda-logo.png"
            alt="The Rugby Panda"
            width={52}
            height={52}
            priority
            className="h-11 w-11 object-contain md:h-12 md:w-12"
          />
          <span className="text-base font-black uppercase tracking-tight text-zinc-950 md:text-lg">
            The Rugby Panda
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-6 text-sm font-bold uppercase tracking-wider text-zinc-700 md:flex"
        >
          {navigationItems.map((item) => (
            <Link key={item.label} href={item.href} className="transition hover:text-[#2E7D32]">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="#"
          className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-black uppercase tracking-wider text-zinc-800 transition hover:border-[#2E7D32] hover:text-[#2E7D32] md:hidden"
        >
          Menu
        </Link>
      </div>
    </header>
  );
}
