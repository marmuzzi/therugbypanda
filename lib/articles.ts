export type ArticleSummary = {
  category: string;
  title: string;
  excerpt: string;
  href: string;
  meta: string;
  featured?: boolean;
  section?: string;
};

export const featuredArticle: ArticleSummary = {
  category: "Provinces • Leinster",
  title: "Leinster season preview: building towards another defining campaign",
  excerpt:
    "A first look at the storylines, selection questions and European ambitions shaping Leinster’s 2026/27 season.",
  href: "/articles/leinster-season-preview-2026",
  meta: "6 min read • 2 July 2026",
  featured: true,
  section: "Leinster",
};

export const latestArticles: ArticleSummary[] = [
  featuredArticle,
  {
    category: "Ireland",
    title: "Ireland’s depth chart questions before the autumn window",
    excerpt:
      "The early selection debates that could matter most once the international calendar returns.",
    href: "#",
    meta: "Preview",
    section: "Ireland",
  },
  {
    category: "URC",
    title: "The URC storylines that could shape the opening month",
    excerpt:
      "Fixture rhythm, squad rotation and early momentum will define how contenders settle into the campaign.",
    href: "#",
    meta: "Preview",
    section: "URC",
  },
  {
    category: "Europe",
    title: "Why game management still decides the biggest European nights",
    excerpt:
      "Control matters, but knockout rugby often turns on adaptation, pressure and precision after momentum swings.",
    href: "#",
    meta: "Analysis",
    section: "Europe",
  },
  {
    category: "Provinces • Munster",
    title: "Munster’s next step is about control, not emotion",
    excerpt:
      "The province already has intensity. The question is whether they can turn that into repeatable shape and discipline.",
    href: "#",
    meta: "Analysis",
    section: "Munster",
  },
  {
    category: "Provinces • Ulster",
    title: "Ulster need clarity before they need miracles",
    excerpt:
      "The squad has enough talent to move forward, but the first job is making the plan feel coherent again.",
    href: "#",
    meta: "Column",
    section: "Ulster",
  },
  {
    category: "Provinces • Connacht",
    title: "Connacht’s edge remains their best route into awkward games",
    excerpt:
      "At their best, Connacht make opponents uncomfortable early and keep the contest alive deep into the final quarter.",
    href: "#",
    meta: "Notebook",
    section: "Connacht",
  },
];

export const provinceArticles = latestArticles.filter((article) =>
  ["Leinster", "Munster", "Ulster", "Connacht"].includes(article.section ?? ""),
);

export const analysisArticles = latestArticles.filter((article) =>
  ["Analysis", "Column", "Notebook"].some((label) => article.meta.includes(label)),
);

export const sections = [
  "Leinster",
  "Munster",
  "Ulster",
  "Connacht",
  "Ireland",
  "URC",
  "Europe",
];
