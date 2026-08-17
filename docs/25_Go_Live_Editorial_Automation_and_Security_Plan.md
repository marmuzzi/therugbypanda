# Go-Live, Editorial Automation and Security Plan

## Status

Originally approved on 23 July 2026. Reconciled on 17 August 2026.

This document remains the strategic go-live and security plan. For current implementation status use `docs/07_Project_State.md` and `docs/08_Issue_Log.md`. Where this plan conflicts with later approved automation contracts, the later contract wins.

## Business priority

Take The Rugby Panda live as a credible rugby publication with complete, image-backed, human-reviewed content while completing reliable daily editorial automation.

## Go-live content package

The minimum launch package remains:

1. one introduction article explaining The Rugby Panda, its editorial purpose and independent newsroom identity;
2. at least eight additional publication-ready articles;
3. recent international rugby plus Leinster, Munster, Ulster and Connacht coverage;
4. accurate publication dates;
5. a reviewed and approved Editorial Image with complete publication metadata for every launch article;
6. human editorial approval before publication.

The introduction article is now live. The remaining launch package is not complete until the additional articles, images, homepage cards, news/category pages and article pages are verified in production.

## Daily editorial target — superseded value corrected

The approved operating target is **five** review-ready article drafts per day, not eight.

All five drafts plus one consolidated editorial email must be available by **08:00 Europe/Dublin**. The package should favour relevant current stories, meaningful analysis, previews, reviews and evergreen features over filler.

The application-side daily-package foundation is deployed. Persistent overnight acquisition/generation, Make package delivery, failure routing, scheduling and repeated on-time verification remain incomplete.

## Current editorial lifecycle

```text
Source discovery
→ source validation
→ article candidate
→ Editorial Brain classification and scoring
→ source-linked fact ledger
→ generated original Sanity draft
→ human review / edit
→ controlled publish / discard
```

There is no separate `ready for review` approval gate. Sanity is the mandatory human approval boundary.

Rules:

- Generated articles are drafts, never automatically published.
- The editor can amend, approve or reject each article.
- Approved articles are published only through the controlled workflow.
- Rejected articles retain reason and audit history.
- Replacement generation must use a genuinely different angle/source set.
- Every article retains source references and internal generation/review audit history.
- Public pages must not disclose AI implementation details.

## Current automation architecture

```text
GitHub source of truth
→ Make.com orchestration
→ Apify source acquisition
→ Editorial Brain and OpenAI generation
→ Sanity draft, review and publishing state
→ Vercel production website
→ Meta distribution after controlled publication
```

GitHub retains versioned business logic, prompts, schemas, tests, workflow definitions and documentation. Make.com provides scheduling, retries, state coordination and operational notifications. Apify collects approved-scope source material. Sanity is the human review/publication boundary. Vercel serves the public site.

## Morning package completion contract

AUTO-001/AUTO-003 are complete only after:

1. five eligible drafts are packaged;
2. one consolidated email reaches `editor@therugbypanda.ie`;
3. package `eventId` is persistently deduplicated;
4. duplicate replay sends no second email;
5. technical failure reaches `admin@therugbypanda.ie`;
6. the daily trigger runs around 07:50–07:55 Europe/Dublin;
7. five review-ready drafts are delivered before 08:00 on three consecutive days.

## Accreditation and analytics

Analytics remains a core platform capability for accreditation and sponsorship evidence. Track durable publication timestamps, publishing cadence, editorial audit history, GA4 users/sessions/views/engagement, returning readership, article performance, traffic sources and Search Console clicks/impressions/rankings under `ACCRED-001`.

## Mobile photo ingestion

A phone-friendly upload path remains required for original Rugby Panda photography. Prefer authenticated direct upload to Sanity Assets, automatic `editorialImage` draft creation, metadata assistance and human review before public use. GitHub stores code and metadata contracts, not the primary binary photo archive.

## Security and resilience requirements

### GitHub

- MFA for administrators.
- Branch protection on `main`.
- Pull-request review and successful checks where supported.
- Least-privilege Actions permissions.
- Dependency/security alerts and secret scanning.
- Repository backup or mirror outside the primary account.
- Protected production milestones.

### Sanity

- Least-privilege roles and tokens.
- Separate read-only and write-capable tokens.
- No write token exposed to the browser.
- Dataset export backups on a documented schedule.
- Controlled deletion/mutation workflows.
- Audit trail for automated writes and editorial decisions.

### Vercel

- MFA and least-privilege team access.
- Protected environment variables.
- Appropriate preview protection.
- Production domain/DNS ownership checks.
- Documented and tested rollback procedure.

### Cloudflare and domains

- MFA, registrar lock and transfer protection.
- DNSSEC where supported.
- Restricted API tokens.
- Recoverable DNS configuration.

### Make.com and Apify

- Secrets only in service credential stores.
- Least-privilege service accounts/tokens.
- Scenario/actor input validation.
- Spending and run limits.
- Failure notifications.
- No automatic publishing or destructive CMS operation without reviewed state.

### Recovery

Document and test GitHub restoration, Sanity dataset restoration, Vercel redeployment from a known-good commit, DNS/domain recovery and credential rotation. A backup is not reliable until restoration succeeds.

## Reconciled delivery order

1. Keep project documentation and Issue Log reconciled with production.
2. Complete NOTIFY-002 technical failure routing.
3. Complete AUTO-001/AUTO-003 morning package and three-day verification.
4. Complete the remaining launch-content package and production checks.
5. Complete rejection/replacement orchestration.
6. Complete analytics/accreditation evidence verification.
7. Complete security/recovery baseline.
8. Implement mobile original-photo ingestion.
9. Complete SOCIAL-001 only after editorial automation is stable.

## Completion rule

No capability is complete merely because code exists. Track implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity Studio verified, Make verified and Meta verified separately.
