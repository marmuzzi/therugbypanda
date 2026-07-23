import type { EditorialCategory, RawStoryInput, StoryType } from "./EditorialTypes";

const categoryTerms: Array<[EditorialCategory, RegExp]> = [
  ["Ireland", /\b(ireland|irish rugby|six nations|andy farrell)\b/i],
  ["Leinster", /\bleinster\b/i],
  ["Munster", /\bmunster\b/i],
  ["Ulster", /\bulster\b/i],
  ["Connacht", /\bconnacht\b/i],
  ["URC", /\b(urc|united rugby championship)\b/i],
  ["Europe", /\b(champions cup|challenge cup|epcr|european rugby)\b/i],
];

export function classifyCategory(story: RawStoryInput): EditorialCategory {
  if (story.suggestedCategory) return story.suggestedCategory;
  const text = `${story.title} ${story.summary ?? ""} ${story.bodyText ?? ""}`;
  return categoryTerms.find(([, pattern]) => pattern.test(text))?.[0] ?? "Opinion";
}

export function classifyStoryType(story: RawStoryInput): StoryType {
  const text = `${story.title} ${story.summary ?? ""}`.toLowerCase();
  if (/confirmed|official|announced|breaking/.test(text)) return "breaking-news";
  if (/rumour|rumor|linked with|reported interest/.test(text)) return "transfer-watch";
  if (/could|might|may|what if|why .* could/.test(text)) return "speculation";
  if (/opinion|column|i think/.test(text)) return "opinion";
  if (/analysis|explained|what it means|why /.test(text)) return "analysis";
  if (/match report|full-time|defeat|beat|draw/.test(text)) return "match-report";
  if (/profile|inside|story of|interview/.test(text)) return "feature";
  return "news";
}
