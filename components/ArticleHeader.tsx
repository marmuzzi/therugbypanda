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
  return (
    <header className="mx-auto max-w-5xl px-6 pt-24 pb-16 text-center">
      <p className="mb-5 text-sm font-black uppercase tracking-[0.3em] text-[#4CAF50]">
        {category}
      </p>

      <h1 className="mx-auto max-w-4xl text-4xl font-black leading-none tracking-tight text-zinc-950 md:text-6xl">
        {title}
      </h1>

      <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-zinc-600">
        {subtitle}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-500">
        <span>Published {published}</span>
        <span>•</span>
        <span>Updated {updated}</span>
        <span>•</span>
        <span>{readingTime}</span>
        <span>•</span>
        <span className="font-semibold text-zinc-800">The Rugby Panda</span>
      </div>
    </header>
  );
}
