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
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current md:h-7 md:w-7">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm5.25-3.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current md:h-7 md:w-7">
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.2-1.5 1.5-1.5h1.7V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2V11H8v3h2.7v8h2.8Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-none stroke-current stroke-2 md:h-8 md:w-8">
      <path d="m21 21-4.35-4.35" strokeLinecap="round" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

export default function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-[112px_minmax(0,1fr)] items-center gap-3 px-4 py-5 sm:grid-cols-[152px_minmax(0,1fr)] sm:gap-6 sm:px-6 md:grid-cols-[188px_minmax(0,1fr)_180px] md:gap-8 md:px-8 md:py-7 lg:grid-cols-[220px_minmax(0,1fr)_220px] lg:py-8">
        <Link href="/" aria-label="The Rugby Panda home" className="block justify-self-end md:justify-self-start">
          <Image
            src="/rugby-panda-logo.png"
            alt="The Rugby Panda"
            width={260}
            height={260}
            priority
            sizes="(max-width: 640px) 112px, (max-width: 768px) 152px, (max-width: 1024px) 188px, 220px"
            className="h-28 w-28 object-contain sm:h-38 sm:w-38 md:h-[188px] md:w-[188px] lg:h-[220px] lg:w-[220px]"
          />
        </Link>

        <Link href="/" aria-label="The Rugby Panda home" className="min-w-0 overflow-hidden">
          <p className="font-black uppercase leading-[0.8] tracking-tight text-[#003D2B]">
            <span className="block text-[1.85rem] leading-none sm:text-[2.65rem] md:text-[3.1rem] lg:text-[3.8rem]">
              The
            </span>
            <span className="block text-[2.7rem] leading-[0.8] sm:text-[4.25rem] md:text-[5.35rem] lg:text-[6.7rem]">
              Rugby Panda
            </span>
          </p>
          <p className="mt-2 text-[0.64rem] font-black uppercase leading-4 tracking-[0.16em] text-[#005C2F] sm:mt-3 sm:text-xs md:text-sm md:tracking-[0.28em] lg:text-base">
            Independent rugby news. Insight. Analysis.
          </p>
        </Link>

        <div className="hidden items-center justify-end gap-7 text-zinc-950 md:flex">
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
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-4 text-sm font-black uppercase tracking-wide sm:px-6 md:gap-10 md:px-8 md:text-base md:tracking-wider">
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
