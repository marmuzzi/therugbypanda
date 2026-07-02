# Project State

## Current Version

v0.2 — Newsroom Foundation

## Last Updated

2 July 2026

## Completed

- The Rugby Panda brand created
- Mission defined
- Domain live: https://therugbypanda.ie
- Cloudflare DNS working
- Vercel deployment working
- Landing page live
- Instagram profile created: https://www.instagram.com/rugbypandamedia
- Facebook page created: https://www.facebook.com/profile.php?id=61591161347126
- Favicon created
- `app/articles/[slug]/page.tsx` route created
- `components/ArticleHeader.tsx` created
- Article page header working
- `components/SiteHeader.tsx` created
- `components/KeyPoints.tsx` created
- `components/ArticleBody.tsx` created
- `components/ContinueReading.tsx` created
- `components/TagList.tsx` created
- `components/ReaderSupport.tsx` created
- `components/ArticleCard.tsx` created
- Full sample article page template built
- Homepage converted from landing page to newsroom-style homepage
- Masthead updated with larger panda logo treatment
- Header social links limited to Instagram and Facebook
- X/Twitter removed from the site UI
- Article byline now uses panda logo signature

## Current GitHub structure

```text
app/
  page.tsx
  layout.tsx
  articles/
    [slug]/
      page.tsx

components/
  ArticleBody.tsx
  ArticleCard.tsx
  ArticleHeader.tsx
  ContinueReading.tsx
  KeyPoints.tsx
  ReaderSupport.tsx
  SiteHeader.tsx
  TagList.tsx

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

Build out the v0.2 newsroom foundation using reusable components and GitHub as the working source of truth.

## Next task

Create additional newsroom foundation pages and layout components:

1. `components/SiteFooter.tsx`
2. `app/categories/[slug]/page.tsx`
3. `app/about/page.tsx`
4. Shared content/data structure for sample articles and categories
5. Basic SEO metadata for homepage and article page
6. Responsive polish for mobile navigation and article sidebar

## Known issues

- Category pages not built yet
- Search route not built yet
- CMS not built yet
- Sponsorship slots not implemented yet
- Newsletter sign-up not implemented yet
- The `.com` redirect may still need final confirmation
- The approved uploaded panda logo should be committed as the canonical `public/rugby-panda-logo.png` asset if binary file replacement is available through the development workflow

## Working principles

- Full file replacements are preferred over partial snippets.
- Build incrementally.
- Test after each small step.
- Reusable components only.
- Mobile-first design.
- Reader-first advertising.
- No public AI references.
- Update project documentation as development progresses.
