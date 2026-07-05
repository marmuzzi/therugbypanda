# Brand Assets Library

## Purpose

The Brand Assets Library is the canonical home for reusable rugby branding assets such as team logos, competition logos, league marks and union / governing-body marks.

Brand assets must stay separate from the Editorial Image Archive because logos and marks carry trademark and brand-use considerations that are different from photography rights.

## Current status

Sprint 4 Brand Assets work is complete.

Implemented, merged, deployed and verified in authenticated Sanity Studio:

- `brandAsset` Sanity document type.
- Dedicated `Brand Assets` Studio section.
- Filtered Studio queues for active brands, teams, competitions / leagues, unions and rights review.
- Brand Review tool for bulk approve, reject and archive actions.
- Candidate import workflow through GitHub Actions.
- Candidate logo URL references for review only.
- Rights metadata for editorial / trademark use.
- Logo variants for primary, light-background and dark-background use.
- Colour metadata for future frontend UI, cards and team / competition pages.

## Completed candidate batches

### Batch 1

Batch 1 was imported into Sanity and manually reviewed by the user.

The Brand Asset workflow was verified end-to-end:

```text
Apify → GitHub candidate JSON → GitHub Action → Sanity import → Brand Review → Approval
```

### Batch 2

Batch 2 expanded approved-scope coverage to:

- Irish provinces: Leinster, Munster, Ulster, Connacht.
- Remaining Rugby World Cup-cycle unions / national-team organisations.
- World Rugby and Rugby World Cup follow-up source coverage.

Batch 2 candidate files:

- `data/brand-assets/candidate-collection-batch-2-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-apify-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-batch-2-completion-2026-07-05.json`
- `data/brand-assets/candidate-logo-preview-update-2026-07-05.json`

Batch 2 was imported through the GitHub Action and reviewed by the user. The user approved 5 records.

## Importer behaviour

The Brand Asset candidate importer is:

`scripts/import-brand-asset-candidates.mjs`

It is run by:

`npm run brand-assets:import-candidates`

The GitHub Action is:

`Import Brand Asset Candidates`

The importer supports:

- top-level `candidates` arrays.
- top-level `targetedResults` arrays.
- creating new unapproved candidate records.
- updating existing unapproved candidate records with later logo references.
- skipping already-approved records.
- normalising acquisition `brandType: club` to Sanity schema `brandType: team`.

Every imported or updated candidate must remain:

```text
approvedForEditorialUse = false
rightsStatus = editorial-trademark-use-only
lifecycleStatus = candidate
```

## Acquisition scope

Do not collect brand assets outside the rugby-union editorial scope.

Approved scope:

- Rugby union governing bodies and unions.
- National teams that normally participate in Rugby World Cup qualification cycles or Rugby World Cup finals.
- Rugby World Cup.
- Six Nations Rugby.
- United Rugby Championship.
- European Professional Club Rugby.
- European Rugby Champions Cup.
- EPCR Challenge Cup.
- Irish provinces and other professional clubs only when they are relevant to United Rugby Championship, Champions Cup or Challenge Cup coverage.

Out of scope unless explicitly approved later:

- Random grassroots clubs.
- Schools, youth teams or amateur clubs.
- Sponsors, broadcasters or commercial partners.
- Teams from competitions outside the Rugby World Cup / international rugby / Champions Cup / Challenge Cup editorial lane.
- Generic sports brands or non-rugby organisations.

## Rights policy

Default rights status is:

`Editorial / trademark use only`

Most rugby logos should be treated this way unless The Rugby Panda receives explicit permission or the asset is clearly owned by The Rugby Panda.

A logo should not be used in public templates until:

1. The source URL is recorded.
2. The rights holder is recorded where known.
3. The rights status is selected.
4. `Approved for editorial use` is set to true by manual review.
5. Usage notes explain any limitations.
6. The approved logo is uploaded into Sanity assets rather than hotlinked from the external candidate URL.

The schema prevents setting `Approved for editorial use` to true unless source URL, rights holder and usage notes are recorded.

Do not bulk-import third-party logos as usable assets. Bulk import is allowed only for unapproved review candidates.

## Candidate preview rule

Candidate logo URLs are external review references only.

They may be useful for Brand Review previews, but they must not be used in public frontend templates.

Some Batch 2 preview references are fallback aids, such as official-domain favicons, where a reliable direct full-size logo URL was not exposed. These fallback references are not approval-ready logo assets and should be replaced with official full-size logo files before any public use.

## Starter library targets

Initial brand records should prioritise:

### Governing bodies and unions

- World Rugby
- Irish Rugby Football Union
- Rugby Football Union
- Welsh Rugby Union
- Scottish Rugby
- South African Rugby Union
- Rugby Australia
- New Zealand Rugby
- Fédération Française de Rugby
- Federazione Italiana Rugby
- Unión Argentina de Rugby
- Japan Rugby Football Union
- Fiji Rugby Union
- Samoa Rugby Union
- Tonga Rugby Union
- Georgia Rugby Union
- USA Rugby
- Rugby Canada
- Uruguay Rugby Union
- Chile Rugby
- Portugal Rugby
- Spain Rugby
- Romania Rugby
- Namibia Rugby Union

### Competitions

- Rugby World Cup
- Six Nations Rugby
- United Rugby Championship
- European Professional Club Rugby
- European Rugby Champions Cup
- EPCR Challenge Cup

### Irish provinces

- Connacht Rugby
- Leinster Rugby
- Munster Rugby
- Ulster Rugby

Do not add broad rugby clubs outside this editorial scope unless they are directly relevant to Champions Cup, Challenge Cup or current international coverage.

## Next Brand Asset work

Brand Assets are ready for Sprint 5 integration work, but public frontend logo use should be treated as a separate implementation step.

Next Brand Asset tasks:

1. Upload approved logo files into Sanity assets.
2. Replace external candidate URLs with uploaded Sanity asset references.
3. Link approved Brand Assets to teams, competitions and articles.
4. Add frontend display only for approved Sanity-hosted logo assets.
5. Verify no public template hotlinks external candidate URLs.
