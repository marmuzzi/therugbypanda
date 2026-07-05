# Issue Log

This is the living issue log for The Rugby Panda. An issue is not closed until it has been deployed and verified in production.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Issues

| ID | Status | Priority | Area | Summary | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BRAND-003 | Implemented | High | Media / Brand Assets / CMS | Import brand asset candidates into Sanity as unapproved review records and review them through a Brand Review tool. | Pending PR | Not deployed | Pending Studio redeploy, candidate import and authenticated Studio verification | — |
| BRAND-002 | Merged | High | Media / Brand Assets | Build Brand Assets candidate collector output for approved rugby-union scope only. | #28 | Deployed on main commit `c8edd8bc40d6e03d644f0deea401c35632a7c6bd` | Public site HTTP 200 verified; candidate data/docs merged; Sanity import pending BRAND-003 | — |
| BRAND-001 | Closed | Medium | Media / Brand Assets | Build separate Brand Assets library for team logos and competition branding. | #27 | Deployed on main commit `aebc730bfe95c54dcb5e437ac2d246f488810d43`; Studio redeployed through GitHub Action | User verified Brand Assets is visible in authenticated Sanity Studio | 2026-07-05 |
| CMS-002 | Open | High | CMS / Visual content | Hosted Sanity articles need proper featured images and metadata. | — | Not implemented | Pending CMS image assignment and page verification | — |
| MEDIA-001 | Pending Verification | High | Media / CMS | Editorial Images Studio, review queues and bulk Image Review tool are implemented and used successfully. | #26 plus direct main commits | Studio redeployed by user; functionality visible | Pending final production documentation closeout | — |
| MEDIA-002 | Pending Verification | High | Media / Workflow | Starter external image candidates imported and reviewed through approval/rejection workflow. | #26 plus direct main commits | Imported data exists and review workflow works | Pending final approved/rejected count verification | — |
| MEDIA-003 | Pending Verification | High | Media / Originals | 22 original Rugby Panda photos imported into Sanity as approved original photos. | Direct main commits | Import workflow completed successfully | Pending final Studio count verification | — |
| WEB-005 | Open | Medium | Frontend | Search remains a placeholder. | — | Not implemented | Pending search implementation and production verification | — |
| BUILD-001 | Closed | High | Build / Frontend | Vercel build failed because `lib/cms.ts` lost helper exports used by article, RSS and sitemap routes. | Direct main commits | Deployed on main commit `a37e25d` | User verified production website looked OK after successful Vercel build | 2026-07-05 |
| TAX-001 | Closed | Medium | Taxonomy / Navigation | Replace Europe with International and prevent `/categories/international` 404 while legacy Sanity records still exist. | Direct main commits | Deployed on main commit `a37e25d` | User verified production website looked OK after successful Vercel build | 2026-07-05 |
| INF-001 | Closed | High | Infrastructure | Vercel deployment rate limit caused production verification risk. | #20, #21, #23, #24 | Latest production verified on commit `61fb43ea513e7f56d90244051c7a03a66e09c0c8`. | Production deployment verified | 2026-07-04 |
| WEB-001 | Closed | High | Frontend | Dedicated favicon implemented and verified. | #23, #24 | Deployed to production | User verified favicon looks great | 2026-07-04 |
| WEB-002 | Closed | Medium | Frontend | Homepage section link order fixed and verified. | #23 | Deployed to production | Production verified | 2026-07-04 |
| WEB-003 | Closed | Medium | Branding / UI | Masthead proportions improved and verified. | #23 | Deployed to production | User verified production improvements | 2026-07-04 |
| WEB-004 | Closed | Medium | Branding / UI | Dedicated favicon design implemented and verified. | #23, #24 | Deployed to production | User verified favicon in production | 2026-07-04 |
| DOC-001 | Closed | High | Documentation | Project state, issue log and publishing workflow added as source of truth. | #22 | Merged to main | Repository files verified | 2026-07-04 |
| CMS-001 | Closed | High | CMS | Homepage and article pages use hosted Sanity content. | #14 | Deployed | Verified by live validation workflow | 2026-07-03 |

## BRAND-003 — Brand Assets Sanity review workflow

