# Issue Log

This is the living issue log for The Rugby Panda. An issue is not closed until it has been deployed and verified in production or, for CMS-only workflows, verified in authenticated Sanity Studio by the user.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Issues

| ID | Status | Priority | Area | Summary | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LAUNCH-001 | In Progress | Critical | Go Live / Editorial | Publish the minimum go-live package: one Rugby Panda introduction article plus at least eight image-backed articles covering recent internationals and Leinster, Munster, Ulster and Connacht. | — | Planning documented; content and image assignment not yet implemented | Pending editorial review, publication, homepage/category/article rendering checks and production verification | — |
| SEC-001 | Open | Critical | Security / Resilience | Establish and verify the security, backup and recovery baseline across GitHub, Sanity, Vercel, Cloudflare, Make.com and Apify. | — | Not implemented | Pending access review, branch protection, secret controls, backups, restore tests and recovery documentation | — |
| AUTO-001 | Open | Critical | Editorial Automation | Build the end-to-end article candidate, draft, editor review, approve/amend/reject, publish/discard workflow. | — | Not implemented | Pending authenticated Sanity workflow and production publication verification | — |
| AUTO-002 | Open | Critical | Editorial Automation | Generate a replacement article whenever a daily draft is rejected, without repeating the rejected angle or source set. | — | Not implemented | Pending workflow simulation and production verification | — |
| AUTO-003 | Open | Critical | Scheduling / Orchestration | Prepare eight review-ready articles across active sections by 08:00 Europe/Dublin every day. | — | Not implemented; Make.com unavailable in current session | Pending scheduled-run, retry, deadline and review-queue verification | — |
| MEDIA-004 | Open | High | Mobile / Media | Provide a secure phone-friendly workflow for uploading original Rugby Panda photos directly into Sanity Assets and Editorial Image review. | — | Not implemented | Pending mobile upload, metadata creation, rights defaults, review queue and production-use verification | — |
| PUB-003 | Pending Verification | High | Editorial Automation / Media | Apply human-reviewed Editorial Image metadata through a controlled dry-run-first importer. | #40, #41 | Merged and deployed; real reviewed apply completed through GitHub Actions | Dry run `30042466296` clean; apply `30042718915` updated 2 canonical records; audit `30042908343` improved ready count to 24; direct Sanity data verified. Studio UI verification pending. | — |
| PUB-002 | Merged | High | Editorial Automation / Media | Generate reviewable metadata suggestions for canonical Editorial Images without mutating Sanity. | #39, #41 | Canonical-only fix merged and production deployment READY | Production query confirmed 38 canonical records versus 40 raw records; generator excludes `drafts.*` and has a runtime guard | — |
| PUB-001 | Closed | High | Editorial Automation / Media | Add a non-destructive Editorial Image readiness audit. | #38 | Merged and deployed | Initial and follow-up audits succeeded | 2026-07-12 |
| CMS-002 | In Progress | Critical | CMS / Visual content | Assign approved Editorial Images to every launch and existing article through the canonical article-image contract. | #41 discovery | Seven existing published articles inspected; assignment not implemented | All seven currently lack populated image references; pending schema contract, assignment, Studio and production verification | — |
| MEDIA-001 | Pending Verification | High | Media / CMS | Editorial Images Studio, queues and bulk review tool. | #26, #38, #41 | Deployed | 40 raw / 38 canonical records confirmed; final Studio queue verification pending | — |
| MEDIA-002 | Pending Verification | High | Media / Workflow | Starter external image candidates imported and reviewed. | #26, #38, #41 | Imported data exists | Approved/published but not ready reduced from 12 to 10; further reconciliation pending | — |
| MEDIA-003 | Pending Verification | High | Media / Originals | Original Rugby Panda photos imported as approved originals. | #38 plus direct commits | Import completed | Original-photo count requires explicit Studio/report reconciliation | — |
| WEB-005 | Open | Medium | Frontend | Search remains a placeholder. | — | Not implemented | Pending search implementation and production verification | — |
| BRAND-004 | Closed | High | Media / Brand Assets | Expand Batch 2 Brand Asset candidates for approved rugby-union scope. | #30, #31, #36 | Merged and deployed | Imported, reviewed and 5 records approved | 2026-07-05 |
| BRAND-003 | Closed | High | Media / Brand Assets / CMS | Import Brand Asset candidates and review them through Brand Review. | #29 | Deployed | End-to-end workflow verified | 2026-07-05 |
| BRAND-002 | Closed | High | Media / Brand Assets | Build approved-scope Brand Assets candidate collector output. | #28 | Deployed | Import and review verified | 2026-07-05 |
| BRAND-001 | Closed | Medium | Media / Brand Assets | Build the separate Brand Assets library. | #27 | Deployed | Verified in authenticated Sanity Studio | 2026-07-05 |
| BUILD-001 | Closed | High | Build / Frontend | Restore lost CMS helper exports. | Direct commits | Deployed | Production verified | 2026-07-05 |
| TAX-001 | Closed | Medium | Taxonomy / Navigation | Replace Europe with International and avoid legacy 404s. | Direct commits | Deployed | Production verified | 2026-07-05 |
| INF-001 | Closed | High | Infrastructure | Vercel deployment-rate risk. | #20, #21, #23, #24 | Deployed | Production verified | 2026-07-04 |
| WEB-001 | Closed | High | Frontend | Dedicated favicon. | #23, #24 | Deployed | Verified | 2026-07-04 |
| WEB-002 | Closed | Medium | Frontend | Homepage section link order. | #23 | Deployed | Verified | 2026-07-04 |
| WEB-003 | Closed | Medium | Branding / UI | Masthead proportions. | #23 | Deployed | Verified | 2026-07-04 |
| WEB-004 | Closed | Medium | Branding / UI | Dedicated favicon design. | #23, #24 | Deployed | Verified | 2026-07-04 |
| DOC-001 | Closed | High | Documentation | Project state, Issue Log and publishing workflow. | #22 | Merged | Repository verified | 2026-07-04 |
| CMS-001 | Closed | High | CMS | Homepage and article pages use hosted Sanity content. | #14 | Deployed | Live validation verified | 2026-07-03 |

