import test from "node:test";
import assert from "node:assert/strict";
import { excludePreviouslyPaidCandidates, productionDraftAttemptedIds } from "./PaidAttemptEligibility.ts";

test("extracts only production draft reservations", () => {
  const ids = productionDraftAttemptedIds([
    { purpose: "production-draft:current-a" },
    { purpose: "publication-review:current-a" },
    { purpose: "production-draft:current-b" },
    { purpose: null },
  ]);
  assert.deepEqual([...ids], ["current-a", "current-b"]);
});

test("removes previously paid candidates before canonical qualification", () => {
  const attempted = new Set(["current-paid"]);
  const result = excludePreviouslyPaidCandidates(
    [{ id: "current-paid" }, { id: "current-fresh" }, { id: "current-reserve" }],
    attempted,
  );
  assert.deepEqual(result.eligible.map((candidate) => candidate.id), ["current-fresh", "current-reserve"]);
  assert.deepEqual(result.excluded.map((candidate) => candidate.id), ["current-paid"]);
});
