# Project State

## Current Version

v0.3 — CMS Foundation

## Last Updated

3 July 2026

## Source of truth

Read these files first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`

Do not rely on chat history for current status.

## Available connectors

Expected and verified connectors:

- GitHub — available and used for repository work.
- Vercel — available and verified on 2026-07-03. Use it to check deployments, production commit, build logs and runtime errors before asking the user to configure Vercel.

Not currently available in this chat:

- Sanity MCP — installed on the user's account but not exposed to the current conversation tools.
- Cloudflare.
- Google Search Console.

Always check available connectors before asking the user to configure one.

## Completed

- The Rugby Panda brand created.
- Domain live: https://therugbypanda.ie
- Cloudflare DNS working.
- Vercel deployment working.
- Instagram profile created: https://www.instagram.com/rugbypandamedia
- Facebook page created: https://www.facebook.com/profile.php?id=61591161347126
- Approved panda logo in use for masthead and article signature.
- Site header, navigation, footer, article cards and article page components created.
- Homepage converted from landing page to editorial newsroom-style homepage.
- Hosted Sanity project prepared with project ID `hvg4b508` and dataset `production`.
- Sanity Studio route added at `/studio`.
- Sanity schemas added for articles, authors, categories, provinces, competitions and tags.
- `lib/sanity.ts` and `lib/cms.ts` added for frontend CMS queries.
- Homepage now reads live Sanity content.
- Article pages now read Sanity content by slug.
- Category pages now read Sanity content.
- Local article mock data removed from frontend rendering.
- `scripts/seed-sanity.mjs` added.
- GitHub Actions workflow added to seed Sanity without a local terminal.
- Seed workflow successfully populated starter CMS content.
- GitHub Actions workflow added to validate live site.
- Favicon audit completed and merged in PR #21, pending production verification.

## Current branch work

### `sprint-3-seo-publishing-polish`

Implemented on branch but not merged:

- CMS-backed `/sitemap.xml`.
- CMS-backed `/robots.txt`.
- CMS-backed `/rss.xml`.
- Article SEO metadata.
- Article `NewsArticle` JSON-LD.
- Category SEO metadata.
- Homepage bottom section order fix: News, Provinces, Ireland, URC, Europe.
- Duplicate News section fix.

### `docs-project-state-issue-log`

Documentation branch currently in progress:

- `docs/08_Issue_Log.md` created.
- `docs/09_Publishing_Workflow.md` created.
- `docs/07_Project_State.md` updated.

## Current article URL

```text
https://therugbypanda.ie/articles/leinster-season-preview-2026
```

## Current task

Continue Sprint 3 — CMS and Publishing Platform. The hosted Sanity Studio is the canonical CMS. Sprint 3 implementation is mostly complete, but deployment and production verification are still pending for several items.

## Sprint 3 status

Estimated completion: 90–95%.

Completed:

1. Sanity dependencies and configuration.
2. Sanity Studio route.
3. Schemas for articles, authors, categories, provinces, competitions and tags.
4. SEO fields and image metadata fields in schema.
5. Homepage connected to Sanity.
6. Article pages connected to Sanity.
7. Category pages connected to Sanity.
8. Local mock data removed from frontend rendering.
9. Seed script and no-terminal seed workflow.
10. Live validation workflow.
11. Starter CMS content seeded.

Pending deployment or verification:

1. Favicon production verification.
2. SEO endpoints and metadata branch merge/deploy/verification.
3. Homepage bottom section duplicate/order fix deploy/verification.
4. Featured image uploads and metadata in Sanity.
5. Search remains placeholder.

## Immediate next tasks

1. Commit documentation branch and open PR.
2. Confirm production deployment commit using Vercel connector.
3. Run Validate Live Site after successful deployment.
4. Verify favicon in Chrome incognito.
5. Merge and deploy `sprint-3-seo-publishing-polish` when deployment pressure is acceptable.
6. Verify `/sitemap.xml`, `/robots.txt` and `/rss.xml` after deployment.
7. Upload proper CMS featured images in Sanity.

## Known issues

Track all issues in `docs/08_Issue_Log.md`.

Current important issues:

- `INF-001` — Vercel deployment rate limit and deployment verification.
- `WEB-001` — Favicon pending production verification.
- `WEB-002` — Duplicate homepage section links fixed on branch, pending deployment.
- `DOC-001` — Documentation source of truth in progress.

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
