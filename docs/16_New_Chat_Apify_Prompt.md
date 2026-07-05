# New Chat Apify Prompt

## Status

Historical reference.

This prompt was used for Sprint 4 Brand Assets Batch 2 targeted logo extraction.

Batch 2 has now been completed, imported and reviewed. Do not use this prompt to restart Batch 2 unless the user explicitly asks to reopen Brand Assets acquisition.

## Completed outcome

Completed on 5 July 2026:

- Batch 2 candidate source coverage was completed.
- Apify targeted extraction file was created:
  - `data/brand-assets/candidate-logo-extraction-apify-2026-07-05.json`
- Completion file was created:
  - `data/brand-assets/candidate-logo-extraction-batch-2-completion-2026-07-05.json`
- Preview update file was created:
  - `data/brand-assets/candidate-logo-preview-update-2026-07-05.json`
- Batch 2 was imported through GitHub Actions.
- Importer was fixed in PR #36 to support both `candidates` and `targetedResults`.
- User completed Brand Review and approved 5 records.
- `BRAND-004` is closed.

## Current recommended next-chat prompt

Use this for Sprint 5:

```text
Continue The Rugby Panda. Read docs/07 through docs/20 from the repository first and use them as the source of truth. Check available connectors. Continue from the verified Sprint 4 media foundation and start Sprint 5: Editorial & Publishing Automation.
```

## If Apify is available in Sprint 5

Use Apify for new acquisition tasks only when the Sprint 5 scope requires it, for example:

- rugby news candidate collection
- official source URL discovery
- editorial image candidate discovery
- structured metadata extraction
- candidate-only enrichment pipelines

Do not use Apify to automatically publish content or approve media/brand assets.

## Candidate-only rules remain

When Apify is used for media or brand acquisition, preserve:

```text
lifecycleStatus: candidate
approvedForEditorialUse: false
rightsStatus: editorial-trademark-use-only
```

Do not collect sponsors, broadcasters, commercial partners, schools, youth teams, grassroots clubs, amateur clubs or non-rugby organisations unless the user explicitly changes the acquisition scope.
