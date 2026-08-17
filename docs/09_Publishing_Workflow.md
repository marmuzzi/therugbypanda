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
- `POST /api/editorial/daily-package` — select five eligible, editorially distinct production drafts and emit the consolidated morning-package event.

Protected endpoints use bearer authentication with `EDITORIAL_AUTOMATION_SECRET`.

## Morning package eligibility

Production morning packages must use explicit eligibility metadata rather than broad workflow status alone.

Generated drafts are classified with:

- `automationContentClass = production | qa`
- `morningPackageEligible = true | false`

QA-mode drafts must never be eligible for production packages. The package selector requires production classification and explicit eligibility, then applies source/topic/angle diversity checks before selecting five stories. If five distinct production-eligible drafts are unavailable, the endpoint returns HTTP 409 and raises a technical alert rather than falling back to QA/test content.

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

`NOTIFY-002 - Technical Alerts` is also complete and production verified. Different failure types must use distinct stable event IDs for the Europe/Dublin operational day, while an exact retry of the same failure type must reuse the same ID so Make can deduplicate it. A Make 2xx response means the webhook was accepted; application status must not claim that an email was definitely sent. The verified application status is `technicalAlertStatus: accepted`.

NOTIFY-003 production verification proved that the first `insufficient-production-eligible-diverse-content` failure delivered one email and an exact replay delivered no second email.
