# Version 1 Product Roadmap

## Purpose

Approved product direction for turning The Rugby Panda from a functioning website into a scalable digital rugby newsroom. Reconciled with production on 17 August 2026.

## Phase 1 — Launch experience

### Branding

- Maintain a strong Panda icon with a balanced wordmark lockup.
- Keep proportional behaviour usable on desktop, tablet and mobile.
- Treat production verification, not implementation alone, as completion.

### Navigation — current approved contract

The top-level reader navigation is:

- News
- Provinces
- URC
- International
- About

`/news` is the canonical reverse-chronological archive. News points to `/news`, not `/`. About remains available in the primary reader navigation and footer/contact experience. Mobile uses an accessible hamburger menu and Search remains available.

Earlier roadmap language proposing Europe and Opinion as top-level sections is superseded. Ireland remains article/editorial metadata rather than a separate reader section. Opinion, analysis, column and notebook are formats. Europe is covered within International unless later product evidence justifies a dedicated destination.

### Article experience

- Preserve featured-image consistency between homepage, cards and article pages.
- Display featured imagery directly beneath the article heading area where appropriate.
- Use Panda branding only when an article explicitly opts into editorial branding.
- Avoid repetitive promotional branding beneath every article.

## Phase 2 — Editorial automation completion

Before scaling social distribution, complete the five-article morning package:

- five review-ready drafts;
- one consolidated email to `editor@therugbypanda.ie` by 08:00 Europe/Dublin;
- persistent package `eventId` deduplication;
- technical failure routing to `admin@therugbypanda.ie`;
- daily scheduling around 07:50–07:55;
- three consecutive successful on-time deliveries.

Sanity remains the mandatory human approval boundary.

## Phase 3 — Social distribution

After a controlled article publication, generate platform-specific social snippets.

### Facebook

- headline;
- concise teaser;
- featured image or approved branded image;
- direct article link;
- relevant team and competition references.

### Instagram

- approved square or portrait creative;
- concise visual-first caption;
- relevant hashtags;
- link strategy supported by the connected Meta account.

### Controls

- Use official Meta publishing APIs.
- Respect the article-level `Do not publish to social` control.
- Publish socially only after controlled website publication.
- Social failure must not roll back successful website publication.
- Store post IDs, timestamps, status and failure information for audit/retry.
- Require an approved image; never fall back to text-only article distribution.

## Phase 4 — Rugby Panda Media Desk

Create a secure phone-first upload flow supporting taking/selecting multiple photos, event/team/competition selection, optional notes and direct controlled-media ingestion.

Use Sanity Assets for article-ready media. If archive scale requires it, use a dedicated object store for high-resolution originals rather than GitHub.

Every uploaded image should be eligible for web optimisation, orientation detection, quality/blur scoring, duplicate detection, suggested caption/alt text, team/competition/venue/event tagging, hero-image scoring and suggested crops. AI output is advisory; rights and publication approval remain human decisions.

## Phase 5 — Rights dashboard

Every reusable image should record source classification, creator, source/landing URLs, licence, attribution, permitted uses, permission proof/notes, expiry where relevant, acquisition date and lifecycle/rights-review status.

Publication must be blocked for third-party images whose rights status is unknown, restricted or pending.

Original Rugby Panda photos use:

- `Photo: The Rugby Panda`
- `© The Rugby Panda`

## Phase 6 — Brand assets

Brand Assets remain separate from Editorial Images.

- Continue approved-scope candidate collection where needed.
- Candidate URLs are review references only.
- Public frontend use is limited to manually approved Sanity-hosted assets.
- Record rights holder, source, usage notes and editorial/trademark status.
- Do not imply endorsement, partnership or sponsorship.
- Provide a rapid removal path for disputed assets.

## Phase 7 — Editorial intelligence

When editing an article, surface best matching approved photos, related articles, relevant teams/competitions, fixtures/results/standings when available, internal-link opportunities, missing metadata and SEO/structured-data suggestions.

## Phase 8 — Rugby data platform

Use a decoupled data path:

```text
Sports data provider
→ Make.com
→ Sanity
→ Next.js website
```

Planned entities include fixtures, results, standings, team pages and competition pages. Core rendering must not depend on fragile live third-party calls.

## Phase 9 — Accreditation mode

Long-term match-day workflow:

1. attend a match;
2. upload photos from the phone;
3. automatically organise media candidates;
4. draft/update the match report;
5. suggest the best approved image;
6. prepare social snippets;
7. leave editorial publication decisions with the human editor.

## Delivery order

1. Finish current launch-content package and production verification.
2. Complete NOTIFY-002 and the five-article morning automation.
3. Complete three-day morning-package verification.
4. Complete Meta integration and controlled social test posts.
5. Build mobile Media Desk upload.
6. Build rights dashboard/publication gates.
7. Add AI media processing and image suggestions.
8. Integrate approved brand assets into the frontend.
9. Add rugby data and broader editorial intelligence.

## Completion rule

Always report separately: implemented, committed, PR opened, merged, deployed, verified in production, verified in authenticated Sanity Studio, verified in Make.com, verified in Meta and documentation updated.
