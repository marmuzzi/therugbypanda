import Image from "next/image";
import Link from "next/link";

const footerSections = [
  { label: "Provinces", href: "/categories/provinces" },
  { label: "Ireland", href: "/categories/ireland" },
  { label: "URC", href: "/categories/urc" },
  { label: "Europe", href: "/categories/europe" },
  { label: "About", href: "/about" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.5fr_1fr] md:px-6 md:py-16">
        <div className="flex gap-4">
          <Image
            src="/rugby-panda-logo.png"
            alt="The Rugby Panda"
            width={72}
            height={72}
            className="h-16 w-16 shrink-0 object-contain"
          />
          <div>
            <p className="text-2xl font-black uppercase tracking-tight">The Rugby Panda</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300">
              Independent rugby coverage, insight and analysis across Irish and European rugby.
            </p>
          </div>
        </div>

        <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-3 text-sm font-bold uppercase tracking-wider text-zinc-300">
          {footerSections.map((section) => (
            <Link key={section.label} href={section.href} className="transition hover:text-[#9BE564]">
              {section.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/10 px-5 py-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        © 2026 The Rugby Panda
      </div>
    </footer>
  );
}
