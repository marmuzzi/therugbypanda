# Issue Log

This is the living issue log for The Rugby Panda. An issue is not closed until it has been deployed and verified in production or, for CMS-only workflows, verified in authenticated Sanity Studio.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Issues

| ID | Status | Priority | Area | Summary | Root cause | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WEB-007 | Implemented | High | Frontend / Taxonomy | Simplify top-level navigation to News, Provinces, URC, International and About; treat opinion as an article type and keep Ireland as content metadata rather than a separate section. | The navigation exposed overlapping sections and mixed article types with coverage areas. | Pending PR | Implemented on `feat/simplify-navigation-and-province-banner` | Pending preview, mobile, desktop and production verification | — |
| WEB-008 | Implemented | Medium | Frontend / Category UI | Match the Provinces category banner height and typography to the other category pages. | Provinces used a separate legacy hero layout with substantially larger vertical spacing. | Pending PR | Implemented on `feat/simplify-navigation-and-province-banner` | Pending preview and production visual verification | — |
| V1-UI-001 | In Progress | High | Frontend / Brand | Increase the Panda icon, reduce the wordmark and tighten the brand lockup. | Current header gives too much visual weight to the wordmark. | #99 | Merged and deployed | Pending final desktop and mobile production verification | — |
| V1-NAV-001 | In Progress | High | Frontend / Navigation | Maintain the `/news` archive and accessible hamburger menu while reducing top-level sections to distinct coverage destinations. | The first Version 1 navigation added overlapping Europe, International, Ireland and Opinion destinations. | #99, pending WEB-007 PR | Initial navigation merged; simplification implemented | Pending desktop, mobile, route and production verification | — |
| SOCIAL-001 | In Progress | High | Publishing / Social | Automatically publish image-backed, platform-specific article posts to Facebook and Instagram after controlled article publication, with a Sanity skip override. | No official Meta publishing integration or Make.com scenario exists. | #100, #101 | Data contract merged; delivery not implemented | Pending Meta configuration, controlled posts, idempotency, partial success, retries and failure-path verification | — |
| MEDIA-005 | Open | High | Media / Rights | Add rights dashboard fields and publication gates for photography and reusable editorial assets. | Rights metadata exists but is not yet presented as a consolidated operational dashboard. | — | Not implemented | Pending Sanity Studio and controlled publication-gate verification | — |
| MEDIA-006 | Open | High | Media / Intelligence | Add AI-assisted metadata, quality scoring, duplicate detection and article-image suggestions for uploaded photos. | Media processing is currently manual. | — | Not implemented | Pending representative upload batch and editorial suggestion verification | — |
| BRAND-005 | Open | High | Brand Assets / Frontend | Upload approved team and competition logos into Sanity, link them to entities and expose only approved Sanity-hosted assets. | Candidate records exist, but public frontend use is not implemented. | — | Not implemented | Pending rights review and no-hotlink production verification | — |
| LAUNCH-001 | In Progress | Critical | Go Live / Editorial | Publish one introduction article plus at least eight reviewed, image-backed articles covering recent internationals and all four Irish provinces as soon as possible. | The publicly accessible pre-launch site contains insufficient launch-quality content and may be crawled before the editorial package is ready. | — | Not completed | Pending editorial review, publication, indexing checks and production rendering verification | — |
| AUTO-001 | Pending Verification | Critical | Editorial Automation | End-to-end candidate, draft, editor review, approve/amend/reject, publish/discard workflow. | Launch-package publication and full production lifecycle verification remain incomplete. | #47–#50, #53, #55–#64, #66, #67, #80, #84, #86–#91 | Core workflow and mobile Editorial Review are merged, deployed and Studio verified | Controlled launch publication verification remains pending | — |
| AUTO-002 | In Progress | Critical | Editorial Automation | Generate a genuinely new replacement article after rejection without reusing the rejected angle or source set. | Persistent orchestrator must supply and run the replacement candidate. | #50, #54 | Replacement endpoint foundation merged | Pending orchestrated rejection/replacement test | — |
| AUTO-003 | In Progress | Critical | Scheduling / Orchestration | Prepare eight review-ready articles by 08:00 Europe/Dublin daily. | Persistent Make.com orchestration is not configured. | #47–#54 foundation | Make connection verified; production orchestration scenarios not yet configured | Pending repeated successful daily runs, retries and deadline monitoring | — |
| NOTIFY-001 | Pending Verification | High | Editorial Notifications | Email `editor@therugbypanda.ie` when an article enters the Editorial Review queue. | Webhook delivery works, but production email mapping, persistent deduplication and replay verification remain incomplete. | #82, #85, #89 | Application webhook, observability and enriched payload merged; Make receives events; test email delivery succeeded | Pending correctly populated email, persistent `eventId` deduplication, duplicate replay and failure-path verification | — |
| NOTIFY-002 | Open | High | Technical Alerts | Email `admin@therugbypanda.ie` for workflow failures and technical alerts. | No central alert-routing integration exists. | — | Not implemented | Pending simulated workflow failure and alert delivery test | — |
| WEB-006 | Implemented | High | Frontend / Contact | Add a public **Contact us** link using `mailto:hello@therugbypanda.ie`. | Public mailbox existed but was not linked from the website. | Pending PR | Footer implementation committed on `feat/web-006-contact-link` | Pending merge, deployment and production link verification on desktop and mobile | — |
| ACCRED-001 | Implemented | Critical | Analytics / Accreditation | Build durable evidence of publishing cadence, traffic, engagement and search visibility. | Analytics and evidence-pack architecture was not implemented. | #76, pending dashboard PR | Consent-aware GA4/GTM loader is merged; Sanity Newsroom Dashboard implemented | Pending merge, production deployment, Studio verification and provider-ID event verification | — |
| SEC-001 | Open | Critical | Security / Resilience | Establish and verify security, backup and recovery across GitHub, Sanity, Vercel, Cloudflare, Make.com and Apify. | Security baseline and tested restore procedures are incomplete. | — | Not implemented | Pending access review, backups, restore test and credential rotation | — |
| CMS-002 | In Progress | Critical | CMS / Visual Content | Assign approved Editorial Images to existing and launch articles. | Existing articles and launch content still need controlled assignments. | #49 | Assignment contract deployed | Pending Studio and production card/article checks | — |
| PUB-003 | Pending Verification | High | Editorial Images | Apply human-reviewed Editorial Image metadata through controlled dry-run-first importer. | Studio UI reconciliation remains. | #40, #41 | Merged and deployed; reviewed apply completed | Direct Sanity data verified; Studio UI verification pending | — |
| MEDIA-001 | Pending Verification | High | Media / CMS | Editorial Images Studio, queues and bulk review tool. | Final authenticated queue review remains. | #26, #38, #41 | Deployed | Pending final Studio verification | — |
| MEDIA-002 | Pending Verification | High | Media / Workflow | Starter external image candidates imported and reviewed. | Some approved/published records still need metadata reconciliation. | #26, #38, #41 | Imported data exists | Further reconciliation pending | — |
| MEDIA-003 | Pending Verification | High | Media / Originals | Original Rugby Panda photos imported as approved originals. | Final record count and report reconciliation remain. | #38 plus direct commits | Import completed | Pending explicit Studio/report verification | — |
| MEDIA-004 | Open | High | Mobile / Media | Secure phone-friendly upload into Sanity Assets and Editorial Image review. | No mobile ingestion path exists. | — | Not implemented | Pending mobile workflow and production-use verification | — |
| WEB-005 | Closed | Medium | Frontend | Implement real website search. | Placeholder search did not query published content. | #81 | Merged and deployed | Sanity-backed production search verified | 2026-07-26 |
| BRAND-004 | Closed | High | Brand Assets | Complete Batch 2 approved-scope brand candidates. | Completed. | #30, #31, #36 | Merged and deployed | Imported, reviewed and five records approved | 2026-07-05 |
| BRAND-003 | Closed | High | Brand Assets / CMS | Import and review Brand Asset candidates. | Completed. | #29 | Deployed | End-to-end verified | 2026-07-05 |
| BRAND-002 | Closed | High | Brand Assets | Build approved-scope candidate collector output. | Completed. | #28 | Deployed | Verified | 2026-07-05 |
| BRAND-001 | Closed | Medium | Brand Assets | Build separate Brand Assets library. | Completed. | #27 | Deployed | Verified in authenticated Sanity Studio | 2026-07-05 |
| BUILD-001 | Closed | High | Build / Frontend | Restore lost CMS helper exports. | Missing exports broke the build. | Direct commits | Deployed | Production verified | 2026-07-05 |
| TAX-001 | Closed | High | Taxonomy | Replace Europe with International and avoid legacy 404s. | Legacy taxonomy mismatch. | Direct commits | Deployed | Production verified | 2026-07-05 |
| INF-001 | Closed | High | Infrastructure | Reduce Vercel deployment-rate risk. | Excess deployment volume. | #20, #21, #23, #24 | Deployed | Production verified | 2026-07-04 |
| DOC-001 | Closed | High | Documentation | Establish project state, Issue Log and publishing workflow. | Documentation continuity requirement. | #22 | Merged | Repository verified | 2026-07-04 |
| CMS-001 | Closed | High | CMS | Use hosted Sanity content on homepage and article pages. | Static/local content path needed replacement. | #14 | Deployed | Production verified | 2026-07-03 |

