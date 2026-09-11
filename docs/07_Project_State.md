# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

11 September 2026 during the pre-run launch gate after production run `34560120792`.

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

PRs #476-#478 established the canonical missing-slot-aware pool and bounded free refill. PR #479 restored the application AI hard ceiling to `$0.40/day` and the normal operating target to `<= $0.30/day`. PR #480 fixed non-rugby/GAA contamination; run `34559157178` verified that repair.

PR #482 added World Rugby, Fiji Rugby Union and Rugby Canada to the canonical source registry. Vercel deployment `dpl_BcHTR7pHyCfuD7jpK7wfeYoAdDkD` reached READY on merge SHA `f0b8876a9ecc0b7d3ea881e225dffcacdeb08e45`. Production run `34559843720` verified all 31 configured sources fetched and expanded discovery reached 338 leads, but only four candidates passed strict evidence.

PR #483 fixed false person parsing for competition/team/editorial labels. Production verification run `34560120792` confirmed the false surname-collision defect was removed, but the World Rugby WXV squad story was still rejected solely because no individual player name appeared in two publisher snippets, despite four independent publishers, four substantive facts and two real named players in the fact ledger. The same run still had the three required Leinster-connected positions plus Steve Borthwick, and made no AI reservation.

PR #484 aligns the launch recovery contract test with the already-deployed `$0.40/$0.30` budget policy. It changes test expectations only; production budget code remains unchanged.

PR #485 narrows the remaining squad evidence mismatch: for squad/roster stories only, at least three independent publishers plus at least two named people in the fact ledger can satisfy identity support without requiring the same player name to appear in two publisher snippets. All other stories retain exact person corroboration. The two-publisher, two-fact, concrete rugby, collision and named-player safeguards remain mandatory.

## Current launch blockers

1. Production-verify PR #485 and confirm at least five legitimate generation-ready candidates reach the canonical pool path.
2. Verify the canonical pool/diversity step can retain the required three Irish-connected positions and enough reserve after freshness/history checks.
3. Complete a legitimate paid package within the `$0.40` hard guard / `<= $0.30` normal target without paid retry loops.
4. Verify story-specific official embed coverage for every selected article before delivery.
5. Five genuinely distinct review-ready articles must be present in Sanity for human review; never auto-publish.

## Go-live states

1. evidence-complete Ireland-first reserve;
2. five distinct fresh positions with recent-position repetition protection and progressive match-day follow-ups allowed;
3. verified official story-specific embed for every article;
4. local image only when exact/relevant, otherwise omit it;
5. individual review delivery after editorial and embed gates;
6. owner review and explicit publication in Sanity.
