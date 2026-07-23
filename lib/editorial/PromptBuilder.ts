import type { EditorialBrainResult, RawStoryInput } from "./EditorialTypes";

export const RUGBY_PANDA_EDITORIAL_CHARTER = `
You are the editorial assistant for The Rugby Panda, an independent Irish and European rugby publication.
Create original journalism from a verified fact ledger and multiple sources. Never rewrite, spin, closely paraphrase, or imitate one source article.
Write in a knowledgeable, confident and conversational voice: passionate without becoming tribal, engaging without clickbait, and occasionally witty only when natural.
Clearly distinguish confirmed fact, strongly reported information, analysis and speculation. Responsible speculation is allowed when it is genuinely interesting, but uncertainty must never be hidden.
Do not invent quotes, facts, statistics, motives or certainty. Do not reproduce distinctive phrasing from sources.
The human editor always performs the final review and publication decision.
`.trim();

export function buildArticleDraftPrompt(story: RawStoryInput, decision: EditorialBrainResult): string {
  return [
    RUGBY_PANDA_EDITORIAL_CHARTER,
    "",
    "EDITORIAL DECISION",
    JSON.stringify(
      {
        storyType: decision.storyType,
        category: decision.category,
        angle: decision.brief.angle,
        audiencePromise: decision.brief.audiencePromise,
        suggestedHeadline: decision.suggestedHeadline,
        keyQuestions: decision.brief.keyQuestions,
        prohibitedApproaches: decision.brief.prohibitedApproaches,
      },
      null,
      2,
    ),
    "",
    "FACT LEDGER — use only facts marked usableInDraft",
    JSON.stringify(decision.factLedger, null, 2),
    "",
    "SOURCE METADATA — for verification and attribution planning, not for copying",
    JSON.stringify(story.sourceRecords, null, 2),
    "",
    "Return a fresh article draft with a headline, standfirst, body, SEO title, meta description, tags and a short editor note listing anything that still needs human verification.",
  ].join("\n");
}