## LAUNCH-001 — Minimum go-live content package

- **Status:** In Progress
- **Priority:** Critical
- **Root cause:** The website has a technical foundation but does not yet have enough complete, image-backed editorial content for a credible public launch.
- **Implementation required:** One introduction article plus at least eight additional reviewed articles covering recent international matches and Leinster, Munster, Ulster and Connacht. Accurate backdating is allowed. Every article requires an approved Editorial Image.
- **Related PRs:** Pending.
- **Deployment status:** Planning documented in `docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md`.
- **Verification status:** Pending production verification of homepage, category pages, article pages, dates, image rendering and metadata.
- **Resolution date:** Pending.

## SEC-001 — Security, backup and recovery baseline

- **Status:** Open
- **Priority:** Critical
- **Root cause:** The project does not yet have a single verified baseline covering account security, least privilege, branch protection, secret handling, backups and tested restoration.
- **Implementation required:** Audit and harden GitHub, Sanity, Vercel, Cloudflare, domains, Apify and Make.com; create independent backups and test recovery.
- **Related PRs:** Pending.
- **Deployment status:** Not implemented.
- **Verification status:** Must include successful restoration exercises; backup existence alone is insufficient.
- **Resolution date:** Pending.

## AUTO-001 — Editorial review and publishing workflow

- **Status:** Open
- **Priority:** Critical
- **Root cause:** Article generation, human review, approval, rejection and publication are not yet connected as one controlled workflow.
- **Implementation required:** Candidate discovery, validated source storage, draft generation, image assignment, Sanity review queues, amend/approve/reject actions, controlled publish/discard and audit history.
- **Related PRs:** Pending.
- **Deployment status:** Not implemented.
- **Verification status:** Pending end-to-end authenticated Sanity and production publication test.
- **Resolution date:** Pending.

## AUTO-002 — Rejected article replacement

- **Status:** Open
- **Priority:** Critical
- **Root cause:** A rejected draft would currently reduce the daily review inventory below target.
- **Implementation required:** Rejection must trigger a replacement candidate while recording rejected angles and sources to prevent repetition.
- **Related PRs:** Pending.
- **Deployment status:** Not implemented.
- **Verification status:** Pending simulated and live rejection/replacement tests.
- **Resolution date:** Pending.

## AUTO-003 — Eight drafts by 08:00 daily

- **Status:** Open
- **Priority:** Critical
- **Root cause:** No persistent scheduler currently creates and quality-checks eight review-ready drafts before the daily editorial deadline.
- **Implementation required:** Use Make.com for orchestration, Apify for approved source acquisition, GitHub for versioned logic, and Sanity for the review queue. Include retries, duplicate prevention, failure notification and section mix rules.
- **Related PRs:** Pending.
- **Deployment status:** Not implemented; Make.com is not currently connected.
- **Verification status:** Pending repeated successful daily runs completed before 08:00 Europe/Dublin.
- **Resolution date:** Pending.

## MEDIA-004 — Mobile original-photo ingestion

- **Status:** Open
- **Priority:** High
- **Root cause:** Original photos cannot yet be uploaded, enriched and placed into review quickly from the user's phone.
- **Implementation required:** Secure authenticated mobile upload directly to Sanity Assets, automatic `editorialImage` draft creation, metadata assistance and Rugby Panda attribution defaults.
- **Related PRs:** Pending.
- **Deployment status:** Not implemented.
- **Verification status:** Pending upload and review from a real phone followed by approved production use.
- **Resolution date:** Pending.

## CMS-002 — CMS article images missing

- **Status:** In Progress
- **Priority:** Critical
- **Root cause:** Seven current published articles and all planned launch articles require a canonical image reference that the frontend actually renders.
- **Implementation required:** Confirm the article image schema and frontend query contract, then assign approved Editorial Images through a controlled workflow.
- **Related PRs:** #41 discovery; implementation PR pending.
- **Deployment status:** Discovery completed; assignment not yet implemented.
- **Verification status:** Pending authenticated Studio verification and production checks for homepage cards and article pages.
- **Resolution date:** Pending.
