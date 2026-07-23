# New Chat Handoff

Use this file when continuing The Rugby Panda in a new chat.

## First actions

1. Read `docs/07_Project_State.md`.
2. Read `docs/08_Issue_Log.md`.
3. Read `docs/09_Publishing_Workflow.md`.
4. Read `docs/10_New_Chat_Handoff.md`.
5. Read `docs/11_Editorial_Image_Archive.md`.
6. Read `docs/12_Brand_Assets_Library.md`.
7. Read all later numbered documents, including `docs/23_Make_Orchestration_Architecture.md`, `docs/24_Editorial_Image_Canonical_Metadata_Review.md` and `docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md`.
8. Check all currently available connectors before asking the user to configure anything.

Do not rely on chat history for current status.

## User context and timezone

- The project owner is based in Dublin, Ireland.
- Use `Europe/Dublin` for all schedules, deadlines and reports.
- The daily review target is eight drafts available by 08:00 Europe/Dublin.

## Connector expectations

Connector availability varies by session and must be checked each time.

Last verified during the 23–24 July 2026 session:

- GitHub was available and write-capable.
- Vercel was available for deployment and production checks.
- Apify was available.
- Sanity direct connector was available for authenticated production data queries.
- Make.com was not connected.

## Agreed architecture

```text
GitHub source of truth
→ Make.com orchestration
→ Apify acquisition
→ Editorial Brain and OpenAI generation
→ Sanity canonical CMS and human review
→ Vercel public website
```

GitHub retains code, business logic, prompts, workflow definitions and documentation. Make.com should provide scheduling, retries, notifications and service coordination. Apify discovers approved-scope candidates. The Editorial Brain validates facts and originality. OpenAI generates structured drafts. Sanity remains the mandatory human approval boundary.

## Current handoff status

Sprint 4 is complete. Sprint 5 Editorial & Publishing Automation is in progress.

The core editorial engine is now merged into `main` through four pull requests:

### PR #47 — Editorial Brain core

- structured input/output contracts;
- rugby story classification and scoring;
- source-linked fact ledger with confidence controls;
- The Rugby Panda editorial voice and originality rules;
- responsible speculation support while preserving uncertainty;
- mandatory human approval.

### PR #48 — OpenAI and Sanity draft pipeline

- OpenAI Responses API structured article generation;
- protected `POST /api/editorial/draft` endpoint;
- Sanity Portable Text conversion;
- create-or-replace Sanity draft behaviour;
- support for `SANITY_API_TOKEN` and legacy `SANITY_AUTH_TOKEN`;
- OpenAI response storage disabled;
- bearer protection with `EDITORIAL_AUTOMATION_SECRET`.

### PR #49 — Approved Editorial Image assignment

- existing `article.featuredImage` confirmed as the canonical frontend contract;
- optional `editorialImageId` accepted by the draft endpoint;
- only usage-approved, approved/published records backed by a Sanity asset may be assigned;
- reviewed alt text, caption, public credit and rights metadata copied into the article draft;
- unavailable or unapproved assignments rejected.

### PR #50 — Controlled editorial review workflow

- protected `POST /api/editorial/workflow` endpoint;
- supported actions: `submit`, `approve`, `reject`, `publish`, `discard`;
- server-side state-transition validation;
- actor, timestamp, notes and status audit history;
- rejection count and replacement-required tracking;
- controlled publish through a Sanity transaction.

PR #50 merged successfully at commit `70916d5bd9070f1c77cf92e3f767722d68b1cbf2`.

## Important completion distinction

The editorial backend is implemented and merged. It is not yet fully verified operationally.

Still required:

- authenticated Sanity Studio review workspace;
- one end-to-end test from candidate through production publication;
- automatic replacement generation after rejection;
- persistent daily orchestration.

## Exact next steps

1. Build the Sanity Studio editorial review workspace for `AUTO-001`.
2. Expose the fact ledger, confidence information, sources, assigned image, audit history and review notes.
3. Add state-appropriate submit, approve, reject, publish and discard actions without bypassing the protected workflow.
4. Implement `AUTO-002` automatic replacement generation from the replacement-required state.
5. Prevent reuse of the rejected angle and source set.
6. Run authenticated Studio tests for approve, reject and publish.
7. Run one controlled production publication and verify homepage, category and article routes.
8. Assign approved Editorial Images to existing published articles under `CMS-002`.
9. Create and review the nine-article launch package under `LAUNCH-001`.
10. Begin `ACCRED-001` analytics and accreditation evidence implementation.

Estimated build time discussed with the user:

- Sanity Studio review workspace: approximately 1–2 focused hours if integration is straightforward.
- Automatic replacement generation: approximately 1 focused hour.
- Combined realistic working session: approximately 2–3 hours, excluding unexpected connector, deployment or schema issues.

These are estimates, not guarantees. Preserve the distinction between implementation and verification.

## Accreditation and analytics requirement

The user explicitly stated that analytics is very important and that the project must show proof of:

- a consistent publishing track record;
- verifiable traffic metrics;
- established readership.

This requirement is tracked as `ACCRED-001` and GitHub issue #51. Treat it as a core architectural objective for accreditation, sponsors and advertisers. The future evidence pack must include durable publication history, editorial audit trail, GA4, Search Console, article-level metrics, returning readership, traffic sources and reproducible monthly exports.

## Current open priorities

See `docs/08_Issue_Log.md` for canonical status.

Highest priority:

- `AUTO-001`: Studio review workspace and end-to-end verification.
- `AUTO-002`: automatic rejected-draft replacement.
- `CMS-002`: assign approved featured images to existing and launch articles.
- `LAUNCH-001`: complete and publish the minimum launch package.
- `ACCRED-001`: analytics and accreditation evidence baseline.
- `SEC-001`: security, backups and tested recovery.
- `AUTO-003`: eight review-ready drafts by 08:00 Europe/Dublin.

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

The Vercel free plan has a maximum of 100 deployments per day. Batch related work into a single branch and one production deployment where practical.

## Recommended next chat prompt

```text
Continue The Rugby Panda in repository marmuzzi/therugbypanda. The owner is based in Dublin, Ireland, so use Europe/Dublin for all schedules and deadlines. Read docs/07_Project_State.md, docs/08_Issue_Log.md, docs/09_Publishing_Workflow.md, docs/10_New_Chat_Handoff.md, docs/11_Editorial_Image_Archive.md, docs/12_Brand_Assets_Library.md, and all later numbered documents including docs/23_Make_Orchestration_Architecture.md, docs/24_Editorial_Image_Canonical_Metadata_Review.md and docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md. Use them as the source of truth and check all available connectors first. Then continue AUTO-001 by building the authenticated Sanity Studio editorial review workspace over the workflow merged in PR #50. After that implement AUTO-002 automatic replacement generation, preventing reuse of rejected angles and source sets. Keep documentation and the Issue Log current, and report implemented, committed, merged, deployed, verified and documentation updated separately.
```
