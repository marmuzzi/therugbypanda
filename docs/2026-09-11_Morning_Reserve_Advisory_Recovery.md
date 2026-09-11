# 11 September 2026 — Morning reserve-advisory recovery

## Production evidence

Recovery run `34566505346` verified PR #491's canonical paid-attempt eligibility against production data. The canonical pool correctly excluded two same-day paid candidate IDs before freshness/capacity calculations, then automatically ran the bounded free refill because the preferred reserve target was thin.

After refill the final canonical pool contained six genuinely unpaid, fresh eligible candidates for four missing package slots. The daily Sanity budget ledger remained at `$0.220`; no additional model reservation was made by this run. The Ireland-first check inside package diversity passed before the later failure, proving enough Irish-connected replacement capacity remained for the required package floor.

The run then failed only because `enforce-current-package-diversity.mjs` still treated the preferred three-candidate recovery reserve as mandatory: it required seven replacement candidates for four missing slots and aborted at six. This contradicted the canonical contract already implemented in `qualify-current-editorial-pool.mjs`, where the package minimum is mandatory and reserve depth is preferred recovery capacity.

## Recovery change

The diversity gate now preserves all hard editorial rules — Ireland-first, package distinctness, team/matchup concentration and the exact missing-slot minimum — but treats reserve depth as advisory once the five-story package can be filled. It records `reserveTargetMet` and `reserveShortfall` instead of aborting a valid package solely because the optional reserve is one story short.

This does not weaken freshness, evidence, Irish quota, budget protection or media requirements. Paid retry loops remain disabled.

## Related PRs

- PR #491: canonical qualification now excludes same-day paid attempts and slot planning no longer reinterprets freshness.
- PR #492: launch recovery contract updated to enforce the single canonical freshness/paid-eligibility boundary.
- PR #493: regression-test TypeScript import integration corrected for Vercel production builds; no production newsroom behavior changed.
- PR #494: package diversity reserve changed from hard abort to advisory after the mandatory missing-slot minimum and Irish quota have passed.

## Verification required

1. Verify PR #494 is merged and the latest main SHA deploys READY in Vercel production.
2. Run the current-source production workflow on that merged SHA.
3. Verify canonical paid exclusions and free refill remain green.
4. Verify package diversity passes with four or more valid replacement candidates even if the preferred reserve target is short.
5. Verify slot planning consumes the canonical pool without a second freshness decision and selects exactly one unpaid candidate per missing slot.
6. Verify generation stays within the existing Europe/Dublin ledger, `$0.75/day` hard ceiling and zero paid replacement loops.
7. Require mandatory exact official story-specific embedded media before review delivery.
