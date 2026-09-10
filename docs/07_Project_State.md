# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

10 September 2026 after canonical-pool production proof `34521048860` and overnight preflight refill correction.

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
- A genuine follow-up or new match phase is fresh even when it concerns the same match; same-phase rewrites remain duplicates.
- Up to three distinct stories may concern the same canonical matchup/team when each has a materially different development.
- Mandatory verified official story-specific social/video embed before review delivery.
- Local Sanity imagery is optional and must be omitted when it is not independently relevant.
- Sanity remains the human publication boundary; never auto-publish.
- OpenAI application reservation hard ceiling `$0.75/day`; normal operating target `<= $0.40/day`.
- Free discovery, evidence, freshness, diversity, media qualification and slot planning before model spend.
- One paid candidate per missing slot; no paid replacement loop.
- Canonical pre-AI pool target is **missing paid slots + three reserve candidates**. When the first qualification pass is short, the workflow performs one expanded free discovery/corroboration refill before the final fail-closed gate.

## 10 September measured production state

PRs #461-#471 expanded Irish discovery, repaired qualification/clustering/freshness ordering, enabled progressive match-day freshness and expanded targeted Irish discovery.

PR #473 raised the application hard ceiling from `$0.40` to `$0.75` while preserving the normal `<= $0.40` operating target and zero paid replacement loops. Contract run `34519883794` passed on merged SHA `1c049e81ff01f128460bf911ecab371dc01f87dd`.

PR #474 added the dedicated canonical current-source production trigger. Run `34520032921` measured 233 leads → 12 distinct corroborated → 5 evidence-qualified → 5 match-detail-qualified → 2 fresh after 14-day history and stopped before spend.

PR #476 introduced the canonical editorial pool. Production proof `34521048860` verified progressive freshness tests and the canonical gate, but exposed two deterministic defects: the pool threshold did not account for two valid retained current-day drafts, and the workflow aborted before the promised free refill. The run measured 228 leads → 12 corroborated → 5 evidence-qualified → 4 match-detail-qualified → 2 fresh and made no paid reservation.

The overnight preflight correction makes the pool missing-slot-aware and adds a bounded second free discovery/corroboration pass using expanded deterministic limits before final qualification. Final package diversity still requires three reserve candidates and no paid retry loop is introduced.

## Budget

The owner-approved hard ceiling is `$0.75` per Europe/Dublin operational day. The normal operating target is `<= $0.40/day`; extra headroom is bounded same-day recovery capacity, not a spending target. A production slot reserves `$0.055`. Deterministic qualification remains mandatory before reservation and paid retry loops remain disabled.

Run `34521048860` stopped before diversity/slot planning/generation and therefore added no Terra/Luna spend.

## Current launch blockers

1. Production-verify the missing-slot-aware canonical pool plus automatic free refill on current production data.
2. Demonstrate enough legitimate fresh supply for five daily positions with at least three direct Irish connections and three reserve candidates before paid generation.
3. Complete a legitimate paid package using the `$0.75` hard guard / `<= $0.40` normal target without paid retry loops.
4. Production proof of PR #459 local-image cleanup on exact-embed drafts.
5. Story-specific official embed coverage for every selected candidate; if media cannot be verified, replace the candidate before paid generation where possible.
6. Five genuinely distinct review-ready articles in one Dublin-day package with progressive individual delivery.

## Go-live states

1. evidence-complete Ireland-first reserve;
2. five distinct fresh positions with recent-position repetition protection and progressive match-day follow-ups allowed;
3. verified official story-specific embed for every article;
4. local image only when exact/relevant, otherwise omit it;
5. individual review delivery after editorial and embed gates;
6. owner review and explicit publication in Sanity.
