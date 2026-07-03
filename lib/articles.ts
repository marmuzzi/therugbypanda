export type ArticleSummary = {
  category: string;
  title: string;
  excerpt: string;
  href: string;
  meta: string;
  featured?: boolean;
  section?: string;
  image?: string;
  imageAlt?: string;
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
  image:
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&q=80",
  imageAlt: "Rugby stadium with players on the pitch",
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
    image:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Rugby ball on grass",
  },
  {
    category: "URC",
    title: "The URC storylines that could shape the opening month",
    excerpt:
      "Fixture rhythm, squad rotation and early momentum will define how contenders settle into the campaign.",
    href: "#",
    meta: "Preview",
    section: "URC",
    image:
      "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Stadium lights over a sports field",
  },
  {
    category: "Europe",
    title: "Why game management still decides the biggest European nights",
    excerpt:
      "Control matters, but knockout rugby often turns on adaptation, pressure and precision after momentum swings.",
    href: "#",
    meta: "Analysis",
    section: "Europe",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Athletes competing under stadium lights",
  },
  {
    category: "Provinces • Munster",
    title: "Munster’s next step is about control, not emotion",
    excerpt:
      "The province already has intensity. The question is whether they can turn that into repeatable shape and discipline.",
    href: "#",
    meta: "Analysis",
    section: "Munster",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Team sport action on grass",
  },
  {
    category: "Provinces • Ulster",
    title: "Ulster need clarity before they need miracles",
    excerpt:
      "The squad has enough talent to move forward, but the first job is making the plan feel coherent again.",
    href: "#",
    meta: "Column",
    section: "Ulster",
    image:
      "https://images.unsplash.com/photo-1509027572446-af8401acfdc3?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Sports field from above",
  },
  {
    category: "Provinces • Connacht",
    title: "Connacht’s edge remains their best route into awkward games",
    excerpt:
      "At their best, Connacht make opponents uncomfortable early and keep the contest alive deep into the final quarter.",
    href: "#",
    meta: "Notebook",
    section: "Connacht",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Sports stadium with green pitch",
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
