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
- Favicon is now visible in Chrome, but needs production verification for the dedicated small-size SVG asset.
- Documentation source-of-truth structure exists.
- New handoff document exists at `docs/10_New_Chat_Handoff.md`.

## Current production deployment

Latest observed Vercel production deployment:

- Project: `therugbypanda`
- Vercel project ID: `prj_UBMV1A9JsFi7I84zmAxJozi7Ct4E`
- Vercel team ID: `team_4y2XZGwKXqSLRqi9EqNdvUFW`
- Latest observed production commit: `538af6b2ae8d3b81db515bdf4d04336049cd4f67`

Production commit still needs to be rechecked with the Vercel connector before closing `INF-001`.

## Current branch work

### `feature/seo-publishing-final`

Implemented on branch, pending PR/merge/deployment/production verification:

- CMS-backed `/sitemap.xml`.
- CMS-backed `/robots.txt`.
- CMS-backed `/rss.xml`.
- Article SEO metadata.
- Article `NewsArticle` JSON-LD.
- Category SEO metadata.
- Homepage bottom section order fix remains implemented in `lib/cms.ts` via ordered section links and News de-duplication.
- Masthead proportions polish: larger panda mark, smaller wordmark and tighter spacing.
- Dedicated small-size SVG favicon asset and `/favicon.ico` redirect to that asset.

## Current article URL

`/articles/leinster-season-preview-2026`

## Current task

Continue Sprint 3 — CMS and Publishing Platform. Hosted Sanity Studio is the canonical CMS. Sprint 3 is mostly complete, but production verification and polish remain.

## Sprint 3 status

Estimated completion: 95%.

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
12. SEO and publishing endpoints implemented on `feature/seo-publishing-final`.
13. Article/category metadata and article JSON-LD implemented on `feature/seo-publishing-final`.
14. Header masthead proportions and dedicated favicon implemented on `feature/seo-publishing-final`.

Pending:

1. Open, review, merge and deploy `feature/seo-publishing-final`.
2. Verify `/sitemap.xml`, `/robots.txt` and `/rss.xml` after deployment.
3. Verify article/category metadata and article JSON-LD in production.
4. Verify homepage bottom section order in production.
5. Verify header masthead proportions on desktop, tablet and mobile.
6. Verify dedicated favicon in production browsers.
7. Featured image uploads and metadata in Sanity.
8. Search remains placeholder.

## Immediate next tasks

1. Open PR for `feature/seo-publishing-final`.
2. Use a single preview deployment for the branch where possible.
3. Review preview/build status before merge.
4. Merge only when ready to avoid unnecessary production deployments.
5. After merge, confirm production deployment commit with Vercel connector.
6. Verify `/sitemap.xml`, `/robots.txt`, `/rss.xml`, article SEO, category SEO, JSON-LD, homepage sections, masthead and favicon.
7. Upload proper CMS featured images in Sanity.

## Known issues

Track all issues in `docs/08_Issue_Log.md`.

Current important issues:

- `INF-001` — Vercel deployment limit and deployment verification.
- `WEB-001` — favicon visible but too small; dedicated favicon implemented on branch, pending deployment/verification.
- `WEB-002` — duplicate homepage section links fixed on branch, pending deployment/verification.
- `WEB-003` — header logo proportions implemented on branch, pending deployment/verification.
- `WEB-004` — dedicated favicon design implemented on branch, pending deployment/verification.
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
