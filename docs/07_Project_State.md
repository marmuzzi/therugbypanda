# Project State

## Current Version

v0.5 — Verified Media + Brand Assets Review Architecture

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

Do not rely on chat history for current status.

## Connectors

Expected connectors:

- GitHub
- Vercel
- Sanity
- Apify

In the 5 July 2026 Apify targeted extraction session, all four connector surfaces were visible.

During the later Batch 2 completion follow-up, GitHub and Vercel remained visible but Apify was no longer exposed by connector discovery. That pass used available public page extraction and repository source URLs, not new Apify actor runs.

## Current production architecture

Sprint 4 is complete.

The current verified media architecture is:

```text
Apify → GitHub candidate JSON → GitHub Action → Sanity import → Review tool → Approval / rejection → Frontend availability
```

This applies to both Editorial Images and Brand Assets.

## Editorial Images

Editorial Images are managed in Sanity using a complete review workflow:

- `editorialImage` document type.
- Bulk Image Review tool.
- Needs Review / Approved / Rejected queues.
- Original Rugby Panda images.
- External candidate images.
- Bulk import workflow.
- Images are imported into Sanity as candidates.
- The user manually approves or rejects images inside Sanity before use.

Current acquisition priorities:

- Stadiums.
- Rugby supporters.
- Match atmosphere.
- Pubs showing rugby.
- Match action.
- Training.

Do not continue collecting rugby balls or generic equipment unless specifically requested.

## Brand Assets

Brand Assets use the same philosophy as Editorial Images.

Brand assets are not published directly. Candidate logos are imported into Sanity as unapproved review records.

Brand lifecycle states:

- Candidate.
- Pending Validation.
- Approved.
- Rejected.
- Archived.

The Brand Review tool supports bulk approve, reject and archive actions.

Every imported logo is created as:

```text
approvedForEditorialUse = false
rightsStatus = editorial-trademark-use-only
lifecycleStatus = candidate
```

Candidate logo URLs are references only and must never be hotlinked on the website. Approved logos should eventually become uploaded Sanity assets before public frontend use.

The full Brand Asset workflow has been verified:

```text
Apify → GitHub → Sanity → Brand Review → Approval
```

The first candidate batch was successfully imported into Sanity and manually approved by the user.

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

## Current Batch 2 status

Batch 2 now has candidate source coverage for:

- Remaining Rugby World Cup-cycle unions.
- Remaining national teams.
- Leinster.
- Munster.
- Ulster.
- Connacht.
- Other professional clubs within the approved editorial scope where already captured.

Candidate-only Batch 2 files:

- `data/brand-assets/candidate-collection-batch-2-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-apify-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-batch-2-completion-2026-07-05.json`

Batch 2 is complete as a source-coverage candidate pass.

Batch 2 is not complete as a fully resolved direct-logo asset pass. Many records still have empty `candidateLogoUrls` because the official source was confirmed but no reliable direct logo asset URL was exposed by the extraction route.

## Sprint 5 priorities

After Brand Assets expansion, priorities are:

1. AI-powered bulk upload of original Rugby Panda photos into Sanity.
2. AI categorization by stadium, teams, competition, supporters, match action, pubs and related newsroom categories.
3. Automatic title, caption, alt text, tags and metadata generation.
4. Duplicate detection.
5. Event and album creation.
6. Fast search of the Editorial Image Library.

## Current article URL

`/articles/leinster-season-preview-2026`

## Deployment budget rule

The Vercel free plan has a maximum of 100 deployments per day. Treat every deployment as a constrained resource.

Default workflow:

1. Batch related work into a single branch.
2. Open one PR where possible.
3. Use one preview deployment where possible.
4. Merge automatically when preview/build is clean and scope is agreed.
5. Use one production deployment.
6. Verify once in production.

## Known issues

Track all issues in `docs/08_Issue_Log.md`.

Current important issues:

- `BRAND-004` — Batch 2 Brand Assets source coverage implemented; pending merge, deployment and Sanity import/review decision.
- `CMS-002` — CMS article images missing from live articles.
- `MEDIA-001` — Editorial Image Archive final production documentation/count verification.
- `MEDIA-002` — starter editorial image library final reviewed-count verification.
- `MEDIA-003` — original Rugby Panda photo final Studio count verification.
- `WEB-005` — Search remains placeholder.

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
