# Project State

## Current Version

v0.2 — Newsroom Foundation

## Last Updated

3 July 2026

## Completed

- The Rugby Panda brand created
- Mission defined
- Domain live: https://therugbypanda.ie
- Cloudflare DNS working
- Vercel deployment working
- Landing page live
- Instagram profile created: https://www.instagram.com/rugbypandamedia
- Facebook page created: https://www.facebook.com/profile.php?id=61591161347126
- Favicon asset created, but live browser favicon still needs follow-up
- Approved panda logo in use for the masthead and article signature
- `components/BrandLockup.tsx` created
- `components/HeaderNav.tsx` created
- `components/SearchButton.tsx` created
- `components/SiteHeader.tsx` created and composed from brand/navigation components
- Masthead rebuilt as a publication-style brand lockup
- Masthead has had one desktop proportion polish pass, but desktop title still feels too large and needs another refinement
- Mobile navigation simplified to News, Provinces, Ireland, URC, Europe and Search
- Desktop navigation includes About
- Header social links limited to Instagram and Facebook
- X/Twitter removed from the site UI
- `app/search/page.tsx` created as a search placeholder
- `components/SiteFooter.tsx` created
- `app/about/page.tsx` created
- `app/categories/provinces/page.tsx` created
- `app/articles/[slug]/page.tsx` route created
- `components/ArticleHeader.tsx` created and polished
- `components/KeyPoints.tsx` created
- `components/ArticleBody.tsx` created
- `components/ContinueReading.tsx` created
- `components/TagList.tsx` created
- `components/ReaderSupport.tsx` created
- `components/ArticleCard.tsx` created
- Article cards now support temporary image URLs
- `lib/articles.ts` expanded with richer sample editorial data and temporary stock/placeholder imagery
- Full sample article page template built
- Homepage converted from landing page to editorial newsroom-style homepage
- Homepage now includes lead story, editor note, latest stories, province coverage, analysis, reader support and sections grid
- Bottom homepage section grid now matches top-level nav: News, Provinces, Ireland, URC, Europe
- Article byline now uses panda logo signature
- Sanity project prepared externally with project ID `hvg4b508` and dataset `production`
- Vercel environment variables configured for Sanity project access

## Current GitHub structure

```text
app/
  page.tsx
  layout.tsx
  about/
    page.tsx
  search/
    page.tsx
  categories/
    provinces/
      page.tsx
  articles/
    [slug]/
      page.tsx

components/
  ArticleBody.tsx
  ArticleCard.tsx
  ArticleHeader.tsx
  BrandLockup.tsx
  ContinueReading.tsx
  HeaderNav.tsx
  KeyPoints.tsx
  ReaderSupport.tsx
  SearchButton.tsx
  SiteFooter.tsx
  SiteHeader.tsx
  TagList.tsx

lib/
  articles.ts

public/
  landing-bg.png
  rugby-panda-logo.png
  favicon.png

branding/
  rugby-panda-logo.png
```

## Current article URL

```text
https://therugbypanda.ie/articles/leinster-season-preview-2026
```

## Current task

Prepare next chat handoff. The live site looks good on mobile and has temporary imagery on the homepage cards, but desktop branding still needs refinement.

## Immediate next tasks

Before starting CMS work, complete this short visual/brand polish pass:

1. Fix the live favicon properly. The browser tab still shows the generic Vercel/placeholder icon even on a first-time desktop load.
2. Further reduce and rebalance the desktop masthead title. The wordmark is still too large compared with the panda logo and takes too much vertical space.
3. Keep current navigation structure unchanged.
4. After brand polish, begin Sprint 3 — CMS and Publishing Platform.

## Sprint 3 — CMS and Publishing Platform

1. Add Sanity dependencies and configuration
2. Create Sanity Studio route or studio workspace
3. Create schemas for articles, authors, categories, provinces, competitions, tags and images
4. Add SEO fields and image metadata fields
5. Connect Next.js pages to Sanity queries
6. Replace temporary `lib/articles.ts` sample data with CMS content
7. Create seed content or migration script
8. Prepare dynamic category/article routes from CMS data
9. Build image management with featured image, caption, photographer, rights/source and alt text

## Known issues

- Browser favicon is still not working correctly after metadata update
- Desktop masthead title is still too large and needs another design pass
- Dynamic category route not built yet
- Search is a placeholder and not connected to an index yet
- CMS schema and Studio not yet committed
- Sponsorship slots not implemented yet
- Newsletter sign-up not implemented yet
- The `.com` redirect may still need final confirmation
- Article and homepage images currently use temporary stock/placeholder URLs and need a CMS-backed image pipeline

## Working principles

- Project documentation is the source of truth at the start of each session.
- Full file replacements are preferred over partial snippets.
- Build incrementally, but merge completed milestones into `main`.
- Keep `main` deployable.
- Use reusable components only.
- Mobile-first design.
- Reader-first advertising.
- No public AI references.
- Update project documentation as development progresses.
