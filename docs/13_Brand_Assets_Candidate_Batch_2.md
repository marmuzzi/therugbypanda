# Brand Assets Candidate Collector — Batch 2

## Status

Completed on 5 July 2026.

Batch 2 is no longer pending import. It has been imported into Sanity as unapproved Brand Asset candidates, reviewed by the user in Brand Review, and partially approved.

## Repository file

- `data/brand-assets/candidate-collection-batch-2-2026-07-05.json`

Related follow-up files:

- `data/brand-assets/candidate-logo-extraction-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-apify-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-batch-2-completion-2026-07-05.json`
- `data/brand-assets/candidate-logo-preview-update-2026-07-05.json`

## Scope

Batch 2 continued Sprint 4 Task 4 for the remaining approved rugby-union organisations.

Included:

- Irish provinces directly relevant to URC / EPCR coverage.
- Remaining starter-library Rugby World Cup-cycle unions / national-team organisations listed in `docs/12_Brand_Assets_Library.md`.

Excluded:

- Grassroots clubs.
- Schools and youth teams.
- Amateur clubs.
- Sponsors.
- Broadcasters.
- Commercial partners.
- Non-rugby organisations.
- Teams outside the approved editorial scope.

## Candidate records added

Irish provinces:

- Leinster Rugby.
- Munster Rugby.
- Ulster Rugby.
- Connacht Rugby.

Remaining unions / Rugby World Cup-cycle national-team organisations:

- South African Rugby Union.
- Rugby Australia.
- New Zealand Rugby.
- Unión Argentina de Rugby.
- Japan Rugby Football Union.
- Fiji Rugby Union.
- Samoa Rugby Union.
- Tonga Rugby Union.
- Georgia Rugby Union.
- USA Rugby.
- Rugby Canada.
- Uruguay Rugby Union.
- Chile Rugby.
- Portugal Rugby.
- Spain Rugby.
- Romania Rugby.
- Namibia Rugby Union.

## Candidate-only rules preserved

Every imported record was created or updated as:

```text
lifecycleStatus: candidate
approvedForEditorialUse: false
rightsStatus: editorial-trademark-use-only
reviewedAt: null
```

External logo URLs, where found, are review references only. They must not be hotlinked publicly.

## Completion outcome

- Batch 2 candidate source coverage was completed.
- Batch 2 records were imported through the GitHub Action.
- The importer was later updated to support follow-up files that use `targetedResults`.
- Existing unapproved candidates can now be updated with later logo references.
- User completed Batch 2 Brand Review and approved 5 records.
- `BRAND-004` is closed in `docs/08_Issue_Log.md`.

## Remaining limitation

Batch 2 was completed as a source-coverage and review workflow, not as a final public-logo asset pipeline.

Before any frontend logo display:

1. Upload approved logo files into Sanity assets.
2. Replace external candidate URLs with Sanity-hosted assets.
3. Verify no public template hotlinks external candidate URLs.
