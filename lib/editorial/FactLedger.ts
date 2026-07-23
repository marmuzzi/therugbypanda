import type { FactLedger, FactRecord, SourceRecord } from "./EditorialTypes";

function clampConfidence(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function createFactRecord(input: Omit<FactRecord, "confidence"> & { confidence: number }): FactRecord {
  return {
    ...input,
    confidence: clampConfidence(input.confidence),
    usableInDraft: input.status !== "disputed" && input.usableInDraft,
  };
}

export function buildEmptyFactLedger(): FactLedger {
  return { facts: [], unsupportedClaims: [], conflicts: [] };
}

export function validateFactLedger(ledger: FactLedger, sources: SourceRecord[]): FactLedger {
  const validSourceIds = new Set(sources.map((source) => source.id));
  const unsupportedClaims = [...ledger.unsupportedClaims];

  const facts = ledger.facts.map((fact) => {
    const sourceIds = fact.sourceIds.filter((sourceId) => validSourceIds.has(sourceId));
    const usableInDraft = fact.usableInDraft && sourceIds.length > 0 && fact.status !== "disputed";

    if (sourceIds.length === 0) unsupportedClaims.push(fact.claim);

    return createFactRecord({ ...fact, sourceIds, usableInDraft, confidence: fact.confidence });
  });

  return {
    facts,
    unsupportedClaims: [...new Set(unsupportedClaims)],
    conflicts: [...new Set(ledger.conflicts)],
  };
}

export function ledgerConfidence(ledger: FactLedger): number {
  const usableFacts = ledger.facts.filter((fact) => fact.usableInDraft);
  if (usableFacts.length === 0) return 0;
  return Math.round(usableFacts.reduce((sum, fact) => sum + fact.confidence, 0) / usableFacts.length);
}
