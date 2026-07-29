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

const editorialFont = { fontFamily: "var(--font-editorial)" };

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p
        className="mb-7 text-[1.06rem] leading-[1.82] text-zinc-800 sm:text-[1.12rem] md:text-[1.18rem]"
        style={editorialFont}
      >
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-5 mt-14 border-t border-zinc-200 pt-8 text-[1.9rem] font-black leading-[1.08] tracking-[-0.035em] text-zinc-950 md:text-[2.35rem]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 mt-10 text-[1.45rem] font-black leading-tight tracking-[-0.025em] text-zinc-950 md:text-[1.75rem]">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className="my-10 border-l-4 border-[#2E7D32] bg-[#F6F8F5] px-6 py-6 text-[1.28rem] font-bold italic leading-[1.62] text-zinc-900 md:text-[1.5rem]"
        style={editorialFont}
      >
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-black text-zinc-950" style={{ ...editorialFont, fontWeight: 900 }}>
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
          className="font-bold text-[#246b2a] underline decoration-[#7CB342] decoration-2 underline-offset-4 hover:text-[#174f1d]"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul
        className="mb-8 ml-6 list-disc space-y-3 text-[1.06rem] leading-[1.78] text-zinc-800 marker:text-[#2E7D32] sm:text-[1.12rem] md:text-[1.18rem]"
        style={editorialFont}
      >
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol
        className="mb-8 ml-6 list-decimal space-y-3 text-[1.06rem] leading-[1.78] text-zinc-800 marker:font-black marker:text-[#2E7D32] sm:text-[1.12rem] md:text-[1.18rem]"
        style={editorialFont}
      >
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
    <article className="mx-auto w-full max-w-[740px] [&>p:first-child]:text-[1.18rem] [&>p:first-child]:leading-[1.78] md:[&>p:first-child]:text-[1.28rem]">
      <PortableText value={normalizedBody as never[]} components={components} />
    </article>
  );
}
