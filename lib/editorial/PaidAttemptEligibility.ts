export type EditorialBudgetEvent = {
  purpose?: string | null;
};

const PRODUCTION_DRAFT_PREFIX = "production-draft:";

export function productionDraftAttemptedIds(events: EditorialBudgetEvent[] | null | undefined) {
  return new Set(
    (Array.isArray(events) ? events : [])
      .map((event) => String(event?.purpose || ""))
      .filter((purpose) => purpose.startsWith(PRODUCTION_DRAFT_PREFIX))
      .map((purpose) => purpose.slice(PRODUCTION_DRAFT_PREFIX.length).trim())
      .filter(Boolean),
  );
}

export function excludePreviouslyPaidCandidates<T extends { id?: string | null }>(
  candidates: T[],
  attemptedIds: Set<string>,
) {
  const excluded: T[] = [];
  const eligible = candidates.filter((candidate) => {
    if (!candidate?.id || !attemptedIds.has(candidate.id)) return true;
    excluded.push(candidate);
    return false;
  });
  return { eligible, excluded };
}
