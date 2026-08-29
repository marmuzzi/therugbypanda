# 29 August 2026 — Current-source worker reconciliation

## Measured correction

The scheduler-gap evidence in `docs/56_2026-08-29_AUTO004_Normal_Scheduler_Gap.md` was accurate when written but is now superseded for the scheduler-existence claim.

PR #301 (`fdbe18947b32e59a949d8d0971705b72263eca23`) added `.github/workflows/current-source-discovery.yml` and `scripts/discover-current-editorial-sources.mjs`. PR #303 (`9a2f3e3ce4c03e4b7e3bd0544af9cd3c121ce62f`) made the schedule Europe/Dublin DST-safe by scheduling both UTC equivalents of 06:30 and allowing only the matching Dublin-time slot to execute.

The workflow is now present on `main` with scheduled triggers at `30 5 * * *` and `30 6 * * *`, a Europe/Dublin 06:30 guard, registry-driven discovery, fail-closed minimums of two successful sources and five current leads, and a machine-readable discovery artifact.

## What this closes

The repository no longer has the specific P0 defect "no autonomous 06:30 current-source discovery schedule exists". SOURCE-001 has moved from registry-only foundation to scheduled registry consumption at the implementation/merge boundary.

No claim is made that AUTO-004 is complete.

## Remaining AUTO-004 P0 boundary

The deployed discovery worker currently produces current leads and provisional editorial-position identities. It does **not yet** transform those leads into the importer-compatible, corroborated multi-source acquisition batch required by `scripts/import-editorial-acquisition-batch.mjs`.

The remaining permanent path is therefore:

1. scheduled registry-driven current-source discovery at 06:30 Europe/Dublin;
2. cluster/corroborate leads into distinct developments;
3. build importer-compatible candidates with `sourceRecords`, supported `facts`, category and editorial position;
4. export recent production Sanity editorial-position history;
5. run the deployed subject + development/event + angle freshness selector before model spend;
6. require exactly five survivors or fail closed;
7. invoke the existing generation, originality, Draft Ready and Publication Review path;
8. prove consecutive normal scheduled days with five genuinely new positions.

The next normal scheduled 06:30 execution is the first production evidence window for #301/#303. A successful discovery run alone proves discovery scheduling, not a complete 5/5 morning package.

## Media boundary unchanged

MEDIA-011 #304/#305 and the #306 visual-depth publication gate are merged. The strict local library baseline remains 241 until a production acquisition/readback run proves a higher certified count. Normal publication now requires a relevant hero plus at least one relevant inline image; candidate acquisition still targets three strong relevant options per article where possible and never forces filler.

## Verification discipline

Do not describe the scheduler as absent after #301/#303. Do not describe AUTO-004 as production-verified until discovery is converted to corroborated importer-compatible evidence and consecutive normal scheduled 5/5 packages pass. Human Sanity publication remains mandatory.