# AUTO-004 — First normal scheduled run and runner failure evidence

Date: 30 August 2026

## Measured production evidence

GitHub Actions emitted the first genuine `schedule` event for `.github/workflows/current-source-discovery.yml` as run `33306863778` (`Current editorial source discovery`). The run was created at 2026-08-30T10:35:41Z and completed with conclusion `failure`.

This closes the earlier uncertainty about whether GitHub had activated the new schedule: schedule activation is now production-proven. It does **not** count as AUTO-004 day 1 because the run failed before current-source discovery and therefore did not produce five fresh editorial positions.

## Root cause and repair

The scheduled runner failed during Node/dependency setup. The workflow configuration added for the clean runner assumed npm lockfile/cache semantics that the repository does not satisfy. PR #314 replaced that invalid setup with an ephemeral-runner-compatible dependency installation path without changing freshness, originality, Draft Ready, Publication Review or human Sanity publication gates.

PR #314 merged to `main` as `d3a7c44745a0f640b43c74621b2fa34d9e5600c2`.

Vercel production deployment `dpl_Hn3YHRYbqpQG6JpMskaXpVFQVTja` for that merge is `READY`. The AUTO-004 worker itself executes in GitHub Actions, so the next decisive proof remains the next genuine scheduled GitHub execution rather than a manual dispatch.

## Acceptance boundary

Current status is:

- scheduled workflow activation: **production verified**;
- runner setup repair: **implemented / committed / merged**;
- associated Vercel production deployment: **READY**;
- complete scheduled discovery → corroboration → production-history freshness gate → exactly-five protected generation/import: **not yet production verified**;
- consecutive normal scheduled 5/5 days: **not started**.

Manual or recovery executions must not be counted as normal scheduled-day proof. The next genuine scheduled run must reach source discovery, compare candidate subject + event/development + editorial angle against recent production Sanity history before model generation, and either produce exactly five genuinely fresh survivors through the protected path or fail closed.
