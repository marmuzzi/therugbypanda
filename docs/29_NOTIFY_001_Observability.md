# NOTIFY-001 Observability

Date: 2026-07-26

## Purpose

Add temporary, production-safe observability to the article-ready-for-review notification path so the next controlled submit can distinguish between:

- webhook configuration missing at runtime;
- webhook request attempted and accepted;
- webhook request rejected with a non-2xx response;
- webhook request timing out or throwing an exception.

## Security constraints

Logging must never include:

- the webhook URL;
- the optional webhook secret;
- bearer tokens;
- article body content.

Permitted fields are limited to the stable event identifier, article ID, delivery status, HTTP status code, whether configuration is present, and a sanitised error message.

## Verification plan

1. Deploy the observability change to production.
2. Keep the Make webhook listening.
3. Submit a different draft article for review.
4. Inspect Vercel runtime logs for `editorial-notification` entries.
5. Confirm whether delivery is `sent`, `skipped`, or `failed`.
6. Continue Make scenario configuration only after the webhook request is confirmed.

This change does not alter Sanity workflow state, approval rules, publication rules, or notification idempotency requirements.