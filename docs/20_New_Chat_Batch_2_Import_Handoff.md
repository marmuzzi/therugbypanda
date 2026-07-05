# New Chat Handoff — Batch 2 Brand Asset Import

## Status

Historical reference.

Created on 5 July 2026 after Batch 2 source coverage was merged and production was verified.

This handoff is now superseded by the Sprint 5 handoff in:

- `docs/07_Project_State.md`
- `docs/08_Issue_Log.md`
- `docs/10_New_Chat_Handoff.md`

## Completed outcome

Sprint 4 is complete.

The Editorial Images workflow is complete and verified as a workflow.

The Brand Assets workflow is complete and verified:

```text
Apify / official-source discovery
→ GitHub candidate JSON
→ GitHub Action
→ Sanity import
→ Brand Review
→ Manual approval / rejection / archive
```

Batch 1 was imported into Sanity and manually reviewed by the user.

Batch 2 candidate collection was merged and deployed.

Batch 2 was imported into Sanity through GitHub Actions.

PR #36 updated the importer to support both `candidates` and `targetedResults`, update existing unapproved candidates with later logo references, and skip already-approved Brand Assets.

The final preview update file was added:

- `data/brand-assets/candidate-logo-preview-update-2026-07-05.json`

The user completed Batch 2 Brand Review and approved 5 records.

`BRAND-004` is closed.

## Latest Batch 2 files

- `data/brand-assets/candidate-collection-batch-2-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-apify-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-batch-2-completion-2026-07-05.json`
- `data/brand-assets/candidate-logo-preview-update-2026-07-05.json`

Relevant docs:

- `docs/13_Brand_Assets_Candidate_Batch_2.md`
- `docs/14_Brand_Assets_Targeted_Logo_Extraction.md`
- `docs/15_Apify_Brand_Assets_Handoff.md`
- `docs/16_New_Chat_Apify_Prompt.md`
- `docs/18_Apify_Targeted_Logo_Extraction.md`
- `docs/19_Brand_Assets_Batch_2_Completion.md`

## Batch 2 import rules preserved

Imported records were candidates only.

Every imported record started as:

```text
approvedForEditorialUse = false
rightsStatus = editorial-trademark-use-only
lifecycleStatus = candidate
```

Do not approve anything automatically.

Do not upload approved logo assets automatically.

Do not publish or use any candidate logo on the frontend.

Do not hotlink candidate logo URLs.

Do not collect or import sponsors, broadcasters, commercial partners, schools, amateur clubs, grassroots clubs or non-rugby organisations.

## Remaining limitation

Some approved Brand Asset records may still have external candidate logo URL references.

Those references are not public frontend assets.

Before public use:

1. Upload approved logo files into Sanity assets.
2. Replace external candidate URLs with Sanity asset references.
3. Verify no public template hotlinks candidate logo URLs.

## Sprint 5 next step

Start Sprint 5: Editorial & Publishing Automation.

Recommended next chat prompt:

```text
Continue The Rugby Panda. Read docs/07 through docs/20 from the repository first and use them as the source of truth. Check available connectors. Continue from the verified Sprint 4 media foundation and start Sprint 5: Editorial & Publishing Automation.
```
