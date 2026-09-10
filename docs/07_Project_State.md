# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

10 September 2026 after owner-approved `$0.75/day` hard ceiling and same-day production verification attempt through PR #474.

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

## 10 September measured production state

PRs #461-#471 expanded Irish discovery, repaired qualification/clustering/freshness ordering, enabled progressive match-day freshness, expanded the targeted reserve to 10 supplementary sources / 61 searches, and produced a green zero-model reserve proof earlier in the day.

PR #473 raises the application hard ceiling from `$0.40` to `$0.75` while preserving the normal `<= $0.40` operating target and zero paid replacement loops. Launch recovery contract run `34519883794` passed on merged SHA `1c049e81ff01f128460bf911ecab371dc01f87dd`. Vercel production deployment `dpl_EYZNLVWUuLcmSaQyrBmAZ1got9yP` reached READY on that SHA.

PR #474 adds a dedicated trigger for the canonical current-source production workflow so manual verification does not also invoke the legacy recovery workflow. Production verification run `34520032921` ran on current main and passed discovery, evidence and match-detail gates, but failed closed at production-history freshness: 233 leads → 12 distinct corroborated candidates → 5 evidence-qualified → 5 match-detail-qualified → only 2 fresh after 14-day history. Diversity, slot planning and paid generation were therefore correctly skipped. No Terra/Luna spend was added by this test.

The latest production deployment `dpl_AKRNALao9Adng7xNPGAcxWTEBfD6` is READY on trigger commit `56b0339be2e05b3218850b86580dc1a54417bab8`, which contains the merged #473/#474 code.

## Budget

The owner-approved hard ceiling is `$0.75` per Europe/Dublin operational day. The normal operating target is `<= $0.40/day`; extra headroom is bounded same-day recovery capacity, not a spending target. A production slot reserves `$0.055`. Deterministic qualification remains mandatory before reservation and paid retry loops remain disabled.

The application contract and production deployment for the new ceiling are verified. The 10 September paid production test did not reach reservation because the current source set had only two fresh candidates after history, so runtime reservation above the old `$0.40` boundary has not yet been exercised by a legitimate article slot.

## Current launch blockers

1. Restore at least three fresh missing-slot candidates at the moment of a production run; the 19:24 UTC test had only two after 14-day history.
2. Complete a legitimate paid package using the `$0.75` hard guard / `<= $0.40` normal target without paid retry loops.
3. Production proof of PR #459 local-image cleanup on exact-embed drafts.
4. Story-specific official embed coverage for every selected candidate; if media cannot be verified, replace the candidate before paid generation where possible.
5. Five genuinely distinct review-ready articles in one Dublin-day package with progressive individual delivery.

## Go-live states

1. evidence-complete Ireland-first reserve;
2. five distinct fresh positions with recent-position repetition protection and progressive match-day follow-ups allowed;
3. verified official story-specific embed for every article;
4. local image only when exact/relevant, otherwise omit it;
5. individual review delivery after editorial and embed gates;
6. owner review and explicit publication in Sanity.
