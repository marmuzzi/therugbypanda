# Issue Log

This is the living issue log for The Rugby Panda. An issue is not closed until it has been deployed and verified in production or, for CMS-only workflows, verified in authenticated Sanity Studio.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Issues

| ID | Status | Priority | Area | Summary | Root cause | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LAUNCH-001 | In Progress | Critical | Go Live / Editorial | Publish one introduction article plus at least eight reviewed, image-backed articles covering recent internationals and all four Irish provinces. | Launch content package is incomplete. | — | Not completed | Pending editorial review, publication and production rendering checks | — |
| AUTO-001 | Pending Verification | Critical | Editorial Automation | End-to-end candidate, draft, editor review, approve/amend/reject, publish/discard workflow. | Operational verification and launch-package publication remain incomplete. | #47–#50, #53, #55–#64, #66, #67 | Core workflow, Editorial Review workspace, deterministic review, AI review and refactor are merged and deployed | Current Studio workflow smoke-tested; controlled launch publication verification remains pending | — |
| AUTO-002 | In Progress | Critical | Editorial Automation | Generate a genuinely new replacement article after rejection without reusing the rejected angle or source set. | Persistent orchestrator must supply and run the replacement candidate. | #50, #54 | Replacement endpoint foundation merged | Pending orchestrated rejection/replacement test | — |
| AUTO-003 | Open | Critical | Scheduling / Orchestration | Prepare eight review-ready articles by 08:00 Europe/Dublin daily. | Persistent Make.com orchestration is not configured. | #47–#54 foundation | Foundation deployed; schedule not implemented | Pending repeated successful daily runs, retries and deadline monitoring | — |
| NOTIFY-001 | Open | High | Editorial Notifications | Email `editor@therugbypanda.ie` when an article enters the Editorial Review queue. | No production email-notification integration exists. | — | Not implemented | Pending delivery, deduplication and failure tests | — |
| NOTIFY-002 | Open | High | Technical Alerts | Email `admin@therugbypanda.ie` for workflow failures and technical alerts. | No central alert-routing integration exists. | — | Not implemented | Pending simulated workflow failure and alert delivery test | — |
| WEB-006 | Open | High | Frontend / Contact | Add a public **Contact us** link using `mailto:hello@therugbypanda.ie`. | Public mailbox exists but is not linked from the website. | — | Not implemented | Pending production link verification on desktop and mobile | — |
| ACCRED-001 | Open | Critical | Analytics / Accreditation | Build durable evidence of publishing cadence, traffic, engagement and search visibility. | Analytics and evidence-pack architecture is not implemented. | Issue #51 | Not implemented | Pending GA4, Search Console, exports and evidence-pack verification | — |
| SEC-001 | Open | Critical | Security / Resilience | Establish and verify security, backup and recovery across GitHub, Sanity, Vercel, Cloudflare, Make.com and Apify. | Security baseline and tested restore procedures are incomplete. | — | Not implemented | Pending access review, backups, restore test and credential-rotation verification | — |
| CMS-002 | In Progress | Critical | CMS / Visual Content | Assign approved Editorial Images to existing and launch articles. | Existing articles and launch content still need controlled assignments. | #49 | Assignment contract deployed | Pending Studio and production card/article checks | — |
| PUB-003 | Pending Verification | High | Editorial Images | Apply human-reviewed Editorial Image metadata through controlled dry-run-first importer. | Studio UI reconciliation remains. | #40, #41 | Merged and deployed; reviewed apply completed | Direct Sanity data verified; Studio UI verification pending | — |
| MEDIA-001 | Pending Verification | High | Media / CMS | Editorial Images Studio, queues and bulk review tool. | Final authenticated queue review remains. | #26, #38, #41 | Deployed | Pending final Studio verification | — |
| MEDIA-002 | Pending Verification | High | Media / Workflow | Starter external image candidates imported and reviewed. | Some approved/published records still need metadata reconciliation. | #26, #38, #41 | Imported data exists | Further reconciliation pending | — |
| MEDIA-003 | Pending Verification | High | Media / Originals | Original Rugby Panda photos imported as approved originals. | Final record count and report reconciliation remain. | #38 plus direct commits | Import completed | Pending explicit Studio/report verification | — |
| MEDIA-004 | Open | High | Mobile / Media | Secure phone-friendly upload into Sanity Assets and Editorial Image review. | No mobile ingestion path exists. | — | Not implemented | Pending mobile workflow and production-use verification | — |
| WEB-005 | Open | Medium | Frontend | Implement real website search. | Current search is a placeholder. | — | Not implemented | Pending production verification | — |
| BRAND-004 | Closed | High | Brand Assets | Complete Batch 2 approved-scope brand candidates. | Completed. | #30, #31, #36 | Merged and deployed | Imported, reviewed and five records approved | 2026-07-05 |
| BRAND-003 | Closed | High | Brand Assets / CMS | Import and review Brand Asset candidates. | Completed. | #29 | Deployed | End-to-end verified | 2026-07-05 |
| BRAND-002 | Closed | High | Brand Assets | Build approved-scope candidate collector output. | Completed. | #28 | Deployed | Verified | 2026-07-05 |
| BRAND-001 | Closed | Medium | Brand Assets | Build separate Brand Assets library. | Completed. | #27 | Deployed | Verified in authenticated Sanity Studio | 2026-07-05 |
| BUILD-001 | Closed | High | Build / Frontend | Restore lost CMS helper exports. | Missing exports broke the build. | Direct commits | Deployed | Production verified | 2026-07-05 |
| TAX-001 | Closed | Medium | Taxonomy | Replace Europe with International and avoid legacy 404s. | Legacy taxonomy mismatch. | Direct commits | Deployed | Production verified | 2026-07-05 |
| INF-001 | Closed | High | Infrastructure | Reduce Vercel deployment-rate risk. | Excess deployment volume. | #20, #21, #23, #24 | Deployed | Production verified | 2026-07-04 |
| DOC-001 | Closed | High | Documentation | Establish project state, Issue Log and publishing workflow. | Documentation continuity requirement. | #22 | Merged | Repository verified | 2026-07-04 |
| CMS-001 | Closed | High | CMS | Use hosted Sanity content on homepage and article pages. | Static/local content path needed replacement. | #14 | Deployed | Production verified | 2026-07-03 |

## AUTO-001 current baseline

Merged and deployed capabilities include:

- Editorial Brain classification, scoring and source-linked fact ledger.
- OpenAI structured generation and protected Sanity draft creation.
- Approved Editorial Image assignment.
- Protected submit, approve, reject, publish and discard transitions.
- Authenticated Sanity Editorial Review workspace.
- Editable drafts, save behaviour and workflow controls.
- Deterministic Editorial Review Intelligence and publication gate.
- On-demand AI Editorial Review.
- Refactored Review Queue, Draft Editor, Summary, AI Review, Featured Image, Sources, Fact Ledger, Workflow and Audit History components.

PR #64 introduced a broken Editorial Review component. PR #66 repaired the build and Tool contract. PR #67 completed the maintainability refactor and QA improvements. The current production deployment is `READY` at merge commit `e934cc7ea8e2fe222eb1f4d06b131c717b5fefb1`.

## Mail routing requirements

- `hello@therugbypanda.ie` — public website contact.
- `editor@therugbypanda.ie` — article-ready-for-review and editorial communication.
- `admin@therugbypanda.ie` — workflow failures, technical alerts, infrastructure, security and billing.

## Completion rule

Every issue must retain a unique ID, status, priority, root cause, related PRs, deployment status, verification status and resolution date.