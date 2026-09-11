# 11 September 2026 — Morning canonical paid-eligibility recovery

## Production evidence

Current-source run `34562851698` ran on main SHA `e31ad38f829eef5c4cf9ebdd4da3e9f9ab44168e` after the approved `$0.75/day` budget reconciliation.

The deterministic supply path was healthy: 31/31 configured sources succeeded, Irish-targeted discovery brought the reserve to 278 leads, 13 candidates were corroborated, 10 passed concrete evidence and match-detail parity, and the canonical freshness pool reported seven eligible candidates for four missing slots plus three reserve. Package diversity reported three Irish-connected candidates available for the two additional Irish positions required beside the retained Ireland draft.

Slot planning then failed before model spend because only one of those three Irish-connected candidates was actually payable. Two had already consumed `production-draft:` reservations earlier in the same Europe/Dublin day. The canonical pool had not excluded previously paid candidate IDs, so it overstated real recovery capacity. The slot planner also still re-ran production-history freshness, contradicting the single canonical freshness-boundary contract.

No additional OpenAI reservation was made by run `34562851698` and generation was skipped.

## Root cause

Paid-attempt eligibility was applied too late. The canonical pool decided freshness and diversity without considering the authoritative Sanity daily budget ledger, while the later slot planner excluded paid IDs. That created a false-green pool and allowed downstream planning to disagree with canonical qualification.

## PR #491

PR #491 moves `production-draft:` reservation eligibility into canonical pool qualification before freshness/diversity counts, centralises reservation-ID parsing in `lib/editorial/PaidAttemptEligibility.ts`, adds regression tests, and removes the slot planner's second freshness interpretation. Slot planning now consumes the canonical-qualified pool and treats any previously paid candidate reaching it as an integrity failure.

The bounded free refill therefore runs against genuinely unpaid capacity. Previous reservations remain authoritative and are never reset or bypassed. The `$0.75/day` hard ceiling, `<= $0.40/day` normal target, one paid candidate per missing slot and zero paid replacement loop remain unchanged.

## Verification required

1. Merge and deploy PR #491.
2. Re-run current-source production on the merged SHA.
3. Verify previously paid IDs are excluded at canonical qualification and trigger the free refill when necessary.
4. Verify final canonical pool satisfies the four missing slots and Ireland-first requirement using unpaid candidates only.
5. Verify slot planning reports `rejectedByFreshness: 0` and does not reinterpret canonical freshness.
6. Continue paid generation only within the existing same-day ledger and verify Terra generation / Luna review routing.
7. Complete mandatory story-specific official media before any review delivery.
