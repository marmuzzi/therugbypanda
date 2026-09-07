# 2026-09-07 — Zero-model reserve proof and final pre-spend repair

## Production proof

PR #443 merged as `787fc8f3326e4a79b1d735bb66dec17c98e1fe0c` and automatically ran `Launch reserve proof` run `34146444423` in the production environment. The workflow deliberately contains no draft API/model step.

The run succeeded through every free stage:

- standard discovery: 28 successful, 0 failed, 152 leads;
- targeted Irish reserve: +40 leads, 192 total;
- acquisition: 90 rugby seeds, 102 rejected non-rugby, 37 pre-deduped clusters, 19 corroborated candidates;
- evidence filter: 15 accepted, 4 rejected, 1 retained eligible, 4 fresh required;
- Ireland-first diversity: passed, 4 Irish-connected candidates available for 3 required Irish slots, 12 replacement candidates after concentration filtering;
- recent production history: 68 positions loaded from Sanity;
- slot plan: retained 1, missing 4, paidAttemptLimit 4, replacementPaidAttempts 0, one candidate assigned to each missing slot;
- artifact ID `10027845515`, SHA256 `a0cdbca6c12dc4c25e01c21bcdf4e06b2c2a0a81b8120ad503d207120f8cdfb8`.

No OpenAI generation/review call was made by this proof workflow.

## Important defect exposed by the proof

The free proof selected four paid-slot candidates, but two were already known from the earlier paid failure to be unsuitable:

- `current-2026-09-07-fa3759cf5d9a` — Mack Hansen / Connacht completed-match candidate, with no final score in the fact material and measured Mack Hansen / Sir Steve Hansen contamination;
- `current-2026-09-07-f71f62b1716d` — Red Roses squad candidate whose fact material did not contain enough actual player names.

Therefore slot planning alone was not sufficient. The story-type generation-readiness rules had to move upstream of diversity/slot selection.

## PR #444

PR #444 changes the free `filter-current-acquisition-evidence.mjs` gate so paid slots can only be filled after:

- completed-match fact material contains an explicit final score;
- squad/selection fact material contains at least two actual named people;
- person corroboration uses normalized exact full-name evidence across independent sources rather than surname fallback;
- a same-surname/different-first-name collision between the story identity and fact material fails closed.

The API route retains the same story-type checks as defence in depth immediately before budget reservation.

Deterministic contract CI run `34146667441` passed on PR #444.

## Remaining verification

After #444 merges, rerun the zero-model reserve proof. Success is not merely a green workflow: inspect the selected IDs and evidence report to confirm the known Hansen and under-specified Red Roses candidates are absent from paid slots and at least four fresh candidates remain for the four missing slots while preserving >=3 Irish-connected stories in the eventual five.

Only after that free proof and Vercel production readiness should the next Dublin-day paid launch recovery run.
