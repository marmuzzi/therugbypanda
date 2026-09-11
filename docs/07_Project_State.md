# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

11 September 2026 during the pre-run launch gate after production run `34560417839` and PR #486 implementation.

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
- OpenAI hard ceiling `$0.40/day`; normal operating target `<= $0.30/day`.
- Terra only for approved article generation; Luna for publication review/repair.
- One paid candidate per missing slot; no paid replacement loop.
- Canonical pool **minimum is the number of missing package slots**. Missing slots + three reserve remains the preferred target and drives one bounded free refill, but reserve shortage alone must not block a legitimate five-story package.

## Latest measured production state

PRs #476-#478 established the canonical missing-slot-aware pool and bounded free refill. PR #479 restored the `$0.40/$0.30` budget policy. PR #480 fixed non-rugby/GAA contamination. PR #482 added World Rugby, Fiji Rugby Union and Rugby Canada. PR #483 fixed false person parsing. PR #484 aligned the launch-recovery test with the current budget. PR #485 allowed strong multi-publisher squad/roster evidence without requiring the same player name in two publisher snippets.

Production run `34560417839` is the strongest pre-run proof so far. It fetched all 31 configured sources, expanded free discovery to 340 leads, accepted **5/12** candidates through concrete evidence, and passed pre-AI match-detail parity for all five. No AI reservation occurred.

The run then exposed the remaining canonical-history mismatch. Of the five evidence-qualified positions, only Steve Borthwick and Alex Usanov survived the 14-day freshness history. Felipe Contepomi/Ian Madigan and Fintan Gunne/Luke McGrath were correctly identified as repeated developments from 8-10 September. The fresh 10 September WXV squad roundup was incorrectly suppressed by an older generic WXV competition position because `squads` was not recognised as a selection phase. The final gate also required eight eligible positions (five missing + three reserve), making the reserve a hard blocker despite the intended “aim for eight, publish five” contract.

PR #486 corrects those deterministic mismatches. Squad/roster announcements are recognised as a progressive selection phase; a concrete new phase can supersede an older generic unphased competition position. The reserve is advisory once all missing slots are fresh. Evidence identity now accepts a fact-ledger person coherently named in the title with two independent publishers and two facts, while exact surname-collision rejection remains and explicit non-rugby titles such as Nations League/GAA/soccer are rejected before generation.

## Current launch blockers

1. Production-verify PR #486 and measure the final fresh canonical pool; five fresh positions are still mandatory.
2. Confirm at least three of the final five are Irish-connected after freshness/diversity, not merely before it.
3. Complete a legitimate paid package inside the `$0.40` hard guard / `<= $0.30` normal target.
4. Verify current story-specific official embed coverage for every selected article before delivery.
5. Five genuinely distinct review-ready articles must be present in Sanity for human review; never auto-publish.

## Go-live states

1. evidence-complete Ireland-first reserve;
2. five distinct fresh positions with progressive follow-ups allowed;
3. verified official story-specific embed for every article;
4. local image only when exact/relevant, otherwise omit it;
5. individual review delivery after editorial and embed gates;
6. owner review and explicit publication in Sanity.
