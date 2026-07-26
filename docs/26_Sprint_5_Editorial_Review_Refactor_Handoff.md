# Sprint 5 Editorial Review Refactor Handoff

## Last updated

26 July 2026, Europe/Dublin.

## Working branch

Continue all current refactor work on:

```text
feat/pr67-editorial-dna
```

Do not assume the extracted components are already on `main`. At this handoff point, the branch is ahead of `main` and contains the active Sprint 5 refactor.

## Objective

Refactor `sanity/components/EditorialReviewTool.tsx` from a large monolithic component into a thin orchestration layer composed of focused React components and helper modules.

## Required workflow

The project owner works through the GitHub web editor. Preserve the following sequence for each extraction:

1. Create one new component.
2. Review it.
3. Commit it.
4. Integrate it into `EditorialReviewTool.tsx`.
5. Review the integration.
6. Commit the integration.

Do not combine multiple unreviewed file changes into one step.

## Completed and committed on the feature branch

Helper modules:

- `sanity/components/EditorialReview/types.ts`
- `sanity/components/EditorialReview/constants.ts`
- `sanity/components/EditorialReview/formatting.ts`
- `sanity/components/EditorialReview/portableText.ts`
- `sanity/components/EditorialReview/editorialReview.ts`

Extracted components:

- `sanity/components/EditorialReview/ReviewQueue.tsx`
- `sanity/components/EditorialReview/EditorialReviewSummary.tsx`
- `sanity/components/EditorialReview/DraftEditor.tsx`
- `sanity/components/EditorialReview/AIEditorialReview.tsx`

All four extracted components are integrated into `sanity/components/EditorialReviewTool.tsx` on the feature branch.

## Current next extraction

Create:

```text
sanity/components/EditorialReview/FeaturedImagePanel.tsx
```

The component should own the existing display of:

- approved featured image or missing-image message;
- caption and credit;
- editorial angle;
- audience promise;
- editorial confidence;
- human fact-check requirement.

It should receive a `ReviewArticle` prop and use `cardStyle` plus `displayConfidence` from the extracted helpers.

## Remaining extraction order

1. `FeaturedImagePanel`
2. `SourcesPanel`
3. `FactLedgerPanel`
4. `WorkflowPanel`
5. `AuditHistoryPanel`

## Current verification status

The branch contains the modular refactor through `AIEditorialReview`. The remaining panels are still rendered inline in `EditorialReviewTool.tsx`.

The refactor is committed on the feature branch but is not yet merged into `main`, deployed, or verified in authenticated Sanity Studio.

## Important repository state

PRs #63 and #64 for AI Editorial Review are merged. PR #66 restored the Editorial Review build and Sanity tool contract on `main` before this branch-level modular refactor.

Always distinguish:

- implemented;
- committed;
- merged;
- deployed;
- verified in production;
- verified in authenticated Sanity Studio;
- documentation updated.
