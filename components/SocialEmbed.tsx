"use client";

import Script from "next/script";

type Platform = "youtube" | "instagram" | "x" | "facebook";

type SocialEmbedProps = {
  platform: Platform;
  url: string;
  caption?: string;
  sourceLabel?: string;
};

function safeUrl(raw: string, platform: Platform): URL | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const allowed: Record<Platform, string[]> = {
      youtube: ["youtube.com", "youtu.be"],
      instagram: ["instagram.com"],
      x: ["x.com", "twitter.com"],
      facebook: ["facebook.com", "fb.com"],
    };
    return allowed[platform].some((domain) => host === domain || host.endsWith(`.${domain}`)) ? url : null;
  } catch {
    return null;
  }
}

function youtubeId(url: URL): string | null {
  if (url.hostname.includes("youtu.be")) return url.pathname.split("/").filter(Boolean)[0] ?? null;
  if (url.pathname.startsWith("/shorts/")) return url.pathname.split("/").filter(Boolean)[1] ?? null;
  if (url.pathname.startsWith("/embed/")) return url.pathname.split("/").filter(Boolean)[1] ?? null;
  return url.searchParams.get("v");
}

export default function SocialEmbed({ platform, url, caption, sourceLabel }: SocialEmbedProps) {
  const parsed = safeUrl(url, platform);
  if (!parsed) return null;

  const footer = caption || sourceLabel ? (
    <figcaption className="border-t border-zinc-200 px-4 py-3 text-sm leading-5 text-zinc-600">
      {caption ? <p>{caption}</p> : null}
      {sourceLabel ? <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">{sourceLabel}</p> : null}
    </figcaption>
  ) : null;

  if (platform === "youtube") {
    const id = youtubeId(parsed);
    if (!id) return null;
    return (
      <figure className="my-8 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm md:my-10">
        <div className="aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`}
            title={caption || "Embedded YouTube video"}
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        {footer}
      </figure>
    );
  }

  if (platform === "instagram") {
    return (
      <figure className="my-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm md:my-10">
        <div className="flex justify-center p-3">
          <blockquote className="instagram-media w-full" data-instgrm-permalink={parsed.toString()} data-instgrm-version="14" />
        </div>
        <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" onLoad={() => (window as unknown as { instgrm?: { Embeds?: { process?: () => void } } }).instgrm?.Embeds?.process?.()} />
        {footer}
      </figure>
    );
  }

  if (platform === "x") {
    return (
      <figure className="my-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm md:my-10">
        <div className="flex justify-center p-4">
          <blockquote className="twitter-tweet"><a href={parsed.toString()}>View post</a></blockquote>
        </div>
        <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />
        {footer}
      </figure>
    );
  }

  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm md:my-10">
      <iframe
        src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(parsed.toString())}&show_text=true&width=700`}
        title={caption || "Embedded Facebook post"}
        className="h-[560px] w-full border-0"
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
      />
      {footer}
    </figure>
  );
}
