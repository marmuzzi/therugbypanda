"use client";

import Link from "next/link";
import { useState } from "react";

import SearchButton from "./SearchButton";

const navItems = [
  { label: "News", href: "/news" },
  { label: "Provinces", href: "/categories/provinces" },
  { label: "URC", href: "/categories/urc" },
  { label: "International", href: "/categories/international" },
  { label: "About", href: "/about" },
];

export default function HeaderNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav aria-label="Primary navigation" className="bg-[#003D2B] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between py-3 md:hidden">
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-primary-navigation"
            onClick={() => setIsOpen((open) => !open)}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition hover:border-[#9BE564] hover:text-[#9BE564]"
          >
            <span aria-hidden="true" className="text-base leading-none">
              {isOpen ? "×" : "☰"}
            </span>
            Menu
          </button>
          <SearchButton className="h-9 w-9 text-white" />
        </div>

        <div
          id="mobile-primary-navigation"
          className={`${isOpen ? "grid" : "hidden"} gap-1 border-t border-white/15 py-3 md:hidden`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-3 py-3 text-sm font-black uppercase tracking-wide transition hover:bg-white/10 hover:text-[#9BE564]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center justify-between py-3 md:flex">
          <div className="flex min-w-0 flex-1 items-center gap-6 text-xs font-black uppercase tracking-wide lg:gap-8 lg:text-sm lg:tracking-wider">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 transition hover:text-[#9BE564]"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <SearchButton className="ml-4 h-8 w-8 text-white" />
        </div>
      </div>
    </nav>
  );
}
