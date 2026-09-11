# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

11 September 2026 during the final pre-run launch gate after production run `34561318903` and PRs #486-#489.

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
- Canonical pool minimum is the number of missing package slots. Missing slots + three reserve is the preferred target and drives one bounded free refill, but reserve shortage alone must not block a legitimate five-story package.

## Latest measured production state

Production proof `34561318903` ran against current production data after PR #486. Free discovery fetched 31/31 configured sources and reached 275 leads after the targeted Irish augmentation. The acquisition bridge produced 13 corroborated candidates; 10 passed concrete evidence and all 10 passed match-detail parity. The canonical 14-day freshness pool then produced exactly **8 eligible positions: five required slots plus three reserve**. Package diversity passed with **4 Irish-connected positions available** and the slot planner selected five candidates including four Irish-connected positions. Progressive same-match freshness regressions passed 5/5, including distinct match phases and same-phase duplicate rejection.

The paid proof attempted the five selected positions serially. One candidate failed before reservation because the generation API incorrectly parsed the headline phrase `Returning Hansen` as a person. Three other paid attempts reached generation/review but failed closed during Publication Review; one article succeeded and was written to Sanity as `drafts.article-current-2026-09-11-ef6c895b53b9`. Total reservation reached **$0.220**. No article was auto-published and package notifications remained suppressed pending mandatory media.

PR #487 fixes the false `Returning Hansen` API person collision and is merged/deployed on production. PR #488 fixes a runtime model-resolution defect where Terra generation was correct but Publication Review still used the module fallback `gpt-5-mini`; review/repair now resolves only after the route establishes `gpt-5.6-luna`. PR #489 makes individual official YouTube feed failures non-fatal to the wider media search while keeping every article fail-closed unless a story-specific verified official embed is found.

Mandatory-media run `34561917763` showed the one current Sanity draft had no curated exact override and the automatic pass aborted because the configured Irish Rugby YouTube feed returned HTTP 404. PR #489 fixes the workflow-level abort condition; the story itself remains blocked until an exact official embed is actually verified.

The pre-run budget policy is restored to the owner-approved **$0.75 hard ceiling / <=$0.40 normal target**. The earlier `$0.40` API ceiling was stricter than the slot planner and could strand same-day recovery after legitimate failed paid attempts. A production draft reservation remains `$0.055`; discovery and deterministic qualification remain free; paid replacement loops remain disabled.

## Current launch blockers

1. Production-verify Luna review/repair on the next legitimate generated article; the preceding successful draft was reviewed before the #488 runtime fix.
2. Complete the four missing review-ready positions; current same-day reservation is `$0.220` and recovery must remain within the `$0.75` hard ceiling / `<= $0.40` normal operating target where practical.
3. Verify a story-specific official embed for every article. The current Tommy O'Brien draft has no verified embed yet; PR #489 only fixes feed resilience, not relevance.
4. Five genuinely distinct review-ready articles must be present in Sanity for human review; never auto-publish.

## Go-live states

1. evidence-complete Ireland-first reserve;
2. five distinct fresh positions with progressive follow-ups allowed;
3. verified official story-specific embed for every article;
4. local image only when exact/relevant, otherwise omit it;
5. individual review delivery after editorial and embed gates;
6. owner review and explicit publication in Sanity.
