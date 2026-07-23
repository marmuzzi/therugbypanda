import { buildEmptyFactLedger, ledgerConfidence, validateFactLedger } from "./FactLedger";
import { classifyCategory, classifyStoryType } from "./StoryClassifier";
import { scoreStory } from "./StoryScorer";
import type {
  EditorialBrainResult,
  EditorialDecision,
  EditorialPriority,
  FactLedger,
  RawStoryInput,
} from "./EditorialTypes";

export interface EditorialBrainOptions {
  factLedger?: FactLedger;
  now?: Date;
}

function priorityFromScore(score: number): EditorialPriority {
  if (score >= 85) return "urgent";
  if (score >= 70) return "high";
  if (score >= 50) return "medium";
  return "low";
}

function decisionFromScore(score: number, confidence: number): EditorialDecision {
  if (score < 40) return "reject";
  if (confidence < 35) return "hold";
  return "draft";
}

function trimForMeta(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

export class EditorialBrain {
  evaluate(story: RawStoryInput, options: EditorialBrainOptions = {}): EditorialBrainResult {
    if (!story.id || !story.title || story.sourceRecords.length === 0) {
      throw new Error("EditorialBrain requires an id, title and at least one source record.");
    }

    const category = classifyCategory(story);
    const storyType = classifyStoryType(story);
    const score = scoreStory(story, category, options.now);
    const factLedger = validateFactLedger(options.factLedger ?? buildEmptyFactLedger(), story.sourceRecords);
    const confidence = ledgerConfidence(factLedger);
    const priority = priorityFromScore(score.total);
    const decision = decisionFromScore(score.total, confidence);
    const speculative = storyType === "speculation" || storyType === "transfer-watch" || storyType === "rumour-roundup";
    const suggestedHeadline = speculative && !/\?$/.test(story.title)
      ? `${story.title.replace(/[.!]+$/, "")}?`
      : story.title;
    const summary = story.summary ?? `The Rugby Panda examines ${story.title.toLowerCase()} and what it could mean for readers.`;

    return {
      inputId: story.id,
      decision,
      storyType,
      category,
      priority,
      score,
      confidence,
      needsHumanFactCheck: confidence < 75 || factLedger.conflicts.length > 0 || speculative,
      suggestedHeadline,
      suggestedSeoTitle: trimForMeta(suggestedHeadline, 60),
      suggestedMetaDescription: trimForMeta(summary, 155),
      tags: [category, storyType].filter((value, index, values) => values.indexOf(value) === index),
      featuredImageSearchBrief: `Editorial rugby image for ${category}: ${story.title}. Avoid misleading player, venue or match identification.`,
      brief: {
        angle: speculative
          ? `Explore why ${story.title.toLowerCase()} is plausible, what supports it, what remains unknown, and why it matters.`
          : `Explain the verified development in ${story.title.toLowerCase()} and why it matters to Irish and European rugby readers.`,
        audiencePromise: "Give readers original context, clear sourcing boundaries and a useful reason to care.",
        keyQuestions: ["What is confirmed?", "What is strongly reported or speculative?", "Why does this matter now?"],
        requiredContext: [category, "Relevant recent developments", "Impact on supporters, team or competition"],
        prohibitedApproaches: [
          "Rewriting or closely paraphrasing a source article",
          "Presenting speculation as confirmed fact",
          "Inventing quotations, statistics, motives or certainty",
          "Publishing without human editorial approval",
        ],
      },
      factLedger,
      sourceRecords: story.sourceRecords,
      generatedAt: (options.now ?? new Date()).toISOString(),
      schemaVersion: "1.0",
    };
  }
}
