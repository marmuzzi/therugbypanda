# Issue Log

This is the living issue log for The Rugby Panda. An issue is not closed until it has been deployed and verified in production or, for CMS-only workflows, verified in authenticated Sanity Studio.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Issues

| ID | Status | Priority | Area | Summary | Root cause | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DOC-002 | Closed | High | Documentation / Project State | Reconcile authoritative project documentation with live GitHub, Vercel, Sanity and Make state on 17 August 2026. | Several older documents retained superseded eight-draft, ready-for-review, Free-plan and navigation assumptions after later production changes. | #148 | Merged and production deployment READY at `70462a9dafbd04fe80807bd5c7c1fab750ea5a05` | Production returned HTTP 200 after deployment; reconciled docs are authoritative | 2026-08-17 |
| WEB-007 | Implemented | High | Frontend / Taxonomy | Simplify top-level navigation to News, Provinces, URC, International and About; treat opinion as an article type and keep Ireland as content metadata rather than a separate section. | The navigation exposed overlapping sections and mixed article types with coverage areas. | Pending reconciliation | Behaviour is visible in current production, while the historical feature branch remains | Production behaviour observed; branch/PR provenance still requires cleanup | — |
| WEB-008 | Implemented | Medium | Frontend / Category UI | Match the Provinces category banner height and typography to the other category pages. | Provinces used a separate legacy hero layout with substantially larger vertical spacing. | Pending reconciliation | Historical implementation branch remains | Pending explicit visual/provenance reconciliation | — |
| WEB-009 | Closed | High | Frontend / Editorial Images | Keep each article's featured image consistent across homepage, News archive, article detail and social metadata. | Article detail had a deterministic fallback that could substitute a different approved Editorial Image when the assigned image was temporarily unavailable, while homepage/news cards did not use that fallback. | #166 | Merged as `48b9c7c159f210b8c63221afef5970a40ebf7a5b`; Vercel production READY | Production homepage and article detail both returned the same assigned Aviva Stadium image for `welcome-to-the-rugby-panda`; unrelated fallback removed | 2026-08-17 |
| V1-UI-001 | In Progress | High | Frontend / Brand | Increase the Panda icon, reduce the wordmark and tighten the brand lockup. | Current header gives too much visual weight to the wordmark. | #99 | Merged and deployed | Pending final desktop and mobile production verification | — |
| V1-NAV-001 | Pending Verification | High | Frontend / Navigation | Maintain `/news` and accessible mobile navigation while limiting top-level sections to distinct coverage destinations. | The first Version 1 navigation exposed overlapping Europe, International, Ireland and Opinion destinations. | #99; provenance reconciliation pending | Current simplified navigation is live in production | News / Provinces / URC / International / About observed in production; remaining route/mobile verification pending | — |
| SOCIAL-001 | In Progress | High | Publishing / Social | Automatically publish image-backed, platform-specific article posts to Facebook and Instagram after controlled article publication, with a Sanity skip override. | No production-verified Meta/Make delivery scenario exists. | #100, #101, #131 | Application data contract and event foundation merged; delivery not verified | Pending Meta configuration, controlled posts, idempotency, partial success, retries and failure-path verification | — |
| MEDIA-005 | Open | High | Media / Rights | Add rights dashboard fields and publication gates for photography and reusable editorial assets. | Rights metadata exists but is not yet presented as a consolidated operational dashboard. | — | Not implemented | Pending Sanity Studio and controlled publication-gate verification | — |
| MEDIA-006 | Open | High | Media / Intelligence | Add AI-assisted metadata, quality scoring, duplicate detection and article-image suggestions for uploaded photos. | Media processing is currently manual. | — | Not implemented | Pending representative upload batch and editorial suggestion verification | — |
| BRAND-005 | Open | High | Brand Assets / Frontend | Upload approved team and competition logos into Sanity, link them to entities and expose only approved Sanity-hosted assets. | Candidate records exist, but public frontend use is not implemented. | — | Not implemented | Pending rights review and no-hotlink production verification | — |
| LAUNCH-001 | In Progress | Critical | Go Live / Editorial | Publish one introduction article plus at least eight reviewed, image-backed articles covering recent internationals and all four Irish provinces. | The public site still lacks the additional launch-quality article package. | — | Introduction article is live; remaining package incomplete | Introduction/homepage lead observed in production; additional eight articles and route checks pending | — |
| AUTO-001 | Closed | Critical | Editorial Automation / Delivery | Deliver one five-article Morning Editorial Package from the protected production endpoint through Make to `editor@therugbypanda.ie` with persistent deduplication and working Sanity review links. | The application package foundation existed, but Make delivery, persistent package deduplication, production webhook configuration and end-to-end verification were incomplete; the package review URL also used an obsolete Sanity intent format. | #131, #153 | Make scenario `AUTO-001 – Morning Editorial Package` active; rotated production webhook configured; PR #153 merged and production redeployed | Controlled five-article send passed; duplicate replay blocked with 0 second emails/writes; real production endpoint returned HTTP 200 with 5 articles; email received; direct Sanity link opened the exact draft | 2026-08-17 |
| AUTO-002 | In Progress | Critical | Editorial Automation | Generate a genuinely new replacement article after rejection without reusing the rejected angle or source set. | Persistent orchestrator must supply and run the replacement candidate. | #50, #54 | Replacement endpoint foundation merged | Pending orchestrated rejection/replacement test | — |
| AUTO-003 | In Progress | Critical | Scheduling / Orchestration | Prepare five eligible, editorially distinct review-ready articles and one consolidated editorial email by 08:00 Europe/Dublin daily. | AUTO-001 delivery is verified, but persistent overnight acquisition/generation, production eligibility controls, scheduled invocation and repeated on-time operation are not complete. | #47–#54, #131, #153 foundation | AUTO-001 receiver is production verified; scheduling/generation remain incomplete | Pending AUTO-004 completion, 07:50–07:55 trigger, retries and three consecutive on-time runs | — |
| AUTO-004 | In Progress | Critical | Editorial Automation / Quality | Exclude controlled-QA/test drafts from production morning packages and enforce topic/source/angle diversity across the five daily stories. | The original daily-package query treated broad draft workflow status as sufficient eligibility, while the first real five-story batch exposed weak article specificity and morning notification behaviour that still require refinement. | #156, #170, #172, #173, #174 | Five current production drafts were successfully created after taxonomy/authentication fixes; quality and notification refinements are in PR #174 | User confirmed the five-story import worked. Pending verification that regenerated stories are concrete and one consolidated package email replaces five per-draft emails. | — |
| EDIT-001 | In Progress | Critical | Editorial Generation / Quality | Make generated preview and build-up stories concrete, player-aware and supporter-focused rather than generic or process-oriented. | The first source batch contained thin fixture-led context and the Editorial Brain explicitly asked for sourcing boundaries, confirmation status and speculation framing, encouraging generic/meta copy. | #174 | Preview READY; not yet merged to production | Pending representative regeneration proving named people/new signings/what-to-watch detail when supported and no reader-facing sourcing/process explanations | — |
| NOTIFY-004 | In Progress | High | Editorial Notifications | Deliver one morning package email for the five daily articles rather than five individual draft emails plus the package email. | The batch importer used the default NOTIFY-001 behaviour for every draft even though AUTO-001 is the intended consolidated morning notification. | #174 | Preview READY; not yet merged to production | Pending controlled morning batch proving individual draft notifications are suppressed while ad-hoc NOTIFY-001 remains intact | — |
| CMS-004 | In Progress | High | CMS / Editorial Review | Allow the editor to change the full article body directly inside Editorial Review. | The Draft Editor exposed headline/standfirst/SEO fields but rendered the body as a read-only Portable Text preview and required navigation to the full Sanity document editor. | #174 | Preview READY; not yet merged to production | Pending authenticated Sanity Studio verification of body edits, heading preservation and save/reload behaviour | — |
| NOTIFY-001 | Closed | High | Editorial Notifications | Email `editor@therugbypanda.ie` when a new editorial draft is created. | The initial webhook foundation lacked production mapping, persistent deduplication and a valid Sanity intent link. A hidden 50-second OpenAI timeout clamp also blocked controlled QA generation. | #82, #85, #89, #142, #143, #144, #145 | Application fixes merged and deployed; Make scenario `NOTIFY-001 – New Draft Notification` configured | Correctly populated email delivered; Sanity link opened the intended draft; persistent `eventId` record written; duplicate replay blocked and sent no second email | 2026-07-30 |
| NOTIFY-002 | Closed | High | Technical Alerts | Email `admin@therugbypanda.ie` for workflow failures and technical alerts. | The application technical-alert webhook existed, but no persistent Make failure route and production end-to-end verification had been completed. | Application technical-alert foundation; #150, #151, #152 | Make scenario `NOTIFY-002 - Technical Alerts` configured with persistent deduplication; production webhook environment variable deployed; temporary verifier removed in #152 | Make send and duplicate replay verified; real production daily-package failure returned `responseStatus: 410` and `technicalAlertStatus: sent`; alert email received at `admin@therugbypanda.ie` | 2026-08-17 |
| NOTIFY-003 | Closed | High | Technical Alerts / Deduplication | Distinguish materially different technical failures on the same day while deduplicating exact retries, and avoid claiming an email was sent merely because Make accepted the webhook. | The application used one daily key `daily-package-failure:YYYY-MM-DD` for every failure type and interpreted any Make 2xx response as email delivery. | #159 | Merged as `f07383c5e15c74f5b537f73de787d75a25942b96`; Vercel production READY | First production `insufficient-production-eligible-diverse-content` failure delivered one email; exact replay returned 409/`technicalAlertStatus: accepted` and produced no second email; temporary verifier removed from unmerged test branch | 2026-08-17 |
| WEB-006 | Pending Verification | High | Frontend / Contact | Add public contact using `mailto:hello@therugbypanda.ie`. | Public mailbox existed but was not linked from the website. | Pending provenance reconciliation | Contact link is visible in current production; historical feature branch remains | Production link observed; explicit desktop/mobile interaction and branch provenance cleanup pending | — |
| ACCRED-001 | Implemented | Critical | Analytics / Accreditation | Build durable evidence of publishing cadence, traffic, engagement and search visibility. | Analytics and evidence-pack architecture was not implemented. | #76, pending dashboard provenance reconciliation | Consent-aware GA4/GTM loader merged; Sanity Newsroom Dashboard implementation exists | Pending production/Studio/provider-ID event verification | — |
| SEC-001 | Open | Critical | Security / Resilience | Establish and verify security, backup and recovery across GitHub, Sanity, Vercel, Cloudflare, Make.com and Apify. | Security baseline and tested restore procedures are incomplete. | — | Not implemented | Pending access review, backups, restore test and credential rotation | — |
| CMS-002 | In Progress | Critical | CMS / Visual Content | Assign approved Editorial Images to existing and launch articles. | Existing articles and launch content still need controlled assignments. | #49 | Assignment contract deployed | Pending Studio and production card/article checks | — |
| CMS-003 | Closed | Critical | CMS / Recovery | Restore the accidentally deleted published launch introduction under its canonical Sanity ID and slug. | The previously published `Welcome to The Rugby Panda` document was accidentally deleted in Sanity. | #163, #164 | Recovery tooling merged; canonical Sanity document restored; production remained healthy | `/articles/welcome-to-the-rugby-panda` returned HTTP 200; homepage lead and News archive display the restored article; temporary Preview recovery endpoint removed | 2026-08-17 |
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

