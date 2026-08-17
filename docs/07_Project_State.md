# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

17 August 2026, after AUTO-004 production eligibility protection and NOTIFY-003 technical-alert deduplication were production verified.

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
12. `docs/36_2026-08-17_AUTO-001_Production_Verification.md`
13. `docs/37_2026-08-17_AUTO-004_NOTIF-003_Verification.md`
14. all newer numbered handoff, automation, Sprint, launch and FinOps documents relevant to the task.

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
- GitHub and Vercel are directly connected. Apify is directly available. The current Make project connector supports health checking but not scenario editing. No direct Meta/Facebook/Instagram project connector is currently exposed in chat.
- NOTIFY-001, NOTIFY-002, NOTIFY-003 and the AUTO-001 delivery path are production verified.
- AUTO-004 now blocks controlled-QA/test drafts from production morning packages; five-current-story diversity verification remains pending.
- Make.com Core is active at the recorded confirmed cost of USD $10.59/month.

## Editorial production state

Implemented, merged and deployed capabilities include Editorial Brain classification/scoring and source-linked fact ledger; OpenAI structured generation and protected Sanity draft creation; approved Editorial Image assignment; protected approve/reject/publish/discard transitions; authenticated Sanity Editorial Review; deterministic quality gates; on-demand AI review; real Sanity-backed website search; daily-package application foundation; explicit morning-package production eligibility; package-level source/topic/angle diversity filtering; and post-publication social event/Sanity-field foundation.

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

## NOTIFY-002 / NOTIFY-003 — complete

`NOTIFY-002 - Technical Alerts` is the production-verified Make scenario for technical alerts. NOTIFY-003 fixed the application-side deduplication identity and status semantics.

Different daily-package failure types now receive distinct stable daily event IDs, while exact retries of the same failure type reuse the same key. When Make returns 2xx, the application reports `technicalAlertStatus: accepted` rather than falsely claiming the email was definitely sent.

Production verification on 17 August 2026 proved:

- the first `insufficient-production-eligible-diverse-content` failure delivered exactly one email to `admin@therugbypanda.ie`;
- repeating the identical production call returned the same 409 failure but delivered no second email because Make deduplicated it;
- the temporary Preview-only verifier was removed from its unmerged test branch.

## AUTO-001 — Morning Editorial Package delivery complete

`AUTO-001 – Morning Editorial Package` is production verified as a delivery receiver.

Final topology:

```text
Production POST /api/editorial/daily-package
→ editorial.daily_package.ready
→ Make custom webhook
→ Rugby Panda Event Deduplication: check eventId
→ filter: New package only / Exists = false
→ one consolidated HTML email to editor@therugbypanda.ie
→ Rugby Panda Event Deduplication: persist successful package
```

Verification completed on 17 August 2026:

- a controlled five-article Make payload delivered one correctly formatted consolidated email;
- duplicate replay of the same `eventId` was blocked with zero second-email operations and zero second success-record writes;
- the AUTO-001 webhook was rotated before production use and stored in Vercel as `EDITORIAL_DAILY_PACKAGE_WEBHOOK_URL`;
- PR #153 corrected package review links to the verified Sanity intent-route format and merged as `4f6d0bd721ce1ddeaedaa48857dfdf9ed652f252`;
- production was explicitly redeployed after the environment-variable update;
- the real production endpoint returned HTTP 200 with `status: sent`, `eventId: editorial-daily-package:2026-08-17`, `articleCount: 5` and destination `editor@therugbypanda.ie`;
- Vercel runtime logs confirmed `POST /api/editorial/daily-package 200` on production;
- the five-article email arrived at `editor@therugbypanda.ie`;
- a `Review in Sanity` link opened the exact corresponding draft in hosted Sanity Studio.

The package endpoint packages eligible Sanity drafts; it does not perform overnight acquisition or generation.

## AUTO-004 — production eligibility guard verified; distinct production content still pending

The original AUTO-001 production test exposed five historical `article-controlled-qa-*` drafts, all covering essentially the same World Rugby Law 8 scoring angle.

PR #156 implemented the first production remediation:

- generated drafts now carry explicit `automationContentClass` and `morningPackageEligible` metadata;
- QA-mode drafts are classified as QA and marked ineligible;
- normal production drafts are classified as production and eligible;
- the daily-package query requires production classification and explicit eligibility;
- the selector checks a larger candidate pool and rejects same-source or materially similar title/angle/source candidates.

PR #156 merged as `d1f651726987fda2c2f36ac9d07b7d7d6fb93eea` and deployed successfully. A real protected production call then returned HTTP 409 with `articleCount: 0`, `eligibleCandidateCount: 0`, and reason `insufficient-production-eligible-diverse-content`, proving historical QA content is excluded.

AUTO-004 remains open because the second half still needs verification: acquisition/generation must produce at least five current, production-eligible, genuinely distinct rugby stories and successfully deliver them through AUTO-001.

## AUTO-003 — remaining morning scheduling/orchestration work

The delivery receiver and eligibility guard are verified, but the complete unattended morning operation is not yet complete. Remaining work:

1. complete persistent overnight acquisition/generation so five eligible current drafts exist before package time;
2. verify five genuinely distinct current stories under AUTO-004;
3. configure and verify the scheduled invocation around 07:50–07:55 Europe/Dublin;
4. verify retries/failure handling around the scheduled invocation;
5. deliver five eligible, editorially distinct review-ready drafts before 08:00 for three consecutive days.

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

1. Complete AUTO-004 by producing and delivering five genuinely distinct current production rugby stories.
2. Complete overnight acquisition/generation so those five drafts exist before package time.
3. Configure and verify the 07:50–07:55 Europe/Dublin daily trigger under AUTO-003.
4. Complete three consecutive on-time morning deliveries before 08:00.
5. Complete the remaining launch-content package and production verification.
6. Begin SOCIAL-001 only after editorial automation is stable.

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
