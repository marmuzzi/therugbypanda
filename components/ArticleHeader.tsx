import Image from "next/image";

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
    <header className="border-b border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-5xl px-5 py-14 md:px-6 md:py-20">
        <p className="mb-5 text-sm font-black uppercase tracking-[0.3em] text-[#2E7D32]">
          {category}
        </p>

        <h1 className="max-w-4xl text-4xl font-black leading-none tracking-tight text-zinc-950 md:text-6xl">
          {title}
        </h1>

        <p className="mt-6 max-w-3xl text-xl leading-8 text-zinc-600">
          {subtitle}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-3xl border border-zinc-200 bg-white p-4 text-sm text-zinc-500 md:inline-flex">
          <Image
            src="/rugby-panda-logo.png"
            alt="The Rugby Panda"
            width={64}
            height={64}
            className="h-14 w-14 rounded-full object-contain"
          />
          <div>
            <p className="font-black text-zinc-950">By The Rugby Panda</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span>{published}</span>
              <span>•</span>
              <span>Updated {updated}</span>
              <span>•</span>
              <span>{readingTime}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
