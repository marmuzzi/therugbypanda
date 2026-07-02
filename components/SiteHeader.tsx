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
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm5.25-3.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.2-1.5 1.5-1.5h1.7V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2V11H8v3h2.7v8h2.8Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-none stroke-current stroke-2">
      <path d="m21 21-4.35-4.35" strokeLinecap="round" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

export default function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-5 sm:px-5 md:px-8 md:py-7 lg:py-8">
        <Link
          href="/"
          className="flex w-full min-w-0 items-center gap-4 sm:gap-6 md:w-auto md:gap-8"
          aria-label="The Rugby Panda home"
        >
          <Image
            src="/rugby-panda-logo.png"
            alt="The Rugby Panda"
            width={220}
            height={220}
            priority
            sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 176px"
            className="h-24 w-24 shrink-0 object-contain sm:h-32 sm:w-32 md:h-44 md:w-44 lg:h-48 lg:w-48"
          />
          <div className="min-w-0">
            <p className="font-black uppercase leading-[0.82] tracking-tight text-[#003D2B]">
              <span className="block text-2xl leading-none sm:text-3xl md:text-4xl lg:text-5xl">
                The
              </span>
              <span className="block whitespace-nowrap text-[2.65rem] leading-[0.82] sm:text-6xl md:text-7xl lg:text-8xl">
                Rugby Panda
              </span>
            </p>
            <p className="mt-3 hidden text-sm font-black uppercase tracking-[0.28em] text-[#005C2F] sm:block md:text-base lg:text-lg">
              Independent rugby news. Insight. Analysis.
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 text-zinc-950 md:flex">
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
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-3 text-xs font-black uppercase tracking-wider sm:px-5 sm:text-sm md:gap-8 md:px-8 md:py-4 md:text-base">
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
