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
7. `docs/23_Make_Orchestration_Architecture.md`
8. `docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md`
9. `docs/27_Sprint_5_Production_State.md`
10. `docs/33_Version_1_Product_Roadmap.md`
11. `docs/34_2026-07-29_Automation_Handoff.md`
12. all newer numbered handoff, automation, Sprint, launch and FinOps documents relevant to the work.

Then inspect GitHub `main`, recent PRs/commits, Vercel production/preview state and currently available connectors. Do not rely on chat history for current status.

## User execution instruction

When the project owner says **Proceed**, continue the agreed implementation immediately. Do not restart strategy discussion. Use available project tools and connectors, and report completed work, verification and genuine blockers only.

## Operating context

- Timezone: `Europe/Dublin`.
- Daily target: five review-ready drafts and one consolidated editorial email by 08:00.
- Repository: `marmuzzi/therugbypanda`.
- Production: `https://therugbypanda.ie`.
- Sanity is the mandatory human approval boundary.
- Editorial experience: Draft → human review/edit → Publish.
- No AI-generated or acquired content is automatically approved or published.
- Social distribution may occur only after deliberate controlled publication.

## Reconciled baseline — 17 August 2026

- Production is healthy on Vercel.
- Production responds successfully and shows the introduction article as the lead.
- Current reader navigation is News, Provinces, URC, International and About.
- No additional newsroom articles are currently published beneath the introduction.
- NOTIFY-001 is complete and production verified.
- NOTIFY-002 is complete and production verified.
- AUTO-001 application-side Morning Editorial Package foundation is merged/deployed but the five-article consolidated Make package is not yet end-to-end verified.
- SOCIAL-001 application-side foundation is merged/deployed but Meta delivery is not verified.
- Make.com Core is active at USD $10.59/month; do not apply the obsolete Free-plan two-scenario limit.
- Direct Sanity read access, GitHub, Vercel and Apify are available in the current project environment. The exposed Make project connector supports health checking but not scenario editing. No direct Meta connector is currently exposed.

## NOTIFY-001 completed state

Verified Make scenario:

```text
NOTIFY-001 – New Draft Notification

Custom webhook
→ Data Store: check eventId existence
→ Filter: New event only / Exists = false
→ Send an Email
→ Data Store: add/replace successful event record
```

Persistent store: `Rugby Panda Event Deduplication`.

The event is `editorial.article.draft_created`. The email reaches `editor@therugbypanda.ie`, the Sanity link opens the intended draft, and replaying a persisted `eventId` sends no second email.

Do not rebuild NOTIFY-001.

## NOTIFY-002 completed state

Verified Make scenario:

```text
NOTIFY-002 - Technical Alerts

Custom webhook
→ Data Store: Check the existence of a record
→ Filter: New event only / Exists = false
→ Send an Email to admin@therugbypanda.ie
→ Data Store: Add/replace a record
```

Persistent store: `Rugby Panda Event Deduplication`.

Incoming `eventId` is the key. Successful processing stores status `technical_alert_sent`. The record is written only after successful email delivery.

Verification completed on 17 August 2026:

- Make-only controlled send succeeded;
- duplicate replay was blocked and no second email was sent;
- the rotated webhook was stored in Vercel as `EDITORIAL_TECHNICAL_ALERT_WEBHOOK_URL`;
- a real production daily-package failure returned `responseStatus: 410` and `technicalAlertStatus: sent`;
- the technical-alert email arrived at `admin@therugbypanda.ie`;
- temporary Preview/browser verification code was removed after testing.

Do not rebuild NOTIFY-002.

## AUTO-001 application contract

`POST /api/editorial/daily-package` is deployed and protected by `EDITORIAL_AUTOMATION_SECRET`.

It selects five eligible Sanity drafts and emits:

```text
editorial.daily_package.ready
```

Delivery/failure conditions route through the now-verified NOTIFY-002 technical-alert path.

The package endpoint does not generate the five articles. Overnight acquisition and generation remain separate orchestration work.

## Exact resume point

1. Create or reopen `AUTO-001 – Morning Editorial Package` in Make.
2. Capture a real `editorial.daily_package.ready` payload containing five eligible drafts.
3. Reuse the persistent `eventId` deduplication pattern proven by NOTIFY-001 and NOTIFY-002.
4. Send one consolidated HTML email to `editor@therugbypanda.ie` containing the five ordered articles and direct review links.
5. Replay the same event and prove no second email is sent.
6. Configure the daily trigger around 07:50–07:55 Europe/Dublin.
7. Complete overnight acquisition/generation so five eligible drafts exist before the package run.
8. Verify five drafts arrive before 08:00 for three consecutive days.
9. Only then proceed to SOCIAL-001 / Meta delivery.

## Dependabot

- PR #146 remains open with a READY Preview but contains major production-dependency upgrades. Regression-test deliberately before merge.
- PR #147 remains open with an ERROR Preview because TypeScript 7.0.2 is incompatible with the current Next.js compiler API expectation. Do not merge it in its current form.

## Launch content

The introduction article is live. The launch package remains incomplete until at least eight additional reviewed, image-backed articles covering recent internationals and Leinster, Munster, Ulster and Connacht are published and verified across homepage, news/category and article routes.

## Completion rule

Always report separately: implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity Studio verified, Make verified, Meta verified and documentation updated.
