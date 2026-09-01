# P0 — bounded same-day visual-deficit substitution

Date: 1 September 2026
Issue: MEDIA-011-P5
Priority: Critical
Status: Implemented; pending production verification

## Measured defect

Production run `33455111371` preserved all five accepted 1 September drafts with zero new article-generation calls and correctly identified the Leinster U-18 Girls story as the only article with a three-image local deficit. Targeted Wikimedia discovery returned three apparent candidates, but inspection showed all three were 2007 Molly Malone statue photographs. The discovery layer had treated the generic word `women` in the description as positive rugby subject evidence; strict triage correctly rejected them.

A single image-unfulfillable story could therefore block an otherwise valid five-story package indefinitely even after targeted rights-safe acquisition was exhausted.

## Fix

1. Wikimedia discovery now emits explicit `subjectEvidence` and requires positive primary-team evidence plus rugby/gender proximity for women/girls stories. Generic prose containing `women` no longer counts.
2. Daily triage is allowed to fail closed without aborting the whole recovery path; no rejected image is imported.
3. After targeted acquisition and re-planning, if an exact current-package draft still has a visual deficit, one and only one worst-deficit draft is removed from morning-package eligibility.
4. The other four accepted drafts are preserved.
5. The existing incremental importer fills only that single newly missing slot from fresh, corroborated, evidence-sufficient candidates.
6. A second bounded targeted image-acquisition pass is allowed for the replacement.
7. Exact-five hero/inline assignment and Sanity readback still gate Zoho. No partial/stale email is permitted.

This turns image availability into a first-class launch gate without forcing filler imagery or repeatedly regenerating already-good articles.

## Cost boundary

The visual recovery is capped at one article substitution per execution. Existing accepted drafts remain preserved. If the replacement also cannot obtain assignment-safe imagery after the second targeted acquisition pass, the package fails closed rather than looping or repeatedly spending on GPT-5.

## Acceptance

Production verification must prove that the U-18 Girls draft is either supplied with genuinely relevant rights-safe imagery or is replaced once, the remaining four are preserved, exactly five current-package drafts pass image assignment/readback, and only then Zoho sends.

Resolution date: pending production verification.
