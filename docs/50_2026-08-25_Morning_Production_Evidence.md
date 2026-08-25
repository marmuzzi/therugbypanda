# 25 August 2026 — Morning Production Evidence

## Scope

This evidence note records the measured production state after PRs #237 and #238 and the first implementation pass of PR #239. It supersedes any older statement that the morning package, persistent schedule, or consolidated direct Zoho delivery is production-verified.

## Morning package result

The latest controlled AUTO-004 production run on `main` was GitHub Actions run `32822576784` (`Import editorial acquisition batch`, run number 21), triggered by the merge commit for PR #238. The workflow completed with `failure`.

Measured result: **1/5 production drafts completed**.

- Leinster / Joey Carbery: completed the generation/review path successfully.
- Ulster: processing aborted before a production draft was completed.
- Connacht: failed the strengthened deterministic Draft Ready gate; the attempted output still contained a standfirst/formulaic-heading problem.
- Munster: generation could not complete because the production OpenAI API account returned `credit_balance_exhausted`.
- Ireland Women: generation could not complete for the same `credit_balance_exhausted` production API error.

No quality, originality, image-relevance or human-publication gate was weakened to obtain a higher count. AUTO-004 therefore remains pending verification.

## Direct Zoho mail

PR #236 established and production-verified the reusable direct Zoho EU SMTP transport. The explicit production test was accepted by Zoho with `250 Message received` and inbox receipt at `editor@therugbypanda.ie` was owner-confirmed on 24 August.

That proves the transport, but **does not prove the morning consolidated-package orchestration**.

PR #239 (`Send the morning package directly through Zoho SMTP`) is currently open. It implements:

- fail-closed five-draft package selection;
- exactly one consolidated editorial email containing the five review links;
- a deterministic Sanity delivery lock to prevent duplicate accepted packages;
- direct Zoho SMTP rather than Make.com or Gmail;
- Europe/Dublin-aware persistent schedules for acquisition and package delivery;
- technical failure behaviour for an incomplete package.

PR #239 preview deployment is green. It remains intentionally unmerged because its acceptance criterion is a genuine 5/5 production package followed by HTTP 200 / Zoho `250` acceptance for exactly one consolidated message.

## Current blocker

The immediate owner-side blocker for Priority 0 is the production OpenAI API account reporting **`credit_balance_exhausted`**. This is an external account/billing condition, not an application quality-gate failure.

When API credit is restored, the next controlled run should:

1. regenerate all five production candidates;
2. require 5/5 Draft Ready + originality + publication-review acceptance;
3. inspect package-wide image relevance and uniqueness;
4. invoke the consolidated daily-package route exactly once;
5. verify Zoho `250` acceptance and one message at the configured editorial recipient;
6. only then merge/close the remaining orchestration verification work.

## Related launch state

- PR #237 merged: deterministic metadata repair after publication-review correction.
- PR #238 merged: reader-safe final publication-review correction, broader formulaic-heading guard and final deterministic recheck.
- PR #239 open/preview-ready: direct consolidated Zoho package + persistent scheduling, not production-verified.
- PR #235 open/preview-ready: contextual editorial data cards; production merge/verification still pending.
- MEDIA-007 remains at the last certified strict baseline of **186 publication-ready local Editorial Images / 196 approved local / zero duplicate Sanity asset groups** until a newer strict audit produces evidence.

## Completion boundary

Do not report the following as complete until measured production evidence exists:

- AUTO-004 hard 5/5;
- AUTO-003 persistent morning orchestration;
- exactly one consolidated morning Zoho editorial email;
- rejection -> genuinely different replacement;
- >=200 strict publication-ready local Editorial Images;
- contextual-card production rendering;
- representative article/homepage/inline-image desktop/mobile presentation;
- Meta social publishing;
- phone-first upload;
- 14:00 major-announcement conditional path;
- authenticated Sanity edit/save/reload.
