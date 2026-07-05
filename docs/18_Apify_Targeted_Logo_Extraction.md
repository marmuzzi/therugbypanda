# Apify Targeted Logo Extraction

## Status

Candidate-only follow-up created on 5 July 2026.

Repository file:

- `data/brand-assets/candidate-logo-extraction-apify-2026-07-05.json`

This follows:

- `data/brand-assets/candidate-collection-batch-2-2026-07-05.json`
- `docs/13_Brand_Assets_Candidate_Batch_2.md`
- `docs/14_Brand_Assets_Targeted_Logo_Extraction.md`
- `docs/15_Apify_Brand_Assets_Handoff.md`
- `docs/16_New_Chat_Apify_Prompt.md`

## Connector status

The following connectors were visible in this session:

- GitHub.
- Vercel.
- Sanity.
- Apify.

Apify `apify/rag-web-browser` was used for targeted extraction.

## Candidate-only rules preserved

Every record remains:

- `lifecycleStatus: candidate`
- `approvedForEditorialUse: false`
- `rightsStatus: editorial-trademark-use-only`
- `reviewedAt: null`

No candidate in this follow-up is approved, uploaded as an approved Sanity asset, published, or used in public templates.

External candidate logo URLs are references only and must not be hotlinked.

## Apify runs

- `D8SaP5X30M1EwHxlm` / dataset `5NsDXalZg7JiYw8ei` — Connacht Rugby homepage.
- `a9p5fBMKxlyOlLBkv` / dataset `HbpZT8P2OeZqAvmfU` — South African Rugby Union / Springboks redirect.
- `KDdydxwRzR1KPrzOd` / dataset `RYzp3eCNrHJw9z1NX` — Rugby Australia homepage.
- `e9ti3QYbV6Tjzpf8L` / dataset `FnnuwWyL0IymLDv6Z` — New Zealand Rugby / All Blacks homepage.
- `ZWpfhoLsCJ6cgyS4b` / dataset `SkgNZG1L3cWnWlgPu` — Unión Argentina de Rugby homepage.

## Results

Candidate logo URL references found:

- South African Rugby Union / Springboks — SARU and Springboks image references exposed through the official redirected Springboks site.
- New Zealand Rugby / All Blacks — official All Blacks and Black Ferns logo image references exposed by the All Blacks homepage.
- Unión Argentina de Rugby — official UAR and Los Pumas SVG references exposed by the UAR homepage.

Still unresolved:

- Connacht Rugby — official homepage confirmed and logo placeholders visible, but no reliable direct logo asset URL exposed by Apify output.
- Rugby Australia — official homepage confirmed, but no reliable direct Rugby Australia logo URL exposed by Apify output.

## Remaining targets

Continue targeted extraction for:

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
- World Rugby.
- Rugby World Cup.

## Notes

Sponsor, broadcaster and commercial partner marks found on official pages must continue to be ignored.

Where a page exposes both union and national-team marks, keep the record candidate-only and verify later whether these should become separate Brand Asset records before approval.
