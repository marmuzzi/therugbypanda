import { Actor } from "apify";
import { resolveQueries } from "./search-packs.js";
import { searchOpenverse } from "./openverse.js";
import { searchWikimedia } from "./wikimedia.js";
import { deduplicateCandidates } from "./deduplicator.js";
import { classifyCandidate } from "./classifier.js";
import { filterUnsafeCandidates } from "./safety-filter.js";
import { filterByRugbyRelevance } from "./relevance.js";
import { filterByCategoryIntent } from "./category-validator.js";
import { createMetrics, finishMetrics } from "./metrics.js";

await Actor.init();

const input = await Actor.getInput() ?? {};
const resolvedInput = {
  searchPack: input.searchPack ?? "evergreen",
  queries: input.queries ?? [],
  sources: input.sources ?? ["openverse", "wikimedia"],
  resultsPerQueryPerSource: input.resultsPerQueryPerSource ?? 5,
  allowedLicenses: input.allowedLicenses ?? ["cc0", "pdm", "by", "by-sa"],
  minimumRugbyRelevanceScore: input.minimumRugbyRelevanceScore ?? 70,
  dryRun: input.dryRun ?? true,
};

const queries = resolveQueries(resolvedInput);
const metrics = createMetrics({ input: resolvedInput, queries });
const found = [];
const sourceErrors = [];

if (!queries.length) {
  throw new Error("No queries resolved. Choose a search pack or provide custom queries.");
}

for (const query of queries) {
  for (const source of resolvedInput.sources) {
    metrics.queriesExecuted += 1;

    try {
      if (source === "openverse") {
        found.push(...await searchOpenverse({
          query,
          resultsPerQuery: resolvedInput.resultsPerQueryPerSource,
          allowedLicenses: resolvedInput.allowedLicenses,
        }));
      }

      if (source === "wikimedia") {
        found.push(...await searchWikimedia({
          query,
          resultsPerQuery: resolvedInput.resultsPerQueryPerSource,
        }));
      }
    } catch (error) {
      sourceErrors.push({ source, query, message: error.message });
    }
  }
}

const { accepted: safetyAccepted, rejected: safetyRejected } = filterUnsafeCandidates(found, resolvedInput.allowedLicenses);
const deduped = deduplicateCandidates(safetyAccepted);
const duplicateCount = safetyAccepted.length - deduped.length;
const { accepted: categoryAccepted, rejected: categoryRejected } = filterByCategoryIntent(deduped);
const { accepted: relevanceAccepted, rejected: relevanceRejected } = filterByRugbyRelevance(
  categoryAccepted,
  resolvedInput.minimumRugbyRelevanceScore,
);
const rejected = [...safetyRejected, ...categoryRejected, ...relevanceRejected];
const accepted = relevanceAccepted.map(classifyCandidate);
const finalMetrics = finishMetrics(metrics, { found, accepted, rejected, duplicateCount });
finalMetrics.rejectedByCategoryIntent = categoryRejected.length;
finalMetrics.rejectedByRugbyRelevance = relevanceRejected.length;
finalMetrics.minimumRugbyRelevanceScore = resolvedInput.minimumRugbyRelevanceScore;

await Actor.pushData({
  recordType: "run-summary",
  ...finalMetrics,
  sourceErrors,
});

for (const candidate of accepted) {
  await Actor.pushData({
    recordType: "candidate",
    ...candidate,
  });
}

for (const rejectedCandidate of rejected) {
  await Actor.pushData({
    recordType: "rejected",
    ...rejectedCandidate,
  });
}

await Actor.exit();
