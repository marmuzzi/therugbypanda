# Apify Brand Assets Handoff

## Purpose

Use this handoff when continuing The Rugby Panda brand-assets acquisition work in a new chat where Apify is available.

This document records the exact current state after Batch 2 and the targeted extraction follow-up completed on 5 July 2026.

## Current state

### Implemented, merged and deployed

- PR #30 — `Sprint 4 brand assets candidate collector batch 2`
  - Main commit: `d0be37d70c787292b4d40b08774e5d1e999486fe`
  - Vercel: user checked all deployments succeeded.
  - Added: `data/brand-assets/candidate-collection-batch-2-2026-07-05.json`
  - Added: `docs/13_Brand_Assets_Candidate_Batch_2.md`

- PR #31 — `Sprint 4 targeted brand logo extraction`
  - Main commit: `a0b13780e8c70698b6fb244ae889045b4a053c6d`
  - Vercel status check: success.
  - Added: `data/brand-assets/candidate-logo-extraction-2026-07-05.json`
  - Added: `docs/14_Brand_Assets_Targeted_Logo_Extraction.md`

### Candidate-only rule

All Batch 2 and targeted-extraction records remain candidate-only.

No records are approved. No logos are uploaded into Sanity assets. No external candidate URLs may be hotlinked or used in public templates.

All records must continue to use or inherit:

- `lifecycleStatus: candidate`
- `approvedForEditorialUse: false`
- `rightsStatus: editorial-trademark-use-only`
- `reviewedAt: null`

## What Batch 2 added

Batch 2 extended the approved rugby-union scope to Irish provinces and the remaining starter-library Rugby World Cup-cycle unions / national-team organisations.

### Irish provinces

- Leinster Rugby
- Munster Rugby
- Ulster Rugby
- Connacht Rugby

### Remaining unions / national-team organisations

- South African Rugby Union
- Rugby Australia
- New Zealand Rugby
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

## Apify runs already recorded for Batch 2

- `D3TiNoKjFvH8z0bZL` / dataset `yFr4VZu0xXpBCmWz5` — Irish province official-source discovery.
- `CmAHZC8fZOjAKe2ie` / dataset `wNhvGOsRh3G9tM2tp` — Leinster Rugby homepage fetch.
- `D5Pyt293XOIo7IOb9` / dataset `OXSruDFhdWvaxQtmq` — Connacht Rugby homepage fetch.
- `Qk5LJvJqbFtXsJrcs` / dataset `QNLvft2pXVVZcc7Jr` — remaining Rugby World Cup-cycle unions / national teams discovery.
- `B8hRZUfiKrJ9HADBS` / dataset `ihHRI3KDx4t3tPzrh` — World Rugby / Rugby World Cup-cycle source discovery.

## Targeted extraction results already recorded

Candidate logo URL found:

- Leinster Rugby — official page image reference resolved to a Leinster Rugby logo SVG.
- Ulster Rugby — official page image reference resolved to an Ulster-hosted team icon PNG.

Still unresolved:

- Connacht Rugby — official homepage accessible, but no reliable direct logo URL exposed through the non-Apify extraction route.
- South African Rugby Union — official source redirected to Springboks / SARU context and exposed image references, but no reliable direct logo URL exposed through the non-Apify extraction route.

## Remaining work for the new Apify-enabled chat

1. Read the repository source-of-truth docs first:
   - `docs/07_Project_State.md`
   - `docs/08_Issue_Log.md`
   - `docs/09_Publishing_Workflow.md`
   - `docs/10_New_Chat_Handoff.md`
   - `docs/11_Editorial_Image_Archive.md`
   - `docs/12_Brand_Assets_Library.md`
   - `docs/13_Brand_Assets_Candidate_Batch_2.md`
   - `docs/14_Brand_Assets_Targeted_Logo_Extraction.md`
   - `docs/15_Apify_Brand_Assets_Handoff.md`

2. Check available connectors before asking the user to configure anything.

3. If Apify is available, run targeted browser extraction for unresolved Batch 2 records with empty `candidateLogoUrls`.

4. Prioritise:
   - Connacht Rugby
   - South African Rugby Union / Springboks / SARU
   - Rugby Australia
   - New Zealand Rugby / All Blacks
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
   - World Rugby and Rugby World Cup records from Batch 1 that still need reliable logo URLs and colour values

5. Collect candidate records only.

6. Preserve Apify run IDs, dataset IDs, official source URLs, candidate logo URLs where discoverable, raw source metadata and rights/trademark notes.

7. Do not collect sponsors, broadcasters, commercial partners, schools, youth teams, grassroots clubs, amateur clubs or non-rugby organisations.

8. Do not import anything into Sanity as approved content.

9. Do not mark anything `approvedForEditorialUse: true`.

10. Do not use any discovered logo in public templates.

11. Add new output as a new candidate-only JSON file under `data/brand-assets/`.

12. Update documentation in the same PR.

13. Open and merge the PR yourself if the diff is data/docs only and clean.

14. Check Vercel status after merge and clearly distinguish implemented, committed, merged, deployed and verified.

## Suggested next file name

Use a new file rather than modifying previous merged outputs:

- `data/brand-assets/candidate-logo-extraction-apify-2026-07-05.json`

Suggested documentation file:

- `docs/16_Apify_Targeted_Logo_Extraction.md`

## Safety / rights reminder

The Brand Assets Library is a controlled editorial reference library. Brand marks are not editorial photography. Logos and marks default to `Editorial / trademark use only` and require source URL, rights holder, rights status, usage notes and manual approval before public use.

Approved logos should be uploaded into Sanity assets before frontend use. External candidate URLs are review references only.
