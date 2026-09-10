# 10 September 2026 — Irish Source Expansion Recovery

## Issue

**ID:** SOURCE-003  
**Status:** In Progress  
**Priority:** Critical  
**Root cause:** The normal 10 September discovery run found sufficient raw Irish-connected material, but production-history freshness reduced the eligible Irish reserve to 1/3 required stories before model spend. The discovery universe and targeted Irish query set were too narrow, and targeted discovery could also admit non-rugby contamination into a rugby source cluster.  
**Related PRs:** #461, #462  
**Deployment status:** #461 merged and production READY on `eb228e7d564d9e488ddd03e7482d702da0195434`; #462 pending merge.  
**Verification status:** Zero-model proof `34460186029` after #461 improved final fresh Irish capacity from 1/3 to 2/3 but still failed. Artifact inspection exposed a Shelbourne soccer lead paired with an Ulster rugby source, so #462 adds deterministic rugby-only filtering and more focused current Irish routes before another zero-model proof.  
**Resolution date:** Pending production verification

## Round 1 — PR #461

PR #461 expanded the free discovery layer without weakening any editorial or cost gate.

- Added an auxiliary rugby-source registry containing Zebre Parma (official), Rugby365, Balls.ie Rugby and Belfast Telegraph Sport.
- Expanded the Irish targeted query set from 19 to 33 queries.
- Added specific Leinster-Zebre, Laya Arena/RDS and pre-season searches, plus broader provincial, Irish-player, coach, transfer, URC and Champions Cup searches.
- Existing evidence, freshness, diversity, Ireland-first, media and budget gates remained unchanged.

### Round-1 measured result

Zero-model launch-reserve proof `34460186029` ran on merged main SHA `eb228e7d564d9e488ddd03e7482d702da0195434`.

- standard discovery: 28/28 successful registry sources;
- Irish targeted discovery: 33 queries, 4 expansion sources, 118 added leads;
- total discovered leads: 296;
- corroborated candidates: 38;
- concrete-evidence candidates: 13;
- diversity gate: passed with 6 Irish-connected candidates and 10 replacement candidates;
- production-history freshness: only 2/3 candidates classified Irish remained, so the final slot plan failed before model spend.

No Terra or Luna call was made by the proof.

## Round 2 — PR #462

Artifact inspection showed that one of the two apparently fresh Irish candidates was actually a Shelbourne soccer story clustered beside an Ulster rugby source. PR #462 therefore does not weaken freshness. It improves deterministic qualification and targeted supply:

- adds The Irish Sun Rugby as a supplementary discovery source for current Irish player/provincial reporting;
- adds exact Fiona Tuite-O'Sullivan / Ireland Women WXV searches to join current RTÉ and The42 evidence around the same rugby development;
- adds broader Mack Hansen / Connacht / Stuart Lancaster searches and more specific Ulster searches;
- rejects soccer, GAA, boxing, golf and other explicit non-rugby results inside the Irish targeted augmentation before acquisition clustering;
- records non-rugby rejection counts for evidence inspection;
- makes `Launch reserve proof` run `filter-preai-match-detail-parity.mjs`, matching the normal production pre-AI sequence more faithfully.

## Verification contract

The `.github/launch-reserve-trigger` change causes `Launch reserve proof` to run after #462 reaches `main`. The workflow is zero-model: discovery, corroboration, concrete-evidence qualification, production-equivalent pre-AI match-detail filtering, Ireland-first diversity, recent-position export and one-to-one slot planning.

Success requires the slot-planning stage to produce five valid missing-slot candidates with at least three fresh, genuinely rugby, Irish-connected positions after production-history freshness. A later normal production run remains responsible for Terra generation, Luna review, mandatory official media readback and progressive review delivery.

The application-wide OpenAI ceiling remains `$0.40` per Europe/Dublin day, the normal target remains at or below `$0.30`, and no paid retry loop is permitted.
