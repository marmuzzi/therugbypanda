# Issue Log

This is the living issue log for The Rugby Panda. An issue is not closed until it has been deployed and verified in production.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Issues

| ID | Status | Priority | Area | Summary | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CMS-002 | Open | High | CMS / Visual content | Hosted Sanity articles need proper featured images and metadata. | — | Not implemented | Pending CMS image upload and page verification | — |
| MEDIA-001 | Planned | High | Media / CMS | Create The Rugby Panda Editorial Image Archive with tagging, ratings, lifecycle states and source attribution. | — | Not implemented | Pending design and CMS implementation | — |
| MEDIA-002 | Planned | High | Media / Workflow | Build the starter editorial image library with rights validation and CMS import metadata. | — | Not implemented | Pending validation and CMS import | — |
| WEB-005 | Open | Medium | Frontend | Search remains a placeholder. | — | Not implemented | Pending search implementation and production verification | — |
| INF-001 | Closed | High | Infrastructure | Vercel deployment rate limit caused production verification risk. | #20, #21, #23, #24 | Latest production verified on commit `61fb43ea513e7f56d90244051c7a03a66e09c0c8`. | Production deployment verified | 2026-07-04 |
| WEB-001 | Closed | High | Frontend | Dedicated favicon implemented and verified. | #23, #24 | Deployed to production | User verified favicon looks great | 2026-07-04 |
| WEB-002 | Closed | Medium | Frontend | Homepage section link order fixed and verified. | #23 | Deployed to production | Production verified | 2026-07-04 |
| WEB-003 | Closed | Medium | Branding / UI | Masthead proportions improved and verified. | #23 | Deployed to production | User verified production improvements | 2026-07-04 |
| WEB-004 | Closed | Medium | Branding / UI | Dedicated favicon design implemented and verified. | #23, #24 | Deployed to production | User verified favicon in production | 2026-07-04 |
| DOC-001 | Closed | High | Documentation | Project state, issue log and publishing workflow added as source of truth. | #22 | Merged to main | Repository files verified | 2026-07-04 |
| CMS-001 | Closed | High | CMS | Homepage and article pages use hosted Sanity content. | #14 | Deployed | Verified by live validation workflow | 2026-07-03 |

## MEDIA-001 — Editorial Image Archive

- **Status:** Planned
- **Priority:** High
- **Root cause:** The project needs a structured media library so original Rugby Panda photos and approved external images can be reused safely and quickly.
- **Scope:** Store image metadata, source attribution, category tags, editorial ratings, lifecycle status, suggested use and search fields.
- **Public attribution rule:** Original images must be credited publicly as `Photo: The Rugby Panda` and `© The Rugby Panda`. Do not expose the user's personal identity.
- **Related PRs:** Pending
- **Deployment status:** Not implemented
- **Verification steps:** Confirm CMS can store, search and display image metadata; verify article and homepage images render correctly.
- **Resolution date:** Pending

## MEDIA-002 — Starter editorial image library

- **Status:** Planned
- **Priority:** High
- **Root cause:** The site needs a starter library of reusable images while original Rugby Panda photography grows.
- **Target:** 100 approved starter images.
- **Current tracker:** 27 candidates found, 26 pending validation, 1 verified/ready from chat-based discovery. Revalidate all external candidates before CMS import.
- **Related PRs:** Pending
- **Deployment status:** Not implemented
- **Verification steps:** Validate rights metadata, reject unsafe images, generate metadata and import approved images into Sanity.
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
