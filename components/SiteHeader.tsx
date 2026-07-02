import Image from "next/image";
import Link from "next/link";

const navigationItems = [
  { label: "News", href: "/" },
  { label: "Provinces", href: "/categories/provinces" },
  { label: "Ireland", href: "/categories/ireland" },
  { label: "URC", href: "/categories/urc" },
  { label: "Europe", href: "/categories/europe" },
  { label: "About", href: "/about" },
];

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm5.25-3.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.2-1.5 1.5-1.5h1.7V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2V11H8v3h2.7v8h2.8Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current stroke-2">
      <path d="m21 21-4.35-4.35" strokeLinecap="round" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

export default function SiteHeader() {
  return (
    <header className="z-50 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-5 md:px-6 md:py-7">
        <Link href="/" className="flex min-w-0 items-center gap-4" aria-label="The Rugby Panda home">
          <Image
            src="/rugby-panda-logo.png"
            alt="The Rugby Panda"
            width={112}
            height={112}
            priority
            className="h-20 w-20 shrink-0 object-contain md:h-28 md:w-28"
          />
          <div className="min-w-0">
            <p className="text-3xl font-black uppercase leading-none tracking-tight text-zinc-950 md:text-6xl">
              The Rugby Panda
            </p>
            <p className="mt-2 hidden text-xs font-black uppercase tracking-[0.28em] text-[#2E7D32] md:block">
              Independent rugby news. Insight. Analysis.
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-5 text-zinc-950 md:flex">
          <a
            href="https://www.instagram.com/rugbypandamedia"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="The Rugby Panda on Instagram"
            className="transition hover:text-[#2E7D32]"
          >
            <InstagramIcon />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61591161347126"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="The Rugby Panda on Facebook"
            className="transition hover:text-[#2E7D32]"
          >
            <FacebookIcon />
          </a>
          <Link href="/search" aria-label="Search The Rugby Panda" className="transition hover:text-[#2E7D32]">
            <SearchIcon />
          </Link>
        </div>
      </div>

      <nav aria-label="Primary navigation" className="bg-[#003D2B] text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-5 py-4 text-sm font-black uppercase tracking-wider md:px-6">
          <Link href="/" aria-label="Home" className="shrink-0 transition hover:text-[#9BE564]">
            Home
          </Link>
          {navigationItems.map((item) => (
            <Link key={item.label} href={item.href} className="shrink-0 transition hover:text-[#9BE564]">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
