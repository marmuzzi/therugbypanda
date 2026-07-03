import { notFound } from "next/navigation";

import ArticleBody from "@/components/ArticleBody";
import ArticleHeader from "@/components/ArticleHeader";
import ContinueReading from "@/components/ContinueReading";
import KeyPoints from "@/components/KeyPoints";
import ReaderSupport from "@/components/ReaderSupport";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import TagList from "@/components/TagList";
import { articleDateLabel, getArticleBySlug, portableTextToSections } from "@/lib/cms";

const sampleSlug = "leinster-season-preview-2026";

const keyPoints = [
  "Leinster enter the 2026/27 season with familiar expectations and a squad still built to compete on multiple fronts.",
  "Selection depth, European game management and the next wave of academy graduates are likely to shape the campaign.",
  "The biggest question is not whether Leinster have enough talent, but whether they can turn control into silverware when the margins tighten.",
];

const articleSections = [
  {
    paragraphs: [
      "Leinster seasons rarely begin quietly. There is always a familiar combination of expectation, scrutiny and possibility around a squad that has spent years setting standards in Ireland and Europe.",
      "The 2026/27 campaign should be no different. The province will again be judged by the sharp end of the year, but the story of their season will be shaped much earlier: in selection calls, player management, tactical detail and the ability to keep evolving while everyone else studies the blueprint.",
    ],
  },
  {
    heading: "The familiar challenge of depth",
    paragraphs: [
      "Leinster's great advantage remains the scale of their squad. Few European sides can rotate heavily while still putting international-level players across the pitch. That depth is a strength, but it also creates pressure: combinations need rhythm, younger players need meaningful minutes and senior players need to peak when the knockout matches arrive.",
      "The early URC rounds should offer clues about where the coaching staff see the next layer of contributors. Front-row minutes, back-row balance and the midfield mix will be worth watching closely.",
    ],
  },
  {
    heading: "Europe will define the mood",
    paragraphs: [
      "For all the importance of domestic consistency, Leinster's wider reputation is often measured against European nights. Control, territory and defensive pressure have carried them a long way, but the final steps usually demand something less tidy: adaptability when a plan is disrupted, calm when momentum swings and accuracy after long spells without the ball.",
      "That is where this season becomes interesting. Leinster do not need to reinvent themselves, but they do need to keep adding layers. The best teams in Europe are too well prepared for one version of any opponent.",
    ],
  },
  {
    heading: "Young players with a route into the story",
    paragraphs: [
      "A newsroom season preview should always leave room for emergence. Leinster's academy pathway has repeatedly changed the shape of campaigns, sometimes faster than expected. Injuries, international windows and fixture congestion can all create openings for players who look like depth options in July and central figures by spring.",
      "The names will become clearer as the opening weeks unfold, but the broader theme is already obvious: Leinster need the next group to do more than cover minutes. They need them to challenge the established order.",
    ],
  },
  {
    heading: "The bottom line",
    paragraphs: [
      "Leinster have enough quality to make this another serious campaign. That is the baseline, not the conclusion. The real test is whether they can turn squad strength into sharper big-game solutions and keep their rugby fresh across a long season.",
      "If they do, the 2026/27 campaign could become another defining chapter. If not, familiar questions will return with familiar force.",
    ],
  },
];

const continueReading = [
  {
    category: "Ireland",
    title: "Ireland's depth chart questions before the autumn window",
    href: "#",
  },
  {
    category: "URC",
    title: "The URC storylines that could shape the opening month",
    href: "#",
  },
  {
    category: "Europe",
    title: "Why game management still decides the biggest European nights",
    href: "#",
  },
];

const tags = ["Leinster", "URC", "European rugby", "Season preview"];

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const cmsArticle = await getArticleBySlug(slug);

  if (!cmsArticle && slug !== sampleSlug) {
    notFound();
  }

  const category = [cmsArticle?.category, cmsArticle?.province ?? cmsArticle?.competition]
    .filter(Boolean)
    .join(" • ");
  const sections = cmsArticle ? portableTextToSections(cmsArticle.body) : articleSections;

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />

      <ArticleHeader
        category={category || "Provinces • Leinster"}
        title={cmsArticle?.title ?? "Leinster season preview: building towards another defining campaign"}
        subtitle={cmsArticle?.standfirst ?? "A first look at the storylines, selection questions and European ambitions shaping Leinster’s 2026/27 season."}
        published={cmsArticle ? articleDateLabel(cmsArticle.publishedAt) : "2 July 2026"}
        updated={cmsArticle ? articleDateLabel(cmsArticle.updatedAt ?? cmsArticle.publishedAt) : "2 July 2026"}
        readingTime={cmsArticle?.readingTime ?? "6 min read"}
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-20 md:grid-cols-[minmax(0,1fr)_320px] md:px-6">
        <div className="min-w-0 space-y-12">
          <KeyPoints points={cmsArticle?.keyPoints?.length ? cmsArticle.keyPoints : keyPoints} />
          <ArticleBody sections={sections.length ? sections : articleSections} />
          <ReaderSupport
            title="Independent rugby coverage takes time."
            body="Future partner placements will sit clearly outside the editorial copy, helping support the newsroom without interrupting the reader experience."
          />
          <TagList tags={cmsArticle?.tags?.length ? cmsArticle.tags : tags} />
          <ContinueReading articles={continueReading} />
        </div>

        <aside className="space-y-6 md:pt-2">
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#2E7D32]">
              The Rugby Panda
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Independent Irish and European rugby coverage, built around context, analysis and match understanding.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
              Newsletter
            </p>
            <h2 className="mt-3 text-xl font-black tracking-tight text-zinc-950">
              Follow the newsroom build
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Newsletter sign-up will be added in a later version as the publishing workflow develops.
            </p>
          </div>
        </aside>
      </div>

      <SiteFooter />
    </main>
  );
}
