import { PortableText, type PortableTextComponents } from "@portabletext/react";

type PortableSpan = {
  _type?: string;
  _key?: string;
  text?: string;
  marks?: string[];
};

type PortableBlock = {
  _type?: string;
  _key?: string;
  style?: string;
  children?: PortableSpan[];
  markDefs?: unknown[];
  [key: string]: unknown;
};

function expandMarkdownStrong(body: unknown[]): PortableBlock[] {
  return body.map((value) => {
    const block = value as PortableBlock;
    if (block?._type !== "block" || !Array.isArray(block.children)) return block;

    const children = block.children.flatMap((child, childIndex) => {
      if (child?._type !== "span" || typeof child.text !== "string" || !child.text.includes("**")) {
        return [child];
      }

      const parts = child.text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
      return parts.map((part, partIndex) => {
        const isStrong = part.startsWith("**") && part.endsWith("**") && part.length > 4;
        return {
          ...child,
          _key: `${child._key ?? `span-${childIndex}`}-${partIndex}`,
          text: isStrong ? part.slice(2, -2) : part,
          marks: isStrong
            ? Array.from(new Set([...(child.marks ?? []), "strong"]))
            : child.marks ?? [],
        };
      });
    });

    return { ...block, children };
  });
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 font-[family-name:var(--font-editorial)] text-[1.16rem] leading-[1.68] tracking-[-0.006em] text-zinc-800 sm:text-[1.2rem] md:text-[1.24rem]">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-11 font-[family-name:var(--font-interface)] text-[1.9rem] font-extrabold leading-[1.08] tracking-[-0.035em] text-zinc-950 md:text-[2.35rem]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-8 font-[family-name:var(--font-interface)] text-[1.45rem] font-bold leading-tight tracking-[-0.02em] text-zinc-950 md:text-[1.75rem]">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-9 border-l-4 border-[#2E7D32] bg-[#f7faf7] px-6 py-5 font-[family-name:var(--font-editorial)] text-[1.32rem] font-semibold italic leading-[1.5] text-zinc-900 md:text-[1.52rem]">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-[family-name:var(--font-editorial)] font-extrabold text-zinc-950">
        {children}
      </strong>
    ),
    em: ({ children }) => <em className="italic text-zinc-900">{children}</em>,
    underline: ({ children }) => <span className="underline decoration-2 underline-offset-2">{children}</span>,
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : undefined;
      const external = Boolean(href?.startsWith("http"));
      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          className="font-semibold text-[#246b2a] underline decoration-[#7CB342] decoration-2 underline-offset-4 hover:text-[#174f1d]"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-7 ml-6 list-disc space-y-2 font-[family-name:var(--font-editorial)] text-[1.14rem] leading-[1.66] text-zinc-800 marker:text-[#2E7D32] sm:text-[1.18rem] md:text-[1.22rem]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-7 ml-6 list-decimal space-y-2 font-[family-name:var(--font-editorial)] text-[1.14rem] leading-[1.66] text-zinc-800 marker:font-bold marker:text-[#2E7D32] sm:text-[1.18rem] md:text-[1.22rem]">
        {children}
      </ol>
    ),
  },
};

type ArticleBodyProps = {
  body: unknown[];
};

export default function ArticleBody({ body }: ArticleBodyProps) {
  const normalizedBody = expandMarkdownStrong(body);

  return (
    <article className="mx-auto w-full max-w-[760px]">
      <PortableText value={normalizedBody as never[]} components={components} />
    </article>
  );
}
