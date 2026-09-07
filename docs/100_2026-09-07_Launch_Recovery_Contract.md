# 2026-09-07 — Launch recovery contract for 8 September

## Status

This document supersedes older launch-recovery assumptions where they conflict with the measured 7 September evidence. Historical evidence remains valid for the runs and dates it describes.

## Measured 7 September production evidence

Run `34135365500` (`Irish current article recovery`, head `61f8bca88ae2da5bf2f5397f2fd5b67b2450fa86`) completed with failure at `Import fresh review-ready drafts`.

Free/deterministic stages succeeded:

- 28/28 standard discovery sources succeeded;
- 160 standard leads were found;
- targeted Irish discovery added 40 leads, producing 200 total leads;
- acquisition produced 17 corroborated candidates;
- concrete evidence accepted 14 and rejected 3;
- one same-day draft was retained;
- Ireland-first diversity passed with `minIrishConnected=3`, `maxInternationalOnly=2`, `availableIrish=3`, and 10 replacement candidates after concentration filtering;
- freshness left eight selectable candidates after rejecting two known repeats.

Generation/review did not recover the four missing slots. The run created zero new drafts and retained one eligible draft. The measured failures were:

1. Mack Hansen / Connacht victory: Publication Review blocked because the evidence/draft omitted basic completed-match facts including final score and concrete on-field detail. Artifact inspection also exposed a separate acquisition-coherence defect: a `Sir Steve Hansen` All Blacks story was clustered into the `Mack Hansen` candidate because surname-only person anchoring treated different people as related.
2. Joey Carbery / Leinster: Review #2 contained only medium/low observations, but the API route incorrectly rejected any `review2.verdict != pass` after `PublicationReviewCycle` had already enforced the documented critical/high-only blocking contract.
3. Red Roses squad: Publication Review blocked because the fact material described counts but did not provide enough actual player names for a concrete squad story.
4. A later match-like candidate was correctly rejected by the pre-generation evidence gate before OpenAI spend.
5. Remaining attempts were blocked by the daily guard at `$0.385 reserved + $0.055 requested > $0.40`.

No image stage or consolidated Zoho package was reached by this recovery. One earlier retained 7 September draft remained in Sanity. No automatic publication occurred.

## Root cause

The 7 September failure was not primarily Irish discovery starvation anymore. PR #441's targeted discovery produced exactly the three Irish-connected candidates required by the package rule. The new bottleneck was the contract between evidence, generation and Publication Review:

- evidence sufficiency was broad enough to admit completed-match stories without a final score in the usable fact ledger;
- squad/selection stories could reach generation with counts but too few actual named people;
- the route duplicated Publication Review's verdict logic and turned medium/low-only observations into a hard failure, contradicting the documented rule that only critical/high issues block readiness;
- recovery could spend reservations on replacement candidates after earlier candidates failed, allowing early failures to consume most of the daily ceiling;
- targeted Irish discovery existed as a special recovery step rather than as an invariant of normal discovery.

## PR #442 recovery changes

PR #442 makes the launch path finite and evidence-first:

1. `scripts/discover-current-editorial-sources.mjs` always runs the targeted Irish reserve augmentation after standard free discovery. Ireland-first is therefore part of normal discovery, not only a special recovery workflow.
2. `app/api/editorial/draft/route.ts` rejects a completed-match story before budget reservation when the usable fact ledger has no final score.
3. The same route rejects squad/selection stories before budget reservation when the usable fact ledger contains fewer than two named people.
4. The route no longer rejects `review2.verdict != pass` after `runPublicationReviewCycle()`. That cycle remains authoritative and still throws on critical/high blockers. Medium/low observations remain visible but are not a second hidden hard gate.
5. `scripts/prepare-slot-budget-batch.mjs` reads retained same-day drafts and recent editorial positions, selects exactly the number of fresh candidates needed for missing slots, and records a slot plan. The launch recovery therefore has one paid candidate per missing slot, zero paid replacement attempts in that run, and serial generation. At five empty slots, five `$0.055` reservations total `$0.275`, below the `$0.40` daily ceiling; the global Sanity budget circuit breaker remains authoritative.
6. `scripts/test-launch-recovery-contract.mjs` plus the `Launch recovery contract test` workflow provide deterministic regression coverage for the new contract.

## Quality rules preserved

The repair does not weaken:

- multi-source evidence;
- freshness identity;
- originality and Draft Ready gates;
- Publication Review critical/high blocking;
- max-two same-team and same-matchup diversity;
- the Ireland-first package rule of at least 3/5 direct Irish connection and at most 2 international-only stories;
- image relevance fail-closed behaviour;
- Sanity human approval/publication boundary.

No model call is required to discover, corroborate, filter, rank, freshness-check or slot-plan candidates.

## $0.40 budget contract

The owner-approved application ceiling is `$0.40` per Europe/Dublin operational day. Terra remains the default generation model and Luna remains the default Publication Review/repair model. A production draft pipeline reservation remains `$0.055`.

The launch recovery adds a second boundary: the candidate batch is reduced to exactly one paid candidate per missing slot before generation. This prevents a single recovery run from spending successive reservations on an unbounded replacement queue. It does not convert conservative reservations into provider billing reconciliation; actual provider billing remains token-based and must still be monitored separately.

No further paid 7 September generation should be triggered because the measured ledger had already reached `$0.385`.

## 8 September hard launch recovery plan

The 8 September attempt is a finite sequence:

1. free standard + Irish-targeted discovery;
2. coherent corroboration and concrete evidence filtering;
3. Ireland-first package selection (>=3 Irish-connected, <=2 international-only);
4. recent-position freshness check;
5. one-to-one slot planning for the missing slots;
6. Terra generation and Luna Publication Review only for those slot candidates;
7. only critical/high Review #2 issues block; medium/low observations do not create a duplicate route-level rejection;
8. deterministic post-review gates remain mandatory;
9. safe image planning/acquisition/verification runs only after editorial drafts exist;
10. owner reviews in Sanity and is the only publication authority.

If a candidate lacks the factual material required by its story type, it must fail before model spend and the engineering response is to improve free evidence acquisition/reserve depth, not to ask the model to invent or reconstruct missing facts.

## Go-live definition

Website go-live requires five genuinely fresh, review-ready drafts with at least three direct Irish connections, safe relevant imagery or an explicit no-image fail-closed state where appropriate, and a functioning Sanity human review/publication boundary. Meta/social automation is not part of this launch gate.

## Verification status at document creation

- Implemented on branch: yes.
- PR: #442 open when this document was first written.
- Deterministic test workflow: added; execution pending PR/merge Actions evidence.
- Merged: pending at document creation.
- Vercel deployed: pending at document creation.
- Production exercised with a new Dublin-day budget: deliberately pending; do not spend the exhausted 7 September allowance.
- Zoho: no new consolidated package from run `34135365500`.
- Human publication: not performed automatically.
