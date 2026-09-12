# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

12 September 2026 after PR #506 production deployment, zero-model reserve proof `34670697684`, and PR #507 Leinster team-selection clustering repair.

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
- Verified official story-specific social/video embed is mandatory before review delivery; irrelevant local imagery never substitutes.
- Sanity is the human publication boundary; never auto-publish.
- OpenAI hard ceiling `$0.40/day`; normal production target `<= $0.30/day`.
- Five empty slots reserve `$0.275` at `$0.055` each.
- Terra generates only approved articles; Luna performs Publication Review/bounded repair.
- One paid candidate per missing slot; no paid replacement loop.

## Current production architecture

`free discovery -> evidence -> match-detail parity -> canonical freshness/paid-attempt eligibility -> bounded free refill if thin -> Ireland-first/diversity -> slot budget -> Terra -> Luna -> mandatory official media -> progressive delivery -> human Sanity publication`.

Canonical qualification is the only recent-position freshness decision. Same-day `production-draft:` reservation IDs are authoritative and excluded before capacity/diversity planning.

## Saturday 12 September measured state

PR #506 is merged at SHA `066a592cd720fd4f5a9e1a74e2c4c5d5d80e215d`. Vercel production deployment `dpl_6XwZpDr5qmv2WK9JohDvUBXjKda8` is READY on that exact SHA. Launch recovery contract run `34670697723` passed.

Zero-model reserve proof `34670697684` passed every step on PR #506, including canonical qualification, bounded free refill, Ireland-first diversity and one-to-one slot planning. Measured output: 0 retained drafts, 5 missing slots, 6 fresh unpaid eligible positions, 3 Irish-connected candidates available, 5 selected candidates, `$0.000` reserved before, `$0.275` projected reservation, zero paid replacements. The preferred +3 reserve target was thin (1 reserve instead of 3) but the strict five-slot package minimum passed.

The proof also exposed a quality gap: discovery contained two fresh independent Leinster-Zebre team-selection reports — The42 led with Max Deegan captaining, while the Irish Independent led with Ryan Baird returning — but the clustering algorithm required too much shared person/title identity and failed to combine them as the same selection development. PR #507 fixes this without weakening freshness: same matchup + explicit team-selection phase can corroborate across different player-led headlines, while a generic preview remains separate from the later selection phase.

## Saturday Leinster priority

Leinster v Zebre Parma is at Laya Arena at 14:30 Dublin time. Fresh team-selection evidence includes Max Deegan as captain, Fintan Gunne at scrum-half, Caspar Gabriel at out-half, Alex Usanov at loosehead and Ryan Baird among the replacements. This is a materially newer phase than prior player-profile/build-up coverage and receives production priority if it passes the normal evidence, freshness, diversity and mandatory-media gates.

## Current launch blockers to verify

1. Run the canonical production workflow on code containing PR #507 and verify the Leinster selection reaches the qualified pool.
2. Keep the five-slot planned reservation at or below `$0.30`; `$0.40` remains the absolute guard.
3. Verify all generated drafts pass Luna; no paid retry loop is allowed.
4. Verify every review-ready draft has directly relevant official embedded media and is delivered progressively.
5. Five delivered review-ready articles, >=3 Irish-connected, remain the go-live proof.

## Go-live definition

Go-live is verified only when five distinct fresh articles for the Dublin day have individually passed editorial review and mandatory official-media gates, at least three are Irish-connected, Vercel production is on the exact merged code, Sanity readback is correct, and publication remains human-controlled.
