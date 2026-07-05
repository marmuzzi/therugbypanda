# Project State

## Current Version

v0.4 — Publishing Foundation + Editorial Media Archive

Sprint 4 Brand Assets Library foundation is merged, deployed and verified in authenticated Sanity Studio.

Sprint 4 Task 4 Brand Assets Candidate Collector data/docs output is merged and deployed on `main` through PR #28. The follow-up Sanity review/import workflow is implemented on branch `brand-assets-sanity-review`, pending PR, deployment, Studio redeploy and authenticated verification.

## Last Updated

5 July 2026

## Source of truth

Read these files first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/10_New_Chat_Handoff.md`
5. `docs/11_Editorial_Image_Archive.md`
6. `docs/12_Brand_Assets_Library.md`

Do not rely on chat history for current status.

## Connectors

Expected connectors:

- GitHub
- Vercel
- Apify

Important connector note:

- Apify was available in the 5 July 2026 Sprint 4 Task 4 session and was used for brand-asset candidate discovery.
- Always check available connectors before asking the user to configure one.

Sanity MCP may be installed on the user's account but has not consistently appeared in available tools. Always check available connectors before asking the user to configure one.

## Current production deployment

Latest production deployment:

- Branch: `main`
- Commit: `c8edd8bc40d6e03d644f0deea401c35632a7c6bd`
- PR: #28 — Sprint 4 Task 4 brand assets candidate collector
- Vercel deployment: `dpl_JAPhPAMLttN3nujNmtSu15q5979d`
- Deployment state: READY
- Public verification: `https://therugbypanda.ie` returned HTTP 200
- Verification date: 5 July 2026

Previous verified Sprint 4 foundation deployment:

- Branch: `main`
- Commit: `aebc730bfe95c54dcb5e437ac2d246f488810d43`
- PR: #27 — Sprint 4 Brand Assets Library foundation
- Vercel deployment: `dpl_7JKweNP5rizBkicVVRxobVkahRru`
- Deployment state: READY
- Public verification: `https://therugbypanda.ie` returned HTTP 200
- Studio deployment: hosted Sanity Studio redeployed through GitHub Action
- Studio verification: user verified the `Brand Assets` category is visible in authenticated Sanity Studio
- Verification date: 5 July 2026

## Completed

- Brand, domain, DNS and Vercel deployment are working.
- Social profiles are created.
- Main site header, footer, homepage, article page, category pages and search placeholder exist.
- Hosted Sanity Studio is the canonical CMS.
- Homepage, article pages and category pages read from Sanity.
- Local article mock data was removed from frontend rendering.
- Seed script and no-terminal GitHub Actions seed workflow exist and have been run successfully.
- Live validation workflow exists.
- Documentation source-of-truth structure exists.
- CMS-backed `/sitemap.xml`, `/robots.txt`, and `/rss.xml` are implemented.
- Article SEO metadata, article `NewsArticle` JSON-LD and category SEO metadata are implemented.
- Homepage section ordering, masthead proportions and dedicated favicon are implemented and verified.
- International taxonomy rename has been deployed and user-verified in production.
- Apify → GitHub → Sanity import pipeline imported 16 `editorialImage` candidate records into the Sanity production dataset.
- Sanity Studio now has an Editorial Images section, review queues and a bulk Image Review tool.
- Original Rugby Panda photo import workflow imported 22 original photos into Sanity as approved Rugby Panda originals.
- Original Rugby Panda image public attribution is enforced as:
  - `Photo: The Rugby Panda`
  - `© The Rugby Panda`
- Bulk approval/rejection/archive workflow has been used successfully by the user.
- Sprint 4 Brand Assets Library foundation is merged, deployed and verified in authenticated Sanity Studio.
- Sprint 4 Task 4 candidate collector data/docs output is merged and deployed.

## Implemented but not merged/deployed

- `BRAND-003` — Brand Assets Sanity review workflow.
  - Branch: `brand-assets-sanity-review`
  - Adds `Brand Review` Studio tool.
  - Extends `brandAsset` with lifecycle review fields and candidate logo URL previews.
  - Adds manual import workflow for unapproved Sanity candidate records.
  - No brand assets are approved or published automatically.

## Sprint 4 — Brand Assets Library foundation

Merged in PR #27 and deployed on main commit `aebc730bfe95c54dcb5e437ac2d246f488810d43`:

- New `brandAsset` Sanity document type.
- Dedicated `Brand Assets` Studio section.
- Studio queues for active brands, teams, competitions/leagues, unions/governing bodies and rights review.
- Logo fields for primary, light-background and dark-background variants.
- Colour fields for primary, secondary and accent colours.
- Rights fields for trademark/editorial-use review.
- Documentation added in `docs/12_Brand_Assets_Library.md`.

Verification:

- Vercel deployment reported READY.
- Public homepage returned HTTP 200.
- User redeployed hosted Sanity Studio through GitHub Action.
- User verified the `Brand Assets` category is visible in authenticated Sanity Studio.

## Sprint 4 Task 4 — Brand Assets Candidate Collector

Merged in PR #28 and deployed on main commit `c8edd8bc40d6e03d644f0deea401c35632a7c6bd`:

