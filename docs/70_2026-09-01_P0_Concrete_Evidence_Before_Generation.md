# P0 — Concrete evidence before generation

Date: 1 September 2026
Issue: AUTO-004-P9
Priority: P0 / Critical
Status: Implemented; pending merge/deployment/production verification

## Production evidence

The first 1 September bounded recovery reached GPT-5 with multiple candidates that passed the older evidence-count gate but lacked the concrete facts Publication Review requires. Measured failures included:

- a URC preview without venue, kickoff time, named players/coaches or notable absences;
- a Springboks/All Blacks story referring to a former All Blacks hooker and one Springbok change without naming either the hooker or the changed player;
- Leinster U-18 Girls match-result candidates without final score, match date, venue or named personnel.

These candidates consumed generation/review tokens before being correctly rejected by Publication Review.

## Root cause

The existing pre-generation evidence gate only required two substantive source records, two distinct publishers and two substantive fact strings. It did not test whether those facts contained enough concrete rugby detail to support a publishable article.

## Fix

A new deterministic gate runs after corroboration and before freshness selection/model generation. It requires each candidate to retain:

- at least two independent source records;
- at least two substantive facts;
- at least one named person in the evidence, excluding known team/competition identities;
- at least one concrete rugby marker such as a number/score, date/month, named venue, position/role, selection detail or attributable quote;
- for match-like stories, explicit match context such as score/number, date/month, venue or Test ordinal.

Candidates failing the contract are removed before GPT-5. The gate fails closed if fewer than five sufficiently concrete candidates remain, rather than spending credits on material likely to be rejected later.

Machine-readable evidence is written to `data/editorial-acquisition/current-evidence-sufficiency.json` and uploaded with the newsroom run artifact.

## Cost-control boundary

This does not weaken Publication Review, originality, freshness or the five-story requirement. It shifts a class of predictable failures to a deterministic pre-model check so failed evidence does not consume OpenAI generation/review calls.

Resolution date: pending production verification.
