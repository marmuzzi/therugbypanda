# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

17 August 2026, after NOTIFY-002 technical-alert routing was production verified and the temporary verification mechanism was scheduled for removal in PR #152.

## Source of truth

Read first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/10_New_Chat_Handoff.md`
5. `docs/11_Editorial_Image_Archive.md`
6. `docs/12_Brand_Assets_Library.md`
7. `docs/23_Make_Orchestration_Architecture.md`
8. `docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md`
9. `docs/27_Sprint_5_Production_State.md`
10. `docs/33_Version_1_Product_Roadmap.md`
11. `docs/34_2026-07-29_Automation_Handoff.md`
12. all newer numbered handoff, automation, Sprint, launch and FinOps documents relevant to the task.

Where an older historical document conflicts with this reconciled state or a later approved contract, the newer reconciled state wins. Do not rely on chat history for current status.

## Operating context

- Timezone: `Europe/Dublin`.
- Daily editorial deadline: 08:00 Europe/Dublin.
- Daily target: five review-ready drafts and one consolidated editorial email.
- GitHub is the source of truth for versioned project state.
- Sanity is the canonical CMS and mandatory human approval boundary.
- No acquired or AI-generated content is automatically approved or published.
- Original Rugby Panda photography is the preferred image source.
- Third-party photographs require documented rights or explicit permission.

## Architecture

```text
GitHub source of truth
→ Make.com orchestration
→ Apify acquisition
→ Editorial Brain and OpenAI generation
→ Sanity canonical CMS and human editorial review
→ Vercel public website
→ Meta social distribution only after controlled publication
```

## Reconciled live baseline — 17 August 2026

- Production is healthy on Vercel.
- `https://therugbypanda.ie` renders the launch introduction as the lead article.
- The live top-level navigation is News, Provinces, URC, International and About.
- The live homepage currently has no additional published newsroom articles beneath the introduction.
- Direct Sanity production read access is available from the current chat environment.
- The Rugby Panda Make connector is connected and its health check executes, but the currently exposed toolset does not permit scenario editing.
- Apify is directly available.
- No direct Meta/Facebook/Instagram project connector is currently exposed in chat.
- NOTIFY-001 and NOTIFY-002 are both production verified.

## Editorial production state

Implemented, merged and deployed capabilities include Editorial Brain classification/scoring and source-linked fact ledger; OpenAI structured generation and protected Sanity draft creation; approved Editorial Image assignment; protected approve/reject/publish/discard transitions; authenticated Sanity Editorial Review; deterministic quality gates; on-demand AI review; real Sanity-backed website search; daily-package application foundation; and post-publication social event/Sanity-field foundation.

The editorial experience is deliberately simple:

```text
Draft
→ human review / edit
→ Publish
```

There is no separate `ready for review` approval gate.

## NOTIFY-001 — complete

`NOTIFY-001 – New Draft Notification` is closed and production verified.

```text
Editorial generation
→ Sanity draft
→ editorial.article.draft_created
→ Make webhook
→ persistent eventId duplicate check
→ email to editor@therugbypanda.ie
→ successful event record
```

Verified behaviour includes successful controlled generation, correct email delivery, a working Sanity draft deep link, persistent `eventId` storage and duplicate replay protection with no second email.

## NOTIFY-002 — complete

`NOTIFY-002 - Technical Alerts` is closed and production verified.

Final verified Make topology:

```text
Custom webhook
→ Data Store: Check the existence of a record
→ filter: New event only / Exists = false
→ Send an Email to admin@therugbypanda.ie
→ Data Store: Add/replace a record
```

It uses the existing persistent `Rugby Panda Event Deduplication` Data Store with incoming `eventId` as the key. Successful records use status `technical_alert_sent`. The record is written only after successful email delivery.

Verification completed on 17 August 2026:

- controlled Make send succeeded;
- duplicate replay was blocked and sent no second email;
- `EDITORIAL_TECHNICAL_ALERT_WEBHOOK_URL` was configured in Vercel with a rotated webhook URL;
- the production application failure path was invoked through the protected daily-package endpoint;
- the real production package delivery failed with `responseStatus: 410` and returned `technicalAlertStatus: sent`;
- the technical-alert email was received at `admin@therugbypanda.ie`;
- temporary browser/Preview verification code is removed by PR #152 after verification.

## AUTO-001 / AUTO-003 — next critical work

The application-side Morning Editorial Package foundation is merged and deployed.

`POST /api/editorial/daily-package` selects five eligible Sanity drafts, emits `editorial.daily_package.ready`, and routes failures through the now-production-verified NOTIFY-002 technical-alert path.

Still required before completion:

1. capture a real five-article payload in Make;
2. deliver one correctly populated consolidated email to `editor@therugbypanda.ie`;
3. persist and deduplicate the package `eventId`;
4. replay the same package and prove no second email is sent;
5. activate the daily trigger around 07:50–07:55 Europe/Dublin;
6. complete overnight acquisition/generation so five eligible drafts exist;
7. deliver five review-ready drafts before 08:00 for three consecutive days.

The package endpoint packages eligible drafts; it does not generate them.

## SOCIAL-001 — foundation only

The application-side social-distribution contract is merged and deployed, but Facebook/Instagram publishing is not Meta/Make production verified. Social distribution may run only after deliberate controlled website publication, must respect the Sanity opt-out, require a usable image, deduplicate on `eventId`, record platform results back to Sanity and never roll back successful website publication.

## Dependabot maintenance state

- PR #146 is open and its Vercel Preview is READY. It contains major production-dependency upgrades and requires deliberate regression testing before merge.
- PR #147 is open and its Vercel Preview is ERROR because TypeScript 7.0.2 is incompatible with the current Next.js compiler-API expectations. Do not merge #147 as-is.
- Neither Dependabot PR affects production.

## Reader taxonomy

Current approved reader navigation is News, Provinces, URC, International and About. Ireland remains article/editorial metadata. Opinion, analysis, column and notebook are formats rather than top-level coverage sections. Europe is covered within International unless a later evidence-based decision changes this.

## Launch state

The introduction article is live and is the homepage lead. The minimum launch package still requires at least eight additional reviewed, image-backed articles covering recent internationals and all four Irish provinces, followed by production verification of homepage, news/category and article routes.

## FinOps

Make.com Core is active from 30 July 2026 at the recorded confirmed cost of USD $10.59/month. The old Free-plan two-active-scenario limitation is obsolete. See `docs/35_FinOps_Budget_and_Cost_Register.md`.

## Immediate priority

1. Build and production-verify `AUTO-001 – Morning Editorial Package` in Make using a real five-article package payload.
2. Verify one consolidated email to `editor@therugbypanda.ie` and persistent `eventId` duplicate protection.
3. Configure and verify the 07:50–07:55 Europe/Dublin daily trigger.
4. Complete overnight acquisition/generation so five eligible drafts exist before package time.
5. Complete three consecutive on-time morning deliveries.
6. Complete the remaining launch-content package and production verification.
7. Begin SOCIAL-001 only after editorial automation is stable.

## Completion rule

Always distinguish implemented, committed, PR opened, merged, deployed, verified in production, verified in authenticated Sanity Studio, verified in Make.com, verified in Meta and documentation updated. A feature is not complete until its relevant verification has passed.

## Working principles

- Prefer maintainable reusable components.
- Keep `main` deployable.
- Keep `docs/08_Issue_Log.md` current.
- Batch related work where practical to conserve deployments.
- Keep separate Make scenarios focused on one responsibility.
- Do not expose AI implementation references on reader-facing pages.
- Do not publish third-party photographs without documented rights.
- Do not use external candidate-logo URLs in public templates.
