# 28 August 2026 — AUTO-004 Freshness Gate Production Deployment

## Outcome

PR #294 is merged at production commit `0532fe8095d2fcc9dd31e09721d1329a714c04ab` and the corresponding Vercel production deployment reached READY.

The production acquisition import path now invokes the deterministic freshness selector before any `/api/editorial/draft` generation call. Candidate identity is evaluated as subject + event/development + editorial angle; headline/source/prose changes do not make a repeated position fresh. The selector also rejects within-package duplicates and fails closed unless exactly five distinct positions survive.

## Build recovery

The first #294 preview failed TypeScript because `StoryFreshness.test.ts` imported `vitest`, which is not installed. The branch was repaired without adding a dependency by converting the regression tests to Node's built-in `node:test` and `node:assert/strict`. The replacement preview completed successfully, including TypeScript and static-page generation, before merge.

## Production evidence

- PR: #294
- Merge SHA: `0532fe8095d2fcc9dd31e09721d1329a714c04ab`
- Vercel production deployment: `dpl_3WGra1KqX7yNseoHSwr5ZzHFSDMZ`
- Deployment state: READY
- Production aliases include `therugbypanda.ie` and `www.therugbypanda.ie`
- Live homepage returned HTTP 200 after deployment.

## Verification boundary

This closes the code/deployment portion of the pre-generation freshness enforcement but does **not** close AUTO-004. The import path still requires a recent editorial-position history input (`RECENT_EDITORIAL_POSITIONS_PATH` or the repository default history file) and deliberately fails closed when history is unavailable. Consecutive normal scheduled morning packages must still prove that exactly five genuinely new positions are selected before generation.

Existing originality, factual, style-diversity, Draft Ready, Publication Review, image-relevance and human Sanity publication gates are unchanged.

Media baseline remains 241 strict publication-ready local Sanity assets per `docs/54_2026-08-28_Sunday_Recovery_Media_and_Source_Evidence.md`; MEDIA-009 remains open pending current-five assignment/readback proof.
