type ReaderSupportProps = {
  title: string;
  body: string;
};

export default function ReaderSupport({ title, body }: ReaderSupportProps) {
  return (
    <aside className="my-12 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 text-center md:p-8">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
        Reader support
      </p>
      <h2 className="mt-3 text-xl font-black tracking-tight text-zinc-950">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
        {body}
      </p>
    </aside>
  );
}
