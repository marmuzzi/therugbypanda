import type { RawStoryInput } from "./EditorialTypes";

export interface EditorialPosition {
  id: string;
  subject: string;
  development: string;
  angle: string;
  occurredAt?: string;
}

export interface FreshnessDecision {
  fresh: boolean;
  reason: string;
  conflictingPositionId?: string;
}

const STOP = new Set(["the", "and", "for", "with", "from", "into", "that", "this", "their", "after", "before", "over", "under", "rugby"]);

function tokens(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2 && !STOP.has(token)),
  );
}

function overlap(left: string, right: string): number {
  const a = tokens(left);
  const b = tokens(right);
  if (!a.size || !b.size) return 0;
  let common = 0;
  for (const token of a) if (b.has(token)) common += 1;
  return common / Math.min(a.size, b.size);
}

/**
 * Rejects same-story rewrites before any model generation. A position is a
 * three-part editorial identity: subject + news development/event + angle.
 * Headlines, publishers and prose are intentionally not considered identity.
 */
export function assessPositionFreshness(
  candidate: EditorialPosition,
  recent: EditorialPosition[],
): FreshnessDecision {
  for (const previous of recent) {
    const subject = overlap(candidate.subject, previous.subject);
    const development = overlap(candidate.development, previous.development);
    const angle = overlap(candidate.angle, previous.angle);

    // Same subject and same development is a replay even when the headline,
    // publisher or wording changes. A materially different angle only counts
    // when the underlying development is also different enough.
    if (subject >= 0.6 && development >= 0.6) {
      return {
        fresh: false,
        conflictingPositionId: previous.id,
        reason: `Repeated subject/development (${subject.toFixed(2)}/${development.toFixed(2)} overlap).`,
      };
    }

    if (subject >= 0.75 && angle >= 0.75 && development >= 0.4) {
      return {
        fresh: false,
        conflictingPositionId: previous.id,
        reason: `Same editorial position (${subject.toFixed(2)}/${development.toFixed(2)}/${angle.toFixed(2)} overlap).`,
      };
    }
  }

  return { fresh: true, reason: "No recent subject + development + angle collision." };
}

export function selectFreshPositions(
  candidates: EditorialPosition[],
  recent: EditorialPosition[],
  required = 5,
): { selected: EditorialPosition[]; rejected: Array<{ position: EditorialPosition; decision: FreshnessDecision }> } {
  const selected: EditorialPosition[] = [];
  const rejected: Array<{ position: EditorialPosition; decision: FreshnessDecision }> = [];

  for (const candidate of candidates) {
    const decision = assessPositionFreshness(candidate, [...recent, ...selected]);
    if (!decision.fresh) {
      rejected.push({ position: candidate, decision });
      continue;
    }
    selected.push(candidate);
    if (selected.length === required) break;
  }

  return { selected, rejected };
}

export function positionFromStory(story: RawStoryInput, angle: string): EditorialPosition {
  return {
    id: story.id,
    subject: story.title,
    development: story.summary ?? story.title,
    angle,
    occurredAt: story.discoveredAt,
  };
}
