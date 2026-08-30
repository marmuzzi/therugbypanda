# AUTO-004 delay-safe schedule guard — 30 August 2026

## Evidence observed

After the first expected 06:30 Europe/Dublin production window, the repository-wide scheduled-run feed contained no `Current editorial source discovery` execution. The workflow is present on `main` with both UTC cron slots, but the first normal scheduled AUTO-004 proof therefore remains unproven.

## Additional scheduler defect found

The workflow's timezone guard compared the GitHub runner's actual wall-clock time with exactly `06:30`. GitHub scheduled workflows are not guaranteed to start at the exact nominal minute. A valid cron event starting even a few minutes late could therefore enter the workflow and immediately self-skip.

This is independent of the missing-run evidence above: it is a deterministic robustness defect that could invalidate future normal-day proof even when GitHub scheduling fires correctly.

## Fix

The guard now uses the scheduled cron identity plus Dublin's UTC offset instead of the runner's HHMM:

- during Irish Summer Time (`+0100`), the `30 5 * * *` event is active;
- during winter time (`+0000`), the `30 6 * * *` event is active;
- the alternate UTC slot is skipped;
- `workflow_dispatch` remains explicitly active for diagnostics, but manual runs do not count as normal scheduled proof.

A delayed scheduled event therefore still executes the correct 06:30 Dublin newsroom path.

## Status

- Implemented: yes.
- Committed: yes, on `p0/auto004-schedule-delay-guard`.
- Production verified: pending merge and a genuine scheduled event.
- AUTO-004 consecutive-day acceptance: still open; manual or recovery runs do not count.

## Acceptance boundary

Do not claim day-one scheduled proof until GitHub records a real `schedule` event for this workflow and that run traverses discovery, corroboration, production-history freshness filtering and the protected exactly-five importer. A second consecutive normal scheduled day is still required before AUTO-004 can close.
