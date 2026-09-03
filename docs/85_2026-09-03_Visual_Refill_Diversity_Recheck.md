# 3 September 2026 — Visual refill diversity recheck P0

## Measured state

Production recovery run `33702511350` correctly applied the package diversity gate before the first generation pass. Later, image recovery evicted the image-unfulfillable Itoje draft and refilled only that missing slot.

After refill, the current Sanity package contained three South Africa-focused positions:

- `current-2026-09-03-303865f55eeb` — South Africa / New Zealand rivalry;
- `current-2026-09-03-3388ed23276e` — Springbok scrum / New Zealand implications;
- `current-2026-09-03-d3b0b12a1fb5` — Rassie Erasmus / referee influence.

The contractual same-team limit is two positions per recognised team in a five-story package.

## Root cause

`enforce-current-package-diversity.mjs` ran before the original model-generation stage, but visual recovery changed the retained package later in the workflow. `evict-current-visual-deficit-draft.mjs` excluded the evicted candidate from the recovery batch and the workflow immediately generated a replacement without reapplying the diversity component to the new retained four-story state.

Therefore a candidate that had been permissible against the earlier retained state could become an excessive same-team replacement after a different story had been generated and another story evicted for image reasons.

## Repair

PR #385 reuses the existing canonical diversity component rather than duplicating its rules. After the visual-deficit draft is evicted and excluded from the recovery batch, `evict-current-visual-deficit-draft.mjs` now executes `scripts/enforce-current-package-diversity.mjs` against:

- the actual retained current Sanity drafts;
- the remaining acquisition/recovery candidate pool;
- the existing maximum-two same-team boundary;
- the existing maximum-two same-matchup boundary.

The recheck happens before replacement model spend. A failed/insufficient diversity-safe pool fails closed rather than generating a package that violates the launch contract.

## Required production verification

The change remains incomplete until a bounded production recovery demonstrates that:

1. visual eviction still preserves four valid slots and excludes the image-unfulfillable candidate;
2. diversity is re-evaluated before the refill candidate is generated;
3. the replacement cannot create a third position around one recognised team or canonical matchup;
4. exactly five fresh review-ready drafts survive all editorial and visual gates;
5. exactly one consolidated Zoho package is accepted (or the exact-package lock proves it was already sent);
6. no content is automatically published and no Meta/social action is performed.

## Delivery state at diagnosis

Zoho was **not sent** by run `33702511350`; the final visual gate failed before delivery.