# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

25 August 2026, after production verification of the five-article morning package, exactly-once consolidated Zoho delivery, the strict 200-local-image floor, and the first controlled lower-cost model benchmark.

## Source of truth

Read first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/51_2026-08-25_Go_Live_Production_Verification.md`
5. `docs/49_2026-08-24_Monday_Go_Live_Reconciliation.md`
6. `docs/44_2026-08-20_Owner_Priorities.md`
7. all newer numbered handoff/evidence documents relevant to the task.

Where older documents conflict with later measured evidence, the newer reconciled evidence wins. Do not use chat history as project truth.

## Operating targets

- Timezone: Europe/Dublin.
- Core readiness target: 26 August 2026.
- Meaningful go-live target: 27 August 2026.
- Daily contract: five review-ready production drafts plus exactly one consolidated editorial notification before 08:00.
- Sanity is the canonical CMS and mandatory human publication boundary.
- GitHub is the versioned project source of truth.
- Batch related changes and minimise Vercel deployments.
- OpenAI spend is capped to the existing prepaid balance until cheaper alternatives are evidenced; no automatic production model/provider switch is authorised.
- Steady-state AI cost target: below USD $10/month if equivalent editorial quality can be proven.

## Editorial contract

Articles are original multi-source Rugby Panda synthesis, not rewrites. Originality and Draft Ready checks remain deterministic and fail-closed. Current hard limits are headline <=70 characters, standfirst <=220, SEO title <=60, SEO description <=160 and paragraph <=120 words, plus filler/formulaic-writing/projection safeguards.

Generated article strings are structured content, not Markdown. Raw/escaped Markdown markers and generic formula headings are not Draft Ready. Articles start with the story itself. Package generation allocates one each of `news-desk`, `analysis-led`, `feature-led`, `notebook`, `explainer`.

Cost-efficient recovery now preserves accepted package positions and regenerates only missing positions. Mechanical presentation problems are repaired deterministically before spending another full-generation call; Publication Review corrections are normalized through the same hard Draft Ready boundaries before final gates. Gates were not weakened to achieve the 25 August package.

## Editorial automation — verified state

### Morning package / AUTO-003 / AUTO-004

- A genuine five-position production package was achieved on 25 August after bounded recovery attempts reused already-accepted drafts rather than regenerating the whole package.
- Final Ulster recovery passed generation, deterministic originality, Draft Ready and Publication Review #2 and created a production-eligible Sanity draft.
- Individual morning draft notifications were suppressed.
- #261 merged/deployed the current-main direct Zoho package route and persistent schedules.
- Acquisition/generation schedule: **06:30 Europe/Dublin**.
- Consolidated package delivery schedule: **07:45 Europe/Dublin**.
- #263 production trigger returned HTTP 200 with `articleCount: 5` and Zoho SMTP `250 Message received`; delivery evidence was persisted in Sanity.
- #265 re-triggered the identical package and returned `already-sent` for the same event/completion evidence without issuing a second SMTP send.
- Therefore the exactly-one five-article morning delivery contract is production-verified. Gmail is not part of the Rugby Panda editorial path.

### Resilience / AUTO-005

- Accepted package positions are reusable by candidate ID.
- Metadata-only misses no longer justify a whole-article GPT-5 retry when they can be repaired at safe sentence/word boundaries.
- Publication Review corrections are re-normalized for metadata and <=120-word paragraph constraints before final deterministic gates.
- Root-cause fixes were preferred to brute-force regeneration throughout 25 August recovery.

### Rejection / replacement

- #202 still emits an immediate replacement-acquisition event on rejection.
- `/api/editorial/replacement` rejects identical source sets and repeated editorial angles and requires the replacement to pass normal generation gates.
- End-to-end production proof of rejection -> genuinely different replacement remains open; do not call AUTO-002 complete yet.

## AI FinOps / model benchmark

- Production generation remains on the configured GPT-5 model unless evidence supports a safe change.
- A controlled canonical-package GPT-5-mini benchmark was started 25 August using the same five evidence packs, style allocation, deterministic Draft Ready/originality gates and Publication Review cycle, with no Sanity persistence.
- Early measured mini samples passed generation/originality/Draft Ready on first generation attempts but frequently required Publication Review correction; editorial-quality equivalence is not yet established.
- Gemini Flash pricing is potentially attractive, but no usable Gemini/Google AI API integration or credential is exposed in the current project integrations. No Gemini result may be claimed until a real controlled run exists.
- Temporary benchmark infrastructure must be removed after evidence capture.

## Image contract and certified media state

Automatic image assignment is relevance-first and fail-closed. Prefer current subject-specific photography, then useful relevant historical/context/venue material, then an approved relevant logo where appropriate; otherwise no image. Never substitute unrelated generic imagery merely to fill a slot.

Third-party assets require rights metadata and **local Sanity storage**; external URLs do not count toward the launch floor. The 25 August audit corrected the older permissive interpretation that could treat an external image URL as renderable.

**Production certification on 25 August: 200 local Editorial Images, 200 strict publication-ready, 200 approved/published publication-ready, gap to target 0, zero duplicate Sanity asset groups.** MEDIA-007 is closed. Broad Openverse/Apify acquisition remains rejected; exact-subject Wikimedia Commons plus local ingestion is the current external route.

Semantic assignment / inline-image work still requires representative production visual inspection before MEDIA-009/CMS-002 can close.

## Public website presentation

- #229: content-led article treatments for news, analysis, feature, notebook and explainer are merged/deployed.
- #230: editorial homepage hierarchy is merged/deployed.
- #241: contextual editorial data-card support merged and deployed.
- Inline Portable Text images and semantic image work exist in the deployed code path, but representative production desktop/mobile visual proof remains required.
- Do not publish review drafts merely to manufacture visual evidence; the human publication boundary remains mandatory.

## Remaining launch priorities

1. Complete and document the controlled cost benchmark; remove temporary benchmark infrastructure; keep production model unchanged until quality evidence supports a switch.
2. Production-prove rejection -> genuinely different replacement end-to-end (AUTO-002).
3. Production-verify article/homepage/inline-image presentation on desktop/mobile using human-approved published content.
4. Finish/verify automatic Facebook and Instagram snippets after controlled publication.
5. Finish/verify secure phone-first image upload.
6. Implement/verify the 14:00 major-announcement conditional check.
7. Complete authenticated Sanity edit/save/reload verification where technically possible.
8. Complete remaining security, backup/recovery and accreditation/provider checks.
9. Complete final editorial review and go-live acceptance.

## Owner-help boundary

Routine implementation, merges, deterministic audits and clear image approvals should not require owner help. Escalate only genuinely ambiguous rights/relevance cases, unavailable external credentials/account authorization, authenticated owner-only verification, final editorial judgement and final go-live acceptance.

## Completion rule

Always distinguish implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity verified, orchestration verified, Meta verified and documentation updated. A feature is not complete until its relevant verification passes.
