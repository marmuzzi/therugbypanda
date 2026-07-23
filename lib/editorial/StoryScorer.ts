import type { EditorialCategory, RawStoryInput, StoryScore } from "./EditorialTypes";

const categoryRelevance: Record<EditorialCategory, number> = {
  Ireland: 100,
  Leinster: 95,
  Munster: 92,
  Ulster: 90,
  Connacht: 90,
  URC: 82,
  Europe: 80,
  Opinion: 65,
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreStory(story: RawStoryInput, category: EditorialCategory, now = new Date()): StoryScore {
  const discovered = new Date(story.discoveredAt);
  const ageHours = Number.isNaN(discovered.getTime())
    ? 24
    : Math.max(0, (now.getTime() - discovered.getTime()) / 3_600_000);
  const freshness = clamp(100 - ageHours * 4);
  const sourceCount = new Set(story.sourceRecords.map((source) => source.publisher.toLowerCase())).size;
  const primaryCount = story.sourceRecords.filter((source) => source.isPrimarySource).length;
  const sourceStrength = clamp(25 + sourceCount * 15 + primaryCount * 20);
  const text = `${story.title} ${story.summary ?? ""}`;
  const readerInterest = clamp(55 + (/squad|injury|sign|coach|selection|transfer|final|derby/i.test(text) ? 25 : 0));
  const distinctiveness = clamp(70 - (story.relatedPublishedSlugs?.length ?? 0) * 20);
  const relevance = categoryRelevance[category];
  const total = clamp(
    relevance * 0.28 + freshness * 0.2 + readerInterest * 0.2 + distinctiveness * 0.17 + sourceStrength * 0.15,
  );

  return {
    total,
    relevance,
    freshness,
    readerInterest,
    distinctiveness,
    sourceStrength,
    rationale: [
      `${category} relevance scored ${relevance}/100.`,
      `${sourceCount} independent publisher${sourceCount === 1 ? "" : "s"} detected.`,
      story.relatedPublishedSlugs?.length
        ? "Related published coverage reduces distinctiveness."
        : "No related published article was supplied.",
    ],
  };
}
