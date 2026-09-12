# Issue Log

This is the living launch-boundary issue log. Historical rows remain preserved in Git history and dated evidence documents.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Active launch issues — 12 September 2026

| ID | Status | Priority | Area | Summary | Root cause | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LAUNCH-001 | In Progress | Critical | Go Live | Five distinct fresh review-ready drafts, >=3 direct Irish connections, mandatory official embeds, progressive delivery and human Sanity publication. | Previous-day paid review/media failures plus insufficient Irish supply prevented 5/5. Saturday has a new operational day and new Leinster team-selection evidence, but requires a fresh full proof. | #451-#506 | #505 READY; #506 pending merge/deploy | Saturday 5/5 proof pending. | — |
| BUDGET-002 | Implemented | Critical | Cost Guard | Enforce `$0.40/day` hard ceiling and `<= $0.30/day` normal production target. | Later recovery work drifted code/docs back to `$0.75/$0.40`, conflicting with the owner-approved budget contract already documented in `docs/99`. | #479, #506 | #506 pending merge/deploy | Contract test updated; production proof pending. | — |
| PROOF-001 | Implemented | High | Verification Harness | Make `launch-reserve-proof.yml` consume the same canonical qualification path as production. | PR #505 proof still called legacy `filter-current-production-history-freshness.mjs`, then passed a non-canonical batch to `prepare-slot-budget-batch.mjs`; editorial gates passed but slot planning correctly failed integrity checks. | #504-#506 | #506 pending merge/deploy | Corrected zero-model proof pending. | — |
| REVIEW-001 | In Progress | Critical | Pre-AI Quality | Avoid spending a slot on evidence unlikely to pass Luna. | Earlier deterministic gates admitted some candidates lacking sufficiently explicit story-specific detail. | #488, #502, #506 | #502 READY; #506 pending | Cross-story contamination fix deployed; Saturday paid proof pending. | — |
| MEDIA-010 | In Progress | Critical | Embedded Media | Every review-ready article requires directly relevant verified official social/video media. | Previous retained article had no suitable official embed. | #453, #457-#459, #489, #506 | Foundation deployed | Saturday media-ready proof pending; no irrelevant local image may substitute. | — |
| SOURCE-002 | In Progress | Critical | Irish Discovery | Maintain enough fresh Irish-connected supply for >=3/5. | Fresh Irish supply can collapse after evidence, history and paid-attempt filters. | #441-#471, #477-#506 | #499 discovery expansion READY | Saturday team-selection evidence materially improves Leinster supply; canonical proof pending. | — |
| EDITORIAL-013 | In Progress | High | Match Build-up | Prioritise Leinster v Zebre without repetitive angles. | Same-match coverage is useful only when development/phase is materially different. | #464-#471, #486, #499-#506 | Current production path deployed | Fresh Leinster team-selection phase identified; selection/media gate proof pending. | — |
| AUTO-003 | Pending Verification | Critical | Scheduling | Reliable Dublin-morning package. | Upstream supply/review/media failures, not scheduler mechanics, prevented completion. | #438, #458, #465-#506 | Latest main READY before #506 | Saturday production run pending. | — |
| SOCIAL-001 | Blocked | Low for launch | Social publishing | Controlled Facebook/Instagram auto-publishing after human publication. | Separate provider authorization/testing. | prior social PRs | Foundation exists | Explicitly excluded from this launch gate. | — |

## Closed / production-proved foundations

| ID | Status | Priority | Area | Summary | Root cause | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CANONICAL-001 | Closed | Critical | Canonical Pool | One freshness/paid-attempt decision before package selection. | Earlier downstream disagreement. | #476-#478, #486, #491-#494, #504 | Deployed | Production-proved on 11 September. | 2026-09-11 |
| FRESHNESS-002 | Closed | Critical | Match Phases | Allow genuine progressive phases, reject same-phase rewrites. | Earlier phase inconsistency. | #464-#471, #486, #491-#492 | Deployed | Regression-proved. | 2026-09-11 |
| PAID-ELIGIBILITY-001 | Closed | Critical | Cost Eligibility | Exclude same-day paid IDs before capacity/diversity. | Paid filter previously too late. | #491-#493 | Deployed | Production-proved. | 2026-09-11 |
| EVIDENCE-015 | Closed | Critical | Person Identity | Prevent team/competition labels being parsed as people. | Parser parity drift. | #483, #485-#487, #495 | Deployed | Production-proved. | 2026-09-11 |
| MODEL-001 | Closed | Critical | AI Routing | Terra generates; Luna reviews/repairs. | Review model captured too early. | #488 | Deployed | Production-proved. | 2026-09-11 |

## Latest evidence

PR #505 is the current deployed main baseline before this repair. Vercel deployment `dpl_AVn6LFuYfGxpzhR9rwf7FKWK6rZq` is READY on SHA `e6a4f023159b3688eb774d51a0de918f84d195d8`.

Its zero-model reserve run `34617850381` passed freshness tests, Irish qualification, story clustering, discovery, evidence, match-detail parity, production-history filtering and Ireland-first diversity. It failed only when `prepare-slot-budget-batch.mjs` rejected the batch because the proof workflow had not run `qualify-current-editorial-pool.mjs`. PR #506 aligns that proof harness with the actual canonical production sequence.

Fresh public/official-source research for 12 September confirms a new Leinster v Zebre team-selection phase: Max Deegan captains, Fintan Gunne and Caspar Gabriel form the half-backs, and Alex Usanov starts at loosehead. This is eligible for priority consideration but still must pass normal corroboration, freshness, diversity and official-media gates.
