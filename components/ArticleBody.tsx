type ArticleSection = {
  heading?: string;
  paragraphs: string[];
};

type ArticleBodyProps = {
  sections: ArticleSection[];
};

export default function ArticleBody({ sections }: ArticleBodyProps) {
  return (
    <article className="space-y-10">
      {sections.map((section, sectionIndex) => (
        <section key={`${section.heading ?? "intro"}-${sectionIndex}`} className="space-y-5">
          {section.heading ? (
            <h2 className="text-2xl font-black leading-tight tracking-tight text-zinc-950 md:text-3xl">
              {section.heading}
            </h2>
          ) : null}

          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-8 text-zinc-700">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
