# Issue Log

This is the living launch-boundary issue log. Historical rows remain preserved in Git history and dated evidence documents.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Active launch issues — 12 September 2026

| ID | Status | Priority | Area | Summary | Root cause | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LAUNCH-001 | In Progress | Critical | Go Live | Five distinct fresh review-ready drafts, >=3 direct Irish connections, mandatory official embeds, progressive delivery and human Sanity publication. | Previous-day review/media failures prevented 5/5. Saturday reserve is now fillable; paid generation/media proof remains. | #451-#507 | #506 production READY; #507 merged | Zero-model package proof green; full paid/media proof pending. | — |
| BUDGET-002 | Pending Verification | Critical | Cost Guard | Enforce `$0.40/day` hard ceiling and `<= $0.30/day` normal production target. | Recovery work drifted code/docs to `$0.75/$0.40`. | #479, #506 | #506 production READY | Contract test `34670697723` passed; reserve proof projects `$0.275`; paid runtime proof pending. | — |
| PROOF-001 | Closed | High | Verification Harness | `launch-reserve-proof.yml` consumes the same canonical qualification path as production. | PR #505 proof used the legacy history script and produced a non-canonical batch for slot planning. | #504-#506 | #506 production READY | Run `34670697684` passed all steps including canonical pool and slot plan. | 2026-09-12 |
| EDITORIAL-014 | Pending Verification | Critical | Match Build-up / Clustering | Corroborate same-match team-selection reports that lead with different players while keeping preview and selection phases separate. | Clustering required shared person/title identity, so The42's Max Deegan selection story and the Irish Independent's Ryan Baird selection story did not corroborate despite describing the same Leinster-Zebre team announcement. | #507 | Merged; production deployment pending | Regression added; real production discovery proof pending. | — |
| REVIEW-001 | In Progress | Critical | Pre-AI Quality | Avoid spending a slot on evidence unlikely to pass Luna. | Earlier deterministic gates admitted some candidates lacking explicit story-specific detail. | #488, #502, #506 | #506 production READY | Saturday paid proof pending. | — |
| MEDIA-010 | In Progress | Critical | Embedded Media | Every review-ready article requires directly relevant verified official social/video media. | Previous retained article had no suitable official embed. | #453, #457-#459, #489, #506 | Foundation deployed | Saturday media-ready proof pending; no irrelevant local image may substitute. | — |
| SOURCE-002 | Pending Verification | Critical | Irish Discovery | Maintain enough fresh Irish-connected supply for >=3/5. | Fresh Irish supply can collapse after evidence/history/paid-attempt filters. | #441-#471, #477-#507 | #506 production READY; #507 merged | Run `34670697684` found exactly 3 Irish-connected available candidates; selection clustering should improve quality/priority. | — |
| AUTO-003 | Pending Verification | Critical | Scheduling | Reliable Dublin-morning package. | Upstream quality/supply/media failures previously prevented completion. | #438, #458, #465-#507 | Production path deployed | Saturday paid production run pending. | — |
| SOCIAL-001 | Blocked | Low for launch | Social publishing | Controlled Facebook/Instagram auto-publishing after human publication. | Separate provider authorization/testing. | prior social PRs | Foundation exists | Explicitly excluded from this launch gate. | — |

## Closed / production-proved foundations

| ID | Status | Priority | Area | Summary | Root cause | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CANONICAL-001 | Closed | Critical | Canonical Pool | One freshness/paid-attempt decision before package selection. | Earlier downstream disagreement. | #476-#478, #486, #491-#494, #504 | Deployed | Production-proved. | 2026-09-11 |
| FRESHNESS-002 | Closed | Critical | Match Phases | Allow genuine progressive phases, reject same-phase rewrites. | Earlier phase inconsistency. | #464-#471, #486, #491-#492 | Deployed | Regression-proved. | 2026-09-11 |
| PAID-ELIGIBILITY-001 | Closed | Critical | Cost Eligibility | Exclude same-day paid IDs before capacity/diversity. | Paid filter previously too late. | #491-#493 | Deployed | Production-proved. | 2026-09-11 |
| EVIDENCE-015 | Closed | Critical | Person Identity | Prevent team/competition labels being parsed as people. | Parser parity drift. | #483, #485-#487, #495 | Deployed | Production-proved. | 2026-09-11 |
| MODEL-001 | Closed | Critical | AI Routing | Terra generates; Luna reviews/repairs. | Review model captured too early. | #488 | Deployed | Production-proved. | 2026-09-11 |

## Latest evidence

PR #506 merged at SHA `066a592cd720fd4f5a9e1a74e2c4c5d5d80e215d`; Vercel deployment `dpl_6XwZpDr5qmv2WK9JohDvUBXjKda8` is production READY on that exact SHA. Contract run `34670697723` passed.

Zero-model reserve run `34670697684` passed every deterministic step. Its canonical pool contained 6 unpaid fresh eligible positions for 5 missing slots; package diversity had exactly 3 Irish-connected candidates; slot planning selected 5 candidates with 3 Irish-connected, no previously-paid exclusions, zero replacements, `$0.000` reserved before and `$0.275` projected reservation. The optional reserve target remained thin but the strict package minimum passed.

Fresh discovery contained The42's Max Deegan-led Leinster-Zebre team announcement and the Irish Independent's Ryan Baird-led report, but they were not clustered because their headlines shared the matchup/selection phase rather than the same lead person. PR #507 adds a same-two-teams + explicit-selection phase corroboration rule and a regression proving that generic preview and later selection remain separate.
