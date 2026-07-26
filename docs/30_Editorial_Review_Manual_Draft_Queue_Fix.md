# Editorial Review Manual Draft Queue Fix

Date: 2026-07-26

## Problem

A newly created article draft in Sanity Studio did not appear in the Editorial Review queue.

## Root cause

The queue GROQ query required `workflowStatus` to already contain one of the supported workflow values. Manually created Sanity drafts do not necessarily receive `workflowStatus` until the controlled editorial workflow first updates them, so valid new drafts were excluded before the editor could submit them for review.

## Required correction

- Treat a missing `workflowStatus` as `draft` in the queue filter.
- Project the same normalised value into the Editorial Review UI so workflow actions resolve correctly.
- Preserve all existing workflow states and the mandatory human approval boundary.
- Do not publish or approve any article automatically.

## Verification

1. Build the application successfully.
2. Merge and deploy the website/API change.
3. Deploy the hosted Sanity Studio separately.
4. Confirm a manually created unpublished article appears in Editorial Review as `draft`.
5. With Make listening, submit that article for review and inspect NOTIFY-001 delivery logs.
