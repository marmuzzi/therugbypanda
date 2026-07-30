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
7. All later numbered documents relevant to the work, especially `docs/23_Make_Orchestration_Architecture.md`, `docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md`, `docs/27_Sprint_5_Production_State.md`, `docs/33_Version_1_Product_Roadmap.md` and `docs/34_2026-07-29_Automation_Handoff.md`.

Then check GitHub, Vercel deployment status and all available connectors before asking the user to configure anything. Do not rely on chat history for current status.

## User execution instruction

When the project owner says **Proceed**, it is an execution command.

- Continue the agreed implementation immediately.
- Do not restart strategy discussion.
- Use available project tools and connectors.
- Report completed work, verification and genuine blockers only.
- Never claim a change was made unless it was executed and verified at the appropriate level.

## Operating context

- Project owner timezone: `Europe/Dublin`.
- Daily operating target: five review-ready drafts and one consolidated editorial email by 08:00 Europe/Dublin.
- Repository: `marmuzzi/therugbypanda`.
- Production: `https://therugbypanda.ie`.
- GitHub is the source of truth.
- Sanity is the mandatory human approval boundary.
- No AI-generated or acquired content is automatically approved or published.
- Facebook and Instagram distribution may occur only after a deliberate controlled publish action.

## Current verified baseline

- Sprint 4 is complete; Sprint 5 is in progress.
- PR #131, **Add daily editorial package and social distribution foundation**, is merged into `main`.
- PR #131 merge commit: `466c8f1831d7f95b6707fb85789fa2f0fab45316`.
- The PR preview Vercel build was green.
- The project owner confirmed the post-merge production Vercel deployment completed successfully.
- Automatic Sanity Studio deployment remains operational, but authenticated verification of the new social-distribution fields is still pending.
- Real Sanity-backed website search is production verified.
- The review-ready webhook reaches Make and a test email reached `editor@therugbypanda.ie`.
- NOTIFY-001 remains pending correctly populated production field mapping, persistent `eventId` deduplication, duplicate replay and failure-path verification.
- AUTO-001 application-side morning-package foundation is implemented, merged and deployed, but not yet verified end-to-end.
- SOCIAL-001 application-side event and Sanity-field foundation is implemented, merged and deployed, but Meta/Make delivery is not configured or verified.

## PR #131 automation foundation

The application now provides:

- authenticated `POST /api/editorial/daily-package`;
- selection and webhook delivery of five eligible Sanity drafts;
- HTTP `409` when fewer than five eligible drafts exist;
- controlled `editorial.article.published` events after successful website publication;
- article-level social opt-out, Facebook and Instagram copy overrides, hashtags, delivery status, post IDs and errors;
- isolation of social-delivery failures from successful website publication.

The package endpoint does not generate the five articles. Overnight acquisition and article generation remain separate orchestration work.

## Vercel configuration completed

Configured for Production and Preview:

- `EDITORIAL_AUTOMATION_SECRET`;
- `EDITORIAL_DAILY_PACKAGE_WEBHOOK_URL`;
- `EDITORIAL_DAILY_PACKAGE_WEBHOOK_SECRET`.

The project was redeployed after the daily-package variables were added. Secret values and webhook URLs must never be committed.

## Make.com state and blocker

- The Make account is currently on the Free plan.
- The Free plan allows two active scenarios.
- `AUTO-001 – Morning Editorial Package` would be the third active scenario.
- The project owner agreed that Make must be upgraded, with Core recommended.
- Do not collapse separate workflows into one large scenario solely to remain under the Free-plan limit.
- The current ChatGPT Make connector does not expose scenario editing, so scenario construction requires the Make interface unless new tools become available.

## Exact resume point

1. Upgrade Make to a plan that permits more than two active scenarios.
2. Create or reopen `AUTO-001 – Morning Editorial Package`.
3. Use `Webhooks → Custom webhook` named `Rugby Panda Daily Package`.
4. Click **Run once** so Make waits for a real event.
5. Trigger `POST https://therugbypanda.ie/api/editorial/daily-package` using the existing `EDITORIAL_AUTOMATION_SECRET`.
6. Capture the real `editorial.daily_package.ready` payload before mapping any fields.
7. If the endpoint returns `409`, verify whether five eligible Sanity drafts exist before treating it as an application defect.
8. Add persistent deduplication keyed by `eventId`.
9. Build one consolidated HTML email to `editor@therugbypanda.ie`.
10. Verify one correctly populated email, duplicate replay with no second email, and failure routing to `admin@therugbypanda.ie`.
11. Create the separate daily HTTP trigger scheduled for 07:50 Europe/Dublin.
12. Configure SOCIAL-001 only after AUTO-001 passes.

## Verification still pending

- authenticated Sanity Studio verification of PR #131 social controls;
- real AUTO-001 payload capture;
- successful packaging of exactly five eligible drafts;
- populated morning email delivery;
- persistent duplicate-event protection;
- failure-path verification;
- 07:50 schedule activation;
- three consecutive deliveries before 08:00;
- overnight acquisition and generation producing five eligible drafts;
- controlled Facebook and Instagram test posts;
- platform ID writeback;
- social opt-out verification;
- independent retry after partial platform failure.

## Completion rule

Always distinguish implemented, committed, merged, deployed, verified in production, verified in authenticated Sanity Studio and documentation updated. A feature is not complete until its relevant verification has passed.

## Recommended continuation prompt

```text
Continue The Rugby Panda in repository marmuzzi/therugbypanda.

Before doing anything else, read the repository documentation and use it as the single source of truth. Read in this order:

1. docs/07_Project_State.md
2. docs/08_Issue_Log.md
3. docs/09_Publishing_Workflow.md
4. docs/10_New_Chat_Handoff.md
5. docs/11_Editorial_Image_Archive.md
6. docs/12_Brand_Assets_Library.md
7. docs/23_Make_Orchestration_Architecture.md
8. docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md
9. docs/27_Sprint_5_Production_State.md
10. docs/33_Version_1_Product_Roadmap.md
11. docs/34_2026-07-29_Automation_Handoff.md

Do not rely on prior chat memory until those files have been read. Then verify the current GitHub main branch, Vercel deployment status and all available connectors.

Current expected state to verify:
- PR #131 is merged into main at merge commit 466c8f1831d7f95b6707fb85789fa2f0fab45316.
- The project owner confirmed the production Vercel deployment completed successfully.
- The daily operating target is five review-ready drafts and one consolidated email to editor@therugbypanda.ie by 08:00 Europe/Dublin.
- Sanity remains the mandatory human approval boundary.
- AUTO-001 application-side foundation is deployed, but Make is not configured end-to-end.
- SOCIAL-001 application-side foundation is deployed, but Meta/Make publishing is not configured.
- The Make account is on the Free plan and the third active scenario requires an upgrade.
- Vercel already contains EDITORIAL_AUTOMATION_SECRET, EDITORIAL_DAILY_PACKAGE_WEBHOOK_URL and EDITORIAL_DAILY_PACKAGE_WEBHOOK_SECRET for Production and Preview.

First continue AUTO-001. Confirm whether Make has been upgraded. Then create or reopen the Morning Editorial Package scenario, capture the real editorial.daily_package.ready payload, add persistent eventId deduplication, deliver one consolidated populated email, replay the same event to prove no duplicate email, verify failure routing, and only then configure the 07:50 Europe/Dublin trigger and SOCIAL-001.

Keep the Issue Log and handoff documentation current. Report implemented, committed, PR, merged, deployed, production verified, authenticated Sanity Studio verified and Make/Meta verified as separate statuses.
```