# 10 September 2026 — Irish Source Expansion Recovery

## Issue

**ID:** SOURCE-003  
**Status:** Implemented / PR open  
**Priority:** Critical  
**Root cause:** The normal 10 September discovery run found sufficient raw Irish-connected material, but production-history freshness reduced the eligible Irish reserve to 1/3 required stories before model spend. The discovery universe and targeted Irish query set were too narrow for a five-story daily package under the existing strict freshness contract.  
**Related PRs:** #461  
**Deployment status:** Pending merge/deployment  
**Verification status:** Zero-model launch-reserve proof configured to trigger automatically when #461 reaches `main`.  
**Resolution date:** Pending production verification

## Change

PR #461 expands the free discovery layer without weakening any editorial or cost gate.

- Adds an auxiliary rugby-source registry containing Zebre Parma (official), Rugby365, Balls.ie Rugby and Belfast Telegraph Sport.
- Expands the Irish targeted query set from 19 to 33 queries.
- Adds specific Leinster-Zebre, Laya Arena/RDS and pre-season searches, plus broader provincial, Irish-player, coach, transfer, URC and Champions Cup searches.
- Existing evidence, freshness, diversity, Ireland-first, media and budget gates remain unchanged.
- The application-wide OpenAI ceiling remains `$0.40` per Europe/Dublin day and the normal target remains at or below `$0.30`.
- No paid retry loop is introduced.

## Verification contract

The `.github/launch-reserve-trigger` change causes the existing `Launch reserve proof` workflow to run after merge to `main`. That workflow executes discovery, corroboration, evidence qualification, Ireland-first diversity, recent-position export and final one-to-one slot planning **without any model generation calls**.

Success requires the slot-planning stage to produce at least five valid missing-slot candidates with at least three fresh Irish-connected positions after production-history freshness. A later normal production run remains responsible for Terra generation, Luna review, mandatory official media readback and progressive review delivery.
