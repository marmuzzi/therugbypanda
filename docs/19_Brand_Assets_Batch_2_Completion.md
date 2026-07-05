# Brand Assets Batch 2 Completion

## Status

Completed on 5 July 2026.

Repository file:

- `data/brand-assets/candidate-logo-extraction-batch-2-completion-2026-07-05.json`

This followed:

- `data/brand-assets/candidate-collection-batch-2-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-apify-2026-07-05.json`
- `docs/18_Apify_Targeted_Logo_Extraction.md`

Additional final preview update file:

- `data/brand-assets/candidate-logo-preview-update-2026-07-05.json`

## Completion summary

Batch 2 is complete as a candidate/source-coverage and review workflow.

Completed:

- Candidate source coverage recorded for remaining approved-scope Batch 2 targets.
- Candidate data/docs merged.
- Candidate records imported into Sanity through GitHub Actions.
- Importer enhanced to support later logo-reference updates.
- User completed Brand Review.
- User approved 5 records.
- `BRAND-004` closed.

## Candidate-only rules preserved

Every imported candidate started as:

```text
lifecycleStatus: candidate
approvedForEditorialUse: false
rightsStatus: editorial-trademark-use-only
reviewedAt: null
```

No candidate was automatically approved.

No Sanity asset upload was performed automatically.

No public template use or hotlinking was introduced.

Sponsor, broadcaster and commercial partner marks were ignored.

## Batch 2 source coverage status

Source coverage was recorded for:

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
- Irish provinces: Leinster, Munster, Ulster, Connacht.
- Selected direct-logo follow-ups for South Africa, New Zealand and Argentina.

## Direct logo URL status

Direct logo URL coverage remains partial.

Some candidate records have direct official-source logo references. Others have only source-page references or fallback preview aids.

This is acceptable for internal review tracking, but it is not enough for public frontend logo display.

## Practical interpretation

Batch 2 is complete for Sprint 4.

Do not reopen Batch 2 unless the user explicitly asks for additional Brand Asset acquisition.

Future Brand Asset work should be treated as Sprint 5+ integration work:

1. Upload approved final logo files into Sanity assets.
2. Replace external candidate URLs with Sanity asset references.
3. Link Brand Assets to teams, competitions and articles.
4. Render only approved Sanity-hosted logos in the frontend.
5. Verify no external candidate logo URL is hotlinked publicly.

## Recommended next actions

Move to Sprint 5: Editorial & Publishing Automation.

See:

- `docs/07_Project_State.md`
- `docs/08_Issue_Log.md`
- `docs/10_New_Chat_Handoff.md`
