# AUTO-004 first scheduled-window evidence — 30 August 2026

## Measured result

The first expected normal 06:30 Europe/Dublin current-source acquisition window did **not** produce a `Current editorial source discovery` GitHub Actions schedule run.

GitHub Actions scheduled-run history was inspected after the window. The schedule feed contained the established `Send editorial daily package` workflow but no schedule-event run for `.github/workflows/current-source-discovery.yml`.

Therefore 30 August does **not** count as day 1 of the required consecutive normal scheduled 5/5 AUTO-004 proof.

## Runtime state on main

PR #312 is merged at `933538ca8e75b3876ebfd7b80b35c57b72dd6063`.

The current workflow on `main` contains:

- both UTC cron equivalents of 06:30 Europe/Dublin;
- a delay-safe guard based on `github.event.schedule` plus the Dublin UTC offset;
- deterministic dependency installation;
- production secret checks;
- registry-driven current-source discovery;
- corroborated acquisition-batch construction;
- recent production Sanity editorial-position export;
- pre-generation freshness filtering through the protected importer;
- exactly five fresh survivors or fail closed;
- machine-readable discovery/acquisition evidence upload.

A manual dispatch remains diagnostic-only and must never be counted as normal scheduled-day proof.

## Acceptance boundary

AUTO-004 remains Critical / In Progress until GitHub emits a genuine schedule-event execution that traverses discovery -> corroboration -> production-history freshness comparison -> exactly five production-eligible drafts, and a second consecutive normal scheduled day repeats that result.

If the next normal window also produces no schedule event, treat GitHub schedule activation/reliability as the active P0 defect rather than changing freshness/generation logic or manufacturing a recovery pack.

No media-library count changes are claimed by this evidence document.