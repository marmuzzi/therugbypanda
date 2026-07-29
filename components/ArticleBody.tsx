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

const readingFont = {
  fontFamily:
    'Charter, "Bitstream Charter", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif',
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p
        className="mb-8 text-[1.2rem] leading-[1.72] text-zinc-800 sm:text-[1.28rem] md:text-[1.38rem] md:leading-[1.76]"
        style={readingFont}
      >
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-5 mt-14 border-l-4 border-[#7CB342] pl-5 text-[2rem] font-black leading-[1.05] tracking-[-0.035em] text-zinc-950 md:text-[2.55rem]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 mt-10 text-[1.55rem] font-black leading-tight tracking-[-0.025em] text-zinc-950 md:text-[1.9rem]">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className="my-12 border-y border-[#7CB342] py-7 text-[1.55rem] font-bold italic leading-[1.48] text-zinc-900 md:text-[1.85rem]"
        style={readingFont}
      >
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-zinc-950" style={{ fontFamily: readingFont.fontFamily, fontWeight: 800 }}>
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
        className="mb-9 ml-7 list-disc space-y-3 text-[1.18rem] leading-8 text-zinc-800 marker:text-[#2E7D32] sm:text-[1.24rem] md:text-[1.32rem]"
        style={readingFont}
      >
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol
        className="mb-9 ml-7 list-decimal space-y-3 text-[1.18rem] leading-8 text-zinc-800 marker:font-black marker:text-[#2E7D32] sm:text-[1.24rem] md:text-[1.32rem]"
        style={readingFont}
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
    <article className="max-w-[690px] border-t border-zinc-300 pt-9 [&>p:first-child]:text-[1.32rem] [&>p:first-child]:leading-[1.68] md:[&>p:first-child]:text-[1.5rem] md:[&>p:first-child]:leading-[1.65] md:[&>p:first-child]:first-letter:float-left md:[&>p:first-child]:first-letter:mr-3 md:[&>p:first-child]:first-letter:mt-1 md:[&>p:first-child]:first-letter:text-[4.8rem] md:[&>p:first-child]:first-letter:font-black md:[&>p:first-child]:first-letter:leading-[0.78] md:[&>p:first-child]:first-letter:text-[#174f1d]">
      <PortableText value={normalizedBody as never[]} components={components} />
    </article>
  );
}
