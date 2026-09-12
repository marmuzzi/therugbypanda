# Issue Log

This is the living launch-boundary issue log. Historical rows remain preserved in Git history and dated evidence documents.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Active launch issues — 12 September 2026

| ID | Status | Priority | Area | Summary | Root cause | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LAUNCH-001 | In Progress | Critical | Go Live | Five distinct fresh review-ready drafts, >=3 direct Irish connections, mandatory official embeds, progressive delivery and human Sanity publication. | Saturday pre-AI package was fillable, but three paid articles failed review/presentation, one candidate failed before spend, and the one successful draft failed media. | #451-#509 + current headline-repair PR | #509 production READY; headline repair pending merge/deploy | Run `34670946540` produced 1 Sanity draft; media run `34671229317` delivered 0. | — |
| BUDGET-002 | Closed | Critical | Cost Guard | Enforce `$0.40/day` hard ceiling and `<= $0.30/day` normal production target. | Recovery work had drifted code/docs to `$0.75/$0.40`. | #479, #506 | Production READY | Runtime showed `limitUsd: 0.4`; actual Saturday reservations stopped at `$0.220`, with zero paid replacements. | 2026-09-12 |
| REVIEW-001 | In Progress | Critical | Pre-AI / Editorial Quality | Avoid spending on evidence that cannot support a strong Luna-approved article. | Acquisition fact ledgers remain too headline-shaped for some stories; Leinster selection copy used only Deegan/Baird and was rejected for insufficient concrete selection/tactical detail. | #488, #502, #506-#509 | Current path deployed | Saturday production exposed the remaining evidence-depth gap. | — |
| REVIEW-002 | Implemented | Critical | Post-Review Deterministic Quality | Normalize headline length after Luna correction before final deterministic gating. | `repairReviewPresentation()` clipped standfirst, SEO fields and paragraphs but not the article title; Mack Hansen correction therefore failed after review with an over-70-character headline. | current headline-repair PR | Pending merge/deploy | Code now clips corrected titles to <=70 characters before deterministic Draft Ready; production verification pending. | — |
| EVIDENCE-016 | Pending Verification | High | Runtime Person Identity | Treat honorific variants as the same person (`Steve Hansen` / `Sir Steve Hansen`). | Shared person extraction preserved the honorific, while the runtime surname-collision gate compared the first token literally. | #509 | Production READY | Regression added and deployed; fresh production runtime proof pending because same-day paid retry is prohibited. | — |
| MEDIA-010 | In Progress | Critical | Embedded Media | Every review-ready article requires directly relevant verified official social/video media. | Alex Usanov had no curated exact override and all three relevant official YouTube feeds returned HTTP 500 in the media run. | #453, #457-#459, #489, #509 | #509 production READY | Media run `34671229317`: 0 ready / 1 blocked; no irrelevant image substituted. Retry repair deployed; fresh provider verification pending. | — |
| MEDIA-012 | Pending Verification | High | Official Feed Resilience | Retry transient official YouTube feed errors before fail-closed media blocking. | A single transient HTTP 500 from each feed was treated as final unavailability. | #509 | Production READY | Bounded 3-attempt retry deployed for 408/425/429/5xx/timeouts; fresh provider verification pending. | — |
| SOURCE-002 | Pending Verification | Critical | Irish Discovery | Maintain enough truly Irish-connected supply for >=3/5. | Supply can collapse after quality/freshness/paid filters; category inference can also over-count broad Ireland terms. | #441-#471, #477-#509 | Current path deployed | Run `34670946540` selected genuine Connacht + two Leinster stories; broader classifier audit still recommended. | — |
| AUTO-003 | Pending Verification | Critical | Scheduling | Reliable Dublin-morning package. | Scheduler runs, but upstream editorial/media failures still prevent 5/5 completion. | #438, #458, #465-#509 | Production deployed | Saturday canonical run triggered and executed as scheduled path; package completion failed downstream. | — |
| SOCIAL-001 | Blocked | Low for launch | Social publishing | Controlled Facebook/Instagram auto-publishing after human publication. | Separate provider authorization/testing. | Prior social PRs | Foundation exists | Explicitly excluded from this launch gate. | — |

## Closed / production-proved foundations

| ID | Status | Priority | Area | Summary | Root cause | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PROOF-001 | Closed | High | Verification Harness | `launch-reserve-proof.yml` consumes the same canonical qualification path as production. | PR #505 proof used a legacy history script. | #504-#506 | Deployed | Run `34670697684` passed all deterministic steps. | 2026-09-12 |
| EDITORIAL-014 | Closed | Critical | Match Build-up / Clustering | Corroborate same-match team-selection reports across different player-led headlines while preserving phase distinctness. | The42 led with Max Deegan and the Independent with Ryan Baird, so old clustering missed the shared team-selection development. | #507 | Production READY via #508 | Run `34670946540` clustered and selected the Leinster-Zebre team announcement, which reached Terra. | 2026-09-12 |
| CANONICAL-001 | Closed | Critical | Canonical Pool | One freshness/paid-attempt decision before package selection. | Earlier downstream disagreement. | #476-#478, #486, #491-#494, #504 | Deployed | Production-proved. | 2026-09-11 |
| FRESHNESS-002 | Closed | Critical | Match Phases | Allow genuine progressive phases, reject same-phase rewrites. | Earlier phase inconsistency. | #464-#471, #486, #491-#492 | Deployed | Regression-proved. | 2026-09-11 |
| PAID-ELIGIBILITY-001 | Closed | Critical | Cost Eligibility | Exclude same-day paid IDs before capacity/diversity. | Paid filter previously too late. | #491-#493 | Deployed | Production-proved. | 2026-09-11 |
| EVIDENCE-015 | Closed | Critical | Person Identity | Prevent team/competition labels being parsed as people. | Parser parity drift. | #483, #485-#487, #495 | Deployed | Production-proved. | 2026-09-11 |
| MODEL-001 | Closed | Critical | AI Routing | Terra generates; Luna reviews/repairs. | Review model captured too early. | #488 | Deployed | Saturday runtime again confirms Terra generation and Luna review. | 2026-09-11 |

## Latest evidence

PR #509 is merged and production READY on Vercel deployment `dpl_FJMikuKcrPpE6hWmPXDBvMSR4KWS`, SHA `2b5dacd7b6a3250d9f38d8918cbae241133a469b`. It normalizes person honorifics for runtime identity checks and adds bounded retries for transient official YouTube feed failures.

Production run `34670946540` passed every free gate. The canonical pool had 7 fresh unpaid eligible positions; diversity had 4 classified Irish-connected; slot planning selected five initial IDs with a projected `$0.275`, `paidAttemptLimit=5` and `replacementPaidAttempts=0`.

Runtime results: Borthwick reserved and failed Luna #2; Mack Hansen reserved and failed the final headline-length gate; Leinster-Zebre team selection reserved and failed Luna #2 for insufficient concrete rugby detail; Alex Usanov reserved, passed Luna and created `drafts.article-current-2026-09-12-037e437777f7`; Steve Hansen failed before reservation because `Sir Steve Hansen` was incorrectly treated as a different first name. Total reservation was `$0.220`.

Mandatory-media run `34671229317` found one current draft and correctly left it blocked. Irish Rugby, Leinster Rugby and URC official YouTube feeds each returned HTTP 500; no exact override existed and no irrelevant local image was forced. PR #509 now provides transient-feed retry resilience without weakening relevance.

The current headline-repair branch addresses REVIEW-002 by applying deterministic <=70-character title normalization after Luna correction and before the final Draft Ready gate. No same-day paid retry is permitted merely to verify that repair.
