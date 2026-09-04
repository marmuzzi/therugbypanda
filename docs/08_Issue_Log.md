# Issue Log

This is the living launch-boundary issue log for The Rugby Panda. An issue is not closed until its relevant production/CMS/orchestration/provider verification has passed.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## 4 September 2026 reconciliation

Newer numbered evidence documents and current `main` take precedence over historical snapshots. See `docs/101_2026-09-04_Meta_Social_Setup_Reconciliation.md` for recovered Meta evidence.

| ID | Status | Priority | Area | Summary | Current evidence / blocker | Verification required |
| --- | --- | --- | --- | --- | --- | --- |
| SOCIAL-001 | Pending Verification | Critical | Publishing / Social | Publish controlled snippets to Facebook and Instagram only after successful human website publication. | Application/Sanity foundation exists in `docs/34_Daily_Editorial_and_Social_Automation.md`. Recovered Meta evidence proves app `1448619013774538` under Business `1375345774466123` has Manage Pages and Instagram API use cases configured. Page publishing (`pages_manage_posts`) and Instagram publishing (`instagram_business_content_publish` / `instagram_content_publish`) permission surfaces are present; `business_management`, `pages_show_list`, `public_profile` are shown Ready for testing. The old blanket `Meta authorization externally blocked` diagnosis is superseded. Production token grants, intended Page/Instagram account resolution and provider posting remain unverified. | Verify active credential/minimum permissions, intended Facebook Page + linked Instagram professional account, downstream dispatcher configuration, then obtain one FB post ID + one IG post/media ID from a genuine owner-approved publication; verify Sanity writeback, opt-out, duplicate suppression and partial retry. |
| MEDIA-009 | In Progress | Critical | Media / Assignment | Prevent wrong-person/wrong-context images despite the much larger image library. | 4 Sep no-OpenAI acquisition expanded the library materially, but library depth does not prove assignment safety. Owner-reported Codie Taylor/depression and James O'Connor/wrong-person failures require deterministic regression protection. | Production assignment proof on new drafts with named-person/team-context fail-close. |
| AUTO-003 | In Progress | Critical | Editorial Delivery | Deliver one exact-once Zoho email for each new production draft; QA suppressed. | Owner changed the UX from consolidated package delivery. A prior per-draft implementation was later reverted by consolidated-mode restoration, so current main must be repaired/reverified. | One new production draft → one Zoho receipt; replay → no duplicate; QA → no email; repeat across daily set. |
| AUTO-004 | In Progress | Critical | Editorial Automation | Produce five fresh review-ready positions per day without weakening evidence/quality/image gates or exceeding budget. | Irish-first mix still needs implementation/verification; OpenAI budget ceiling is $0.30/day. | Controlled production run after code blockers are fixed and credit is explicitly restored by owner. |
| FINOPS-001 | Pending Verification | Critical | AI Cost | Keep OpenAI spend at or below owner ceiling while preserving quality. | Terra generation + Luna review and application reservation ledger are merged; provider-billing reconciliation, retry/output bounds and per-stage usage telemetry still need hardening. | Measured daily run with actual provider spend <= $0.30. |
| LAUNCH-001 | In Progress | Critical | Go Live | Stable Irish-first newsroom with correct imagery, per-draft email, human publication and post-publication social readiness. | Media depth improved substantially; image assignment, per-draft Zoho, Irish-first mix and controlled end-to-end publication/social proof remain. | Evidence-backed full production path; no auto-publication. |

## SOCIAL-001 safety boundary

Only controlled human `publish` may emit `editorial.article.published`. Social failure must never roll back website publication. Draft generation, image acquisition, Publication Review, scheduled discovery and Zoho delivery must never post to Meta. Do not commit provider secrets or tokens.