# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

12 September 2026 after production recovery runs through `34678780719`, mandatory-media run `34671837261`, merged PRs #509-#514, and implementation of PR #515 match-day editorial priority.

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
- On match days, fresh Irish team/selection/fixture build-up outranks older Irish profile/interview material when both are qualified; this changes ordering only, never evidence or freshness standards.
- Verified official story-specific social/video embed is mandatory before review delivery; irrelevant local imagery never substitutes.
- Sanity is the human publication boundary; never auto-publish.
- OpenAI hard ceiling `$0.40/day`; normal production target `<= $0.30/day`.
- Terra generates only approved articles; Luna performs Publication Review/bounded repair.
- One paid candidate per selected slot; no paid replacement loop.
- When all package gaps do not fit inside the normal target, the system may progressively generate only the fresh slots that do fit rather than aborting all generation.

## Current production architecture

`free discovery -> evidence -> match-detail parity -> canonical freshness/paid-attempt eligibility -> bounded free refill if thin -> Ireland-first/diversity -> match-day priority + progressive slot budget -> Terra -> Luna -> mandatory official media -> progressive delivery -> human Sanity publication`.

Canonical qualification is the only recent-position freshness decision. Same-day `production-draft:` reservation IDs are authoritative and excluded before capacity/diversity planning.

## Saturday 12 September measured production state

The original production pass `34670946540` passed every free gate and selected five candidates with projected reservation `$0.275`. Four candidates consumed `$0.220` in reservations: Steve Borthwick failed Luna rugby-value; Mack Hansen failed the then-unrepaired post-Luna headline-length gate; Leinster-Zebre team selection failed Luna for insufficient concrete selection detail; Alex Usanov passed Terra/Luna and created `drafts.article-current-2026-09-12-037e437777f7`. Steve Hansen failed before spend because an honorific identity mismatch treated `Steve Hansen` and `Sir Steve Hansen` as different people.

PR #509 repaired honorific parity and bounded official-feed retries. PR #510 repaired post-Luna title normalization. Same-day paid retry remains prohibited, so those fixes were not used to re-spend on earlier candidates.

## Progressive recovery repairs

PR #511 triggered a fresh same-day recovery. It exposed that slot budgeting was all-or-nothing: four missing `$0.055` positions from `$0.220` reserved would exceed the `$0.30` normal target, so the entire pass aborted even though one fresh slot could safely fit.

PR #512 implemented progressive budget-limited slot selection; PR #513 aligned the launch contract. PR #514 aligned the acquisition importer so a one-slot progressive plan is not rejected merely because the full package still has four gaps.

Production run `34678780719` proved those repairs:

- free refill reached 365 leads;
- 18 corroborated candidates were built;
- 11 passed concrete evidence;
- 8 passed match-detail parity;
- the canonical pool retained 6 eligible positions;
- diversity had 3 available Irish-connected replacements;
- the budget planner began at `$0.220`, selected `slotsToPlan=1`, `paidAttemptLimit=1`, `replacementPaidAttempts=0`, and projected `$0.275`;
- the importer honoured `generationSlots=1` and made exactly one new paid request.

That one candidate, `current-2026-09-12-4281bfe9ab0d` (Mack Hansen/Connacht), failed Luna Publication Review #2 because the evidence-supported copy still lacked sufficient concrete on-field rugby value. No replacement or paid retry was attempted.

## Match-day priority defect and repair

The same qualified run contained `current-2026-09-12-56ab516ce29b`, the fresh Leinster-Zebre team story (“Deegan to captain Leinster in pre-season friendly against Zebre at redeveloped Laya Arena”). It was not selected because Ireland-first ordering preserved upstream candidate order and therefore put the older Mack Hansen profile/interview story first.

PR #515 implements a deterministic, generic match-day priority inside slot planning: qualified Irish team/selection/squad/fixture build-up receives priority over qualified Irish profile/interview material. The rule does not bypass freshness, evidence, diversity, paid-attempt exclusion, the `$0.30` normal target, or the `$0.40` hard ceiling.

## Mandatory media state

Mandatory-media run `34671837261` inspected the retained Alex Usanov draft. It remained blocked because no verified story-specific official embed was available. Irish Rugby and URC official YouTube feeds returned HTTP 404 after bounded retries. The system did not force an irrelevant local image, did not deliver the article as review-ready, and did not auto-publish.

## Current launch state

The system is **not go-live verified** for 12 September. Deterministic progressive budgeting/import are production-proved through run `34678780719`. Match-day priority is implemented in PR #515 but still requires merge/deployment/verification. Today still has one retained Sanity draft and zero media-ready delivered articles. The latest paid recovery attempt failed Luna and no paid replacement loop ran.

Under the current cost contract, once the Europe/Dublin day no longer has enough normal-target headroom for another `$0.055` slot, production must stop rather than silently exceed the `<= $0.30` normal target. The `$0.40` ceiling remains an absolute safety ceiling, not permission to ignore the normal target.

## Go-live definition

Go-live is verified only when five distinct fresh articles for the Dublin day have individually passed editorial review and mandatory official-media gates, at least three are Irish-connected, Vercel production is on the exact merged code, Sanity readback is correct, and publication remains human-controlled.
