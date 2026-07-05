# Project State

## Current Version

v0.4 — Publishing Foundation + Editorial Media Archive

## Last Updated

5 July 2026

## Source of truth

Read these files first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/10_New_Chat_Handoff.md`
5. `docs/11_Editorial_Image_Archive.md`

Do not rely on chat history for current status.

## Connectors

Expected connectors:

- GitHub
- Vercel
- Apify, when available in the active chat

Sanity MCP may be installed on the user's account but has not consistently appeared in available tools. Always check available connectors before asking the user to configure one.

## Current production deployment

Latest verified production deployment remains commit `61fb43ea513e7f56d90244051c7a03a66e09c0c8` until the current build fix is deployed and verified.

Recent deployment note:

- Vercel build failed on 4 July 2026 because `lib/cms.ts` temporarily lost helper exports used by article, RSS and sitemap routes.
- Fix committed on 5 July 2026: `41ace4780c9210a87d4d87579202b918665ec241`.
- Pending verification: Vercel build/deploy for commit `41ace4780c9210a87d4d87579202b918665ec241`.

## Completed

- Brand, domain, DNS and Vercel deployment are working.
- Social profiles are created.
- Main site header, footer, homepage, article page, category pages and search placeholder exist.
- Hosted Sanity Studio is the canonical CMS.
- Homepage, article pages and category pages read from Sanity.
- Local article mock data was removed from frontend rendering.
- Seed script and no-terminal GitHub Actions seed workflow exist and have been run successfully.
- Live validation workflow exists.
- Documentation source-of-truth structure exists.
- CMS-backed `/sitemap.xml`, `/robots.txt`, and `/rss.xml` are implemented.
- Article SEO metadata, article `NewsArticle` JSON-LD and category SEO metadata are implemented.
- Homepage section ordering, masthead proportions and dedicated favicon are implemented and verified.
- Apify → GitHub → Sanity import pipeline imported 16 `editorialImage` candidate records into the Sanity production dataset.
- Sanity Studio now has an Editorial Images section, review queues and a bulk Image Review tool.
- Original Rugby Panda photo import workflow imported 22 original photos into Sanity as approved Rugby Panda originals.
- Original Rugby Panda image public attribution is enforced as:
  - `Photo: The Rugby Panda`
  - `© The Rugby Panda`
- Bulk approval/rejection/archive workflow has been used successfully by the user.

## Current implemented but pending production verification

### International taxonomy rename

Implemented:

- Header navigation changed from `Europe` to `International`.
- `/categories/europe` redirects to `/categories/international`.
- CMS seed script now writes the `International` category and competition.
- Frontend now maps legacy `Europe` category records to `International` so `/categories/international` does not 404 before the seed workflow is rerun.
- Build helper exports restored in `lib/cms.ts` after the Vercel failure.

Pending:

1. Confirm Vercel deployment succeeds for commit `41ace4780c9210a87d4d87579202b918665ec241` or later.
2. Run `Seed Sanity CMS` if the Sanity dataset still contains legacy Europe labels.
3. Verify `/categories/international` renders in production.
4. Verify `/categories/europe` redirects to `/categories/international`.

## Current article URL

`/articles/leinster-season-preview-2026`

## Editorial Media Library strategy

The Rugby Panda treats images as a first-class product asset.

Primary principles:

- Original Rugby Panda photography is always preferred over third-party imagery.
- Public attribution for original images must be `Photo: The Rugby Panda` and `© The Rugby Panda`.
- Do not expose the user's personal identity as photographer or founder on the public website.
- Third-party images may only be used when licence, source, creator and attribution are stored.
- The long-term goal is a searchable, AI-assisted rugby image archive dominated by original Rugby Panda photography.

Current image strategy is documented in `docs/11_Editorial_Image_Archive.md`.

## Current image archive status

Original Rugby Panda photos:

- 22 original Rugby Panda photos imported into Sanity.
- All imported as Rugby Panda originals.
- Public credit and copyright rules applied.
- Approved original photos are visible in the Rugby Panda Originals queue.

Starter external editorial image library:

- 16 external editorial image candidate records imported into Sanity production dataset.
- User has reviewed candidates through the bulk Image Review tool.
- Approved/rejected workflow is functional.

## Deployment budget rule

Vercel has a 100 deployments/day limit. Treat deployments as a constrained resource.

Default workflow:

1. Batch related work into a single branch.
2. Open one PR where possible.
3. Use one preview deployment where possible.
4. Merge automatically when preview/build is clean and scope is agreed.
5. Use one production deployment.
6. Verify once in production.

Only create isolated hotfix PRs for genuine production issues.

## Immediate next tasks

1. Verify the Vercel build succeeds after commit `41ace4780c9210a87d4d87579202b918665ec241`.
2. Verify `/categories/international` works in production.
3. Verify `/categories/europe` redirects to `/categories/international`.
4. Run `Seed Sanity CMS` if legacy Europe records remain visible in Studio or on the website.
5. Begin Sprint 4 planning: Brand Assets library for team logos and competition branding.

## Known issues

Track all issues in `docs/08_Issue_Log.md`.

Current important issues:

- `BUILD-001` — Vercel build failed after International taxonomy change; fix committed and pending deployment verification.
- `CMS-002` — CMS article images missing from live articles.
- `MEDIA-001` — Editorial Image Archive Studio completed, pending production documentation closeout.
- `MEDIA-002` — starter editorial image library review completed by user, pending final production verification count.
- `BRAND-001` — Brand Assets library for team logos and competition branding planned.
- `WEB-005` — Search remains placeholder.

## Working principles

- Project documentation is the source of truth at the start of each session.
- Full file replacements are preferred over partial snippets.
- Batch related changes to reduce Vercel deployment pressure.
- Always distinguish implemented, committed, merged, deployed and verified in production.
- A feature is not complete until verified in production.
- Every meaningful change must update documentation.
- Every issue must stay in `docs/08_Issue_Log.md` until closed.
- Keep `main` deployable.
- Use reusable components only.
- Mobile-first design.
- Reader-first advertising.
- No public AI references.