## Reconciled production baseline — 18 August 2026

- Production is healthy on Vercel and the reader site remains live.
- PR #173 is merged as `543ef99f66594a94ecc7ddea39c04fab2536ba6c`; the corresponding Vercel production deployment is READY.
- The controlled AUTO-004 import successfully created five current production drafts after the editorial automation secret and Sanity taxonomy issues were corrected.
- The first real run exposed three follow-up defects: five per-draft emails before the consolidated package, generic/process-oriented generated copy, and no direct article-body editing inside Editorial Review.
- PR #174 contains the current remediation and its latest Vercel Preview is READY.
- AUTO-004 remains In Progress until those refinements are merged, deployed and production verified against a representative regenerated package.
- Make.com Core is active; the current ChatGPT Make connector supports health checking but not scenario editing or invocation.
- NOTIFY-001, NOTIFY-002, NOTIFY-003 and AUTO-001 delivery remain production verified.

## AUTO-001 verified baseline

`AUTO-001 – Morning Editorial Package` is closed as a delivery workflow after end-to-end production verification on 17 August 2026.

```text
Production POST /api/editorial/daily-package
→ editorial.daily_package.ready
→ Make custom webhook
→ Check existence of eventId in Rugby Panda Event Deduplication
→ Filter: New package only / Exists = false
→ Send one consolidated five-article HTML email to editor@therugbypanda.ie
→ Add/replace successful package record
```