- **Status:** Implemented
- **Priority:** High
- **Root cause:** The user wants brand/logo candidates reviewed in Sanity using the same operational pattern as Editorial Images, while preserving brand-specific rights/trademark controls.
- **Implementation:** Added brand candidate review fields to `brandAsset`, including `lifecycleStatus`, candidate logo URL references, acquisition metadata and validation requiring source URL, rights holder and usage notes before approval. Added a dedicated `Brand Review` Studio tool for bulk approve/reject/archive. Added `scripts/import-brand-asset-candidates.mjs` and a manual `Import Brand Asset Candidates` GitHub Action to import JSON candidate files as unapproved Sanity records.
- **Rights rule:** Imports create unapproved candidate records only: `lifecycleStatus = candidate`, `approvedForEditorialUse = false`, `rightsStatus = editorial-trademark-use-only`. External URLs remain review references and must not be hotlinked publicly.
- **Related PRs:** Pending PR from `brand-assets-sanity-review`.
- **Deployment status:** Not deployed.
- **Verification steps:** Merge PR, confirm Vercel build, redeploy hosted Sanity Studio, run the import workflow, verify candidates appear in Brand Assets / Needs Review, verify Brand Review can approve/reject/archive, and verify approved public use still requires uploaded Sanity logo assets.
- **Resolution date:** Pending

## BRAND-002 — Brand Assets candidate collector

- **Status:** Merged
- **Priority:** High
- **Root cause:** Sprint 4 Brand Assets needs an acquisition layer that can gather official-source logo/brand candidates without approving, publishing or importing them automatically.
- **Implementation:** Ran Apify `apify/rag-web-browser` against official rugby-union sources for Six Nations, EPCR, URC and World Rugby. Stored structured candidate-only output in `data/brand-assets/candidate-collection-2026-07-05.json`.
- **Scope guardrails:** Candidate collection is limited to rugby union governing bodies/unions, Rugby World Cup-cycle teams, Rugby World Cup, Six Nations Rugby, URC, EPCR, Champions Cup, Challenge Cup and Irish provinces/relevant professional clubs. Grassroots clubs, schools/youth teams, amateur clubs, sponsors, broadcasters, commercial partners and non-rugby organisations remain excluded.
- **Candidate status:** All records are candidate-only. `approvedForEditorialUse` remains false; default rights status is `editorial-trademark-use-only`; logo URLs are external references only and must not be used in public templates before editorial review.
- **Related PRs:** #28.
- **Deployment status:** Deployed to production on main commit `c8edd8bc40d6e03d644f0deea401c35632a7c6bd`.
- **Verification steps:** Public homepage returned HTTP 200 after deployment. Sanity import/review is tracked separately in `BRAND-003`.
- **Resolution date:** Pending

## BRAND-001 — Brand Assets library

- **Status:** Closed
- **Priority:** Medium
- **Root cause:** Team logos and competition branding should be handled separately from editorial photography because they have different rights/trademark considerations.
- **Implementation:** Added a dedicated `brandAsset` Sanity document type and a `Brand Assets` Studio section with filtered queues for active brands, teams, competitions/leagues, unions and rights review.
- **Rights rule:** Brand marks default to `Editorial / trademark use only` and require source, rights holder where known, usage notes and explicit editorial-use approval before use in public templates.
- **Related PRs:** #27.
- **Deployment status:** Deployed to production on main commit `aebc730bfe95c54dcb5e437ac2d246f488810d43`; Vercel deployment `dpl_7JKweNP5rizBkicVVRxobVkahRru` reported READY. The hosted Sanity Studio was then redeployed through the GitHub Action.
- **Verification steps:** Public homepage returned HTTP 200 after deployment. User verified the `Brand Assets` category is visible in authenticated Sanity Studio after the Studio GitHub Action redeploy.
- **Resolution date:** 2026-07-05

## BUILD-001 — Vercel build failure after taxonomy cleanup

- **Status:** Closed
- **Priority:** High
- **Root cause:** A full-file replacement of `lib/cms.ts` removed exports still used by article, RSS and sitemap routes: `articleDateLabel`, `getFeaturedImage`, `portableTextToSections`, `getPublishedArticles` and `getPublishedCategories`.
- **Fix:** Restored the missing helper exports and kept the International taxonomy fallback in `lib/cms.ts`.
- **Related commits:** `41ace4780c9210a87d4d87579202b918665ec241`; production deployed successfully from main commit `a37e25d`.
- **Deployment status:** Deployed.
- **Verification steps:** Vercel build completed successfully on 2026-07-05; user verified the website looked OK in production.
- **Resolution date:** 2026-07-05