## AUTO-001 current baseline

Merged, deployed and authenticated-Studio-verified capabilities include:

- Editorial Brain classification, scoring and source-linked fact ledger.
- OpenAI structured generation and protected Sanity draft creation.
- Approved Editorial Image assignment.
- Protected submit, approve, reject, publish and discard transitions.
- Authenticated Sanity Editorial Review workspace.
- Editable drafts, save behaviour and workflow controls.
- Deterministic Editorial Review Intelligence and publication gate.
- On-demand AI Editorial Review.
- Queue filters and draft-aware loading for manually created unpublished articles.
- Studio-session authentication and restored workflow notes.
- Mobile-first ordering, contrast and readability through PR #91.
- Automatic hosted Sanity Studio deployment after relevant merges.

The repository contains newer frontend and publication-pipeline commits beyond the PR #91 baseline. Always inspect live `main` before quoting a current SHA or deployment state.

## Taxonomy decision

Top-level reader navigation is limited to distinct destinations:

- News
- Provinces
- URC
- International
- About

Ireland remains available as article and editorial metadata where useful, but is not a separate top-level reader section. Opinion, analysis, column and notebook are article types or formats rather than coverage sections. Europe is covered within International unless a future evidence-based product need justifies a dedicated destination.

## Launch and automation priority

The site is publicly accessible before formal launch. Launch-quality articles must therefore be published as soon as editorial and image checks pass. Full automation remains mandatory for sustainable daily operation, but automation work must not unnecessarily delay the controlled publication of the minimum launch package.

## Make.com integration status

- The Make.com toolbox connection and Health Check are verified.
- A production webhook receives review-ready events.
- A test email reached `editor@therugbypanda.ie`.
- The currently exposed connector does not permit Make scenario editing.
- NOTIFY-001 remains incomplete until production field mapping, persistent deduplication, duplicate replay and failure-path behaviour are verified.

## Mail routing requirements

- `hello@therugbypanda.ie` — public website contact.
- `editor@therugbypanda.ie` — article-ready-for-review and editorial communication.
- `admin@therugbypanda.ie` — workflow failures, technical alerts, infrastructure, security and billing.

## Completion rule

Every issue must retain a unique ID, status, priority, root cause, related PRs, deployment status, verification status and resolution date.
