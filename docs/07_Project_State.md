# Project State

## Current Version

v0.3 — CMS Foundation

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
- Approved panda logo in use for the masthead and article signature
- `app/icon.tsx` and `app/apple-icon.tsx` generated icon routes created for branded browser/app icons
- Root metadata now points to cache-busted generated brand icons
- `components/BrandLockup.tsx` created
- `components/HeaderNav.tsx` created
- `components/SearchButton.tsx` created
- `components/SiteHeader.tsx` created and composed from brand/navigation components
- Masthead rebuilt as a publication-style brand lockup
- Desktop masthead has had a second proportion polish pass: smaller panda mark, reduced wordmark scale and tighter vertical spacing
- Mobile navigation simplified to News, Provinces, Ireland, URC, Europe and Search
- Desktop navigation includes About
- Header social links limited to Instagram and Facebook
- X/Twitter removed from the site UI
- `app/search/page.tsx` created as a search placeholder
- `components/SiteFooter.tsx` created
- `app/about/page.tsx` created
- `app/categories/provinces/page.tsx` created
- `app/articles/[slug]/page.tsx` route created
- Article route now reads article content from Sanity by slug and 404s when CMS content is missing
- `components/ArticleHeader.tsx` created and polished
- `components/KeyPoints.tsx` created
- `components/ArticleBody.tsx` created
- `components/ContinueReading.tsx` created
- `components/TagList.tsx` created
- `components/ReaderSupport.tsx` created
- `components/ArticleCard.tsx` created
- Article cards support CMS-backed image URLs
- Homepage converted from landing page to editorial newsroom-style homepage
- Homepage now includes lead story, editor note, latest stories, province coverage, analysis, reader support and sections grid
- Homepage now reads live Sanity content as the canonical source and no longer falls back to local sample articles
- Bottom homepage section grid now reads category links from Sanity and includes News plus CMS categories
- Article byline now uses panda logo signature
- Sanity project prepared externally with project ID `hvg4b508` and dataset `production`
- Vercel environment variables configured for Sanity project access
- Sanity dependencies added in `package.json`
- `sanity.config.ts` and `sanity.cli.ts` added
- `/studio` route added through `app/studio/[[...tool]]/page.tsx`
- Sanity schemas added for articles, authors, categories, provinces, competitions and tags
- Article schema includes SEO fields, featured image metadata, key points and Portable Text body content
- `lib/sanity.ts` and `lib/cms.ts` added for Sanity client, homepage queries, article-by-slug queries and category queries
- `scripts/seed-sanity.mjs` added to seed the canonical hosted Sanity CMS with starter taxonomy and article content
- `npm run seed:sanity` script added; requires `SANITY_API_TOKEN` with write access
- Dynamic category route added at `app/categories/[slug]/page.tsx`
- Article featured image rendering wired into article pages using CMS image metadata
- Local article mock data removed from frontend page rendering

## Current GitHub structure

```text
app/
  page.tsx
  layout.tsx
  icon.tsx
  apple-icon.tsx
  about/
    page.tsx
  search/
    page.tsx
  studio/
    [[...tool]]/
      page.tsx
  categories/
    [slug]/
      page.tsx
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
  cms.ts
  sanity.ts

scripts/
  seed-sanity.mjs

sanity/
  env.ts
  schemaTypes/
    index.ts

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

Continue Sprint 3 — CMS and Publishing Platform. Hosted Sanity Studio is the canonical CMS. Seed content script and live content wiring are now in place; next step is to run the seed script against the hosted project and verify the deployed pages.

## Immediate next tasks

1. Run `SANITY_API_TOKEN=... npm run seed:sanity` locally or in a trusted environment with a write token for the hosted Sanity project.
2. Verify the deployed homepage after seeding Sanity content.
3. Verify `/articles/leinster-season-preview-2026` after seeding Sanity content.
4. Verify dynamic category pages such as `/categories/provinces`, `/categories/ireland`, `/categories/urc` and `/categories/europe`.
5. Upload proper CMS featured images and image metadata in Sanity to replace empty image states.
6. Verify the deployed favicon and desktop masthead proportions after Vercel finishes deployment.

## Sprint 3 — CMS and Publishing Platform

1. Add Sanity dependencies and configuration — done
2. Create Sanity Studio route or studio workspace — done
3. Create schemas for articles, authors, categories, provinces, competitions, tags and images — done
4. Add SEO fields and image metadata fields — done
5. Connect Next.js pages to Sanity queries — done for homepage, article pages and category pages
6. Replace temporary `lib/articles.ts` sample data with CMS content — done in frontend rendering
7. Create seed content or migration script — done with `scripts/seed-sanity.mjs`
8. Prepare dynamic category/article routes from CMS data — article and category routes done
9. Build image management with featured image, caption, photographer, rights/source and alt text — schema done; article/page/card rendering done for CMS image URLs

## Known issues

- Live favicon needs deployment/browser verification after generated icon route update
- Desktop masthead proportions need deployment/browser verification after latest polish pass
- Search is a placeholder and not connected to an index yet
- Seed script still needs to be run against the hosted Sanity dataset with a write token
- CMS starter content currently has no uploaded featured image assets; image fields are supported once assets are added in Studio
- Sponsorship slots not implemented yet
- Newsletter sign-up not implemented yet
- The `.com` redirect may still need final confirmation

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
