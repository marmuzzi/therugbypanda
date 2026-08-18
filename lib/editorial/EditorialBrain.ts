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
    const previewLike = /preview|pre-season|preseason|fixture|opening|opener|build-up|season/i.test(`${story.title} ${story.summary ?? ""}`);
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
          ? `Write the rugby story behind ${story.title.toLowerCase()}: explain the evidence, the realistic possibilities and what each outcome would mean, using natural uncertainty without editorial-process commentary.`
          : previewLike
            ? `Turn ${story.title.toLowerCase()} into a specific supporter-focused preview: who or what is worth watching, which named players or new signings matter when supported, what the fixture can reveal, and why there is genuine anticipation.`
            : `Explain the development in ${story.title.toLowerCase()} through concrete rugby detail: the named people, teams, consequences and next questions that matter to supporters.`,
        audiencePromise: "Give supporters specific rugby detail, useful context, named people where supported, and a clear reason to care or look forward to what happens next.",
        keyQuestions: previewLike
          ? ["What exactly is happening?", "Who or what should supporters watch?", "Which named players, signings or selection battles are relevant and supported?", "What could this reveal before the competitive season?"]
          : speculative
            ? ["What is the evidence?", "What are the realistic rugby implications?", "Who would be affected?", "What should supporters watch next?"]
            : ["What happened?", "Who is directly involved?", "Why does it matter in rugby terms?", "What should supporters watch next?"],
        requiredContext: [
          category,
          "Relevant recent rugby developments",
          "Named players, coaches, signings, opponents or venues when supported by the evidence",
          "Impact on supporters, team or competition",
        ],
        prohibitedApproaches: [
          "Rewriting or closely paraphrasing a source article",
          "Presenting speculation as confirmed fact",
          "Inventing quotations, statistics, player involvement, signings, motives or certainty",
          "Explaining internal sourcing, verification, confidence, AI, automation or editorial-review processes to readers",
          "Using generic filler instead of available concrete rugby detail",
        ],
      },
      factLedger,
      sourceRecords: story.sourceRecords,
      generatedAt: (options.now ?? new Date()).toISOString(),
      schemaVersion: "1.0",
    };
  }
}
