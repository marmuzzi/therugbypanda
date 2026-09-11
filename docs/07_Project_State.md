# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

11 September 2026 before the Leinster/Zebre pre-match production check.

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
- Leinster match build-up has editorial priority for the 12 September 2026 Leinster v Zebre pre-season test event, but repetitive same-phase angles remain duplicates.
- A genuine follow-up or new match phase is fresh even when it concerns the same match; same-phase rewrites remain duplicates.
- Up to three distinct stories may concern the same canonical matchup/team when each has a materially different development.
- Mandatory verified official story-specific social/video embed before review delivery.
- Local Sanity imagery is optional and must be omitted when it is not independently relevant.
- Sanity remains the human publication boundary; never auto-publish.
- OpenAI application reservation hard ceiling `$0.40/day`; normal operating target `<= $0.30/day`.
- Free discovery, evidence, freshness, diversity, media qualification and slot planning before model spend.
- Terra is used only for approved article generation; Luna is used for publication review/repair.
- One paid candidate per missing slot; no paid replacement loop.
- Canonical pre-AI pool target is **missing paid slots + three reserve candidates**. When the first qualification pass is short, the workflow performs one expanded free discovery/corroboration refill before the final fail-closed gate.

## Latest measured production state

PR #476 introduced the canonical editorial pool. Production proof `34521048860` verified progressive freshness tests and the canonical gate, but exposed two deterministic defects: the pool threshold did not account for two valid retained current-day drafts, and the workflow aborted before the promised free refill. The run measured 228 leads → 12 corroborated → 5 evidence-qualified → 4 match-detail-qualified → 2 fresh and made no paid reservation.

PR #477 made the canonical pool missing-slot-aware and added a bounded second free discovery/corroboration pass. Vercel production deployment `dpl_HNzEqJD6vWPwC1fHVQtjYghwJ9Sg` reached READY on merge SHA `96daee709b11cf457cf9f28b5a18709c367cb238`.

PR #478 removed the remaining fail-early path so a thin first pass is advisory while the post-refill evidence, match-detail, freshness and diversity gates remain strict. Vercel production deployment `dpl_39t6UddKMyHKfaGpHsypY5sS5wQU` is READY on merge SHA `d5fe564ffd1fb52f38c0e86635dee33245c161c5`.

The 11 September pre-match readiness change lowers the application AI hard ceiling to `$0.40/day` and the normal operating target to `<= $0.30/day`. Production verification of this new ceiling is pending the current launch-readiness run.

## Current launch blockers

1. Production-verify the #477/#478 free-refill path on current production data.
2. Demonstrate enough legitimate fresh supply for five daily positions with at least three direct Irish connections and three reserve candidates before paid generation.
3. Demonstrate Leinster/Zebre build-up can contribute strong distinct positions without repetitive same-phase coverage.
4. Complete a legitimate paid package within the `$0.40` hard guard / `<= $0.30` normal target without paid retry loops.
5. Production proof of local-image cleanup on exact-embed drafts.
6. Story-specific official embed coverage for every selected candidate; if media cannot be verified, replace the candidate before paid generation where possible.
7. Five genuinely distinct review-ready articles in one Dublin-day package with progressive individual delivery.

## Go-live states

1. evidence-complete Ireland-first reserve;
2. five distinct fresh positions with recent-position repetition protection and progressive match-day follow-ups allowed;
3. verified official story-specific embed for every article;
4. local image only when exact/relevant, otherwise omit it;
5. individual review delivery after editorial and embed gates;
6. owner review and explicit publication in Sanity.
