# AI cost routing and $0.40/day hard ceiling

## Current owner requirement

As of 11 September 2026, The Rugby Panda must not intentionally reserve more than **$0.40 per Europe/Dublin operational day** for OpenAI-backed editorial work. The **normal operating target is at or below $0.30/day**.

## Architecture

OpenAI is not the crawler, feed reader, image finder, duplicate detector, freshness selector or package-diversity engine.

Normal path:

1. source discovery from registry/RSS/current-source workers — no OpenAI call;
2. deterministic Irish-targeted reserve discovery — no OpenAI call;
3. deterministic rugby filtering, coherent corroboration, evidence sufficiency, freshness and diversity — no OpenAI call;
4. deterministic one-to-one launch slot planning — no OpenAI call;
5. local/approved-rights image discovery and deterministic context matching — no OpenAI call;
6. article drafting defaults to `gpt-5.6-terra`;
7. Publication Review and bounded repair default to `gpt-5.6-luna`;
8. human publication remains mandatory.

No Sol/flagship model is part of the default production path.

## Application-level daily guard

`lib/editorial/AiDailyBudget.ts` persists conservative reservations in Sanity under one `editorialAiBudget` document per Europe/Dublin operational date.

- configured hard ceiling defaults to $0.40;
- `EDITORIAL_AI_DAILY_BUDGET_USD` may lower the ceiling but cannot raise it above $0.40;
- normal operating target is <=$0.30/day;
- a normal production draft pipeline reserves $0.055 before its model-backed generation/review cycle;
- a manual Studio Publication Review reservation remains separately bounded where used;
- reservations use optimistic Sanity revision checks and bounded revision-conflict retries;
- if a reservation would exceed the hard ceiling, the model call is blocked before reaching OpenAI.

Reservations are deliberately conservative and are not released after a failed/interrupted attempt. This prevents retry storms from reusing nominal budget.

## Launch slot budget boundary

The recovery workflow reduces the fresh candidate queue to exactly one candidate per missing package slot before paid generation. It runs those slots serially and records retained count, missing slots, paid attempt limit = missing slots, replacement paid attempts = 0, and selected candidate IDs.

With five empty slots, five reservations total `$0.275`, which remains below the normal `$0.30` target. The `$0.40` application guard is the absolute daily ceiling and does not authorize paid retry loops.

If a selected candidate fails a genuine critical/high quality gate, the normal scheduled workflow does not buy repeated replacements. Corrective action remains deterministic/free evidence and reserve improvement before another explicitly justified paid attempt.

## Evidence-before-spend rule

Completed-match stories require a final score in the usable fact ledger; squad/selection stories require named people; the existing match/trial concrete-detail floor remains; Publication Review blocks critical/high issues. These checks occur before budget reservation.

## Important boundary

The application guard is a software circuit breaker, not a provider-side billing guarantee. Actual OpenAI billing remains token based. Reservation amounts are conservative planning values, not reconciliation of provider usage. Provider-side project spend controls should remain enabled where available.

## Image cost rule

Image discovery, rights triage and deterministic relevance checks must not call OpenAI by default. A missing safe image must fail closed to no image / approved brand fallback rather than trigger paid generative retries.

## 11 September launch-run change

For the Leinster/Zebre launch-readiness run, the owner restored the hard ceiling to `$0.40/day` and set the normal operating target to `<= $0.30/day`. The application default is therefore lowered to `$0.40`; deterministic qualification, Terra generation, Luna review/repair and zero paid replacement loops remain unchanged.
