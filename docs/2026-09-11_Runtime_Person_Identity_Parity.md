# 11 September 2026 — Runtime person-identity parity

## Production evidence

Production recovery run `34566787385` verified the repaired canonical pool, free refill, Ireland-first diversity and slot planning. The package had one retained Irish draft, four missing slots, exactly two additional Irish-connected candidates selected, no paid replacement candidates inside the run and `rejectedByFreshness: 0` in slot planning.

Generation then attempted the four selected candidates once. Two reached Terra generation and Luna Publication Review but were rejected by the final review gate, so no draft was persisted for them. Two other candidates failed before OpenAI reservation because the runtime route misclassified capitalised organisation/competition phrases as person names:

- `Lancaster's Connacht` / `Times Connacht` produced a false surname collision on `connacht`.
- `WXV Global` / `Wallaroos Global` produced a false surname collision on `global`.

The upstream deterministic evidence filter had already excluded these generic team/competition tokens, so the runtime route disagreed with pre-AI qualification. That was a parity defect, not weak evidence.

## Recovery change

`lib/editorial/PersonNameHeuristics.ts` now centralises runtime person-name extraction and excludes generic team, competition, publisher and rugby-label tokens while preserving real names such as Stuart Lancaster and Mack Hansen. The draft API uses this shared helper for person coherence and squad/match detail checks. Regression tests cover both genuine names and the exact `Connacht` / `Global` false-positive classes, and the production newsroom workflow runs those tests before discovery.

This change occurs before any budget reservation. It does not relax the requirement for coherent same-person evidence and does not change the `$0.75/day` hard ceiling, `<= $0.40/day` normal target, Terra generation, Luna review or zero paid replacement policy.

## Same-day launch consequence

The two Publication Review rejections in run `34566787385` are authoritative paid attempts and must not be replaced by additional paid candidates under the zero-paid-replacement contract. The two runtime identity failures did not reserve OpenAI budget and remain legitimately recoverable after this deterministic fix. Therefore, even if both no-spend candidates succeed after verification, today's package cannot reach five without weakening the approved paid-replacement rule. That is now a real same-day launch blocker rather than a discovery or freshness blocker.

## Verification required

1. Merge the parity fix and verify Vercel production READY on the merged/main SHA.
2. Verify the person-name regression tests pass in GitHub Actions.
3. Verify the two false-positive classes no longer fail at the runtime pre-generation evidence gate.
4. Do not retry or replace the two candidates already rejected by Publication Review.
5. Continue mandatory official story-specific media qualification for any successfully persisted drafts.
