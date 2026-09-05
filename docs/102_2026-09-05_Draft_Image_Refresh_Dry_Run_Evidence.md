# Draft Image Refresh Dry-Run Evidence — 5 September 2026

## Production dry-run #2

GitHub Actions run `33962165409` completed successfully on main commit `6c318d5724ba96c546658a95089d9caca32f6d27` with `APPLY_CHANGES=false`.

Measured result:

- 30 unpublished production drafts scanned.
- 4,715 rights-approved Editorial Images available to the matcher.
- 27 drafts were proposed for image replacement under the initial score policy.
- 2 drafts remained unchanged.
- 1 draft had no safe match.
- No Sanity mutations occurred.

## Safety finding

The dry-run proved the scope repair worked, but it also exposed several low-confidence proposed replacements with best scores below a team-context floor (examples: scores 8, 12 and 20). Those should not be applied automatically simply because the current hero is absent from, or fails, the current approved-library matcher.

The automatic refresh therefore remains fail-closed pending a stricter minimum candidate score. The `Welcome to The Rugby Panda` owned launch article is also excluded from automatic refresh so its deliberate original Rugby Panda photography is not replaced by generic library material.

No OpenAI calls are part of this workflow. Human publication remains mandatory.
