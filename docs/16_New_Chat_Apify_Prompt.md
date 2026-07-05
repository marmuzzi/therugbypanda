# New Chat Apify Prompt

Copy this prompt into the next chat when Apify is available.

```text
Continue The Rugby Panda.

Before doing anything else, read these repository documents in order and use them as the source of truth:

1. docs/07_Project_State.md
2. docs/08_Issue_Log.md
3. docs/09_Publishing_Workflow.md
4. docs/10_New_Chat_Handoff.md
5. docs/11_Editorial_Image_Archive.md
6. docs/12_Brand_Assets_Library.md
7. docs/13_Brand_Assets_Candidate_Batch_2.md
8. docs/14_Brand_Assets_Targeted_Logo_Extraction.md
9. docs/15_Apify_Brand_Assets_Handoff.md

After reading them:

1. Check which connectors are available.
2. Confirm GitHub, Vercel and Apify availability.
3. Continue Sprint 4 Task 4 Brand Assets candidate collection using Apify.
4. Focus on targeted browser extraction for unresolved Batch 2 records with empty candidateLogoUrls.

Priority targets:

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

Approved acquisition scope only:

- Rugby union governing bodies and unions.
- Rugby World Cup-cycle national teams.
- Rugby World Cup.
- Six Nations Rugby.
- United Rugby Championship.
- European Professional Club Rugby.
- European Rugby Champions Cup.
- EPCR Challenge Cup.
- Irish provinces directly relevant to URC and EPCR coverage.
- Other professional clubs only where directly relevant to URC, Champions Cup or Challenge Cup coverage.

Do not collect:

- Grassroots clubs.
- Schools or youth teams.
- Amateur clubs.
- Sponsors.
- Broadcasters.
- Commercial partners.
- Non-rugby organisations.
- Teams outside the approved editorial scope.

Candidate-only rules:

- Collect candidate records only.
- Do not approve any brand asset.
- Do not import anything into Sanity as an approved asset.
- Do not upload external logos into Sanity assets unless a later explicit review step says so.
- Do not use or hotlink external candidate logo URLs in public templates.
- Keep approvedForEditorialUse false.
- Keep lifecycleStatus as candidate.
- Keep rightsStatus as editorial-trademark-use-only.
- Preserve source URLs, rights holder notes, Apify run IDs, dataset IDs, candidate logo URLs where discoverable and raw source metadata.

Create a new candidate-only JSON output under data/brand-assets/, preferably:

- data/brand-assets/candidate-logo-extraction-apify-2026-07-05.json

Also add/update documentation, preferably:

- docs/16_Apify_Targeted_Logo_Extraction.md

Use a branch, commit the changes, open a PR, merge the PR yourself if the diff is clean and data/docs only, then check Vercel status.

At the end, report clearly:

- what changed
- what is committed
- what is merged
- what is deployed
- what is verified
- what remains pending
- blockers
- recommended next step
```
