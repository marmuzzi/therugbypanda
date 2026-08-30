# AUTO-004 Scheduled Discovery → Importer Wiring — 30 August 2026

## Issue

AUTO-004 remains Critical / In Progress until consecutive normal scheduled days prove exactly five genuinely fresh positions. After #301/#303/#308, the 06:30 Europe/Dublin worker could discover current registry sources and build a corroborated importer-compatible acquisition batch, but it still stopped before production-history export and the protected importer.

## Root cause

`current-source-discovery.yml` produced artifacts only. The existing freshness/import path lived separately in `import-editorial-acquisition-batch.yml`, so a normal scheduled discovery did not itself traverse the production-history freshness gate and generation/import path.

## PR #309

PR #309 wires the scheduled worker to the existing protected AUTO-004 path without duplicating freshness logic:

- uses the production environment and existing Sanity/editorial automation secrets;
- discovers current registry sources;
- builds corroborated multi-source acquisition evidence;
- exports recent production Sanity editorial positions;
- removes superseded generated drafts;
- invokes `import-editorial-acquisition-batch.mjs` with the newly generated batch;
- retains the importer's existing subject + event/development + editorial-angle freshness comparison and exactly-five fail-closed requirement;
- uploads raw discovery, corroborated batch and recent-position history as evidence even when a later step fails.

No static/default acquisition batch fallback is reintroduced. Freshness/source selection still happens before model generation.

## Status

- Implemented: yes.
- Committed: yes.
- PR: #309.
- Merged: pending at document creation time.
- Deployed: pending merge; workflow-only change does not require a Vercel deployment.
- Production verified: no. The next genuine 06:30 Europe/Dublin scheduled run is the required first normal-run proof.
- Consecutive-day AUTO-004 proof: pending at least two successful normal scheduled days.

## Acceptance boundary

Do not close AUTO-004 merely because #309 merges. Close only after normal scheduled runs prove exactly five current, corroborated, production-history-fresh positions reach the normal gated draft path on consecutive days, with the normal 07:45 Zoho package downstream.
