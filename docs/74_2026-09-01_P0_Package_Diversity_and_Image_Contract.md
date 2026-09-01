# P0 — package diversity and image-plan verification contract

Date: 1 September 2026
Issues: AUTO-004-P13, MEDIA-009
Priority: Critical
Status: Implemented in PR #342; pending merge/deployment/production verification

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

## Production acceptance

After merge, the production recovery run must prove:

1. excess South Africa/New Zealand retained drafts are removed from morning eligibility while unaffected drafts remain preserved;
2. only missing slots are generated from fresh, evidence-sufficient candidates outside the capped matchup cluster;
3. the Dundalk article either obtains genuinely valid rights-approved visual candidates or is replaced through the existing bounded visual-substitution path;
4. the final exact five pass hero/inline Sanity readback with no unrelated named-person imagery or duplicated package assets;
5. Zoho sends only the exact verified five, with no stale or partial package;
6. no unnecessary whole-package GPT regeneration occurs.

Resolution date: pending production verification.
