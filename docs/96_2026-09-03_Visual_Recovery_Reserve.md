# 3 September 2026 — Visual Recovery Reserve

## Production evidence

GitHub Actions run `33718948575` reached five current production-eligible drafts and completed current-package image planning, targeted deficit discovery/import, readiness reconciliation and strict re-planning. The run then failed at `Evict one image-unfulfillable current draft after acquisition exhaustion`; all downstream refill, final visual verification and Zoho delivery steps were skipped.

The uploaded acquisition batch proves the visual eviction itself excluded `current-2026-09-03-66e11a369102` (James Slipper) from the recovery pool. After that exclusion, the batch still contained two fresh non-retained recovery candidates capable of filling the single missing slot: James O'Connor and Rassie Erasmus. The canonical diversity helper nevertheless required three replacement candidates because its generic `PACKAGE_RECOVERY_CANDIDATE_RESERVE=2` rule was inherited by the visual-recovery recheck. With four retained package positions, that translated to one missing slot plus two reserve candidates, so visual recovery aborted before attempting either valid replacement.

This was a recovery-capacity failure, not an editorial-quality failure. Freshness, evidence sufficiency, package diversity, Publication Review and image relevance gates had not rejected those two candidates.

## Repair

Visual eviction now invokes the canonical package-diversity component with a visual-recovery-specific reserve of one candidate by default (`VISUAL_RECOVERY_CANDIDATE_RESERVE=1`). For one missing visual slot, the recovery therefore requires two valid candidates: one candidate to try plus one bounded reserve. The underlying maximum-two team and matchup limits remain unchanged, and the refill still runs through the normal evidence, Publication Review and image gates.

The general pre-generation recovery reserve remains unchanged elsewhere. This repair only prevents the visual-recovery handoff from demanding more reserve capacity than is necessary to exercise its already bounded replacement path.

## Issue-log record

- ID: `AUTO-004-P23`
- Status: Implemented; merge/deployment/production verification pending at creation
- Priority: Critical
- Area: Editorial Automation / Visual Recovery
- Root cause: visual eviction inherited the generic two-candidate recovery reserve, requiring 3 candidates for a single missing visual slot even when two valid fresh replacements remained.
- Related PR: current visual-recovery reserve PR
- Deployment status: pending
- Verification status: pending fresh production recovery
- Resolution date: —

## Verification required

1. The repaired main branch must deploy successfully.
2. A fresh production recovery must pass the first visual-eviction diversity recheck with four retained positions and at least two valid replacement candidates.
3. No maximum-two team/matchup, evidence, freshness, Publication Review or image relevance gate may be weakened.
4. The package must reach exactly five image-verified current drafts.
5. Exactly one consolidated Zoho editorial email must be accepted for the exact five IDs.
6. No article may be auto-published and Meta/social must remain untouched.
