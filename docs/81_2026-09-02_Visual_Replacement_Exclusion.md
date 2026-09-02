# 2 September 2026 — visual replacement exclusion recovery

## Status

Merged and deployed to the GitHub production workflow path; production verification in progress in Actions run `33693469651`.

## Production evidence that triggered the fix

Run `33682858226` proved that acquisition and generation could temporarily reach five same-day eligible drafts, but the generated All Blacks article `current-2026-09-02-7771d5b17647` had zero assignment-safe local images after targeted acquisition. The visual-recovery step correctly marked that draft ineligible. The subsequent refill then selected the same editorial input again because the candidate remained in `current-editorial-acquisition-batch.json`. That caused avoidable regeneration and left the package at 4/5 after bounded Publication Review failures.

Zoho was not called because final exact-five image verification was never reached.

## PR #371

PR #371 makes visual eviction transactional across Sanity eligibility and the current recovery candidate pool. When one image-unfulfillable draft is evicted, the same `editorialInputId` is removed from the current acquisition batch before refill and recorded in batch provenance. The operation fails closed if the package date is wrong, the batch shape is invalid, or exactly one candidate cannot be removed.

This does not relax freshness, diversity, Publication Review, Draft Ready, originality, rights, image relevance, exact-five, or exact-one Zoho controls.

## PR #372

PR #372 is the bounded recovery trigger after #371. It started production Actions run `33693469651` against merged main.

## Verification required

The fix is not closed until production evidence shows all of the following:

1. any visual eviction excludes that editorial input from the refill candidate pool;
2. refill selects a genuinely different fresh candidate;
3. exactly five review-ready drafts survive final image verification;
4. exactly one consolidated Zoho package is accepted, or the exact-package idempotency record proves it was already sent;
5. the human Sanity publication boundary remains unchanged.

If the run exposes a different P0, that blocker becomes the next recovery target without weakening the existing gates.
