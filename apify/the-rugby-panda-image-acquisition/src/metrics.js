export function createMetrics({ input, queries }) {
  return {
    runStartedAt: new Date().toISOString(),
    runFinishedAt: null,
    searchPack: input.searchPack,
    sources: input.sources,
    queries,
    queriesExecuted: 0,
    imagesFound: 0,
    rejectedBySafety: 0,
    rejectedAsDuplicates: 0,
    candidateImages: 0,
    averageEditorialRating: 0,
    notes: [],
  };
}

export function finishMetrics(metrics, { found, accepted, rejected, duplicateCount }) {
  const ratingSum = accepted.reduce((total, candidate) => total + (Number(candidate.editorialRating) || 0), 0);

  metrics.runFinishedAt = new Date().toISOString();
  metrics.imagesFound = found.length;
  metrics.rejectedBySafety = rejected.length;
  metrics.rejectedAsDuplicates = duplicateCount;
  metrics.candidateImages = accepted.length;
  metrics.averageEditorialRating = accepted.length ? Number((ratingSum / accepted.length).toFixed(2)) : 0;

  if (!accepted.length) {
    metrics.notes.push("No candidates produced. Review search pack, source availability or filtering rules before another run.");
  }

  return metrics;
}
