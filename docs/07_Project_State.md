# Project State

## Current Version

v0.3 — CMS Foundation

## Last Updated

4 July 2026

## Source of truth

Read these files first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/10_New_Chat_Handoff.md`

Do not rely on chat history for current status.

## Connectors

Expected and verified connectors:

- GitHub
- Vercel

Sanity MCP was installed on the user's account but was not exposed to the previous chat tools. Always check available connectors before asking the user to configure one.

## Completed

- Brand, domain, DNS and Vercel deployment are working.
- Social profiles are created.
- Main site header, footer, homepage, article page, category pages and search placeholder exist.
- Hosted Sanity Studio is the canonical CMS.
- Sanity schemas exist for articles, authors, categories, provinces, competitions and tags.
- Homepage, article pages and category pages read from Sanity.
- Local article mock data was removed from frontend rendering.
- Seed script and no-terminal GitHub Actions seed workflow exist and have been run successfully.
- Live validation workflow exists.
- Favicon is now visible in Chrome, but needs a dedicated small-size design.
- Documentation source-of-truth structure exists.
- New handoff document exists at `docs/10_New_Chat_Handoff.md`.

## Current production deployment

Latest observed Vercel production deployment:

- Project: `therugbypanda`
- Vercel project ID: `prj_UBMV1A9JsFi7I84zmAxJozi7Ct4E`
- Vercel team ID: `team_4y2XZGwKXqSLRqi9EqNdvUFW`
- Latest observed production commit: `538af6b2ae8d3b81db515bdf4d04336049cd4f67`

Preview deployments were observed for `docs-project-state-issue-log` and `sprint-3-seo-publishing-polish`.

## Current branch work

### `sprint-3-seo-publishing-polish`

Implemented on branch but not merged:

- CMS-backed `/sitemap.xml`.
- CMS-backed `/robots.txt`.
- CMS-backed `/rss.xml`.
- Article SEO metadata.
- Article `NewsArticle` JSON-LD.
- Category SEO metadata.
- Homepage bottom section order fix.
- Duplicate News section fix.

## Current article URL

`/articles/leinster-season-preview-2026`

## Current task

Continue Sprint 3 — CMS and Publishing Platform. Hosted Sanity Studio is the canonical CMS. Sprint 3 is mostly complete, but production verification and polish remain.

## Sprint 3 status

Estimated completion: 90–95%.

Completed:

1. Sanity dependencies and configuration.
2. Sanity Studio route.
3. CMS schemas.
4. Homepage connected to Sanity.
5. Article pages connected to Sanity.
6. Category pages connected to Sanity.
7. Local mock data removed from frontend rendering.
8. Seed script and no-terminal seed workflow.
9. Live validation workflow.
10. Starter CMS content seeded.
11. Documentation structure and issue log created.

Pending:

1. Dedicated favicon design.
2. Header masthead proportions.
3. SEO endpoints and metadata branch merge/deploy/verification.
4. Homepage bottom section duplicate/order fix deploy/verification.
5. Featured image uploads and metadata in Sanity.
6. Search remains placeholder.

## Immediate next tasks

1. Start the next chat and read the project documentation first.
2. Check available connectors, especially GitHub and Vercel.
3. Confirm latest production deployment commit using Vercel connector.
4. Merge and deploy `sprint-3-seo-publishing-polish` when ready.
5. Verify `/sitemap.xml`, `/robots.txt` and `/rss.xml` after deployment.
6. Fix header logo proportions.
7. Prepare a dedicated favicon asset based on the approved panda brand.
8. Upload proper CMS featured images in Sanity.

## Known issues

Track all issues in `docs/08_Issue_Log.md`.

Current important issues:

- `INF-001` — Vercel deployment limit and deployment verification.
- `WEB-001` — favicon visible but too small.
- `WEB-002` — duplicate homepage section links fixed on branch, pending deployment.
- `WEB-003` — header logo proportions.
- `WEB-004` — dedicated favicon design.
- `CMS-002` — CMS article images missing.

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
