# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last updated

28 July 2026, after the one-click publication workflow, automatic image-backed social distribution contract and AI-assisted publication preview direction were approved.

## Source of truth

Read these files first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/10_New_Chat_Handoff.md`
5. `docs/11_Editorial_Image_Archive.md`
6. `docs/12_Brand_Assets_Library.md`
7. `docs/33_Version_1_Product_Roadmap.md`
8. `docs/35_Automatic_Social_Distribution.md`
9. `docs/36_Publication_Preview_and_AI_Image_Selection.md`
10. `docs/37_Publication_Pipeline.md`
11. All later numbered documents relevant to the task, especially `docs/23_Make_Orchestration_Architecture.md`, `docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md`, `docs/27_Sprint_5_Production_State.md`, `docs/31_NOTIFY_001_Desktop_Completion_Handoff.md` and `docs/32_Sprint_5_State_After_PR_91.md`.

Do not rely on chat history for current status.

## Operating context

- Timezone: `Europe/Dublin`.
- Daily editorial deadline: 08:00 Europe/Dublin.
- GitHub is the source of truth.
- Sanity is the canonical CMS and mandatory human approval boundary.
- No acquired or AI-generated content is automatically approved.
- Article approval is the single human approval boundary for website publication and automatic social distribution.
- Original Rugby Panda photography is the preferred image source.
- Third-party photographs must have documented free-use rights or explicit permission.

## Architecture

```text
GitHub source of truth
→ Make.com orchestration
→ Apify acquisition
→ Editorial Brain and OpenAI generation
→ Sanity canonical CMS and editorial review
→ controlled website publication
→ automatic publication preparation
→ AI image selection and platform preparation
→ Vercel public website
→ Meta social distribution
```

## Current production and implementation state

- Sprint 4 is complete.
- Sprint 5 Editorial & Publishing Automation is in progress.
- Editorial Brain, structured generation, approved-image assignment and controlled workflow endpoints are merged.
- The authenticated Sanity Editorial Review workspace is implemented.
- Deterministic Editorial Review Intelligence and on-demand AI Editorial Review are merged.
- Real Sanity-backed website search is merged and production verified.
- The review-ready notification webhook foundation is merged and reaches Make.
- The Make.com MCP toolbox is connected, but the currently exposed toolset does not permit scenario editing.
- Automatic Sanity Studio deployment after merge is working.
- PR #100, Social Publishing Foundation, is merged.
- PR #101, Publication Preview and AI Image Selection contract, is open and mergeable. It is not yet merged, deployed or production verified.
- `main` currently includes the approved automatic image-backed social workflow document.

## Approved publication model

The approved editorial and publication model is:

1. AI-assisted draft generation.
2. Human editorial review in Sanity.
3. One human approval.
4. Controlled website publication.
5. Automatic publication preparation.
6. AI-assisted selection of usage-approved imagery for website, Facebook and Instagram.
7. Platform-specific caption generation.
8. Website preview, SEO, accessibility and social-readiness checks.
9. Automatic Facebook and Instagram distribution unless the editor selects the exception override.
10. Delivery status, platform IDs, retries and errors written back to Sanity.

There is no second social-media approval step.

Website publication and social delivery remain technically decoupled. A social or preparation failure must never unpublish, roll back or block an approved website article.

## Image policy for social distribution

- Every article promotion post must include a picture.
- Text-only article promotion is prohibited.
- Only usage-approved images with sufficient rights metadata may be considered.
- The workflow may choose different images for website, Facebook and Instagram.
- The AI image selector must score relevance, visual impact, crop suitability, rights completeness and platform fit.
- Missing-image cases must stop social delivery, record an actionable error and retry when an eligible image becomes available.
- Fixing a missing image does not require another editorial approval.

## Publication Preview direction

The planned Sanity Publication Preview must show or store:

- website preview URL;
- selected website image;
- selected Facebook image;
- selected Instagram image;
- image alt text;
- Facebook copy preview;
- Instagram copy preview;
- SEO score;
- accessibility score;
- social-readiness score;
- passed checks, warnings, failures and automatic fixes.

The preview and checks prepare publication automatically; they do not create a second approval gate.

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
- AI-assisted publication previews;
- AI-assisted platform-specific image selection and cropping;
- secure phone-first photo uploads;
- AI-assisted image metadata, quality scoring and duplicate detection;
- a searchable Media Desk;
- rights and attribution controls;
- approved Sanity-hosted team and competition logos;
- future fixtures, results, standings and editorial intelligence;
- a future analytics feedback loop that improves image and caption selection from actual Rugby Panda engagement data.

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

1. Merge and verify PR #101.
2. Build the visual Publication Preview component in Sanity Studio.
3. Define and implement the Make.com publication-preparation and social-distribution scenario.
4. Implement AI image candidate collection and ranking using only usage-approved assets.
5. Implement platform-specific captions, image transforms, idempotency, partial-success handling and retries.
6. Complete NOTIFY-001 email mapping and persistent deduplication.
7. Add workflow failure and technical alerts to `admin@therugbypanda.ie`.
8. Execute a complete controlled editorial lifecycle test through production rendering and social preparation.
9. Complete the nine-article launch package and verify it in production.

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
- Never allow social-delivery failure to reverse a successful website publication.
