# Project State

## Current Version

v0.4 — Publishing Foundation + Editorial Media Archive

## Last Updated

4 July 2026

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

Latest verified production deployment:

- Project: `therugbypanda`
- Vercel project ID: `prj_UBMV1A9JsFi7I84zmAxJozi7Ct4E`
- Vercel team ID: `team_4y2XZGwKXqSLRqi9EqNdvUFW`
- Latest verified production commit: `61fb43ea513e7f56d90244051c7a03a66e09c0c8`
- Related PRs: #23 and #24

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
- CMS-backed `/sitemap.xml`, `/robots.txt`, and `/rss.xml` are implemented, merged, deployed and verified in production.
- Article SEO metadata, article `NewsArticle` JSON-LD and category SEO metadata are implemented, merged, deployed and verified in production.
- Homepage section ordering, masthead proportions and dedicated favicon are implemented, merged, deployed and verified in production.
- Apify → GitHub → Sanity import pipeline imported 16 `editorialImage` candidate records into the Sanity production dataset.

## Current branch work

### `feature/editorial-image-studio`

Implemented on branch, pending PR/merge/deployment/verification:

- Registers `editorialImage` in `schemaTypes`.
- Adds an `Editorial Images` section to the Sanity Studio structure.
- Adds thumbnail previews for manually uploaded Sanity images and imported image URLs.
- Preserves imported Apify metadata fields such as image URLs, thumbnails, source, creator, licence, attribution, dimensions and import details.
- Allows editors to edit lifecycle status, usage approval, editorial rating, editorial category, photo type and tags.
- Supports manual uploads in the same `editorialImage` collection.
- Enforces public attribution rules for original Rugby Panda images:
  - `Photo: The Rugby Panda`
  - `© The Rugby Panda`

## Current article URL

`/articles/leinster-season-preview-2026`

## Sprint 3 status

Sprint 3 — CMS and Publishing Platform is effectively complete.

Pending after Sprint 3:

1. CMS image library and proper featured images.
2. Search remains placeholder.
3. Newsletter capture remains future work.
4. Editorial workflow polish remains future work.

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

Original Rugby Panda photos uploaded in chat:

- 20+ images reviewed visually.
- 8 hero-quality images identified.
- 5 evergreen images identified.
- Initial categories and metadata taxonomy defined.

Starter external editorial image library:

- 16 editorial image candidate records imported into Sanity production dataset.
- These are not yet considered approved until reviewed in Studio.

## Deployment budget rule

Vercel has a 100 deployments/day limit. Treat deployments as a constrained resource.

Default workflow:

1. Batch related work into a single branch.
2. Open one PR.
3. Use one preview deployment where possible.
4. Merge automatically when preview/build is clean and scope is agreed.
5. Use one production deployment.
6. Verify once in production.

Only create isolated hotfix PRs for genuine production issues.

## Immediate next tasks

1. Open PR for `feature/editorial-image-studio`.
2. Confirm preview/build status.
3. Merge when clean.
4. Verify Sanity Studio shows the 16 imported `editorialImage` records.
5. Verify an imported image can be approved by editing `lifecycleStatus` and `usageApproved`.
6. Verify a manual upload appears alongside imported images.
7. Add proper featured images to current CMS articles.
8. Begin Sprint 4 planning: search, newsletter capture and editorial workflow polish.

## Known issues

Track all issues in `docs/08_Issue_Log.md`.

Current important issues:

- `CMS-002` — CMS article images missing.
- `MEDIA-001` — Editorial Image Archive Studio visibility and review workflow.
- `MEDIA-002` — starter editorial image library review and approval.
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
