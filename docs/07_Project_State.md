# Project State

## Current Version

v0.9 — Editorial Engine Foundation

## Last Updated

24 July 2026, AI Editorial Review implementation for PR #63 (not merged)

## Source of truth

Read these files first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/10_New_Chat_Handoff.md`
5. `docs/11_Editorial_Image_Archive.md`
6. `docs/12_Brand_Assets_Library.md`
7. All later numbered documents, including:
   - `docs/23_Make_Orchestration_Architecture.md`
   - `docs/24_Editorial_Image_Canonical_Metadata_Review.md`
   - `docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md`

Do not rely on chat history for current status.

## User operating context

- The project owner is based in Dublin, Ireland.
- Use `Europe/Dublin` for all schedules, deadlines, reports and timestamps unless explicitly instructed otherwise.
- The daily editorial deadline remains 08:00 Europe/Dublin.

## Connector status

Verified during the 23–24 July 2026 session:

- GitHub — available and read/write capable.
- Vercel — available for deployment and production checks.
- Apify — available.
- Sanity direct connector — available for authenticated production data queries.
- Make.com — not connected.

Connector availability must be checked again in every new session.

## Agreed architecture

```text
GitHub source of truth
→ Make.com orchestration
→ Apify acquisition
→ Editorial Brain and OpenAI generation
→ Sanity canonical CMS and editorial review
→ Vercel public website
```

GitHub stores code, prompts, schemas, reusable business logic, workflows and documentation. Make.com will provide persistent scheduling, retries, notifications and cross-service coordination. Apify collects approved-scope source candidates. The Editorial Brain validates and scores candidates, builds a source-linked fact ledger and enforces originality rules. OpenAI creates structured drafts from approved facts. Sanity remains the human review and publication boundary. Vercel serves the public site.

No generated article or acquired asset is automatically approved or published.

## Current state

Sprint 4 is complete. Sprint 5 Editorial & Publishing Automation is in progress.

The following editorial foundation pull requests are merged into `main`:

- PR #47 — Editorial Brain core.
- PR #48 — OpenAI Responses API generation and protected Sanity draft creation.
- PR #49 — approved Editorial Image assignment to generated article drafts.
- PR #50 — controlled editorial review and publishing workflow.

PR #50 merged at commit `70916d5bd9070f1c77cf92e3f767722d68b1cbf2` on 23 July 2026 at 23:00 UTC / 24 July 2026 at 00:00 Europe/Dublin.

The backend can now:

1. classify and score a structured story candidate;
2. build a source-linked fact ledger with confidence controls;
3. generate an original structured article through OpenAI;
4. create or replace a Sanity draft through `POST /api/editorial/draft`;
5. assign only approved, usage-approved Editorial Images backed by a Sanity asset;
6. submit, approve, reject, publish or discard through `POST /api/editorial/workflow`;
7. enforce valid server-side state transitions;
8. retain actor, timestamp, notes, status and rejection history;
9. flag rejected drafts as requiring replacement.

Both protected editorial endpoints require bearer authentication with `EDITORIAL_AUTOMATION_SECRET`.

PR #62, **Editorial Review Intelligence — Framework**, is merged at commit `6791877`. It adds deterministic local review checks, live score/readiness reporting, native Irish-English browser spellchecking, and an approval/publication gate for blocking review issues.

PR #63, **AI Editorial Review**, is implemented on the current branch but is not yet merged, deployed or verified in authenticated Sanity Studio. It adds an on-demand AI Editorial Review panel below the deterministic review. The panel calls the Next.js/Vercel backend at `https://therugbypanda.ie/api/editorial/review`, rather than the hosted Sanity Studio origin. The protected endpoint uses the existing OpenAI Responses API with strict structured JSON output and disabled response storage. It reviews the current editor copy and retained source/fact-ledger context for spelling, grammar, awkward phrasing, factual support, certainty, readability, SEO, headline and standfirst improvements. Findings are grouped as Blocking, Warnings and Suggestions. It does not edit content, persist review history, alter deterministic checks, workflow actions or publishing logic.
PR #63, **AI Editorial Review**, is implemented on the current branch but is not yet merged, deployed or verified in authenticated Sanity Studio. It adds an on-demand AI Editorial Review panel below the deterministic review. The protected endpoint uses the existing OpenAI Responses API with strict structured JSON output and disabled response storage. It reviews the current editor copy and retained source/fact-ledger context for spelling, grammar, awkward phrasing, factual support, certainty, readability, SEO, headline and standfirst improvements. Findings are grouped as Blocking, Warnings and Suggestions. It does not edit content, persist review history, alter deterministic checks, workflow actions or publishing logic.

