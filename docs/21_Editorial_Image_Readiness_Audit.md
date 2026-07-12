# Editorial Image Readiness Audit

## Status

Implemented on the Sprint 5 feature branch. Pending merge, workflow execution and authenticated Sanity verification.

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

## GitHub Action

Workflow name:

`Audit Editorial Image Readiness`

The workflow is manually triggered and uses the existing Sanity project configuration and `SANITY_API_TOKEN` repository secret.

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

## Completion criteria

This task is complete only after:

1. the branch is merged
2. the GitHub Action is available on `main`
3. the workflow runs successfully against the production Sanity dataset
4. the generated report is reviewed
5. the result is recorded in `docs/08_Issue_Log.md`

## Next step

Use the first audit report to close the outstanding Editorial Image count/readiness verification items and then implement approved Editorial Image assignment to articles under `CMS-002`.
