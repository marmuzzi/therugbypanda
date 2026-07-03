# Issue Log

This is the living issue log for The Rugby Panda. An issue is not closed until it has been deployed and verified in production.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Issues

| ID | Status | Priority | Area | Summary | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| INF-001 | Pending Verification | High | Infrastructure | Vercel deployment rate limit caused some merged changes to miss production initially. | #20, #21 | Later deployment activity observed; verify exact live commit with Vercel connector. | Pending Vercel/live validation | — |
| WEB-001 | Pending Verification | High | Frontend | Browser favicon now appears, but the panda is too small to read clearly at tab size. | #20, #21 | Deployed enough for favicon to appear. | Needs dedicated favicon design check | — |
| WEB-002 | Implemented | Medium | Frontend | Homepage bottom section links duplicated News and did not follow the header order. | Pending PR from `sprint-3-seo-publishing-polish` | Not deployed | Pending production verification | — |
| WEB-003 | Open | Medium | Branding / UI | Masthead proportions are unbalanced: panda mark is too small and wordmark is too large. | — | Not implemented | Pending desktop/tablet/mobile verification | — |
| WEB-004 | Open | Medium | Branding / UI | Need a favicon-specific version of the approved panda logo because the current full logo is too detailed when scaled down. | — | Not implemented | Pending browser verification | — |
| CMS-002 | Open | High | CMS / Visual content | Stock/mock article photos disappeared after switching frontend rendering to hosted Sanity content. | — | Not implemented | Pending CMS image upload and page verification | — |
| DOC-001 | In Progress | High | Documentation | Project state, issue log and publishing workflow need to be kept current as source of truth. | Current docs branch | Not deployed | Pending repository verification | — |
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

- **Status:** Pending Verification
- **Priority:** High
- **Root cause:** The tab icon now loads, but it uses the full approved logo composition. At favicon sizes the panda occupies too little of the canvas to be clearly recognizable.
- **Related PRs:** #20, #21
- **Deployment status:** Favicon is visible in production.
- **Verification steps:** Create or use a favicon-specific approved panda asset, then verify at 16x16, 32x32 and browser tab size in Chrome.
- **Resolution date:** Pending

## WEB-002 — Duplicate homepage section links

- **Status:** Implemented
- **Priority:** Medium
- **Root cause:** `getSectionLinks()` hardcoded News while Sanity also contained a News category, and CMS categories were sorted alphabetically.
- **Related PRs:** Pending PR from `sprint-3-seo-publishing-polish`
- **Deployment status:** Not deployed
- **Verification steps:** Confirm bottom sections render once and in this order: News, Provinces, Ireland, URC, Europe.
- **Resolution date:** Pending

## WEB-003 — Header logo proportions

- **Status:** Open
- **Priority:** Medium
- **Root cause:** The masthead visual balance is off. The panda logo is undersized while the `THE RUGBY PANDA` wordmark dominates the header.
- **Related PRs:** Pending
- **Deployment status:** Not implemented
- **Verification steps:** Increase panda logo size, reduce wordmark size, reduce the gap between mark and wordmark, keep tagline unchanged, then verify desktop, tablet and mobile layouts.
- **Resolution date:** Pending

## WEB-004 — Dedicated favicon design

- **Status:** Open
- **Priority:** Medium
- **Root cause:** The current favicon uses the full logo composition. Brand assets intended for very small sizes need dedicated simplified versions rather than direct downscales of the primary logo.
- **Related PRs:** Pending
- **Deployment status:** Not implemented
- **Verification steps:** Use a favicon-specific approved panda asset that maximizes the panda face in the canvas and verify in Chrome, Safari, Edge and Firefox.
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

- **Status:** In Progress
- **Priority:** High
- **Root cause:** Project status was tracked in chat more than repository documentation.
- **Related PRs:** Current documentation branch
- **Deployment status:** Not deployed
- **Verification steps:** Confirm `docs/07_Project_State.md`, `docs/08_Issue_Log.md` and `docs/09_Publishing_Workflow.md` exist and are current in GitHub.
- **Resolution date:** Pending

## CMS-001 — Remove frontend mock data

- **Status:** Closed
- **Priority:** High
- **Root cause:** Sprint 2 article data still powered frontend pages after Sanity became canonical.
- **Related PRs:** #14
- **Deployment status:** Deployed
- **Verification status:** Verified by live validation workflow.
- **Resolution date:** 2026-07-03
