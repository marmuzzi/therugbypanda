# New Chat Handoff

Use this file when continuing The Rugby Panda in a new chat.

## First actions

1. Read `docs/07_Project_State.md`.
2. Read `docs/08_Issue_Log.md`.
3. Read `docs/09_Publishing_Workflow.md`.
4. Read `docs/11_Editorial_Image_Archive.md`.
5. Check available connectors before asking the user to configure them.

## Expected connectors

- GitHub
- Vercel
- Apify, when available in the active chat

Sanity MCP may be installed on the user's account, but it has not consistently appeared in available tools. Check tool availability before assuming it can be used.

## Current production status at handoff

Latest verified Vercel production deployment was on `main` commit `61fb43ea513e7f56d90244051c7a03a66e09c0c8`.

Related production work:

- PR #23: Sprint 3 publishing polish.
- PR #24: favicon response fix.

Production verified:

- `/sitemap.xml`
- `/robots.txt`
- `/rss.xml`
- article SEO metadata
- article `NewsArticle` JSON-LD
- category SEO metadata
- homepage section ordering
- masthead proportions
- favicon

## Deployment budget rule

The project has a strict deployment-discipline rule because Vercel has a daily deployment limit.

Default workflow:

1. Batch related work into one branch.
2. Open one PR.
3. Use one preview deployment where possible.
4. Merge automatically when preview/build is clean and the scope is agreed.
5. Use one production deployment.
6. Verify once in production.

Only create isolated hotfix PRs for genuine production issues.

## Editorial Image Archive

The project now treats the image archive as a first-class product feature.

Important decisions:

- Original Rugby Panda photography is preferred over third-party imagery.
- All photos uploaded by the user so far were taken by The Rugby Panda.
- Public photo credit must be `Photo: The Rugby Panda`.
- Public copyright line must be `© The Rugby Panda`.
- Do not publish the user's personal name or identity as photographer/founder.
- Use `International`, not `Europe`, as the public website category label.

Read `docs/11_Editorial_Image_Archive.md` before doing any image-library work.

## Current image tracker

Original Rugby Panda archive:

- 20+ uploaded images reviewed visually.
- 8 hero-quality images identified.
- 5 evergreen images identified.
- Initial taxonomy and metadata model defined.

Starter external editorial library:

- Candidates found: 27
- Pending licence validation: 26
- Verified and ready: 1 / 100

All external candidates must be revalidated before import into Sanity.

## Image acquisition next step

Use Apify if available in the new chat.

Recommended sources/actors are documented in `docs/11_Editorial_Image_Archive.md`.

Goal:

1. Generate structured image candidates.
2. Validate licence and attribution.
3. Reject unsafe or unsuitable assets.
4. Generate Rugby Panda metadata.
5. Prepare Sanity import data.
6. Add proper featured images to current CMS articles.

## Important open issues

See `docs/08_Issue_Log.md` for current status. Key pending work:

- `CMS-002`: CMS article images missing.
- `MEDIA-001`: Editorial Image Archive.
- `MEDIA-002`: image acquisition workflow.
- `WEB-005`: Search remains placeholder.

## Recommended next session prompt

Continue The Rugby Panda. Read docs 07, 08, 09, 10 and 11 from the repository, then continue with the Apify image acquisition pipeline and CMS image archive work.
