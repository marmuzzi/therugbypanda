# Go-Live, Editorial Automation and Security Plan

## Status

Approved project direction recorded on 23 July 2026.

## Business priority

The immediate project priority is to take The Rugby Panda live as a credible rugby publication with enough complete, image-backed content to feel established from day one.

## Go-live content package

The minimum launch package is:

1. One introduction article explaining what The Rugby Panda is, its editorial purpose, the coverage readers can expect, and its independent newsroom identity.
2. At least eight additional publication-ready articles.
3. The launch package must include recent international rugby coverage and coverage relevant to Leinster, Munster, Ulster and Connacht.
4. Articles may be accurately backdated to the date or immediate aftermath of the event being covered.
5. Every article must include a reviewed and approved Editorial Image with complete publication metadata.
6. No launch article may be published without editorial approval.

The launch package is not complete until the articles, images, homepage cards, category pages and article pages have been verified in production.

## Daily editorial target

After go-live, the operating target is eight review-ready articles per day across the approved website sections.

All eight drafts must be available for editorial review by 08:00 Europe/Dublin every day.

The daily mix must cover the active editorial sections without forcing low-quality stories where there is no credible news. The workflow should favour relevant current stories, meaningful analysis, previews, reviews and evergreen features over filler.

## Editorial lifecycle

The required lifecycle is:

```text
Source discovery
→ source validation
→ article candidate
→ generated draft
→ factual and rights checks
→ image suggestion or assignment
→ editor review queue
→ approve / amend / reject
→ publish / discard
```

Rules:

- Generated articles are drafts, never automatically published.
- The editor can amend, approve or reject each article.
- Approved articles are scheduled or published through the CMS.
- Rejected articles are archived with the rejection reason.
- A rejected daily article must trigger a replacement candidate so the review queue returns to the daily target of eight.
- Replacement generation must not repeatedly regenerate the same rejected angle or source set.
- Every article must retain its source references and generation/review audit trail internally.
- Public pages must not disclose AI implementation details.

## Automation architecture

The target orchestration remains:

```text
GitHub source of truth
→ Make.com orchestration
→ Apify source acquisition
→ Sanity draft, review and publishing state
→ Vercel production website
```

GitHub retains versioned business logic, prompts, schemas, tests, workflow definitions and documentation. Make.com provides daily scheduling, retries, state coordination and operational notifications. Apify collects approved-scope source material. Sanity is the human review and publication boundary. Vercel serves the public site.

The 08:00 review deadline requires the generation workflow to begin early enough to complete discovery, validation, drafting, image assignment and quality checks before the deadline. The exact production schedule must be documented when the orchestration scenario is implemented.

## Mobile photo ingestion

A phone-friendly upload path is required for original Rugby Panda photography.

Preferred design:

1. An authenticated mobile upload page or Sanity Studio mobile workflow.
2. Direct upload to Sanity Assets rather than committing binary images to GitHub.
3. Automatic creation of an `editorialImage` draft record.
4. Capture or suggest title, caption, alt text, event, venue, teams, tags, orientation and rights metadata.
5. Default original-photo attribution:
   - `Photo: The Rugby Panda`
   - `© The Rugby Panda`
6. The uploaded record enters a review queue before public use.

GitHub should store code and metadata contracts, not act as the primary binary photo library.

## Security and resilience requirements

The project must be protected against unauthorised access, destructive changes, credential theft and accidental deletion.

Required controls include:

### GitHub

- Private or appropriately restricted repositories where business logic or operational data should not be public.
- Mandatory multi-factor authentication for repository administrators.
- Branch protection on `main`.
- Pull-request review and successful checks before merge where supported.
- Restricted GitHub Actions permissions using least privilege.
- Dependabot or equivalent dependency and security alerts.
- Secret scanning and prevention of secrets in commits.
- Regular repository backups or mirrors outside the primary account.
- Protected tags/releases for production milestones.

### Sanity

- Least-privilege roles and tokens.
- Separate read-only and write-capable tokens.
- No write token exposed to the browser.
- Dataset export backups on a documented schedule.
- Controlled deletion and mutation workflows.
- Audit trail for automated writes and editorial decisions.

### Vercel

- Multi-factor authentication.
- Least-privilege team access.
- Protected environment variables.
- Deployment protection for previews where appropriate.
- Production domain and DNS ownership checks.
- Rollback procedure documented and tested.

### Cloudflare and domains

- Multi-factor authentication.
- Registrar lock and domain-transfer protection.
- DNSSEC where supported and correctly configured.
- Restricted API tokens.
- Exported DNS configuration or equivalent recovery documentation.

### Make.com and Apify

- Secrets stored only in service credential stores.
- Least-privilege service accounts and tokens.
- Scenario/actor input validation.
- Spending and run limits.
- Failure notifications.
- No automatic publishing or destructive CMS operation without an explicit reviewed state.

### Recovery

The project requires a documented recovery plan covering:

- GitHub repository restoration.
- Sanity dataset restoration.
- Vercel redeployment from a known-good commit.
- DNS and domain recovery.
- Credential rotation.
- Recovery verification exercises.

Security work must distinguish prevention, backup, restoration and verified recovery. A backup is not considered reliable until a restoration test succeeds.

## Delivery order

1. Complete `CMS-002` and establish the article-image reference contract.
2. Build and publish the nine-article minimum launch package.
3. Verify all launch content and imagery in production.
4. Complete the security and recovery baseline.
5. Implement the article generation and editorial review workflow.
6. Implement rejection-triggered replacement generation.
7. Implement the daily eight-article queue ready by 08:00 Europe/Dublin.
8. Implement mobile original-photo ingestion.
9. Introduce Make.com scheduling and operational notifications.

## Completion rule

None of these capabilities is complete merely because code exists. Each must be tracked separately as implemented, committed, merged, deployed, verified in production and, where applicable, verified in authenticated Sanity Studio.