# Publishing Workflow

Sanity Studio is the canonical CMS and mandatory human approval/publication boundary.

## Session startup

Read `docs/07_Project_State.md`, `docs/08_Issue_Log.md`, this file, `docs/100_2026-09-07_Launch_Recovery_Contract.md` and the newest relevant evidence. Check GitHub/Vercel/current integrations before asking the owner to configure anything. Use Europe/Dublin for schedules.

## Completion discipline

Always distinguish implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity verified and provider/delivery verified. A code merge is not production verification.

## Required editorial flow

```text
free standard source discovery
→ free targeted Ireland/Leinster/Munster/Ulster/Connacht reserve discovery
→ rugby/noise rejection + coherent cross-publisher corroboration
→ story-type-specific concrete evidence gate
→ retained same-day integrity revalidation
→ recent-position freshness
→ Ireland-first + team/matchup package diversity
→ exactly one fresh candidate assigned to each missing paid slot for launch recovery
→ Editorial Brain / fact ledger
→ Terra generation
→ deterministic Draft Ready + originality
→ Luna Publication Review + at most one bounded correction inside the draft pipeline
→ Review #2: critical/high blockers fail; medium/low observations do not independently block
→ deterministic post-review gates
→ production-eligible Sanity draft + individual review notification
→ strict local image planning/acquisition/verification
→ Editorial Review
→ human edit/approve/publish
→ public website
```

Generated content and acquired images are never automatically published.

## Ireland-first package contract

For launch, at least three of five stories must have a direct Irish connection: Ireland/IRFU, Leinster, Munster, Ulster, Connacht, Irish women, Irish players/coaches abroad, or European competition materially involving Irish teams. International-only stories are capped at two.

Do not manufacture a weak Irish story to satisfy the quota. If the free evidence stage cannot supply the Irish floor, fail before paid generation and improve discovery/evidence depth.

Targeted Irish reserve discovery is part of normal discovery from PR #442 onward; it is not merely a manual recovery mode.

## Evidence-before-spend contract

All normal evidence rules remain: at least two substantive sources from at least two publishers, coherent same-development corroboration, concrete rugby facts, and no non-rugby contamination.

Additional story-type floors from PR #442:

- match/trial stories retain the existing concrete-detail-class requirement;
- completed-match stories require the final score in the usable fact ledger before budget reservation;
- squad/selection stories require at least two actual named people in the usable fact ledger before budget reservation.

The model must never be asked to reconstruct a score, squad list or other basic factual payload that deterministic acquisition failed to supply.

The measured 7 September Mack Hansen candidate also exposed surname-only identity contamination: `Mack Hansen` evidence was clustered with a `Sir Steve Hansen` story. That upstream clustering bug remains fail-closed work and must be fixed independently; the completed-match score gate merely ensures the measured bad candidate cannot consume model budget again.

## Freshness and diversity

Freshness identity remains **subject + event/development + editorial angle**. Recent production positions are loaded before generation. Same-day retained drafts must still pass current evidence integrity and freshness; they are not grandfathered.

Package limits:

- max two stories for the same canonical matchup;
- max two stories for the same recognised team;
- min three Irish-connected launch stories;
- max two international-only launch stories.

## Launch slot budget

The application-wide OpenAI reservation ceiling is `$0.40` per Europe/Dublin operational day. A production draft pipeline reservation is `$0.055`.

For the 8 September launch recovery, `scripts/prepare-slot-budget-batch.mjs` runs after freshness history is exported and before paid import. It reads retained same-day drafts, calculates missing slots, selects exactly that many fresh candidates, writes the slot plan into the batch and removes the paid replacement queue.

The recovery workflow runs generation serially. Five empty slots therefore plan at most five draft reservations (`$0.275`) in that recovery. The Sanity daily guard remains authoritative and blocks any reservation that would exceed `$0.40`.

A genuine critical/high failure does not trigger a paid replacement loop in the same launch recovery. Improve free evidence/reserve quality first.

## Draft Ready and Publication Review

Hard Draft Ready limits remain headline <=70 characters, standfirst <=220, SEO title <=60, SEO description <=160 and paragraph <=120 words, plus filler/formulaic-writing/originality safeguards.

Publication Review is mandatory. `runPublicationReviewCycle()` is authoritative:

- critical/high issues block readiness;
- medium/low observations are advisory unless a deterministic hard gate independently fails;
- one bounded correction pass may fix supported issues using only the supplied fact ledger;
- post-review normalization and deterministic gates run again.

PR #442 removes the duplicate API-route check that rejected any `review2.verdict != pass` even when Review #2 contained only medium/low observations. This restores the already-documented severity contract without lowering factual or originality gates.

## Images

Only rights-reviewed, usage-approved local Sanity assets are eligible for automatic assignment. Relevance beats fill rate.

Priority: exact person → correct team/event/venue → genuinely relevant rugby context → approved relevant brand fallback → no image.

Hard conflicts remain fail closed: wrong named person, conflicting team, men/women mismatch, unrelated event context, duplicate package/body assets. The owner-reported James O'Connor and Codie Taylor semantic-image defects remain pending final repair/verification.

## Notifications and Zoho

Production draft creation sends an individual editorial notification; QA drafts are suppressed. The historical consolidated exact-five Zoho path still exists and must not be treated as reconciled with the owner's current one-email-per-draft preference until the package-completion marker is decoupled and production-verified.

Run `34135365500` did not reach images or consolidated Zoho delivery. No new consolidated package was sent by that run.

## Human publication boundary

Five review-ready drafts are not automatically published. The owner reviews/edits in Sanity and explicitly publishes. Public website launch follows that human action. Meta/social is excluded from the current launch gate.

## 8 September launch sequence

1. confirm PR #442 merged and Vercel production READY;
2. run free discovery/evidence/freshness/diversity and slot planning;
3. verify >=3 Irish-connected candidates and one paid candidate per missing slot;
4. spend only the new Dublin-day allowance on those slots;
5. preserve only drafts that pass deterministic gates and critical/high Publication Review;
6. verify images safely;
7. owner reviews and publishes in Sanity.

Do not rerun an old failed workflow SHA after code changes. Do not spend the exhausted 7 September allowance.
