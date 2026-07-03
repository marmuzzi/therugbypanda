# Issue Log

This is the living issue log for The Rugby Panda. An issue is not closed until it has been deployed and verified in production.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Issues

| ID | Status | Priority | Area | Summary | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| INF-001 | Pending Verification | High | Infrastructure | Vercel deployment rate limit caused some merged changes to miss production initially. | #20, #21 | Later deployment activity observed; verify exact live commit with Vercel connector. | Pending Vercel/live validation | — |
| WEB-001 | Pending Deployment | High | Frontend | Browser favicon still showed the default Vercel icon in Chrome. | #20, #21 | Merged to main but must be confirmed on a successful production deployment. | Pending Chrome incognito verification | — |
| WEB-002 | Implemented | Medium | Frontend | Homepage bottom section links duplicated News and did not follow the header order. | Pending PR from `sprint-3-seo-publishing-polish` | Not deployed | Pending production verification | — |
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

## WEB-001 — Favicon not verified in production

- **Status:** Pending Deployment
- **Priority:** High
- **Root cause:** Chrome can request `/favicon.ico` directly. A stale conventional favicon route/file could override metadata-only fixes.
- **Related PRs:** #20, #21
- **Deployment status:** Merged to main; production verification pending.
- **Verification steps:** After a successful Vercel production deploy, open Chrome incognito at `https://therugbypanda.ie/?favicon=7` and confirm the approved panda logo appears in the browser tab.
- **Resolution date:** Pending

## WEB-002 — Duplicate homepage section links

- **Status:** Implemented
- **Priority:** Medium
- **Root cause:** `getSectionLinks()` hardcoded News while Sanity also contained a News category, and CMS categories were sorted alphabetically.
- **Related PRs:** Pending PR from `sprint-3-seo-publishing-polish`
- **Deployment status:** Not deployed
- **Verification steps:** Confirm bottom sections render once and in this order: News, Provinces, Ireland, URC, Europe.
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
