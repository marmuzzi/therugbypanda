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

Latest Vercel production deployment checked by connector:

- Commit: `655133feca8aefd6f87e84f04cc27b2b9759e375`
- PR: #26
- Vercel deployment: `dpl_5zSXYucBJPguQ6ZKanVJkUxrGS3d`
- Deployment state: READY

Earlier verified production work:

- PR #23: Sprint 3 publishing polish.
- PR #24: favicon response fix.

Production verified before PR #26:

- `/sitemap.xml`
- `/robots.txt`
- `/rss.xml`
- article SEO metadata
- article `NewsArticle` JSON-LD
- category SEO metadata
- homepage section ordering
- masthead proportions
- favicon

## PR #26 — Editorial Images in Sanity Studio

PR #26 is merged and deployed.

Implemented:

- `editorialImage` schema registered in `schemaTypes`.
- Dedicated `Editorial Images` section added to Sanity Studio structure.
- Thumbnail previews added for Sanity-uploaded images and imported image URLs.
- Editable review fields added: `lifecycleStatus`, `usageApproved`, `editorialRating`, `editorialCategory`, `photoType`, `tags`.
- Manual uploads supported in the same collection as imported records.
- Imported Apify/source/licence metadata preserved.
- Rugby Panda Original validation added for:
  - `Photo: The Rugby Panda`
  - `© The Rugby Panda`

Important limitation: the assistant could verify that the Vercel deployment is READY, but could not inspect the authenticated Studio UI because the fetch tool was redirected to Vercel SSO.

## Required authenticated Studio verification

The next chat or the user must verify in the authenticated Sanity Studio:

1. Sanity Studio loads.
2. The `Editorial Images` section is visible.
3. The 16 imported `editorialImage` records are visible.
4. Thumbnails render for imported URL records.
5. An imported record can be moved to approved by editing `lifecycleStatus` and `usageApproved`.
6. Manual uploads appear alongside imported images.
7. Rugby Panda Original public credit/copyright validation works.

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

The project treats the image archive as a first-class product feature.

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

- 16 `editorialImage` candidate records imported into the Sanity production dataset by the Apify → GitHub → Sanity pipeline.
- Imported records still need Studio review and approval.

## Important open issues

See `docs/08_Issue_Log.md` for current status. Key pending work:

- `CMS-002`: CMS article images missing.
- `MEDIA-001`: Editorial Image Archive Studio visibility and review workflow.
- `MEDIA-002`: starter editorial image library review and approval.
- `WEB-005`: Search remains placeholder.

## Recommended next session prompt

Continue The Rugby Panda. Read docs 07, 08, 09, 10 and 11 from the repository. PR #26 is merged and deployed; verify the authenticated Sanity Studio Editorial Images section, the 16 imported records, approval workflow and manual upload workflow, then continue with CMS image archive work.
