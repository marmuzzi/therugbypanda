# Issue Log

This is the living launch-boundary issue log for The Rugby Panda. An issue is not closed until its relevant production/CMS/orchestration/provider verification has passed.

Historical issue rows through 3 September remain preserved in Git history and dated evidence documents. This 7 September reconciliation narrows the living table to unresolved/current launch work so stale deployment statements are not mistaken for current state.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Active launch issues — reconciled 7 September 2026

| ID | Status | Priority | Area | Summary | Root cause | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LAUNCH-001 | In Progress | Critical | Go Live | Launch with five fresh review-ready drafts, >=3 direct Irish connections, safe imagery and human Sanity publication. | 7 Sep proved Irish discovery can supply the quota, but evidence→generation→review and budget-recovery contracts still allowed paid failure churn. | #439-#442 | #442 pending merge/deployment at reconciliation | Run `34135365500` failed with one retained draft and zero new drafts; 8 Sep production proof required. | — |
| AUTO-004-P21 | Implemented | Critical | Evidence / Publication Review | Require story-type facts before spend and stop medium/low-only Review #2 observations from becoming a hidden hard rejection. | Completed-match and squad evidence floors were too generic; API route duplicated PublicationReviewCycle verdict handling. | #442 | Branch implemented; merge/deploy pending | Deterministic contract workflow added; PR/production evidence pending. | — |
| AUTO-005-P22 | Implemented | Critical | Cost / Recovery | Allocate one paid candidate per missing launch slot under $0.40/day. | Replacement candidates could consume successive $0.055 reservations; 7 Sep ledger reached $0.385. | #442 | Branch implemented; merge pending | Slot planner records missing slots, paidAttemptLimit and zero replacement paid attempts; production exercise deferred to next Dublin-day allowance. | — |
| SOURCE-002 | Implemented | Critical | Irish Discovery | Make targeted Irish reserve part of normal discovery, not a special recovery-only step. | Main current-source discovery did not automatically execute PR #441's targeted Ireland/province reserve. | #441, #442 | Branch implemented; merge pending | Run `34135365500` proved targeted discovery itself: +40 leads and exactly 3 Irish-connected candidates; normal integration pending. | — |
| AUTO-004-P23 | Open | Critical | Evidence Coherence | Prevent same-surname/different-person corroboration such as Mack Hansen ↔ Sir Steve Hansen. | `sharedPersonAnchor()` can treat surname overlap as a person anchor even when first names differ. | — | Not implemented in #442 | Artifact from run `34135365500` proves the contaminated candidate. Must be fixed and regression-proven before closing. | — |
| AUTO-003-P24 | Open | High | Notifications / Completion | Reconcile per-draft Zoho notification with legacy consolidated exact-five package completion. | Per-draft notification sends on draft creation while historical workflow still contains consolidated package delivery/completion semantics. | #437 and prior AUTO-003 work | Per-draft code deployed; completion refactor pending | Owner received one 7 Sep draft email; coexistence not production-reconciled. | — |
| MEDIA-009 | In Progress | Critical | Media / Assignment | Prevent wrong-person/wrong-context images. | Owner-reported James O'Connor and Codie Taylor examples show semantic defects remain. | Through #385; further repair pending | Existing planner/verifier parity deployed | Final launch package image verification pending. | — |
| MEDIA-011 | In Progress | Critical | Media / Acquisition | Maintain strong relevant local candidates without forcing unrelated imagery. | Candidate depth remains uneven by subject. | Prior media PRs | Existing acquisition deployed | Launch package-specific verification pending. | — |
| AUTO-003 | Pending Verification | Critical | Scheduling | Deliver reliable morning editorial output in Europe/Dublin. | Scheduled runs were observed late/missing; watchdog added, but repaired end-to-end SLA unproven. | #438 plus prior AUTO-003 work | Watchdog merged | Fresh 8 Sep current-main run required. | — |
| AUTO-004 | In Progress | Critical | Editorial Automation | Produce five genuinely new current positions without weak evidence/repeats/concentration. | Sequential launch defects across discovery, evidence coherence, review and budget recovery. | #439-#442 plus prior work | #442 pending | 7 Sep proved free Irish supply but failed paid draft creation. | — |
| EDIT-001 | Pending Verification | Critical | Editorial Quality | Produce concrete supporter-focused copy. | Evidence packs can be too abstract for the story promise. | #442 plus prior quality PRs | #442 pending | 8 Sep fresh generation proof required. | — |
| EDIT-002 | In Progress | Critical | Editorial Synthesis | Keep multi-source evidence coherent around the same person/development. | Same-surname person anchoring can fuse unrelated stories. | Prior coherence PRs; P23 pending | P23 not fixed | Mack Hansen/Sir Steve Hansen is current failing evidence. | — |
| EDIT-004 | Pending Verification | High | Style | Keep five articles structurally differentiated. | Style profiles can still converge. | Prior style PRs | Deployed foundation | Full launch package owner review pending. | — |
| WEB-010 | Pending Verification | High | Frontend | Public article layouts remain differentiated. | No final human-approved launch package yet. | Prior web PRs | Deployed foundation | Live launch verification pending. | — |
| WEB-011 | Pending Verification | High | Homepage | Homepage shows editorial hierarchy with real launch content. | No final five-story published package yet. | Prior web PRs | Deployed foundation | Live launch verification pending. | — |
| WEB-013 | Pending Verification | High | CMS / Mobile | Editorial Review remains usable on phone. | Final authenticated owner-phone launch interaction pending. | #278 | Deployed | Owner verification pending. | — |
| SOCIAL-001 | Blocked | Low for launch | Social | Controlled Facebook/Instagram distribution after human publication. | Provider/tester authorization remains separate. | Prior social PRs | Foundation exists | Explicitly excluded from website launch gate. | — |

## Current measured baseline

Run `34135365500` on 7 September: 28/28 standard sources succeeded; 160 standard + 40 targeted Irish leads; 17 corroborated; 14 evidence-accepted; Ireland-first diversity passed with exactly 3 available Irish-connected candidates; one retained eligible draft; zero new drafts. Publication Review blocked Mack Hansen and Red Roses on concrete factual omissions. Joey Carbery was incorrectly blocked by the duplicate route-level verdict check despite only medium/low Review #2 observations. Later attempts were blocked at `$0.385 + $0.055 > $0.40`. Images and consolidated Zoho were not reached.

See `docs/100_2026-09-07_Launch_Recovery_Contract.md`.
