# P0 — Dublin package-date candidate identity

Date: 1 September 2026
Issue: AUTO-004-P8
Priority: P0 / Critical
Status: Implemented; pending merge/deployment/production verification

## Production edge case

The first bounded recovery after PRs #329/#330 crossed midnight in Dublin. Runtime evidence showed newly generated candidates still carried IDs such as `current-2026-08-31-<fingerprint>` because PR #329 derived the date component from the source article's `primaryPublishedAt` timestamp.

PR #330 correctly requires Zoho to select only IDs belonging to the current Dublin operational package date. After midnight on 1 September, that means `current-2026-09-01-*`. A perfectly valid fresh development first published on 31 August can therefore be part of the 1 September newsroom window while still receiving a 31 August candidate ID. That creates an identity mismatch and would make the protected Zoho gate reject a complete package.

## Root cause

Candidate identity combined two different concepts:

- story identity: the normalized subject + development fingerprint;
- package identity: the operational newsroom date.

The story fingerprint was correct, but the prefix date came from source publication time rather than the Europe/Dublin package date.

## Fix

- Candidate IDs now use `current-<Europe/Dublin operational date>-<story fingerprint>`.
- The fingerprint remains derived from normalized subject + development, so retries/reordering within the same package remain stable.
- Source publication time remains in `editorialPosition.occurredAt` and source records; it is no longer misused as package identity.
- `batchId` and explicit `packageDate` now use the same Dublin operational date as the daily-package endpoint.
- No freshness window is weakened: the 36-hour discovery horizon and 14-day story freshness history remain independent of package identity.

## Acceptance

A production 1 September run must demonstrate that fresh 31 August source developments can be selected where still current, while all resulting draft IDs carry the 1 September package prefix. Exactly five distinct eligible current-package drafts must exist before image enrichment and Zoho delivery.

Resolution date: pending production verification.
