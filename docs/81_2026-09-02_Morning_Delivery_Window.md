# 2 September 2026 — Morning delivery window correction

## Scope

This note records a launch-critical scheduling correction for the normal current-source morning workflow after repeated owner observation that the editorial email arrived materially later than the 08:00 Europe/Dublin contract.

## Root cause found

The repository GitHub Actions workflow used UTC cron entries `30 5 * * *` and `0 6 * * *`. On 2 September Ireland is on Irish Standard Time (UTC+1), so those repository-native starts resolve to 06:30 and 07:00 Dublin time. That left too little runway for acquisition, generation, review, image repair/acquisition and exact-five Zoho delivery and did not match the intended 05:30 Dublin start.

## Change

The primary GitHub schedule now starts at `04:30 UTC`, which is 05:30 Dublin during Irish summer time. A second serialized safety run is scheduled at `05:30 UTC`.

A workflow-level concurrency group prevents the safety run racing an unfinished primary run. `cancel-in-progress: false` means the second invocation waits rather than cancelling active newsroom work. Once the first run has successfully delivered, the existing exact-package completion evidence makes the safety invocation a no-op.

The workflow now also emits explicit UTC timestamps for:

- workflow start;
- exact package ready after visual verification;
- daily-package delivery response.

These timestamps complement GitHub Actions' own step timestamps and make the before-08:00 Europe/Dublin acceptance criterion directly measurable.

## DST behaviour

GitHub cron remains UTC. The chosen primary schedule intentionally favours delivery margin: it starts at 05:30 Dublin during Irish summer time and one hour earlier during winter. Earlier winter acquisition is acceptable; late delivery is not. The editorial freshness window remains 36 hours.

## Safety boundaries unchanged

No freshness, evidence, same-package diversity, originality, Draft Ready, Publication Review, image relevance, exact-five identity, Zoho idempotency or human Sanity publication boundary is weakened. No Gmail path is introduced.

## Verification boundary

Implementation is verified by repository configuration. Production behavioural verification requires the next normal scheduled run to record five fresh eligible articles, package-ready time and a Zoho `sent`/`already-sent` response before 08:00 Europe/Dublin.
