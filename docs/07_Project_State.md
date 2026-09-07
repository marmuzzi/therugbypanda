# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

7 September 2026 after PRs #442–#447 and zero-model production proof runs through `34147169151`.

## Read first

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/102_2026-09-07_Final_Launch_Recovery_Status.md`
5. `docs/101_2026-09-07_Zero_Model_Reserve_Proof.md`
6. `docs/100_2026-09-07_Launch_Recovery_Contract.md`
7. `docs/99_2026-09-04_AI_Cost_Routing_And_Daily_Budget.md`

Newer measured evidence supersedes older state statements where they conflict; Git history and dated evidence preserve historical decisions.

## Launch contract

- Europe/Dublin operational day.
- Five fresh review-ready drafts.
- At least 3/5 direct Irish connections; at most 2 international-only.
- Sanity human publication boundary; never auto-publish.
- OpenAI application reservation ceiling `$0.40/day`.
- Terra generation, Luna review/repair.
- Free discovery/evidence/freshness/diversity/slot planning before model spend.
- Meta/social excluded from launch recovery.

## Merged recovery state

PR #442 repaired the evidence→generation→Publication Review contract, removed duplicate medium/low Review #2 rejection, integrated Irish augmentation into normal discovery and added one-to-one slot planning. PR #443 added a zero-model production proof. PR #444 moved completed-match final-score, squad named-person and exact-person coherence requirements into the free evidence gate. PR #445 made the free proof retriggerable. PR #446 deepened Irish discovery to 12 evidence-oriented queries. PR #447 made slot planning preserve the Ireland-first quota after freshness or fail before spend.

Deterministic contract CI has passed for the relevant code changes, including PR #444 run `34146667441` and PR #447 run `34147139147`.

## Latest zero-model evidence

- `34146444423`: free reserve path passed but exposed known weak candidates still entering paid slots.
- `34146778688`: stricter #444 evidence gate worked, but only 2/3 required Irish candidates survived; failed before model spend.
- `34146961971`: #446 deep discovery produced 219 leads, 21 corroborated, 7 strict accepted; diversity passed with exactly 3 Irish candidates; slot planning passed, but inspection exposed that freshness could drop the Irish quota.
- `34147169151`: #447 code was present, but the live discovery snapshot again failed at Ireland-first diversity before slot planning because fewer than three evidence-ready Irish candidates were available.

No zero-model proof calls the draft API/OpenAI/image/Zoho path.

## Current P0 blocker

The remaining blocker is **volatile evidence-complete Irish candidate supply**. The system now correctly refuses to spend when the 3/5 Ireland-first package cannot be supported by fresh, concrete evidence. Do not solve this by weakening evidence, freshness, review severity or the Irish quota.

Next engineering work must enrich deterministic Irish evidence acquisition (direct article/structured match/squad facts) so a free proof consistently reaches freshness-aware slot planning with `selectedIrishCount >= 3`.

## Budget

The 7 September paid ledger had already reached `$0.385` reserved before this recovery work. No further paid generation should run on 7 September. The next paid recovery belongs to the next Dublin operational day only after a green zero-model reserve proof.

## Images and notifications

Image relevance remains fail closed. Owner-reported James O'Connor and Codie Taylor semantic-image defects remain unresolved. Per-draft notification is deployed; legacy consolidated-package completion semantics remain unreconciled with the owner's one-email-per-draft preference.

## Go-live states

1. green evidence-complete Ireland-first reserve proof;
2. five fresh review-ready drafts;
3. safe/relevant images verified;
4. owner reviews and publishes in Sanity.
