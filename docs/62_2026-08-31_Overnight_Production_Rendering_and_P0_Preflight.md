# Overnight production rendering and P0 preflight

Date: 31 August 2026

## Scope

This evidence record captures measurable launch-state verification after PRs #316, #317 and #318. It does not replace the requirement for consecutive successful normal scheduled fresh-five days or authenticated owner-phone Editorial Review verification.

## Fresh-package pipeline now on `main`

The current production workflow has one deterministic scheduled current-source execution. Its normal path is:

1. current source discovery from the registry;
2. corroborated acquisition evidence;
3. recent production Sanity editorial-position export;
4. protected exactly-five fresh import using the subject + event/development + editorial-angle identity and existing originality, Draft Ready and Publication Review gates;
5. consolidated Zoho delivery only after the fresh import succeeds.

PR #316 removed the independent scheduled Zoho send that allowed stale drafts to be re-sent when fresh acquisition had failed. PR #317 removed the duplicate scheduler/guard pattern that could produce a successful Actions run while doing no newsroom work.

These changes are merged. Consecutive normal scheduled-day proof remains pending and must not be inferred from this preflight.

## MEDIA-011 coupling

PR #318 is merged at `fb792cf1afb307d9111e3971f55a45018523ad58` and the corresponding Vercel production deployment is READY.

`.github/workflows/plan-daily-article-images.yml` now listens for successful completion of both:

- `Import editorial acquisition batch`; and
- `Current editorial source discovery`.

Therefore the normal fresh-five newsroom path now triggers the existing local-library-first article-specific image deficit workflow. The media workflow keeps `IMAGE_CANDIDATE_TARGET=3`, performs rights/relevance triage before import, imports approved assets locally into production Sanity, reconciles readiness, runs the strict local readiness audit and re-plans candidate depth after acquisition.

This closes the wiring defect, but not MEDIA-011 production verification. The next successful current-source run must trigger this workflow and its artifacts/Sanity readback must be inspected before candidate-depth or certified-count claims are increased.

## Production deployment state

Vercel production deployment for `main` commit `fb792cf1afb307d9111e3971f55a45018523ad58` is READY. A production runtime-error check over the preceding 24 hours returned no runtime errors.

## Representative public rendering — technically production verified

The canonical production homepage `https://therugbypanda.ie/` and representative published article `https://therugbypanda.ie/articles/welcome-to-the-rugby-panda` both returned HTTP 200 from production.

Homepage production readback confirms:

- responsive mobile/desktop primary navigation markup;
- hero image sourced from production Sanity;
- canonical Rugby Panda branding and social links;
- successful server rendering with no runtime error evidence.

Representative article production readback confirms:

- responsive article typography/layout classes;
- production Sanity hero image with alt text, caption and attribution;
- article headings/body/key-points presentation;
- canonical URL, OpenGraph/Twitter image metadata and NewsArticle structured data;
- HTTP 200 from the canonical production domain.

This closes the **technical production-rendering** portion of WEB-010/WEB-011 for an existing representative published article/homepage. It does not replace final human visual judgement of a launch-quality multi-story homepage or authenticated mobile CMS interaction.

## Current launch boundary

### Verified in this run

- PR #318 production deployment is READY.
- MEDIA-011 is correctly coupled to the normal current-source newsroom workflow on `main`.
- production homepage HTTP/render path is healthy.
- representative canonical production article HTTP/render path is healthy.
- no Vercel production runtime errors were reported in the inspected 24-hour window.

### Still pending

- normal scheduled AUTO-004 fresh 5/5 proof for 31 August and a second consecutive normal day;
- production-Sanity readback of the exact fresh five after the run;
- MEDIA-011 triggered-run evidence and any genuinely new certified useful local assets/assignments;
- current-five hero/inline assignment audit;
- authenticated owner-phone Editorial Review interaction;
- multi-story launch homepage human visual approval;
- SOCIAL-001 downstream webhook/provider authorization and delivery proof.

## Counting discipline

The certified image baseline remains **241 strict publication-ready local Sanity assets**. No increase is recorded here because this run did not produce new production-Sanity import/readiness evidence.
