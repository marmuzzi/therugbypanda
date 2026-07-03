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
  { _id: "category-news", title: "News", slug: "news", description: "Latest Irish, URC and European rugby stories from The Rugby Panda." },
  { _id: "category-provinces", title: "Provinces", slug: "provinces", description: "Coverage and analysis across Leinster, Munster, Ulster and Connacht." },
  { _id: "category-ireland", title: "Ireland", slug: "ireland", description: "Ireland team coverage, selection context and international rugby analysis." },
  { _id: "category-urc", title: "URC", slug: "urc", description: "United Rugby Championship stories, trends and match understanding." },
  { _id: "category-europe", title: "Europe", slug: "europe", description: "Champions Cup and wider European rugby coverage." },
];

const provinces = [
  { _id: "province-leinster", title: "Leinster", slug: "leinster", shortName: "Leinster" },
  { _id: "province-munster", title: "Munster", slug: "munster", shortName: "Munster" },
  { _id: "province-ulster", title: "Ulster", slug: "ulster", shortName: "Ulster" },
  { _id: "province-connacht", title: "Connacht", slug: "connacht", shortName: "Connacht" },
];

const competitions = [
  { _id: "competition-urc", title: "URC", slug: "urc" },
  { _id: "competition-europe", title: "Europe", slug: "europe" },
];

