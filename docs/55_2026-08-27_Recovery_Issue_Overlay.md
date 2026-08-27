# 27 August Recovery Issue Overlay

This overlay is newer production evidence than the 26 August issue-log reconciliation and must be read with `docs/08_Issue_Log.md` until the next full reconciliation.

| ID | Status | Priority | Root cause | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AUTO-006 | In Progress | Critical | Morning package/delivery accepted stale previous-day positions as today's package instead of requiring a fresh operational-date/source-angle set. | recovery PR pending | Not deployed | Owner email evidence: stale five-story reuse on 27 Aug; fresh 5/5 recovery required | — |
| WEB-013 | In Progress | Critical | #278 fixed outer responsive/theme shell, but `DraftEditor` Stored formatted preview forced `background:#fff` while normal Portable Text inherited dark-theme foreground, producing white/grey text on white. | #278, recovery PR pending | Recovery not deployed | Owner authenticated phone evidence failed; exact nested preview contrast fix implemented on recovery branch | — |
| MEDIA-009 | In Progress | Critical | Prior selector/backfill evidence did not guarantee the final editor-facing Henderson assignment/presentation; owner still saw an unrelated single image. | #273, #274, #276, #279, recovery pending | Existing guards deployed; recovery pending | Owner production evidence failed on 27 Aug; exact current-draft readback/visible rendering required | — |
| SOCIAL-001 | Blocked | Critical | Production downstream social webhook/orchestrator absent. | #280 | Diagnostic deployed | No Facebook/Instagram provider IDs yet | — |

No issue above is closed by implementation or merge alone. Production/user-visible verification is mandatory.
