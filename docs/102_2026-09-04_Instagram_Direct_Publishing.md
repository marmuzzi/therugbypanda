# Direct Instagram publishing after human website publication — 4 September 2026

## Scope

The controlled editorial `publish` action now routes to a direct Instagram API provider instead of requiring the legacy generic social webhook.

The human publication boundary remains mandatory:

`draft -> human review/edit -> human publish -> Instagram distribution`

Draft creation, Publication Review, image acquisition and scheduled editorial automation cannot post to Instagram.

## Production credentials

The provider reads these server-side Vercel Production variables:

- `META_INSTAGRAM_ACCESS_TOKEN`
- `META_INSTAGRAM_ACCOUNT_ID`

Secrets are never stored in GitHub or Sanity.

## Safety switch

Live Instagram posting is deliberately disabled unless:

`META_INSTAGRAM_PUBLISH_ENABLED=true`

The owner has not enabled that switch yet. This lets the code deploy and the normal website continue operating without creating a surprise Instagram post. The switch should be enabled only immediately before the controlled first live test.

## Publishing contract

For an eligible human-published article the provider:

1. respects `doNotPublishToSocial`;
2. requires a public HTTPS featured image;
3. builds the caption deterministically from the explicit Instagram override when present, otherwise title + standfirst, article URL and configured hashtags;
4. creates an Instagram media container;
5. publishes that same container;
6. records the Instagram post ID and delivery status in the article's existing `socialDistribution` fields.

No OpenAI call is used.

## Duplicate protection

Each publication gets a stable event identity based on provider + article ID + `publishedAt`.

A deterministic Sanity `socialDistributionAttempt` record is used as a revision-guarded claim/lock. It stores the media container ID before publication, so bounded recovery can reuse the same container instead of blindly creating another one. A recent active claim fails closed as already in progress; an already-sent event returns without posting again.

## First-live-test boundary

Merging/deploying this code does **not** authorize the first Instagram post by itself. Production verification should first prove the deployment is READY with the safety switch still off. The owner then explicitly approves the first test article, the safety switch is enabled, and one human publish is observed end-to-end before normal automatic post-publication distribution is considered verified.
