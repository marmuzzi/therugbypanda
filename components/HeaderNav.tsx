import Link from "next/link";
import SearchButton from "./SearchButton";

const navItems = [
  { label: "News", href: "/" },
  { label: "Provinces", href: "/categories/provinces" },
  { label: "Ireland", href: "/categories/ireland" },
  { label: "URC", href: "/categories/urc" },
  { label: "Europe", href: "/categories/europe" },
  { label: "About", href: "/about", desktopOnly: true },
];

export default function HeaderNav() {
  return (
    <nav aria-label="Primary navigation" className="bg-[#003D2B] text-white">
      <div className="mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6 md:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto pr-5 text-sm font-black uppercase tracking-wide sm:gap-7 md:gap-10 md:text-base md:tracking-wider">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`shrink-0 transition hover:text-[#9BE564] ${item.desktopOnly ? "hidden md:block" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <SearchButton className="ml-3 h-9 w-9 text-white" />
      </div>
    </nav>
  );
}
