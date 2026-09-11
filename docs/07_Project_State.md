# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

11 September 2026 after Leinster/Zebre pre-match production runs `34558806733` and `34559157178`.

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

PR #476 introduced the canonical editorial pool. PR #477 made it missing-slot-aware and added a bounded free refill. PR #478 removed the fail-early path so a thin first pass is advisory while the post-refill evidence, match-detail, freshness and diversity gates remain strict.

PR #479 restored the application AI hard ceiling to `$0.40/day` and the normal operating target to `<= $0.30/day`. Vercel production deployment `dpl_Fd7K2GH4oJq5m7euHoxnySfX2BC3` reached READY on merge SHA `1356912b0190f5651c0d5f13e28452561f7779e5`.

Production run `34558806733` verified the bounded free-refill path but exposed `EVIDENCE-014`: a TG4/Galway All-Star GAA headline was incorrectly clustered with Alex Usanov because noisy discovery description text contained rugby context. The run failed closed before model spend.

PR #480 added title-level GAA/TG4 All-Star rejection before rugby clustering. Vercel production deployment `dpl_83aFke55kHWPjDrNAuBLrch6qH52` reached READY on merge SHA `390173ba72eab4e1b9fb6ad6ad07f428942042e4`.

Production verification run `34559157178` confirmed the contamination fix: the false GAA candidate disappeared and Alex Usanov returned as a legitimate Leinster candidate. The free refill expanded discovery to 325 leads but the strict evidence gate still produced only four generation-ready stories: Steve Borthwick; Felipe Contepomi/Ian Madigan; Fintan Gunne/Luke McGrath; and Alex Usanov. Three are directly Leinster-connected. Dedicated Leinster/Zebre searches returned no fresh qualifying match-specific leads in that run. The workflow therefore failed closed before match-detail, canonical pool, diversity, slot planning or Terra/Luna generation. **No AI reservation/spend occurred.**

## Current launch blockers

1. Fresh evidence supply: at least one more legitimate generation-ready story is needed before the five-story package can proceed; the canonical reserve target remains missing slots + three.
2. Leinster/Zebre match-specific supply: current official/public evidence confirms the fixture but no fresh qualifying squad/team-news/preview development was available in the production discovery window at the verification time.
3. Complete a legitimate paid package within the `$0.40` hard guard / `<= $0.30` normal target without paid retry loops.
4. Story-specific official embed coverage for every selected candidate; if media cannot be verified, replace the candidate before paid generation where possible.
5. Production proof of local-image cleanup on exact-embed drafts.
6. Five genuinely distinct review-ready articles in one Dublin-day package with progressive individual delivery.

## Go-live states

1. evidence-complete Ireland-first reserve;
2. five distinct fresh positions with recent-position repetition protection and progressive match-day follow-ups allowed;
3. verified official story-specific embed for every article;
4. local image only when exact/relevant, otherwise omit it;
5. individual review delivery after editorial and embed gates;
6. owner review and explicit publication in Sanity.
