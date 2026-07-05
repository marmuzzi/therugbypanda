# Brand Assets Targeted Logo Extraction

## Status

Completed on 5 July 2026.

Repository file:

- `data/brand-assets/candidate-logo-extraction-2026-07-05.json`

This follow-up captured candidate logo references after the initial Batch 2 collector pass.

## Important implementation note

This file uses a top-level `targetedResults` array, not `candidates`.

The original importer only read `candidates`, so this file initially failed with:

```text
No candidates found in data/brand-assets/candidate-logo-extraction-2026-07-05.json.
```

PR #36 fixed the importer to support both `candidates` and `targetedResults`.

## Candidate-only rules preserved

Every record remains:

```text
lifecycleStatus: candidate
approvedForEditorialUse: false
rightsStatus: editorial-trademark-use-only
reviewedAt: null
```

No candidate in this follow-up is automatically approved, uploaded as an approved Sanity asset, published, or used in public templates.

## Results

Candidate logo URL found:

- Leinster Rugby — official homepage image reference resolved to a Leinster Rugby logo SVG.
- Ulster Rugby — official homepage fixture/team image reference resolved to an Ulster-hosted team icon PNG.

Still unresolved in this file:

- Connacht Rugby.
- South African Rugby Union.

## Outcome

After PR #36, this file can be imported through GitHub Actions and used to update existing unapproved candidate records with logo preview references.

## Remaining public-use rule

External candidate logo URLs are review references only. Approved logos should be uploaded into Sanity assets before any frontend use.
