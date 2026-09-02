import type { StoryType } from "./EditorialTypes";

export const ARTICLE_STYLE_PROFILE_IDS = [
  "news-desk",
  "analysis-led",
  "feature-led",
  "notebook",
  "explainer",
] as const;

export type ArticleStyleProfileId = (typeof ARTICLE_STYLE_PROFILE_IDS)[number];

export type ArticleStyleProfile = {
  id: ArticleStyleProfileId;
  generationLabel: string;
  generationInstructions: string[];
  presentation: {
    header: "standard" | "compact" | "feature" | "notebook" | "explainer";
    imagePlacement: "top" | "after-key-points" | "after-opening";
    imageShape: "standard" | "wide" | "cinematic" | "inset";
    keyPointsPlacement: "before-body" | "after-body";
    bodyRhythm: "standard" | "tight" | "spacious" | "mixed";
  };
};

const PROFILES: Record<ArticleStyleProfileId, ArticleStyleProfile> = {
  "news-desk": {
    id: "news-desk",
    generationLabel: "News desk",
    generationInstructions: [
      "Lead with the most important development immediately; do not use a scene-setting intro or a generic opening heading.",
      "Prefer shorter paragraphs and a brisk news rhythm.",
      "Default to no subheading. Use at most one descriptive subheading only when the article would genuinely become harder to scan without it; do not divide the story into evenly spaced labelled sections.",
      "Do not emit Markdown, bold markers or decorative emphasis. Let the reporting carry the emphasis.",
      "End on consequence, timing or the next concrete thing supporters should watch without using a formulaic 'What happens next' heading.",
    ],
    presentation: { header: "compact", imagePlacement: "top", imageShape: "standard", keyPointsPlacement: "after-body", bodyRhythm: "tight" },
  },
  "analysis-led": {
    id: "analysis-led",
    generationLabel: "Analysis",
    generationInstructions: [
      "Open with one strong, complete lede sentence that names the central player or team, states the analytical thesis and gives the concrete consequence immediately; do not begin with vague scene-setting or merely announce why the story matters.",
      "Keep the standfirst deliberately concise (target 170-195 characters and never exceed the hard limit) so it remains a complete sentence without mechanical truncation.",
      "Build the piece around two or three analytical movements, with evidence and implications in each.",
      "Every analytical claim must attach to supported named people, dates, fixtures, positions or selection consequences where the evidence provides them; avoid vague placeholders such as 'different options', 'more physicality' or 'leadership will matter' without explaining who or what changes.",
      "Use exactly two story-specific analytical subheadings in a normal-length article; allow a third only when a genuinely separate supported argument requires it. Do not space headings mechanically after equal numbers of paragraphs.",
      "Avoid generic labels such as 'Why this matters now', 'The bigger picture' or 'What happens next'.",
      "Do not emit Markdown, bullet-list prefixes or inline bold markers. Use sentence construction and paragraph rhythm for emphasis.",
      "Allow some longer paragraphs when an argument needs room, balanced by shorter transition paragraphs.",
    ],
    presentation: { header: "standard", imagePlacement: "after-key-points", imageShape: "inset", keyPointsPlacement: "before-body", bodyRhythm: "standard" },
  },
  "feature-led": {
    id: "feature-led",
    generationLabel: "Feature writer",
    generationInstructions: [
      "Begin with a person, place, moment or specific rugby detail that naturally opens the story, then widen into the main argument.",
      "Prefer a continuous narrative with no subheadings. Use one subheading only when there is a clear narrative turn; use two only for a substantially longer feature with two genuinely distinct movements.",
      "Never create evenly spaced section breaks merely to make the article look structured.",
      "Vary paragraph length deliberately: short observations can sit beside fuller explanatory paragraphs.",
      "Do not emit Markdown or automatic bold emphasis; most feature copy should rely on prose rhythm instead.",
      "Finish with a forward-looking image, selection question or consequence rather than a summary paragraph or generic final heading.",
    ],
    presentation: { header: "feature", imagePlacement: "top", imageShape: "cinematic", keyPointsPlacement: "after-body", bodyRhythm: "spacious" },
  },
  notebook: {
    id: "notebook",
    generationLabel: "Rugby notebook",
    generationInstructions: [
      "Write with an observant, conversational rugby-writer rhythm while remaining factual and professional.",
      "Use several compact sections or turns of thought rather than one continuous essay.",
      "Use three short, characterful subheadings by default; a fourth is allowed only when there is enough concrete material for another distinct notebook item. This profile should visibly feel more sectional than news, analysis or feature copy.",
      "Do not repeat the same syntactic heading pattern across sections; mix noun phrases, observations and concise rugby-specific turns rather than making every heading a question or a 'why/what' construction.",
      "Short one-sentence paragraphs are allowed for emphasis. Do not emit Markdown or automatic bold markers.",
      "Prioritise details supporters will notice: combinations, positional battles, coaching choices, form signals and small consequences.",
    ],
    presentation: { header: "notebook", imagePlacement: "after-opening", imageShape: "wide", keyPointsPlacement: "after-body", bodyRhythm: "mixed" },
  },
  explainer: {
    id: "explainer",
    generationLabel: "Explainer",
    generationInstructions: [
      "Start with the central fact, answer or development itself in plain language. Never begin with a heading such as 'Why this matters now'.",
      "Organise the article around the reader's likely questions, but do not force every heading into question form.",
      "Use two or three useful, story-specific subheadings. At most one may be phrased as a direct reader question; the others should be concise descriptive labels so the article does not resemble a repetitive FAQ template.",
      "Never use generic newsroom labels such as 'Why this matters now', 'The bigger picture', 'What you need to know' or 'What happens next'.",
      "Do not emit Markdown, bullet-list prefixes or inline bold markers. Each body paragraph must be normal prose rather than a list item.",
      "Keep paragraphs clear and moderately short, and finish with the unresolved question or next milestone without a templated conclusion label.",
    ],
    presentation: { header: "explainer", imagePlacement: "after-key-points", imageShape: "standard", keyPointsPlacement: "before-body", bodyRhythm: "standard" },
  },
};

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function compatibleProfiles(storyType?: StoryType | string): ArticleStyleProfileId[] {
  switch (storyType) {
    case "breaking-news": return ["news-desk", "explainer"];
    case "analysis": return ["analysis-led", "notebook", "explainer"];
    case "opinion": return ["notebook", "analysis-led", "feature-led"];
    case "feature": return ["feature-led", "notebook"];
    case "match-report": return ["news-desk", "feature-led", "notebook"];
    case "transfer-watch":
    case "rumour-roundup":
    case "speculation": return ["news-desk", "analysis-led", "explainer"];
    default: return [...ARTICLE_STYLE_PROFILE_IDS];
  }
}

export function getArticleStyleProfile(id: ArticleStyleProfileId): ArticleStyleProfile {
  return PROFILES[id];
}

export function selectArticleStyleProfile(seed: string, storyType?: StoryType | string): ArticleStyleProfile {
  const candidates = compatibleProfiles(storyType);
  const index = stableHash(`${seed}|${storyType ?? "news"}`) % candidates.length;
  return PROFILES[candidates[index]];
}
