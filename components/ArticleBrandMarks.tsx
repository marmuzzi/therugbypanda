import type { ArticleBrandMark } from "@/lib/brandAssets";

export default function ArticleBrandMarks({ marks }: { marks: ArticleBrandMark[] }) {
  if (!marks.length) return null;
  return (
    <div className="mb-7 flex flex-wrap items-center gap-3 border-b border-zinc-200 pb-5" aria-label="Teams and competitions in this article">
      {marks.map((mark) => (
        <div key={`${mark.name}-${mark.image}`} className="flex h-14 min-w-14 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-2" title={mark.name}>
          <img src={mark.image} alt={mark.alt} className="max-h-10 max-w-[104px] object-contain" />
        </div>
      ))}
    </div>
  );
}
