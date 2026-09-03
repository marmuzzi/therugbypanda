# 3 September 2026 — evidence-priority recovery

## Status

PR #374 is merged on `main`. PR #375 is also merged and triggered bounded production Actions run `33698101024` against the repaired evidence-priority path. Production verification is in progress; the feature is not closed until the run proves the exact-five/image/Zoho contract.

## Measured trigger

Production Actions run `33693469651` failed in `Import exactly five fresh production-eligible drafts` before image planning. Vercel production logs show that Publication Review #2 rejected several generated candidates because the acquisition evidence was too thin for the rugby claims the article was expected to make. Examples included an Ulster/Joe Schmidt story without named affected players, an All Blacks 6-2 bench story without likely personnel or role detail, and a Jonah Lomu film story without basic rugby touchstones. One Rassie Erasmus candidate did pass and created a morning-package-eligible Sanity draft.

A separate candidate was rejected because a correction leaked an internal `Confirm which...` instruction into the reader-facing disclosure. That remains fail-closed and is not being waived.

Zoho was not called because the exact-five draft gate failed, so all image and delivery steps were skipped.

## Root cause

The concrete-evidence pre-generation gate treated broad personnel words such as `coach`, `captain`, `return` and `contract` as if they always described a match/selection event. That incorrectly rejected useful non-match rugby stories unless they also contained a date, score, venue or Test ordinal. At the same time, accepted candidates retained source order rather than prioritising the strongest evidence packs first, so title-level/weakly corroborated candidates could consume the bounded generation budget ahead of richer candidates.

## PR #374 — fix

The evidence gate now:

1. reserves the date/score/venue requirement for genuinely match/selection-shaped stories;
2. de-duplicates substantive facts before assessing evidence sufficiency;
3. separates direct named-person anchors in the candidate title/position from publisher/brand names;
4. scores accepted candidates deterministically by independent publisher depth, distinct facts, direct named-person anchors and concrete rugby/date/venue markers;
5. writes the scored priority order into the evidence report and current batch provenance;
6. keeps the existing fail-closed minimum of five evidence-sufficient candidates before model generation.

No freshness, originality, Publication Review, package diversity, image relevance/rights, exact-five, exact-one Zoho or human publication boundary is relaxed.

## PR #375 — bounded production trigger

PR #375 updates only the versioned recovery trigger and started Actions run `33698101024` against merged `main`. This is the production verification run for #374. It does not change editorial or delivery behaviour.

## Verification required

Production verification must show that run `33698101024` (or a directly subsequent bounded recovery if it exposes a new measured P0) selects stronger evidence first, produces exactly five review-ready current drafts, passes strict image verification and results in exactly one Zoho package (`sent` or idempotent `already-sent`). If another measured P0 appears, that becomes the next recovery target.
