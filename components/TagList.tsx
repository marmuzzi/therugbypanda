type TagListProps = {
  tags: string[];
};

export default function TagList({ tags }: TagListProps) {
  return (
    <section className="flex flex-wrap gap-3 border-t border-zinc-200 pt-8">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-bold text-zinc-700"
        >
          #{tag}
        </span>
      ))}
    </section>
  );
}
