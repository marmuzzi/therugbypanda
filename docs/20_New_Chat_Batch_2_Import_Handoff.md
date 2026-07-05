# New Chat Handoff — Batch 2 Brand Asset Import

## Status

Created on 5 July 2026 after Batch 2 source coverage was merged and production was verified.

## Current verified project state

Sprint 4 is complete.

The Editorial Images workflow is complete and verified.

The Brand Assets workflow is complete and verified:

```text
Apify → GitHub candidate JSON → GitHub Action → Sanity import → Brand Review → Approval
```

Batch 1 was imported into Sanity and manually reviewed by the user.

Batch 2 candidate collection is merged into the repository and deployed.

Batch 2 is complete as a candidate/source-coverage pass.

Batch 2 is not complete as a fully resolved direct-logo asset pass. Several records still have empty `candidateLogoUrls`; those records are valid unapproved candidates for review, but they are not approved assets and must not be used publicly.

## Latest merged Batch 2 files

- `data/brand-assets/candidate-collection-batch-2-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-apify-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-batch-2-completion-2026-07-05.json`

Relevant docs:

- `docs/13_Brand_Assets_Candidate_Batch_2.md`
- `docs/14_Brand_Assets_Targeted_Logo_Extraction.md`
- `docs/15_Apify_Brand_Assets_Handoff.md`
- `docs/16_New_Chat_Apify_Prompt.md`
- `docs/18_Apify_Targeted_Logo_Extraction.md`
- `docs/19_Brand_Assets_Batch_2_Completion.md`

## Connector status at handoff

GitHub was available and write-capable.

Vercel was available and verified the production deployment.

Sanity was not exposed in the current connector list at the moment the user asked to import Batch 2.

Apify was not exposed in the current connector list at the moment the user asked to import Batch 2.

The GitHub connector exposed repository file and PR operations, but did not expose a GitHub Actions workflow-dispatch operation. Therefore the Batch 2 import could not be started from this chat.

## Immediate next task in the new chat

Before doing anything else, read the repository docs in this order:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/10_New_Chat_Handoff.md`
5. `docs/11_Editorial_Image_Archive.md`
6. `docs/12_Brand_Assets_Library.md`
7. `docs/17_Current_Production_Architecture.md`
8. `docs/19_Brand_Assets_Batch_2_Completion.md`
9. `docs/20_New_Chat_Batch_2_Import_Handoff.md`

Then check available connectors.

If GitHub, Sanity and a way to run the import workflow are available, import Batch 2 into Sanity as unapproved candidates only.

## Batch 2 import rules

Import records only as candidates.

Every imported record must remain:

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

## Recommended import order

1. Confirm the existing Brand Asset import workflow and script names from the repository.
2. Import the Batch 2 candidate JSON files into Sanity as unapproved Brand Asset records.
3. Verify the records appear in Sanity Brand Review.
4. Update `docs/08_Issue_Log.md` with the import run status.
5. Do not close `BRAND-004` until records have been reviewed in Sanity and the outcome is documented.

## After import

The user should manually review imported Batch 2 records in Sanity Brand Review.

Bulk actions available in Brand Review:

- Approve.
- Reject.
- Archive.

Approved logos should eventually become uploaded Sanity assets before public frontend use.

## Known limitations

Many Batch 2 records are source-only candidates with empty `candidateLogoUrls`.

Those records may be useful for Brand Review tracking, but they are not ready for public frontend logo display.

If direct logo previews are required before import, rerun targeted Apify/browser extraction for unresolved records first.

## Remaining project tasks after Batch 2 import/review

1. Finish Batch 2 Brand Review: approve, reject or archive records manually.
2. Upload approved logo files into Sanity assets.
3. Verify no frontend code uses external logo URLs.
4. Assign approved editorial images to current articles.
5. Verify Editorial Image Library counts.
6. Verify original Rugby Panda photo counts.
7. Begin Sprint 5:
   - AI bulk upload of original Rugby Panda photos.
   - AI categorisation by stadium, teams, competition, supporters, match action, pubs and newsroom categories.
   - Automatic title, caption, alt text, tags and metadata generation.
   - Duplicate detection.
   - Event and album creation.
   - Fast Editorial Image Library search.
8. Implement real website search.
