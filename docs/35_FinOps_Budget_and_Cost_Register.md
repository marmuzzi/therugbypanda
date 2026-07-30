# FinOps Budget and Cost Register

## Purpose

Track recurring and material one-off operating costs for The Rugby Panda so product and automation decisions include budget, value and operational efficiency.

## Operating principles

- Record every paid subscription when activated.
- Record the billing currency and exact confirmed amount.
- Keep monthly and annualised estimates separate from actual invoiced totals.
- Review usage, limits and business value before renewing or upgrading.
- Do not combine unrelated workflows solely to avoid a justified platform cost when separation improves reliability, observability and maintenance.
- Reassess costs when traffic, automation volume or revenue changes materially.

## Active recurring costs

| Service | Plan | Purpose | Billing frequency | Confirmed cost | Annualised estimate | Start date | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Make.com | Core | Persistent editorial orchestration, scheduling, webhooks, retries, deduplication, email delivery and future social workflows | Monthly | USD $10.59/month | USD $127.08/year | 2026-07-30 | Active | Upgraded from Free because the production architecture requires more than two active scenarios. Actual taxes, exchange-rate effects and invoice totals should be recorded when available. |

## Current confirmed recurring total

- Monthly: **USD $10.59**
- Annualised: **USD $127.08**

This total includes only costs explicitly confirmed and recorded in this document. It is not a complete project cost unless every other paid service has also been added.

## Make.com FinOps rationale

The Make.com Core upgrade supports separate production scenarios for:

1. review and draft notifications;
2. morning editorial package delivery;
3. daily scheduled package triggering;
4. social distribution;
5. health checks and future operational reporting.

Separate scenarios are preferred over one large combined workflow because they provide clearer failure isolation, retry behaviour, ownership, operational history and cost attribution.

## Review cadence

Review this register:

- whenever a subscription is added, upgraded, downgraded or cancelled;
- after the first complete month of production automation;
- monthly during launch and early growth;
- before committing to any material annual plan.

## Metrics to capture for Make.com

- monthly operations consumed;
- operations by scenario;
- failed and retried operations;
- cost per delivered editorial package;
- cost per generated and published article;
- unused capacity;
- projected cost at expected daily publishing volume.

## Change log

### 2026-07-30

- Added Make.com Core at the confirmed price of USD $10.59 per month.
- Recorded annualised estimate of USD $127.08 before taxes and currency conversion.
