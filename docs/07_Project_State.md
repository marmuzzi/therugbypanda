# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

7 September 2026, after measured production run `34135365500` and implementation of PR #442's finite 8 September launch-recovery contract.

## Source of truth

Read in this order:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/100_2026-09-07_Launch_Recovery_Contract.md`
5. `docs/99_2026-09-04_AI_Cost_Routing_And_Daily_Budget.md`
6. older dated evidence documents for historical run-specific evidence.

Newer measured evidence supersedes older state statements where they conflict. Git history and dated evidence preserve historical decisions.

## Operating targets

- Timezone: Europe/Dublin.
- Daily editorial target: five fresh review-ready drafts.
- Ireland-first launch package: at least 3/5 direct Irish connections; at most 2 international-only stories.
- Sanity is the canonical CMS and mandatory human publication boundary.
- OpenAI application reservation ceiling: $0.40 per Dublin operational day.
- Terra (`gpt-5.6-terra`) is default generation; Luna (`gpt-5.6-luna`) is default Publication Review/repair.
- Free discovery/evidence/freshness/diversity/image work must happen before model spend.
- Meta/social is excluded from the current launch gate.
- Gmail and Google Drive are not part of the editorial path.

## Current measured production state — 7 September

Run `34135365500` proved the Irish discovery repair worked but the package still failed downstream.

Measured free-stage evidence:

- 28 standard discovery sources succeeded, 0 failed;
- 160 standard leads;
- targeted Irish reserve added 40 leads, total 200;
- 17 corroborated candidates;
- 14 passed the concrete evidence filter;
- one same-day eligible draft retained;
- Ireland-first diversity passed with exactly 3 available Irish-connected candidates and max 2 international-only;
- eight candidates remained fresh after two known repeats were rejected.

The run created zero new drafts. Three paid candidates reached Publication Review before the daily guard became the dominant blocker; later calls were blocked at `$0.385 + $0.055 > $0.40`.

The measured failures exposed three launch-contract defects:

1. completed-match evidence could reach generation without a final score in the usable fact ledger;
2. squad evidence could reach generation with counts but insufficient actual player names;
3. the API route rejected `review2.verdict != pass` even when Review #2 contained only medium/low observations, contradicting the established critical/high-only blocking rule.

Artifact inspection also found Mack Hansen / Sir Steve Hansen surname-only corroboration contamination in the failed Connacht candidate. The strengthened completed-match fact gate prevents that measured candidate from spending again, but the upstream person-identity clustering defect remains separately open until fixed and regression-proven.

## PR #442 launch recovery implementation

PR #442 implements the 8 September recovery contract:

- standard discovery always includes the targeted Irish reserve;
- completed-match stories require a final score in the usable fact ledger before budget reservation;
- squad/selection stories require at least two named people in the usable fact ledger before budget reservation;
- PublicationReviewCycle remains authoritative: only critical/high Review #2 issues block; the duplicate route-level verdict rejection is removed;
- launch recovery performs deterministic one-to-one slot planning and allows one paid candidate per missing slot, serially, under the global $0.40 guard;
- deterministic contract regression workflow added;
- docs reconciled in the same PR.

## Editorial contract

Articles are original multi-source Rugby Panda synthesis, not rewrites. Freshness identity remains **subject + event/development + editorial angle**. New candidates require coherent corroboration, at least two substantive publishers, concrete rugby evidence and a fact ledger sufficient for the specific story type before model spend.

Originality and Draft Ready remain deterministic and fail closed. Publication Review remains mandatory. Critical/high issues block; medium/low observations are advisory unless a deterministic hard gate independently fails.

## Image contract

Image relevance remains fail closed. Priority is correct person → correct team/event → genuinely relevant rugby context → approved relevant brand fallback → no image. Never use unrelated imagery merely to fill a slot. Existing planner/verifier parity work remains in force. The owner-reported James O'Connor and Codie Taylor semantic-image defects remain unresolved launch-quality work and must be rechecked before publishing affected content.

## Delivery / Zoho

Per-draft production notification is enabled; QA notification is suppressed. Run `34135365500` did not reach image or consolidated-package delivery. No new consolidated Zoho package was sent by that run. The older consolidated-package workflow remains a separate cleanup item because the owner's current operating preference is one notification per new review-ready draft; do not claim that conflict is resolved until the completion marker is decoupled and production-verified.

## Scheduling

A morning SLA watchdog exists, but scheduling is not considered launch-complete until a fresh Dublin-day run proves the repaired pipeline end to end. The 8 September launch attempt must use current main, not rerun an old failed SHA.

## Go-live gate

The finite launch states are:

1. evidence-complete Ireland-first candidate reserve;
2. five fresh review-ready drafts;
3. safe/relevant images verified (or explicit safe no-image fallback where appropriate);
4. owner reviews and publishes in Sanity.

The system never auto-publishes.

## Current blockers

- PR #442 must be merged and its deterministic workflow must pass.
- Vercel production must be READY for the route change before paid generation.
- The next Dublin-day run must production-prove the new evidence and slot boundaries.
- Upstream surname-only person corroboration must be repaired rather than relying only on downstream rejection.
- Image semantic defects and consolidated-vs-per-draft email contract still require final launch verification.

See `docs/100_2026-09-07_Launch_Recovery_Contract.md` for the exact 8 September sequence and evidence.
