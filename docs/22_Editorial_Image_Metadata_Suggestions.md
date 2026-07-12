# Editorial Image Metadata Suggestions

## Status

Implemented on the Sprint 5 feature branch. Pending merge, production deployment, workflow execution and report review.

## Purpose

This workflow converts Editorial Image readiness findings into reviewable metadata suggestions without changing Sanity records.

It is the safe foundation for later AI-assisted enrichment: suggestions are generated into artifacts first, reviewed by an editor, and only a separate future approval/import step may write accepted values to Sanity.

## Files

- `scripts/generate-editorial-image-metadata-suggestions.mjs`
- `.github/workflows/editorial-image-metadata-suggestions.yml`
- `package.json` script: `npm run media:generate-metadata-suggestions`

## Workflow

Workflow name:

`Generate Editorial Image Metadata Suggestions`

The workflow:

1. reads Editorial Image records from the production Sanity dataset
2. identifies missing publication metadata
3. generates conservative suggestions from stored titles, event data, teams, venue, source and attribution metadata
4. classifies each record by editorial readiness
5. creates Markdown and JSON reports
6. uploads the reports as a 30-day GitHub Actions artifact

No Sanity mutation is performed.

## Suggested fields

The first implementation can suggest:

- alt text
- caption
- public credit
- copyright line
- tags

Existing non-empty fields are never replaced in the report.

## Readiness bands

- `metadata-review-ready` — missing metadata can be suggested from existing trusted record data
- `rights-review-required` — a credit or rights-safe suggestion cannot be made because source, licence, creator or attribution data is incomplete
- `already-complete` — the record already has the checked metadata
- `not-active` — rejected or archived records are retained in the report but should not be prepared for publication

## Safety rules

- Suggestions are not approvals.
- Suggestions are not written to Sanity.
- Rights and licence details are never invented.
- External-image credit is suggested only from stored attribution, creator or source values.
- Rugby Panda originals use only `Photo: The Rugby Panda` and `© The Rugby Panda`.
- Rejected and archived records are not treated as publication candidates.
- Human editorial review remains mandatory.

## Completion criteria

This task is complete only after:

1. the PR is merged
2. the production deployment is ready
3. the workflow runs successfully from `main`
4. the generated artifact is reviewed
5. findings are recorded in the Issue Log

## Next step

After the suggestions report is verified, build a controlled Sanity review/import step that applies only explicitly approved suggestions. AI vision enrichment can then be added behind the same suggestion schema without changing the human approval boundary.
