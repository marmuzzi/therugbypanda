# Publishing Workflow

Sanity Studio is the canonical CMS and mandatory human review boundary.

## Session startup

Read `docs/07_Project_State.md`, `docs/08_Issue_Log.md`, `docs/09_Publishing_Workflow.md`, `docs/10_New_Chat_Handoff.md`, `docs/11_Editorial_Image_Archive.md`, `docs/12_Brand_Assets_Library.md`, `docs/35_Automatic_Social_Distribution.md`, `docs/36_Publication_Preview_and_AI_Image_Selection.md`, `docs/37_Publication_Pipeline.md` and all later numbered documents relevant to the task. Check available connectors before asking the user to configure anything.

Use `Europe/Dublin` for schedules, deadlines and operational timestamps.

## Completion rule

Always distinguish implemented, committed, merged, deployed, verified in production, verified in authenticated Sanity Studio and documentation updated.

Track unfinished work in `docs/08_Issue_Log.md`.

## Deployment rule

Batch related changes where practical. Keep `main` deployable and minimise unnecessary Vercel deployments.

## Editorial architecture

```text
Approved-scope acquisition
→ structured story candidate
→ Editorial Brain classification and scoring
→ source-linked fact ledger
→ OpenAI structured generation
→ approved Editorial Image assignment
→ Sanity draft
→ submit for review
→ editor amend / approve / reject
→ one human approval
→ controlled website publication
→ automatic publication preparation
→ AI image selection
→ website, Facebook and Instagram preparation
→ website preview, SEO, accessibility and social-readiness checks
→ create idempotent social publishing event
→ Make.com orchestration
→ Facebook and Instagram delivery
→ write back platform IDs, URLs, attempts and errors
```

No generated article or acquired asset is automatically approved.

Article approval is the single human approval boundary for website publication and automatic social distribution. There is no second social-media approval step.

## Protected editorial endpoints

- `POST /api/editorial/draft` — create or replace a Sanity draft from a structured story and fact ledger.
- `POST /api/editorial/workflow` — submit, approve, reject, publish or discard with server-side transition validation and audit history.
- `POST /api/editorial/review` — run on-demand, non-destructive AI Editorial Review.
- `POST /api/editorial/replacement` — validate and create a linked replacement draft from a genuinely different angle and source set.

Protected endpoints use bearer authentication with `EDITORIAL_AUTOMATION_SECRET`.

## Editorial Brain rules

The Editorial Brain must retain source links and confidence, distinguish facts from responsible speculation, block invented facts or quotes, prevent close paraphrasing and preserve human fact-check requirements. Hold or reject candidates must not proceed to generation.

## Image assignment and eligibility

Only Editorial Images that are usage-approved, approved or published, backed by a Sanity asset or controlled public URL, and supported by reviewed rights metadata may be assigned or considered for publication preparation.

The canonical frontend contract remains `article.featuredImage` until an explicit implementation changes it.

The AI image selector may choose different images for:

- website presentation;
- Facebook;
- Instagram.

Image ranking must consider at least:

- relevance to the approved article;
- visual impact;
- crop suitability;
- rights completeness;
- platform fit;
- face and subject preservation;
- existing editor-approved metadata.

The selector must never use an unapproved image or infer publication rights.

## Editorial Review production state

The authenticated Sanity Editorial Review workspace is implemented and deployed. It includes:

- Review Queue;
- Draft Editor;
- Editorial Review Summary;
- AI Editorial Review;
- Featured Image panel;
- Sources panel;
- Fact Ledger panel;
- Workflow panel;
- Audit History panel.

Deterministic checks recalculate locally and block approval or publication when blocking issues remain. AI review runs only when requested, never edits content, and does not alter workflow rules.

After relevant draft edits, existing AI findings remain visible but are marked **Out of date**. The action changes to **Run Review Again**. Rerunning refreshes findings against the current draft. Switching articles clears prior findings.

PR #63 introduced AI Editorial Review. PR #64 introduced a broken component. PR #66 repaired the build and Sanity Tool contract. PR #67 completed the refactor and QA improvements. PR #81 added real Sanity-backed website search. PR #82 added the application-side notification webhook foundation. PR #100 added the Social Publishing Foundation. PR #101 adds the publication preview and AI image-selection contract and is open until merged and verified.

## Rejection and replacement

Current behaviour records the rejection reason, count, audit history and replacement-required state. The replacement endpoint enforces a different source set and editorial angle. Persistent orchestration must still acquire and submit the replacement candidate and verify queue replenishment.

## One-click publication model

The approved publication sequence is:

1. Editor approves the article in Sanity.
2. The controlled workflow publishes the website article.
3. The workflow checks `doNotPublishToSocial` / **Skip automatic social distribution**.
4. If social distribution is not skipped, the workflow gathers eligible image candidates.
5. AI ranks eligible images and selects website, Facebook and Instagram variants.
6. The workflow generates platform-specific Facebook and Instagram copy.
7. The workflow prepares the website preview and readiness results.
8. A stable social publishing event is created.
9. Make.com publishes to Facebook and Instagram.
10. Sanity records platform IDs, URLs, timestamps, attempts, partial success and actionable errors.

The preparation stage is automatic and does not introduce a second human approval.

## Publication Preview contract

The planned or workflow-managed publication preparation data includes:

