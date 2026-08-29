# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

29 August 2026 Sunday-recovery window, after production deployment of the pre-generation freshness history/gate and fail-closed removal of the stale acquisition-batch fallback.

## Source of truth

Read first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. newest numbered handoff/evidence documents relevant to the task
5. `docs/56_2026-08-29_AUTO004_Normal_Scheduler_Gap.md`
6. `docs/54_2026-08-28_Sunday_Recovery_Media_and_Source_Evidence.md`
7. `docs/52_2026-08-25_Article_Visual_Enrichment.md`

Where older documents conflict with later measured evidence, newer production evidence wins. Do not use chat history as project truth.

## Operating targets

- Timezone: Europe/Dublin.
- Current recovery target: Sunday launch readiness.
- Daily contract: five review-ready production drafts plus exactly one consolidated editorial notification before 08:00.
- Sanity is the canonical CMS and mandatory human publication boundary.
- GitHub is the versioned project source of truth.
- Batch related changes and minimise Vercel deployments.
- OpenAI spend is capped to the existing prepaid balance; no top-up.

## Editorial contract

Articles are original multi-source Rugby Panda synthesis, not rewrites. Originality and Draft Ready checks remain deterministic and fail-closed. Current hard limits are headline <=70 characters, standfirst <=220, SEO title <=60, SEO description <=160 and paragraph <=120 words, plus filler/formulaic-writing/projection safeguards.

Generated article strings are structured content, not Markdown. Package generation allocates one each of `news-desk`, `analysis-led`, `feature-led`, `notebook`, `explainer`. Publication Review remains mandatory before a draft becomes production-eligible. Human Sanity publication remains mandatory.

## Editorial automation — current verified state

### Morning package / AUTO-003 / AUTO-004

- 27 August recovery proved a genuine fresh five-position package with normal editorial gates intact, but it was not proof of a normal autonomous scheduled acquisition day.
- PRs #293-#295 deployed the permanent freshness foundation: recent production Sanity positions are loaded before generation; candidate identity compares subject + development/event + editorial angle; same-story rewrites and within-package duplicates are rejected before model spend; exactly five survivors are required or the path fails closed.
- PR #297 removed the stale default repository-batch fallback. An invocation without an explicit acquisition batch now fails closed instead of silently replaying old stories.
- **Launch-critical scheduler gap:** there is currently no autonomous 06:30 current-source discovery/acquisition schedule feeding the protected importer. `import-editorial-acquisition-batch.yml` is not a normal newsroom scheduler. Do not claim 06:30 acquisition as production-verified until a real current-source worker is implemented and run.
- Correct P0 boundary: scheduled current-source discovery must consume the source registry, construct evidence-backed candidate identities, run the production-history freshness selector before generation, require exactly five survivors, then invoke the existing evidence/fact-ledger/generation/review path.
- Consolidated package delivery remains scheduled for 07:45 Europe/Dublin through the exactly-once Zoho path.
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
- 26 August targeted acquisition: 212 strict local publication-ready images.
- **28 August production certification supersedes both older figures: 241 strict publication-ready local Sanity Editorial Images from 490 audited records.** The run imported 28 genuinely new local assets, reconciled readiness metadata, had zero failed imports and zero duplicate local-asset groups. Do not use 212 as the current baseline.
- Wrong-player Henderson/Paddy Jackson defect was permanently fixed by #273 and the existing draft repaired by #274.
- Targeted acquisition prioritises exact launch-story players, coaches, teams and venues rather than vanity image counts.

## Current-five media boundary

MEDIA-009 remains open. The current recovery five must be audited by production Sanity readback, with exact/relevant heroes and meaningful inline alternatives only where evidence supports them. Fewer/no images is correct when no strong candidate passes. MEDIA-011 remains open until article-triggered acquisition automatically provides at least three strong relevant candidates where possible without forcing placements.

## Article visual enrichment / mobile CMS

- #229 content-led article treatments: merged/deployed.
- #230 homepage editorial hierarchy: merged/deployed.
- #241 contextual data-card schema/model/public renderer: merged/deployed.
- #276 deterministic evidence-backed contextual-card population plus up-to-three inline images: merged/deployed.
- #278 mobile Editorial Review readability: merged and production READY.
- #279 safer paragraph-level inline-image depth: merged, production READY and production-Sanity verified. It preserves named-person conflict rejection, team/province conflict rejection, women-specific evidence, package/body dedupe and the three-inline-image cap.
- Representative public article/homepage rendering and final authenticated phone interaction remain verification boundaries; do not publish solely to manufacture evidence.

## Social distribution / SOCIAL-001

The controlled publication path and payload contract are implemented: a successful human publication can emit `editorial.article.published` with stable event ID, article URL, featured image, Facebook teaser and Instagram caption/hashtags. Sanity stores opt-out/status/event metadata.

PR #280 added a protected no-side-effect production configuration diagnostic. Production verification on 26 August returned `socialWebhookConfigured:false` and `socialWebhookSecretConfigured:false`. The application has a safe site URL default, so the launch blocker is the missing downstream social webhook/orchestrator connection. No Meta post has been claimed. If the existing authorized integrations cannot configure it, the only owner action should be the smallest required Meta/provider authorization; all other work continues autonomously.

## Remaining launch P0 priorities

1. Implement the real autonomous current-source discovery/acquisition worker and schedule it upstream of the #293-#295 freshness gate; then production-prove consecutive normal scheduled 5/5 days.
2. Continue targeted rights-approved local media expansion from the certified 241 baseline toward 200-500 useful assets, emphasizing exact/recent Irish/provincial subjects and recurring opponents; verify current-five assignments by production Sanity readback.
3. Verify mobile Editorial Review interaction and representative public article/homepage rendering without weakening the human publication boundary.
4. Configure/verify SOCIAL-001 downstream webhook/orchestrator if existing authorization permits; otherwise record only the minimal owner-only provider authorization blocker.

Secondary launch paths remain AUTO-002 replacement E2E, NEWS-001, secure phone-first upload, security/backup/recovery and accreditation/provider checks, but they must not displace the two dominant P0s above during Sunday recovery.

## Owner-help boundary

Routine implementation, merges, deterministic audits and clear image approvals should not require owner help. Escalate only genuinely ambiguous rights/relevance cases, unavailable external credentials/account authorization, authenticated owner-only verification, final editorial judgement and final go-live acceptance.

## Completion rule

Always distinguish implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity verified, orchestration verified, Meta verified and documentation updated. A feature is not complete until its relevant verification passes.
