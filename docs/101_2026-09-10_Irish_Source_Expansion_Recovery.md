# 10 September 2026 — Irish Source Expansion Recovery

## Issue

**ID:** SOURCE-003  
**Status:** In Progress  
**Priority:** Critical  
**Root cause:** The 10 September production-history freshness gate reduced the available Irish package below 3/5. Round-one source breadth was insufficient; artifact inspection then exposed non-rugby contamination, and round-two filtering proved over-broad because it rejected legitimate rugby features whose summaries mentioned other sports contextually.  
**Related PRs:** #461, #462, #463  
**Deployment status:** #461 and #462 merged; #462 production deployment pending final readiness check; #463 pending merge.  
**Verification status:** Proof `34460186029` after #461 improved 1/3 to 2/3. Proof `34460764679` after #462 still returned 2/3; it correctly removed contamination and added production pre-AI parity, but exposed false rejection of legitimate WXV/Ulster rugby coverage due contextual boxing/soccer mentions. #463 narrows qualification to story identity/title and adds regression coverage.  
**Resolution date:** Pending production verification

## Round 1 — PR #461

Expanded the free discovery universe with Zebre Parma official, Rugby365, Balls.ie Rugby and Belfast Telegraph Sport and increased targeted Irish queries from 19 to 33. Zero-model proof `34460186029` found 296 leads, 38 corroborated candidates and 13 concrete-evidence candidates, but only 2/3 Irish-connected positions survived production-history freshness. No model spend occurred.

## Round 2 — PR #462

Added The Irish Sun Rugby as a supplementary discovery source, current Ireland Women/Connacht/Ulster search routes, explicit non-rugby rejection, and production-equivalent pre-AI match-detail filtering in the reserve proof. Proof `34460764679` rejected 217 non-rugby targeted results, produced 15 concrete-evidence candidates and 12 after match-detail parity, but still ended at 2/3 fresh Irish positions. Inspection showed the sport exclusion was incorrectly treating contextual mentions in summaries as story identity.

## Round 3 — PR #463

PR #463 extracts Irish discovery qualification into `lib/editorial/IrishDiscoveryQualification.mjs` and changes the boundary so:

- explicit non-rugby identity in the title is rejected;
- rugby relevance may be established by title or summary;
- contextual mentions of boxing, soccer or other sports in a legitimate rugby summary do not invalidate the story;
- a deterministic regression verifies Shelbourne soccer is rejected, Ireland Women WXV is retained despite cross-sport context, Ulster/Fiona Tuite coverage is retained, Mack Hansen/Connacht is retained, and Irish Open golf is rejected;
- the zero-model reserve proof runs this regression before discovery.

## Verification contract

The merge trigger runs `Launch reserve proof` on production data with no Terra or Luna calls. Success requires five one-to-one assignable missing slots with at least three fresh, genuine Irish-connected rugby positions after concrete evidence, match-detail parity, diversity and 14-day production-history freshness.

The OpenAI application ceiling remains `$0.40` per Europe/Dublin day, normal target remains at or below `$0.30`, and no paid retry loop is permitted. Paid generation must remain blocked until the zero-model proof passes.
