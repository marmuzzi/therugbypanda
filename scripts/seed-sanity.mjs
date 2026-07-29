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
  title: "Welcome to The Rugby Panda",
  slug: { _type: "slug", current: "welcome-to-the-rugby-panda" },
  standfirst: "Independent rugby coverage, thoughtful analysis and stories from the game we all love.",
  seoTitle: "Welcome to The Rugby Panda | Independent Irish Rugby Coverage",
  metaDescription: "Welcome to The Rugby Panda. Independent coverage, thoughtful analysis and stories from Leinster, Munster, Ulster, Connacht, the URC, Ireland and the international game.",
  readingTime: "2 min read",
  isLead: false,
  useBrandImage: false,
  author: ref(author._id),
  category: ref("category-news"),
  tags: [ref("tag-introduction")],
  keyPoints: [
    "Independent rugby coverage with context, clarity and thoughtful analysis.",
    "Coverage across the provinces, the URC, Ireland and the international game.",
    "Stories written for supporters who want to understand why things happen, not only what happened.",
  ],
  body: [
    block("Why we built The Rugby Panda", "h2"),
    block("If you're reading this, there's a good chance you love rugby as much as we do. Not because every match is perfect. Quite the opposite."),
    block("We love the Monday morning debates after a European weekend, spotting the next academy player before everyone knows their name, and the tactical battles that never make the highlights. And yes, we occasionally think the referee got it wrong too."),
    block("What we want to explain", "h2"),
    block("Rugby has never lacked people telling us what happened. What we've always wanted is someone to explain why: why a selection mattered, why momentum shifted, and why one decision changed an entire match."),
    block("That's what you'll find here: clear reporting, thoughtful analysis, and stories that respect the intelligence of rugby supporters."),
    block("The rugby we care about", "h2"),
    block("Our focus is Leinster, Munster, Ulster, Connacht, the URC, the Ireland national team and the biggest stories from the international game."),
    block("Whether you've found us before kick-off, after the final whistle or somewhere in between, we're delighted you're here."),
    block("Now, let's talk rugby."),
    block("— The Rugby Panda Team"),
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
