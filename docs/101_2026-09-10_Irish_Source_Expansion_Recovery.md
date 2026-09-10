# 10 September 2026 — Irish Source Expansion Recovery

## Issue

**ID:** SOURCE-003  
**Status:** In Progress  
**Priority:** Critical  
**Root cause:** The 10 September production-history freshness gate reduced the available Irish package below 3/5. Round-one source breadth was insufficient; later proofs exposed non-rugby contamination and then a clustering weakness that failed to join differently worded reports about the same Irish rugby person/team development.  
**Related PRs:** #461, #462, #463, #464  
**Deployment status:** #461-#463 merged; #464 pending merge.  
**Verification status:** Proofs `34460186029`, `34460764679` and `34461128847` all stopped before model spend at 2/3 fresh Irish after successive deterministic repairs. #464 targets the remaining acquisition-clustering defect using current Mack Hansen/Connacht evidence.  
**Resolution date:** Pending production verification

## Round 1 — PR #461

Expanded the free discovery universe with Zebre Parma official, Rugby365, Balls.ie Rugby and Belfast Telegraph Sport and increased targeted Irish queries from 19 to 33. Zero-model proof `34460186029` found 296 leads, 38 corroborated candidates and 13 concrete-evidence candidates, but only 2/3 Irish-connected positions survived production-history freshness. No model spend occurred.

## Round 2 — PR #462

Added The Irish Sun Rugby as a supplementary discovery source, current Ireland Women/Connacht/Ulster search routes, explicit non-rugby rejection, and production-equivalent pre-AI match-detail filtering in the reserve proof. Proof `34460764679` rejected 217 non-rugby targeted results, produced 15 concrete-evidence candidates and 12 after match-detail parity, but still ended at 2/3 fresh Irish positions.

## Round 3 — PR #463

Extracted deterministic Irish discovery qualification and changed the sport boundary so explicit non-rugby identity is evaluated from the title while rugby relevance may come from title or summary. Five regression cases passed in production-data proof `34461128847`: Shelbourne soccer and Irish Open golf are rejected; Ireland Women WXV, Ulster/Fiona Tuite and Mack Hansen/Connacht rugby examples survive. The proof still ended at 2/3 because the acquisition clusterer did not join differently worded Mack Hansen/Connacht reports.

## Round 4 — PR #464

Production discovery on 10 September contains independent current Mack Hansen/Connacht reporting from The42, RTÉ and The Irish Sun. The old clustering rule required too much title-token overlap and therefore failed to form that legitimate Irish rugby candidate. It also allowed a shared secondary commentator, Ian Madigan, to merge unrelated Tom Wood/Munster and Leinster-coaching reports.

PR #464:

- extracts current-story clustering into `lib/editorial/CurrentStoryClustering.mjs`;
- keeps high lexical-overlap matching for obvious same-story reports;
- for differently worded reports requires a shared distinctive proper-name token plus a shared team anchor;
- therefore recognises `Hansen + Connacht` while refusing `Madigan` alone as sufficient to merge Munster and Leinster stories;
- blocks explicit non-rugby title identity such as Shelbourne before context corroboration can form a candidate;
- adds regression cases for Mack Hansen/Connacht, Tom Wood versus Contepomi/Madigan, Ulster versus Shelbourne, and Fintan Gunne/Leinster;
- runs the clustering regression inside the zero-model launch reserve proof.

## Verification contract

The merge trigger runs `Launch reserve proof` on production data with no Terra or Luna calls. Success requires five one-to-one assignable missing slots with at least three fresh, genuine Irish-connected rugby positions after concrete evidence, match-detail parity, diversity and 14-day production-history freshness.

The OpenAI application ceiling remains `$0.40` per Europe/Dublin day, normal target remains at or below `$0.30`, and no paid retry loop is permitted. Paid generation remains blocked until the zero-model proof passes.
