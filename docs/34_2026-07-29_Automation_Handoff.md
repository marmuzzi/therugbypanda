# Automation Handoff — 29–30 July 2026

## Verified repository and deployment state

Repository: `marmuzzi/therugbypanda`

Production: `https://therugbypanda.ie`

PR #131, **Add daily editorial package and social distribution foundation**, was merged into `main`.

Merge commit:

```text
466c8f1831d7f95b6707fb85789fa2f0fab45316
```

The PR preview Vercel build was green before merge. The project owner then confirmed the post-merge production Vercel deployment completed successfully.

The project owner also confirmed the related Studio deployment was running/completing during the configuration session. Authenticated Sanity Studio verification of the new social fields is still required.

## Additional fixes merged on 30 July 2026

### PR #142 — Editorial QA timeout

- Increased the route duration limit from 60 to 120 seconds.
- Increased the requested OpenAI generation timeout to 90 seconds.

### PR #143 — Hidden OpenAI timeout clamp

The generator contained an internal clamp that limited all requested timeouts to 50 seconds. The clamp was raised to 110 seconds, preserving a small buffer below the 120-second route limit.

Controlled QA article generation succeeded after deployment.

### PR #144 — Sanity review deep link

The notification used a malformed query-string intent URL:

```text
/intent/edit?id=<document>&type=article
```

It was replaced with Sanity's expected route-parameter form:

```text
/intent/edit/id=<document>;type=article
```

The corrected link was verified from a production email and opened the intended Sanity draft.

## What PR #131 introduced

Application-side foundation now exists for:

- authenticated `POST /api/editorial/daily-package`;
- selection and delivery of one five-article editorial package;
- `409` response when fewer than five eligible drafts are available;
- technical-alert delivery where configured;
- controlled `editorial.article.published` social event after successful website publication;
- article-level social opt-out and copy overrides;
- social delivery status, platform IDs and error fields in Sanity;
- isolation of social failures from successful website publication.

Sanity remains the mandatory human approval boundary. Nothing is automatically approved or published.

## Operating target

The approved daily target is:

- five complete, review-ready article drafts;
- one consolidated email to `editor@therugbypanda.ie`;
- delivery by 08:00 Europe/Dublin;
- automatic Facebook and Instagram distribution only after a deliberate controlled publication action.

The package endpoint does not itself generate the five articles. It packages five eligible drafts already present in Sanity. Overnight acquisition and generation orchestration remains separate work.

## Vercel environment variables

The project owner confirmed these variables are configured for Production and Preview:

```text
EDITORIAL_AUTOMATION_SECRET
EDITORIAL_DAILY_PACKAGE_WEBHOOK_URL
EDITORIAL_DAILY_PACKAGE_WEBHOOK_SECRET
```

`EDITORIAL_AUTOMATION_SECRET` already existed from earlier automation work. The daily package webhook URL and webhook secret were added on 29 July 2026.

The production project was redeployed after the new variables were added, and the deployment completed successfully.

Secret values and webhook URLs must never be committed to the repository.

## Make.com plan and connector constraints

The Make account was on the Free plan during the 29 July planning session, where only two active scenarios were available. Verify the current plan before enabling further production scenarios.

Do not merge unrelated automations into one large scenario merely to remain under a plan limit. Keep scenarios isolated for observability, retries and maintenance.

The current ChatGPT Make connector does not expose scenario editing, so scenario construction requires the Make interface unless new tools become available.

## NOTIFY-001 — completed and production verified

Scenario name:

```text
NOTIFY-001 – New Draft Notification
```

Verified trigger event:

```text
editorial.article.draft_created
```

Verified module sequence:

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

Record key:

```text
eventId
```

Verified data-store fields include:

```text
eventType
processedAt
articleId
status
packageDate
facebookStatus
instagramStatus
facebookPostId
instagramPostId
```

The notification workflow was verified end to end:

1. Controlled QA generated a new article after the timeout fixes.
2. Sanity created the draft.
3. Make received the webhook payload.
4. A populated email reached `editor@therugbypanda.ie`.
5. The corrected review URL opened the intended draft in hosted Sanity Studio.
6. The successful event was persisted with status `review_notification_sent`.
7. The exact duplicate event was replayed.
8. The existence check returned `true`.
9. The `New event only` filter processed zero bundles.
10. Neither the email module nor the final data-store write executed again.

`NOTIFY-001` is closed as of 30 July 2026.

## NOTIFY-002 — next notification task

Goal:

```text
Send workflow failures and technical alerts to admin@therugbypanda.ie
```

Application-side technical-alert webhook support exists, but Make failure routing and a simulated failure-path verification remain pending.

Required verification:

- simulate a workflow failure;
- deliver a populated technical alert;
- include event ID, article ID/title where available, failed stage and error details;
- confirm the editorial-success path remains unaffected;
- document retry and escalation behaviour.

## AUTO-001 — Morning Editorial Package Receiver

Trigger:

