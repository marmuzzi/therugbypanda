type KeyPointsProps = {
  points: string[];
};

export default function KeyPoints({ points }: KeyPointsProps) {
  return (
    <aside className="max-w-[760px] border-y border-zinc-200 py-5">
      <div className="grid gap-4 md:grid-cols-[130px_minmax(0,1fr)] md:gap-6">
        <h2 className="text-xs font-black uppercase tracking-[0.25em] text-[#2E7D32]">
          Key points
        </h2>

        <ul className="grid gap-3 sm:grid-cols-2">
          {points.map((point) => (
            <li key={point} className="flex gap-3 text-sm font-semibold leading-6 text-zinc-700">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4CAF50]" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
