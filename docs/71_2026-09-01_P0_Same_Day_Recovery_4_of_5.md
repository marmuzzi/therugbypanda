# P0 — Same-day recovery reached 4/5

Date: 1 September 2026
Issue: AUTO-004-P10
Priority: P0 / Critical
Status: Implemented fix; pending production verification

## Production evidence

Bounded production recovery run `33451942291` proved the same-day retention contract against production Sanity.

- Two already successful 1 September drafts were retained rather than regenerated.
- The package correctly reported `retainedCount: 2` and `missingSlots: 3`.
- Five fresh replacement-capable candidates were available for the three missing slots.
- Two additional drafts passed generation and Publication Review, taking the package to **4/5**.
- The remaining package failed closed; image enrichment and Zoho were skipped.
- No stale or partial email was sent.

Retained drafts included:

1. `current-2026-09-01-930d0d48bc05` — “Erasmus pushes back at All Blacks scrum accusation as Boks tweak”.
2. `current-2026-09-01-1df6f8baaaf3` — “Kolbe to 15 sharpens All Blacks selector Jason Ryan’s pack calls”.

## Remaining measured failure

One otherwise viable feature-led candidate was rejected by Publication Review #2 solely because it contained the generic heading **“What to watch in the third Test”**.

The deterministic heading guard already removed variants ending in “next”, but did not recognise the broader generic construction `What to watch in ...`. Because the post-correction presentation repair uses that guard, the heading survived into Publication Review #2.

Two other rejected candidates still lacked sufficient match-specific facts despite passing the broader evidence gate. They remain rejected; no editorial gate is weakened to use them.

## Fix

`DraftQualityGuard.isFormulaicHeading()` now recognises broader `What to watch/look for/expect ...` constructions, including `in`, `for`, `from`, `against`, `during`, `at`, `this` and `the` variants. The existing deterministic presentation repair will therefore remove those generic headings before the final Publication Review rather than spending another package attempt on a known formatting defect.

## Cost-control boundary

The next recovery must preserve the four successful same-day drafts and fill only one missing slot. The importer is already bounded to the missing slot plus at most two replacement candidates, with generation concurrency capped at two and retry limited to transient timeout/abort failures.

## Acceptance

This issue is not closed until production proves:

1. `retainedCount: 4`, `missingSlots: 1`;
2. exactly one additional fresh eligible draft completes the five-story package;
3. exact-package image planning/acquisition/assignment/readback succeeds for all five;
4. only then does Zoho send the exact five;
5. no stale or partial package is delivered.

Resolution date: pending production verification.