```text
Webhooks → Custom webhook
```

Webhook name:

```text
Rugby Panda Daily Package
```

Expected event:

```text
editorial.daily_package.ready
```

Required behaviour:

1. Receive the application event immediately.
2. Deduplicate persistently on `eventId`, using the pattern proven by NOTIFY-001.
3. Build one consolidated HTML email containing five ordered articles.
4. Include title, standfirst, category, competition, featured-image availability, human fact-check warning and direct Editorial Review URL.
5. Send to `editor@therugbypanda.ie`.
6. Record successful delivery only after the email succeeds.
7. Route failures to `admin@therugbypanda.ie`.
8. Replaying the same `eventId` must not send a second email.

## AUTO-001 — Daily Package Trigger

Trigger:

```text
Scheduled daily at 07:50 Europe/Dublin
```

Action:

```http
POST https://therugbypanda.ie/api/editorial/daily-package
Authorization: Bearer <EDITORIAL_AUTOMATION_SECRET>
Content-Type: application/json

{}
```

Required behaviour:

- invoke the package endpoint no later than 07:55;
- treat HTTP `409` as an incomplete package because fewer than five eligible drafts exist;
- notify `admin@therugbypanda.ie` on `409` and other request failures.

## SOCIAL-001 — Facebook and Instagram Publishing

Trigger:

```text
Webhooks → Custom webhook
```

Expected event:

```text
editorial.article.published
```

Required behaviour:

1. Deduplicate on `eventId`.
2. Respect article-level social opt-out.
3. Publish to The Rugby Panda Facebook Page.
4. Publish approved imagery and caption to the connected Instagram professional account.
5. Track Facebook and Instagram success independently.
6. Store platform post IDs and final status back in Sanity.
7. Retry only failed platforms.
8. Route unrecoverable failures to `admin@therugbypanda.ie`.
9. Never alter or roll back the successful website publication.

## Other planned scenarios

### Health Check

Run at 06:00 Europe/Dublin and verify the dependencies needed before editorial generation and delivery.

### Weekly Editorial KPI Summary

Send a weekly summary covering generated, approved and published articles, social results, top article and approval time.

## Persistent deduplication design

Use the Make data store:

```text
Rugby Panda Event Deduplication
```

Use incoming `eventId` as the record key.

The proven implementation pattern is:

```text
Check existence by eventId
→ continue only when Exists = false
→ perform the external action
→ write the success record after the external action succeeds
```

Minimum fields:

```text
eventType
processedAt
articleId
packageDate
status
```

For social publishing, extend the record with independent platform state:

```text
facebookStatus
instagramStatus
facebookPostId
instagramPostId
```

A success record must be written only after the associated external action succeeds.

## Resume point for the next session

1. Read the source-of-truth documentation first.
2. Verify the current Make plan and active-scenario capacity.
3. Do not rebuild NOTIFY-001; it is complete and verified.
4. Add NOTIFY-002 failure routing, or continue AUTO-001 if failure routing is deliberately deferred.
5. Create or reopen `AUTO-001 – Morning Editorial Package`.
6. Create or reopen the `Rugby Panda Daily Package` custom webhook.
7. Click **Run once** so Make waits for a real event.
8. Trigger `POST https://therugbypanda.ie/api/editorial/daily-package` using the existing `EDITORIAL_AUTOMATION_SECRET`.
9. Capture the actual payload before mapping fields.
10. If the endpoint returns `409`, confirm whether five eligible Sanity drafts exist before treating it as an application defect.
11. Reuse the verified `eventId` existence-check and post-success-write pattern.
12. Build persistent deduplication and consolidated email delivery.
13. Verify one populated email and duplicate replay.
14. Verify failure routing.
15. Only then activate the 07:50 trigger and proceed to SOCIAL-001.

## Verification still pending

- authenticated Sanity Studio verification of the PR #131 social distribution controls;
- actual AUTO-001 payload captured in Make;
- exactly five eligible drafts packaged successfully;
- populated morning email delivered;
- duplicate package replay blocked;
- failure routing verified;
- daily 07:50 schedule activated;
- three consecutive successful deliveries before 08:00;
- Facebook test post;
- Instagram test post;
- platform ID writeback to Sanity;
- social opt-out test;
- independent retry test after a simulated platform failure;
- overnight acquisition and generation workflow producing five eligible drafts.

## Status terminology

- NOTIFY-001 implemented: yes.
- NOTIFY-001 application fixes committed and merged: yes.
- NOTIFY-001 deployed: yes.
- NOTIFY-001 Make configured: yes.
- NOTIFY-001 email verified: yes.
- NOTIFY-001 Sanity deep link verified: yes.
- NOTIFY-001 duplicate replay protection verified: yes.
- NOTIFY-001 closed: yes, 30 July 2026.
- NOTIFY-002 verified: no.
- AUTO-001 verified end-to-end: no.
- SOCIAL-001 verified end-to-end: no.
