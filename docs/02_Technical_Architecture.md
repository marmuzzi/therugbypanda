# Technical Architecture

## Current stack

- Next.js
- TypeScript
- Tailwind CSS
- Vercel
- GitHub
- Cloudflare DNS

## Deployment

GitHub is connected to Vercel. Commits to the production branch trigger automatic deployment.

Primary domain:
`https://therugbypanda.ie`

Vercel project is live and serving the landing page.

## DNS

Cloudflare manages DNS for `therugbypanda.ie`.

The `.ie` domain is primary.

The `.com` domain exists for brand protection and should eventually redirect to `.ie`.

Canonical strategy:

```text
therugbypanda.ie          primary
www.therugbypanda.ie      redirect to therugbypanda.ie
therugbypanda.com         future redirect to therugbypanda.ie
www.therugbypanda.com     future redirect to therugbypanda.ie
```

## Current important files

```text
app/page.tsx
app/layout.tsx
app/articles/[slug]/page.tsx
components/ArticleHeader.tsx
public/landing-bg.png
public/rugby-panda-logo.png
public/favicon.png
```

## Current article route

Dynamic route exists:

```text
app/articles/[slug]/page.tsx
```

Test URL:

```text
/articles/leinster-season-preview-2026
```

## Current component

`components/ArticleHeader.tsx`

Purpose:
- displays article category
- headline
- subtitle
- publication metadata
- attribution as The Rugby Panda

## Development principle

Every reusable visual element should become a component.

Expected future components:

```text
components/
  SiteHeader.tsx
  ArticleHeader.tsx
  KeyPoints.tsx
  ArticleBody.tsx
  SponsorBlock.tsx
  ContinueReading.tsx
  TagList.tsx
  Footer.tsx
  ArticleCard.tsx
  SearchBox.tsx
```

## Future CMS

The CMS should eventually allow:
- title
- subtitle
- category
- tags
- entities
- hero image
- key points
- body content
- publication state
- preview
- publish
