# Daily Editorial and Social Automation

## Approved operating target

The Rugby Panda must prepare five complete review-ready article drafts every day and deliver one consolidated editorial package to `editor@therugbypanda.ie` by 08:00 Europe/Dublin.

No generated article may be automatically approved or published. Sanity remains the mandatory human approval boundary.

After an editor deliberately publishes an article through the controlled workflow, the application may emit a social-distribution event for Facebook and Instagram. Social failure must never roll back or alter the successful website publication.

## AUTO-001 — Five-article morning package

### Schedule

The orchestration scenario should run overnight and invoke the application package endpoint no later than 07:55 Europe/Dublin:

```text
POST /api/editorial/daily-package
Authorization: Bearer <EDITORIAL_AUTOMATION_SECRET>
```

The package endpoint selects the five most recently generated eligible Sanity drafts and emits:

```text
editorial.daily_package.ready
```

The receiving Make scenario must send one consolidated email to `editor@therugbypanda.ie` containing:

- package date;
- five ordered headlines;
- standfirsts;
- category and competition;
- human fact-check warning where present;
- featured-image availability;
- direct Editorial Review links.

### Failure contract

The endpoint returns HTTP `409` when fewer than five eligible drafts are available. It emits:

```text
editorial.daily_package.delivery_failed
```

through the technical-alert webhook when possible, targeting `admin@therugbypanda.ie`.

The Make scenario must use `eventId` for persistent deduplication. Replaying the same package date must not send a duplicate email.

### Required environment variables

```text
EDITORIAL_AUTOMATION_SECRET
EDITORIAL_DAILY_PACKAGE_WEBHOOK_URL
EDITORIAL_DAILY_PACKAGE_WEBHOOK_SECRET        # optional
EDITORIAL_TECHNICAL_ALERT_WEBHOOK_URL
EDITORIAL_TECHNICAL_ALERT_WEBHOOK_SECRET      # optional
SANITY_API_TOKEN                              # or SANITY_AUTH_TOKEN
```

## SOCIAL-001 — Post-publication distribution

### Trigger

Only a successful controlled `publish` action emits:

```text
editorial.article.published
```

The event includes:

- stable `eventId`;
- article ID;
- title and standfirst;
- public article URL;
- featured-image URL and alt text;
- category, province and competition;
- Facebook teaser;
- Instagram caption and hashtags.

### Sanity controls

Each article now has a Social Distribution group containing:

- `Do not publish to social` opt-out;
- Facebook teaser override;
- Instagram caption override;
- Instagram hashtags;
- delivery status;
- last event ID and attempt timestamps;
- Facebook and Instagram post IDs;
- last delivery error.

### Make scenario requirements

The social scenario must:

1. deduplicate on `eventId` before calling Meta;
2. verify the article has not opted out;
3. publish to the connected Facebook Page;
4. publish an approved square or portrait creative to the connected Instagram professional account;
5. record platform post IDs and final status back in Sanity;
6. retry platform failures without republishing successful platforms;
7. route unrecoverable failures to `admin@therugbypanda.ie`;
8. never alter the successful website publication.

### Required environment variables

```text
SOCIAL_PUBLISHING_WEBHOOK_URL
SOCIAL_PUBLISHING_WEBHOOK_SECRET              # optional
NEXT_PUBLIC_SITE_URL                          # defaults to https://therugbypanda.ie
SANITY_API_TOKEN                              # or SANITY_AUTH_TOKEN
```

## Recommended overnight timing

```text
01:00–05:30  source acquisition, scoring and story selection
05:30–07:15  article generation, evidence preparation and imagery
07:15–07:45  quality gates, duplicate checks and replacement generation
07:45–07:55  final five-article package validation and delivery
08:00        editorial package available to the editor
```

## Activation sequence

1. Deploy the application-side event contracts and Sanity fields.
2. Configure the AUTO-001 Make webhook and persistent package deduplication.
3. Run a controlled package test containing exactly five drafts.
4. Verify one correctly populated 08:00-style email.
5. Connect the Facebook Page and Instagram professional account in Meta/Make.
6. Configure SOCIAL-001 in test mode.
7. Publish one controlled test article and verify both platform posts and stored IDs.
8. Activate the overnight schedule only after the full test path succeeds.

## Completion evidence

AUTO-001 is complete only when five review-ready drafts are delivered by 08:00 on three consecutive days without duplicate email delivery.

SOCIAL-001 is complete only when a controlled article publication creates one Facebook post and one Instagram post, stores both post IDs, respects opt-out, and demonstrates safe retry after a simulated platform failure.
