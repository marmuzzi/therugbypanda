# Project State

## Current version

v0.9 — Editorial Engine Foundation

## Last updated

26 July 2026, after PR #67 production deployment.

## Source of truth

Read these files first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/10_New_Chat_Handoff.md`
5. `docs/11_Editorial_Image_Archive.md`
6. `docs/12_Brand_Assets_Library.md`
7. All later numbered documents relevant to the task, especially `docs/23_Make_Orchestration_Architecture.md`, `docs/24_Editorial_Image_Canonical_Metadata_Review.md`, `docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md`, `docs/26_Sprint_5_Editorial_Review_Refactor_Handoff.md` and `docs/27_Sprint_5_Production_State.md`.

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
- Deterministic Editorial Review Intelligence is merged.
- AI Editorial Review is merged.
- The Editorial Review refactor is merged and deployed.
- Latest verified `main` commit: `e934cc7ea8e2fe222eb1f4d06b131c717b5fefb1`.
- Latest Vercel production deployment for that commit is `READY`.

See `docs/27_Sprint_5_Production_State.md` for the exact production baseline.

## Editorial Review history

- PR #62 — deterministic review framework; merged.
- PR #63 — AI Editorial Review; merged.
- PR #64 — follow-up integration; merged but introduced a broken component.
- PR #66 — emergency repair; merged and restored production stability.
- PR #67 — maintainability refactor and QA improvements; merged and deployed.

Current AI-review behaviour preserves findings after edits, marks them **Out of date**, changes the action to **Run Review Again**, refreshes findings on rerun and clears findings when switching articles.

## Production mailboxes

- `admin@therugbypanda.ie` — infrastructure, billing, security, workflow failures and technical alerts.
- `hello@therugbypanda.ie` — public contact mailbox; add a website **Contact us** link using `mailto:hello@therugbypanda.ie`.
- `editor@therugbypanda.ie` — article-ready-for-review, approval, accreditation and media communication.

## Immediate priority

1. Add the public Contact link.
2. Add article-ready-for-review notifications to `editor@therugbypanda.ie`.
3. Add workflow failure and technical alerts to `admin@therugbypanda.ie`.
4. Continue persistent daily orchestration and automatic replacement after rejection.
5. Complete the nine-article launch package and verify it in production.
6. Implement analytics/accreditation and security/recovery baselines.

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
- Batch related work where practical to conserve Vercel deployments.
- Do not expose AI implementation references on reader-facing pages.