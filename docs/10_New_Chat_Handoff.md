# New Chat Handoff

Use this file when continuing The Rugby Panda in a new chat.

## First actions

1. Read `docs/07_Project_State.md`.
2. Read `docs/08_Issue_Log.md`.
3. Read `docs/09_Publishing_Workflow.md`.
4. Read `docs/11_Editorial_Image_Archive.md`.
5. Read `docs/12_Brand_Assets_Library.md` when working on team logos, competition marks or brand assets.
6. Check available connectors before asking the user to configure them.

## Expected connectors

- GitHub
- Vercel
- Apify, when available in the active chat

Sanity MCP may be installed on the user's account, but it has not consistently appeared in available tools. Check tool availability before assuming it can be used.

## Current production status at handoff

Latest user-verified production deployment:

- Branch: `main`
- Commit: `a37e25d`
- Build result: successful
- Deployment result: completed
- User verification: everything looked OK on the website
- Verification date: 5 July 2026

This production verification closed:

- `BUILD-001`
- `TAX-001`

Earlier verified production work:

- PR #23: Sprint 3 publishing polish.
- PR #24: favicon response fix.
- PR #26: Editorial Images in Sanity Studio.

Production verified before Sprint 4:

- `/sitemap.xml`
- `/robots.txt`
- `/rss.xml`
- article SEO metadata
- article `NewsArticle` JSON-LD
- category SEO metadata
- homepage section ordering
- masthead proportions
- favicon
- International taxonomy deployment looked OK to the user after the successful `a37e25d` deployment

## Sprint 4 — Brand Assets Library

Sprint 4 foundation is implemented on branch:

`sprint-4-brand-assets-library`

Implemented:

- `brandAsset` Sanity document type in `sanity/schemaTypes/brandAsset.ts`.
- `Brand Assets` Studio section added in `sanity.config.ts`.
- Studio queues for:
  - Active Brands
  - Teams
  - Competitions & Leagues
  - Unions & Governing Bodies
  - Needs Rights Review
  - All Brand Assets
- Documentation added in `docs/12_Brand_Assets_Library.md`.
- Project state, issue log and publishing workflow updated.

Pending:

1. Open PR from `sprint-4-brand-assets-library`.
2. Confirm preview/build is clean.
3. Merge if clean.
4. Verify production deployment.
5. Verify authenticated Sanity Studio shows `Brand Assets`.
6. Create or review one safe test brand record.

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

Important limitation: the assistant could verify that the Vercel deployment was READY, but could not inspect the authenticated Studio UI because the fetch tool was redirected to Vercel SSO.

## Required authenticated Studio verification

The user or assistant with an authenticated Studio-capable connector must verify:

1. Sanity Studio loads.
2. The `Editorial Images` section is visible.
3. Final counts in Needs Review, Approved, Rejected and Rugby Panda Originals.
4. The `Brand Assets` section is visible after Sprint 4 deployment.
5. A brand asset can be created or reviewed.
6. Brand asset rights-review queue behaves correctly.

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

## Brand Assets Library

Read `docs/12_Brand_Assets_Library.md` before doing any logo, team-branding or competition-branding work.

Important decisions:

- Brand assets are separate from editorial photography.
- Rugby logos and marks default to `Editorial / trademark use only`.
- Do not bulk-import logos until the rights/source workflow has been verified.
- Do not use hotlinked logos in public templates; upload approved logo assets into Sanity.

## Current image tracker

Original Rugby Panda archive:

- 20+ uploaded images reviewed visually.
- 8 hero-quality images identified.
- 5 evergreen images identified.
- 22 original Rugby Panda photos imported into Sanity as approved originals.

Starter external editorial library:

- 16 `editorialImage` candidate records imported into the Sanity production dataset by the Apify → GitHub → Sanity pipeline.
- Imported records have been reviewed through the bulk Image Review workflow.

## Important open issues

See `docs/08_Issue_Log.md` for current status. Key pending work:

- `BRAND-001`: Brand Assets Library implemented on sprint branch; pending PR, deployment and production verification.
- `CMS-002`: CMS article images missing.
- `MEDIA-001`: Editorial Image Archive Studio final count verification.
- `MEDIA-002`: starter editorial image library final count verification.
- `MEDIA-003`: original Rugby Panda photo final Studio count verification.
- `WEB-005`: Search remains placeholder.

## Recommended next session prompt

Continue The Rugby Panda. Read docs 07, 08, 09, 10, 11 and 12 from the repository. Sprint 4 Brand Assets Library is implemented on `sprint-4-brand-assets-library`; open/review the PR, verify build/preview, merge if clean, then verify production and authenticated Sanity Studio visibility.
