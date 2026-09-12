# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

12 September 2026 after Saturday production run `34670946540`, mandatory-media run `34671229317`, merged runtime repair PR #509, and implementation of the post-Luna headline normalization repair.

## Read first

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. newest dated evidence/handoff document
5. `docs/99_2026-09-04_AI_Cost_Routing_And_Daily_Budget.md`

Newer measured evidence supersedes older state statements where they conflict.

## Launch contract

- Europe/Dublin operational day.
- Five fresh, genuinely distinct review-ready drafts, delivered individually as each becomes ready.
- At least 3/5 direct Irish connections; at most 2 international-only.
- Genuine follow-ups/new match phases are fresh; same-phase rewrites remain duplicates.
- Verified official story-specific social/video embed is mandatory before review delivery; irrelevant local imagery never substitutes.
- Sanity is the human publication boundary; never auto-publish.
- OpenAI hard ceiling `$0.40/day`; normal production target `<= $0.30/day`.
- Terra generates only approved articles; Luna performs Publication Review/bounded repair.
- One paid candidate per missing slot; no paid replacement loop.

## Current production architecture

`free discovery -> evidence -> match-detail parity -> canonical freshness/paid-attempt eligibility -> bounded free refill if thin -> Ireland-first/diversity -> slot budget -> Terra -> Luna -> mandatory official media -> progressive delivery -> human Sanity publication`.

Canonical qualification is the only recent-position freshness decision. Same-day `production-draft:` reservation IDs are authoritative and excluded before capacity/diversity planning.

## Saturday 12 September measured production result

PR #508 was the production trigger for run `34670946540`. The run passed all free gates: discovery, evidence, match-detail parity, canonical freshness, bounded free refill, Ireland-first diversity and one-to-one slot planning. The final canonical pool contained 7 fresh unpaid positions, including 4 classified Irish-connected. Five initial candidates were selected with projected reservation `$0.275`, below the `$0.30` normal target. Paid replacements remained zero.

The Leinster-Zebre team-selection repair from PR #507 was production-proved: the Max Deegan/The42 and Ryan Baird/Irish Independent reports clustered into one current team-selection position and that story reached Terra generation. The package therefore prioritised the requested fresh Leinster match phase rather than a same-phase rewrite.

Paid outcomes were fail-closed:

- Steve Borthwick: reserved `$0.055`, Terra completed, Luna Publication Review #2 rejected insufficient concrete rugby value.
- Mack Hansen/Connacht: reserved `$0.055`, Terra completed and initial Draft Ready passed, but the corrected copy exceeded the 70-character headline limit at the post-review deterministic gate.
- Leinster v Zebre team selection: reserved `$0.055`, Terra completed, but Luna Publication Review #2 rejected the article because the generated copy used too little of the available selection detail.
- Alex Usanov/Leinster: reserved `$0.055`, Terra generated, Luna corrected/reviewed successfully and a Sanity draft was created. No relevant local image was forced.
- Steve Hansen: rejected before OpenAI spend because runtime treated `Steve Hansen` and `Sir Steve Hansen` as a surname collision. This was a false identity collision; no reservation was added for that slot.

Actual Saturday reservation after the one-to-one pass is therefore `$0.220`, within both the `$0.30` normal target and `$0.40` hard ceiling. No paid retry or replacement candidate was attempted.

Mandatory-media run `34671229317` inspected the single successful Alex Usanov draft. It correctly remained blocked because there was no exact curated override and the official Irish Rugby, Leinster Rugby and URC YouTube feeds all returned HTTP 500 during that run. The system did not substitute an irrelevant local image and did not deliver or auto-publish the article.

## Runtime repairs after the measured run

PR #509 is merged and production READY on Vercel deployment `dpl_FJMikuKcrPpE6hWmPXDBvMSR4KWS`, exact main SHA `2b5dacd7b6a3250d9f38d8918cbae241133a469b`.

1. Honorific parity: shared person extraction now normalizes `Sir`/`Dame`, so `Steve Hansen` and `Sir Steve Hansen` are the same identity for runtime evidence checks. A regression covers the exact failure.
2. Official-feed resilience: story-specific YouTube feed acquisition now performs bounded retries for transient 408/425/429/5xx/timeouts before blocking. Relevance still fails closed; retries never manufacture a media match.
3. Post-Luna headline normalization is now implemented on the current repair branch: corrected titles are deterministically clipped to <=70 characters before the final Draft Ready gate. Production verification remains pending because the no-paid-retry rule prevents re-spending on Mack Hansen today simply to prove the repair.
4. Evidence depth remains an open quality issue for selection stories: the acquisition fact ledger is often headline-shaped, so Terra/Luna can lack the concrete player/position detail needed for strong match-team analysis even when public sources contain it.

## Current launch state

The system is **not go-live verified** for 12 September. The deterministic pre-AI path and budget policy are production-proved, PR #509 is deployed, and the remaining presentation defect is implemented but not yet merged/deployed. Today produced only one Sanity draft; that draft is still media-blocked. Under the explicit no-paid-retry rule, failed paid positions are not retried today.

## Go-live definition

Go-live is verified only when five distinct fresh articles for the Dublin day have individually passed editorial review and mandatory official-media gates, at least three are Irish-connected, Vercel production is on the exact merged code, Sanity readback is correct, and publication remains human-controlled.
