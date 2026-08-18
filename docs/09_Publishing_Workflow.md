# Publishing Workflow

Sanity Studio is the canonical CMS and mandatory human approval boundary.

## Session startup

Read `docs/07_Project_State.md`, `docs/08_Issue_Log.md`, `docs/09_Publishing_Workflow.md`, `docs/10_New_Chat_Handoff.md`, `docs/11_Editorial_Image_Archive.md`, `docs/12_Brand_Assets_Library.md` and all later numbered documents relevant to the task, especially `docs/39_2026-08-18_AUTO-004_Multisource_Image_Handoff.md`. Check GitHub, Vercel and available connectors before asking the project owner to configure anything.

Use `Europe/Dublin` for schedules, deadlines and operational timestamps.

## Completion rule

Always distinguish implemented, committed, PR opened, merged, deployed, verified in production, verified in authenticated Sanity Studio, verified in Make.com, verified in Meta and documentation updated. Track unfinished work in `docs/08_Issue_Log.md`.

## Deployment rule

Batch related changes where practical. Keep `main` deployable and minimise unnecessary Vercel deployments.

## Editorial architecture

```text
Approved-scope multi-source acquisition
→ structured story candidate with multiple sourceRecords
→ Editorial Brain classification/scoring and source-linked fact ledger
→ original structured synthesis
→ relevant rights-approved Editorial Image assignment (or no image)
→ Sanity draft
→ human review / edit
→ controlled publish / discard
→ Vercel public website
→ optional post-publication social distribution
```

There is no separate `ready for review` approval gate. Draft creation places the article in the human editorial workflow. No generated article or acquired image is automatically approved or published.

## Multi-source acquisition contract

A Rugby Panda story should not be built as a rewrite of one source. Acquisition should deliberately gather multiple relevant sources around the same story and retain them as separate `sourceRecords` with provenance.

Use official/primary sources to anchor hard facts. Reputable secondary reporting may contribute interviews, context, analysis, historical comparison and useful colour. The generator must synthesize all useful source records, reconcile conflicts conservatively, preserve traceability and produce an original Rugby Panda angle rather than closely paraphrasing any input.

Where evidence supports it, the story should identify relevant players, coaches, new signings, selection battles and concrete what-to-watch angles. Internal sourcing policy, confidence-ledger mechanics, AI/process explanations and editorial workflow rules must not appear in reader-facing copy.

## Protected editorial endpoints

- `POST /api/editorial/draft` — create or replace a Sanity draft from a structured story and fact ledger.
- `POST /api/editorial/workflow` — approve, reject, publish or discard with server-side transition validation and audit history.
- `POST /api/editorial/review` — run on-demand, non-destructive AI Editorial Review.
- `POST /api/editorial/replacement` — validate and create a linked replacement draft from a genuinely different angle and source set.
- `POST /api/editorial/daily-package` — select five eligible, editorially distinct production drafts and emit the consolidated morning-package event.

Protected endpoints use bearer authentication with `EDITORIAL_AUTOMATION_SECRET`.

## Morning package eligibility and notification

Generated drafts carry:

- `automationContentClass = production | qa`
- `morningPackageEligible = true | false`

QA-mode drafts must never be eligible for production packages. The selector requires production classification and explicit eligibility, then applies source/topic/angle diversity. If five distinct production-eligible drafts are unavailable, return HTTP 409 and raise a technical alert rather than falling back to QA/test content.

For the morning batch, individual NOTIFY-001 draft emails must be suppressed. The intended editor experience is one AUTO-001 consolidated email containing the five daily articles. Ad-hoc/non-morning draft creation retains NOTIFY-001.

## Editorial image acquisition and assignment

Only Editorial Images that are usage-approved, approved or published, backed by a Sanity asset and supported by reviewed rights metadata may be automatically assigned. The canonical frontend contract remains `article.featuredImage`.

Automatic assignment is relevance-first and fail-closed:

- reject province/team mismatches;
- do not select generic or unrelated imagery simply because it is approved;
- prefer a direct match to team, named player/coach, fixture/event, competition or venue;
- if no sufficiently relevant approved image exists, leave the article without an automatically assigned image;
- amateur/veterans imagery such as Ageing Pandas must not illustrate professional province/national-team stories unless directly relevant to the article.

Apify may be used to expand the candidate pool, but collection is **candidate-only**. Preserve source page, image URL, caption/alt/context and any rights/licensing/permission evidence. Deduplicate before import. Do not auto-approve third-party photographs and do not hotlink unreviewed candidates into public pages.

Current immediate media target: collect at least 200 additional relevant candidates spanning Leinster, Munster, Ulster, Connacht, Ireland Men/Women, current players/coaches, new signings, professional match/training action, major competitions and relevant venues.

## Editorial Review

The authenticated Sanity Editorial Review workspace includes Review Queue, Draft Editor, Editorial Review Summary, AI Editorial Review, Featured Image, Sources, Fact Ledger, Workflow and Audit History panels. PR #174 adds direct article-body editing inside this workspace with heading preservation; authenticated Studio verification remains required before that issue is closed.

Deterministic checks recalculate locally and block approval/publication when blocking issues remain. AI review runs only when requested, never edits content, and does not alter workflow rules.

## Notification workflows

- Ad-hoc new Sanity draft: `editor@therugbypanda.ie` through NOTIFY-001.
- Morning package: one consolidated five-article email through AUTO-001.
- Workflow failures/technical alerts: `admin@therugbypanda.ie` through NOTIFY-002/003.
- Public contact: `hello@therugbypanda.ie`.

Persistent Make deduplication uses `Rugby Panda Event Deduplication`, keyed by `eventId`. Exact duplicate replay must not send a second email. Different material failure types on the same operational day use distinct stable failure identities.

## Current verification boundary — 18 August 2026

Production verified foundations: AUTO-001 delivery, NOTIFY-001, NOTIFY-002/003, AUTO-004 QA exclusion/diversity guard, controlled acquisition import and Sanity province taxonomy mapping.

Merged but requiring representative verification: #174 morning notification suppression/editorial quality/body editing and #176 multi-source synthesis/fail-closed image relevance.

The next chat should follow `docs/39_2026-08-18_AUTO-004_Multisource_Image_Handoff.md`, expand the image candidate library through Apify if available, regenerate representative multi-source stories, inspect the copy/images, verify Editorial Review editing, and then verify exactly one consolidated AUTO-001 email.