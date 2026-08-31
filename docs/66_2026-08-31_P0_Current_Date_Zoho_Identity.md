# P0 — Bind Zoho delivery to the current Dublin package

Date: 31 August 2026
Issue: AUTO-004-P8
Priority: P0 / Critical
Status: Implemented, pending deployment and next-package production verification

## Measured production evidence

Recovery run `33443459968` reached five eligible drafts and Zoho accepted one five-article email. However, the downstream MEDIA-011 workflow immediately queried the same production CMS and found only four current morning-package drafts. That proved the email endpoint's previous global eligible-draft query could fill its five slots using an older eligible draft.

This means the email was a useful transport proof, but it does **not** satisfy the exact-current-five acceptance contract.

## Root cause

`/api/editorial/daily-package` selected from all production drafts with `morningPackageEligible=true`, regardless of the current Europe/Dublin operational date. Its diversity selector could therefore backfill a missing current slot with an older eligible article.

## Fix

- Compute the Europe/Dublin operational package date before the Sanity query.
- Require `editorialInputId match current-YYYY-MM-DD-*` in addition to the existing production eligibility and workflow-state gates.
- Fail closed with HTTP 409 if fewer than five current-date editorially distinct drafts exist.
- Include `packageDate`, `packageInputPrefix`, exact article IDs and exact editorial input IDs in successful delivery response/evidence.
- Preserve the existing idempotent Zoho delivery lock and human publication boundary.

The endpoint can no longer make a current package appear complete by silently selecting an older eligible draft.

## Related work

- PR #327 — incremental same-day recovery.
- PR #328 — broaden corroborated recovery pool.
- PR #329 — stable story IDs and retained-ID collision guard.
- PR #330 — current-date Zoho package identity gate.

## Verification boundary

Production-complete requires a current operational-date run where five current-date eligible drafts exist, the endpoint returns exactly their IDs, and the single accepted Zoho evidence record contains those same five. No old or partial package is acceptable.

Resolution date: pending production verification.
