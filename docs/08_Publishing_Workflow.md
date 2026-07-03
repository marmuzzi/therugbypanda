# Publishing Workflow

## Canonical CMS

The hosted Sanity Studio is the canonical CMS for The Rugby Panda. Frontend pages should not use local mock article data.

## Publishing checklist

1. Create or update the article in Sanity Studio.
2. Confirm the article has a slug, standfirst, category and published date.
3. Add key points for analysis-led stories when useful.
4. Add a featured image when available, including alt text, caption, photographer, source and rights notes.
5. Preview the article route after the next deployment.
6. Check category pages and the homepage for article placement.
7. Run **Validate Live Site** from GitHub Actions after deployment.

## No-terminal operations

- **Seed Sanity CMS** can reseed starter CMS content using the existing `SANITY_API_TOKEN` secret.
- **Validate Live Site** checks the deployed homepage, lead article, category pages and favicon routes.

## SEO and feeds

The site exposes:

- `/sitemap.xml`
- `/robots.txt`
- `/rss.xml`

Article pages generate page metadata and `NewsArticle` JSON-LD from Sanity content.
