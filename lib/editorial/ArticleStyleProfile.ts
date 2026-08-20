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
      "Lead with the most important development immediately; do not use a scene-setting intro.",
      "Prefer shorter paragraphs and a brisk news rhythm.",
      "Use zero to two descriptive subheadings only when they genuinely improve navigation; headings are optional.",
      "Use bold emphasis rarely or not at all.",
      "End on consequence, timing or the next concrete thing supporters should watch.",
    ],
    presentation: { header: "compact", imagePlacement: "top", imageShape: "standard", keyPointsPlacement: "after-body", bodyRhythm: "tight" },
  },
  "analysis-led": {
    id: "analysis-led",
    generationLabel: "Analysis",
    generationInstructions: [
      "Open with a clear thesis or interpretation rather than merely restating the news.",
      "Build the piece around two or three analytical movements, with evidence and implications in each.",
      "Use two or three concise subheadings; avoid repetitive generic labels.",
      "Use one or two short bold phrases where they sharpen the argument, never as decoration.",
      "Allow some longer paragraphs when an argument needs room, balanced by shorter transition paragraphs.",
    ],
    presentation: { header: "standard", imagePlacement: "after-key-points", imageShape: "inset", keyPointsPlacement: "before-body", bodyRhythm: "standard" },
  },
  "feature-led": {
    id: "feature-led",
    generationLabel: "Feature writer",
    generationInstructions: [
      "Begin with a person, place, moment or specific rugby detail that naturally opens the story, then widen into the main argument.",
      "Use fewer subheadings than a standard news article; one or two may be enough and none is acceptable when the narrative flows naturally.",
      "Vary paragraph length deliberately: short observations can sit beside fuller explanatory paragraphs.",
      "Use bold only if a single pivotal phrase deserves emphasis; most feature copy should rely on prose rhythm instead.",
      "Finish with a forward-looking image, selection question or consequence rather than a summary paragraph.",
    ],
    presentation: { header: "feature", imagePlacement: "top", imageShape: "cinematic", keyPointsPlacement: "after-body", bodyRhythm: "spacious" },
  },
  notebook: {
    id: "notebook",
    generationLabel: "Rugby notebook",
    generationInstructions: [
      "Write with an observant, conversational rugby-writer rhythm while remaining factual and professional.",
      "Use several compact sections or turns of thought rather than one continuous essay.",
      "Subheadings may be short and characterful; use two to four if useful, but do not repeat the same heading pattern as other articles.",
      "Short one-sentence paragraphs are allowed for emphasis. Use up to three brief bold fragments when genuinely useful.",
      "Prioritise details supporters will notice: combinations, positional battles, coaching choices, form signals and small consequences.",
    ],
    presentation: { header: "notebook", imagePlacement: "after-opening", imageShape: "wide", keyPointsPlacement: "after-body", bodyRhythm: "mixed" },
  },
  explainer: {
    id: "explainer",
    generationLabel: "Explainer",
    generationInstructions: [
      "Start by answering why this story matters now, in plain language.",
      "Organise the article around the reader's likely questions, but do not force every heading into question form.",
      "Use two to four useful subheadings and make each one specific to this story rather than generic newsroom labels.",
      "Use selective bold emphasis for names, numbers or consequences only when it improves scanning.",
      "Keep paragraphs clear and moderately short, and finish with the unresolved question or next milestone.",
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

export function selectArticleStyleProfile(seed: string, storyType?: StoryType | string): ArticleStyleProfile {
  const candidates = compatibleProfiles(storyType);
  const index = stableHash(`${seed}|${storyType ?? "news"}`) % candidates.length;
  return PROFILES[candidates[index]];
}
