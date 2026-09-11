# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

11 September 2026 during the pre-run launch gate after production run `34559843720`.

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

Production run `34558806733` verified the bounded free-refill path but exposed `EVIDENCE-014`: a TG4/Galway All-Star GAA headline was incorrectly clustered with Alex Usanov because noisy discovery description text contained rugby context. PR #480 fixed that contamination and run `34559157178` verified it.

Run `34559157178` still produced only four generation-ready stories: Steve Borthwick; Felipe Contepomi/Ian Madigan; Fintan Gunne/Luke McGrath; and Alex Usanov. Three are directly Leinster-connected. No AI reservation/spend occurred.

PR #481 reconciled those findings. Vercel deployment `dpl_BYV2oftgwR83cbNJFE16iW5eYSuJ` reached READY on merge SHA `67f961a133f4cf01f2bbef2f7a2e9e0d66856f0f`.

PR #482 added World Rugby, Fiji Rugby Union and Rugby Canada to the canonical source registry after external verification of fresh Fiji v Canada Pacific Nations Cup evidence. Vercel deployment `dpl_BcHTR7pHyCfuD7jpK7wfeYoAdDkD` reached READY on merge SHA `f0b8876a9ecc0b7d3ea881e225dffcacdeb08e45`.

Production verification run `34559843720` confirmed the source expansion operationally: all 31 configured sources fetched successfully and the expanded free refill reached 338 leads. The evidence gate still accepted only four stories and failed closed before model spend. The new logs exposed a deterministic evidence-person parser defect: competition/team phrases such as `WXV Global`, `Global Series`, `Wallaroos Global`, `Western Force`, `ROSTER CONFIRMED` and similar labels were being interpreted as person names. That created false `same-surname-different-person-evidence-collision` and person-corroboration failures on otherwise strong squad/team stories, including an official World Rugby WXV squad story backed by four publishers. **No AI reservation/spend occurred.**

The current pre-run repair hardens the person parser by excluding competition/team/editorial labels from person identity, recognises plural `squads`/`roster` as selection stories, and adds current international venues to concrete match context. Evidence still requires two independent editorial publishers, two substantive facts, concrete rugby context, and named-player support for squad stories; no evidence threshold is weakened.

## Current launch blockers

1. Production-verify the evidence-person parser repair and confirm at least five legitimate generation-ready candidates reach the canonical pool path.
2. Leinster/Zebre match-specific supply remains opportunistic: current official/public evidence confirms the fixture but no fresh qualifying squad/team-news/preview development was available in the latest runs.
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
