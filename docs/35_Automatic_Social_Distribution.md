# Automatic Social Distribution

Status: Approved workflow contract; implementation branch in progress.

## Editorial principle

Article approval is the single editorial approval boundary. When an article is approved and published to the website, it is also approved for automatic Facebook and Instagram distribution unless the editor explicitly selects the skip override.

There is no second social-media approval step.

## Required social post

Every social post must include:

- a picture associated with the article;
- a short platform-appropriate snippet derived from the approved article;
- the article headline or a faithful shortened form;
- a canonical link back to the article on `therugbypanda.ie`;
- campaign tracking parameters where supported;
- the resulting platform post ID and URL recorded for audit and retry handling.

Text-only social posts are not permitted for article distribution.

## Image prerequisite

The workflow must resolve an approved article image before creating a social publishing event. The preferred source is the article featured image.

If no usable image is available:

1. the website article remains published;
2. no text-only Facebook or Instagram post is created;
3. social delivery is marked as failed with an actionable `missing-image` error;
4. the workflow may retry after an image is attached;
5. no additional editorial approval is required after the image prerequisite is fixed.

## Automatic workflow

1. Human editorial review approves the article.
2. The article is published to the website.
3. The workflow checks the skip override.
4. The workflow resolves the featured image and public image URL.
5. The workflow generates Facebook and Instagram snippets from the approved article.
6. A stable social publishing event is created.
7. Facebook and Instagram posts are published with the image and article link.
8. Platform IDs, URLs, attempts and errors are written back to Sanity.

Website publication remains independent from delivery availability. A temporary Meta failure must not block or roll back the website article.