- Created candidate-only collection output in `data/brand-assets/candidate-collection-2026-07-05.json`.
- Collected official-source candidate records for Six Nations Rugby, Six Nations unions/teams, EPCR, Champions Cup, Challenge Cup, URC, World Rugby and Men's Rugby World Cup 2027.
- Preserved Apify run IDs, dataset IDs, source URLs, candidate logo URLs where discoverable, rights holder notes, and candidate-only review metadata.
- Set all output to candidate-only review status.
- Did not approve logos, import logo assets into Sanity, publish assets, or use hotlinked logo URLs publicly.

Known limitations of first pass:

- Colour values were not reliably extracted.
- World Rugby and Rugby World Cup records need follow-up extraction for reliable logo URLs.
- Irish provinces and wider Rugby World Cup-cycle national teams still need follow-up collection.

## Sprint 4 Task 4 follow-up — Sanity review workflow

Implemented on branch `brand-assets-sanity-review`:

- Brand candidates can be imported into Sanity as unapproved `brandAsset` documents.
- Brand records now have lifecycle states: Candidate, Pending Validation, Approved, Rejected and Archived.
- `approvedForEditorialUse` remains false on import.
- Schema validation requires source URL, rights holder and usage notes before approval.
- `Brand Review` Studio tool supports bulk approve, reject and archive actions.
- External candidate logo URLs preview in Studio but must not be hotlinked publicly.

Pending:

1. Open and merge PR.
2. Confirm Vercel build and production deployment.
3. Redeploy hosted Sanity Studio through GitHub Action.
4. Run `Import Brand Asset Candidates` workflow.
5. Verify imported candidates appear in Brand Assets / Needs Review and the Brand Review tool.

## Current article URL

`/articles/leinster-season-preview-2026`

## Editorial Media Library strategy

The Rugby Panda treats images as a first-class product asset.

Primary principles:

- Original Rugby Panda photography is always preferred over third-party imagery.
- Public attribution for original images must be `Photo: The Rugby Panda` and `© The Rugby Panda`.
- Do not expose the user's personal identity as photographer or founder on the public website.
- Third-party images may only be used when licence, source, creator and attribution are stored.
- The long-term goal is a searchable, AI-assisted rugby image archive dominated by original Rugby Panda photography.

Current image strategy is documented in `docs/11_Editorial_Image_Archive.md`.

## Brand Assets Library strategy

Team logos, competition marks, league branding and union/governing-body marks must be managed separately from editorial photography.

Primary principles:

- Brand marks are not editorial photography.
- Default rights status is `Editorial / trademark use only`.
- Source URL, rights holder where known, rights status and usage notes should be recorded before public use.
- Logos should be approved for editorial use before appearing in public templates.
- The starter library should prioritise Rugby World Cup-cycle national teams, rugby unions, Champions Cup / Challenge Cup / URC-relevant professional teams and top-level rugby competitions.
- Do not collect brand assets for random grassroots clubs, schools, sponsors, broadcasters, unrelated teams or non-rugby organisations unless explicitly approved later.
- Candidate collector output is review-only and must not be treated as approved Sanity assets.
- Sanity imports are allowed only as unapproved candidate records until manual review.

Current brand asset strategy is documented in `docs/12_Brand_Assets_Library.md`.

## Current image archive status

Original Rugby Panda photos:

- 22 original Rugby Panda photos imported into Sanity.
- All imported as Rugby Panda originals.
- Public credit and copyright rules applied.
- Approved original photos are visible in the Rugby Panda Originals queue.

Starter external editorial image library:

- 16 external editorial image candidate records imported into Sanity production dataset.
- User has reviewed candidates through the bulk Image Review tool.

## Deployment budget rule

The Vercel free plan has a maximum of **100 deployments per day**. Treat every deployment as a constrained resource.

Default workflow:

1. Batch related work into a single branch.
2. Open one PR where possible.
3. Use one preview deployment where possible.
4. Merge automatically when preview/build is clean and scope is agreed.
5. Use one production deployment.
6. Verify once in production.

Only create isolated hotfix PRs for genuine production issues.

## Immediate next tasks

1. Open and merge PR for `brand-assets-sanity-review` if preview/build is clean.
2. Redeploy hosted Sanity Studio through GitHub Action.
3. Run `Import Brand Asset Candidates` workflow.
4. Verify candidate records and Brand Review workflow in authenticated Studio.
5. Continue the candidate collector for Irish provinces and remaining Rugby World Cup-cycle unions/national teams.
6. Continue `CMS-002`: assign approved editorial images to current articles.

## Known issues

Track all issues in `docs/08_Issue_Log.md`.

Current important issues:

- `BRAND-003` — Brand Assets Sanity review/import workflow implemented on branch; pending PR, deployment, Studio redeploy, import and verification.
- `BRAND-002` — Brand Assets Candidate Collector output merged and deployed; Sanity review/import tracked in `BRAND-003`.
- `CMS-002` — CMS article images missing from live articles.
- `MEDIA-001` — Editorial Image Archive Studio completed, pending production documentation closeout.
- `MEDIA-002` — starter editorial image library review completed by user, pending final production verification count.
- `MEDIA-003` — original Rugby Panda photos imported, pending final Studio count verification.
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
