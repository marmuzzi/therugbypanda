import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "hvg4b508";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error("Missing SANITY_API_TOKEN. Create a write token in the hosted Sanity project and run SANITY_API_TOKEN=... npm run seed:sanity");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const categories = [
  { _id: "category-news", title: "News", slug: "news", description: "Latest rugby stories from The Rugby Panda across Ireland, the provinces, the URC and the international game." },
  { _id: "category-provinces", title: "Provinces", slug: "provinces", description: "Coverage and analysis across Leinster, Munster, Ulster and Connacht." },
  { _id: "category-ireland", title: "Ireland", slug: "ireland", description: "Ireland team coverage, selection context and international rugby analysis." },
  { _id: "category-urc", title: "URC", slug: "urc", description: "United Rugby Championship stories, trends and match understanding." },
  { _id: "category-europe", title: "International", slug: "international", description: "International rugby coverage, including major test windows, tournaments and cross-border storylines." },
];

const provinces = [
  { _id: "province-leinster", title: "Leinster", slug: "leinster", shortName: "Leinster" },
  { _id: "province-munster", title: "Munster", slug: "munster", shortName: "Munster" },
  { _id: "province-ulster", title: "Ulster", slug: "ulster", shortName: "Ulster" },
  { _id: "province-connacht", title: "Connacht", slug: "connacht", shortName: "Connacht" },
];

const competitions = [
  { _id: "competition-urc", title: "URC", slug: "urc" },
  { _id: "competition-international", title: "International", slug: "international" },
];

const tags = ["Leinster", "Munster", "Ulster", "Connacht", "Ireland", "URC", "International", "Analysis", "Introduction"].map((title) => ({
  _id: `tag-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
  title,
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
}));

const author = {
  _id: "author-rugby-panda-newsroom",
  _type: "author",
  name: "The Rugby Panda",
  slug: { _type: "slug", current: "the-rugby-panda" },
  role: "Editorial team",
  bio: "Independent coverage and analysis of Irish, European and international rugby.",
};

function block(text, style = "normal") {
  return {
    _type: "block",
    _key: crypto.randomUUID().replaceAll("-", "").slice(0, 12),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: crypto.randomUUID().replaceAll("-", "").slice(0, 12), text, marks: [] }],
  };
}

function ref(_ref) {
  return { _type: "reference", _ref };
}

const introductionArticleId = "article-welcome-to-the-rugby-panda";
const introductionDraftId = `drafts.${introductionArticleId}`;

const introductionDraft = {
  _id: introductionDraftId,
  _type: "article",
  title: "Welcome to The Rugby Panda: rugby worth reading",
  slug: { _type: "slug", current: "welcome-to-the-rugby-panda" },
  standfirst: "A new independent rugby newsroom built for supporters who want clear reporting, useful context and thoughtful analysis of the game.",
  readingTime: "4 min read",
  isLead: false,
  useBrandImage: true,
  author: ref(author._id),
  category: ref("category-news"),
  tags: [ref("tag-introduction")],
  keyPoints: [
    "The Rugby Panda will focus on Irish provincial rugby, the URC and the international game.",
    "Coverage will favour accuracy, context and clear analysis over manufactured controversy.",
    "Every published article will pass through a human editorial review before reaching readers.",
  ],
  body: [
    block("Rugby does not suffer from a shortage of noise. Every team selection becomes a crisis, every defeat becomes a collapse and every promising player is immediately presented as the answer to a question nobody has properly asked."),
    block("The Rugby Panda is being built as an alternative: an independent digital newsroom for supporters who enjoy the game, care about the detail and want coverage that respects their intelligence."),
    block("What we will cover", "h2"),
    block("Our core focus is Irish rugby: Leinster, Munster, Ulster and Connacht, the United Rugby Championship and the Ireland team. Ireland national-team coverage belongs within our International section, alongside the wider Test game."),
    block("That means match reporting, selection context, tactical trends, squad development and the decisions that shape a season. It also means knowing when a story needs depth and when it simply needs to be explained clearly."),
    block("How we want to cover it", "h2"),
    block("The aim is not to be the loudest voice in rugby. It is to be a useful one. Reporting should separate confirmed information from interpretation. Analysis should explain why something matters rather than merely declaring that it does."),
    block("We will make room for strong opinions, but opinion will be presented as opinion. Headlines should earn attention without misleading the reader, and criticism should remain fair even when the subject is difficult."),
    block("Built around editorial standards", "h2"),
    block("Every article published by The Rugby Panda will pass through a human editorial review. Sources, factual support, image rights and presentation all matter. Speed is valuable, but not when it comes at the expense of accuracy or trust."),
    block("We are starting small and deliberately. The first job is to establish a consistent standard, publish work worth returning to and build a newsroom that can cover rugby reliably throughout the season."),
    block("A newsroom for supporters", "h2"),
    block("The Rugby Panda is for people who watch closely, argue honestly and still remember that rugby is meant to be enjoyed. We will take the reporting seriously without taking ourselves too seriously."),
    block("This is the beginning. The site will grow, the coverage will widen and the voice will develop, but the promise is straightforward: clear reporting, thoughtful analysis and rugby worth reading."),
  ],
};

const legacySeedArticleIds = [
  "article-leinster-season-preview-2026",
  "article-ireland-depth-chart-autumn-window",
  "article-urc-storylines-opening-month",
  "article-european-game-management-big-nights",
  "article-munster-control-not-emotion",
  "article-ulster-need-clarity",
  "article-connacht-edge-awkward-games",
];

const transaction = client.transaction();

for (const item of categories) {
  transaction.createOrReplace({ _type: "category", ...item, slug: { _type: "slug", current: item.slug } });
}

for (const item of provinces) {
  transaction.createIfNotExists({ _type: "province", ...item, slug: { _type: "slug", current: item.slug } });
}

for (const item of competitions) {
  transaction.createOrReplace({ _type: "competition", ...item, slug: { _type: "slug", current: item.slug } });
}

for (const item of tags) {
  transaction.createOrReplace({ _type: "tag", ...item, slug: { _type: "slug", current: item.slug } });
}

transaction.createOrReplace(author);

for (const articleId of legacySeedArticleIds) {
  transaction.delete(articleId);
  transaction.delete(`drafts.${articleId}`);
}

// Enforce the human approval boundary: remove any published launch document and
// create only a Studio draft for editorial review and amendment.
transaction.delete(introductionArticleId);
transaction.createOrReplace(introductionDraft);

await transaction.commit();
console.log(`Removed legacy seed articles, unpublished the launch introduction, and created ${introductionDraftId} for editorial review in ${projectId}/${dataset}.`);
