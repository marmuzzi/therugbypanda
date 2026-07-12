# Project State

## Current Version

v0.7 — Sprint 5 Editorial Automation In Progress

## Last Updated

12 July 2026

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
15. `docs/21_Editorial_Image_Readiness_Audit.md`
16. `docs/22_Editorial_Image_Metadata_Suggestions.md`

Do not rely on chat history for current status.

## Connectors

Verified available on 12 July 2026:

- GitHub — read/write capable.
- Vercel — deployment and production checks available.
- Apify — available for acquisition workflows.
- Sanity direct connector — not available in the current session; GitHub Actions remain the reliable CMS automation path.

Always check available connectors before asking the user to configure anything.

## Current state summary

Sprint 4 is complete. Sprint 5 has started.

The verified media architecture remains:

```text
Discovery / acquisition
→ GitHub candidate JSON
→ GitHub Action import
→ Sanity candidate records
→ Review tool
→ Manual approval / rejection / archive
→ Approved CMS records
```

Sprint 5 is adding read-only quality gates and reviewable metadata automation before any controlled CMS write-back is introduced.

## Sprint 5 completed work

### PUB-001 — Editorial Image Readiness Audit

Implemented, merged in PR #38, deployed and verified through workflow run `29208191194`.

Verified production result:

- 40 Editorial Image records.
- 22 publication-ready.
- 18 needing attention.
- 34 approved or published.
- 12 approved/published but not ready.
- 0 duplicate Sanity asset groups.
- 2 duplicate source groups caused by draft/published document pairs.

The repeated metadata gap is missing alt text, caption, public credit and copyright line.

## Sprint 5 current work

### PUB-002 — Editorial Image Metadata Suggestions

Implemented on branch `sprint-5/editorial-metadata-suggestions` and pending merge/verification.

The workflow:

- reads Editorial Images from production Sanity
- generates conservative suggestions for missing alt text, captions, credits, copyright and tags
- preserves all existing metadata
- never invents rights or licence data
- classifies records as metadata-review-ready, rights-review-required, already-complete or not-active
- outputs Markdown and JSON artifacts
- performs no Sanity mutation

Human review remains mandatory. A future controlled import step may apply only explicitly approved suggestions.

## Editorial Images

Editorial Images are managed in Sanity using:

- `editorialImage` document type
- Bulk Image Review tool
- Needs Review / Approved / Rejected queues
- original Rugby Panda uploads
- external candidate imports
- readiness audit
- metadata suggestions workflow

Original Rugby Panda photography remains preferred.

Outstanding verification items remain in `docs/08_Issue_Log.md`, particularly `MEDIA-001`, `MEDIA-002`, `MEDIA-003`, and `CMS-002`.

## Brand Assets

Sprint 4 Brand Assets work is complete and verified in authenticated Sanity Studio.

Candidate logo URLs remain review references only. Public frontend logo use requires approved logo files uploaded into Sanity assets; external candidate URLs must never be hotlinked.

## Current article URL

`/articles/leinster-season-preview-2026`

## Current priorities

1. Verify and review the Editorial Image Metadata Suggestions artifact.
2. Build a controlled review/import step for accepted metadata suggestions.
3. Assign approved Editorial Images to current articles under `CMS-002`.
4. Add AI vision enrichment behind the same suggestions-only approval boundary.
5. Build real website search under `WEB-005`.
6. Build the article generation, review and scheduled publishing workflow.

## Deployment budget rule

The Vercel free plan has a maximum of 100 deployments per day. Treat every deployment as constrained.

Default workflow:

1. Batch related work into one branch.
2. Open one PR.
3. Use one preview deployment where possible.
4. Merge automatically when preview/build is clean and scope is agreed.
5. Use one production deployment.
6. Verify once in production.

## Working principles

- Documentation is the source of truth.
- Prefer full-file replacements and reusable components.
- Keep `main` deployable.
- Distinguish implemented, committed, merged, deployed and verified.
- A feature is not complete until production or authenticated-Studio verification.
- Keep the Issue Log current.
- Mobile-first design.
- Reader-first advertising.
- Do not expose AI implementation references publicly on the reader-facing website.