- preparation status;
- article revision;
- website preview URL;
- selected website image URL;
- selected Facebook image URL;
- selected Instagram image URL;
- image alt text;
- Facebook snippet;
- Instagram snippet;
- SEO score;
- accessibility score;
- social-readiness score;
- passed checks;
- warnings;
- failures;
- automatic fixes.

The visual Sanity Publication Preview component remains to be implemented and verified.

## Social distribution rules

Every article promotion post must include a picture.

Text-only article promotion is prohibited.

Facebook and Instagram copy must be derived from the approved article and must not introduce new factual claims.

Facebook should include a canonical clickable article link where supported.

Instagram should use platform-appropriate wording and direct readers to the link in bio or another approved link mechanism where standard captions do not provide a clickable link.

Campaign tracking parameters should be appended where supported and must not change the canonical article identity.

## Failure and retry rules

Website publication remains independent from publication preparation and social delivery.

A preparation, Make.com or Meta failure must never:

- unpublish the article;
- roll back website publication;
- change editorial approval;
- create a text-only fallback post.

If no eligible image is available:

1. keep the website article live;
2. mark social delivery with an actionable `missing-image` or waiting state;
3. do not publish text-only posts;
4. retry after an eligible image is added;
5. do not request another editorial approval.

If one platform succeeds and another fails:

- preserve the successful post;
- retry only the failed platform;
- never duplicate the successful platform post;
- record platform-specific status and error details.

Use stable `eventId` idempotency keys to prevent duplicate posts for the same article event and platform.

## Make.com responsibilities

The intended Make.com scenario must:

1. receive or poll for a publication-preparation event;
2. validate the payload and shared secret;
3. reject duplicate `eventId` and platform combinations;
4. check the social skip override;
5. request or receive eligible image candidates;
6. invoke AI ranking and caption generation through approved services;
7. apply image transformations or crops for each platform;
8. publish to Facebook and Instagram;
9. handle partial success explicitly;
10. update Sanity with status, post IDs, URLs, attempts and errors;
11. retry transient failures without creating duplicates;
12. route terminal failures to `admin@therugbypanda.ie`.

The Make connection is available, but the currently exposed connector does not permit scenario editing. The scenario must therefore be built manually or in a future connection that exposes scenario-management tools.

## Notification workflow

Required routing:

- When an article enters the Editorial Review queue, notify `editor@therugbypanda.ie`.
- Send workflow failures and technical alerts to `admin@therugbypanda.ie`.
- Public website contact must use `mailto:hello@therugbypanda.ie`.

PR #82 emits `editorial.article.ready_for_review` only after a successful submit-to-review transition. It supports `EDITORIAL_NOTIFICATION_WEBHOOK_URL` and optional `EDITORIAL_NOTIFICATION_WEBHOOK_SECRET`, includes a stable event identifier for downstream deduplication, applies a 10-second timeout and isolates notification-delivery failures from the successful Sanity workflow transition.

The Make.com MCP toolbox is connected and its Health Check tool has executed successfully. Production-ready notification tools and the Make scenario are still pending.

NOTIFY-001 is complete only after all of the following are verified:

1. Make scenario receives and validates the webhook.
2. Required Vercel production environment variables are configured.
3. A controlled article submit reaches the scenario.
4. Exactly one email is delivered to `editor@therugbypanda.ie`.
5. Replaying the same stable event identifier does not produce a duplicate email.
6. Notification failures do not alter Sanity workflow state.
7. Sanity remains the mandatory human approval boundary and no notification triggers approval or publication.

Notifications must be idempotent, must not expose secrets, and must record enough context to identify the article, workflow stage, timestamp and failure reason. Notification delivery must never bypass Sanity approval or trigger publication.

## Content publishing checklist

1. Confirm the candidate passed the Editorial Brain.
2. Confirm source-linked facts and uncertainty wording.
3. Confirm headline, slug, category, standfirst, body, SEO and intended date.
4. Confirm at least one reviewed image and complete rights metadata.
5. Submit and review in authenticated Sanity Studio.
6. Approve only after factual, editorial and rights checks.
7. Publish through the controlled workflow.
8. Confirm automatic publication preparation begins without a second approval.
9. Confirm website publication remains live even if preparation or social delivery fails.
10. Verify homepage, category and article routes in production.
11. Verify publication preview and platform preparation when implemented.
12. Record issues and completion status in `docs/08_Issue_Log.md`.

## Daily target

Eight review-ready drafts must be available by 08:00 Europe/Dublin. Persistent orchestration must include approved-scope acquisition, section mix, duplicate prevention, retries, failure notification, deadline monitoring and rejection replacement. Editorial approval remains manual. Downstream preparation and social distribution are automatic after approval unless skipped.

## Analytics and accreditation

Publishing must create durable evidence of publication cadence, editorial history, GA4 users/sessions/views/engagement, returning readership, article performance, traffic sources and Search Console clicks/impressions/rankings. Monthly evidence packs must be reproducible. This is tracked under `ACCRED-001`.

Future engagement learning may use aggregated post performance to improve image and caption ranking, but it must not bypass rights, factual or editorial controls.

## Media and brand assets

Original Rugby Panda photography is preferred and publicly credited as `Photo: The Rugby Panda` and `© The Rugby Panda`. Third-party images require stored source, creator, licence and attribution metadata.

Brand Assets remain separate from Editorial Images. Candidate logos are never automatically approved and must not be publicly hotlinked.
