# Issue Log

This is the living issue log for The Rugby Panda. An issue is not closed until it has been deployed and verified in production.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Issues

| ID | Status | Priority | Area | Summary | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CMS-002 | Open | High | CMS / Visual content | Hosted Sanity articles need proper featured images and metadata. | — | Not implemented | Pending CMS image upload and page verification | — |
| MEDIA-001 | Implemented | High | Media / CMS | Editorial Images Studio schema and structure implemented on branch. | Pending PR | Not deployed | Pending Studio verification | — |
| MEDIA-002 | In Progress | High | Media / Workflow | Starter editorial image library has 16 imported Sanity candidate records awaiting Studio review. | Pending PR | Imported data exists | Pending Studio review and approval verification | — |
| WEB-005 | Open | Medium | Frontend | Search remains a placeholder. | — | Not implemented | Pending search implementation and production verification | — |
| INF-001 | Closed | High | Infrastructure | Vercel deployment rate limit caused production verification risk. | #20, #21, #23, #24 | Latest production verified on commit `61fb43ea513e7f56d90244051c7a03a66e09c0c8`. | Production deployment verified | 2026-07-04 |
| WEB-001 | Closed | High | Frontend | Dedicated favicon implemented and verified. | #23, #24 | Deployed to production | User verified favicon looks great | 2026-07-04 |
| WEB-002 | Closed | Medium | Frontend | Homepage section link order fixed and verified. | #23 | Deployed to production | Production verified | 2026-07-04 |
| WEB-003 | Closed | Medium | Branding / UI | Masthead proportions improved and verified. | #23 | Deployed to production | User verified production improvements | 2026-07-04 |
| WEB-004 | Closed | Medium | Branding / UI | Dedicated favicon design implemented and verified. | #23, #24 | Deployed to production | User verified favicon in production | 2026-07-04 |
| DOC-001 | Closed | High | Documentation | Project state, issue log and publishing workflow added as source of truth. | #22 | Merged to main | Repository files verified | 2026-07-04 |
| CMS-001 | Closed | High | CMS | Homepage and article pages use hosted Sanity content. | #14 | Deployed | Verified by live validation workflow | 2026-07-03 |

## MEDIA-001 — Editorial Image Archive Studio

- **Status:** Implemented
- **Priority:** High
- **Root cause:** The project needs a structured media library so original Rugby Panda photos and approved external images can be reused safely and quickly.
- **Implementation:** `editorialImage` schema and Studio structure implemented on `feature/editorial-image-studio`.
- **Scope:** Store image metadata, source attribution, category tags, editorial ratings, lifecycle status, suggested use and search fields.
- **Public attribution rule:** Original images must be credited publicly as `Photo: The Rugby Panda` and `© The Rugby Panda`. Do not expose the user's personal identity.
- **Related PRs:** Pending
- **Deployment status:** Not deployed
- **Verification steps:** Confirm Studio shows Editorial Images section, imported records are visible, images can be approved, and manual uploads appear alongside imported images.
- **Resolution date:** Pending

## MEDIA-002 — Starter editorial image library

- **Status:** In Progress
- **Priority:** High
- **Root cause:** The site needs a starter library of reusable images while original Rugby Panda photography grows.
- **Current state:** Apify → GitHub → Sanity import pipeline imported 16 `editorialImage` candidate records into the Sanity production dataset.
- **Target:** 100 approved starter images.
- **Related PRs:** Pending
- **Deployment status:** Imported data exists; Studio visibility pending deployment.
- **Verification steps:** Verify the 16 imported images are visible and can be moved through lifecycle review in Studio.
- **Resolution date:** Pending

## CMS-002 — CMS article images missing

- **Status:** Open
- **Priority:** High
- **Root cause:** Local mock/stock images were removed when frontend rendering moved to hosted Sanity content. The seeded Sanity articles do not currently have uploaded featured image assets.
- **Related PRs:** Pending
- **Deployment status:** Not implemented
- **Verification steps:** Upload featured images in Sanity with alt text, caption, source/rights metadata, then verify homepage cards and article pages render images again.
- **Resolution date:** Pending

## WEB-005 — Search placeholder

- **Status:** Open
- **Priority:** Medium
- **Root cause:** Search UI exists but has not been implemented as a real searchable editorial experience.
- **Related PRs:** Pending
- **Deployment status:** Not implemented
- **Verification steps:** Implement search, verify article/category/tag discovery in production.
- **Resolution date:** Pending

## Closed issues summary

- `INF-001` Vercel deployment risk — closed 2026-07-04.
- `WEB-001` favicon visible but too small — closed 2026-07-04.
- `WEB-002` duplicate homepage section links — closed 2026-07-04.
- `WEB-003` header logo proportions — closed 2026-07-04.
- `WEB-004` dedicated favicon design — closed 2026-07-04.
- `DOC-001` documentation source of truth — closed 2026-07-04.
- `CMS-001` remove frontend mock data — closed 2026-07-03.
