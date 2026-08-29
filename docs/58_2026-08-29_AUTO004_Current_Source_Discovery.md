# AUTO-004 current-source discovery — 29 August 2026

PR #301 is the first real scheduled current-source stage in the normal morning path.

## Implemented

- Reads `data/editorial-sources/source-registry.json` and only queries sources with `allowDiscovery:true`.
- Discovers <=36-hour rugby leads scoped to each configured source domain.
- Carries source tier, owner priority and evidence role into machine-readable output.
- Produces explicit preliminary `subject + development + angle + occurredAt` identities.
- Fails closed unless at least two registry sources are reachable and at least five current leads exist.
- Uploads a 14-day machine-readable discovery artifact.
- Runs at 05:30 UTC (06:30 Europe/Dublin during Irish summer time) and supports controlled manual dispatch.
- Does not publish, call article generation, or spend model credit.

## Verification boundary

PR #301 is merged at `fdbe18947b32e59a949d8d0971705b72263eca23`. A normal scheduled run has not yet occurred, so the discovery worker is not production-proven.

AUTO-004 remains Critical/In Progress. Discovery leads must next be clustered/corroborated into multi-source evidence packs, compared with recent production Sanity positions through the existing #293-#295 freshness selector, and only five fresh survivors may enter generation. The discovery artifact must not be fed directly to generation.

Consecutive normal-day 5/5 proof starts only after that connection is implemented and scheduled end-to-end.