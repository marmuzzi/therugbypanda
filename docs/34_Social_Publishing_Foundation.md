# Social Publishing Foundation

Status: Implemented on feature branch; integration and production verification pending.

## Purpose

This phase establishes the Sanity data contract required for controlled Facebook and Instagram distribution after an article is published.

Website publication remains independent from social publication. A social failure must never unpublish, roll back, or block an article that has passed the editorial approval boundary.

## Article controls

Each article now includes:

- `doNotPublishToSocial`: editorial override, default `false`.
- `socialPublishing.status`: workflow-managed state.
- `socialPublishing.eventId`: stable idempotency key.
- timestamps for request, last attempt and successful publication.
- attempt count and last error.
- platform post IDs, URLs and publication timestamps.

Editors may change only the `doNotPublishToSocial` override. Workflow-owned delivery fields are read-only in Sanity Studio.

## Event contract

The `socialPublishEvent` document records one controlled social distribution request. It includes:

- stable `eventId`;
- reference to the published article;
- article revision and canonical URL;
- headline, standfirst and image URL snapshot;
- requested platforms;
- delivery status;
- retry metadata;
- resulting Facebook and Instagram post IDs and URLs.

## Required orchestration behaviour

The external workflow must:

1. Trigger only after the controlled article publication step completes.
2. Stop immediately when `doNotPublishToSocial` is `true`.
3. Use `eventId` as the idempotency key and never create duplicate posts for the same event and platform.
4. Update delivery state independently from the website publication state.
5. Record each attempt and preserve the latest actionable error.
6. Treat partial platform success explicitly rather than rolling back successful posts.

## Not included in this phase

- Meta API credentials or token storage.
- Facebook or Instagram API calls.
- Make.com scenario changes.
- Social caption generation.
- Production delivery verification.

These remain separate implementation and verification steps.
