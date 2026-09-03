# 3 September 2026 — Image planner/verifier parity P0

## Measured production failure

Bounded production recovery run `33702511350` reached five eligible drafts, completed visual eviction, regenerated the single missing slot, acquired/reconciled additional Editorial Images, and then failed closed in the final assignment step:

`No verified relevant hero candidate for current-2026-09-03-303865f55eeb. Fail closed before Zoho.`

The final image-plan artifact reported three local candidates for that story, all France–South Africa match images. The story itself is a South Africa/New Zealand rivalry story. The retained featured asset was also not assignment-safe: its metadata describes a women’s Air Force rugby tournament in New Zealand. The final verifier correctly rejected these assets.

## Root cause

`scripts/plan-daily-article-images.mjs` and `scripts/enrich-current-morning-visuals.mjs` did not enforce identical hard team-context semantics.

The planner accepted an image when at least one detected image team overlapped the story header. The final verifier correctly rejects an image when it introduces any team context not present in the article. The planner also did not read the same `people` / `competitionEvent` metadata used by the final verifier.

This mismatch let the workflow believe image depth was sufficient, suppressing the correct acquisition/eviction response until the final fail-closed stage.

## Repair

Branch `fix/sep3-image-planner-verifier-parity` updates the planner to:

- canonicalize aliases (`All Blacks` → `New Zealand`, `Springboks` → `South Africa`, `Wallabies` → `Australia`, `Pumas` → `Argentina`);
- reject any detected image-team context outside the article title/header team set;
- use canonical team identities for inline matching as well;
- query and evaluate `people` and `competitionEvent`, matching the metadata available to final verification;
- preserve women/men context rejection, named-person rejection, non-rugby rejection, fail-closed image depth and the final verifier unchanged.

This is a stricter planning fix. It does not weaken image relevance to make the package pass.

## Required production verification

The repair is not complete until a bounded production recovery proves all of the following:

1. the unsafe France-context and women-context assets are not counted as valid candidates for `current-2026-09-03-303865f55eeb`;
2. planner deficits trigger bounded image acquisition and/or visual eviction rather than failing only at the final verifier;
3. the exact current package finishes with five fresh production-eligible review-ready drafts and relevant verified heroes/inline images;
4. package diversity/freshness/review gates remain active;
5. exactly one consolidated Zoho editorial package is accepted, or the exact-package delivery lock proves it was already sent;
6. no article is automatically published and no Meta/social work is performed.

## Delivery state at diagnosis

Zoho was **not sent** by run `33702511350`; the delivery step was skipped after final image verification failed.