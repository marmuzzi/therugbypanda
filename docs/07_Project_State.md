# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last updated

27 July 2026, after the Version 1.0 product direction was approved and the implementation branch `feat/v1-newsroom-navigation-docs` was created.

## Source of truth

Read these files first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/10_New_Chat_Handoff.md`
5. `docs/11_Editorial_Image_Archive.md`
6. `docs/12_Brand_Assets_Library.md`
7. `docs/33_Version_1_Product_Roadmap.md`
8. All later numbered documents relevant to the task, especially `docs/23_Make_Orchestration_Architecture.md`, `docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md`, `docs/27_Sprint_5_Production_State.md`, `docs/31_NOTIFY_001_Desktop_Completion_Handoff.md` and `docs/32_Sprint_5_State_After_PR_91.md`.

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
- The review-ready notification webhook foundation is merged and reaches Make.
- The Make.com MCP toolbox is connected, but the currently exposed toolset does not permit scenario editing.
- The repository now contains later frontend commits beyond the older PR #91 documentation baseline; live repository state must be inspected before quoting a current `main` SHA.
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

NOTIFY-001 is partially verified:

- controlled submit reaches the workflow API;
- Make receives the webhook;
- the payload contains stable IDs, article title, optional submission note and hosted review URL;
- a test email was delivered to `editor@therugbypanda.ie`.

NOTIFY-001 is not complete until a correctly populated production email, persistent `eventId` deduplication, replay protection and failure-path behaviour are verified.

## Production mailboxes

- `admin@therugbypanda.ie` — infrastructure, billing, security, workflow failures and technical alerts.
- `hello@therugbypanda.ie` — public contact mailbox.
- `editor@therugbypanda.ie` — article-ready-for-review, approval, accreditation and media communication.

## Immediate priority

1. Complete the Version 1.0 navigation and branding pass.
2. Create and production-verify the dedicated News archive.
3. Update the mobile navigation pattern.
4. Complete NOTIFY-001 email mapping and persistent deduplication.
5. Verify one correctly populated email and a duplicate replay that sends no second email.
6. Add workflow failure and technical alerts to `admin@therugbypanda.ie`.
7. Execute a complete controlled editorial lifecycle test through production rendering.
8. Complete the nine-article launch package and verify it in production.
9. Begin the Social Distribution and Media Desk foundations only after the Version 1.0 frontend is merged and verified.

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
- documentation updated.

A feature is not complete until the relevant verification has passed.

## Working principles

- Prefer maintainable reusable components.
- Keep `main` deployable.
- Keep `docs/08_Issue_Log.md` current.
- Batch related work where practical to conserve deployments.
- Do not expose AI implementation references on reader-facing pages.
- Do not publish third-party photographs without documented rights.
- Do not use external candidate-logo URLs in public templates.
