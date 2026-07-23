# Issue Log

This is the living issue log for The Rugby Panda. An issue is not closed until it has been deployed and verified in production or, for CMS-only workflows, verified in authenticated Sanity Studio by the user.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Issues

| ID | Status | Priority | Area | Summary | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PUB-003 | Pending Verification | High | Editorial Automation / Media | Apply human-reviewed Editorial Image metadata through a controlled dry-run-first importer. | #40, #41 | PR #40 merged and production deployment READY; real reviewed apply completed through GitHub Actions | Dry run `30042466296` clean; apply run `30042718915` applied 2 canonical records; audit run `30042908343` improved publication-ready count from 22 to 24; direct authenticated Sanity data verified. Authenticated Studio UI verification remains pending. | — |
| PUB-002 | Implemented | High | Editorial Automation / Media | Generate reviewable metadata suggestions for canonical Editorial Images without mutating Sanity. | #39, #41 | Canonical-only fix committed on PR #41; pending merge and production deployment | Production query confirmed 38 canonical records versus 40 raw records. Generator excludes `drafts.*` and includes a runtime draft guard. | — |
| PUB-001 | Closed | High | Editorial Automation / Media | Add a non-destructive Editorial Image readiness audit for metadata completeness, approval consistency and duplicate detection. | #38 | Merged to main commit `52773146417b677f0171db0dd9cb9b9dc7a54f34`; production workflow available | Initial run `29208191194` succeeded. Follow-up run `30042908343` succeeded after reviewed metadata apply: 40 total, 24 ready, 16 needing attention, 0 duplicate assets. | 2026-07-12 |
| BRAND-004 | Closed | High | Media / Brand Assets | Expand Batch 2 Brand Asset candidates for remaining approved rugby-union scope. | #30, #31, #36 | Candidate data/docs merged and deployed | Imported, reviewed, and 5 records approved | 2026-07-05 |
| BRAND-003 | Closed | High | Media / Brand Assets / CMS | Import Brand Asset candidates into Sanity and review them through Brand Review. | #29 | Deployed | End-to-end workflow verified | 2026-07-05 |
| BRAND-002 | Closed | High | Media / Brand Assets | Build Brand Assets candidate collector output for approved scope. | #28 | Deployed | Import/review subsequently verified | 2026-07-05 |
| BRAND-001 | Closed | Medium | Media / Brand Assets | Build separate Brand Assets library. | #27 | Deployed | Verified in authenticated Sanity Studio | 2026-07-05 |
| CMS-002 | In Progress | High | CMS / Visual content | Hosted Sanity articles need proper featured images and metadata. | #41 discovery | Seven published articles inspected; assignment not yet implemented | All seven currently have no populated image field. Pending schema/frontend contract confirmation, controlled assignment, production rendering check and Studio verification. | — |
| MEDIA-001 | Pending Verification | High | Media / CMS | Editorial Images Studio, queues and bulk review tool. | #26, #38, #41 | Studio functionality and audits deployed | 40 raw / 38 canonical records confirmed; final authenticated Studio queue verification pending | — |
| MEDIA-002 | Pending Verification | High | Media / Workflow | Starter external image candidates imported and reviewed. | #26, #38, #41 | Imported data exists; reviewed metadata apply now verified | Approved/published but not ready reduced from 12 to 10; further reconciliation pending | — |
| MEDIA-003 | Pending Verification | High | Media / Originals | Original Rugby Panda photos imported as approved originals. | #38 plus direct commits | Import completed | Original-photo count still requires explicit Studio/report reconciliation | — |
| WEB-005 | Open | Medium | Frontend | Search remains a placeholder. | — | Not implemented | Pending search implementation and production verification | — |
| BUILD-001 | Closed | High | Build / Frontend | Restore lost CMS helper exports. | Direct commits | Deployed | Production verified | 2026-07-05 |
| TAX-001 | Closed | Medium | Taxonomy / Navigation | Replace Europe with International and avoid legacy 404s. | Direct commits | Deployed | Production verified | 2026-07-05 |
| INF-001 | Closed | High | Infrastructure | Vercel deployment-rate risk. | #20, #21, #23, #24 | Deployed | Production verified | 2026-07-04 |
| WEB-001 | Closed | High | Frontend | Dedicated favicon. | #23, #24 | Deployed | Verified | 2026-07-04 |
| WEB-002 | Closed | Medium | Frontend | Homepage section link order. | #23 | Deployed | Verified | 2026-07-04 |
| WEB-003 | Closed | Medium | Branding / UI | Masthead proportions. | #23 | Deployed | Verified | 2026-07-04 |
| WEB-004 | Closed | Medium | Branding / UI | Dedicated favicon design. | #23, #24 | Deployed | Verified | 2026-07-04 |
| DOC-001 | Closed | High | Documentation | Project state, issue log and publishing workflow. | #22 | Merged | Repository verified | 2026-07-04 |
| CMS-001 | Closed | High | CMS | Homepage and article pages use hosted Sanity content. | #14 | Deployed | Live validation verified | 2026-07-03 |

## PUB-003 — Controlled Editorial Image metadata importer

- **Status:** Pending Verification
- **Priority:** High
- **Root cause:** Metadata suggestions require a safe human-review boundary before any Sanity mutation, and writes must target canonical IDs only.
- **Implementation:** Decision-file contract, schema, dry-run-first importer, allow-listed fields, draft/inactive rejection, no-overwrite protection and reports.
- **Related PRs:** #40 and #41.
- **Deployment status:** PR #40 merged at `cd442f47eee73237f935bdad9848f789ca7c618d`; production Vercel deployment confirmed READY. PR #41 contains the canonical filter and genuine reviewed decision file.
- **Verification status:** Dry run `30042466296`: 2 applicable, 0 rejected. Apply `30042718915`: 2 applied, 0 rejected. Audit `30042908343`: publication ready 24, needs attention 16, approved/published but not ready 10. Direct authenticated Sanity query confirmed stored values. Pending authenticated Studio UI verification.
- **Resolution date:** Pending

## PUB-002 — Editorial Image metadata suggestions

- **Status:** Implemented
- **Priority:** High
- **Root cause:** The initial query included two `drafts.*` document counterparts.
- **Implementation:** Generator now queries canonical IDs only and fails if a draft ID is unexpectedly returned.
- **Related PRs:** #39 and #41.
- **Deployment status:** Fix committed on PR #41; pending merge/deployment.
- **Verification status:** Direct production query returned 38 canonical records from 40 raw records, confirming two draft/published pairs.
- **Resolution date:** Pending

## CMS-002 — CMS article images missing

- **Status:** In Progress
- **Priority:** High
- **Root cause:** Seven current published articles have no assigned image reference.
- **Deployment status:** Discovery completed; assignment not yet implemented.
- **Verification steps:** Confirm the canonical article image field and frontend query contract, assign approved Editorial Images through a controlled workflow, then verify homepage cards and article pages in production and records in authenticated Studio.
- **Resolution date:** Pending

## Closed issues summary

Closed issues remain: `PUB-001`, `BRAND-004`, `BRAND-003`, `BRAND-002`, `BRAND-001`, `BUILD-001`, `TAX-001`, `INF-001`, `WEB-001`, `WEB-002`, `WEB-003`, `WEB-004`, `DOC-001`, and `CMS-001`.
