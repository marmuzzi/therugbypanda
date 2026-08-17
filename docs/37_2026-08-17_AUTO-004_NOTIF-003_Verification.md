# AUTO-004 Guard and NOTIFY-003 Verification — 17 August 2026

## Scope

This document records two production-verification outcomes from 17 August 2026:

1. the AUTO-004 production-content eligibility guard that prevents controlled-QA/test drafts from entering the Morning Editorial Package;
2. the NOTIFY-003 application-side technical-alert deduplication fix.

Sanity remains the mandatory human approval boundary. None of this work adds automatic approval or publication.

## AUTO-004 — production eligibility guard

### Defect observed

The first real production AUTO-001 package delivered five historical controlled-QA drafts, all about essentially the same World Rugby Law 8 scoring angle. The delivery mechanism was correct, but package eligibility was too permissive and upstream generation had not guaranteed editorial diversity.

### Remediation

PR #156 — `AUTO-004: exclude QA drafts and enforce morning package diversity` — added:

- `automationContentClass` classification on generated Sanity drafts;
- `morningPackageEligible` explicit eligibility metadata;
- QA-mode classification as `qa` and ineligibility for morning packages;
- normal production classification as `production` and package eligibility;
- a production query requiring both `automationContentClass == "production"` and `morningPackageEligible == true`;
- package selection from a larger candidate pool;
- same-source rejection and title/angle/source-title similarity filtering.

PR #156 merged as:

`d1f651726987fda2c2f36ac9d07b7d7d6fb93eea`

The Vercel production deployment reached READY.

### Production verification

A temporary Preview-only server-side verifier called the real protected production endpoint:

`POST https://therugbypanda.ie/api/editorial/daily-package`

Production returned HTTP 409:

```json
{
  "status": "incomplete",
  "eventId": "editorial-daily-package:2026-08-17",
  "articleCount": 0,
  "eligibleCandidateCount": 0,
  "requiredArticleCount": 5,
  "reason": "insufficient-production-eligible-diverse-content"
}
```

This verifies that the historical controlled-QA Law 8 drafts no longer qualify for a production Morning Editorial Package.

AUTO-004 is not closed yet. The remaining verification is to produce at least five current, production-eligible, genuinely distinct rugby drafts and deliver them through the already production-verified AUTO-001 path.

The temporary AUTO-004 verifier was removed from its unmerged test branch after use.

## NOTIFY-003 — technical-alert deduplication semantics

### Defect observed

The first AUTO-004 409 test reported `technicalAlertStatus: sent`, but no new technical-alert email arrived.

Root cause:

- every daily-package failure on the same day used one event ID: `daily-package-failure:YYYY-MM-DD`;
- an earlier failure had already persisted that key in Make's `Rugby Panda Event Deduplication` store;
- Make accepted the later webhook but correctly deduplicated it;
- the application interpreted any Make 2xx response as if the email itself had been sent.

### Remediation

PR #159 — `NOTIFY-003: fix technical alert deduplication semantics` — changed the contract so:

- materially different failure types use distinct stable daily event IDs;
- exact retries of the same failure type reuse the same event ID and remain deduplicated;
- the failure code is included in alert details;
- a Make 2xx response is reported as `technicalAlertStatus: accepted`, not `sent`.

PR #159 merged as:

`f07383c5e15c74f5b537f73de787d75a25942b96`

The Vercel production deployment reached READY.

### Production verification

The real production daily-package endpoint was invoked after deployment while no production-eligible stories existed.

First run:

- HTTP 409;
- reason `insufficient-production-eligible-diverse-content`;
- `technicalAlertStatus: accepted`;
- one new technical-alert email arrived at `admin@therugbypanda.ie`.

Exact replay:

- HTTP 409;
- same reason;
- `technicalAlertStatus: accepted`;
- no second email arrived.

This verifies both desired behaviours: materially different failures can alert independently, while exact retries remain persistently deduplicated by Make.

The temporary NOTIFY-003 Preview-only verifier was removed from its unmerged test branch after verification.

## Current automation state after this verification

- NOTIFY-001: Closed and production verified.
- NOTIFY-002: Closed and production verified.
- NOTIFY-003: Closed and production verified.
- AUTO-001 delivery: Closed and production verified.
- AUTO-004 eligibility guard: merged, deployed and production verified; issue remains open for five-current-story diversity/generation verification.
- AUTO-003: still in progress for overnight acquisition/generation, scheduled invocation and three consecutive on-time morning runs.

## Next task

Continue AUTO-004 upstream from the verified guard. Build or complete the acquisition/generation path so five current rugby stories with distinct source/topic/angle combinations become production-eligible drafts, then run them through AUTO-001. After that, continue AUTO-003 scheduling and repeated on-time verification.
