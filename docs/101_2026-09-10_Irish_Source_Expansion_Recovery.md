# 10 September 2026 — Irish Source Expansion Recovery

## Issue

**ID:** SOURCE-003  
**Status:** In Progress  
**Priority:** Critical  
**Root cause:** The 10 September production-history freshness gate reduced the available Irish package below 3/5. Recovery exposed three deterministic defects in sequence: insufficient source breadth, incoherent/over-broad story qualification, and finally an execution-order bug where package diversity ran before production-history freshness even though the canonical workflow requires freshness first.  
**Related PRs:** #461, #462, #463, #464, #465  
**Deployment status:** #461-#464 merged; #465 pending merge.  
**Verification status:** Proofs through #464 remained below the 3/5 fresh-Irish contract. #465 moves 14-day production-history freshness ahead of Ireland-first/package diversity in both normal production and the zero-model proof.  
**Resolution date:** Pending production verification

## Round 1 — PR #461

Expanded the free discovery universe with Zebre Parma official, Rugby365, Balls.ie Rugby and Belfast Telegraph Sport and increased targeted Irish queries from 19 to 33. Zero-model proof `34460186029` found 296 leads, 38 corroborated candidates and 13 concrete-evidence candidates, but only 2/3 Irish-connected positions survived production-history freshness. No model spend occurred.

## Round 2 — PR #462

Added The Irish Sun Rugby as a supplementary discovery source, current Ireland Women/Connacht/Ulster search routes, explicit non-rugby rejection, and production-equivalent pre-AI match-detail filtering in the reserve proof. Proof `34460764679` rejected non-rugby targeted results but still ended at 2/3 fresh Irish positions.

## Round 3 — PR #463

Extracted deterministic Irish discovery qualification. Explicit non-rugby identity is evaluated from the title while rugby relevance may come from title or summary. Five regression cases passed in production-data proof `34461128847`, but the package still ended at 2/3.

## Round 4 — PR #464

Added person-team coherent v10 acquisition clustering and regression coverage. Production-data proof `34461715724` passed both deterministic regression suites and produced 23 corroborated candidates, 12 after evidence/match-detail gates and five Irish candidates before package selection. It nevertheless ended at only 1/3 after final production-history freshness.

The proof exposed the remaining architectural defect: diversity was consuming Leinster/Munster team capacity using candidates that were only later rejected as repeats by the 14-day history filter. That violates the canonical publishing order, which specifies recent-position freshness before Ireland-first/team diversity.

## Round 5 — PR #465

PR #465 corrects execution order without weakening any threshold:

1. discovery and cross-source corroboration;
2. deterministic evidence gate;
3. pre-AI match-detail parity;
4. export recent Sanity production positions;
5. **reject repeated production-history positions**;
6. Ireland-first and same-package diversity;
7. one-to-one paid slot planning;
8. Terra generation only after those free gates pass.

A new `scripts/filter-current-production-history-freshness.mjs` applies the existing `StoryFreshness` policy before diversity and emits machine-readable evidence. The same ordering is used by the zero-model launch-reserve proof and the normal scheduled production workflow. The later slot planner still rechecks freshness defensively.

## Verification contract

The merge trigger runs `Launch reserve proof` on production data with no Terra or Luna calls. Success requires five one-to-one assignable missing slots with at least three fresh, genuine Irish-connected rugby positions after evidence, match-detail parity, 14-day production-history freshness and package diversity.

The OpenAI application ceiling remains `$0.40` per Europe/Dublin day, the normal target remains at or below `$0.30`, and no paid retry loop is permitted. Paid generation remains blocked until the zero-model proof passes.
