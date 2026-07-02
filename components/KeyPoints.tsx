type KeyPointsProps = {
  points: string[];
};

export default function KeyPoints({ points }: KeyPointsProps) {
  return (
    <aside className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 md:p-8">
      <h2 className="text-sm font-black uppercase tracking-[0.25em] text-[#2E7D32]">
        Key points
      </h2>

      <ul className="mt-5 space-y-4">
        {points.map((point) => (
          <li key={point} className="flex gap-3 text-base leading-7 text-zinc-700">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#4CAF50]" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
