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

function textOf(block?: PortableBlock): string {
  return block?.children?.map((child) => child.text ?? "").join("").trim() ?? "";
}

function sentenceLike(text: string): boolean {
  return /[.!?…][”’"']?$/.test(text.trim());
}

function promoteFlatBrandCopy(body: PortableBlock[]): PortableBlock[] {
  const normalBlocks = body.filter((block) => block?._type === "block" && (block.style ?? "normal") === "normal");
  const hasHeadings = body.some((block) => block?._type === "block" && ["h2", "h3"].includes(block.style ?? ""));
  if (hasHeadings || normalBlocks.length < 8) return body;

  const promoted: PortableBlock[] = [];
  let paragraphBuffer: PortableBlock[] = [];

  const flush = () => {
    if (!paragraphBuffer.length) return;
    const combined = paragraphBuffer.map(textOf).filter(Boolean).join(" ");
    const first = paragraphBuffer[0];
    promoted.push({
      ...first,
      _key: `${first._key ?? "paragraph"}-grouped`,
      style: "normal",
      children: [
        {
          _type: "span",
          _key: `${first._key ?? "paragraph"}-span`,
          text: combined,
          marks: [],
        },
      ],
      markDefs: [],
    });
    paragraphBuffer = [];
  };

  for (const block of body) {
    if (block?._type !== "block" || (block.style ?? "normal") !== "normal") {
      flush();
      promoted.push(block);
      continue;
    }

    const text = textOf(block);
    if (!text) continue;

    const looksLikeHeading = text.length <= 42 && !sentenceLike(text) && !text.startsWith("—");
    if (looksLikeHeading) {
      flush();
      promoted.push({ ...block, style: "h2" });
      continue;
    }

    paragraphBuffer.push(block);
    const bufferedWords = paragraphBuffer.reduce((count, item) => count + textOf(item).split(/\s+/).filter(Boolean).length, 0);
    if (bufferedWords >= 42 || text.startsWith("—")) flush();
  }

  flush();
  return promoted;
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-lg leading-8 text-zinc-700 md:text-xl md:leading-9">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="pt-4 text-2xl font-black leading-tight tracking-tight text-zinc-950 md:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="pt-2 text-xl font-black leading-tight tracking-tight text-zinc-950 md:text-2xl">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#2E7D32] pl-6 text-xl font-semibold italic leading-8 text-zinc-800 md:text-2xl md:leading-9">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-black text-zinc-950">{children}</strong>,
    em: ({ children }) => <em className="italic text-zinc-800">{children}</em>,
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
      <ul className="ml-6 list-disc space-y-3 text-lg leading-8 text-zinc-700 marker:text-[#2E7D32] md:text-xl md:leading-9">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="ml-6 list-decimal space-y-3 text-lg leading-8 text-zinc-700 marker:font-bold marker:text-[#2E7D32] md:text-xl md:leading-9">
        {children}
      </ol>
    ),
  },
};

type ArticleBodyProps = {
  body: unknown[];
};

export default function ArticleBody({ body }: ArticleBodyProps) {
  const normalizedBody = promoteFlatBrandCopy(expandMarkdownStrong(body));

  return (
    <article className="w-full max-w-[800px] space-y-6 md:space-y-7">
      <PortableText value={normalizedBody as never[]} components={components} />
    </article>
  );
}
