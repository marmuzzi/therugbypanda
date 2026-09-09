# Issue Log

This is the living launch-boundary issue log. Historical rows remain preserved in Git history and dated evidence documents.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Active launch issues — 9 September 2026

| ID | Status | Priority | Area | Summary | Root cause | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LAUNCH-001 | In Progress | Critical | Go Live | Five distinct fresh review-ready drafts, >=3 direct Irish connections, mandatory official embeds, progressive delivery and human Sanity publication. | Sequential evidence, retained-state, repetition, media and budget defects. | #451-#459 | #458 production READY; #459 merged | 9 Sep media path proven for 2/3 current distinct drafts; full 5/5 still pending. | — |
| AUTO-004-P25 | Pending Verification | Critical | Diversity / Recovery | Replace invalid retained state rather than aborting or carrying stale/duplicate positions. | Retained drafts were previously treated as entitlements and source-cluster duplicates could survive under different IDs. | #451, #452, #456 | Merged | Exact-day sanitation and duplicate eviction exercised on 9 Sep; next normal scheduled package still requires proof. | — |
| MEDIA-010 | Pending Verification | Critical | Embedded Media | Require a verified story-specific official social/video embed before delivery. | Automatic acquisition was previously absent and local imagery was incorrectly treated as mandatory. | #453, #457, #458, #459 | #458 READY; #459 merged | Run `34327661508` applied/read-back exact official embeds for Tom Wood and Fintan Gunne and delivered both individually. Waratahs/Brumbies correctly remained blocked. | — |
| MEDIA-011 | Pending Verification | Critical | Embed-first Presentation | Remove questionable local hero/inline images when an exact official embed is verified. | Large image library still produced semantically weak visuals; keeping them beside exact embeds degraded article quality. | #459 | Merged | Production media-only cleanup proof pending. | — |
| EDITORIAL-011 | In Progress | Critical | Diversity / Freshness | Prevent day-after-day repetition of materially same subject/development/angle. | Existing position freshness did not stop a second Tom Wood/Madigan draft with a different generated ID. | #456 | Merged | Source-cluster duplicate guard added; five-slot multi-day production proof pending. | — |
| AUTO-003-P24 | Pending Verification | Critical | Notifications | Progressive one-by-one review delivery must not depend on exact-five consolidated completion. | Individual and consolidated delivery semantics coexisted. | #454, #455, #458 | Merged and deployed | Run `34327661508` sent two media-ready articles individually while the third remained blocked and package incomplete. | — |
| MEDIA-009 | Superseded | Critical | Images | Prevent wrong-person/wrong-context local images. | Semantic local-image matching remained unreliable despite large library. | prior media PRs; #458, #459 | Embed-first replacement merged | Local image is no longer a readiness requirement; weak local media is removed when an exact embed exists. | 2026-09-09 |
| AUTO-005-P22 | In Progress | Critical | Cost / Recovery | One paid candidate per missing launch slot under `$0.40/day`. | Legacy source/image replacement path could retry already-paid candidates. | #456, #458 | Merged | 9 Sep ledger reached `$0.385` before legacy path removal; next normal day must prove no repeated reservation. | — |
| SOURCE-002 | Pending Verification | Critical | Irish Discovery | Maintain evidence-complete Irish reserve in normal discovery. | Supply is volatile after strict evidence filtering. | #441-#458 | Merged | Free discovery has produced sufficient reserves on measured runs, but full 5/5 under current contract remains pending. | — |
| AUTO-003 | Pending Verification | Critical | Scheduling | Reliable morning output in Europe/Dublin. | Historical late/missing runs and upstream failures. | #438, #458 | Merged | 04:30/05:30 UTC scheduled attempts remain; simplified bounded workflow needs next-day proof. | — |
| SOCIAL-001 | Blocked | Low for launch | Social publishing | Controlled Facebook/Instagram auto-publishing after human publication. | Provider authorization/testing is separate. | Prior social PRs | Foundation exists | Excluded from website launch gate. Article embeds are editorial media, not social auto-publishing. | — |

## Latest evidence

Production media run `34327661508` on main SHA `67b56df7362dc43b65465ba675a42c4f4bf6954f` passed exact-package and official-video regressions. It inspected three current drafts, applied and read back exact official embeds for the Tom Wood/Munster and Fintan Gunne/Leinster stories, left the Waratahs/Brumbies article blocked for lack of verified story-specific official media, and delivered only the two ready articles. The progressive endpoint reported 2 accepted deliveries out of 5.

This is the desired fail-closed behavior: a correct embed is better than an irrelevant image, and lack of a relevant embed must block that article rather than be filled with generic media.
