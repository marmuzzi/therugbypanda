# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

24 August 2026, after the weekend media expansion, PRs #228-#232, and the owner editorial/image review that identified escaped Markdown and incorrect/duplicate image assignments.

## Source of truth

Read first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/49_2026-08-24_Monday_Go_Live_Reconciliation.md`
5. `docs/44_2026-08-20_Owner_Priorities.md`
6. `docs/48_2026-08-22_Weekend_Go_Live_Continuation.md`
7. all newer numbered handoff/evidence documents relevant to the task.

Where older documents conflict with later measured evidence, the newer reconciled evidence wins. Do not use chat history as project truth.

## Operating targets

- Timezone: Europe/Dublin.
- Core readiness target: 26 August 2026.
- Meaningful go-live target: 27 August 2026.
- Daily target: five review-ready production drafts plus exactly one consolidated editorial notification by 08:00.
- Sanity is the canonical CMS and mandatory human publication boundary.
- GitHub is the versioned project source of truth.
- Batch related changes and minimise Vercel deployments.

## Editorial contract

Articles are original multi-source Rugby Panda synthesis, not rewrites. Originality and Draft Ready checks are deterministic and fail-closed. Current Draft Ready limits are headline <=70 characters, standfirst <=220, SEO title <=60, SEO description <=160 and paragraph <=120 words, with filler/formulaic-writing/projection safeguards.

Generated article strings are structured content, not Markdown. Raw/escaped Markdown markers and generic formula headings such as “Why this matters now” / “What happens next” are not Draft Ready. Articles must start with the story itself; section headings must be story-specific and optional.

Package generation uses five distinct style profiles: `news-desk`, `analysis-led`, `feature-led`, `notebook`, `explainer`. Women's rugby and other underrepresented/non-core rugby coverage is welcome but should normally total no more than 3-4 articles per week unless major news warrants more.

## Editorial automation — current state

- #195: evidence-led generation; source prose withheld from generation but retained for originality checking.
- #196: targeted overlap feedback and package-level one-of-each style allocation.
- #197: Draft Ready standard merged/deployed.
- #199: route max duration 240s; generation budget 220s; three attempts retained.
- #202: rejection emits immediate replacement-acquisition event; end-to-end persistent-orchestrator proof still pending.
- #219: metadata-only Draft Ready repair merged/deployed; originality-passing body is preserved and repaired complete output must pass both gates.
- #220: controlled five-story verification trigger merged; a new hard 5/5 production result is still required before AUTO-004 closes.
- #232: Newsroom Dashboard edit-intent navigation fixed and deployed; authenticated owner edit/save/reload verification remains required.
- Current `fix/editorial-quality-image-assignment` branch / PR #233: removes formulaic Markdown-style generation cues, makes escaped/raw Markdown and generic headings fail Draft Ready, tightens semantic image selection, reserves images across the morning package and adds up to three exact-subject inline images with public rendering support. Preview verification is required before merge; fresh five-story production proof is required after deployment.

The 08:00 persistent schedule was never implemented. AUTO-003 remains a missing go-live feature, not a regression. Required behaviour is five eligible drafts and one consolidated notification by 08:00 Europe/Dublin, with visible technical failure rather than silence when the package cannot be produced.

## Image contract and current media state

Automatic image assignment is relevance-first and fail-closed. Prefer current subject-specific photography, then useful relevant historical/context/venue material, then an approved relevant logo where appropriate; otherwise use no image. Never substitute unrelated generic imagery merely to fill a slot.

Positive evidence must come from descriptive image metadata or an exact named subject materially discussed in the article; broad category tags alone are insufficient. Women's stories require women/female context for generic Ireland imagery unless an exact named subject is matched. Recently used images in the current morning package are reserved so the same asset is not assigned to multiple stories. Multi-subject stories may use up to three distinct exact-subject inline images placed near the relevant discussion.

The majority of the library should be current season or immediately previous season. Broad diversity is mandatory across provinces, Ireland, URC, Six Nations, European clubs, internationals, players/coaches and venues. Per-event/player/team/scope caps prevent one match or collection dominating. Assistant handles >=95% of clear approve/reject decisions; owner escalation target is <=5%. Third-party public assets require rights metadata and local Sanity storage; no hotlinking.

The broad Openverse/Apify pattern measured on 20 August had zero useful yield and must not be scaled. Wikimedia Commons exact-subject acquisition replaced it through #201 onward.

Merged #201-#228 provide precision discovery, strict assistant triage, local Sanity ingestion, readiness reconciliation, deduplication, recency/diversity controls and targeted provincial/European/URC/international waves.

**Last certified strict production audit: 186 publication-ready local Editorial Images; 196 approved/published local Editorial Images; zero duplicate Sanity asset groups. Certified gap to the 200 Editorial Image floor: 14.** #228 merged 24 August to retrigger corrected URC and international waves. Do not claim a higher number until post-import audit evidence lands.

## Public website presentation

- #229 merged/deployed 24 August: article presentation is content-led rather than slug-hash random, with news, analysis, feature, notebook and explainer treatments.
- #230 merged/deployed 24 August: homepage has editorial hierarchy (lead, spotlights, compact news wire, province module and analysis/notebook treatment) plus reusable card variants. It removes ArticleCard's unrelated fallback-photo behaviour.
- PR #233 adds responsive Portable Text inline-image rendering with caption/credit support and defensive cleanup for legacy escaped Markdown.
- Representative production visual verification remains required, especially with enough published articles to exercise the multi-story homepage and inline-image treatment.

## Remaining launch priorities

1. Merge/deploy/verify PR #233, then rerun a clean five-story package and inspect formatting + all image assignments together.
2. Reach and certify >=200 publication-ready local Editorial Images without weakening relevance, rights, recency or diversity.
3. Obtain a hard 5/5 AUTO-004 production batch: Draft Ready, originality pass, five distinct styles, correct Sanity drafts, no Markdown/formulaic headings, semantically relevant unique images or no image.
4. Production-verify immediate rejection -> genuinely different replacement end-to-end.
5. Implement and verify persistent 08:00 morning orchestration and one consolidated Zoho editorial notification; do not use Gmail.
6. Production-verify #229/#230/#233 article/homepage/inline-image presentation on desktop and mobile.
7. Finish/verify automatic Facebook and Instagram snippets after publication.
8. Finish/verify secure phone-first image upload.
9. Implement/verify the 14:00 major-announcement conditional check.
10. Complete authenticated Sanity body edit/save/reload verification.
11. Complete remaining launch/security/accreditation checks and reviewed launch content.

## Owner-help boundary

Routine implementation, GitHub merges and clear image approvals should not require the owner. Escalate only genuinely ambiguous image rights/relevance cases, unavailable external credentials/account authorization, authenticated owner verification steps, final editorial approval, or final go-live acceptance.

## Completion rule

Always distinguish implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity verified, orchestration verified, Meta verified and documentation updated. A feature is not complete until its relevant verification passes.
