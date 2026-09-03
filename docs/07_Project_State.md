# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

3 September 2026, after production recovery run `33706956178`, PR #385 production verification of the repaired visual planning/refill-diversity path, and measured fail-closed removal of weak legacy retained drafts before 3 September Zoho delivery.

## Source of truth

Read first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. newest numbered handoff/evidence documents relevant to the task
5. `docs/87_2026-09-03_Retained_Draft_Evidence_Integrity.md`
6. `docs/86_2026-09-03_Standfirst_Natural_Boundary_Repair.md`
7. `docs/85_2026-09-03_Visual_Refill_Diversity_Recheck.md`
8. `docs/84_2026-09-03_Image_Planner_Verifier_Parity.md`
9. `docs/83_2026-09-03_Visual_Eviction_Current_Batch_Absence.md`

Where older documents conflict with later measured production evidence, newer evidence wins. Chat history is not project truth.

## Operating targets

- Timezone: Europe/Dublin.
- Daily contract: exactly five fresh, review-ready production drafts plus exactly one consolidated Zoho editorial notification.
- Sanity is the canonical CMS and mandatory human publication boundary. Generated content remains draft-only until a human publishes it.
- GitHub is the versioned project source of truth.
- Batch related changes and minimise Vercel deployments.
- OpenAI spend is capped to the existing prepaid balance; do not brute-force retries.
- Meta/social is not part of the current launch recovery.
- Gmail and Google Drive are not part of the editorial path.

## Editorial contract

Articles are original multi-source Rugby Panda synthesis, not rewrites. Freshness identity is **subject + event/development + editorial angle**. New acquisition candidates require coherent corroboration, at least two substantive sources from at least two publishers, concrete named rugby evidence and at least two substantive facts before model spend.

Same-day retained drafts must also meet the current evidence floor. They are not grandfathered merely because they were generated earlier. Retained production drafts must have at least two valid source notes from two distinct publishers and still pass rugby-contamination, freshness/position and package-diversity checks.

Originality and Draft Ready checks remain deterministic and fail closed. Current hard limits are headline <=70 characters, standfirst <=220, SEO title <=60, SEO description <=160 and paragraph <=120 words, plus filler/formulaic-writing/projection safeguards.

Publication Review is mandatory before a generated draft becomes production-eligible. Post-review normalization must preserve complete prose while enforcing metadata limits; a complete sentence inside the boundary is preferred over a longer arbitrary word-boundary fragment. Deterministic Draft Ready/originality gates run again after normalization.

The package uses differentiated style profiles (`news-desk`, `analysis-led`, `feature-led`, `notebook`, `explainer`) and prohibits raw Markdown/bold-marker generation.

## Editorial automation — current measured state

### Morning package / AUTO-003 / AUTO-004

The scheduled current-source workflow consumes the source registry and runs the protected acquisition → evidence → freshness → package diversity → bounded generation → Publication Review → image planning/acquisition → visual verification → exact-package Zoho path.

Latest measured production recovery: GitHub Actions run `33706956178` on 3 September.

Evidence from that run:

- 24/24 configured current sources succeeded; 0 failed.
- 116 current leads were discovered.
- current acquisition produced 5 coherent corroborated candidates.
- concrete-evidence classification accepted 5/5.
- upstream package diversity passed with maximum two recognised same-team positions and maximum two same-matchup positions.
- PR #385's stricter image planner exposed genuine deficits instead of counting context-conflicting images as safe: only 2/5 articles initially met image-depth target, with 7 real local deficits.
- targeted acquisition/reconciliation imported additional rights-triaged Editorial Images.
- image-unfulfillable Erasmus/referee content was evicted after acquisition exhaustion.
- PR #385's post-visual-eviction diversity recheck executed in production before replacement generation: retainedCount 4, missingSlots 1, maxPerTeam 2, maxPerMatchup 2; South Africa and New Zealand were each at two.
- exactly one fresh Itoje replacement was generated; Publication Review #2 had no critical/high blockers.
- a separate retained article was then found with a visibly truncated standfirst ending `the margins around.`. It was deliberately made `morningPackageEligible=false` before final delivery.
- because the package no longer contained exactly five eligible drafts, final image assignment and Zoho delivery were skipped. This was the required fail-closed behaviour.

After the run, two additional legacy retained drafts were measured as below the current launch contract and were made ineligible in Sanity without publishing them:

1. `current-2026-09-03-ca83d5b17644` — one-source Jonah Lomu film article (Business Post Sport only).
2. `current-2026-09-03-57772ccaa5cf` — incoherent legacy fusion of the IRFU Resource Library, Caelan Doris injury, Jonah Lomu film and Mack Hansen return.

The current quality branch implements two permanent repairs before the next bounded recovery:

- preserve complete sentence boundaries when clipping over-limit standfirst/SEO metadata after Publication Review;
- enforce >=2 valid source notes from >=2 distinct publishers on retained same-day production drafts.

