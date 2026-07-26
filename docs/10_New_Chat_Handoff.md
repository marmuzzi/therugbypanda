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
7. All later numbered documents relevant to the work, especially `docs/23_Make_Orchestration_Architecture.md`, `docs/24_Editorial_Image_Canonical_Metadata_Review.md`, `docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md`, `docs/26_Sprint_5_Editorial_Review_Refactor_Handoff.md` and `docs/27_Sprint_5_Production_State.md`.

Then check all available connectors before asking the user to configure anything.

Do not rely on chat history for current status.

## User execution instruction

When the project owner says **Proceed**, it is an execution command.

- Continue the agreed implementation immediately.
- Do not restate the plan or begin another strategy discussion.
- Use the available project tools and connectors to make the change.
- Report only completed work, verification results and genuine blockers that require a decision.
- Never claim that a repository, deployment or external-system change was made unless it was actually executed and verified at the appropriate level.

## Operating context

- Project owner timezone: `Europe/Dublin`.
- Daily target: eight review-ready drafts by 08:00 Europe/Dublin.
- Repository: `marmuzzi/therugbypanda`.
- Production: `https://therugbypanda.ie`.
- GitHub is the source of truth.
- Sanity is the mandatory human approval boundary.
- No AI-generated or acquired content is automatically approved or published.

## Current verified repository baseline

- Sprint 4 is complete.
- Sprint 5 is in progress.
- Editorial Brain and source-linked fact ledger are merged.
- OpenAI structured generation and protected Sanity draft creation are merged.
- Approved Editorial Image assignment is merged.
- Controlled submit, approve, reject, publish and discard workflow is merged.
- Authenticated Sanity Editorial Review workspace is implemented.
- Deterministic Editorial Review Intelligence is merged.
- AI Editorial Review is merged.
- Editorial Review component refactor is merged and deployed.
- PR #81 — real Sanity-backed website search — is merged and was reported production verified.
- PR #82 — editorial review notification webhook foundation — is merged.
- GitHub `main` is `39f8e1ddc7ff3d31f07bc3879f2dbeac031360e7`.
- The Make.com MCP toolbox is connected; the temporary Health Check tool executed successfully on 26 July 2026.
- Fresh Vercel production verification against current `main` is required before claiming the latest deployment is verified.
- NOTIFY-001 remains pending end-to-end configuration and verification.

See `docs/27_Sprint_5_Production_State.md` for exact details.

## Editorial Review behaviour

The workspace contains Review Queue, Draft Editor, Editorial Review Summary, AI Editorial Review, Featured Image, Sources, Fact Ledger, Workflow and Audit History panels.

AI findings remain visible after relevant edits, become marked **Out of date**, and the action changes to **Run Review Again**. Rerunning refreshes findings. Switching articles clears findings from the previous article.

Controlled QA terminology uses **drop goal**.

## Relevant PR history

- PR #63 — AI Editorial Review; merged.
- PR #64 — follow-up integration; merged but introduced a broken Editorial Review component.
- PR #66 — emergency repair; merged and restored production stability.
- PR #67 — Editorial Review refactor and QA improvements; merged and deployed.
- PR #81 — real website search; merged and previously production verified.
- PR #82 — review-ready notification webhook foundation; merged, not yet verified end-to-end.

## Mailboxes

- `admin@therugbypanda.ie` — infrastructure, security, billing, workflow failures and technical alerts.
- `hello@therugbypanda.ie` — public contact mailbox.
- `editor@therugbypanda.ie` — article-ready-for-review and editorial/media communication.

## Immediate next tasks

1. Verify the latest Vercel production deployment and production environment configuration.
2. Replace the temporary Make Health Check with production-ready Rugby Panda tools/scenarios where supported.
3. Configure NOTIFY-001 in Make.
4. Execute one controlled submit-to-review test and confirm one email reaches `editor@therugbypanda.ie`.
5. Replay the same event and verify duplicate protection.
6. Confirm notification delivery cannot approve or publish and Sanity remains the human boundary.
7. Notify `admin@therugbypanda.ie` about workflow failures and technical alerts.
8. Continue persistent orchestration for eight drafts by 08:00.
9. Complete automatic rejection replacement verification.
10. Complete the nine-article launch package and production verification.

## Completion rule

Always distinguish implemented, committed, merged, deployed, verified in production, verified in authenticated Sanity Studio and documentation updated. A feature is not complete until the relevant verification has passed.

## Recommended continuation prompt

```text
Continue The Rugby Panda in marmuzzi/therugbypanda. Read docs/07_Project_State.md through docs/12_Brand_Assets_Library.md and all later relevant numbered documents, especially docs/27_Sprint_5_Production_State.md. Verify GitHub, Vercel and the connected Make toolbox before changing anything. Continue NOTIFY-001 from PR #82 by configuring Make and Vercel, running a controlled submit, confirming exactly one email to editor@therugbypanda.ie, verifying duplicate protection and preserving Sanity as the mandatory human approval boundary. Keep the Issue Log current and report implemented, committed, merged, deployed and verified separately.
```
