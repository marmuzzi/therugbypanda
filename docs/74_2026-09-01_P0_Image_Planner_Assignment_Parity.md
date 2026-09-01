# P0 — image planner / assignment relevance parity

Date: 1 September 2026
Issue: MEDIA-011-P4
Priority: Critical
Status: Implemented; pending production verification

## Measured production defect

Recovery run `33454269795` correctly reached five same-day eligible drafts and evicted the contaminated Scarlets–Sharks story, but failed before Zoho in exact-package visual assignment. The image planner reported 15 local candidates / zero deficit while the assignment stage could not find a meaningful inline image for the new Tommy Campbell/Dundalk story.

Artifact inspection showed the planner was materially over-counting relevance. It still admitted the exact user-reported Limerick derelict-building image into an All Blacks story because its metadata happened to contain “New Zealand”, and admitted Thomond/Munster images for the Leinster U-18 Girls story. Those candidates must not satisfy MEDIA-011 depth.

## Root cause

The planning stage used a looser article-level token/team score than the final assignment stage. It therefore marked three candidates per story as available even when they could not safely support a story paragraph. Province/venue conflicts and women/girls evidence were also not enforced consistently across both stages.

## Fix

`plan-daily-article-images.mjs` now:

- evaluates the article body as well as title/standfirst;
- rejects explicit non-rugby visual metadata including the measured Limerick derelict-building case;
- rejects cross-province venue/context conflicts (for example Thomond/Limerick for a Leinster story);
- requires explicit women/girls/female metadata for women/girls stories;
- requires every counted candidate to be plausibly usable as an inline image against at least one actual paragraph;
- raises the plan threshold so weak token coincidences do not count toward the three-candidate target;
- emits targeted women/girls acquisition queries when the local library is deficient.

`enrich-current-morning-visuals.mjs` now applies the same hard context checks before hero/inline assignment as defense in depth.

## Acceptance

A production recovery must prove:

1. the five valid 1 September drafts are preserved without new article-model spend where already complete;
2. the Limerick derelict-building image is not a candidate or assignment for any All Blacks/New Zealand story;
3. Thomond/Munster imagery is not used for Leinster U-18 Girls;
4. unsafe local candidates become explicit deficits and trigger only targeted acquisition;
5. all exact five articles receive a verified relevant hero plus at least one meaningful inline image, or the run fails closed;
6. Zoho sends only after that exact five-image readback passes.

Resolution date: pending production verification.
