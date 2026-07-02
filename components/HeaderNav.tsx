import Link from "next/link";
import SearchButton from "./SearchButton";

const navItems = [
  { label: "Home", href: "/" },
  { label: "News", href: "/" },
  { label: "Provinces", href: "/categories/provinces" },
  { label: "Ireland", href: "/categories/ireland" },
  { label: "URC", href: "/categories/urc" },
  { label: "Europe", href: "/categories/europe" },
  { label: "About", href: "/about" },
];

export default function HeaderNav() {
  return (
    <nav aria-label="Primary navigation" className="bg-[#003D2B] text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-4 py-4 text-sm font-black uppercase tracking-wide sm:gap-7 sm:px-6 md:gap-10 md:px-8 md:text-base md:tracking-wider">
        <SearchButton className="-ml-1 mr-1 h-8 w-8 md:hidden" />
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} className="shrink-0 transition hover:text-[#9BE564]">
            {item.label}
          </Link>
        ))}
        <SearchButton className="hidden h-8 w-8 md:inline-flex" />
      </div>
    </nav>
  );
}
