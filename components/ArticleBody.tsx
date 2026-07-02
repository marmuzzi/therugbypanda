type ArticleSection = {
  heading?: string;
  paragraphs: string[];
};

type ArticleBodyProps = {
  sections: ArticleSection[];
};

export default function ArticleBody({ sections }: ArticleBodyProps) {
  return (
    <article className="prose prose-zinc max-w-none prose-p:text-lg prose-p:leading-8 prose-p:text-zinc-700 prose-h2:mt-12 prose-h2:text-2xl prose-h2:font-black prose-h2:tracking-tight prose-h2:text-zinc-950">
      {sections.map((section, sectionIndex) => (
        <section key={`${section.heading ?? "intro"}-${sectionIndex}`}>
          {section.heading ? <h2>{section.heading}</h2> : null}

          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
