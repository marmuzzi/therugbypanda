# Reviewed Editorial Image Metadata Apply

## Status

Implemented in Sprint 5. Pending merge and workflow verification.

## Purpose

This workflow applies only metadata that has been explicitly reviewed and recorded in a versioned decision file. It is the controlled boundary between generated suggestions and Sanity mutations.

## Safety rules

- Dry run is the default.
- `apply_changes` must be explicitly enabled for writes.
- `drafts.*` document IDs are rejected.
- Rejected and archived Editorial Images are rejected.
- Existing non-empty Sanity fields are never overwritten.
- Only `altText`, `caption`, `publicCredit`, `copyrightLine`, and `tags` are writable.
- Blank values are ignored.
- Every decision requires reviewer identity and review timestamp.
- Every run produces a Markdown and JSON change report.

## Files

- `scripts/apply-reviewed-editorial-image-metadata.mjs`
- `.github/workflows/apply-reviewed-editorial-image-metadata.yml`
- `data/editorial-image-metadata/review-decisions.schema.json`
- `data/editorial-image-metadata/review-decisions.example.json`
- package command: `npm run media:apply-reviewed-metadata`

## Operating procedure

1. Generate metadata suggestions.
2. Review only canonical, non-draft records.
3. Create a reviewed decisions JSON file in `data/editorial-image-metadata/`.
4. Run `Apply Reviewed Editorial Image Metadata` with `apply_changes = false`.
5. Review the dry-run artifact.
6. Run again with `apply_changes = true` only after the dry-run output is correct.
7. Re-run the readiness audit and verify the changed records in authenticated Sanity Studio.

## Important finding

The first suggestions report contained both canonical and `drafts.*` document records. The apply workflow prevents writes to draft IDs. The suggestions generator should also be updated to query canonical records only before the next production suggestions run.

## Completion criteria

`PUB-003` is complete only after a reviewed decision file passes dry run, an explicit apply run succeeds, the change report is reviewed, and the affected records are verified in authenticated Sanity Studio.
