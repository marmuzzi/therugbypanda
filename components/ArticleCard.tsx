import Link from "next/link";

type ArticleCardProps = {
  category: string;
  title: string;
  excerpt: string;
  href: string;
  meta?: string;
  featured?: boolean;
};

export default function ArticleCard({
  category,
  title,
  excerpt,
  href,
  meta,
  featured = false,
}: ArticleCardProps) {
  return (
    <Link
      href={href}
      className={`group block rounded-3xl border border-zinc-200 bg-white p-6 transition hover:border-[#2E7D32] hover:shadow-sm ${
        featured ? "md:p-8" : ""
      }`}
    >
      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#2E7D32]">
        {category}
      </p>

      <h2
        className={`mt-4 font-black leading-tight tracking-tight text-zinc-950 group-hover:text-[#2E7D32] ${
          featured ? "text-3xl md:text-5xl" : "text-2xl"
        }`}
      >
        {title}
      </h2>

      <p className="mt-4 text-base leading-7 text-zinc-600">{excerpt}</p>

      {meta ? (
        <p className="mt-6 text-sm font-semibold text-zinc-500">{meta}</p>
      ) : null}
    </Link>
  );
}
