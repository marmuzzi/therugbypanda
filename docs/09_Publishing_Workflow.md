# Publishing Workflow

Sanity Studio is the canonical CMS and mandatory human review boundary.

## Session startup

Read `docs/07_Project_State.md`, `docs/08_Issue_Log.md`, `docs/09_Publishing_Workflow.md`, `docs/10_New_Chat_Handoff.md`, `docs/11_Editorial_Image_Archive.md`, `docs/12_Brand_Assets_Library.md` and all later numbered documents relevant to the task. Check available connectors before asking the user to configure anything.

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
→ controlled publish / discard
→ Vercel public website
```

No generated article or acquired asset is automatically approved or published.

## Protected editorial endpoints

- `POST /api/editorial/draft` — create or replace a Sanity draft from a structured story and fact ledger.
- `POST /api/editorial/workflow` — submit, approve, reject, publish or discard with server-side transition validation and audit history.
- `POST /api/editorial/review` — run on-demand, non-destructive AI Editorial Review.
- `POST /api/editorial/replacement` — validate and create a linked replacement draft from a genuinely different angle and source set.

Protected endpoints use bearer authentication with `EDITORIAL_AUTOMATION_SECRET`.

## Editorial Brain rules

The Editorial Brain must retain source links and confidence, distinguish facts from responsible speculation, block invented facts or quotes, prevent close paraphrasing and preserve human fact-check requirements. Hold or reject candidates must not proceed to generation.

## Image assignment

Only Editorial Images that are usage-approved, approved or published, backed by a Sanity asset and supported by reviewed rights metadata may be assigned. The canonical frontend contract remains `article.featuredImage`.

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

PR #63 introduced AI Editorial Review. PR #64 introduced a broken component. PR #66 repaired the build and Sanity Tool contract. PR #67 completed the refactor and QA improvements. PR #81 added real Sanity-backed website search. PR #82 added the application-side notification webhook foundation. The current production baseline is documented in `docs/27_Sprint_5_Production_State.md`.

## Rejection and replacement

Current behaviour records the rejection reason, count, audit history and replacement-required state. The replacement endpoint enforces a different source set and editorial angle. Persistent orchestration must still acquire and submit the replacement candidate and verify queue replenishment.

## Notification workflow

Required routing:

- When an article enters the Editorial Review queue, notify `editor@therugbypanda.ie`.
- Send workflow failures and technical alerts to `admin@therugbypanda.ie`.
- Public website contact must use `mailto:hello@therugbypanda.ie`.

PR #82 emits `editorial.article.ready_for_review` only after a successful submit-to-review transition. It supports `EDITORIAL_NOTIFICATION_WEBHOOK_URL` and optional `EDITORIAL_NOTIFICATION_WEBHOOK_SECRET`, includes a stable event identifier for downstream deduplication, applies a 10-second timeout and isolates notification-delivery failures from the successful Sanity workflow transition.

The Make.com MCP toolbox is connected and its temporary Health Check tool has executed successfully. Production-ready notification tools and the Make scenario are still pending.

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
4. Confirm a reviewed image and complete rights metadata.
5. Submit and review in authenticated Sanity Studio.
6. Approve only after factual, editorial and rights checks.
7. Publish through the controlled workflow.
8. Verify homepage, category and article routes in production.
9. Record issues and completion status in `docs/08_Issue_Log.md`.

## Daily target

Eight review-ready drafts must be available by 08:00 Europe/Dublin. Persistent orchestration must include approved-scope acquisition, section mix, duplicate prevention, retries, failure notification, deadline monitoring and rejection replacement. Approval and publication remain manual.

## Analytics and accreditation

Publishing must create durable evidence of publication cadence, editorial history, GA4 users/sessions/views/engagement, returning readership, article performance, traffic sources and Search Console clicks/impressions/rankings. Monthly evidence packs must be reproducible. This is tracked under `ACCRED-001`.

## Media and brand assets

Original Rugby Panda photography is preferred and publicly credited as `Photo: The Rugby Panda` and `© The Rugby Panda`. Third-party images require stored source, creator, licence and attribution metadata.

Brand Assets remain separate from Editorial Images. Candidate logos are never automatically approved and must not be publicly hotlinked.
