import Link from "next/link";

type ContinueReadingItem = {
  category: string;
  title: string;
  href: string;
};

type ContinueReadingProps = {
  articles: ContinueReadingItem[];
};

export default function ContinueReading({ articles }: ContinueReadingProps) {
  return (
    <section className="border-t border-zinc-200 pt-10">
      <h2 className="text-sm font-black uppercase tracking-[0.25em] text-[#2E7D32]">
        Continue reading
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.title}
            href={article.href}
            className="rounded-3xl border border-zinc-200 p-5 transition hover:border-[#2E7D32] hover:shadow-sm"
          >
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
              {article.category}
            </p>
            <h3 className="mt-3 text-lg font-black leading-6 tracking-tight text-zinc-950">
              {article.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
