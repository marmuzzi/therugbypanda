import Image from "next/image";
import Link from "next/link";
import ArticleHeader from "@/components/ArticleHeader";

export default function ArticlePage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <nav className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/rugby-panda-logo.png"
              alt="The Rugby Panda"
              width={52}
              height={52}
              className="h-12 w-12 object-contain"
            />
            <span className="text-lg font-black uppercase tracking-tight">
              The Rugby Panda
            </span>
          </Link>

          <div className="hidden gap-6 text-sm font-bold uppercase tracking-wider text-zinc-700 md:flex">
            <Link href="#">Provinces</Link>
            <Link href="#">Ireland</Link>
            <Link href="#">URC</Link>
            <Link href="#">Europe</Link>
            <Link href="#">About</Link>
          </div>
        </div>
      </nav>

      <ArticleHeader
        category="Provinces • Leinster"
        title="Leinster season preview: building towards another defining campaign"
        subtitle="A first look at the storylines, selection questions and European ambitions shaping Leinster’s 2026/27 season."
        published="2 July 2026"
        updated="2 July 2026"
        readingTime="6 min read"
      />
    </main>
  );
}
