# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

10 September 2026 after progressive match-day freshness, Irish source expansion and evidence-parser repair through PR #471.

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
- OpenAI application reservation ceiling `$0.40/day`.
- Free discovery, evidence, freshness, diversity, media qualification and slot planning before model spend.
- One paid candidate per missing slot; no paid replacement loop.

## 10 September measured production state

PRs #461-#466 expanded Irish discovery, repaired rugby/non-rugby qualification, added person-team coherent clustering, restored freshness-before-diversity and removed reciprocal source-cluster duplicates. The stricter #466 proof correctly exposed a real supply shortage at four fresh positions rather than manufacturing a five-story package from duplicates.

PR #468 implements progressive match-day freshness and raises same-match/team concentration from two to three only for genuinely distinct developments. It also expands the targeted Irish reserve from 5 to 10 supplementary sources and from 40 to 61 targeted searches. The freshness regression explicitly proves preview → team selection → result as acceptable progression while same-phase selection rewrites remain duplicates.

PR #469 repaired the zero-model test harness. PR #470 corrected false person-phrase parsing in the evidence gate without weakening the exact-person corroboration requirement. Zero-model production-data proof `34481546309` then passed the full pre-AI path: 10 evidence-qualified candidates, 6 surviving 14-day production-history freshness, 2 retained Irish drafts, 6 available replacement candidates for 3 missing slots plus reserve, and 2 Irish-connected replacements selected for the three missing slots. The existing Sanity daily ledger reported `$0.275` reserved; the zero-model proof itself made no model calls.

PR #471 made the freshness regression Vercel-build-safe. Exact-SHA proof `34481959318` passed all substantive and cleanup steps on merged SHA `af95bb0cb01a63e4e5ba69def758ff0f7811eae6`. Vercel production deployment `dpl_BgygQPzGA15iVBvncV5VpUyBfmB4` is READY on that exact SHA.

## Budget

The hard ceiling remains `$0.40` per Europe/Dublin operational day and the normal target remains at or below `$0.30`. The zero-model recovery/proof runs introduced no model spend. The latest measured Sanity ledger during proof `34481546309` reported `$0.275` already reserved from earlier 10 September production attempts. Three additional `$0.055` paid slots would require `$0.165` and therefore cannot all be generated today without exceeding the hard ceiling. Do not bypass the Sanity guard or use paid replacement loops.

## Current launch blockers

1. Complete a normal paid package on a Dublin day where budget is available, using the now-proven fresh/distinct reserve path.
2. Production proof of PR #459 local-image cleanup on exact-embed drafts.
3. Story-specific official embed coverage for every selected candidate; if media cannot be verified, replace the candidate before paid generation where possible.
4. Five genuinely distinct review-ready articles in one Dublin-day package under the `$0.40` ceiling.
5. Continued proof that the scheduled workflow does not retry paid failures or force irrelevant images.

## Go-live states

1. evidence-complete Ireland-first reserve;
2. five distinct fresh positions with recent-position repetition protection and progressive match-day follow-ups allowed;
3. verified official story-specific embed for every article;
4. local image only when exact/relevant, otherwise omit it;
5. individual review delivery after editorial and embed gates;
6. owner review and explicit publication in Sanity.
