# Project State

## Current Version

v0.7 — Sprint 5 Editorial Automation In Progress

## Last Updated

23 July 2026

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
17. `docs/23_Make_Orchestration_Architecture.md`

Do not rely on chat history for current status.

## Connectors

Last verified in the 23 July 2026 session:

- GitHub — available and read/write capable.
- Vercel — available for deployment and production checks.
- Apify — not exposed in that session; availability must be checked again in each new chat.
- Sanity direct connector — not exposed in that session; GitHub Actions remain the reliable CMS automation path.
- Make.com — not connected in that session.

Always check available connectors before asking the user to configure anything.

## Agreed orchestration architecture

The long-term integration decision is:

```text
GitHub source of truth
→ Make.com orchestration
→ Apify acquisition
→ Sanity canonical CMS
→ Vercel public website
```

GitHub keeps code, business logic, workflow definitions and documentation. Make.com should provide persistent scheduling, webhooks, retries, notifications and service coordination, but core business logic should remain version-controlled in GitHub. Human editorial approval remains mandatory before metadata application or publishing.

See `docs/23_Make_Orchestration_Architecture.md`.

## Current state summary

Sprint 4 is complete. Sprint 5 is in progress.

The verified media workflow remains:

```text
Discovery / acquisition
→ GitHub candidate JSON
→ GitHub Action import
→ Sanity candidate records
→ Review tool
→ Manual approval / rejection / archive
→ Approved CMS records
```

Sprint 5 has added read-only quality gates, reviewable metadata suggestions and a controlled dry-run-first metadata importer.

## Sprint 5 completed work

### PUB-001 — Editorial Image Readiness Audit

Implemented, merged in PR #38, deployed and verified through workflow run `29208191194`.

Verified result:

- 40 Editorial Image records.
- 22 publication-ready.
- 18 needing attention.
- 34 approved or published.
- 12 approved/published but not ready.
- 0 duplicate Sanity asset groups.
- 2 duplicate source groups caused by draft/published document pairs.

### PUB-002 — Editorial Image Metadata Suggestions

Implemented and merged in PR #39 at commit `4fe2ace1db1a61f24d3e9cbb21b49c786dd6c4b8`.

The reviewed artifact reported:

- 40 records.
- 18 records with suggestions.
- 11 metadata-review-ready.
- 1 rights-review-required.
- 22 complete.
- 6 inactive.

The generator still needs canonical-record filtering so it excludes `drafts.*` document pairs.

### PUB-003 — Controlled Editorial Image Metadata Importer

Implemented and merged in PR #40 at commit `cd442f47eee73237f935bdad9848f789ca7c618d`.

The importer provides:

- review-decision JSON contract and schema
- dry-run default
- explicit `apply_changes` switch
- canonical-ID enforcement and draft-ID rejection
- inactive-record rejection
- allow-listed writable fields
- no-overwrite protection
- Markdown and JSON reports

The first dry run processed the example ID `media-candidate-example`. It correctly rejected it because the Sanity document did not exist. No metadata was applied. A second dry run using real reviewed Editorial Image IDs is required before any production write.

## Editorial Images

Editorial Images are managed in Sanity using:

- `editorialImage` document type
- Bulk Image Review tool
- Needs Review / Approved / Rejected queues
- original Rugby Panda uploads
- external candidate imports
- readiness audit
- metadata suggestions workflow
- controlled reviewed-metadata importer

Original Rugby Panda photography remains preferred.

Outstanding verification items remain in `docs/08_Issue_Log.md`, particularly `PUB-002`, `PUB-003`, `MEDIA-001`, `MEDIA-002`, `MEDIA-003`, and `CMS-002`.

## Brand Assets

Sprint 4 Brand Assets work is complete and verified in authenticated Sanity Studio.

Candidate logo URLs remain review references only. Public frontend logo use requires approved logo files uploaded into Sanity assets; external candidate URLs must never be hotlinked.

## Current article URL

`/articles/leinster-season-preview-2026`

## Current priorities

1. Confirm the current deployment and workflow state for PR #40.
2. Fix the metadata suggestions generator to exclude `drafts.*` records.
3. Build a real reviewed-decision file using canonical Sanity Editorial Image IDs.
4. Run the importer with `apply_changes=false` and review the report.
5. Run `apply_changes=true` only after a clean dry run.
6. Re-run the readiness audit and verify results in authenticated Sanity Studio.
7. Assign approved Editorial Images to current articles under `CMS-002`.
8. Build real website search under `WEB-005`.
9. Build article generation, review and scheduled publishing workflows.
10. Introduce Make.com incrementally as the orchestration layer without moving core business logic out of GitHub.

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
