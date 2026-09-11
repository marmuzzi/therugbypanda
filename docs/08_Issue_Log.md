# Issue Log

This is the living launch-boundary issue log. Historical rows remain preserved in Git history and dated evidence documents.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Active launch issues — 11 September 2026

| ID | Status | Priority | Area | Summary | Root cause | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LAUNCH-001 | In Progress | Critical | Go Live | Five distinct fresh review-ready drafts, >=3 direct Irish connections, mandatory official embeds, progressive delivery and human Sanity publication. | Sequential evidence, retained-state, repetition, media, distinctness, supply and budget defects. | #451-#478 plus current Leinster-readiness PR | #478 production READY; current budget change pending | Canonical refill defects are implemented; full 5/5 production package still requires proof. | — |
| EDITORIAL-012 | Pending Verification | Critical | Canonical Pool / Recovery | Canonical editorial pool must target missing slots + 3 reserve and perform bounded free refill before paid generation. | PR #476 initially required five fresh candidates regardless of valid retained drafts and threw before any second discovery pass; the first acquisition/evidence pass could also fail before reaching refill. | #476, #477, #478 | #478 production READY | Production proof of corrected refill path pending. | — |
| EDITORIAL-013 | In Progress | Critical | Match Build-up | Prioritise fresh Leinster/Zebre build-up without repetitive angles. | Match-day coverage needs multiple distinct developments while preventing same-phase rewrites from consuming package slots. | #464-#471, #477, #478 | Existing freshness logic production READY | 12 Sep 2026 Leinster v Zebre readiness run must prove distinct build-up positions survive freshness/diversity gates. | — |
| AUTO-004-P25 | Pending Verification | Critical | Diversity / Recovery | Replace invalid retained state rather than aborting or carrying stale/duplicate positions. | Retained drafts were previously treated as entitlements and source-cluster duplicates could survive under different IDs. | #451, #452, #456, #466 | Merged and deployed | Reciprocal source-cluster duplicate removal verified; full paid package proof still required. | — |
| MEDIA-010 | Pending Verification | Critical | Embedded Media | Require a verified story-specific official social/video embed before delivery. | Automatic acquisition was previously absent and local imagery was incorrectly treated as mandatory. | #453, #457, #458, #459 | Merged and deployed | Exact official embed path verified for prior Leinster/Munster stories; every 11 Sep selected article still requires its own media proof. | — |
| MEDIA-011 | Pending Verification | Critical | Embed-first Presentation | Remove questionable local hero/inline images when an exact official embed is verified. | Large image library still produced semantically weak visuals. | #459 | Merged | Production package proof pending. | — |
| EDITORIAL-011 | Pending Verification | Critical | Diversity / Freshness | Prevent repetition while allowing genuine follow-ups and new match phases. | Earlier freshness/order rules could reject useful updates or allow reciprocal duplicate clusters. | #456, #464-#471 | Deployed | Regression passes including progressive match phases and same-phase duplicate rejection. | — |
| AUTO-003-P24 | Pending Verification | Critical | Notifications | Progressive one-by-one review delivery must not depend on exact-five consolidated completion. | Individual and consolidated delivery semantics coexisted. | #454, #455, #458 | Merged and deployed | Prior run proved two articles can deliver individually while a later slot remains blocked. | — |
| AUTO-005-P22 | In Progress | Critical | Cost / Recovery | One paid candidate per missing launch slot with `$0.40/day` hard guard and `<= $0.30/day` normal target. | Owner restored a tighter launch-run budget after earlier recovery headroom had been raised to `$0.75`. | #456, #458, #473 plus current Leinster-readiness PR | Current hard-ceiling change pending merge/deploy | Must verify production reports a `$0.40` ceiling and package reservations remain <= `$0.30` under the normal five-slot path. | — |
| SOURCE-002 | In Progress | Critical | Irish Discovery | Maintain an evidence-complete fresh Irish reserve in normal discovery. | Source breadth is improved but valid supply changes during the day and can collapse after history filtering. | #441-#471, #477, #478 | #478 production READY | Current Leinster/Zebre and broader Irish reserve requires production proof. | — |
| SOURCE-003 | In Progress | Critical | Irish Discovery / Selection | Preserve enough fresh Irish-connected supply without weakening freshness and true story distinctness. | Remaining risk is time-sensitive genuinely fresh supply after history filtering. | #461-#471, #477, #478 | #478 production READY | Final proof must show missing slots + 3 reserve and >=3 Irish-connected package capacity. | — |
| AUTO-003 | Pending Verification | Critical | Scheduling | Reliable morning output in Europe/Dublin. | Historical late/missing runs and upstream supply failures. | #438, #458, #465-#478 | #478 production READY | Morning launch-readiness run is acceptance test. | — |
| SOCIAL-001 | Blocked | Low for launch | Social publishing | Controlled Facebook/Instagram auto-publishing after human publication. | Provider authorization/testing is separate. | Prior social PRs | Foundation exists | Excluded from website launch gate. | — |

## Latest evidence

Production proof `34521048860` on 10 September ran the canonical gate but stopped before spend after 228 leads → 12 corroborated → 5 evidence-qualified → 4 match-detail-qualified → 2 fresh, with two valid retained drafts.

PR #477 made the canonical pool missing-slot-aware and added a bounded free refill. PR #478 made the thin first pass advisory while keeping the post-refill path strict. Vercel production deployment `dpl_39t6UddKMyHKfaGpHsypY5sS5wQU` is READY on merge SHA `d5fe564ffd1fb52f38c0e86635dee33245c161c5`.

For the 11 September Leinster/Zebre readiness run, the owner requires a `$0.40` Europe/Dublin hard ceiling and `<= $0.30` normal target. The current change lowers the application default accordingly; production verification remains required before the budget issue can close.
