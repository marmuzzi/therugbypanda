# Issue Log

This is the living issue log for The Rugby Panda. An issue is not closed until it has been deployed and verified in production or, for CMS-only workflows, verified in authenticated Sanity Studio by the user.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Issues

| ID | Status | Priority | Area | Summary | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LAUNCH-001 | In Progress | Critical | Go Live / Editorial | Publish the minimum go-live package: one Rugby Panda introduction article plus at least eight image-backed articles covering recent internationals and Leinster, Munster, Ulster and Connacht. | — | Planning documented; content package not yet completed | Pending editorial review, publication, homepage/category/article rendering checks and production verification | — |
| SEC-001 | Open | Critical | Security / Resilience | Establish and verify the security, backup and recovery baseline across GitHub, Sanity, Vercel, Cloudflare, Make.com and Apify. | — | Not implemented | Pending access review, branch protection, secret controls, backups, restore tests and recovery documentation | — |
| AUTO-001 | Implemented | Critical | Editorial Automation | End-to-end article candidate, draft, editor review, approve/amend/reject, publish/discard workflow. | #47, #48, #49, #50, #62 | Studio review workspace and deterministic Editorial Review Intelligence implemented on `feat/editorial-review-intelligence`; not yet merged or deployed | Pending authenticated Sanity Studio operation and end-to-end production publication verification | — |
| AUTO-002 | In Progress | Critical | Editorial Automation | Generate a replacement article whenever a daily draft is rejected, without repeating the rejected angle or source set. | #50 foundation | Rejection state, reason, count and replacement-required flag merged; automatic regeneration not yet implemented | Pending simulated and live rejection/replacement tests | — |
| AUTO-003 | Open | Critical | Scheduling / Orchestration | Prepare eight review-ready articles across active sections by 08:00 Europe/Dublin every day. | #47–#50 foundation | Editorial generation foundation exists; persistent scheduling not implemented; Make.com not connected | Pending scheduled-run, retry, deadline and review-queue verification | — |
| ACCRED-001 | Open | Critical | Analytics / Accreditation | Build durable evidence of publishing cadence, verifiable traffic, engagement, search visibility and established readership for accreditation and commercial use. | Issue #51 | Requirement recorded; analytics architecture not yet implemented | Pending GA4/Search Console integration, article-level tracking, monthly exports and reproducible evidence-pack verification | — |
| MEDIA-004 | Open | High | Mobile / Media | Provide a secure phone-friendly workflow for uploading original Rugby Panda photos directly into Sanity Assets and Editorial Image review. | — | Not implemented | Pending mobile upload, metadata creation, rights defaults, review queue and production-use verification | — |
| PUB-003 | Pending Verification | High | Editorial Automation / Media | Apply human-reviewed Editorial Image metadata through a controlled dry-run-first importer. | #40, #41 | Merged and deployed; real reviewed apply completed through GitHub Actions | Dry run `30042466296` clean; apply `30042718915` updated 2 canonical records; audit `30042908343` improved ready count to 24; direct Sanity data verified. Studio UI verification pending. | — |
| PUB-002 | Merged | High | Editorial Automation / Media | Generate reviewable metadata suggestions for canonical Editorial Images without mutating Sanity. | #39, #41 | Canonical-only fix merged and production deployment READY | Production query confirmed 38 canonical records versus 40 raw records; generator excludes `drafts.*` and has a runtime guard | — |
| PUB-001 | Closed | High | Editorial Automation / Media | Add a non-destructive Editorial Image readiness audit. | #38 | Merged and deployed | Initial and follow-up audits succeeded | 2026-07-12 |
| CMS-002 | In Progress | Critical | CMS / Visual content | Assign approved Editorial Images to every launch and existing article through the canonical article-image contract. | #49 | Generated-draft assignment contract merged; existing published articles still require controlled assignment | Pending authenticated Studio verification and production checks for homepage cards and article pages | — |
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

## AUTO-001 — Editorial review and publishing workflow

