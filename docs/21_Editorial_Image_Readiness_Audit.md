# Editorial Image Readiness Audit

## Status

Implemented, merged in PR #38, deployed and verified through GitHub Actions on 12 July 2026.

Workflow run:

- `29208191194`
- artifact: `editorial-image-readiness-audit`

## Purpose

The Editorial Image Readiness Audit is the first reusable automation in Sprint 5. It provides a non-destructive quality gate before approved Editorial Images are assigned to articles or used in public publishing workflows.

The audit reads Editorial Image records from Sanity and reports:

- missing publication metadata
- inconsistent lifecycle and approval states
- incorrect public credit or copyright values for Rugby Panda originals
- missing source/licence information for external images
- records without a renderable image reference
- duplicate Sanity asset references
- duplicate imported/source URL references

The audit never mutates Sanity records.

## Files

- `scripts/audit-editorial-image-readiness.mjs`
- `.github/workflows/audit-editorial-image-readiness.yml`
- `package.json` script: `npm run media:audit-readiness`

## Verified production result

The first production audit reported:

- Total records: 40
- Publication ready: 22
- Needs attention: 18
- Approved or published: 34
- Approved/published but not ready: 12
- Duplicate asset groups: 0
- Duplicate source groups: 2

The repeated metadata gap was missing:

- alt text
- caption
- public credit
- copyright line

The two duplicate source groups were draft/published document pairs rather than duplicate Sanity image assets.

## GitHub Action

Workflow name:

`Audit Editorial Image Readiness`

Outputs:

- GitHub Actions job summary
- downloadable JSON report
- downloadable Markdown report
- artifact name: `editorial-image-readiness-audit`
- artifact retention: 30 days

## Readiness rules

An image is considered publication-ready only when it has:

- a Sanity asset or imported image URL
- title
- alt text
- caption
- public credit
- copyright line
- source classification
- editorial category
- editorial rating
- editorial value
- suggested use
- lifecycle status

Additional checks:

- approved lifecycle records must have `usageApproved = true`
- usage-approved records must have lifecycle `approved` or `published`
- original Rugby Panda images must use `Photo: The Rugby Panda`
- original Rugby Panda images must use `© The Rugby Panda`
- external images must retain a source/landing-page URL
- external images must retain licence information or rights notes

## Next step

Use the verified audit findings as input to the reviewable Editorial Image Metadata Suggestions workflow documented in `docs/22_Editorial_Image_Metadata_Suggestions.md`.
