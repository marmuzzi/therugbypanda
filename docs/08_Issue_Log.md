# Issue Log

This is the living issue log for The Rugby Panda. An issue is not closed until it has been deployed and verified in production or, for CMS-only workflows, verified in authenticated Sanity Studio by the user.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Issues

| ID | Status | Priority | Area | Summary | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PUB-001 | Implemented | High | Editorial Automation / Media | Add a non-destructive Editorial Image readiness audit for metadata completeness, approval consistency and duplicate detection. | Pending PR | Implemented on `sprint-5/editorial-image-readiness-audit`; not merged | Pending workflow execution against production Sanity and report review | — |
| BRAND-004 | Closed | High | Media / Brand Assets | Expand Batch 2 Brand Asset candidates for remaining Rugby World Cup-cycle unions, national teams, Irish provinces and approved-scope professional clubs. | #30, #31, #36 plus direct candidate preview update commit | Candidate data/docs merged and deployed; importer update merged to main; Sanity import workflow run by user through GitHub Actions | Batch 2 imported as candidates; importer update allowed logo-reference updates; user completed Brand Review and approved 5 records | 2026-07-05 |
| BRAND-003 | Closed | High | Media / Brand Assets / CMS | Import brand asset candidates into Sanity as unapproved review records and review them through a Brand Review tool. | #29 | Deployed on main commit `c78a02cffbc9ee32e38965b9cee7e3faae124382`; Vercel deployment `dpl_5aLEWUW17j9WCANp9sDjX6Edu7pM` READY | Full Brand Asset workflow verified: Apify → GitHub → Sanity → Brand Review → Approval. First candidate batch imported and manually approved by user. | 2026-07-05 |
| BRAND-002 | Closed | High | Media / Brand Assets | Build Brand Assets candidate collector output for approved rugby-union scope only. | #28 | Deployed on main commit `c8edd8bc40d6e03d644f0deea401c35632a7c6bd` | Candidate data/docs merged and deployed; Sanity review/import workflow subsequently verified under BRAND-003 | 2026-07-05 |
| BRAND-001 | Closed | Medium | Media / Brand Assets | Build separate Brand Assets library for team logos and competition branding. | #27 | Deployed on main commit `aebc730bfe95c54dcb5e437ac2d246f488810d43`; Studio redeployed through GitHub Action | User verified Brand Assets is visible in authenticated Sanity Studio | 2026-07-05 |
| CMS-002 | Open | High | CMS / Visual content | Hosted Sanity articles need proper featured images and metadata. | — | Not implemented | Pending CMS image assignment and page verification | — |
| MEDIA-001 | Pending Verification | High | Media / CMS | Editorial Images Studio, review queues and bulk Image Review tool are implemented and used successfully. | #26 plus direct main commits | Studio redeployed by user; functionality visible | Pending final production documentation closeout and count verification | — |
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

## PUB-001 — Editorial Image readiness audit

- **Status:** Implemented
- **Priority:** High
- **Root cause:** Sprint 5 needs a reliable, repeatable quality gate before approved Editorial Images are assigned to articles or used by publishing automation. Existing pending verification issues rely on manual counts and do not expose incomplete metadata or duplicate references systematically.
- **Implementation:** Added `scripts/audit-editorial-image-readiness.mjs`, the `media:audit-readiness` npm command, and the manually triggered `Audit Editorial Image Readiness` GitHub Action. The audit is read-only and generates JSON and Markdown reports plus a GitHub Actions summary.
- **Related PRs:** Pending PR.
- **Deployment status:** Implemented on feature branch; not merged.
- **Verification status:** Pending workflow execution against the production Sanity dataset and review of the generated artifact.
- **Resolution date:** Pending

## BRAND-004 — Batch 2 Brand Assets expansion

- **Status:** Closed
- **Priority:** High
- **Root cause:** The verified Brand Assets workflow needed broader approved-scope coverage for remaining Rugby World Cup-cycle unions, national teams, Irish provinces and relevant professional clubs.
- **Implementation:** Candidate-only Batch 2 source coverage was recorded in JSON files under `data/brand-assets/`, including `candidate-collection-batch-2-2026-07-05.json`, `candidate-logo-extraction-2026-07-05.json`, `candidate-logo-extraction-apify-2026-07-05.json`, and `candidate-logo-extraction-batch-2-completion-2026-07-05.json`.
- **Import:** Batch 2 candidate records were imported through the GitHub Action `Import Brand Asset Candidates`.
- **Importer fix:** PR #36 updated `scripts/import-brand-asset-candidates.mjs` to support both `candidates` and `targetedResults`, update existing unapproved candidate records with later logo references, normalise unsupported `brandType` values such as `club` to `team`, and skip already-approved Brand Asset records.
- **Preview update:** `data/brand-assets/candidate-logo-preview-update-2026-07-05.json` was added for candidate-only logo preview updates. Some preview references are fallback review aids only and are not approval-ready final logo assets.
- **Review:** User completed Batch 2 Brand Review and approved 5 records.
- **Rights rule:** Candidate logo URLs are references only. They must not be hotlinked or used in public templates. Approved logos should be uploaded to Sanity assets before public use.
- **Related PRs:** #30, #31, #36 plus direct candidate preview update commit.
- **Deployment status:** Candidate data/docs and importer changes merged to `main`; GitHub Action import workflow used for Sanity import/update.
- **Verification status:** User verified Batch 2 review completion in authenticated Sanity Studio.
- **Resolution date:** 2026-07-05

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
