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

## Current GitHub structure

```text
app/
  page.tsx
  layout.tsx
  articles/
    [slug]/
      page.tsx

components/
  ArticleHeader.tsx

public/
  landing-bg.png
  rugby-panda-logo.png
  favicon.png
```

## Current article URL

```text
https://therugbypanda.ie/articles/leinster-season-preview-2026
```

## Current task

Build the full article page template.

## Next task

Create reusable components:

1. `components/SiteHeader.tsx`
2. `components/KeyPoints.tsx`
3. `components/ArticleBody.tsx`
4. `components/SponsorBlock.tsx`
5. `components/ContinueReading.tsx`
6. `components/TagList.tsx`

## Known issues

- Homepage newsroom not built yet
- Category pages not built yet
- Search not built yet
- CMS not built yet
- Sponsorship slots not implemented yet
- The `.com` redirect may still need final confirmation

## Working principles

- Full file replacements are preferred over partial snippets.
- Build incrementally.
- Test after each small step.
- Reusable components only.
- Mobile-first design.
- Reader-first advertising.
- No public AI references.