**3 September Zoho status: not sent.** Run `33706956178` entered with `acceptedEvidenceCount: 0` and later skipped delivery after the exact-five gate failed closed. Therefore the next successful verified package remains eligible for exactly one consolidated Zoho send.

### Package diversity

The maximum-two same-matchup gate is production-established. PR #351 adds a maximum-two recognised same-team limit independent of matchup. PR #385 reuses the same canonical diversity component again after visual eviction and before replacement model spend so visual recovery cannot introduce a third same-team/same-matchup position.

AUTO-004-P16 is production-verified by run `33706956178`.

### Resilience / AUTO-005

- Preserve valid same-day drafts; regenerate only missing/evicted slots.
- Revalidate retained drafts against current evidence integrity rather than blindly trusting prior eligibility.
- Evidence insufficiency, freshness collisions, package concentration and image impossibility fail closed before avoidable model spend where possible.
- Deterministic presentation repairs are preferred for mechanical problems.
- Publication Review corrections are re-normalized through the same hard Draft Ready/originality boundaries.
- Production generation remains GPT-5; retries remain bounded.

### Rejection / replacement / AUTO-002

The application rejection/replacement endpoint requires a genuinely different source/angle and normal quality gates. End-to-end human rejection replacement remains blocked because `EDITORIAL_REPLACEMENT_WEBHOOK_URL` is absent in production. Do not reject a live draft merely to reproduce that known infrastructure gap. The autonomous current-source same-day recovery is a separate bounded path.

## Image contract and certified media state

Automatic image assignment is relevance-first and fail closed. Prefer current exact-subject photography, then useful recent team/event/venue material, then relevant historical/context, then an approved relevant logo where appropriate; otherwise no image.

Third-party assets require rights metadata and local Sanity storage. External URLs do not count toward the usable library.

Hard image-context rules include:

- explicit named people in the image must be present in the article;
- recognised image teams must not introduce a conflicting extra team context;
- canonical aliases are equivalent: All Blacks/New Zealand, Springboks/South Africa, Wallabies/Australia, Pumas/Argentina;
- women/men context conflicts fail closed;
- package/body asset dedupe remains mandatory.

The image planner and final verifier must enforce the same hard person/team/event semantics. PR #385 is merged and production READY at Vercel deployment `dpl_8WQfBPeSGGjf5K1FJkLMXLTJnr9G`; run `33706956178` production-exercised the repaired planner and visual-refill diversity path.

**Current measured strict publication-ready local Editorial Image baseline: 354** after run `33706956178`.

MEDIA-011 remains an operating coverage-depth target (three strong local candidates per article where possible), not a mandate to force image placement. Final exact-five 3 September hero/inline verification is still pending.

## Brand Asset state

Brand marks are governed separately from Editorial Images. Public components may use only approved local Brand Assets and must fall back to text when a defensible mark is unavailable.

Latest measured localization remains 24 approved Brand Assets, 17 local-ready, with 7 manual-source gaps. South Africa/New Zealand, Leinster, Munster and EPCR have approved local assets. Connacht remains a text-fallback case until a proper reviewed source exists. These remaining brand gaps are not the current morning-package P0.

## Morning delivery / exact-one contract

Zoho is a delivery boundary, not an editorial selector. It may send only when there are exactly five current-date production-eligible drafts with five unique article IDs, five unique editorial input IDs and verified hero boundaries.

A Sanity lock keyed to operational date + exact package fingerprint prevents duplicate SMTP delivery.

Production proof from 1 September remains valid: exact five accepted by Zoho with SMTP `250 Message received`, exact IDs recorded, and immediate rerun duplicate-suppressed.

For 3 September, **no Zoho acceptance exists yet**. The latest recovery deliberately failed closed before delivery after quality problems were found in retained drafts.

## Editorial Review / human publication boundary

Sanity Studio defaults Editorial Review to `Today's package` and keeps historical drafts under `Other drafts`. Generated/acquired material remains draft-only. Do not publish content merely to manufacture evidence.

## Public presentation

Content-led article variants, homepage hierarchy, contextual cards, responsive mobile Editorial Review and approved local brand rendering are deployed foundations. Representative public article/homepage verification still requires genuinely human-approved published content. Final authenticated phone interaction remains separately tracked.

## Social distribution

Social is explicitly excluded from the current launch recovery. Only a successful controlled human publish action may eventually emit a downstream social event, and Meta provider authorization remains externally blocked. No Meta/social work should be performed while the morning-package P0 is open.

## Current launch gate — 3 September 2026

The next bounded recovery must prove all of the following before LAUNCH-001 can be declared successful:

1. the post-review complete-sentence clipping repair is merged, deployed and exercised by fresh generation;
2. retained one-source legacy content cannot count toward the package;
3. the deliberately excluded weak/truncated legacy slots are refilled only from current fresh evidence-sufficient candidates;
4. exactly five current drafts pass Publication Review, deterministic gates and max-two team/matchup diversity;
5. all five receive final-verifier-safe relevant heroes/inline images;
6. exactly one consolidated Zoho package is accepted for those exact five IDs;
7. no article is automatically published;
8. Meta/social remains untouched.