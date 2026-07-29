# Automation Handoff — 29 July 2026

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

The approved daily target is now:

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

## Make.com blocker and plan decision

The Make account is currently on the Free plan.

The Free plan allows only two active scenarios. The proposed `AUTO-001 – Morning Editorial Package` scenario would be the third active scenario, so Make requires an upgrade before it can be activated.

The project owner accepted that an upgrade is required. Recommended plan: Make Core, because the roadmap requires multiple separate production scenarios and one-minute scheduling.

Do not merge unrelated automations into one large scenario merely to remain under the Free-plan limit. Keep scenarios isolated for observability, retries and maintenance.

## Make scenarios to create

### 1. AUTO-001 — Morning Editorial Package Receiver

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
2. Deduplicate persistently on `eventId`.
3. Build one consolidated HTML email containing five ordered articles.
4. Include title, standfirst, category, competition, featured-image availability, human fact-check warning and direct Editorial Review URL.
5. Send to `editor@therugbypanda.ie`.
6. Record successful delivery only after the email succeeds.
7. Route failures to `admin@therugbypanda.ie`.
8. Replaying the same `eventId` must not send a second email.

### 2. AUTO-001 — Daily Package Trigger

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

### 3. SOCIAL-001 — Facebook and Instagram Publishing

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

### 4. Health Check

Run at 06:00 Europe/Dublin and verify the dependencies needed before editorial generation and delivery.

### 5. Weekly Editorial KPI Summary

Send a weekly summary covering generated, approved and published articles, social results, top article and approval time.

## Persistent deduplication design

Create a Make data store named:

```text
Rugby Panda Event Deduplication
```

Use incoming `eventId` as the record key.

Minimum fields:

```text
eventType
processedAt
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

1. Upgrade Make to a plan supporting more than two active scenarios.
2. Return to `AUTO-001 – Morning Editorial Package`.
3. Create or reopen the `Rugby Panda Daily Package` custom webhook.
4. Click **Run once** so Make waits for a real event.
5. Trigger `POST https://therugbypanda.ie/api/editorial/daily-package` using the existing `EDITORIAL_AUTOMATION_SECRET`.
6. Capture the actual payload before mapping fields.
7. If the endpoint returns `409`, confirm whether five eligible Sanity drafts exist before treating it as an application defect.
8. Build persistent `eventId` deduplication and consolidated email delivery.
9. Verify one populated email and duplicate replay.
10. Only then configure SOCIAL-001.

## Verification still pending

- authenticated Sanity Studio verification of the new social distribution controls;
- actual AUTO-001 payload captured in Make;
- exactly five eligible drafts packaged successfully;
- populated morning email delivered;
- duplicate replay blocked;
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

- Implemented: yes, application foundation from PR #131.
- Committed: yes.
- Merged: yes.
- Vercel deployed: confirmed by project owner.
- Sanity Studio deployed: deployment was running/completing; authenticated verification pending.
- Make configured: environment-variable side completed; scenario activation blocked by Free-plan two-scenario limit.
- AUTO-001 verified end-to-end: no.
- SOCIAL-001 verified end-to-end: no.
