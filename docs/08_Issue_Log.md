# Issue Log

This is the living issue log for The Rugby Panda. An issue is not closed until it has been deployed and verified in production.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Issues

| ID | Status | Priority | Area | Summary | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| INF-001 | Pending Verification | High | Infrastructure | Vercel deployment rate limit caused some merged changes to miss production initially. | #20, #21 | Later deployment activity observed; verify exact live commit with Vercel connector. | Pending Vercel/live validation | — |
| WEB-001 | Implemented | High | Frontend | Browser favicon now appears, but the panda is too small to read clearly at tab size. A dedicated small-size SVG favicon has been implemented. | Pending PR from `feature/seo-publishing-final` | Not deployed to production | Pending browser verification | — |
| WEB-002 | Implemented | Medium | Frontend | Homepage bottom section links duplicated News and did not follow the header order. | Pending PR from `feature/seo-publishing-final` | Not deployed to production | Pending production verification | — |
| WEB-003 | Implemented | Medium | Branding / UI | Masthead proportions are unbalanced: panda mark is too small and wordmark is too large. Header proportions have been adjusted. | Pending PR from `feature/seo-publishing-final` | Not deployed to production | Pending desktop/tablet/mobile verification | — |
| WEB-004 | Implemented | Medium | Branding / UI | Need a favicon-specific version of the approved panda logo because the current full logo is too detailed when scaled down. A dedicated SVG favicon has been added. | Pending PR from `feature/seo-publishing-final` | Not deployed to production | Pending browser verification | — |
| CMS-002 | Open | High | CMS / Visual content | Stock/mock article photos disappeared after switching frontend rendering to hosted Sanity content. | — | Not implemented | Pending CMS image upload and page verification | — |
| DOC-001 | Closed | High | Documentation | Project state, issue log and publishing workflow added as source of truth. | #22 | Merged to main | Repository files verified | 2026-07-04 |
| CMS-001 | Closed | High | CMS | Homepage and article pages used local mock article data instead of hosted Sanity content. | #14 | Deployed | Verified by live validation workflow | 2026-07-03 |

## INF-001 — Vercel deployment rate limit

- **Status:** Pending Verification
- **Priority:** High
- **Root cause:** Multiple rapid merges triggered Vercel deployment rate limiting.
- **Impact:** Some merged changes existed in GitHub but were not immediately live in production.
- **Related PRs:** #20, #21
- **Deployment status:** Later Vercel deployment activity was observed, but the exact production commit must be checked with the Vercel connector before closing.
- **Verification steps:** Use the Vercel connector to confirm the production deployment commit, then run Validate Live Site.
- **Resolution date:** Pending

## WEB-001 — Favicon visible but too small

- **Status:** Implemented
- **Priority:** High
- **Root cause:** The tab icon now loads, but it uses the full approved logo composition. At favicon sizes the panda occupies too little of the canvas to be clearly recognizable.
- **Related PRs:** Pending PR from `feature/seo-publishing-final`
- **Deployment status:** Not deployed to production
- **Implementation:** Added `public/favicon.svg`, updated metadata icon references and redirected `/favicon.ico` to the dedicated small-size favicon asset.
- **Verification steps:** Verify at 16x16, 32x32 and browser tab size in Chrome, Safari, Edge and Firefox after production deployment.
- **Resolution date:** Pending

## WEB-002 — Duplicate homepage section links

- **Status:** Implemented
- **Priority:** Medium
- **Root cause:** `getSectionLinks()` hardcoded News while Sanity also contained a News category, and CMS categories were sorted alphabetically.
- **Related PRs:** Pending PR from `feature/seo-publishing-final`
- **Deployment status:** Not deployed to production
- **Verification steps:** Confirm bottom sections render once and in this order: News, Provinces, Ireland, URC, Europe.
- **Resolution date:** Pending

## WEB-003 — Header logo proportions

- **Status:** Implemented
- **Priority:** Medium
- **Root cause:** The masthead visual balance is off. The panda logo is undersized while the `THE RUGBY PANDA` wordmark dominates the header.
- **Related PRs:** Pending PR from `feature/seo-publishing-final`
- **Deployment status:** Not deployed to production
- **Implementation:** Increased panda logo size, reduced wordmark size and tightened spacing while preserving the tagline.
- **Verification steps:** Verify desktop, tablet and mobile layouts after deployment.
- **Resolution date:** Pending

## WEB-004 — Dedicated favicon design

- **Status:** Implemented
- **Priority:** Medium
- **Root cause:** The current favicon uses the full logo composition. Brand assets intended for very small sizes need dedicated simplified versions rather than direct downscales of the primary logo.
- **Related PRs:** Pending PR from `feature/seo-publishing-final`
- **Deployment status:** Not deployed to production
- **Implementation:** Added a simplified green-backed SVG panda face favicon optimized for small display sizes.
- **Verification steps:** Verify in Chrome, Safari, Edge and Firefox after deployment.
- **Resolution date:** Pending

## CMS-002 — CMS article images missing

- **Status:** Open
- **Priority:** High
- **Root cause:** Local mock/stock images were removed when frontend rendering moved to hosted Sanity content. The seeded Sanity articles do not currently have uploaded featured image assets.
- **Related PRs:** Pending
- **Deployment status:** Not implemented
- **Verification steps:** Upload featured images in Sanity with alt text, caption, source/rights metadata, then verify homepage cards and article pages render images again.
- **Resolution date:** Pending

## DOC-001 — Documentation source of truth

- **Status:** Closed
- **Priority:** High
- **Root cause:** Project status was tracked in chat more than repository documentation.
- **Related PRs:** #22
- **Deployment status:** Merged to main.
- **Verification steps:** Repository contains `docs/07_Project_State.md`, `docs/08_Issue_Log.md`, `docs/09_Publishing_Workflow.md`, and `docs/10_New_Chat_Handoff.md`.
- **Resolution date:** 2026-07-04

## CMS-001 — Remove frontend mock data

- **Status:** Closed
- **Priority:** High
- **Root cause:** Sprint 2 article data still powered frontend pages after Sanity became canonical.
- **Related PRs:** #14
- **Deployment status:** Deployed
- **Verification status:** Verified by live validation workflow.
- **Resolution date:** 2026-07-03
