# Brand Assets Candidate Collector — Batch 2

## Status

Candidate-only collector output created on 5 July 2026.

Repository file:

- `data/brand-assets/candidate-collection-batch-2-2026-07-05.json`

This batch is not approved content. It must not be used in public templates and must not be treated as a Sanity asset import source for approved logos.

## Scope

Batch 2 continues Sprint 4 Task 4 for the remaining approved rugby-union organisations.

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

## Apify runs

- `D3TiNoKjFvH8z0bZL` / dataset `yFr4VZu0xXpBCmWz5` — Irish province official-source discovery.
- `CmAHZC8fZOjAKe2ie` / dataset `wNhvGOsRh3G9tM2tp` — Leinster Rugby homepage fetch.
- `D5Pyt293XOIo7IOb9` / dataset `OXSruDFhdWvaxQtmq` — Connacht Rugby homepage fetch.
- `Qk5LJvJqbFtXsJrcs` / dataset `QNLvft2pXVVZcc7Jr` — remaining Rugby World Cup-cycle unions/national teams discovery.
- `B8hRZUfiKrJ9HADBS` / dataset `ihHRI3KDx4t3tPzrh` — World Rugby / Rugby World Cup-cycle source discovery.

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

Every record uses or inherits:

- `lifecycleStatus: candidate`
- `approvedForEditorialUse: false`
- `rightsStatus: editorial-trademark-use-only`
- `reviewedAt: null`

External logo URLs, where found, are review references only. They must not be hotlinked publicly.

## Known limitations

- Munster Rugby has an extracted SVG logo candidate from an official Munster Rugby page.
- Leinster Rugby, Connacht Rugby and most remaining unions have official source references but no reliable extracted logo URL yet.
- Ulster Rugby returned limited page content and needs targeted follow-up extraction.
- Colour values were not extracted in this pass.
- Several official website/source URLs should be validated again before Sanity import because Batch 2 prioritised source coverage over deep logo extraction.

## Next steps

1. Run targeted extraction against the empty-logo records.
2. Validate source URLs and rights holder names.
3. Import only as unapproved Sanity candidates after the Brand Review workflow has been verified.
4. Keep approved public use blocked until logo files are reviewed and uploaded into Sanity assets.
