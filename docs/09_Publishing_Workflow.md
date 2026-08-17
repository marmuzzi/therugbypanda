# Publishing Workflow

Sanity Studio is the canonical CMS and mandatory human approval boundary.

## Session startup

Read `docs/07_Project_State.md`, `docs/08_Issue_Log.md`, `docs/09_Publishing_Workflow.md`, `docs/10_New_Chat_Handoff.md`, `docs/11_Editorial_Image_Archive.md`, `docs/12_Brand_Assets_Library.md` and all later numbered documents relevant to the task. Check GitHub, Vercel and available connectors before asking the project owner to configure anything.

Use `Europe/Dublin` for schedules, deadlines and operational timestamps.

## Completion rule

Always distinguish implemented, committed, PR opened, merged, deployed, verified in production, verified in authenticated Sanity Studio, verified in Make.com, verified in Meta and documentation updated.

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
→ human review / edit
→ controlled publish / discard
→ Vercel public website
→ optional post-publication social distribution
```

There is no separate `ready for review` approval gate. Draft creation places the article in the human editorial workflow. No generated article or acquired asset is automatically approved or published.

## Protected editorial endpoints

- `POST /api/editorial/draft` — create or replace a Sanity draft from a structured story and fact ledger.
- `POST /api/editorial/workflow` — approve, reject, publish or discard with server-side transition validation and audit history.
- `POST /api/editorial/review` — run on-demand, non-destructive AI Editorial Review.
- `POST /api/editorial/replacement` — validate and create a linked replacement draft from a genuinely different angle and source set.
- `POST /api/editorial/daily-package` — select five eligible drafts and emit the consolidated morning-package event.

Protected endpoints use bearer authentication with `EDITORIAL_AUTOMATION_SECRET`.

## Editorial Brain and image rules

The Editorial Brain must retain source links and confidence, distinguish facts from responsible speculation, block invented facts or quotes, prevent close paraphrasing and preserve human fact-check requirements. Hold or reject candidates must not proceed to generation.

Only Editorial Images that are usage-approved, approved or published, backed by a Sanity asset and supported by reviewed rights metadata may be assigned. The canonical frontend contract remains `article.featuredImage`.

## Editorial Review production state

The authenticated Sanity Editorial Review workspace is implemented and deployed. It includes the Review Queue, Draft Editor, Editorial Review Summary, AI Editorial Review, Featured Image, Sources, Fact Ledger, Workflow and Audit History panels.

Deterministic checks recalculate locally and block approval or publication when blocking issues remain. AI review runs only when requested, never edits content, and does not alter workflow rules. After relevant edits, previous AI findings remain visible but are marked out of date until review is rerun.

## Notification workflow

Required routing:

- New Sanity draft: notify `editor@therugbypanda.ie`.
- Workflow failures and technical alerts: notify `admin@therugbypanda.ie`.
- Public website contact: `mailto:hello@therugbypanda.ie`.

`NOTIFY-001 – New Draft Notification` is complete and production verified. The application emits `editorial.article.draft_created` after successful draft creation. The verified Make flow is:

```text
Custom webhook
→ Data Store: check eventId existence
→ filter New event only / Exists = false
→ Send an Email
→ Data Store: add/replace successful event record
```

The persistent store is `Rugby Panda Event Deduplication`, keyed by `eventId`. Duplicate replay has been explicitly verified to send no second email. The email deep link uses the valid Sanity intent-route form and opens the intended draft.

`NOTIFY-002` remains open until a real failure event is routed to `admin@therugbypanda.ie` and verified.

## Morning Editorial Package

The approved operating target is **five** review-ready drafts and **one consolidated email** to `editor@therugbypanda.ie` by **08:00 Europe/Dublin** every day.

The application-side `POST /api/editorial/daily-package` foundation is merged and deployed. It selects five eligible drafts, emits `editorial.daily_package.ready`, returns HTTP 409 when fewer than five are available and attempts a technical-alert event on failure.

AUTO-001/AUTO-003 are not complete until Make.com has been verified with:

1. a real five-article package payload;
2. one correctly populated consolidated email;
3. persistent `eventId` deduplication;
4. duplicate replay with no second email;
5. failure routing to `admin@therugbypanda.ie`;
6. a daily trigger around 07:50–07:55 Europe/Dublin;
7. five review-ready drafts delivered by 08:00 on three consecutive days.

The package endpoint packages eligible drafts; it does not itself perform overnight acquisition or generation.

## Social distribution

SOCIAL-001 is downstream of controlled website publication and must not be activated before the editorial automation and failure paths are stable.

A successful controlled publish may emit `editorial.article.published`. Social delivery must respect the article opt-out, require an approved image, deduplicate on `eventId`, write platform results back to Sanity and never roll back successful website publication. Meta delivery remains pending controlled production verification.

## Content publishing checklist

1. Confirm the candidate passed the Editorial Brain.
2. Confirm source-linked facts and uncertainty wording.
3. Confirm headline, slug, taxonomy, standfirst, body, SEO and intended date.
4. Confirm a reviewed image and complete rights metadata.
5. Review and edit the draft in authenticated Sanity Studio.
6. Approve only after factual, editorial and rights checks.
7. Publish through the controlled workflow.
8. Verify homepage, news/category and article routes in production.
9. Record issues and completion status in `docs/08_Issue_Log.md`.

## Reader taxonomy

The current approved top-level reader navigation is:

- News
- Provinces
- URC
- International
- About

Ireland remains useful article/editorial metadata but is not a separate top-level section. Opinion, analysis, column and notebook are article formats rather than coverage sections. Europe is covered within International unless a later evidence-based product decision changes this.

## Analytics and accreditation

Publishing must create durable evidence of publication cadence, editorial history, GA4 users/sessions/views/engagement, returning readership, article performance, traffic sources and Search Console clicks/impressions/rankings. Monthly evidence packs must be reproducible. This is tracked under `ACCRED-001`.

## Media and brand assets

Original Rugby Panda photography is preferred and publicly credited as `Photo: The Rugby Panda` and `© The Rugby Panda`. Third-party images require stored source, creator, licence and attribution metadata.

Brand Assets remain separate from Editorial Images. Candidate logos are never automatically approved and must not be publicly hotlinked.
