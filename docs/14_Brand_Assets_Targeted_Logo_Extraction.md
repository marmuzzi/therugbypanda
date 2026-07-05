# Brand Assets Targeted Logo Extraction

## Status

Candidate-only follow-up created on 5 July 2026.

Repository file:

- `data/brand-assets/candidate-logo-extraction-2026-07-05.json`

This follows Batch 2:

- `data/brand-assets/candidate-collection-batch-2-2026-07-05.json`
- PR #30
- main commit `d0be37d70c787292b4d40b08774e5d1e999486fe`

## Connector note

Apify was not exposed in the active connector list during this follow-up turn. This pass therefore used official public page extraction through available web and GitHub tooling.

## Candidate-only rules preserved

Every record remains:

- `lifecycleStatus: candidate`
- `approvedForEditorialUse: false`
- `rightsStatus: editorial-trademark-use-only`
- `reviewedAt: null`

No candidate in this follow-up is approved, imported as an approved Sanity asset, published, or used in public templates.

## Results

Candidate logo URL found:

- Leinster Rugby — official homepage image reference resolved to a Leinster Rugby logo SVG hosted on the Leinster Rugby asset host.
- Ulster Rugby — official homepage fixture/team image reference resolved to an Ulster-hosted team icon PNG.

Still unresolved:

- Connacht Rugby — official homepage accessible, but no reliable direct logo URL exposed through this extraction route.
- South African Rugby Union — official source redirected to Springboks/SARU page and exposed SARU / Springboks image references, but no reliable direct logo URL exposed through this extraction route.

## Required follow-up

1. Run a full browser extraction when Apify is visible again.
2. Prioritise unresolved Batch 2 records with empty `candidateLogoUrls`.
3. Validate official source pages and rights holder names before Sanity import.
4. Import only as unapproved candidates.
5. Do not use any external candidate URL in public templates.
6. Upload reviewed and approved logo files into Sanity assets before public use.
