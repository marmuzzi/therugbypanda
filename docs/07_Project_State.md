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
- Article route now attempts to read article content from Sanity by slug and falls back to the sample Leinster article
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
- Homepage now reads published Sanity articles when available and falls back to local sample article data when CMS content is empty or unavailable
- Bottom homepage section grid now matches top-level nav: News, Provinces, Ireland, URC, Europe
- Article byline now uses panda logo signature
- Sanity project prepared externally with project ID `hvg4b508` and dataset `production`
- Vercel environment variables configured for Sanity project access
- Sanity dependencies added in `package.json`
- `sanity.config.ts` and `sanity.cli.ts` added
- `/studio` route added through `app/studio/[[...tool]]/page.tsx`
- Sanity schemas added for articles, authors, categories, provinces, competitions and tags
- Article schema includes SEO fields, featured image metadata, key points and Portable Text body content
- `lib/sanity.ts` and `lib/cms.ts` added for Sanity client, homepage queries, article-by-slug queries and safe sample-content fallback

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
  cms.ts
  sanity.ts

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

Continue Sprint 3 — CMS and Publishing Platform. Brand polish is committed, and CMS foundation is in place with safe fallback content.

## Immediate next tasks

1. Verify the deployed favicon after Vercel finishes the latest deployment. The generated `/icon.png` route and metadata update are committed, but the live browser tab still needs visual confirmation.
2. Verify desktop masthead proportions on the deployed site after the latest deployment.
3. Create seed content or a migration script for Sanity.
4. Prepare dynamic category routes from CMS data.
5. Add featured image rendering to the article page once CMS image content is available.
6. Replace temporary Unsplash/sample imagery with CMS-backed images.

## Sprint 3 — CMS and Publishing Platform

1. Add Sanity dependencies and configuration — done
2. Create Sanity Studio route or studio workspace — done
3. Create schemas for articles, authors, categories, provinces, competitions, tags and images — done
4. Add SEO fields and image metadata fields — done
5. Connect Next.js pages to Sanity queries — in progress; homepage and article-by-slug now query Sanity with safe fallbacks
6. Replace temporary `lib/articles.ts` sample data with CMS content — in progress; fallback remains until seed/published content exists
7. Create seed content or migration script — next
8. Prepare dynamic category/article routes from CMS data — article route started; category route still pending
9. Build image management with featured image, caption, photographer, rights/source and alt text — schema done; front-end rendering still pending

## Known issues

- Live favicon needs deployment/browser verification after generated icon route update
- Desktop masthead proportions need deployment/browser verification after latest polish pass
- Dynamic category route not built yet
- Search is a placeholder and not connected to an index yet
- Seed content/migration script not created yet
- Article featured image rendering is not wired into the article page yet
- Sponsorship slots not implemented yet
- Newsletter sign-up not implemented yet
- The `.com` redirect may still need final confirmation
- Homepage can read CMS content, but temporary local sample data remains as fallback until real CMS content is seeded/published

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