- **Status:** Pending Verification
- **Priority:** Critical
- **Implemented and merged:**
  - PR #47: Editorial Brain classification, scoring, source-linked fact ledger, confidence controls, voice and originality rules.
  - PR #48: OpenAI Responses API generation, protected `POST /api/editorial/draft`, Portable Text conversion and Sanity draft creation.
  - PR #49: approved Editorial Image resolution and assignment into the canonical article `featuredImage` contract.
  - PR #50: protected `POST /api/editorial/workflow` with `submit`, `approve`, `reject`, `publish` and `discard` actions, state validation and audit history.
- **Security:** Both editorial endpoints require `Authorization: Bearer <EDITORIAL_AUTOMATION_SECRET>`.
- **PR #62 implemented (not yet merged):** `feat/editorial-review-intelligence` adds the Studio Editorial Review panel, native `en-IE` browser spellchecking, deterministic local checks, quality scoring and readiness. Blocking issues prevent Approve and Publish in both the controls and `runAction`; Submit, Reject and Discard retain their existing workflow rules. No AI calls, dictionary management, rewriting or review-history persistence were added.
- **Validation:** `npm run build` passed. `npm run lint` remains blocked by pre-existing ESLint errors in `BrandAssetReviewTool.tsx`, `EditorialImageReviewTool.tsx`, `EditorialQaTool.tsx` and `sanity/schemaTypes/index.ts`; the new framework introduced no reported lint errors.
- **Verification status:** Pending authenticated Studio use, gate behaviour verification and one controlled end-to-end production publication test.
- **Resolution date:** Pending.

## AUTO-002 — Rejected article replacement

- **Status:** In Progress
- **Priority:** Critical
- **Foundation merged:** PR #50 stores rejection reason, rejection count and replacement-required state while preserving audit history.
- **Remaining implementation:** Select a non-duplicate candidate, exclude rejected angle/source combinations, generate a genuinely new article, attach an approved image where available and return the queue to target.
- **Verification status:** Pending simulated rejection, duplicate-prevention test and live queue replenishment test.
- **Resolution date:** Pending.

## AUTO-003 — Eight drafts by 08:00 daily

- **Status:** Open
- **Priority:** Critical
- **Current foundation:** Editorial Brain, generation, Sanity draft creation, approved image assignment and workflow state transitions are merged.
- **Remaining implementation:** Persistent Make.com orchestration, Apify acquisition, section mix, retries, duplicate prevention, failure notification and deadline monitoring.
- **Timezone:** All scheduling uses Europe/Dublin.
- **Verification status:** Pending repeated successful daily runs completed before 08:00 Europe/Dublin.
- **Resolution date:** Pending.

## ACCRED-001 — Accreditation evidence and audience analytics baseline

- **Status:** Open
- **Priority:** Critical
- **Business reason:** Media accreditation and sponsorship discussions require proof of a consistent publishing track record, verifiable traffic metrics and established readership.
- **Implementation required:**
  - durable article publication history and editorial audit trail;
  - GA4 users, sessions, views, engagement and returning readership;
  - article-level performance and traffic-source attribution;
  - Google Search Console impressions, clicks and rankings;
  - reproducible monthly snapshots and exports;
  - an accreditation evidence pack that can be regenerated for a selected date range.
- **Related issue:** GitHub issue #51.
- **Verification status:** Pending data collection, reconciliation against source platforms and export validation.
- **Resolution date:** Pending.

## CMS-002 — CMS article images missing

- **Status:** In Progress
- **Priority:** Critical
- **Progress:** PR #49 establishes the generated-draft assignment path using the existing `article.featuredImage` frontend contract. Only Editorial Images that are usage-approved, approved/published and backed by a Sanity asset may be assigned.
- **Remaining implementation:** Assign reviewed images to the seven existing published articles and the launch package.
- **Verification status:** Pending authenticated Studio verification and production checks for homepage cards and article pages.
- **Resolution date:** Pending.
