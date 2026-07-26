# Sprint 5 Editorial Review Refactor Handoff

## Last verified

26 July 2026, Europe/Dublin.

## Repository and connector status

- Repository: `marmuzzi/therugbypanda`
- Default branch: `main`
- GitHub connector: available with read/write access
- Documentation remains the source of truth

## Verified pull-request state

- PR #62 is merged and provides deterministic Editorial Review Intelligence.
- PR #63 is merged and provides the first AI Editorial Review implementation.
- PR #64 is merged but introduced a broken Editorial Review component.
- PR #66 is merged and repaired the build and Sanity `Tool` component contract.
- PR #65 remains open as a draft and duplicates/reworks the AI Editorial Review implementation. Do not merge it without a deliberate comparison and decision.

## Verified `main` state

At the time of this handoff, `main` contains the repaired monolithic file:

```text
sanity/components/EditorialReviewTool.tsx
```

The file is approximately 563 lines and still contains its types, constants, formatting helpers, Portable Text conversion, deterministic review logic and panel rendering in one component.

The following modular files discussed and apparently committed during the 25 July browser-editing session are **not present on `main`**:

```text
sanity/components/EditorialReview/types.ts
sanity/components/EditorialReview/constants.ts
sanity/components/EditorialReview/formatting.ts
sanity/components/EditorialReview/portableText.ts
sanity/components/EditorialReview/editorialReview.ts
sanity/components/EditorialReview/ReviewQueue.tsx
sanity/components/EditorialReview/EditorialReviewSummary.tsx
sanity/components/EditorialReview/DraftEditor.tsx
sanity/components/EditorialReview/AIEditorialReview.tsx
```

The current `main` version of `EditorialReviewTool.tsx` also does not import those modules.

Therefore, do not describe the modular refactor as merged, deployed or present on `main` until the missing commits or branch are located, or the refactor is recreated and committed deliberately.

## Work completed conceptually on 25 July

A component extraction plan was designed and reviewed in this order:

1. helper types and utility modules;
2. `ReviewQueue`;
3. `EditorialReviewSummary`;
4. `DraftEditor`;
5. `AIEditorialReview`;
6. `FeaturedImagePanel`;
7. `SourcesPanel`;
8. `FactLedgerPanel`;
9. `WorkflowPanel`;
10. `AuditHistoryPanel`.

The user reported committing through `AIEditorialReview`, but those files and commits could not be found on `main` during the 26 July verification.

## Required next action

Before creating `FeaturedImagePanel`, reconcile the missing refactor work:

1. Check whether the 25 July GitHub web-editor commits exist on another branch or fork.
2. If found, review and merge or move them safely onto `main`.
3. If not found, recreate the refactor from the repaired `main` file using the established one-file-at-a-time workflow.
4. Only after `AIEditorialReview` is genuinely integrated on `main`, continue with `FeaturedImagePanel`.

## Required browser-editing workflow

The project owner works through the GitHub web editor. Preserve this sequence:

1. Create one new file.
2. Review it.
3. Commit it.
4. Integrate it into `EditorialReviewTool.tsx`.
5. Review the integration.
6. Commit the integration.

Do not ask the user to edit several files before committing.

## Remaining refactor order

Once the missing work is reconciled:

1. `FeaturedImagePanel`
2. `SourcesPanel`
3. `FactLedgerPanel`
4. `WorkflowPanel`
5. `AuditHistoryPanel`

## Completion and verification rule

Always distinguish:

- designed;
- implemented locally or in an editor;
- committed;
- present on `main`;
- deployed;
- verified in production;
- verified in authenticated Sanity Studio;
- documentation updated.

No refactor step is complete merely because code appeared in a chat or an unverified browser editor session.
