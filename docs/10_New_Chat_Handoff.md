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

- 16 `editorialImage` candidate records imported into the Sanity production dataset by the Apify → GitHub → Sanity pipeline.
- Imported records still need Studio review and approval.

## Current branch work

Branch: `feature/editorial-image-studio`

Implemented on branch, pending PR/merge/deployment/verification:

- `editorialImage` schema registered in `schemaTypes`.
- Dedicated `Editorial Images` section added to Sanity Studio structure.
- Thumbnail previews added for Sanity-uploaded images and imported image URLs.
- Editable review fields added: `lifecycleStatus`, `usageApproved`, `editorialRating`, `editorialCategory`, `photoType`, `tags`.
- Manual uploads supported in the same collection as imported records.
- Imported Apify/source/licence metadata preserved.
- Rugby Panda Original validation added for:
  - `Photo: The Rugby Panda`
  - `© The Rugby Panda`

## Required verification after merge/deploy

1. Verify Sanity Studio loads.
2. Verify the `Editorial Images` section is visible.
3. Verify the 16 imported `editorialImage` records are visible.
4. Verify thumbnails render for imported URL records.
5. Verify an imported record can be moved to approved by editing `lifecycleStatus` and `usageApproved`.
6. Verify manual uploads appear alongside imported images.
7. Verify Rugby Panda Original public credit/copyright validation works.

## Important open issues

See `docs/08_Issue_Log.md` for current status. Key pending work:

- `CMS-002`: CMS article images missing.
- `MEDIA-001`: Editorial Image Archive Studio visibility and review workflow.
- `MEDIA-002`: starter editorial image library review and approval.
- `WEB-005`: Search remains placeholder.

## Recommended next session prompt

Continue The Rugby Panda. Read docs 07, 08, 09, 10 and 11 from the repository, then continue with the editorial image Studio verification and CMS image archive work.
