# New Chat Handoff

Use this file when continuing The Rugby Panda in a new chat.

## First actions

1. Read `docs/07_Project_State.md`.
2. Read `docs/08_Issue_Log.md`.
3. Read `docs/09_Publishing_Workflow.md`.
4. Read `docs/10_New_Chat_Handoff.md`.
5. Read `docs/11_Editorial_Image_Archive.md`.
6. Read `docs/12_Brand_Assets_Library.md`.
7. Check available connectors before asking the user to configure anything.

Do not rely on chat history for current status.

## Expected connectors

- GitHub.
- Vercel.
- Sanity, when available.
- Apify, when available.

Connector notes:

- GitHub has been available and write-capable.
- Vercel has been available for deployment checks.
- Sanity connector availability varies; when Sanity write access is unavailable, use the GitHub Action import workflow.
- Apify connector availability varies; when unavailable, continue with GitHub/Vercel work and official-source records only.

## Current handoff status

Sprint 4 is complete.

The verified media architecture is:

```text
Discovery / acquisition
→ GitHub candidate JSON
→ GitHub Action import
→ Sanity candidate records
→ Review tool
→ Manual approval / rejection / archive
→ Approved CMS records for future editorial use
```

## Completed Sprint 4 work

### Editorial Images

Implemented and in use:

- `editorialImage` Sanity document type.
- Dedicated Editorial Images Studio section.
- Image Review tool.
- Needs Review / Approved / Rejected queues.
- Original Rugby Panda photo import workflow.
- External candidate image import workflow.

Pending verification:

- Final Editorial Image queue/count verification.
- Final starter external image reviewed-count verification.
- Final original Rugby Panda photo count verification.

### Brand Assets

Implemented, merged, deployed and user-verified:

- `brandAsset` Sanity document type.
- Dedicated Brand Assets Studio section.
- Brand Review tool.
- Candidate import workflow via GitHub Action.
- Batch 1 imported and manually approved.
- Batch 2 source coverage completed.
- Batch 2 imported as candidates.
- Batch 2 reviewed by the user; 5 records approved.
- Importer updated to support both `candidates` and `targetedResults` files.
- Importer updated to patch existing unapproved candidates with later logo references.
- Importer skips already-approved Brand Asset records.
- Candidate logo preview update file added.

Important brand asset rule:

Approved Brand Asset records do not automatically mean the external candidate logo URL is safe for public hotlinking. Before public frontend logo display, upload final approved logo files into Sanity assets and use the Sanity-hosted assets.

## Current open issues

See `docs/08_Issue_Log.md` for canonical status.

Open / pending items for Sprint 5:

- `CMS-002`: hosted Sanity articles need proper featured images and metadata.
- `MEDIA-001`: Editorial Image Archive final count verification.
- `MEDIA-002`: starter external image reviewed-count verification.
- `MEDIA-003`: original Rugby Panda photo count verification.
- `WEB-005`: search remains placeholder.

Closed on 5 July 2026:

- `BRAND-004`: Batch 2 Brand Assets expansion/import/review.

## Sprint 5 recommended theme

**Editorial & Publishing Automation**

Recommended Sprint 5 priorities:

1. AI-powered bulk upload of original Rugby Panda photos into Sanity.
2. AI metadata generation for images: title, caption, alt text, tags and suggested use.
3. AI categorisation by stadium, teams, competition, supporters, match action, pubs and newsroom categories.
4. Duplicate detection.
5. Event and album creation.
6. Fast search of the Editorial Image Library.
7. Assign approved editorial images to current articles.
8. Build real website search.
9. Build the article generation / review / scheduled publishing workflow.

## Production / verification reminders

Always distinguish:

- implemented
- committed
- merged
- deployed
- verified in production
- verified in authenticated Sanity Studio

A feature is not complete until the relevant production or authenticated-Studio verification has happened.

## Deployment budget rule

The Vercel free plan has a maximum of 100 deployments per day. Treat every deployment as a constrained resource.

Default workflow:

1. Batch related work into a single branch.
2. Open one PR where possible.
3. Use one preview deployment where possible.
4. Merge automatically when preview/build is clean and scope is agreed.
5. Use one production deployment.
6. Verify once in production.

## Recommended next chat prompt

```text
Continue The Rugby Panda. Read docs/07 through docs/20 from the repository first and use them as the source of truth. Check available connectors. Continue from the verified Sprint 4 media foundation and start Sprint 5: Editorial & Publishing Automation.
```
