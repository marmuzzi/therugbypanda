import Link from "next/link";

type ArticleCardVariant = "standard" | "feature" | "compact" | "analysis";

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
  variant?: ArticleCardVariant;
};

export default async function ArticleCard({
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
  variant = "standard",
}: ArticleCardProps) {
  // Never invent a card image. The canonical article featured image has already
  // passed the editorial relevance gate; if it is absent, the card stays text-only.
  const metadata = publishedAt || readingTime
    ? [publishedAt, readingTime, author].filter(Boolean)
    : [meta, author].filter(Boolean);
  const isFeature = featured || variant === "feature";
  const isCompact = variant === "compact";
  const isAnalysis = variant === "analysis";

  if (isCompact) {
    return (
      <Link
        href={href}
        data-analytics-event="select_content"
        data-analytics-content-type="article"
        data-analytics-item-id={href}
        data-analytics-item-name={title}
        data-analytics-content-group={category}
        className="group grid gap-4 border-b border-zinc-200 py-5 sm:grid-cols-[minmax(0,1fr)_160px] sm:items-center"
      >
        <div>
          <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-[#2E7D32]">{category}</p>
          <h3 className="mt-2 text-xl font-black leading-tight tracking-tight text-zinc-950 group-hover:text-[#2E7D32]">
            {title}
          </h3>
          {metadata.length ? (
            <p className="mt-3 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-zinc-500">
              {metadata.join(" • ")}
            </p>
          ) : null}
        </div>
        {image ? (
          <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-100">
            <img src={image} alt={imageAlt ?? title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
          </div>
        ) : null}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      data-analytics-event="select_content"
      data-analytics-content-type="article"
      data-analytics-item-id={href}
      data-analytics-item-name={title}
      data-analytics-content-group={category}
      className={`group block overflow-hidden transition ${
        isAnalysis
          ? "border-l-4 border-[#2E7D32] bg-zinc-950 text-white"
          : "rounded-3xl border border-zinc-200 bg-white hover:border-[#2E7D32] hover:shadow-sm"
      }`}
    >
      {image ? (
        <div className={`relative overflow-hidden bg-zinc-100 ${isFeature ? "aspect-[16/9]" : isAnalysis ? "aspect-[16/8]" : "aspect-[4/3]"}`}>
          <img
            src={image}
            alt={imageAlt ?? title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
      ) : null}

      <div className={isFeature ? "p-6 md:p-8" : "p-6"}>
        <p className={`text-xs font-black uppercase tracking-[0.25em] ${isAnalysis ? "text-[#9BE564]" : "text-[#2E7D32]"}`}>
          {category}
        </p>
        <h2 className={`mt-4 font-black leading-tight tracking-tight group-hover:text-[#2E7D32] ${isAnalysis ? "text-2xl text-white group-hover:text-[#9BE564]" : isFeature ? "text-3xl text-zinc-950 md:text-4xl" : "text-2xl text-zinc-950"}`}>
          {title}
        </h2>
        <p className={`${isFeature ? "mt-5 text-base leading-7" : "mt-4 text-base leading-7"} ${isAnalysis ? "text-zinc-300" : "text-zinc-600"}`}>
          {excerpt}
        </p>
        {metadata.length ? (
          <div className={`mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold uppercase tracking-[0.12em] ${isAnalysis ? "text-zinc-400" : "text-zinc-500"}`}>
            {metadata.map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center gap-3">
                {index > 0 ? <span aria-hidden="true" className={`h-1 w-1 rounded-full ${isAnalysis ? "bg-zinc-600" : "bg-zinc-300"}`} /> : null}
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