The foundation is implemented and merged. It is not yet considered fully complete because authenticated Sanity Studio operation and production end-to-end publication verification remain pending.

## Editorial Image status

- 40 raw Editorial Image documents.
- 38 canonical records.
- 24 publication-ready.
- 16 needing attention.
- 34 approved or published.
- 10 approved/published but not ready.
- 0 duplicate Sanity asset groups.
- 2 duplicate source groups caused by draft/published pairs.

A controlled canonical metadata dry run and explicit apply completed successfully for two reviewed records. Direct Sanity data verification succeeded; authenticated Studio UI verification remains pending.

## Primary project directive

The immediate priority remains **go live**.

The launch minimum is:

1. One introduction article about The Rugby Panda.
2. At least eight additional reviewed articles.
3. Coverage of recent international matches and Leinster, Munster, Ulster and Connacht.
4. Accurate backdating where appropriate to the event date or immediate aftermath.
5. A reviewed and approved image for every story.
6. Production verification of homepage, category pages and article pages.

See `docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md`.

## Daily editorial operating target

After launch:

- Eight review-ready article drafts every day.
- All eight available by 08:00 Europe/Dublin.
- Coverage distributed across active website sections.
- The editor can amend, approve or reject.
- Approved drafts publish through the controlled CMS workflow.
- Rejected drafts are discarded and replaced automatically with a new non-duplicate candidate.
- Human editorial approval remains mandatory.

## Accreditation and analytics directive

Analytics is a core platform requirement, not a later enhancement. The project must build verifiable evidence of:

- consistent publishing cadence;
- durable publication timestamps and editorial history;
- article-level and site-level readership;
- users, sessions, page views and engagement;
- returning readership;
- traffic sources and referrals;
- Google Search Console impressions, clicks and rankings;
- reproducible monthly exports and accreditation evidence packs.

Track this work under `ACCRED-001`. The evidence must be credible enough for media accreditation applications and useful for future sponsors and advertisers.

## Security directive

Protect the project against unauthorised access, copying, destructive changes and accidental deletion.

Security work must cover:

- GitHub repositories and Actions.
- Sanity datasets, roles and tokens.
- Vercel projects and environment variables.
- Cloudflare, DNS and domain ownership.
- Apify and Make.com credentials and spending controls.
- Independent backups.
- Tested restoration and credential-rotation procedures.

A backup is not considered verified until restoration has been tested.

## Mobile photography directive

Original Rugby Panda photos need a secure phone-friendly ingestion path.

The preferred implementation is direct authenticated upload to Sanity Assets, automatic creation of an `editorialImage` draft, metadata assistance and default public attribution:

- `Photo: The Rugby Panda`
- `© The Rugby Panda`

GitHub remains the source of code and metadata contracts, not the primary binary photo library.

## Current priorities

1. Build the authenticated Sanity Studio editorial review workspace for PR #50 workflow actions.
2. Implement rejection-triggered automatic replacement generation under `AUTO-002`.
3. Complete authenticated Studio and production end-to-end verification of `AUTO-001`.
4. Complete `CMS-002` by assigning approved images to existing and launch articles.
5. Create the nine-article minimum launch package under `LAUNCH-001`.
6. Review, publish and verify the full launch package in production.
7. Implement the analytics and accreditation evidence baseline under `ACCRED-001`.
8. Implement and verify the security, backup and recovery baseline under `SEC-001`.
9. Deliver eight review-ready drafts by 08:00 daily under `AUTO-003`.
10. Build secure mobile photo ingestion under `MEDIA-004`.
11. Implement real website search under `WEB-005`.

## Completion rule

Always distinguish:

- implemented
- committed
- merged
- deployed
- verified in production
- verified in authenticated Sanity Studio
- documentation updated

A feature is not complete until the relevant production or authenticated-Studio verification has happened.

## Deployment budget rule

The Vercel free plan has a maximum of 100 deployments per day. Batch related work into one branch and one production deployment where practical.

## Working principles

- Documentation is the source of truth.
- Prefer maintainable reusable components and workflows.
- Keep `main` deployable.
- Keep the Issue Log current.
- Original Rugby Panda photography is preferred.
- Mobile-first design.
- Reader-first advertising.
- Do not expose AI implementation references publicly on the reader-facing website.
