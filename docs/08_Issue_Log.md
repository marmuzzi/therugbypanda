# Issue Log

This is the living issue log for The Rugby Panda. An issue is not closed until it has been deployed and verified in production or, for CMS-only workflows, verified in authenticated Sanity Studio by the user.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Issues

| ID | Status | Priority | Area | Summary | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PUB-003 | Implemented | High | Editorial Automation / Media | Apply human-reviewed Editorial Image metadata through a controlled dry-run-first importer. | Pending PR | Implemented on `sprint-5/editorial-metadata-apply`; not merged | Pending preview/build, dry-run workflow execution and reviewed apply verification | — |
| PUB-002 | Pending Verification | High | Editorial Automation / Media | Generate reviewable metadata suggestions for Editorial Images without mutating Sanity. | #39 | Merged to main commit `4fe2ace1db1a61f24d3e9cbb21b49c786dd6c4b8`; workflow available | Workflow artifact reviewed: 40 records, 18 with suggestions, 11 metadata-review-ready, 1 rights-review-required, 22 complete, 6 inactive. Draft/published pairs identified for correction. | — |
| PUB-001 | Closed | High | Editorial Automation / Media | Add a non-destructive Editorial Image readiness audit for metadata completeness, approval consistency and duplicate detection. | #38 | Merged to main commit `52773146417b677f0171db0dd9cb9b9dc7a54f34`; production workflow available | Workflow run `29208191194` succeeded; report reviewed: 40 total, 22 ready, 18 needing attention, 0 duplicate assets | 2026-07-12 |
| BRAND-004 | Closed | High | Media / Brand Assets | Expand Batch 2 Brand Asset candidates for remaining Rugby World Cup-cycle unions, national teams, Irish provinces and approved-scope professional clubs. | #30, #31, #36 plus direct candidate preview update commit | Candidate data/docs merged and deployed; importer update merged to main; Sanity import workflow run by user through GitHub Actions | Batch 2 imported as candidates; importer update allowed logo-reference updates; user completed Brand Review and approved 5 records | 2026-07-05 |
| BRAND-003 | Closed | High | Media / Brand Assets / CMS | Import brand asset candidates into Sanity as unapproved review records and review them through a Brand Review tool. | #29 | Deployed on main commit `c78a02cffbc9ee32e38965b9cee7e3faae124382`; Vercel deployment `dpl_5aLEWUW17j9WCANp9sDjX6Edu7pM` READY | Full Brand Asset workflow verified: Apify → GitHub → Sanity → Brand Review → Approval. First candidate batch imported and manually approved by user. | 2026-07-05 |
| BRAND-002 | Closed | High | Media / Brand Assets | Build Brand Assets candidate collector output for approved rugby-union scope only. | #28 | Deployed on main commit `c8edd8bc40d6e03d644f0deea401c35632a7c6bd` | Candidate data/docs merged and deployed; Sanity review/import workflow subsequently verified under BRAND-003 | 2026-07-05 |
| BRAND-001 | Closed | Medium | Media / Brand Assets | Build separate Brand Assets library for team logos and competition branding. | #27 | Deployed on main commit `aebc730bfe95c54dcb5e437ac2d246f488810d43`; Studio redeployed through GitHub Action | User verified Brand Assets is visible in authenticated Sanity Studio | 2026-07-05 |
| CMS-002 | Open | High | CMS / Visual content | Hosted Sanity articles need proper featured images and metadata. | — | Not implemented | Pending CMS image assignment and page verification | — |
| MEDIA-001 | Pending Verification | High | Media / CMS | Editorial Images Studio, review queues and bulk Image Review tool are implemented and used successfully. | #26, #38 plus direct main commits | Studio functionality deployed; readiness audit deployed and run | Audit verified 40 Editorial Image documents; final Studio queue interpretation remains pending | — |
| MEDIA-002 | Pending Verification | High | Media / Workflow | Starter external image candidates imported and reviewed through approval/rejection workflow. | #26, #38 plus direct main commits | Imported data exists and review workflow works | Audit identified 12 approved/published records not publication-ready; reviewed external counts still need reconciliation | — |
| MEDIA-003 | Pending Verification | High | Media / Originals | 22 original Rugby Panda photos imported into Sanity as approved original photos. | #38 plus direct main commits | Import workflow completed successfully | Audit completed but original-photo count still requires explicit Studio/report reconciliation | — |
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

## PUB-003 — Controlled Editorial Image metadata importer

- **Status:** Implemented
- **Priority:** High
- **Root cause:** Metadata suggestions require a safe human-review boundary before any Sanity mutation. The first suggestions report also included `drafts.*` document pairs, so writes must target canonical document IDs only.
- **Implementation:** Added a decision-file contract, JSON Schema, dry-run-first importer, allow-listed writable fields, draft-ID rejection, inactive-record rejection, no-overwrite protection, change reports, and the `Apply Reviewed Editorial Image Metadata` GitHub Action.
- **Related PRs:** Pending PR.
- **Deployment status:** Implemented on `sprint-5/editorial-metadata-apply`; not merged.
- **Verification status:** Pending clean preview/build, dry-run execution, review of the generated report, then an explicit apply run using approved decisions.
- **Resolution date:** Pending

## PUB-002 — Editorial Image metadata suggestions

- **Status:** Pending Verification
- **Priority:** High
- **Root cause:** The verified readiness audit found a repeated gap in alt text, caption, public credit and copyright metadata.
- **Implementation:** Read-only suggestions generator and GitHub Action merged in PR #39.
- **Related PRs:** #39.
- **Deployment status:** Merged to main commit `4fe2ace1db1a61f24d3e9cbb21b49c786dd6c4b8`.
- **Verification status:** Artifact reviewed. The report produced useful conservative suggestions but included draft/published pairs; importer safeguards reject all draft IDs, and the generator query still requires canonical-record filtering.
- **Resolution date:** Pending

## PUB-001 — Editorial Image readiness audit

- **Status:** Closed
- **Priority:** High
- **Root cause:** Sprint 5 needed a reliable, repeatable quality gate before approved Editorial Images could be assigned to articles or used by publishing automation.
- **Implementation:** Added `scripts/audit-editorial-image-readiness.mjs`, the `media:audit-readiness` npm command, and the manually triggered `Audit Editorial Image Readiness` GitHub Action.
- **Related PRs:** #38.
- **Deployment status:** Merged to main commit `52773146417b677f0171db0dd9cb9b9dc7a54f34` and deployed.
- **Verification status:** Workflow run `29208191194` succeeded. Report reviewed: 40 records, 22 publication-ready, 18 needing attention, 34 approved/published, 12 approved/published but not ready, 0 duplicate asset groups and 2 duplicate source groups caused by draft/published pairs.
- **Resolution date:** 2026-07-12

## CMS-002 — CMS article images missing

- **Status:** Open
- **Priority:** High
- **Root cause:** Current published articles do not consistently have featured image assets assigned from the Editorial Images library.
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

- `PUB-001` Editorial Image readiness audit — closed 2026-07-12.
- `BRAND-004` Batch 2 Brand Assets expansion and review — closed 2026-07-05.
- `BRAND-003` Brand Assets Sanity review workflow — closed 2026-07-05.
- `BRAND-002` Brand Assets candidate collector — closed 2026-07-05.
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
