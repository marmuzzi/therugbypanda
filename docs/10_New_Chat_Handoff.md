# New Chat Handoff

Use this file when continuing The Rugby Panda in a new chat.

## First actions

1. Read `docs/07_Project_State.md`.
2. Read `docs/08_Issue_Log.md`.
3. Read `docs/09_Publishing_Workflow.md`.
4. Read `docs/10_New_Chat_Handoff.md`.
5. Read `docs/11_Editorial_Image_Archive.md`.
6. Read `docs/12_Brand_Assets_Library.md`.
7. Read all later numbered documents, including `docs/23_Make_Orchestration_Architecture.md`.
8. Check available connectors before asking the user to configure anything.

Do not rely on chat history for current status.

## Connector expectations

Connector availability varies by session and must be checked each time.

Last verified on 23 July 2026:

- GitHub was available and write-capable.
- Vercel was available for deployment checks.
- Apify was not exposed in that session.
- Sanity was not exposed as a direct connector; GitHub Actions remain the reliable CMS automation path.
- Make.com was not connected.

## Agreed architecture

The project decision is:

```text
GitHub source of truth
→ Make.com orchestration
→ Apify acquisition
→ Sanity canonical CMS
→ Vercel public website
```

GitHub retains code, business logic, workflow definitions and documentation. Make.com should provide scheduling, webhooks, retries, notifications and service coordination. Do not move core business logic primarily into Make.com. Human editorial approval remains mandatory before metadata application or publishing.

See `docs/23_Make_Orchestration_Architecture.md`.

## Current handoff status

Sprint 4 is complete. Sprint 5 Editorial & Publishing Automation is in progress.

The verified media workflow is:

```text
Discovery / acquisition
→ GitHub candidate JSON
→ GitHub Action import
→ Sanity candidate records
→ Review tool
→ Manual approval / rejection / archive
→ Approved CMS records
```

## Sprint 5 completed and current work

### PUB-001 — Editorial Image Readiness Audit

- Merged in PR #38.
- Workflow run `29208191194` succeeded.
- 40 records audited.
- 22 publication-ready.
- 18 needing attention.
- 34 approved/published.
- 12 approved/published but not ready.
- 0 duplicate asset groups.
- 2 duplicate source groups caused by draft/published pairs.

### PUB-002 — Editorial Image Metadata Suggestions

- Merged in PR #39 at commit `4fe2ace1db1a61f24d3e9cbb21b49c786dd6c4b8`.
- Artifact reviewed.
- 40 records processed.
- 18 records had suggestions.
- 11 metadata-review-ready.
- 1 rights-review-required.
- 22 complete.
- 6 inactive.
- The generator still needs to exclude `drafts.*` records and emit canonical records only.

### PUB-003 — Controlled Reviewed Metadata Importer

- Merged in PR #40 at commit `cd442f47eee73237f935bdad9848f789ca7c618d`.
- Includes a review-decision contract and schema, dry-run default, explicit apply flag, draft-ID rejection, inactive-record rejection, allow-listed fields, no-overwrite protection and reports.
- The first dry run used the example record ID `media-candidate-example`.
- It correctly rejected the nonexistent record with `Editorial Image not found`.
- Applied changes: 0.
- No Sanity mutation occurred.
- This validates the rejection path only; it does not validate a real metadata update.

## Exact next steps

1. Check current GitHub, Vercel, Apify, Sanity and Make.com connector availability.
2. Confirm the current production deployment and workflow state for PR #40.
3. Fix the metadata suggestions generator so it excludes `drafts.*` records.
4. Generate a real review-decision file using canonical production Editorial Image IDs.
5. Run `Apply Reviewed Editorial Image Metadata` with `apply_changes=false`.
6. Inspect the generated report and confirm proposed changes and skips.
7. Run `apply_changes=true` only after a clean dry run and explicit editorial review.
8. Re-run the Editorial Image Readiness Audit.
9. Verify the updated records in authenticated Sanity Studio.
10. Continue with approved Editorial Image assignment to articles under `CMS-002`.
11. Introduce Make.com incrementally as orchestration, without moving core logic out of GitHub.

## Current open issues

See `docs/08_Issue_Log.md` for canonical status.

Highest priority:

- `PUB-002`: canonical-only metadata suggestions.
- `PUB-003`: real-record dry run, reviewed apply and Sanity verification.
- `CMS-002`: assign approved featured images to articles.
- `MEDIA-001`, `MEDIA-002`, `MEDIA-003`: reconcile final Studio/report counts.
- `WEB-005`: implement real search.

## Production and verification rules

Always distinguish:

- implemented
- committed
- merged
- deployed
- verified in production
- verified in authenticated Sanity Studio
- documentation updated

A feature is not complete until the relevant production or authenticated-Studio verification has happened.

## Deployment budget rule

The Vercel free plan has a maximum of 100 deployments per day. Treat every deployment as constrained.

Default workflow:

1. Batch related work into a single branch.
2. Open one PR where possible.
3. Use one preview deployment where possible.
4. Merge automatically when preview/build is clean and scope is agreed.
5. Use one production deployment.
6. Verify once in production.

## Recommended next chat prompt

```text
Continue The Rugby Panda in repository marmuzzi/therugbypanda. Read docs/07_Project_State.md, docs/08_Issue_Log.md, docs/09_Publishing_Workflow.md, docs/10_New_Chat_Handoff.md, docs/11_Editorial_Image_Archive.md, docs/12_Brand_Assets_Library.md, and all later numbered docs including docs/23_Make_Orchestration_Architecture.md. Use them as the source of truth. Check all currently available connectors before doing anything else. Then continue Sprint 5 from PUB-003: verify PR #40 workflow/deployment state, fix the metadata suggestions generator to exclude drafts.*, create a real canonical-ID review decision file, run a dry run, review it, apply only if clean, rerun the readiness audit, verify in Sanity Studio, and continue CMS-002 image assignment. Keep documentation and the Issue Log current, and report implemented, committed, merged, deployed, verified, documentation updated, blockers and next step separately.
```
