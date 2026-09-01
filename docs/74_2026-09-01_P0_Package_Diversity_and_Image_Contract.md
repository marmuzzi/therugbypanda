# P0 — package diversity and image-plan verification contract

Date: 1 September 2026
Issues: AUTO-004-P13, MEDIA-009
Priority: Critical
Status: Closed — implemented in PR #342, merged, deployed and production verified

## Measured production defects

Scheduled production run `33496840452` correctly retained five same-day eligible drafts and spent no additional GPT calls, but it failed before Zoho during exact-package visual enrichment.

The image planner reported 15 local candidates and zero deficit (three per article), yet the final verifier rejected the Dundalk/Tommy Campbell article because none of its planned candidates survived the stricter named-person safety rule. This meant the workflow believed acquisition was unnecessary and never entered its existing visual-deficit replacement path.

The same retained package was also editorially over-concentrated: four of five positions were built around the South Africa/Springboks vs New Zealand/All Blacks matchup. The positions were technically distinct, but the package lacked acceptable five-story newsroom breadth.

## Root causes

1. **Image contract mismatch:** `plan-daily-article-images.mjs` did not apply the final verifier's hard rule that an image naming a person absent from the article must be rejected.
2. **Package breadth gap:** freshness protected against repeated editorial positions but did not cap multiple distinct angles around the same two-team matchup inside one five-story package. Same-day retention could therefore preserve an over-clustered package without another model call.

## Fix

PR #342:

- aligns the daily image planner with the final named-person verifier, so false-positive image candidates become real deficits before enrichment;
- adds `scripts/enforce-current-package-diversity.mjs` before generation;
- caps the five-story package at two retained/generated stories for the same canonical two-team matchup;
- evicts only excess same-day retained drafts and removes over-cap replacement candidates before GPT spend;
- preserves unaffected valid drafts and the bounded incremental recovery model;
- leaves image assignment and Zoho fail-closed: exactly five fresh eligible drafts must still pass exact-package visual verification before one consolidated email can be sent.

## Production acceptance — passed

Production recovery run `33505534217` proved the full acceptance boundary after #342 deployed:

1. excess South Africa/New Zealand retained drafts were removed from morning eligibility while unaffected drafts remained preserved;
2. only missing slots were generated from fresh, evidence-sufficient candidates outside the capped matchup cluster;
3. the Dundalk/Tommy Campbell article remained image-unfulfillable after targeted acquisition, was evicted, and only that slot was replaced;
4. 21 rights-triaged local assets were imported with zero failures, raising the strict local publication-ready baseline from 241 to 262;
5. the final exact five each had three strong local candidates and passed hero/inline Sanity readback with no unrelated named-person imagery or duplicate package assets;
6. PR #344 then allowed Zoho to hand off those exact verified five without re-selecting them, and SMTP returned `250 Message received`;
7. an immediate rerun detected accepted delivery evidence and skipped acquisition, generation, images and email, proving no duplicate resend;
8. the final acceptance rerun retained all five and created zero drafts, so no unnecessary whole-package GPT regeneration occurred.

Resolution date: 2026-09-01.
