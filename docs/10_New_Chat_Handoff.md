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
- Apify

Connector note:

- The user confirmed Apify access exists in another chat.
- In the previous chat, Apify did not appear in the active connector list.
- If Apify is visible in the new chat, use it directly for acquisition work.
- If Apify is not visible, do not ask the user to reconfigure immediately; explain that this chat does not expose Apify and continue with GitHub/Vercel work only.

Sanity MCP may be installed on the user's account, but it has not consistently appeared in available tools. Check tool availability before assuming it can be used.

## Current production status at handoff

Latest production deployment / verification:

- Branch: `main`
- Commit: `aebc730bfe95c54dcb5e437ac2d246f488810d43`
- PR: #27 — Sprint 4 Brand Assets Library foundation
- Vercel deployment: READY
- Public homepage: HTTP 200 verified
- Hosted Sanity Studio: redeployed through GitHub Action
- Studio verification: user verified `Brand Assets` is visible in authenticated Studio
- Verification date: 5 July 2026

Previous user-verified production deployment:

- Branch: `main`
- Commit: `a37e25d`
- Build result: successful
- Deployment result: completed
- User verification: everything looked OK on the website
- Verification date: 5 July 2026

This production verification closed:

- `BUILD-001`
- `TAX-001`
- `BRAND-001`

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

Sprint 4 foundation is complete.

Implemented, merged, deployed and Studio-verified:

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

Important Studio deployment note:

- Website deployment through Vercel is not enough to update the hosted Sanity Studio.
- After Studio/schema changes, the hosted Studio must be redeployed through the GitHub Action.
- The user redeployed the Studio through GitHub Action and then verified `Brand Assets` became visible.

## Next Apify task — Brand Assets candidate collector actor

The next chat should use Apify, if available, to create or configure a Brand Assets candidate collector actor.

The actor should collect candidates only. It must not auto-approve or publish assets.

Candidate output should include:

- official brand name
- short name
- brand type
- official website
- source page URL
- candidate logo URL
- candidate logo format, if available
- candidate colour data, if available
- rights holder, if discoverable
- trademark / usage source notes
- acquisition timestamp
- raw source metadata

Approved acquisition scope:

- Rugby union governing bodies and unions.
- National teams that normally participate in Rugby World Cup qualification cycles or Rugby World Cup finals.
- Teams and competitions directly relevant to international rugby, Champions Cup, Challenge Cup or URC coverage.
- Irish provinces and other professional clubs only when relevant to URC, Champions Cup or Challenge Cup coverage.

Out of scope unless explicitly approved later:

- Random grassroots clubs.
- Schools, youth teams or amateur clubs.
- Sponsors, broadcasters or commercial partners.
- Teams from competitions outside the Rugby World Cup / international rugby / Champions Cup / Challenge Cup editorial lane.
- Generic sports brands or non-rugby organisations.

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

## Required authenticated Studio verification

The user or assistant with an authenticated Studio-capable connector must still verify:

1. Final Editorial Image counts in Needs Review, Approved, Rejected and Rugby Panda Originals.
2. A brand asset can be created or reviewed.
3. Brand asset rights-review queue behaves correctly.

## Deployment budget rule

The Vercel free plan has a maximum of **100 deployments per day**. Treat every deployment as a constrained resource.

Default workflow:

1. Batch related work into one branch.
2. Open one PR.
3. Use one preview deployment where possible.
4. Merge automatically when preview/build is clean and the scope is agreed.
5. Use one production deployment.
6. Verify once in production.

Avoid documentation-only deployments unless the documentation update is important for project continuity or is bundled with code changes.

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
- Acquisition scope is intentionally limited to international rugby, Rugby World Cup-cycle national teams, Champions Cup, Challenge Cup, URC and relevant professional clubs/competitions.

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

- `CMS-002`: CMS article images missing.
- `MEDIA-001`: Editorial Image Archive Studio final count verification.
- `MEDIA-002`: starter editorial image library final count verification.
- `MEDIA-003`: original Rugby Panda photo final Studio count verification.
- `WEB-005`: Search remains placeholder.

## Recommended next session prompt

Continue The Rugby Panda. Read docs 07, 08, 09, 10, 11 and 12 from the repository. Check whether Apify is available in this chat. If Apify is available, start the Brand Assets candidate collector actor for the approved rugby-union scope only. Do not collect random clubs, schools, sponsors, broadcasters or unrelated teams. Output must be candidates for editorial review, not approved/published assets.
