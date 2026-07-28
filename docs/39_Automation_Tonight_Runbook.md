# Automation completion runbook

## Objective

Complete and verify the persistent Make.com editorial automation while keeping Sanity as the single human approval boundary.

## Tonight's critical path

1. Configure the daily acquisition and candidate-generation scenario.
2. Generate review-ready drafts for the active reader sections.
3. Map the review-ready notification with persistent deduplication.
4. Configure approval-triggered website publication preparation.
5. Configure image-backed Facebook and Instagram preparation and delivery.
6. Record platform-specific delivery status, IDs, attempts and errors in Sanity.
7. Verify retries do not create duplicate drafts, emails or social posts.
8. Run one complete controlled lifecycle from candidate to production article.

## Mandatory controls

- Sanity remains the mandatory human editorial approval boundary.
- No acquired or generated article is automatically approved.
- Website publication is independent from social-delivery success.
- Social failures must never unpublish or roll back the website article.
- Every social promotion must include a usage-approved image.
- Stable event IDs must enforce idempotency.
- Failed operations must retain enough context for a safe retry.
- Alerts for technical failures go to `admin@therugbypanda.ie`.

## Minimum verification evidence

- one correctly populated review-ready email;
- one duplicate replay that creates no second email;
- one approved article published to the website;
- one rejected article requesting a genuinely new replacement;
- one successful Facebook delivery;
- one successful Instagram delivery;
- one simulated partial social failure with independent platform status;
- one retry that creates no duplicate public post;
- production homepage, archive, category and article rendering checks.

## Completion rule

The automation is not complete merely because modules are connected. It is complete only when the controlled tests above have passed and the repository Issue Log records the verified state.
