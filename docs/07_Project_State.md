# Project State

## Current Version

v0.6 — Sprint 4 Media Foundation Complete / Sprint 5 Ready

## Last Updated

5 July 2026

## Source of truth

Read these files first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/10_New_Chat_Handoff.md`
5. `docs/11_Editorial_Image_Archive.md`
6. `docs/12_Brand_Assets_Library.md`
7. `docs/13_Brand_Assets_Candidate_Batch_2.md`
8. `docs/14_Brand_Assets_Targeted_Logo_Extraction.md`
9. `docs/15_Apify_Brand_Assets_Handoff.md`
10. `docs/16_New_Chat_Apify_Prompt.md`
11. `docs/17_Current_Production_Architecture.md`
12. `docs/18_Apify_Targeted_Logo_Extraction.md`
13. `docs/19_Brand_Assets_Batch_2_Completion.md`
14. `docs/20_New_Chat_Batch_2_Import_Handoff.md`

Do not rely on chat history for current status.

## Current state summary

Sprint 4 is complete.

The Rugby Panda now has the verified media foundation needed for Sprint 5:

```text
Discovery / acquisition
→ GitHub candidate JSON
→ GitHub Action import
→ Sanity candidate records
→ Review tool
→ Manual approval / rejection / archive
→ Approved CMS records for future editorial use
```

This applies to both Editorial Images and Brand Assets.

## Connectors

Expected connector surfaces:

- GitHub.
- Vercel.
- Sanity, when available.
- Apify, when available.

Always check available connectors before asking the user to configure anything.

Important connector notes from Sprint 4:

- GitHub was available and write-capable.
- Vercel was available for deployment checks.
- Sanity connector availability varied; Sanity write access was not always exposed in chat.
- Apify availability varied; when Apify was not exposed, acquisition continued using repository records and public official-source extraction.
- GitHub Actions remain the reliable mobile-friendly import path for Sanity candidate imports.

## Editorial Images

Editorial Images are managed in Sanity using a complete review workflow:

- `editorialImage` document type.
- Bulk Image Review tool.
- Needs Review / Approved / Rejected queues.
- Original Rugby Panda images.
- External candidate images.
- Bulk import workflow.
- User manual approval/rejection before use.

Original Rugby Panda photography remains preferred.

Current verification items still pending:

- Final Editorial Image queue/count verification.
- Final starter external image approved/rejected count verification.
- Final original Rugby Panda photo count verification.

## Brand Assets

Brand Assets are managed separately from Editorial Images.

Brand lifecycle states:

- Candidate.
- Pending Validation.
- Approved.
- Rejected.
- Archived.

The Brand Review tool supports bulk approve, reject and archive actions.

Every imported candidate starts as:

```text
approvedForEditorialUse = false
rightsStatus = editorial-trademark-use-only
lifecycleStatus = candidate
```

Candidate logo URLs are references only and must never be hotlinked on the public website. Approved logos should eventually be uploaded into Sanity assets before any frontend use.

## Brand Assets completion status

Completed:

- Brand Assets Library foundation implemented, merged, deployed and user-verified in Studio.
- Batch 1 candidate import completed and manually reviewed/approved by the user.
- Batch 2 candidate source coverage completed and merged.
- Batch 2 candidates imported into Sanity through GitHub Actions.
- Importer enhanced to support both `candidates` and `targetedResults` source files.
- Importer enhanced to update existing unapproved candidate records with later logo references.
- Importer skips already-approved Brand Asset records.
- Logo preview update candidate file added:
  - `data/brand-assets/candidate-logo-preview-update-2026-07-05.json`
- User completed Batch 2 Brand Review and approved 5 records.

Important limitation:

- Some approved Brand Asset records may still use external candidate logo references.
- Before any public frontend logo display, approved logo files should be uploaded into Sanity assets.
- Fallback preview references such as favicon candidates are review aids only and should not be treated as final approval-ready logo assets.

## Approved acquisition scope

Only collect:

- World Rugby.
- Rugby World Cup.
- Six Nations.
- EPCR.
- Champions Cup.
- Challenge Cup.
- United Rugby Championship.
- Rugby unions.
- Rugby World Cup-cycle national teams.
- Irish provinces.
- Professional clubs relevant to URC, Champions Cup or Challenge Cup.

Never collect:

- Sponsors.
- Broadcasters.
- Commercial partners.
- Amateur clubs.
- Schools.
- Grassroots clubs.
- Non-rugby organisations.

## Current article URL

`/articles/leinster-season-preview-2026`

## Sprint 5 starting point

Sprint 5 should start from the completed Sprint 4 media foundation.

Recommended Sprint 5 theme:

**Editorial & Publishing Automation**

Recommended priorities:

1. AI-powered bulk upload of original Rugby Panda photos into Sanity.
2. AI categorisation by stadium, teams, competition, supporters, match action, pubs and newsroom categories.
3. Automatic title, caption, alt text, tags and metadata generation.
4. Duplicate detection.
5. Event and album creation.
6. Fast search of the Editorial Image Library.
7. Assign approved editorial images to current articles.
8. Build real website search.
9. Build the editorial article generation / review / publishing pipeline.

## Deployment budget rule

The Vercel free plan has a maximum of 100 deployments per day. Treat every deployment as a constrained resource.

Default workflow:

1. Batch related work into a single branch.
2. Open one PR where possible.
3. Use one preview deployment where possible.
4. Merge automatically when preview/build is clean and scope is agreed.
5. Use one production deployment.
6. Verify once in production.

## Known open issues

Track all issues in `docs/08_Issue_Log.md`.

Current important open items:

- `CMS-002` — CMS article images missing from live articles.
- `MEDIA-001` — Editorial Image Archive final production documentation/count verification.
- `MEDIA-002` — starter editorial image library final reviewed-count verification.
- `MEDIA-003` — original Rugby Panda photo final Studio count verification.
- `WEB-005` — Search remains placeholder.

`BRAND-004` is closed as of 5 July 2026 because Batch 2 was imported, reviewed by the user and documented. Public frontend logo use remains a separate future implementation step, not part of `BRAND-004`.

## Working principles

- Project documentation is the source of truth at the start of each session.
- Full file replacements are preferred over partial snippets.
- Batch related changes to reduce Vercel deployment pressure.
- Always distinguish implemented, committed, merged, deployed and verified in production.
- A feature is not complete until verified in production.
- Every meaningful change must update documentation.
- Every issue must stay in `docs/08_Issue_Log.md` until closed.
- Keep `main` deployable.
- Use reusable components only.
- Mobile-first design.
- Reader-first advertising.
- No public AI references.
