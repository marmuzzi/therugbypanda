# Apify Brand Assets Handoff

## Status

Historical reference.

This document originally described the handoff for continuing Batch 2 targeted extraction when Apify was available.

That work has now been completed and superseded by the Sprint 5 handoff in:

- `docs/07_Project_State.md`
- `docs/08_Issue_Log.md`
- `docs/10_New_Chat_Handoff.md`
- `docs/20_New_Chat_Batch_2_Import_Handoff.md`

## Completed outcome

Completed on 5 July 2026:

- Batch 2 candidate source coverage was completed.
- Targeted logo extraction files were created.
- Batch 2 was imported into Sanity as unapproved Brand Asset candidates.
- Importer was updated in PR #36 to support both `candidates` and `targetedResults` files.
- Existing unapproved candidate records can now be updated with later logo references.
- User completed Batch 2 Brand Review and approved 5 records.
- `BRAND-004` is closed.

## Candidate-only rules preserved

All acquisition and import work preserved:

```text
lifecycleStatus: candidate
approvedForEditorialUse: false
rightsStatus: editorial-trademark-use-only
reviewedAt: null
```

No acquisition file automatically approves, publishes or uploads logos as Sanity assets.

## Apify use

Apify was used where available for:

- official source discovery
- targeted logo extraction
- preserving run IDs and dataset IDs
- candidate-only metadata capture

When Apify was not visible, work continued using official-source records already captured in GitHub and available public page extraction.

## Safety / rights reminder

The Brand Assets Library is a controlled editorial reference library. Brand marks are not editorial photography. Logos and marks default to `Editorial / trademark use only` and require source URL, rights holder, rights status, usage notes and manual approval before public use.

Approved logos should be uploaded into Sanity assets before frontend use. External candidate URLs are review references only.

## Sprint 5 note

Do not restart Batch 2 from this handoff. Use Sprint 5 documentation and current Issue Log instead.
