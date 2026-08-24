# Issue Log

This is the living issue log for The Rugby Panda. An issue is not closed until its relevant production/CMS/orchestration/provider verification has passed. Historical closed issues before this reconciliation remain preserved in Git history; this file now focuses on the active launch boundary and recently resolved launch-critical issues.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Active / recently resolved issues — reconciled 24 August 2026

| ID | Status | Priority | Area | Summary | Root cause | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DOC-003 | In Progress | High | Documentation | Reconcile core source-of-truth docs through Monday go-live state. | Core docs stopped at 20 Aug while #195-#230 changed production state. | docs reconciliation PR pending | Branch committed | Merge/repository verification pending | — |
| MEDIA-007 | In Progress | Critical | Media | Reach >=200 publication-ready diverse local Editorial Images. | Original 22-image pool and broad Openverse acquisition were insufficient. | #201-#228 | Acquisition/triage/import/reconciliation pipelines merged; #228 retrigger merged | Last certified strict audit 186 ready / 196 approved local / zero duplicate asset groups; post-#228 audit pending | — |
| MEDIA-008 | Closed | Critical | Media / Assignment | Require positive subject evidence and fail closed to no image. | Generic rugby/layout terms previously allowed unrelated fallback images. | #192, #230 | Merged/deployed | Representative no-image behaviour production-proven; homepage unrelated fallback also removed | 2026-08-24 |
| BRAND-005 | In Progress | High | Brand Assets | Localize approved team/competition logos safely. | Approved records historically pointed to external candidates. | #212, #214 | Strong approved candidates localization merged | Final local-logo audit / ambiguous records remain | — |
| AUTO-002 | Pending Verification | Critical | Editorial Automation | Rejection must immediately produce a genuinely different replacement. | Application trigger existed only after #202; persistent orchestrator still must consume it. | #202 | Application-side trigger merged/deployed | End-to-end rejection -> different Sanity replacement pending | — |
| AUTO-003 | In Progress | Critical | Scheduling / Orchestration | Five eligible drafts + one consolidated notification before 08:00 daily. | Persistent morning schedule was never implemented. | #131, #153 plus orchestration work pending | AUTO-001 receiver foundations live | Persistent schedule, retries/failure path and repeated daily proof pending | — |
| AUTO-004 | Pending Verification | Critical | Editorial Automation / Quality | Produce a complete five-story Draft Ready/originality-safe package. | Earlier timeout, originality overlap and metadata-length failures blocked 5/5. | #195-#200, #219, #220 | Quality fixes merged/deployed | Hard post-#219 5/5 production result and side-by-side inspection pending | — |
| AUTO-005 | Pending Verification | High | Editorial Resilience | Recover safely from bounded quality/originality failures without weakening gates. | Full regeneration wasted budget for metadata-only failures. | #192, #196, #199, #219 | Merged/deployed | Metadata-only repair path implemented; complete 5/5 proof pending | — |
| EDIT-001 | Pending Verification | Critical | Editorial Quality | Concrete supporter-focused copy without process/meta language. | Earlier prompt/source shape produced formulaic/process-heavy output. | #174, #188, #195-#197, #219 | Merged/deployed | Five-story editorial inspection pending | — |
| EDIT-002 | Pending Verification | Critical | Editorial Synthesis | Multi-source independent evidence and original synthesis. | Earlier packs could be same-source-family or source-shaped. | #176, #183-#196 | Merged/deployed | Complete five-story production synthesis proof pending | — |
| EDIT-003 | Pending Verification | Critical | Originality | Deterministically fail closed on close paraphrase. | Prompt-only safeguards insufficient. | #183, #184, #192, #195, #196, #219 | Merged/deployed | Fail-closed behaviour proven; 5/5 passing package still pending | — |
| EDIT-004 | Pending Verification | Critical | Style | Five stories must differ in voice/structure. | Earlier deterministic mapping clustered styles. | #188, #196 | Merged/deployed | One-of-each package allocation implemented; five-story side-by-side proof pending | — |
| WEB-010 | Pending Verification | High | Frontend / Article Layout | Public article pages need genuinely different editorial presentations. | Previous three variants were slug-hash based and structurally similar. | #229 | Merged; deployment expected/green check previously observed | Representative live desktop/mobile variants pending | — |
| WEB-011 | Pending Verification | High | Frontend / Homepage | Homepage needs editorial hierarchy rather than identical article cards. | Uniform card grid flattened story importance/type. | #230 | Merged; production deployment verification pending | Multi-story live homepage desktop/mobile proof pending | — |
| SOCIAL-001 | In Progress | High | Publishing / Social | Publish controlled snippets to Facebook/Instagram after website publication. | Production Meta delivery/idempotency not yet verified. | #100, #101, #131 | Foundation merged | Meta/idempotency/retry verification pending | — |
| MEDIA-004 | Open | High | Mobile / Media | Secure phone-first image upload. | No verified mobile ingestion path. | — | Not implemented | Pending | — |
| NEWS-001 | Open | High | Editorial Automation | 14:00 major-announcement conditional check. | No verified scheduled conditional extra-story path. | — | Not implemented | Pending | — |
| CMS-004 | Pending Verification | High | CMS / Editorial Review | Edit full article body in Editorial Review. | Body was historically read-only. | #174 | Merged / Studio path exists | Authenticated edit/save/reload proof pending | — |
| CMS-002 | In Progress | Critical | CMS / Visual Content | Correct relevant images on launch/existing articles and remove legacy bad assignments. | Old drafts predate strict #192 relevance guard. | #49, #176, #192, #230 | New guard/fallback fixes merged | Legacy cleanup and representative launch-article audit pending | — |
| LAUNCH-001 | In Progress | Critical | Go Live | Meaningful launch with reviewed content and media. | Content package and remaining automation proofs incomplete. | Multiple | Introduction live; foundations deployed | Need reviewed launch articles plus critical automation/media verification | — |
| SEC-001 | Open | Critical | Security / Resilience | Security, backup and recovery across core platforms. | Baseline/restore procedures incomplete. | — | Not complete | Pending | — |
| ACCRED-001 | Implemented | Critical | Analytics / Accreditation | Build evidence of cadence, traffic, engagement and search visibility. | Provider/evidence verification incomplete. | #76 | Foundation exists | Production/provider verification pending | — |

## Current measured baseline

- Meaningful go-live target: 27 August 2026; core readiness target: 26 August.
- Last certified strict media audit: **186 publication-ready local Editorial Images; 196 approved/published local; zero duplicate Sanity asset groups**. #228 retriggered corrected URC + international waves; a higher number requires post-import audit evidence.
- #219 metadata-only Draft Ready repair is merged/deployed; #220 controlled five-story verification trigger is merged; hard 5/5 production evidence is still required.
- #202 rejection trigger is merged/deployed; persistent orchestrator consumption and a genuinely different replacement draft remain unverified.
- Persistent 08:00 morning schedule remains missing functionality.
- #229 article presentation and #230 homepage hierarchy are merged; representative production visual verification remains.

## Owner-help boundary

Do not require owner help for routine implementation, merges or clear image approvals. Escalate only genuinely ambiguous rights/relevance cases (target <=5%), unavailable external account credentials/authorization, final editorial judgement and final go-live acceptance.
