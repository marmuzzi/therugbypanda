export type ContextualDataCardRow = {
  label: string;
  value: string;
  sourceIds?: string[];
};

export type ContextualDataCardData = {
  kind?: "player" | "comparison" | "team" | "match";
  title: string;
  subtitle?: string;
  rows?: ContextualDataCardRow[];
  note?: string;
};

type Props = {
  card: ContextualDataCardData;
};

export default function ContextualDataCard({ card }: Props) {
  const rows = (card.rows ?? []).filter((row) => row.label?.trim() && row.value?.trim());
  if (!card.title?.trim() || rows.length < 2) return null;

  const eyebrow = card.kind === "comparison"
    ? "Head to head"
    : card.kind === "team"
      ? "Team snapshot"
      : card.kind === "match"
        ? "Match snapshot"
        : "Player snapshot";

  return (
    <aside className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-950 text-white shadow-xl shadow-zinc-950/10">
      <div className="border-b border-white/10 px-5 py-5 md:px-6">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#a7d96b]">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-black leading-tight tracking-tight">{card.title}</h2>
        {card.subtitle ? <p className="mt-2 text-sm leading-6 text-zinc-300">{card.subtitle}</p> : null}
      </div>

      <dl className="divide-y divide-white/10">
        {rows.map((row, index) => (
          <div key={`${row.label}-${index}`} className="grid grid-cols-[minmax(90px,0.85fr)_1.35fr] gap-4 px-5 py-3.5 md:px-6">
            <dt className="text-xs font-bold uppercase tracking-wide text-zinc-400">{row.label}</dt>
            <dd className="text-sm font-bold leading-5 text-zinc-100">{row.value}</dd>
          </div>
        ))}
      </dl>

      {card.note ? (
        <p className="border-t border-white/10 bg-white/[0.04] px-5 py-4 text-xs leading-5 text-zinc-400 md:px-6">
          {card.note}
        </p>
      ) : null}
    </aside>
  );
}
