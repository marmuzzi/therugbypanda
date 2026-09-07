# AI cost routing and $0.40/day ceiling

## Current owner requirement

As of 7 September 2026, The Rugby Panda must not intentionally reserve more than **$0.40 per Europe/Dublin operational day** for OpenAI-backed editorial work. This supersedes the earlier $0.30 ceiling recorded on 4 September.

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

- configured ceiling defaults to $0.40;
- `EDITORIAL_AI_DAILY_BUDGET_USD` may lower the ceiling but cannot raise it above $0.40;
- a normal production draft pipeline reserves $0.055 before its model-backed generation/review cycle;
- a manual Studio Publication Review reservation remains separately bounded where used;
- reservations use optimistic Sanity revision checks and bounded revision-conflict retries;
- if a reservation would exceed the ceiling, the model call is blocked before reaching OpenAI.

Reservations are deliberately conservative and are not released after a failed/interrupted attempt. This prevents retry storms from reusing nominal budget.

## Launch slot budget boundary — PR #442

The 7 September production evidence showed that a replacement queue could consume successive `$0.055` reservations after earlier candidates failed Publication Review. The ledger reached `$0.385`, leaving too little room for another production draft reservation.

For the launch recovery, `scripts/prepare-slot-budget-batch.mjs` now reduces the fresh candidate queue to exactly one candidate per missing package slot before paid generation. The recovery workflow runs those slots serially and records:

- retained count;
- missing slots;
- paid attempt limit = missing slots;
- replacement paid attempts = 0;
- selected candidate IDs.

With five empty slots, five reservations total `$0.275`, leaving `$0.125` of the application ceiling unused rather than allowing replacement churn to consume it. The global `$0.40` Sanity guard remains the final application circuit breaker.

This slot plan is intentionally conservative: if a selected candidate fails a genuine critical/high quality gate, the run does not buy repeated replacements. The corrective action is to improve the free evidence/reserve stage before the next paid attempt.

## Evidence-before-spend rule

PR #442 strengthens the API pre-generation boundary for the exact failure classes measured on 7 September:

- completed-match stories require a final score in the usable fact ledger;
- squad/selection stories require at least two named people in the usable fact ledger;
- the existing match/trial concrete-detail floor remains;
- Publication Review continues to block critical/high issues, but medium/low-only observations no longer trigger a duplicate route-level hard rejection.

These checks occur before budget reservation.

## Important boundary

The application guard is a software circuit breaker, not a provider-side billing guarantee. Actual OpenAI billing remains token based. Reservation amounts are conservative planning values, not reconciliation of provider usage. Provider-side project spend controls should remain enabled where available.

## Image cost rule

Image discovery, rights triage and deterministic relevance checks must not call OpenAI by default. A missing safe image must fail closed to no image / approved brand fallback rather than trigger paid generative retries.

## 7 September measured state

Run `34135365500` reached `$0.385` reserved. After that point, further `$0.055` production reservations were correctly blocked. Do not trigger more paid 7 September article generation.

## Verification required for the 8 September launch attempt

1. PR #442 merged;
2. deterministic launch-recovery contract workflow passes;
3. Vercel production deployment is READY for the API route change;
4. the next Dublin-day recovery proves standard discovery includes the Irish reserve;
5. slot planning proves exactly one candidate per missing slot before model spend;
6. pre-generation evidence rejects under-specified completed-match/squad candidates without a budget reservation;
7. a medium/low-only Review #2 result is not rejected by a duplicate route-level verdict check;
8. actual Sanity budget reservations remain <=$0.40;
9. no automatic publication occurs.
