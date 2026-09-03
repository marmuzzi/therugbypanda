# 3 September 2026 — Visual eviction recovery when retained draft is absent from current batch

## Production evidence

Recovery run `33700050328` passed source discovery, corroboration, evidence sufficiency, package diversity, recent-position export and exact-five generation. It then completed targeted image discovery/import/reconciliation and failed at `Evict one image-unfulfillable current draft after acquisition exhaustion`.

Sanity readback after the run showed the evicted draft `current-2026-09-03-70be8d8dcc65` (`Itoje’s reset: England’s leader backs his extended break`) had correctly been set `morningPackageEligible: false`, leaving four eligible current-package drafts. This proves the Sanity eviction itself committed before the step failed.

The failure mode is that a retained same-day draft can have originated from an earlier recovery batch and therefore may already be absent from the current acquisition batch. `excludeEvictedCandidateFromRecoveryBatch()` previously required exactly one candidate removal and threw when zero were removed, aborting the workflow after a valid Sanity eviction and preventing bounded refill/image verification/Zoho delivery.

## Repair

Treat zero removals as a safe already-excluded state while still failing closed if duplicate candidate IDs make the batch ambiguous. Record whether the candidate was present in the current batch. Do not alter freshness, evidence, diversity, Publication Review, image-relevance or exact-one Zoho gates.

## Verification required

A bounded production recovery must prove:

1. the visual eviction step no longer aborts when the evicted retained draft is already absent from the current batch;
2. only the missing slot is refilled;
3. the replacement survives normal editorial and strict image gates;
4. the final package contains exactly five fresh review-ready image-verified drafts;
5. exactly one consolidated Zoho package is accepted, or an existing exact-package lock returns `already-sent` without duplicate delivery.

Until those conditions pass, the repair is merged/deployed only, not production verified.
