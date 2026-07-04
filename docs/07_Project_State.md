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
- Sanity schemas exist for articles, authors, categories, provinces, competitions and tags.
- Homepage, article pages and category pages read from Sanity.
- Local article mock data was removed from frontend rendering.
- Seed script and no-terminal GitHub Actions seed workflow exist and have been run successfully.
- Live validation workflow exists.
- Documentation source-of-truth structure exists.
- `docs/10_New_Chat_Handoff.md` exists.
- CMS-backed `/sitemap.xml` is implemented, merged, deployed and verified in production.
- CMS-backed `/robots.txt` is implemented, merged, deployed and verified in production.
- CMS-backed `/rss.xml` is implemented, merged, deployed and verified in production.
- Article SEO metadata is implemented, merged, deployed and verified in production.
- Article `NewsArticle` JSON-LD is implemented, merged, deployed and verified in production.
- Category SEO metadata is implemented, merged, deployed and verified in production.
- Homepage bottom section ordering and News de-duplication are implemented, merged, deployed and verified in production.
- Masthead proportions were improved and verified in production by the user.
- Dedicated small-size favicon was implemented and verified in production by the user.

## Current article URL

`/articles/leinster-season-preview-2026`

## Sprint 3 status

Sprint 3 — CMS and Publishing Platform is effectively complete.

Completed and verified:

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
12. SEO and publishing endpoints.
13. Article/category metadata and article JSON-LD.
14. Header masthead proportions.
15. Dedicated favicon.

Pending after Sprint 3:

1. CMS image library and proper featured images.
2. Search remains placeholder.
3. Newsletter capture remains future work.
4. Editorial workflow polish remains future work.

## Editorial Media Library strategy

The Rugby Panda now treats images as a first-class product asset, not as decoration.

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

- Candidates found: 27
- Pending licence validation: 26
- Verified and ready: 1 / 100

Important: the external image counts came from chat-based discovery and must be revalidated using Apify or direct source checks before CMS import.

## Apify image acquisition strategy

Use Apify to collect open-licence image candidates. Preferred actors:

1. `shahidirfan/OpenVerse-Image-Scraper`
2. `parseforge/openverse-media-scraper`
3. `parseforge/wikimedia-commons-media-scraper`
4. `solidcode/google-images-scraper` only for discovery, never automatic approval

Allowed licences for automatic approval consideration:

- `cc0`
- `pdm`
- `by`
- `by-sa`

Avoid for commercial safety:

- `by-nc`
- `by-nc-sa`
- `by-nc-nd`
- `by-nd` for hero/article images because cropping, resizing or design treatment may conflict with no-derivatives restrictions.

Target: build a starter library of 100 approved images with source URL, creator, licence, attribution and metadata stored in Sanity.

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

1. In the new chat, read docs 07, 08, 09, 10 and 11 first.
2. Confirm available connectors, especially Apify.
3. Use Apify to generate external image candidates.
4. Validate licences and reject unsafe images.
5. Generate Rugby Panda metadata for approved images.
6. Prepare Sanity import structure for the image archive.
7. Add proper featured images to the current CMS articles.
8. Begin Sprint 4 planning: search, newsletter capture and editorial workflow polish.

## Known issues

Track all issues in `docs/08_Issue_Log.md`.

Current important issues:

- `CMS-002` — CMS article images missing.
- `MEDIA-001` — Editorial Image Archive planned and partially defined.
- `MEDIA-002` — Apify image acquisition pipeline planned.
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
