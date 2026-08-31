# P0 — Exactly five created drafts gate

Date: 31 August 2026

## Defect found

The protected acquisition importer previously considered any HTTP 2xx response from `/api/editorial/draft` a successful imported position. That endpoint can legitimately return HTTP 200 when the Editorial Brain decides not to draft a story. In that case no eligible Sanity draft is created, but the importer could still exit successfully and allow the coupled Zoho package step to run.

This violated the normal morning contract because a nominally successful acquisition workflow could contain fewer than five actual review-ready Sanity drafts.

## Permanent repair

PR #320, merged at `272bb6ccdca735e7ca09206aac175216b8b9b95b`, changes `scripts/import-editorial-acquisition-batch.mjs` to fail closed unless every generated selected position returns all of:

- HTTP success;
- `status: draft-created`;
- a concrete Sanity draft id;
- `morningPackageEligible: true`.

The importer also applies a package-creation gate requiring the number of successfully created eligible drafts to equal the number of selected positions that were expected to be generated. A non-draft HTTP 200 now counts as failure rather than success.

The existing freshness selector remains upstream of generation and still requires exactly five genuinely distinct positions against recent production Sanity history using subject + development/event + editorial angle. Originality, Draft Ready, Publication Review and mandatory human Sanity publication approval are unchanged.

## Status

- implemented: yes;
- committed: yes, `34e7275ea62cf859f1b58107b352751ce5b56d84`;
- merged: yes, PR #320 / `272bb6ccdca735e7ca09206aac175216b8b9b95b`;
- preview build: completed successfully;
- production deployment: started automatically from merged `main`; final READY verification is still required;
- production functional proof: pending the next genuine normal current-source execution.

## Acceptance effect

Zoho can no longer be unlocked merely because all five editorial API calls returned HTTP 2xx. The fresh-package path must now actually create the expected eligible Sanity drafts before acquisition is considered successful.
