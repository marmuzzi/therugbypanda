# Editorial Review Draft Perspective Fix

Date: 2026-07-26

## Problem

The Editorial Review queue explicitly queries Sanity documents whose IDs match `drafts.*`, but the custom Studio tool created its client with the default published perspective. The published perspective excludes draft documents, so manually created unpublished articles could never appear even after the queue filter treated a missing `workflowStatus` as `draft`.

## Root cause

`useClient({ apiVersion })` used the default published perspective. The queue query requires an authenticated non-CDN client using the raw perspective because it needs draft document IDs as separate records.

## Correction

- Configure the Editorial Review Studio client with `perspective: "raw"`.
- Disable CDN use for the draft-aware query.
- Preserve the existing queue filter and workflow-status normalisation.
- Preserve Sanity as the mandatory human approval and publication boundary.

## Verification

1. Deploy the hosted Sanity Studio from `main`.
2. Open Editorial Review.
3. Confirm the manually created unpublished article “I'll make it” appears as `draft`.
4. Put Make in Detect new values mode.
5. Submit the article for review.
6. Verify the application notification log and Make webhook receipt.
