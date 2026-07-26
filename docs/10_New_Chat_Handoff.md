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

## Operating context

- Project owner timezone: `Europe/Dublin`.
- Daily target: eight review-ready drafts by 08:00 Europe/Dublin.
- Repository: `marmuzzi/therugbypanda`.
- Production: `https://therugbypanda.ie`.
- GitHub is the source of truth.
- Sanity is the mandatory human approval boundary.
- No AI-generated or acquired content is automatically approved or published.

## Current verified production baseline

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
- Latest verified `main` commit: `e934cc7ea8e2fe222eb1f4d06b131c717b5fefb1`.
- Latest production deployment for that commit is `READY`.

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

## Mailboxes

- `admin@therugbypanda.ie` — infrastructure, security, billing, workflow failures and technical alerts.
- `hello@therugbypanda.ie` — public contact mailbox.
- `editor@therugbypanda.ie` — article-ready-for-review and editorial/media communication.

## Immediate next tasks

1. Add **Contact us** using `mailto:hello@therugbypanda.ie`.
2. Notify `editor@therugbypanda.ie` when an article enters the Editorial Review queue.
3. Notify `admin@therugbypanda.ie` about workflow failures and technical alerts.
4. Continue persistent orchestration for eight drafts by 08:00.
5. Complete automatic rejection replacement verification.
6. Complete the nine-article launch package and production verification.
7. Implement analytics/accreditation and security/recovery baselines.

## Completion rule

Always distinguish implemented, committed, merged, deployed, verified in production, verified in authenticated Sanity Studio and documentation updated. A feature is not complete until the relevant verification has passed.

## Recommended continuation prompt

```text
Continue The Rugby Panda in marmuzzi/therugbypanda. Read docs/07_Project_State.md through docs/12_Brand_Assets_Library.md and all later relevant numbered documents, especially docs/27_Sprint_5_Production_State.md. Verify GitHub and Vercel before changing anything. Continue from the verified production baseline by implementing WEB-006, then NOTIFY-001 and NOTIFY-002. Keep Sanity as the mandatory human approval boundary, update the Issue Log, use small green PRs, merge when appropriate, and report implemented, committed, merged, deployed and verified separately.
```