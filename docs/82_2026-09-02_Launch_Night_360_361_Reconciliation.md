# 2 September 2026 — Launch-night reconciliation through PR #361

## Scope

This note reconciles the two launch-critical changes merged after the visual/brand evidence note: PR #360 editorial style cadence hardening and PR #361 morning delivery-window correction. It also records current production deployment evidence. Social remains explicitly outside the website go-live gate while Meta authorization is externally blocked.

## PR #360 — editorial style cadence

PR #360 merged as `929a02ffd01c5a5c0e54faab187563b325950c33`.

The existing one-each package allocation remains `news-desk`, `analysis-led`, `feature-led`, `notebook`, `explainer`, but generation instructions now make their visible structure materially different:

- news defaults to no subheading and permits at most one when genuinely necessary;
- analysis normally uses exactly two story-specific analytical movements;
- feature prefers continuous narrative and only introduces headings for genuine narrative turns;
- notebook deliberately becomes the most sectional profile, normally with three short varied headings;
- explainer uses two or three useful sections and limits direct-question headings to avoid an FAQ template.

All profiles still forbid Markdown/bold markers. Originality, Draft Ready, Publication Review, exact-five identity and human Sanity publication are unchanged. Existing accepted 1 September articles were not regenerated or resent.

Vercel production deployment `dpl_FMxBL2B6oZ57Pn9BFWUcHDAsSstv` for merge commit `929a02f...` is `READY`. Behavioural editorial verification remains the next genuinely new normal five-story package; no paid generation was manufactured solely to exercise the change.

## PR #361 — before-08:00 delivery window

PR #361 merged as `231c25dcd891bfc2c45633ac15a54b813c446119`.

Root cause: GitHub Actions cron is UTC. The previous repository schedule of 05:30 and 06:00 UTC meant 06:30 and 07:00 Dublin during Irish summer time, which did not provide enough runway for current-source acquisition, five-story generation, Publication Review, image work and exact-five Zoho delivery.

The normal current-source workflow now uses:

- primary start `30 4 * * *` = 05:30 Europe/Dublin during Irish summer time;
- serialized safety invocation `30 5 * * *` = 06:30 Europe/Dublin;
- workflow-level concurrency with `cancel-in-progress: false`, so the safety invocation waits instead of racing/cancelling an unfinished primary run;
- existing exact-package evidence/idempotency so the safety invocation is a no-op after successful delivery;
- explicit UTC timestamps for workflow start, package-ready point and daily-package delivery response.

The winter-time primary start will be one hour earlier in local Dublin time. This intentionally favours delivery margin; late delivery is considered the higher operational risk.

Vercel production deployment `dpl_ZmQaKEjZXnZfbcwY77a2n1Pvn7JA` for merge commit `231c25d...` is `READY`. A production runtime check after deployment found no `error` or `fatal` logs in the verification window. The GitHub schedule itself is repository-native rather than Vercel-executed, so final behavioural verification is the next normal scheduled workflow.

## Current launch boundary

Production-verified before the normal 2 September run:

- exact-current-package Editorial Review isolation on authenticated desktop;
- repaired 1 September exact-five imagery with no France-context hero on the South Africa/New Zealand story;
- hero on all five plus meaningful inline depth of 2/2/2/2/1 rather than filler;
- approved local South Africa/Springboks and New Zealand/All Blacks branding, plus local Leinster/Munster/EPCR marks;
- strict future primary-team/person image conflict logic deployed;
- differentiated style-profile generation instructions deployed;
- repository-native morning start corrected to provide a real pre-08:00 delivery window;
- exact-five Zoho idempotency remains intact.

Still pending for go-live acceptance:

1. normal 2 September scheduled run produces five genuinely fresh positions;
2. same-team diversity and new style cadence are behaviourally exercised on that package;
3. exact-five image-context safeguards pass on the new package;
4. package-ready and Zoho acceptance occur before 08:00 Europe/Dublin;
5. authenticated owner-phone Editorial Review interaction and representative public article/homepage rendering remain human-boundary checks.

## Completion discipline

PR #360: implemented, merged, production deployment READY; behavioural editorial verification pending the next normal five-story package.

PR #361: implemented, merged, production deployment READY; repository schedule verified in code, runtime errors/fatals zero in the post-deploy window; before-08:00 behavioural proof pending the next normal scheduled run.

No GPT generation, Zoho resend or automatic publication was performed solely for this reconciliation.