# New Chat Handoff

Use this file when continuing The Rugby Panda in a new chat.

## First actions

Read, in order:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/10_New_Chat_Handoff.md`
5. `docs/11_Editorial_Image_Archive.md`
6. `docs/12_Brand_Assets_Library.md`
7. All later numbered documents relevant to the work, especially `docs/23_Make_Orchestration_Architecture.md`, `docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md`, `docs/27_Sprint_5_Production_State.md`, `docs/31_NOTIFY_001_Desktop_Completion_Handoff.md` and `docs/32_Sprint_5_State_After_PR_91.md`.

Then check all available connectors before asking the user to configure anything. Do not rely on chat history for current status.

## User execution instruction

When the project owner says **Proceed**, it is an execution command.

- Continue the agreed implementation immediately.
- Do not restart strategy discussion.
- Use available project tools and connectors.
- Report completed work, verification and genuine blockers only.
- Never claim a change was made unless it was executed and verified at the appropriate level.

## Operating context

- Project owner timezone: `Europe/Dublin`.
- Daily target: eight review-ready drafts by 08:00 Europe/Dublin.
- Repository: `marmuzzi/therugbypanda`.
- Production: `https://therugbypanda.ie`.
- GitHub is the source of truth.
- Sanity is the mandatory human approval boundary.
- No AI-generated or acquired content is automatically approved or published.

## Current verified baseline

- Sprint 4 is complete; Sprint 5 is in progress.
- Current verified `main`: `bb3c3fcc08f9d95bc35f2b39cd6dfd76b7cf74ec` (PR #91 merge).
- The associated Vercel deployment completed successfully.
- Automatic Sanity Studio deployment after merge is working.
- The project owner verified the PR #91 mobile Editorial Review result in authenticated Studio.
- Real Sanity-backed website search is production verified.
- The review-ready webhook reaches Make.
- A test email reached `editor@therugbypanda.ie`.
- NOTIFY-001 remains pending correct production field mapping, persistent `eventId` deduplication, duplicate replay and failure-path verification.
- The currently exposed Make connector does not allow scenario editing.

## Editorial Review behaviour

The workspace contains Review Queue, Draft Editor, Editorial Review Summary, AI Editorial Review, Featured Image, Sources, Fact Ledger, Workflow and Audit History panels.

Current verified behaviour includes:

- Studio-session authentication without a browser-entered automation secret.
- Submission/rejection notes with mandatory rejection reason.
- Manually created unpublished drafts appear before workflow metadata exists.
- Raw, draft-aware Sanity querying with `_id in path("drafts.**")`.
- Article Quality first on mobile and AI Editorial Review immediately below it.
- Improved mobile contrast across findings, metadata, Sources, Fact Ledger and Workflow fields.
- AI findings become **Out of date** after relevant edits and can be rerun.

## Relevant recent PRs

- PR #84 — Studio-session authentication and workflow note restoration.
- PR #85 — notification delivery observability.
- PR #86 — manual-draft queue support and automatic Studio deployment.
- PR #87 — raw draft perspective.
- PR #88 — supported Sanity draft path filter.
- PR #89 — enriched NOTIFY-001 payload and desktop Make handoff.
- PR #90 — mobile quality-panel readability.
- PR #91 — remaining mobile card and workflow-field contrast.

## Immediate next tasks

1. Complete NOTIFY-001 field mapping and persistent deduplication in Make.
2. Confirm one correctly populated email and a duplicate replay with no second email.
3. Verify notification failure does not alter successful Sanity workflow state.
4. Add NOTIFY-002 technical alerts to `admin@therugbypanda.ie`.
5. Run a complete controlled editorial lifecycle through production rendering.
6. Continue persistent orchestration, rejection replacement and the nine-article launch package.

## Completion rule

Always distinguish implemented, committed, merged, deployed, verified in production, verified in authenticated Sanity Studio and documentation updated. A feature is not complete until its relevant verification has passed.

## Recommended continuation prompt

```text
Continue The Rugby Panda in marmuzzi/therugbypanda. Read docs/07_Project_State.md through docs/12_Brand_Assets_Library.md and all later relevant numbered documents, especially docs/32_Sprint_5_State_After_PR_91.md. Verify GitHub, Vercel and available Make tools before changing anything. Continue NOTIFY-001 by completing correct email mapping, persistent eventId deduplication, duplicate replay and failure-path verification while preserving Sanity as the mandatory human approval boundary. Keep the Issue Log current and report implemented, committed, merged, deployed and verified separately.
```