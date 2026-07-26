import Image from "next/image";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/TheRugbyPanda",
    analyticsEvent: "social_click",
    analyticsPlatform: "facebook",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M13.5 22v-8h2.75l.41-3.2H13.5V8.76c0-.93.26-1.56 1.59-1.56h1.7V4.34c-.29-.04-1.3-.13-2.47-.13-2.45 0-4.13 1.49-4.13 4.24v2.35H7.42V14h2.77v8h3.31Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/rugbypandamedia",
    analyticsEvent: "social_click",
    analyticsPlatform: "instagram",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm9.75 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
      </svg>
    ),
  },
  {
    label: "Contact us",
    href: "mailto:hello@therugbypanda.ie",
    analyticsEvent: "contact",
    analyticsMethod: "email",
    icon: <span aria-hidden="true" className="text-xl font-black leading-none">@</span>,
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-8 text-center sm:flex-row sm:justify-between sm:text-left md:px-6 md:py-9">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
          <Image
            src="/rugby-panda-logo.png"
            alt="The Rugby Panda"
            width={96}
            height={96}
            className="h-20 w-20 shrink-0 object-contain md:h-24 md:w-24"
          />
          <div>
            <p className="text-xl font-black uppercase tracking-tight">The Rugby Panda</p>
            <p className="mt-1 max-w-xl text-sm leading-5 text-zinc-300">
              Independent rugby coverage, insight and analysis across Irish and international rugby.
            </p>
          </div>
        </div>

        <nav aria-label="Social media and contact" className="flex items-center gap-2.5">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={link.label}
              title={link.label}
              data-analytics-event={link.analyticsEvent}
              data-analytics-platform={link.analyticsPlatform}
              data-analytics-method={link.analyticsMethod}
              data-analytics-link-text={link.label}
              data-analytics-link-url={link.href}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-zinc-200 transition hover:border-[#9BE564] hover:text-[#9BE564] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9BE564]"
            >
              {link.icon}
            </a>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/10 px-5 py-3 text-center text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        © 2026 The Rugby Panda
      </div>
    </footer>
  );
}
