# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last updated

30 July 2026, after NOTIFY-001 was completed and production verified, including persistent Make.com deduplication and replay protection.

## Source of truth

Read these files first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/10_New_Chat_Handoff.md`
5. `docs/11_Editorial_Image_Archive.md`
6. `docs/12_Brand_Assets_Library.md`
7. `docs/33_Version_1_Product_Roadmap.md`
8. All later numbered documents relevant to the task, especially `docs/23_Make_Orchestration_Architecture.md`, `docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md`, `docs/27_Sprint_5_Production_State.md`, `docs/31_NOTIFY_001_Desktop_Completion_Handoff.md`, `docs/32_Sprint_5_State_After_PR_91.md` and `docs/34_2026-07-29_Automation_Handoff.md`.

Do not rely on chat history for current status.

## Operating context

- Timezone: `Europe/Dublin`.
- Daily editorial deadline: 08:00 Europe/Dublin.
- GitHub is the source of truth.
- Sanity is the canonical CMS and mandatory human approval boundary.
- No acquired or AI-generated content is automatically approved or published.
- Original Rugby Panda photography is the preferred image source.
- Third-party photographs must have documented free-use rights or explicit permission.

## Architecture

```text
GitHub source of truth
→ Make.com orchestration
→ Apify acquisition
→ Editorial Brain and OpenAI generation
→ Sanity canonical CMS and editorial review
→ Vercel public website
→ Meta social distribution after controlled publication
```

## Current production state

- Sprint 4 is complete.
- Sprint 5 Editorial & Publishing Automation is in progress.
- Editorial Brain, structured generation, approved-image assignment and controlled workflow endpoints are merged.
- The authenticated Sanity Editorial Review workspace is implemented.
- Deterministic Editorial Review Intelligence and on-demand AI Editorial Review are merged.
- Real Sanity-backed website search is merged and production verified.
- OpenAI generation timeout handling is corrected: the route now permits longer execution and the generator no longer clamps requests to 50 seconds.
- The Sanity email review link now uses the correct intent route format and opens the intended draft.
- `NOTIFY-001 – New Draft Notification` is implemented and production verified in Make.com.
- The Make.com MCP toolbox is connected, but the currently exposed toolset does not permit scenario editing.
- Automatic Sanity Studio deployment after merge is working.

## Version 1.0 product direction

The approved immediate frontend work is:

1. Increase the Panda icon while reducing the Rugby Panda wordmark.
2. Add a dedicated `/news` page containing all published articles in reverse chronological order.
3. Make the News navigation item point to `/news` instead of the homepage.
4. Keep About in both the top navigation and footer.
5. Replace overflowing mobile category links with a proper hamburger menu.
6. Add Europe and Opinion as top-level navigation sections without changing the existing International taxonomy contract until an explicit taxonomy migration is approved.
7. Keep article photography consistent between cards and article pages.
8. Use branded Panda imagery only for articles explicitly marked for editorial branding.

## Digital newsroom roadmap

The approved next product phases are documented in `docs/33_Version_1_Product_Roadmap.md` and include:

- automatic Facebook and Instagram snippets after controlled publication;
- a social publishing opt-out field in Sanity;
- secure phone-first photo uploads;
- AI-assisted image metadata, quality scoring and duplicate detection;
- a searchable Media Desk;
- rights and attribution controls;
- approved Sanity-hosted team and competition logos;
- future fixtures, results, standings and editorial intelligence.

## Editorial Review production state

Implemented, merged, deployed and authenticated-Studio verified through the PR #91 baseline:

- Studio-session authentication; no browser-entered workflow secret.
- Restored submission and rejection note field.
- Draft queue includes manually created unpublished documents before workflow metadata exists.
- Raw draft-aware Sanity queries with supported `_id in path("drafts.**")` filtering.
- Mobile-first single-column layout.
- Article Quality first and AI Editorial Review immediately below it.
- Improved contrast and typography across quality findings, metadata, Sources, Fact Ledger and Workflow cards.
- Automatic hosted Studio deployment after relevant merges.

## Notification state

`NOTIFY-001 – New Draft Notification` is complete and production verified.

Verified path:

```text
Editorial QA
→ Editorial API
→ OpenAI article generation
→ Sanity draft creation
→ Make.com webhook
→ eventId duplicate check
→ editorial email
→ persistent workflow record
```

Verified behaviour:

- controlled draft generation succeeds;
- Make receives `editorial.article.draft_created`;
- the payload includes `eventId`, article ID, title, destination, timestamp, optional submission note and review URL;
- the email reaches `editor@therugbypanda.ie`;
- the corrected Sanity deep link opens the intended draft;
- Make checks the `Rugby Panda Event Deduplication` data store using `eventId` as the key;
- new events pass through the `New event only` filter;
- successful email delivery is followed by an add/replace data-store write;
- duplicate replay returns `Exists = true`, is blocked by the filter and sends no second email;
- persisted records include event type, processed timestamp, article ID, workflow status and initial social-delivery states.

Application changes supporting this verification:

- PR #142 increased the editorial route and requested OpenAI timeout.
- PR #143 removed the hidden 50-second generator clamp.
- PR #144 corrected the Sanity Studio intent URL.

Failure routing to `admin@therugbypanda.ie` remains the next notification task under `NOTIFY-002`.

## Production mailboxes

- `admin@therugbypanda.ie` — infrastructure, billing, security, workflow failures and technical alerts.
- `hello@therugbypanda.ie` — public contact mailbox.
- `editor@therugbypanda.ie` — article-ready-for-review, approval, accreditation and media communication.

## Immediate priority

1. Add workflow failure and technical alerts to `admin@therugbypanda.ie` (`NOTIFY-002`).
2. Continue `AUTO-001 – Morning Editorial Package` in Make.com.
3. Capture and map a real `editorial.daily_package.ready` payload.
4. Add persistent `eventId` deduplication and one consolidated five-article editorial email.
5. Verify a duplicate package replay sends no second email.
6. Configure and verify the 07:50 Europe/Dublin daily trigger.
7. Execute a complete controlled editorial lifecycle test through production rendering.
8. Complete the nine-article launch package and verify it in production.
9. Begin Social Distribution only after AUTO-001 and its failure paths pass.

## Launch minimum

- One introduction article about The Rugby Panda.
- At least eight additional reviewed, image-backed articles.
- Coverage of recent internationals and Leinster, Munster, Ulster and Connacht.
- Correct publication dates.
- Production verification of homepage, news, category and article pages.
- Mobile navigation verified on a phone-sized viewport.

## Completion rule

Always distinguish:

- implemented;
- committed;
- merged;
- deployed;
- verified in production;
- verified in authenticated Sanity Studio;
- verified in Make.com;
- documentation updated.

A feature is not complete until the relevant verification has passed.

## Working principles

- Prefer maintainable reusable components.
- Keep `main` deployable.
- Keep `docs/08_Issue_Log.md` current.
- Batch related work where practical to conserve deployments.
- Keep separate Make scenarios focused on one responsibility.
- Do not expose AI implementation references on reader-facing pages.
- Do not publish third-party photographs without documented rights.
- Do not use external candidate-logo URLs in public templates.
