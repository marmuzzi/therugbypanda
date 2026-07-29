type ArticleHeaderProps = {
  category: string;
  title: string;
  subtitle: string;
  published: string;
  updated: string;
  readingTime: string;
};

export default function ArticleHeader({
  category,
  title,
  subtitle,
  published,
  updated,
  readingTime,
}: ArticleHeaderProps) {
  const showUpdated = updated !== published;

  return (
    <header className="border-b border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-[820px] px-5 py-9 md:px-6 md:py-12">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm font-bold text-zinc-500">
          <a href="/" className="hover:text-[#2E7D32] hover:underline">Home</a>
          <span className="mx-2" aria-hidden="true">→</span>
          <span className="text-zinc-700">{category}</span>
        </nav>

        <p className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-[#2E7D32]">
          {category}
        </p>

        <h1 className="text-4xl font-black leading-[0.98] tracking-tight text-zinc-950 md:text-6xl">
          {title}
        </h1>

        <p className="mt-5 max-w-[760px] text-lg leading-8 text-zinc-600 md:text-xl">
          {subtitle}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-zinc-500">
          <span>{published}</span>
          {showUpdated ? <span aria-hidden="true">•</span> : null}
          {showUpdated ? <span>Updated {updated}</span> : null}
          <span aria-hidden="true">•</span>
          <span>{readingTime}</span>
        </div>
      </div>
    </header>
  );
}
