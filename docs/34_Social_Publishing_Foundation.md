# Social Publishing Foundation

Status: Foundation merged; automatic image-backed distribution contract in progress.

## Purpose

This phase establishes the Sanity data contract required for automatic Facebook and Instagram distribution after an article is published.

Article approval is the single editorial approval boundary. A separately approved social-media version is not required. Unless the editor selects the exception override, publishing an approved article also authorises automatic social distribution.

Website publication remains technically independent from social delivery. A social failure must never unpublish, roll back, or block an article that has passed editorial review.

## Article controls

Each article includes:

- `doNotPublishToSocial`: exception override, default `false`;
- `socialPublishing.status`: workflow-managed state;
- `socialPublishing.eventId`: stable idempotency key;
- timestamps for request, last attempt and successful publication;
- attempt count and last error;
- platform post IDs, URLs and publication timestamps.

Editors may change only the skip override. Workflow-owned delivery fields are read-only in Sanity Studio.

## Event contract

The `socialPublishEvent` document records one controlled social distribution request. It includes:

- stable `eventId`;
- reference to the published article;
- article revision and canonical URL;
- headline and standfirst snapshot;
- required public image URL and image alt text;
- required Facebook and Instagram snippets derived from the approved article;
- requested platforms;
- delivery status and retry metadata;
- resulting Facebook and Instagram post IDs and URLs.

Text-only article promotion is not permitted.

## Required orchestration behaviour

The external workflow must:

1. Trigger only after the controlled article publication step completes.
2. Stop immediately when `doNotPublishToSocial` is `true`.
3. Treat article approval as approval for automatic social distribution; do not introduce a second approval step.
4. Resolve a usable public image URL before creating the event.
5. Never publish a text-only article post.
6. Generate platform-appropriate snippets from the approved article that direct readers back to the canonical website URL.
7. Use `eventId` as the idempotency key and never create duplicate posts for the same event and platform.
8. Update delivery state independently from the website publication state.
9. Record each attempt and preserve the latest actionable error.
10. Treat partial platform success explicitly rather than rolling back successful posts.

When an image is missing, the website article remains live, social delivery records an actionable `missing-image` failure, and the workflow may retry automatically once an image becomes available. No new editorial approval is required.

## Not included in this phase

- Meta API credentials or token storage.
- Facebook or Instagram API calls.
- Make.com scenario changes.
- Production delivery verification.

These remain separate implementation and verification steps.
