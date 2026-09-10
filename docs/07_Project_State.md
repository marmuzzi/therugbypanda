# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

10 September 2026 after source expansion, freshness-order repair and reciprocal source-cluster deduplication through PR #466.

## Read first

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. newest dated evidence/handoff document
5. `docs/99_2026-09-04_AI_Cost_Routing_And_Daily_Budget.md`

Newer measured evidence supersedes older state statements where they conflict; Git history and dated evidence preserve historical decisions.

## Launch contract

- Europe/Dublin operational day.
- Five fresh, genuinely distinct review-ready drafts, delivered individually as each becomes ready.
- At least 3/5 direct Irish connections; at most 2 international-only.
- Mandatory verified official story-specific social/video embed before review delivery.
- Local Sanity imagery is optional and must be omitted when it is not independently relevant.
- Sanity remains the human publication boundary; never auto-publish.
- OpenAI application reservation ceiling `$0.40/day`.
- Free discovery, evidence, freshness, diversity, media qualification and slot planning before model spend.
- One paid candidate per missing slot; no paid replacement loop.

## 10 September measured production state

PRs #461-#463 expanded Irish discovery and corrected rugby/non-rugby qualification. PR #464 added person-team coherent current-story clustering. PR #465 restored the required execution order so 14-day production-history freshness runs before Ireland-first/team diversity. Zero-model proof `34462078361` then mechanically produced five assignable slots with three Irish-connected positions, but inspection found reciprocal source clusters could still create duplicate story candidates.

PR #466 removes reciprocal source-cluster duplicates before evidence qualification and excludes generic team names such as `Chiefs` from distinctive person anchors. Production deployment `dpl_GvpyBkZgZeb6cFMVQC9E2xQKakMx` is READY on merged SHA `36979dbf03dd3b73ea3a56a1d867c699c982df0b`.

Zero-model production-data proof `34479627476` verified the new clustering regressions and removed 18 reciprocal source-cluster duplicates. After evidence and 14-day history freshness, only four genuinely fresh candidates remained, so the workflow correctly failed closed before diversity and model spend. This is the current launch blocker: insufficient fresh distinct supply, not duplicate leakage.

## Budget

The hard ceiling remains `$0.40` per Europe/Dublin operational day. The 10 September recovery and reserve proofs through PR #466 used zero model generation; the failing #466 proof stopped before any paid reservation.

## Current launch blockers

1. Expand the fresh distinct evidence reserve until at least five candidates survive source-cluster deduplication and 14-day production-history freshness, with capacity for at least three Irish-connected stories.
2. Production proof of PR #459 local-image cleanup on exact-embed drafts.
3. Story-specific official embed coverage for every selected candidate; if media cannot be verified, replace the candidate before paid generation where possible.
4. Five genuinely distinct articles in one Dublin-day package under the `$0.40` ceiling.
5. Continued proof that the simplified scheduled workflow does not retry paid failures or force irrelevant images.

## Go-live states

1. evidence-complete Ireland-first reserve;
2. five distinct fresh positions with recent-position repetition protection;
3. verified official story-specific embed for every article;
4. local image only when exact/relevant, otherwise omit it;
5. individual review delivery after editorial and embed gates;
6. owner review and explicit publication in Sanity.
