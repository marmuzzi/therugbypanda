# Launch introduction and content cleanup

## Decision

The first public editorial package begins with one strong introduction article rather than retaining the original short seed articles.

## Introduction article

- Title: `Welcome to The Rugby Panda: rugby worth reading`
- Slug: `welcome-to-the-rugby-panda`
- Author: `The Rugby Panda`
- Category: `News`
- Lead article: yes
- Brand image: yes

The article introduces the newsroom's scope, voice and standards without referring to AI or automation.

## Legacy seed cleanup

The following original seed articles are removed when `npm run seed:sanity` is run with the production Sanity write token:

- `article-leinster-season-preview-2026`
- `article-ireland-depth-chart-autumn-window`
- `article-urc-storylines-opening-month`
- `article-european-game-management-big-nights`
- `article-munster-control-not-emotion`
- `article-ulster-need-clarity`
- `article-connacht-edge-awkward-games`

The cleanup is deliberately limited to known seed IDs. It does not delete later editorial drafts or reviewed articles.

## Production execution

Repository merge alone does not mutate the Sanity dataset. The updated seed command must run with `SANITY_API_TOKEN` against the production dataset. Production must then be checked for:

- only the introduction article being publicly visible;
- correct homepage lead placement;
- correct News archive and article page rendering;
- no legacy seed article URLs in the generated sitemap;
- no broken category pages;
- correct brand image and metadata.
