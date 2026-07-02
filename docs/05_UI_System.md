# UI System

## Design principles

The Rugby Panda UI should be:
- clean
- editorial
- readable
- mobile-first
- premium
- fast
- uncluttered

## Landing page

Current landing page includes:
- stadium background
- panda logo
- mission statement
- launch message
- Instagram and Facebook links

## Article page philosophy

The article page is the core product.

It should feel effortless to read.

Avoid:
- clutter
- floating share bars
- comments
- intrusive ads
- excessive sidebars

## Article layout

```text
Site Header

Article Header
  Category
  Headline
  Subtitle
  Published / Updated / Reading time / The Rugby Panda

Hero Image

Key Points

Article Body

Sponsor block

Continue Reading

Tags

Footer
```

## Current component

### ArticleHeader

File:
```text
components/ArticleHeader.tsx
```

Purpose:
- category
- title
- subtitle
- metadata

## Future components

```text
SiteHeader.tsx
KeyPoints.tsx
ArticleBody.tsx
SponsorBlock.tsx
ContinueReading.tsx
TagList.tsx
Footer.tsx
ArticleCard.tsx
SearchBox.tsx
```

## Header

Article pages and subpages should have a compact newsroom header with:
- panda logo
- The Rugby Panda wordmark
- navigation
- future search

Not the full landing page hero.

## Ads and sponsor blocks

Ads should never interrupt reading.

Preferred:
- one tasteful sponsor slot
- sponsor block after first third of article
- mobile sponsor near article end
- no cluttered display-ad experience