The controlled Make run succeeded, duplicate replay was blocked with no second email or success write, the production endpoint returned HTTP 200 with five articles, the email arrived, and a real review link opened the exact corresponding Sanity draft. PR #153 corrected generated package links to the verified intent-route format.

The five real packaged records were historical controlled-QA drafts and all covered Law 8 scoring. AUTO-004 now prevents those records from qualifying for production packages.

## AUTO-004 verified guard baseline

PR #156 added explicit `automationContentClass` and `morningPackageEligible` metadata to generated drafts. QA-mode drafts are ineligible; normal production drafts are eligible. The daily-package query now requires `automationContentClass == "production"` and `morningPackageEligible == true`, and applies source/topic/angle diversity filtering before selecting five stories.

Production verification after deployment returned HTTP 409 with `articleCount: 0`, `eligibleCandidateCount: 0`, and reason `insufficient-production-eligible-diverse-content`, proving the historical controlled-QA Law 8 drafts no longer enter the morning package.

PRs #170, #172 and #173 established the reusable acquisition import path, controlled GitHub execution and correct Sanity taxonomy mapping. The first five-story production import succeeded. PR #174 now addresses the editorial-quality, notification and in-workspace editing defects exposed by that real run.

## NOTIFY-001 verified baseline

`NOTIFY-001 – New Draft Notification` is closed after production verification on 30 July 2026.

```text
Custom webhook
→ Check existence of eventId in Rugby Panda Event Deduplication
→ Filter: New event only / Exists = false
→ Send email to editor@therugbypanda.ie
→ Add/replace the successful event record
```

The event is `editorial.article.draft_created`. Duplicate replay was explicitly verified and sends no second email. Morning acquisition batches are a separate operational mode and, once PR #174 is verified, should suppress these individual notifications in favour of the single AUTO-001 package email.

## NOTIFY-002 / NOTIFY-003 verified baseline

`NOTIFY-002 - Technical Alerts` remains the Make delivery scenario for technical failures. NOTIFY-003 corrected the application-side failure key so materially different failures on the same day can be alerted separately while exact retries are deduplicated.
