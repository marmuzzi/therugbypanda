# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

11 September 2026 after morning production recovery run `34566787385` and PRs #491-#495.

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
- Genuine follow-ups/new match phases are fresh; same-phase rewrites remain duplicates.
- Up to three distinct stories may concern the same canonical matchup/team when developments materially differ.
- Verified official story-specific social/video embed is mandatory before review delivery.
- Local Sanity imagery is optional and omitted when not independently relevant.
- Sanity is the human publication boundary; never auto-publish.
- OpenAI application reservation hard ceiling `$0.75/day`; normal operating target `<= $0.40/day`.
- Terra only for approved article generation; Luna for publication review/repair.
- One paid candidate per missing slot; no paid replacement loop.
- Canonical pool minimum is the number of missing package slots. Missing slots + three reserve is preferred and drives one bounded free refill; reserve shortage alone must not block a fillable five-story package.
- Same-day `production-draft:` reservations are authoritative eligibility state and must be excluded by canonical qualification before diversity/slot planning.

## Latest measured production state

Morning recovery run `34566787385` ran on production after the canonical paid-eligibility and reserve fixes. Discovery fetched 31/31 configured sources. First pass reached 268 leads after Irish augmentation; the bounded free refill then reached 327 leads. Eight candidates passed concrete evidence and match-detail parity. Canonical qualification correctly excluded two already-paid candidates, leaving six genuinely unpaid fresh positions for four missing slots. The reserve target of seven was one short, but the package minimum was satisfied.

Package diversity passed with one retained Irish draft, two additional Irish positions required and exactly two Irish-connected candidates available. Six total replacement candidates remained for four missing slots. Slot planning then selected exactly four candidates, selected the two required Irish-connected positions, reported zero paid replacements and `rejectedByFreshness: 0`. This production-proves that freshness and same-day paid eligibility are now canonical decisions rather than being reinterpreted downstream.

The four selected candidates were attempted serially once. Two reached Terra generation and Luna Publication Review but were rejected by the final review gate because their evidence did not support sufficiently concrete, clearly identified rugby journalism. Two others failed before OpenAI reservation because the runtime route incorrectly parsed organisation/competition phrases containing `Connacht` and `Global` as person surnames. No draft was persisted from those four attempts. The retained current-day Sanity draft remains `drafts.article-current-2026-09-11-ef6c895b53b9`.

PR #491 moves same-day paid-attempt eligibility into canonical qualification and removes the slot planner's second freshness interpretation. PR #492 aligns the launch contract regression with that single canonical boundary. PR #493 fixes the regression-test TypeScript integration. PR #494 makes the +3 reserve advisory after the mandatory missing-slot minimum and Irish quota have passed. PR #495 centralises runtime person-name heuristics so team/competition/publisher phrases such as `Connacht` and `WXV Global` do not create false person collisions while real names remain protected.

PR #495 is merged and production-deployed READY as Vercel deployment `dpl_495Y22SLQhPvKzvsQcsGKFYwmnc4` on merge SHA `9a13dd161ebd754d00dded959658d6f9aa2f86ec`.

## Current launch blockers

1. **Same-day five-story completion is blocked by the zero-paid-replacement contract.** Two candidates in run `34566787385` legitimately consumed their one paid attempt and were rejected by Luna Publication Review. They cannot be replaced with new paid candidates today without changing the approved contract.
2. The two candidates that failed only on the now-fixed runtime person-identity false positive did not reach OpenAI reservation and remain technically recoverable, but even two successful recoveries plus the retained draft would not produce five review-ready drafts while blocker 1 remains.
3. Mandatory verified official story-specific media is still required for every review-ready article. The retained Tommy O'Brien draft has not yet been production-proven with a qualifying exact official embed.
4. Publication Review correctly exposed a remaining pre-AI quality gap: candidate selection needs stronger checks for explicit subject naming and enough story-specific rugby facts so paid Terra/Luna attempts are not spent on drafts that Luna will reject.
5. Five genuinely distinct review-ready articles must be present in Sanity before go-live; no article is auto-published.

## What is production-verified now

- 31-source standard discovery plus Irish-targeted free discovery.
- Canonical 14-day freshness including progressive same-match phases.
- Same-day paid-attempt exclusion before canonical capacity counts.
- Bounded free refill when the preferred reserve is thin.
- Reserve shortage does not block when the missing-slot minimum is met.
- Ireland-first diversity and same-package concentration gates.
- Slot planning consumes the canonical pool without a second freshness decision.
- Exactly one selected paid candidate per missing slot and no paid replacement loop inside the run.
- Terra generation and Luna Publication Review routing on the paid attempts in `34566787385`.
- Runtime person-identity false-positive fix is merged and deployed; production generation proof of the two previously blocked candidates remains optional because it cannot remove the same-day five-story blocker.

## Go-live states

1. evidence-complete Ireland-first reserve;
2. five distinct fresh positions with progressive follow-ups allowed;
3. verified official story-specific embed for every article;
4. local image only when exact/relevant, otherwise omit it;
5. individual review delivery after editorial and embed gates;
6. owner review and explicit publication in Sanity.
