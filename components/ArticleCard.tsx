import Link from "next/link";

type ArticleCardProps = {
  category: string;
  title: string;
  excerpt: string;
  href: string;
  meta?: string;
  publishedAt?: string;
  readingTime?: string;
  author?: string;
  featured?: boolean;
  image?: string;
  imageAlt?: string;
};

export default function ArticleCard({
  category,
  title,
  excerpt,
  href,
  meta,
  publishedAt,
  readingTime,
  author = "The Rugby Panda",
  featured = false,
  image,
  imageAlt,
}: ArticleCardProps) {
  const metadata = publishedAt || readingTime
    ? [publishedAt, readingTime, author].filter(Boolean)
    : [meta, author].filter(Boolean);

  return (
    <Link
      href={href}
      data-analytics-event="select_content"
      data-analytics-content-type="article"
      data-analytics-item-id={href}
      data-analytics-item-name={title}
      data-analytics-content-group={category}
      className="group block overflow-hidden rounded-3xl border border-zinc-200 bg-white transition hover:border-[#2E7D32] hover:shadow-sm"
    >
      {image ? (
        <div className={`relative overflow-hidden bg-zinc-100 ${featured ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
          <img
            src={image}
            alt={imageAlt ?? ""}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
        </div>
      ) : null}

      <div className={`${featured ? "p-6 md:p-7" : "p-6"}`}>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#2E7D32]">
          {category}
        </p>

        <h2
          className={`mt-4 font-black leading-tight tracking-tight text-zinc-950 group-hover:text-[#2E7D32] ${
            featured ? "text-3xl md:text-4xl" : "text-2xl"
          }`}
        >
          {title}
        </h2>

        <p className={`${featured ? "mt-5 text-base leading-7" : "mt-4 text-base leading-7"} text-zinc-600`}>{excerpt}</p>

        {metadata.length ? (
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
            {metadata.map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center gap-3">
                {index > 0 ? <span aria-hidden="true" className="h-1 w-1 rounded-full bg-zinc-300" /> : null}
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
