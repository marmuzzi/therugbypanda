# New Chat Handoff

Use this file when continuing The Rugby Panda in a new chat.

## First actions

1. Read `docs/07_Project_State.md`.
2. Read `docs/08_Issue_Log.md`.
3. Read `docs/09_Publishing_Workflow.md`.
4. Check available connectors before asking the user to configure them.

## Expected connectors

- GitHub
- Vercel

Sanity MCP may be installed on the user's account, but it was not exposed in the previous chat. Check tool availability before assuming it can be used.

## Current production status at handoff

Latest observed Vercel production deployment was on `main` commit `538af6b2ae8d3b81db515bdf4d04336049cd4f67`.

Recheck the latest production deployment with the Vercel connector before closing `INF-001`.

## Important pending pull requests

- PR #23, `feature/seo-publishing-final`: consolidated branch for Sprint 3 publishing polish.

Implemented on PR #23:

- CMS-backed `/sitemap.xml`.
- CMS-backed `/robots.txt`.
- CMS-backed `/rss.xml`.
- Article SEO metadata.
- Article `NewsArticle` JSON-LD.
- Category SEO metadata.
- Homepage section link ordering and News de-duplication.
- Masthead proportions polish.
- Dedicated small-size SVG favicon and `/favicon.ico` redirect.
- Documentation updates for project state and issue log.

## Important open issues

See `docs/08_Issue_Log.md` for current status. Key pending work:

- Review PR #23 preview/build status.
- Use as few Vercel deployments as possible because of the 100-deployments-per-day limit.
- Merge and verify PR #23 in production.
- Verify `/sitemap.xml`, `/robots.txt`, `/rss.xml`, article/category metadata, JSON-LD, homepage sections, masthead and favicon.
- Upload proper featured images in Sanity with metadata.
