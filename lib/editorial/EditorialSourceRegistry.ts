import registry from "@/data/editorial-sources/source-registry.json";

export type EditorialSourceTier = "primary" | "trusted" | "supplementary";
export type EditorialEvidenceRole =
  | "primary-evidence"
  | "corroboration"
  | "analysis-context"
  | "discovery-only";

export type EditorialSource = {
  name: string;
  domain: string;
  homepageUrl: string;
  tier: EditorialSourceTier;
  ownerPriority: number;
  defaultEvidenceRole: EditorialEvidenceRole;
  allowDiscovery: boolean;
  allowEvidence: boolean;
  rumourPolicy: "reject" | "discovery-only" | "labelled";
  specialisms?: string[];
  teams?: string[];
  competitions?: string[];
  regions?: string[];
};

const sources = registry.sources as EditorialSource[];

function normalized(value: string) {
  return value.toLowerCase().trim();
}

function overlapScore(values: string[] | undefined, hints: string[]) {
  if (!values?.length || !hints.length) return 0;
  const normalizedHints = hints.map(normalized);
  return values.reduce((score, value) => {
    const target = normalized(value);
    return score + (normalizedHints.some((hint) => hint.includes(target) || target.includes(hint)) ? 1 : 0);
  }, 0);
}

export function getEditorialSourceRegistry() {
  return [...sources];
}

export function findEditorialSourceByDomain(domain: string) {
  const needle = normalized(domain).replace(/^www\./, "");
  return sources.find((source) => normalized(source.domain).replace(/^www\./, "") === needle);
}

export function rankEditorialSources(options?: {
  teams?: string[];
  competitions?: string[];
  regions?: string[];
  specialisms?: string[];
  evidenceOnly?: boolean;
}) {
  const teams = options?.teams ?? [];
  const competitions = options?.competitions ?? [];
  const regions = options?.regions ?? [];
  const specialisms = options?.specialisms ?? [];

  return sources
    .filter((source) => (options?.evidenceOnly ? source.allowEvidence : source.allowDiscovery))
    .map((source) => {
      const tierBoost = source.tier === "primary" ? 40 : source.tier === "trusted" ? 20 : 0;
      const relevanceBoost =
        overlapScore(source.teams, teams) * 18 +
        overlapScore(source.competitions, competitions) * 14 +
        overlapScore(source.regions, regions) * 12 +
        overlapScore(source.specialisms, specialisms) * 8;

      return { source, score: source.ownerPriority + tierBoost + relevanceBoost };
    })
    .sort((a, b) => b.score - a.score || a.source.name.localeCompare(b.source.name));
}

export function shouldTreatAsPrimaryEvidence(domain: string) {
  const source = findEditorialSourceByDomain(domain);
  return Boolean(source && source.tier === "primary" && source.allowEvidence);
}