## TAX-001 — Europe to International taxonomy rename

- **Status:** Closed
- **Priority:** Medium
- **Root cause:** The site navigation should use `International` rather than `Europe`, but Sanity may still contain legacy `Europe` records until the seed workflow is rerun.
- **Fix:** Header now links to `/categories/international`; `/categories/europe` redirects to `/categories/international`; `getCategoryPage` supports legacy `europe` records when the requested slug is `international`; seed script now writes International taxonomy records.
- **Related commits:** `85b4c50`, `037c18d`, `8a54aa4`, `dd2c886`, `a6e44eb`, `41ace478`; production deployed successfully from main commit `a37e25d`.
- **Deployment status:** Deployed.
- **Verification steps:** User verified the production website looked OK after successful Vercel deployment on 2026-07-05.
- **Resolution date:** 2026-07-05

## MEDIA-001 — Editorial Image Archive Studio

- **Status:** Pending Verification
- **Priority:** High
- **Root cause:** The project needs a structured media library so original Rugby Panda photos and approved external images can be reused safely and quickly.
- **Implementation:** `editorialImage` schema and Studio structure implemented, then improved with larger imported URL previews, review queues, rejected lifecycle status, optional multi-value photo types, event/album, venue and teams fields, and a bulk Image Review tool.
- **Public attribution rule:** Original images must be credited publicly as `Photo: The Rugby Panda` and `© The Rugby Panda`.
- **Related PRs:** #26 plus direct follow-up commits on main.
- **Deployment status:** Studio redeployed and used by the user.
- **Verification steps:** Confirm final counts in Needs Review, Approved, Rejected and Rugby Panda Originals.
- **Resolution date:** Pending

## MEDIA-002 — Starter editorial image library

- **Status:** Pending Verification
- **Priority:** High
- **Root cause:** The site needs a starter library of reusable images while original Rugby Panda photography grows.
- **Current state:** Apify → GitHub → Sanity import pipeline imported 16 `editorialImage` candidate records into the Sanity production dataset. The user reviewed images through the bulk Image Review workflow.
- **Target:** 100 approved starter images over time.
- **Deployment status:** Imported data exists; review workflow works.
- **Verification steps:** Confirm reviewed candidate counts in Studio.
- **Resolution date:** Pending

## MEDIA-003 — Rugby Panda original photo import

- **Status:** Pending Verification
- **Priority:** High
- **Root cause:** Original Rugby Panda photography should become the preferred source for article images and evergreen assets.
- **Current state:** Metadata manifest prepared and ZIP import workflow used to import 22 original Rugby Panda photos into Sanity as approved originals.
- **Attribution:** All originals must use `The Rugby Panda Original`, `Photo: The Rugby Panda`, `© The Rugby Panda`, `Approved`, and `usageApproved = true`.
- **Deployment status:** Import workflow completed successfully according to user confirmation.
- **Verification steps:** Confirm all 22 originals appear in the Rugby Panda Originals queue.
- **Resolution date:** Pending

## CMS-002 — CMS article images missing

- **Status:** Open
- **Priority:** High
- **Root cause:** Current published articles do not consistently have featured image assets assigned from the new Editorial Images library.
- **Deployment status:** Not implemented
- **Verification steps:** Assign approved editorial images to current articles, then verify homepage cards and article pages render images.
- **Resolution date:** Pending

## WEB-005 — Search placeholder

- **Status:** Open
- **Priority:** Medium
- **Root cause:** Search UI exists but has not been implemented as a real searchable editorial experience.
- **Deployment status:** Not implemented
- **Verification steps:** Implement search, verify article/category/tag discovery in production.
- **Resolution date:** Pending

## Closed issues summary

- `BRAND-001` Brand Assets Library foundation — closed 2026-07-05.
- `BUILD-001` Vercel build failure — closed 2026-07-05.
- `TAX-001` International taxonomy rename — closed 2026-07-05.
- `INF-001` Vercel deployment risk — closed 2026-07-04.
- `WEB-001` favicon visible but too small — closed 2026-07-04.
- `WEB-002` duplicate homepage section links — closed 2026-07-04.
- `WEB-003` header logo proportions — closed 2026-07-04.
- `WEB-004` dedicated favicon design — closed 2026-07-04.
- `DOC-001` documentation source of truth — closed 2026-07-04.
- `CMS-001` remove frontend mock data — closed 2026-07-03.
