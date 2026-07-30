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
- The project owner confirmed the post-merge production Vercel deployment completed successfully.
- Automatic Sanity Studio deployment remains operational, but authenticated verification of the PR #131 social-distribution fields is still pending.
- Real Sanity-backed website search is production verified.
- PR #142 increased the editorial API/OpenAI generation timeout.
- PR #143 removed the hidden 50-second generator clamp.
- PR #144 corrected the Sanity Studio review deep link.
- Controlled QA draft generation now succeeds.
- `NOTIFY-001 – New Draft Notification` is complete and production verified.
- AUTO-001 application-side morning-package foundation is implemented, merged and deployed, but not yet verified end-to-end.
- SOCIAL-001 application-side event and Sanity-field foundation is implemented, merged and deployed, but Meta/Make delivery is not configured or verified.

## NOTIFY-001 completed state

Verified production path:

```text
Editorial QA
→ Editorial API
→ OpenAI generation
→ Sanity draft
→ Make webhook
→ persistent eventId check
→ editorial email
→ persistent successful-event record
```

The Make scenario is named:

```text
NOTIFY-001 – New Draft Notification
```

Its verified module sequence is:

```text
Webhooks — Custom webhook
→ Data Store — Check the existence of a record
→ Filter — New event only / Exists = false
→ Email — Send an Email
→ Data Store — Add/replace a record
```

Data store:

```text
Rugby Panda Event Deduplication
```

Verified behaviour:

- the webhook receives `editorial.article.draft_created`;
- the email reaches `editor@therugbypanda.ie`;
- the email review link opens the intended Sanity draft;
- `eventId` is used as the data-store key;
- successful events are persisted only after email delivery;
- a duplicate replay returns `Exists = true`;
- the `New event only` filter processes zero bundles;
- no second email is sent and no second workflow record is written.

`NOTIFY-001` is closed. Failure and technical-alert routing belongs to `NOTIFY-002` and is still pending.

## PR #131 automation foundation

The application provides:

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

## Make.com state

- The Make account had previously been on the Free plan with a two-active-scenario limit; verify the current plan before creating additional active scenarios.
- Do not collapse separate workflows into one large scenario solely to remain under a plan limit.
- The current ChatGPT Make connector does not expose scenario editing, so scenario construction requires the Make interface unless new tools become available.
- `NOTIFY-001` is already configured and verified; do not rebuild it.

## Exact resume point

1. Verify the current Make plan and available active-scenario capacity.
2. Add `NOTIFY-002` failure routing to `admin@therugbypanda.ie`, or continue `AUTO-001 – Morning Editorial Package` if failure routing is intentionally deferred.
3. Create or reopen `AUTO-001 – Morning Editorial Package`.
4. Use `Webhooks → Custom webhook` named `Rugby Panda Daily Package`.
5. Click **Run once** so Make waits for a real event.
6. Trigger `POST https://therugbypanda.ie/api/editorial/daily-package` using the existing `EDITORIAL_AUTOMATION_SECRET`.
7. Capture the real `editorial.daily_package.ready` payload before mapping any fields.
8. If the endpoint returns `409`, verify whether five eligible Sanity drafts exist before treating it as an application defect.
9. Reuse the persistent deduplication pattern proven in NOTIFY-001, keyed by `eventId`.
10. Build one consolidated HTML email to `editor@therugbypanda.ie` containing five ordered articles.
11. Verify one correctly populated email, duplicate replay with no second email, and failure routing to `admin@therugbypanda.ie`.
12. Create the separate daily HTTP trigger scheduled for 07:50 Europe/Dublin.
13. Configure SOCIAL-001 only after AUTO-001 passes.

## Verification still pending

- authenticated Sanity Studio verification of PR #131 social controls;
- real AUTO-001 payload capture;
- successful packaging of exactly five eligible drafts;
- populated morning email delivery;
- duplicate package replay protection;
- failure-path verification;
- 07:50 schedule activation;
- three consecutive deliveries before 08:00;
- overnight acquisition and generation producing five eligible drafts;
- controlled Facebook and Instagram test posts;
- platform ID writeback;
- social opt-out verification;
- independent retry after partial platform failure.

## Completion rule

Always distinguish implemented, committed, merged, deployed, verified in production, verified in authenticated Sanity Studio, verified in Make.com and documentation updated. A feature is not complete until its relevant verification has passed.

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
- PRs #142, #143 and #144 are merged and deployed.
- Controlled QA article generation succeeds.
- NOTIFY-001 is complete and verified in Make, including persistent eventId deduplication, successful email delivery, working Sanity review link and duplicate replay protection.
- Sanity remains the mandatory human approval boundary.
- AUTO-001 application-side foundation is deployed, but the Morning Editorial Package Make workflow is not verified end-to-end.
- SOCIAL-001 application-side foundation is deployed, but Meta/Make publishing is not configured.
- Vercel contains EDITORIAL_AUTOMATION_SECRET, EDITORIAL_DAILY_PACKAGE_WEBHOOK_URL and EDITORIAL_DAILY_PACKAGE_WEBHOOK_SECRET for Production and Preview.

Do not rebuild NOTIFY-001. First verify the current Make plan, then add NOTIFY-002 failure routing or continue AUTO-001. Capture the real editorial.daily_package.ready payload, reuse the proven eventId deduplication pattern, deliver one consolidated populated email, replay the same event to prove no duplicate email, verify failure routing, and only then configure the 07:50 Europe/Dublin trigger and SOCIAL-001.

Keep the Issue Log and handoff documentation current. Report implemented, committed, PR, merged, deployed, production verified, authenticated Sanity Studio verified and Make/Meta verified as separate statuses.
```
