# P0 — Recovery candidate-pool breadth repair

Date: 31 August 2026

## Production evidence

Incremental recovery run `33443113770` proved that three eligible same-day drafts were retained and that weak evidence was rejected before GPT-5 spend. It then failed closed with only one fresh evidence-sufficient candidate for the two missing slots.

The discovery stage had 102 current leads and 43 rugby-relevant seeds, but the corroboration bridge emitted only five candidates. Three of those five were correctly rejected by the freshness gate because they repeated the three retained same-day stories.

## Root cause

The corroboration bridge used a global `used` set while greedily building clusters. A lead consumed as secondary evidence for an early broad cluster could not support a later seed, even when that later seed represented a distinct development. This collapsed the candidate pool before the authoritative subject + development + angle freshness selector could evaluate it.

## Repair

- Build corroborated clusters independently for each rugby-relevant seed.
- Permit secondary evidence to support evaluation of more than one seed; evidence reuse does not make two editorial positions identical.
- Keep cross-domain corroboration mandatory.
- Prefer stronger source-tier / owner-priority corroborators and cap a cluster at four source records.
- Deduplicate only near-identical subject + development identities before the existing production-history freshness selector.
- Preserve all existing non-rugby, generic-source, evidence-sufficiency, originality and Publication Review gates.

This intentionally broadens the **candidate pool**, not the acceptance criteria.

## Verification boundary

The repair is complete only when production recovery produces enough fresh evidence-sufficient positions to fill the remaining same-day slots without regenerating retained drafts, and the full five-draft package passes before Zoho delivery.
