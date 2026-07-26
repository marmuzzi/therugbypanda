# Sprint 5 Editorial Review Refactor Handoff

## Last verified

26 July 2026, Europe/Dublin.

## Status

Completed, merged, deployed and verified for the current production baseline.

## Pull request

PR #67 — **Sprint 5: refactor editorial review tool**

Merged into `main` on 26 July 2026.

Merge commit:

```text
e934cc7ea8e2fe222eb1f4d06b131c717b5fefb1
```

The corresponding Vercel production deployment is `READY`.

## Delivered structure

### Helper modules

- `sanity/components/EditorialReview/types.ts`
- `sanity/components/EditorialReview/constants.ts`
- `sanity/components/EditorialReview/formatting.ts`
- `sanity/components/EditorialReview/portableText.ts`
- `sanity/components/EditorialReview/editorialReview.ts`

### Extracted components

- `ReviewQueue`
- `EditorialReviewSummary`
- `DraftEditor`
- `AIEditorialReview`
- `FeaturedImagePanel`
- `SourcesPanel`
- `FactLedgerPanel`
- `WorkflowPanel`
- `AuditHistoryPanel`

`EditorialReviewTool.tsx` now acts primarily as the orchestration layer for article selection, state management, draft saving, AI review and workflow actions.

## Preserved and improved behaviour

- Existing workflow transition validation remains in place.
- Deterministic review blocking rules still gate approval and publication.
- AI review remains on demand and non-destructive.
- AI findings remain visible after edits and are marked **Out of date**.
- The action changes to **Run Review Again** after relevant edits.
- Rerunning replaces findings with a fresh review of the current draft.
- Switching articles clears findings from the previous article.
- The controlled QA article uses **drop goal** terminology.

## Related production history

- PR #63 introduced AI Editorial Review and is merged.
- PR #64 introduced a broken Editorial Review component.
- PR #66 repaired the build and restored the Sanity Tool component contract.
- PR #67 completed the maintainability refactor and QA improvements.

## Current source of truth

See `docs/27_Sprint_5_Production_State.md` for the current Sprint 5 production baseline and immediate next work.

## Completion rule

Always distinguish between implemented, committed, merged, deployed, verified in production, verified in authenticated Sanity Studio and documented.