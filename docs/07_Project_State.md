# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

12 September 2026 during Saturday Leinster v Zebre pre-match readiness work in PR #506. This state includes merged PRs #499-#505, current production deployment evidence, and the corrected budget contract.

## Read first

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. newest dated evidence/handoff document
5. `docs/99_2026-09-04_AI_Cost_Routing_And_Daily_Budget.md`

Newer measured evidence supersedes older state statements where they conflict.

## Launch contract

- Europe/Dublin operational day.
- Five fresh, genuinely distinct review-ready drafts, delivered individually as each becomes ready.
- At least 3/5 direct Irish connections; at most 2 international-only.
- Genuine follow-ups/new match phases are fresh; same-phase rewrites remain duplicates.
- Up to three distinct stories may concern the same canonical matchup/team when the developments materially differ.
- Verified official story-specific social/video embed is mandatory before review delivery.
- Local Sanity imagery is optional and must be omitted when it is not independently relevant.
- Sanity is the human publication boundary; never auto-publish.
- OpenAI application hard ceiling is `$0.40/day` in Europe/Dublin.
- Normal production target is `<= $0.30/day`; five empty slots reserve `$0.275` at `$0.055` each.
- Terra only generates an approved article; Luna performs Publication Review/bounded repair.
- One paid candidate per missing slot; no paid retry/replacement loop.
- Free discovery, evidence, canonical freshness, diversity and media qualification happen before paid generation.

## Current production architecture

The canonical newsroom path is:

`discovery -> evidence -> match-detail parity -> canonical freshness/paid-attempt eligibility -> bounded free refill if thin -> Ireland-first/diversity -> slot budget -> Terra -> Luna -> mandatory official media -> progressive delivery -> human Sanity publication`.

Canonical qualification is the only recent-position freshness decision. Downstream slot planning must not reinterpret freshness. Same-day `production-draft:` reservation IDs are authoritative and excluded before capacity/diversity planning.

## Changes merged after the previous reconciliation

- PR #499 expanded Irish launch discovery coverage.
- PRs #500/#501 performed the final 11 September launch recovery trigger sequence without weakening launch gates.
- PR #502 tightened cross-source clustering and blocks cross-sport/cross-story contamination before spend.
- PR #503 ran a zero-model reserve proof after the clustering fix.
- PR #504 made production-history qualification retained-aware.
- PR #505 ran the retained-aware zero-model proof. That proof reached slot planning after editorial gates but failed because the proof workflow still used the legacy production-history script instead of the canonical-pool script. This is a proof-harness drift defect, not evidence that production freshness should be weakened.
- PR #506 repairs that proof-harness drift and restores the owner-approved `$0.40` hard / `<= $0.30` normal budget contract before Saturday production.

## Latest measured deployment state

Before PR #506, Vercel production is READY on main SHA `e6a4f023159b3688eb774d51a0de918f84d195d8` from PR #505 (`dpl_AVn6LFuYfGxpzhR9rwf7FKWK6rZq`). PR #506 requires a new exact-SHA READY deployment and production proof before it can be considered complete.

## Saturday 12 September Leinster priority

Leinster v Zebre Parma is at Laya Arena at 14:30 Dublin time. Fresh team-selection evidence is now available: Max Deegan captains; Fintan Gunne starts at scrum-half; Caspar Gabriel at out-half; Alex Usanov at loosehead. This is a materially newer match phase than prior Leinster player-profile coverage and should receive package priority if it passes the normal two-publisher evidence, freshness, diversity and official-media gates.

Match build-up may produce more than one Leinster story only where each story is a genuinely distinct development or recognised phase. Team selection, venue/test-event context and a genuinely new late personnel development can be separate; rewrites of the same team announcement cannot.

## Current launch blockers to verify today

1. Prove the corrected zero-model reserve path on PR #506/main.
2. Verify the current-day canonical pool can supply five distinct positions with at least three Irish-connected.
3. Verify the newly available Leinster team-selection position is independently corroborated and fresh against recent production history.
4. Keep the planned daily reservation at or below `$0.30`; the hard guard must block above `$0.40`.
5. Verify every generated article passes Luna and has a directly relevant official embed before delivery.

## Go-live definition

Go-live is verified only when five distinct fresh articles for the Dublin day have individually passed editorial review and mandatory official-media gates, at least three are Irish-connected, Vercel production is on the exact merged SHA, Sanity readback is correct, and publication remains human-controlled.
