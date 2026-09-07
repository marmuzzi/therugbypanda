# Issue Log

This is the living launch-boundary issue log. Historical rows remain preserved in Git history and dated evidence documents.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Active launch issues — 7 September 2026

| ID | Status | Priority | Area | Summary | Root cause | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LAUNCH-001 | In Progress | Critical | Go Live | Five fresh review-ready drafts, >=3 direct Irish connections, safe imagery and human Sanity publication. | 7 Sep paid recovery failed after free selection because generation slots still admitted under-specified evidence. | #439-#444 | #442/#443 merged; #444 pending merge at reconciliation | Free reserve proof `34146444423` passed through slot planning; fresh paid 8 Sep proof required. | — |
| AUTO-004-P21 | Pending Verification | Critical | Evidence / Review | Require story-type facts before spend and respect critical/high-only Review #2 blocking. | Completed-match/squad facts were too generic; route duplicated review verdict handling. | #442, #444 | #442 merged; #444 pending | Contract CI for #444 passed (`34146667441`); production free proof after #444 still required. | — |
| AUTO-005-P22 | Pending Verification | Critical | Cost / Recovery | One paid candidate per missing launch slot under $0.40/day. | Replacement queue consumed successive $0.055 reservations; 7 Sep reached $0.385. | #442, #443 | Merged | Free proof `34146444423`: retained 1, missing 4, paidAttemptLimit 4, replacementPaidAttempts 0. Paid proof intentionally deferred to next Dublin day. | — |
| SOURCE-002 | Pending Verification | Critical | Irish Discovery | Targeted Irish reserve is part of normal discovery. | Irish targeting previously existed only in recovery. | #441, #442 | Merged | Free proof `34146444423`: 28/28 standard sources, +40 targeted Irish leads, 4 Irish-connected candidates after diversity. | — |
| AUTO-004-P23 | Implemented | Critical | Evidence Coherence | Reject same-surname/different-person corroboration before paid slot selection. | Surname fallback could treat Mack Hansen and Sir Steve Hansen as the same person anchor. | #444 | Pending merge | #444 requires exact normalized full-name corroboration, detects same-surname/different-first-name collisions, and CI `34146667441` passed. Production free proof pending. | — |
| AUTO-003-P24 | Open | High | Notifications | Reconcile per-draft notification with legacy consolidated exact-five package completion. | Two delivery semantics coexist. | #437 plus prior AUTO-003 work | Per-draft deployed; completion refactor pending | Owner received one 7 Sep draft email; coexistence not production-reconciled. | — |
| MEDIA-009 | In Progress | Critical | Images | Prevent wrong-person/wrong-context images. | Owner-reported James O'Connor and Codie Taylor defects remain. | Prior media PRs | Existing planner/verifier deployed | Final launch package image verification pending. | — |
| AUTO-003 | Pending Verification | Critical | Scheduling | Reliable morning output in Europe/Dublin. | Scheduled runs were late/missing; watchdog exists but repaired pipeline SLA unproven. | #438 plus prior work | Merged | Fresh 8 Sep current-main run required. | — |
| AUTO-004 | In Progress | Critical | Editorial Automation | Produce five fresh positions without weak evidence/repeats/concentration. | Sequential defects across discovery, evidence coherence, review and recovery budget. | #439-#444 | #442/#443 merged; #444 pending | Free reserve proof passed; paid draft proof pending. | — |
| SOCIAL-001 | Blocked | Low for launch | Social | Controlled Facebook/Instagram after human publication. | Provider authorization/testing separate. | Prior social PRs | Foundation exists | Explicitly excluded from website launch gate. | — |

## Latest evidence

Zero-model reserve proof run `34146444423` on main `787fc8f...` succeeded through all free stages: 152 standard leads + 40 Irish-targeted = 192; 19 corroborated; 15 passed the then-current evidence filter; Ireland-first diversity found 4 Irish-connected candidates; one retained draft; slot planning selected exactly four candidates for four missing slots with zero paid replacements. It made no draft API/model call.

That proof also showed why #444 is required before tomorrow's paid run: the four selected IDs still included the known Mack Hansen completed-match candidate and the Red Roses squad candidate. #444 moves the final-score, named-person and exact-person-coherence requirements into the free evidence filter before diversity and slot planning.
