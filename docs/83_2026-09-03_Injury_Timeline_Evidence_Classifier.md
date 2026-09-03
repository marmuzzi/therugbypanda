# 3 September 2026 — injury-timeline evidence classifier recovery

## Status

Implemented on branch `fix/auto004-injury-timeline-classifier`. Production verification is pending until the change is merged, deployed and a bounded current-source recovery proves the full exact-five/image/Zoho contract.

## Measured trigger

Production Actions run `33699245112`, triggered after PR #379/#380, improved acquisition coherence materially: 24/24 registry sources succeeded, discovery returned 118 leads, the coherent corroboration bridge produced exactly five cross-source candidates, and four passed the concrete-evidence gate.

The fifth candidate was the Caelan Doris injury/recovery update, titled `Caelan Doris to miss start of Leinster’s season as Ireland captain faces race to be fit for Nations Championship finale`. The gate classified it as match-like solely because `MATCHISH` treated the generic word `start` as a selection signal. The evidence itself had two independent publishers, two distinct substantive facts, named-person evidence and concrete rugby/timeline markers. The workflow therefore failed closed at 4/5 before model spend. No image steps or Zoho delivery were reached.

## Root cause

`MATCHISH` contained `starts?`, which conflated two different meanings:

- timeline/recovery language such as `miss the start of the season`;
- genuine selection language such as `starts at fly-half`, `starts in the side`, or a `starting XV`.

That false positive imposed a match-specific date/score/venue/Test-context requirement on a non-match injury story.

## Fix

The classifier now keeps the existing explicit match/fixture/selection signals but narrows `start` handling to selection-shaped expressions only:

- `starting XV`, `starting line-up` / `lineup`;
- `starts at ...`;
- `starts in the team/side/XV`;
- `starts on the bench`.

A phrase such as `start of the season` no longer makes a story match-like. Genuine match/selection stories still require match context and remain fail-closed.

No freshness, evidence depth, same-package diversity, originality, Publication Review, image relevance/rights, exact-five identity, exact-one Zoho delivery or human Sanity publication boundary is relaxed.

## Verification required

A bounded production recovery must show that the coherent five-candidate batch can pass pre-generation evidence classification and proceed through generation, Publication Review, strict image verification and exactly one Zoho package (`sent` or an evidence-backed idempotent `already-sent`). If a new downstream blocker appears, it becomes the next P0 immediately.
