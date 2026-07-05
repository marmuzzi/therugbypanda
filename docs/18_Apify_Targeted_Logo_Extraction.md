# Apify Targeted Logo Extraction

## Status

Completed on 5 July 2026.

Repository file:

- `data/brand-assets/candidate-logo-extraction-apify-2026-07-05.json`

This file followed:

- `data/brand-assets/candidate-collection-batch-2-2026-07-05.json`
- `docs/13_Brand_Assets_Candidate_Batch_2.md`
- `docs/14_Brand_Assets_Targeted_Logo_Extraction.md`
- `docs/15_Apify_Brand_Assets_Handoff.md`
- `docs/16_New_Chat_Apify_Prompt.md`

## Connector status during original work

The following connectors were visible in that session:

- GitHub.
- Vercel.
- Sanity.
- Apify.

Apify `apify/rag-web-browser` was used for targeted extraction.

## Candidate-only rules preserved

Every record remained:

```text
lifecycleStatus: candidate
approvedForEditorialUse: false
rightsStatus: editorial-trademark-use-only
reviewedAt: null
```

No candidate in this follow-up was approved, uploaded as an approved Sanity asset, published, or used in public templates.

External candidate logo URLs are references only and must not be hotlinked.

## Results

Candidate logo URL references found:

- South African Rugby Union / Springboks.
- New Zealand Rugby / All Blacks.
- Unión Argentina de Rugby.

Still unresolved in this file:

- Connacht Rugby.
- Rugby Australia.

## Importer note

This file uses a top-level `candidates` array and was compatible with the original importer.

PR #36 later improved the importer so subsequent targeted files can also use `targetedResults` and update existing unapproved candidate records.

## Outcome

This file contributed to the completed Batch 2 Brand Assets review workflow. Batch 2 was imported and reviewed by the user, who approved 5 records.

## Remaining public-use rule

Sponsor, broadcaster and commercial partner marks found on official pages must continue to be ignored.

Where a page exposes both union and national-team marks, keep the record candidate-only and verify later whether these should become separate Brand Asset records before approval/public use.

Approved logos should be uploaded into Sanity assets before frontend use.
