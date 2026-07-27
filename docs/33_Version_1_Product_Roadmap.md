# Version 1 Product Roadmap

## Purpose

This document records the approved product direction for turning The Rugby Panda from a functioning website into a scalable digital rugby newsroom.

## Phase 1 — Launch experience

### Branding

- Increase the Panda icon.
- Reduce the Rugby Panda wordmark.
- Tighten spacing between the icon and wordmark.
- Verify proportional behaviour on desktop, tablet and mobile.

### Navigation

- Create `/news` as the canonical archive of all published articles in reverse chronological order.
- Make the News navigation item point to `/news`, not `/`.
- Keep About in both the header and footer.
- Add Europe and Opinion as visible top-level navigation destinations.
- Preserve the existing International taxonomy contract until an explicit content migration is approved.
- Replace horizontal mobile overflow with an accessible hamburger menu.
- Keep Search available in the mobile menu and desktop navigation.

### Article experience

- Preserve featured-image consistency between homepage, cards and article pages.
- Display featured imagery directly beneath the article heading area.
- Use Panda branding only when the article explicitly opts into editorial branding.
- Avoid repetitive promotional branding beneath every article.

## Phase 2 — Social distribution

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
- Add `Do not publish to social` as an article-level Sanity control.
- Social publishing must happen only after the article is approved and published through the controlled workflow.
- Social failure must not roll back or alter the successful website publication.
- Store post IDs, timestamps, status and failure information for audit and retry.

## Phase 3 — Rugby Panda Media Desk

### Phone-first upload

Create a secure, mobile-friendly upload flow that supports:

- taking photos or selecting multiple photos;
- choosing an event, team or competition;
- adding optional notes;
- uploading directly into the controlled media workflow.

Original files should not be stored in the Git repository. Use Sanity Assets for article-ready media and, if archive scale requires it, a dedicated object store for high-resolution originals.

### Processing

Every uploaded image should be eligible for:

- web-optimised derivatives;
- orientation detection;
- quality scoring;
- blur detection;
- duplicate and near-duplicate detection;
- suggested caption;
- SEO alt text;
- team, competition, venue and event tagging;
- hero-image scoring;
- suggested crops for article, homepage, mobile and social use.

AI output is advisory. Rights and publication approval remain human decisions.

## Phase 4 — Rights dashboard

Every reusable image should record:

- source classification;
- creator or photographer;
- source and landing-page URLs;
- licence and licence URL;
- required attribution;
- permitted uses;
- proof or notes supporting permission;
- expiry date when relevant;
- download or upload date;
- lifecycle and rights-review status.

Publication must be blocked for third-party images whose rights status is unknown, restricted or pending.

Original Rugby Panda photos should use public attribution:

- `Photo: The Rugby Panda`
- `© The Rugby Panda`

## Phase 5 — Brand assets

The Brand Assets Library remains separate from Editorial Images.

- Continue collecting rugby-union team, union and competition logos as candidates.
- Candidate URLs are review references only.
- Public frontend use is limited to manually approved assets uploaded into Sanity.
- Record rights holder, source, usage notes and editorial/trademark status.
- Do not imply endorsement, partnership or sponsorship.
- Provide a rapid removal path for any disputed asset.

## Phase 6 — Editorial intelligence

When editing an article, surface:

- best matching approved photos;
- related articles;
- relevant teams and competitions;
- fixtures, results and standings when available;
- internal-link opportunities;
- missing metadata;
- SEO and structured-data suggestions.

## Phase 7 — Rugby data platform

Use the decoupled data path:

```text
Sports data provider
→ Make.com
→ Sanity
→ Next.js website
```

Planned entities:

- fixtures;
- results;
- standings;
- team pages;
- competition pages.

The website must not depend on fragile live third-party calls for core rendering.

## Phase 8 — Accreditation mode

Long-term match-day workflow:

1. Attend a match.
2. Upload photos from the phone.
3. Automatically organise and prepare media candidates.
4. Draft or update the match report.
5. Suggest the best approved image.
6. Prepare social snippets.
7. Leave everything waiting for human editorial approval.

## Rights policy summary

### Photography

Use only:

- Rugby Panda originals;
- contributor photos with documented permission;
- official media images whose terms permit the intended editorial use;
- public-domain material;
- open-licence images whose exact terms permit the intended use;
- genuinely free stock or archive images with recorded terms.

Do not use Getty, paid agency imagery or unlicensed photography. Credit is not a substitute for permission.

### Logos

Collect broadly within the approved rugby-union scope, but public use requires manual review, recorded source and rights information, approval for editorial use and a Sanity-hosted asset. Candidate-logo URLs must never be hotlinked in public templates.

## Delivery order

1. Version 1 branding and navigation.
2. Dedicated News archive.
3. Mobile menu and production verification.
4. Social publishing schema and event contract.
5. Meta integration and controlled test posts.
6. Mobile Media Desk upload.
7. Rights dashboard and publication gates.
8. AI media processing and article-image suggestions.
9. Approved brand-asset frontend integration.
10. Rugby data and editorial intelligence.

## Completion rule

Always report separately:

- implemented;
- committed;
- merged;
- deployed;
- verified in production;
- verified in authenticated Sanity Studio;
- documentation updated.
