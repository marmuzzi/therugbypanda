# Project State

## Current version

v0.9 — Editorial Engine Foundation

## Last updated

26 July 2026, after PR #91 merge, successful Vercel deployment and authenticated mobile Sanity Studio verification.

## Source of truth

Read these files first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/10_New_Chat_Handoff.md`
5. `docs/11_Editorial_Image_Archive.md`
6. `docs/12_Brand_Assets_Library.md`
7. All later numbered documents relevant to the task, especially `docs/23_Make_Orchestration_Architecture.md`, `docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md`, `docs/27_Sprint_5_Production_State.md`, `docs/31_NOTIFY_001_Desktop_Completion_Handoff.md` and `docs/32_Sprint_5_State_After_PR_91.md`.

Do not rely on chat history for current status.

## Operating context

- Timezone: `Europe/Dublin`.
- Daily editorial deadline: 08:00 Europe/Dublin.
- GitHub is the source of truth.
- Sanity is the canonical CMS and mandatory human approval boundary.
- No acquired or AI-generated content is automatically approved or published.

## Architecture

```text
GitHub source of truth
→ Make.com orchestration
→ Apify acquisition
→ Editorial Brain and OpenAI generation
→ Sanity canonical CMS and editorial review
→ Vercel public website
```

## Current production state

- Sprint 4 is complete.
- Sprint 5 Editorial & Publishing Automation is in progress.
- Editorial Brain, structured generation, approved-image assignment and controlled workflow endpoints are merged.
- The authenticated Sanity Editorial Review workspace is implemented.
- Deterministic Editorial Review Intelligence and on-demand AI Editorial Review are merged.
- Real Sanity-backed website search is merged and production verified.
- The review-ready notification webhook foundation is merged and reaches Make.
- The Make.com MCP toolbox is connected, but the currently exposed toolset does not permit scenario editing.
- Current verified GitHub `main` commit: `bb3c3fcc08f9d95bc35f2b39cd6dfd76b7cf74ec`.
- The Vercel deployment for this commit completed successfully.
- Automatic Sanity Studio deployment after merge is working.
- The project owner verified the PR #91 mobile Editorial Review result in authenticated Sanity Studio.

See `docs/32_Sprint_5_State_After_PR_91.md` for the exact current baseline.

## Editorial Review production state

Implemented, merged, deployed and authenticated-Studio verified through PR #91:

- Studio-session authentication; no browser-entered workflow secret.
- Restored submission and rejection note field.
- Draft queue includes manually created unpublished documents before workflow metadata exists.
- Raw draft-aware Sanity queries with supported `_id in path("drafts.**")` filtering.
- Mobile-first single-column layout.
- Article Quality first and AI Editorial Review immediately below it.
- Improved contrast and typography across quality findings, metadata, Sources, Fact Ledger and Workflow cards.
- Automatic hosted Studio deployment after relevant merges.

## Notification state

NOTIFY-001 is partially verified:

- controlled submit reaches the workflow API;
- Make receives the webhook;
- the payload contains stable IDs, article title, optional submission note and hosted review URL;
- a test email was delivered to `editor@therugbypanda.ie`.

NOTIFY-001 is not complete until a correctly populated production email, persistent `eventId` deduplication, replay protection and failure-path behaviour are verified.

## Production mailboxes

- `admin@therugbypanda.ie` — infrastructure, billing, security, workflow failures and technical alerts.
- `hello@therugbypanda.ie` — public contact mailbox.
- `editor@therugbypanda.ie` — article-ready-for-review, approval, accreditation and media communication.

## Immediate priority

1. Complete NOTIFY-001 email mapping and persistent deduplication.
2. Verify one correctly populated email and a duplicate replay that sends no second email.
3. Add workflow failure and technical alerts to `admin@therugbypanda.ie`.
4. Execute a complete controlled editorial lifecycle test through production rendering.
5. Continue persistent daily orchestration and automatic replacement after rejection.
6. Complete the nine-article launch package and verify it in production.
7. Implement analytics/accreditation and security/recovery baselines.

## Launch minimum

- One introduction article about The Rugby Panda.
- At least eight additional reviewed, image-backed articles.
- Coverage of recent internationals and Leinster, Munster, Ulster and Connacht.
- Correct publication dates.
- Production verification of homepage, category and article pages.

## Completion rule

Always distinguish:

- implemented;
- committed;
- merged;
- deployed;
- verified in production;
- verified in authenticated Sanity Studio;
- documentation updated.

A feature is not complete until the relevant verification has passed.

## Working principles

- Prefer maintainable reusable components.
- Keep `main` deployable.
- Keep `docs/08_Issue_Log.md` current.
- Batch related work where practical to conserve deployments.
- Do not expose AI implementation references on reader-facing pages.