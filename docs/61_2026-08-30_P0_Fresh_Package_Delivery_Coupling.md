# P0 — Fresh package delivery coupling

Date: 30 August 2026

## Production defect

A normal `Send editorial daily package` schedule event succeeded on 30 August after the fresh acquisition worker had not produced a new package. The daily-package API selected the newest five production-eligible drafts without requiring that the acquisition/import chain had succeeded in the same run, so the previous day's five were sent again through Zoho.

This is a launch-critical AUTO-003/AUTO-004 coupling defect. A successful email transport is not a successful morning package when the content is stale.

## Permanent repair

Normal Zoho delivery is now owned by `.github/workflows/current-source-discovery.yml` and runs only after the protected current-source pipeline has successfully completed discovery, corroboration, recent-production-history export, freshness selection, cleanup and the exactly-five fresh import.

The independent clock-driven trigger has been removed from `.github/workflows/send-editorial-daily-package.yml`. That workflow remains manual-only for controlled diagnostics/recovery.

The protected editorial gates are unchanged: subject + event/development + editorial-angle freshness before model generation, multi-source evidence, originality, Draft Ready, Publication Review and mandatory human Sanity publication approval.

## Acceptance boundary

Implemented/committed in this change:

- stale independent scheduled Zoho sends are removed;
- normal delivery is sequenced after successful fresh import;
- failure anywhere before the import prevents normal Zoho delivery.

Still required for production verification:

- a genuine normal scheduled current-source run must traverse the complete chain and send the exact fresh five;
- a second consecutive normal scheduled day must do the same before AUTO-004 consecutive-day proof is complete.

The 30 August stale email does not count as a successful package or freshness proof day.
