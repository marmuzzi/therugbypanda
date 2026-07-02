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
    <header className="mx-auto max-w-3xl px-6 py-12 text-center">
      <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-[#2E7D32]">
        {category}
      </p>

      <h1 className="text-4xl font-black tracking-tight text-zinc-950 md:text-6xl">
        {title}
      </h1>

      <p className="mt-6 text-xl leading-8 text-zinc-600">{subtitle}</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-500">
        <span>Published {published}</span>
        <span>•</span>
        <span>Updated {updated}</span>
        <span>•</span>
        <span>{readingTime}</span>
        <span>•</span>
        <span className="font-semibold text-zinc-800">By The Rugby Panda</span>
      </div>
    </header>
  );
}
