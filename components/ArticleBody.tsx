import { PortableText, type PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 font-serif text-[1.12rem] leading-[1.85] text-zinc-800 md:text-[1.2rem]">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-5 mt-12 text-3xl font-black leading-tight tracking-[-0.025em] text-zinc-950 md:text-4xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 mt-9 text-2xl font-black leading-tight tracking-tight text-zinc-950">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-9 border-l-4 border-[#2E7D32] pl-6 font-serif text-2xl font-semibold italic leading-relaxed text-zinc-800">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-black text-zinc-950">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
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
      <ul className="mb-7 ml-5 list-disc space-y-3 font-serif text-[1.12rem] leading-8 text-zinc-800 marker:text-[#2E7D32] md:text-[1.2rem]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-7 ml-5 list-decimal space-y-3 font-serif text-[1.12rem] leading-8 text-zinc-800 marker:font-bold marker:text-[#2E7D32] md:text-[1.2rem]">
        {children}
      </ol>
    ),
  },
};

type ArticleBodyProps = {
  body: unknown[];
};

export default function ArticleBody({ body }: ArticleBodyProps) {
  return (
    <article className="max-w-[760px]">
      <PortableText value={body as never[]} components={components} />
    </article>
  );
}