const tags = ["Leinster", "Munster", "Ulster", "Connacht", "Ireland", "URC", "Europe", "Analysis", "Season preview"].map((title) => ({
  _id: `tag-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
  title,
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
}));

const author = {
  _id: "author-rugby-panda-newsroom",
  _type: "author",
  name: "The Rugby Panda Newsroom",
  slug: { _type: "slug", current: "rugby-panda-newsroom" },
  role: "Editorial team",
  bio: "Independent Irish and European rugby coverage built around context, analysis and match understanding.",
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

const articles = [
  {
    _id: "article-leinster-season-preview-2026",
    title: "Leinster season preview: building towards another defining campaign",
    slug: "leinster-season-preview-2026",
    standfirst: "A first look at the storylines, selection questions and European ambitions shaping Leinster’s 2026/27 season.",
    publishedAt: "2026-07-02T09:00:00Z",
    readingTime: "6 min read",
    isLead: true,
    category: "category-provinces",
    province: "province-leinster",
    tags: ["tag-leinster", "tag-urc", "tag-europe", "tag-season-preview"],
    keyPoints: [
      "Leinster enter the 2026/27 season with familiar expectations and a squad still built to compete on multiple fronts.",
      "Selection depth, European game management and the next wave of academy graduates are likely to shape the campaign.",
      "The biggest question is not whether Leinster have enough talent, but whether they can turn control into silverware when the margins tighten.",
    ],
    body: [
      block("Leinster seasons rarely begin quietly. There is always a familiar combination of expectation, scrutiny and possibility around a squad that has spent years setting standards in Ireland and Europe."),
      block("The familiar challenge of depth", "h2"),
      block("Few European sides can rotate heavily while still putting international-level players across the pitch. That depth is a strength, but it also creates pressure: combinations need rhythm, younger players need meaningful minutes and senior players need to peak when the knockout matches arrive."),
      block("Europe will define the mood", "h2"),
      block("For all the importance of domestic consistency, Leinster’s wider reputation is often measured against European nights. Control, territory and defensive pressure have carried them a long way, but the final steps usually demand adaptability when a plan is disrupted."),
      block("The bottom line", "h2"),
      block("Leinster have enough quality to make this another serious campaign. The real test is whether they can turn squad strength into sharper big-game solutions and keep their rugby fresh across a long season."),
    ],
  },
  {
    _id: "article-ireland-depth-chart-autumn-window",
    title: "Ireland’s depth chart questions before the autumn window",
    slug: "ireland-depth-chart-autumn-window",
    standfirst: "The early selection debates that could matter most once the international calendar returns.",
    publishedAt: "2026-07-02T08:00:00Z",
    readingTime: "4 min read",
    category: "category-ireland",
    tags: ["tag-ireland", "tag-analysis"],
    keyPoints: ["Selection depth is becoming one of Ireland’s most important strategic advantages.", "The autumn window will test how quickly form can shift the conversation."],
    body: [block("Ireland’s depth chart is never static for long. Form, fitness and provincial momentum can all change the shape of a national debate before squads are named."), block("The useful questions are rarely about one position in isolation. They are about combinations, bench impact and whether newer players can make selection feel less predictable.")],
  },
  {
    _id: "article-urc-storylines-opening-month",
    title: "The URC storylines that could shape the opening month",
    slug: "urc-storylines-opening-month",
    standfirst: "Fixture rhythm, squad rotation and early momentum will define how contenders settle into the campaign.",
    publishedAt: "2026-07-01T13:00:00Z",
    readingTime: "5 min read",
    category: "category-urc",
    competition: "competition-urc",
    tags: ["tag-urc"],
    body: [block("The URC’s opening month often looks messy before it looks meaningful, but that does not make it empty. Rotation patterns, away performances and early discipline usually reveal more than the table does.")],
  },
  {
    _id: "article-european-game-management-big-nights",
    title: "Why game management still decides the biggest European nights",
    slug: "european-game-management-big-nights",
    standfirst: "Control matters, but knockout rugby often turns on adaptation, pressure and precision after momentum swings.",
    publishedAt: "2026-07-01T10:00:00Z",
    readingTime: "5 min read",
    category: "category-europe",
    competition: "competition-europe",
    tags: ["tag-europe", "tag-analysis"],
    body: [block("European rugby rewards power and detail, but the decisive moments often arrive when the original plan has stopped being enough."), block("The teams that survive those passages are usually the ones that can keep their kicking, discipline and set-piece decisions connected under pressure.")],
  },
  {
    _id: "article-munster-control-not-emotion",
    title: "Munster’s next step is about control, not emotion",
    slug: "munster-control-not-emotion",
    standfirst: "The province already has intensity. The question is whether they can turn that into repeatable shape and discipline.",
    publishedAt: "2026-06-30T09:00:00Z",
    readingTime: "4 min read",
    category: "category-provinces",
    province: "province-munster",
    tags: ["tag-munster", "tag-analysis"],
    body: [block("Munster rarely need help finding emotional energy. Their next step is making the sharpest parts of their game repeatable when matches become slower, tighter and more tactical.")],
  },
  {
    _id: "article-ulster-need-clarity",
    title: "Ulster need clarity before they need miracles",
    slug: "ulster-need-clarity",
    standfirst: "The squad has enough talent to move forward, but the first job is making the plan feel coherent again.",
    publishedAt: "2026-06-29T09:00:00Z",
    readingTime: "4 min read",
    category: "category-provinces",
    province: "province-ulster",
    tags: ["tag-ulster", "tag-analysis"],
    body: [block("Ulster’s route forward does not need to begin with a grand statement. It needs clarity: of selection, of territory strategy and of how their best players are being asked to influence games.")],
  },
  {
    _id: "article-connacht-edge-awkward-games",
    title: "Connacht’s edge remains their best route into awkward games",
    slug: "connacht-edge-awkward-games",
    standfirst: "At their best, Connacht make opponents uncomfortable early and keep the contest alive deep into the final quarter.",
    publishedAt: "2026-06-28T09:00:00Z",
    readingTime: "4 min read",
    category: "category-provinces",
    province: "province-connacht",
    tags: ["tag-connacht"],
    body: [block("Connacht’s best rugby has always carried a disruptive edge. They make rhythm difficult, force opponents into repeat decisions and keep games close enough for belief to matter.")],
  },
];

const transaction = client.transaction();

for (const item of categories) {
  transaction.createIfNotExists({ _type: "category", ...item, slug: { _type: "slug", current: item.slug } });
}

for (const item of provinces) {
  transaction.createIfNotExists({ _type: "province", ...item, slug: { _type: "slug", current: item.slug } });
}

for (const item of competitions) {
  transaction.createIfNotExists({ _type: "competition", ...item, slug: { _type: "slug", current: item.slug } });
}

for (const item of tags) {
  transaction.createIfNotExists({ _type: "tag", ...item, slug: { _type: "slug", current: item.slug } });
}

transaction.createIfNotExists(author);

for (const article of articles) {
  transaction.createOrReplace({
    _type: "article",
    ...article,
    slug: { _type: "slug", current: article.slug },
    author: ref(author._id),
    category: ref(article.category),
    province: article.province ? ref(article.province) : undefined,
    competition: article.competition ? ref(article.competition) : undefined,
    tags: article.tags?.map(ref),
  });
}

await transaction.commit();
console.log(`Seeded ${categories.length} categories and ${articles.length} articles into ${projectId}/${dataset}.`);
