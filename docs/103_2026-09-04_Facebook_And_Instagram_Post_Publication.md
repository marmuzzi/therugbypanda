# Facebook + Instagram post-publication distribution — 4 September 2026

The controlled editorial `publish` action now coordinates both Meta providers after a human publication.

Flow:

`draft -> human review/edit -> human publish -> Instagram + Facebook distribution`

Neither draft generation nor scheduled editorial automation can publish to social media.

## Production variables

Instagram:
- `META_INSTAGRAM_ACCESS_TOKEN`
- `META_INSTAGRAM_ACCOUNT_ID`
- `META_INSTAGRAM_PUBLISH_ENABLED=true` to allow live posting

Facebook:
- `META_FACEBOOK_PAGE_ACCESS_TOKEN`
- `META_FACEBOOK_PAGE_ID`
- `META_FACEBOOK_PUBLISH_ENABLED=true` to allow live posting

Provider credentials remain server-side in Vercel and are not stored in GitHub or Sanity.

## Facebook contract

Facebook uses the Page `/feed` publishing endpoint with the Rugby Panda article URL. The explicit `socialDistribution.facebookTeaser` override wins; otherwise the message is derived deterministically from the article title and standfirst. Facebook's link post can use the article's public Open Graph metadata for its preview.

## Idempotency

Instagram and Facebook each use a deterministic Sanity `socialDistributionAttempt` record keyed by provider + article + original `publishedAt`. An already-sent event does not post again. Active concurrent attempts fail closed.

The coordinator records the overall article social state as `sent`, `partially-sent`, `failed` or `skipped` and preserves provider post IDs in the existing `socialDistribution` fields.

## First test

Both provider enable switches remain off until the owner intentionally starts the first live test. The selected acceptance test is the existing Rugby Panda introduction article: unpublish it, then publish it once after both switches are enabled, and verify website + Instagram + Facebook + Sanity post IDs without duplicate delivery.

No OpenAI call is required for social distribution.
