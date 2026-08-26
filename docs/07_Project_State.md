# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

26 August 2026 launch night, after production deployment/verification of the mobile Editorial Review fix, contextual-card/inline-image enrichment, targeted media expansion, safer paragraph-level visual matching, and protected SOCIAL-001 production configuration health evidence.

## Source of truth

Read first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. newest numbered handoff/evidence documents relevant to the task
5. `docs/52_2026-08-25_Article_Visual_Enrichment.md`
6. `docs/51_2026-08-25_Go_Live_Production_Verification.md`
7. `docs/44_2026-08-20_Owner_Priorities.md`

Where older documents conflict with later measured evidence, newer production evidence wins. Do not use chat history as project truth.

## Operating targets

- Timezone: Europe/Dublin.
- Meaningful go-live target: 27 August 2026.
- Daily contract: five review-ready production drafts plus exactly one consolidated editorial notification before 08:00.
- Sanity is the canonical CMS and mandatory human publication boundary.
- GitHub is the versioned project source of truth.
- Batch related changes and minimise Vercel deployments.
- OpenAI spend is capped to the existing prepaid balance; no top-up.

## Editorial contract

Articles are original multi-source Rugby Panda synthesis, not rewrites. Originality and Draft Ready checks remain deterministic and fail-closed. Current hard limits are headline <=70 characters, standfirst <=220, SEO title <=60, SEO description <=160 and paragraph <=120 words, plus filler/formulaic-writing/projection safeguards.

Generated article strings are structured content, not Markdown. Package generation allocates one each of `news-desk`, `analysis-led`, `feature-led`, `notebook`, `explainer`. Publication Review remains mandatory before a draft becomes production-eligible. Human Sanity publication remains mandatory.

## Editorial automation — verified state

### Morning package / AUTO-003 / AUTO-004

- Genuine five-position production package verified.
- Accepted positions are reused during bounded recovery instead of regenerating the whole package.
- #261 deployed the direct Zoho package route and persistent schedules.
- Acquisition/generation schedule: **06:30 Europe/Dublin**.
- Consolidated package delivery schedule: **07:45 Europe/Dublin**.
- #263 returned HTTP 200 with `articleCount: 5` and Zoho SMTP `250 Message received`.
- #265 re-trigger returned `already-sent`; no duplicate SMTP delivery.
- Gmail is not part of the Rugby Panda editorial path.

### Resilience / AUTO-005

- Metadata-only/mechanical presentation failures are repaired deterministically where safe before another full generation call.
- Publication Review corrections are re-normalized through the same hard Draft Ready boundaries.
- Production generation remains GPT-5; GPT-5-mini was cheaper but editorial polish was not equivalent in the controlled 5/5 benchmark.

### Rejection / replacement / AUTO-002

- #202 emits an immediate replacement-acquisition event on rejection.
- `/api/editorial/replacement` rejects identical source sets and repeated angles and requires normal generation gates.
- Production health proved `EDITORIAL_REPLACEMENT_WEBHOOK_URL` is absent, so end-to-end replacement remains blocked; do not reject a live draft merely to reproduce that known failure.

## Image contract and certified media state

Automatic image assignment is relevance-first and fail-closed. Prefer current exact-subject photography, then useful relevant historical/context/venue material, then an approved relevant logo where appropriate; otherwise no image. Never substitute an unrelated named person or generic filler.

Third-party assets require rights metadata and **local Sanity storage**. External URLs do not count toward the usable library.

- 25 August certification: 200 local / 200 strict publication-ready / zero duplicate asset groups.
- 26 August targeted launch acquisition: production library increased to **212 strict local publication-ready images**, with 12 genuinely new imports and zero failed imports/duplicate asset groups.
- Wrong-player Henderson/Paddy Jackson defect was permanently fixed by #273 and the existing draft repaired by #274.
- Targeted acquisition now prioritises exact launch-story players, coaches, teams and venues rather than vanity image counts.

## Article visual enrichment

- #229 content-led article treatments: merged/deployed.
- #230 homepage editorial hierarchy: merged/deployed.
- #241 contextual data-card schema/model/public renderer: merged/deployed.
- #276 deterministic evidence-backed contextual-card population plus up-to-three inline images: merged/deployed.
- #278 mobile Editorial Review readability: merged and production READY.
- #279 safer paragraph-level inline-image depth: merged, production READY and production-Sanity verified. It preserves named-person conflict rejection, team/province conflict rejection, women-specific evidence, package/body dedupe and the three-inline-image cap.

### Current five production drafts — measured 26 August after #279

| Story | Context card | Inline images |
| --- | --- | ---: |
| Connacht front-row depth | Connacht team, 4 rows | 0 |
| Ireland Women / Finn | Ireland team, 4 rows | 3 |
| Joey Carbery / Leinster | Joey Carbery player, 4 rows + portrait | 1 |
| Munster Academy | Munster team, 4 rows | 3 |
| Iain Henderson / Ulster | Iain Henderson player, 2 rows | 2 |

This is a material improvement but **MEDIA-009 is not closed**. Connacht and Carbery remain below the desired visual depth, and Henderson’s available team-context images are older than preferred. Continue targeted acquisition for recent exact-subject depth rather than weakening relevance rules.

## Social distribution / SOCIAL-001

The controlled publication path and payload contract are implemented: a successful human publication can emit `editorial.article.published` with stable event ID, article URL, featured image, Facebook teaser and Instagram caption/hashtags. Sanity stores opt-out/status/event metadata.

PR #280 added a protected no-side-effect production configuration diagnostic. Production verification at 22:38 UTC on 26 August returned:

- `socialWebhookConfigured: false`
- `socialWebhookSecretConfigured: false`
- `siteUrlConfigured: false`

`NEXT_PUBLIC_SITE_URL` has a safe application default of `https://therugbypanda.ie`, so the launch blocker is specifically the missing production `SOCIAL_PUBLISHING_WEBHOOK_URL` (and optional secret) / downstream social orchestrator connection. No Meta post was attempted, and no credentials were exposed. Facebook/Instagram provider verification remains open until the webhook/orchestrator is configured and one controlled publication proves both platform post IDs plus safe retry/idempotency.

## Remaining launch priorities

1. Continue targeted current/recent image acquisition for Connacht, Carbery and other shallow subjects; verify actual article assignments and public rendering, not library counts.
2. Configure/verify the SOCIAL-001 downstream webhook/orchestrator, then perform one controlled Facebook + Instagram publication and record both provider IDs plus duplicate/retry proof.
3. Implement/verify NEWS-001 14:00 major-announcement conditional path with no model/article spend when no qualifying event exists.
4. Finish/verify secure phone-first image upload.
5. Production-prove AUTO-002 rejection -> genuinely different replacement once its downstream webhook/orchestrator is configured.
6. Complete authenticated Sanity edit/save/reload and representative public desktop/mobile checks where owner session is genuinely required.
7. Complete remaining security, backup/recovery, accreditation/provider checks and final go-live acceptance.

## Owner-help boundary

Routine implementation, merges, deterministic audits and clear image approvals should not require owner help. Escalate only genuinely ambiguous rights/relevance cases, unavailable external credentials/account authorization, authenticated owner-only verification, final editorial judgement and final go-live acceptance.

## Completion rule

Always distinguish implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity verified, orchestration verified, Meta verified and documentation updated. A feature is not complete until its relevant verification passes.
