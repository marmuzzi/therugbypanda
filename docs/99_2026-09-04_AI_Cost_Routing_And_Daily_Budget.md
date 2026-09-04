# 2026-09-04 — AI cost routing and $0.30/day ceiling

## Owner requirement

The Rugby Panda must not intentionally spend more than **$0.30 per Europe/Dublin operational day** on OpenAI API usage.

## Architecture

OpenAI is not the crawler, feed reader, image finder or duplicate detector.

Normal path:

1. source discovery from registry/RSS/current-source workers — no OpenAI call;
2. deterministic rugby filtering, evidence sufficiency, freshness and diversity — no OpenAI call;
3. local/Wikimedia/approved-rights image discovery and deterministic context matching — no OpenAI call;
4. article drafting defaults to `gpt-5.6-terra`;
5. Publication Review and metadata repair default to `gpt-5.6-luna`;
6. human publication remains mandatory.

No Sol/flagship model is part of the default production path.

## Application-level budget guard

`lib/editorial/AiDailyBudget.ts` persists conservative reservations in Sanity under one `editorialAiBudget` document per Europe/Dublin operational date.

- configured ceiling defaults to $0.30;
- `EDITORIAL_AI_DAILY_BUDGET_USD` may lower the ceiling but cannot raise it above $0.30;
- a normal draft pipeline reserves $0.055 before any model call;
- a manual Studio Publication Review reserves $0.005 before its model call;
- reservations use optimistic Sanity revision checks to prevent concurrent callers from knowingly exceeding the application ceiling;
- if a reservation would exceed the ceiling, the model call is blocked before reaching OpenAI.

This is deliberately conservative accounting. Reservations are not released after success: a failed or interrupted model attempt still consumes its reserved allowance for that day. This prevents retry storms from reusing budget.

## Important boundary

The application guard is a software circuit breaker, not a provider-side billing guarantee. Actual OpenAI billing remains token based. The reservation sizes are intended to keep the normal five-draft workflow below the owner's daily ceiling and stop repeated recovery calls. Provider-side project spend limits should remain enabled as an additional defence when available.

## Image cost rule

Image discovery, rights triage and deterministic relevance checks must not call OpenAI by default. A missing safe image must fail closed to no image / approved brand fallback rather than trigger paid generative retries.

## Verification required before normal scheduling resumes

1. PR merged;
2. Vercel production READY;
3. dry-run reports Terra generation, Luna review and $0.30 daily limit;
4. one funded bounded production draft proves model compatibility and quality;
5. Sanity budget document records the reservation;
6. a synthetic over-budget request is blocked before an OpenAI call;
7. actual OpenAI usage for the bounded test is checked against the reservation assumption.

Do not add broad API credit or resume repeated recovery runs before these checks pass.
