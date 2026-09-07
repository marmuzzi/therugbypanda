# 2026-09-07 — Final launch recovery status

## Merged engineering

- PR #442 `4989db4fe6c785ef87540cc620bc70a4334f8a8a`: story-type API defence, Publication Review severity-contract repair, normal Irish augmentation, one-to-one launch slot planner, deterministic contract test, core documentation reconciliation.
- PR #443 `787fc8f3326e4a79b1d735bb66dec17c98e1fe0c`: zero-model reserve proof workflow.
- PR #444 `4deccdb80fc781486840b3d6a6866c0b3bdd528d`: moved final-score/squad-name/exact-person-coherence requirements into the free evidence filter before slot planning; contract CI passed on run `34146667441`.
- PR #445 `2abda84123480be9192e34d50aef139b6fe281aa`: retriggerable zero-model reserve proof.
- PR #446 `9094b90b1ac7732b6cd67ac1735ac8ecd2779c8e`: expanded 72-hour Irish discovery to 12 evidence-oriented queries.
- PR #447 `e0b915c4dd4a0e6f250b8d3dc1c9a236b9158c3d`: freshness-aware slot planning now preserves the 3/5 Ireland-first quota or fails before model spend; contract test step passed on PR run `34147139147`.

## Zero-model production evidence

Run `34146444423` passed the original free reserve path and proved one-to-one slot planning, but selected known weak candidates. This directly motivated #444.

Run `34146778688` exercised #444. The stricter free evidence gate reduced 19 corroborated candidates to 5 generation-ready candidates, but only 2/3 required Irish-connected candidates survived. It failed at Ireland-first diversity before any model call. This proved the stricter gate works but Irish evidence-ready supply was too thin.

Run `34146961971` exercised #446. It discovered 153 standard leads plus 66 targeted Irish leads (219 total), built 21 corroborated candidates, accepted 7 after the strict evidence gate, and diversity passed with exactly 3 Irish-connected candidates. Slot planning passed with one retained draft, four missing slots, paidAttemptLimit 4 and zero paid replacements. Inspection showed the old slot planner could still lose the Irish quota after freshness; this directly motivated #447.

Run `34147169151` exercised #447 but failed earlier at Ireland-first diversity because the live discovery snapshot again yielded fewer than three evidence-ready Irish candidates. No paid generation/review occurred. This demonstrates that the remaining blocker is **volatile evidence-ready Irish candidate supply**, not budget churn, Publication Review severity handling or slot quota preservation.

## Budget status

No paid OpenAI generation/review was intentionally triggered by the zero-model proof workflows. The 7 September paid ledger had already measured `$0.385` reserved in the earlier recovery. The application ceiling remains `$0.40` per Europe/Dublin operational day. Do not trigger further paid 7 September recovery.

## Zoho / publication

The zero-model proof workflows do not call the draft API, image pipeline or Zoho. No new consolidated Zoho package was sent by them. No automatic publication occurred.

## 8 September blocker and plan

The code path is materially safer, but a five-article launch cannot be guaranteed from the current volatile 72-hour RSS evidence supply. The remaining P0 is to make at least three Irish-connected candidates **evidence-complete and fresh at the same time** without weakening the evidence floor.

Next engineering action must improve deterministic evidence acquisition depth for Irish stories (for example richer direct-source article extraction/structured match and squad facts) rather than widening the model retry budget or relaxing the 3/5 rule. Once a zero-model proof passes diversity **and** freshness-aware slot planning with selectedIrishCount >=3, the next Dublin-day paid recovery can proceed under the four/five-slot budget plan.
