# Evidence-only generation verification

Generation now receives the validated fact ledger and source provenance only. Source excerpts and body text remain available to the deterministic originality checker but are deliberately withheld from the generation prompt to reduce source-shaped phrasing without weakening the originality thresholds.

The controlled AUTO-004 importer now processes every candidate before returning a failed batch status, allowing all five stories to be inspected even when one draft is rejected.

Verification required before closure:

- Vercel preview/build READY.
- Merge to `main` and production deployment READY.
- Rerun `data/editorial-acquisition/auto004-2026-08-18-independent.json`.
- Confirm originality remains fail-closed before Sanity writes.
- Confirm all five story outcomes are reported in one run.
- Inspect successful drafts side-by-side for headline, opening, paragraph rhythm, subheadings, structure, conclusion and layout.
- Confirm province/Ireland image relevance resolves unrelated approved imagery to no image.
