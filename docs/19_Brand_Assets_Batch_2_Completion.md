# Brand Assets Batch 2 Completion

## Status

Candidate-only completion pass created on 5 July 2026.

Repository file:

- `data/brand-assets/candidate-logo-extraction-batch-2-completion-2026-07-05.json`

This follows:

- `data/brand-assets/candidate-collection-batch-2-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-apify-2026-07-05.json`
- `docs/18_Apify_Targeted_Logo_Extraction.md`

## Connector status

GitHub and Vercel were available throughout this pass.

Apify was available earlier in the session and was used for the previous targeted extraction file. During this follow-up request, the active connector discovery surface no longer exposed Apify, so no additional Apify actor run was started.

This completion pass used available public page extraction and the official Batch 2 source URLs already recorded in the repository.

## Candidate-only rules preserved

Every record remains:

- `lifecycleStatus: candidate`
- `approvedForEditorialUse: false`
- `rightsStatus: editorial-trademark-use-only`
- `reviewedAt: null`

No candidate was approved.

No Sanity import was run.

No Sanity asset upload was performed.

No public template use or hotlinking was introduced.

Sponsor, broadcaster and commercial partner marks were ignored.

## Batch 2 source coverage status

Source coverage is now recorded for the remaining Batch 2 targets:

- Japan Rugby Football Union.
- Fiji Rugby Union.
- Samoa Rugby Union / Lakapi Samoa.
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
- World Rugby.
- Rugby World Cup.

## Direct logo URL status

Direct logo URL coverage is still partial.

The completion file intentionally keeps many `candidateLogoUrls` empty where the source page was confirmed but no reliable direct logo asset URL was exposed by the extraction route.

This is acceptable for candidate-source tracking, but not enough for approved public logo use.

## Practical interpretation

Batch 2 is complete as a source-coverage candidate pass.

Batch 2 is not complete as a fully resolved direct-logo asset pass.

The Brand Review workflow may still import these records as unapproved candidates if source-only records are useful for review. If direct logo previews are required before import, run another targeted browser/asset extraction pass when Apify is visible again.

## Recommended next actions

1. Decide whether to import source-only Batch 2 candidates into Sanity for Brand Review.
2. If yes, run the existing GitHub Action import workflow and verify all records appear as unapproved candidates.
3. If no, rerun Apify targeted extraction for the unresolved direct logo URLs first.
4. Review Batch 2 candidates in Sanity Brand Review.
5. Approve/reject/archive manually.
6. Upload approved logo files into Sanity assets before any public frontend use.
