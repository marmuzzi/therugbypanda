# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

9 September 2026 after embed-first media production proof through PRs #458 and #459.

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
- Mandatory verified official story-specific social/video embed before review delivery.
- Local Sanity imagery is optional and must be omitted when it is not independently relevant.
- Sanity remains the human publication boundary; never auto-publish.
- OpenAI application reservation ceiling `$0.40/day`.
- Free discovery, evidence, freshness, diversity, media qualification and slot planning before model spend.
- One paid candidate per missing slot; no paid replacement loop.

## 9 September measured production state

PRs #451-#457 repaired exact-day identity, stale retention, duplicate source clusters, pre-AI evidence parity, package-mode notification suppression, mandatory official-video acquisition and progressive one-by-one delivery.

PR #458 changed media policy to embed-first and replaced the legacy scheduled image/replacement workflow with the bounded slot pipeline. Production deployment `67b56df7362dc43b65465ba675a42c4f4bf6954f` is READY. The live progressive endpoint reports `verified-official-story-specific-social-or-video-embed` as required media and `optional-only-when-independently-relevant` for local images.

Production media run `34327661508` passed identity/relevance regressions, exact embed insertion/readback, generic official-video fallback and progressive delivery. Three current drafts were inspected. Two were media-ready and delivered individually:

- Tom Wood / Munster: exact official Munster Rugby video applied and read back.
- Fintan Gunne / Leinster: exact official Leinster Rugby TV video applied and read back.

The Waratahs/Brumbies draft remained blocked because no story-specific official video was verified. This is the desired fail-closed behavior.

PR #459 adds cleanup of existing featured and inline local images after an exact official embed is verified, so a correct embed can replace questionable local imagery instead of appearing beside it.

## Budget

The hard ceiling remains `$0.40` per Europe/Dublin operational day. On 9 September the ledger reached `$0.385` after the legacy workflow retried a failed candidate. No further `$0.055` generation is permitted today. The replacement legacy path has been removed from the normal scheduled workflow.

## Current launch blockers

1. Production proof of PR #459 local-image cleanup on the two exact-embed drafts.
2. Story-specific official embed coverage for every future selected candidate; if media cannot be verified, replace the candidate before paid generation where possible.
3. Five genuinely distinct articles in one Dublin-day package under the `$0.40` ceiling.
4. Continued proof that the simplified scheduled workflow does not retry paid failures or force irrelevant images.

## Go-live states

1. evidence-complete Ireland-first reserve;
2. five distinct fresh positions with recent-position repetition protection;
3. verified official story-specific embed for every article;
4. local image only when exact/relevant, otherwise omit it;
5. individual review delivery after editorial and embed gates;
6. owner review and explicit publication in Sanity.
