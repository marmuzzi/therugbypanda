# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

11 September 2026 after bounded launch-day recovery PR #497, production run `34571881680`, mandatory-media run `34572012077`, and Vercel production verification.

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

Morning run `34566787385` production-proved the repaired canonical newsroom path: 31/31 configured sources, bounded free refill, six unpaid fresh positions for four missing slots, Ireland-first diversity passing, exactly four slot selections, and no second freshness decision. Two selections reached Terra and Luna but were rejected by Publication Review for insufficient story-specific detail; two failed pre-spend on runtime person-identity false positives. PR #495 repaired that parser parity defect and is production verified.

PR #497 then triggered one bounded launch-day recovery without retrying any candidate that had already consumed a `production-draft:` reservation. Recovery run `34571881680` ran on main SHA `baa17e195fc5762a3a80cc0cd825e39695816b0d`. All freshness, paid-attempt and person-name regressions passed. Discovery reached 31/31 standard sources and, after the bounded refill, 328 leads; eight candidates passed evidence and match-detail parity. Canonical qualification excluded four already-paid IDs and retained exactly four unpaid fresh positions for four missing slots. The same-day ledger reported `$0.33` reserved, below the `<= $0.40` normal target and `$0.75` hard ceiling.

The final recovery correctly failed closed at Ireland-first diversity before any new reservation: one current retained Irish draft means two further Irish-connected positions are mandatory, but only one of the four remaining unpaid candidates was Irish-connected. Slot planning and generation were skipped, so PR #497 added no new AI spend. No freshness gate was reinterpreted downstream.

Mandatory-media run `34572012077` authenticated against production Sanity and found exactly one current-day eligible draft: `drafts.article-current-2026-09-11-ef6c895b53b9`, titled `Tommy O’Brien draws pride from Ireland setback`. It remains a draft and therefore is not auto-published. No curated exact override matched it; official-media discovery found no story-specific official video/embed and marked it `blocked-no-story-specific-official-video`. The progressive delivery endpoint consequently reported one current article, zero media-ready articles and zero accepted deliveries. No weak local media was removed because no exact official embed existed to replace it.

Vercel production deployment `dpl_5SBftZkauX474v1Py33GFvMqELfW` is READY on the exact PR #497 main SHA `baa17e195fc5762a3a80cc0cd825e39695816b0d`.

## Current launch blockers

1. **Five-story package not present.** Production Sanity contains only one current-day eligible draft, not five.
2. **Ireland-first recovery supply is insufficient.** Run `34571881680` had exactly four unpaid fresh candidates for four missing slots, but only one of the two additional Irish-connected stories required. Correct fail-closed behavior prevented spend.
3. **Two same-day paid attempts failed Luna Publication Review.** Those IDs remain authoritative paid attempts and cannot be replaced under the approved zero-paid-replacement contract.
4. **Mandatory media is not satisfied even for the retained draft.** `Tommy O’Brien draws pride from Ireland setback` has no verified story-specific official embed and therefore cannot be delivered for review.
5. **Pre-AI draftability remains weaker than Publication Review.** Stronger explicit-subject and story-specific-fact qualification is required to reduce future paid Luna rejections.

## What is production-verified now

- 31-source standard discovery plus Irish-targeted free discovery.
- Canonical 14-day freshness including progressive same-match phases and same-phase duplicate rejection.
- Same-day paid-attempt exclusion before capacity/diversity decisions.
- Bounded free refill when the preferred reserve is thin.
- Reserve shortage does not block when the missing-slot minimum is met.
- Ireland-first diversity correctly fails closed when the Irish floor cannot be met.
- Slot planning consumes the canonical pool without a second freshness decision.
- Terra generation and Luna Publication Review routing.
- Runtime person-identity false-positive fix.
- `$0.33` authoritative same-day reservation total at the final recovery gate, within both budget limits.
- Exact PR #497 main SHA deployed READY in Vercel production.
- Sanity human publication boundary remains intact; retained content is still under `drafts.*`.
- Mandatory media gate correctly prevents review delivery when no exact official embed is found.

## Go-live states

1. evidence-complete Ireland-first reserve;
2. five distinct fresh positions with progressive follow-ups allowed;
3. verified official story-specific embed for every article;
4. local image only when exact/relevant, otherwise omit it;
5. individual review delivery after editorial and embed gates;
6. owner review and explicit publication in Sanity.

**Go-live is not verified on 11 September 2026.** The system is correctly failing closed rather than weakening the Irish, review, media or budget contracts.
