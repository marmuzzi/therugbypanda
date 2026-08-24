# Publishing Workflow

Sanity Studio is the canonical CMS and mandatory human approval/publication boundary.

## Session startup

Read `docs/07_Project_State.md`, `docs/08_Issue_Log.md`, this file, `docs/49_2026-08-24_Monday_Go_Live_Reconciliation.md`, `docs/44_2026-08-20_Owner_Priorities.md`, `docs/48_2026-08-22_Weekend_Go_Live_Continuation.md` and any newer relevant handoff/evidence documents. Check GitHub, Vercel and available project connectors before asking the owner to configure anything. Use Europe/Dublin for schedules.

## Completion and deployment discipline

Always distinguish implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity verified, orchestration verified, Meta verified and documentation updated. Batch related changes and minimise unnecessary Vercel deployments.

## Editorial flow

```text
persistent scheduled acquisition
→ multi-source evidence pack
→ Editorial Brain / fact ledger
→ original structured generation
→ deterministic originality + Draft Ready gates
→ subject-relevant rights-approved image or no image
→ Sanity draft
→ human review/edit
→ publish or reject
→ public website
→ controlled social distribution after publication
```

Generated content and acquired images are never automatically published.

## Draft Ready and originality

Generation uses validated evidence/fact-ledger material rather than source prose. Source material remains available to the deterministic originality guard. Originality remains fail-closed.

Draft Ready limits: headline <=70 characters, standfirst <=220, SEO title <=60, SEO description <=160, paragraph <=120 words, plus filler/formulaic-writing and qualified-projection safeguards. Metadata-only failures may use the bounded #219 repair path; the accepted body is preserved, only failing metadata fields are repaired, and the complete output must rerun both originality and Draft Ready checks.

The five-story package should allocate one each of `news-desk`, `analysis-led`, `feature-led`, `notebook`, `explainer` and must remain genuinely varied in voice/structure.

Women's rugby and other underrepresented/non-core rugby coverage is welcome but should normally total no more than 3-4 stories per week unless major news warrants more.

## Morning package

Required daily behaviour:

1. persistent acquisition/generation runs early enough to finish before 08:00 Europe/Dublin;
2. five distinct production-eligible Draft Ready drafts exist in Sanity;
3. individual draft notifications are suppressed for the morning batch;
4. exactly one consolidated editorial notification is emitted to the configured Zoho editorial recipient;
5. incomplete/failing batches raise a technical failure rather than silently sending nothing or substituting QA content.

The persistent schedule itself is still missing and must be implemented/verified. Do not use Gmail for Rugby Panda editorial verification.

## Rejection and replacement

A rejection must immediately request a replacement rather than waiting for the next morning. #202 emits the replacement-acquisition event after the rejection transition. The persistent orchestrator must consume it and supply `/api/editorial/replacement` with a genuinely different eligible source set and editorial angle. The replacement must pass the same originality, Draft Ready and image safeguards and replenish the review queue. End-to-end production verification remains required.

## Images

Only rights-reviewed, usage-approved local Sanity assets are eligible for automatic assignment. Assignment is relevance-first and fail-closed.

Priority order: strong current subject-specific image; relevant recent event/player/team/venue image; useful relevant historical/contextual image; approved relevant logo where appropriate; otherwise no image. Never use an unrelated fallback.

The majority of the library should be current/previous season. Maintain broad coverage across Leinster, Munster, Ulster, Connacht, Ireland, URC, Six Nations, European clubs, internationals, players/coaches and venues. Cap per event/player/team/scope so one collection cannot dominate. Assistant handles >=95% of clear approve/reject decisions; owner escalation target <=5%.

Wikimedia Commons exact-subject discovery is the current primary external route. Preserve creator/licence/date/source metadata, deduplicate, triage before import, store approved originals locally in Sanity, reconcile publication metadata and audit readiness. Candidate URLs do not count toward the launch floor. Do not scale the failed broad Openverse/Apify pattern.

Last certified strict audit before the #228 retrigger: 186 publication-ready local Editorial Images, 196 approved/published local Editorial Images, zero duplicate Sanity asset groups. Launch floor: 200 publication-ready Editorial Images.

## Public presentation

Article and homepage presentation should express editorial meaning rather than arbitrary randomness. #229 provides content-led article treatments for news, analysis, feature, notebook and explainer. #230 provides homepage hierarchy with lead, spotlight, compact news, province and analysis/notebook treatments. Homepage cards must use the canonical article featured image only; no unrelated visual fallback.

Verify representative desktop/mobile article layouts and a multi-story homepage in production before closing presentation work.

## Social, mobile upload and major-news check

- SOCIAL-001: after controlled website publication, send image-backed snippets to Facebook/Instagram with idempotency/retry safeguards; production Meta verification remains required.
- MEDIA-004: secure phone-first photo upload remains to be implemented/verified.
- 14:00 major-announcement check: implement a conditional daily check that creates an extra article only when a genuinely significant rugby announcement warrants it.

## Current verification boundary — 24 August 2026

Merged foundations include #195-#230 as documented in `docs/49_2026-08-24_Monday_Go_Live_Reconciliation.md`. Remaining hard proofs are: >=200 publication-ready images; 5/5 AUTO-004 production package; rejection-to-replacement end-to-end; persistent 08:00 orchestration; representative article/homepage production visuals; authenticated Sanity body editing; Meta social publication; phone upload; 14:00 conditional check.
