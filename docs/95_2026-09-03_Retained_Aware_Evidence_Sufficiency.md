# 3 September 2026 — Retained-aware evidence sufficiency

## Measured production failure

Run `33718071968` proved the strengthened evidence boundary and the new Australian primary sources were working. It found two clean fresh candidates — James Slipper and James O'Connor — while production Sanity contained three still-eligible same-day drafts with multi-publisher source notes. The package therefore had enough potential positions to rebuild 5/5.

The run nevertheless failed before model spend because `filter-current-acquisition-evidence.mjs` hard-required five newly accepted acquisition candidates, regardless of valid retained same-day slots. This contradicted the established bounded-recovery design, which intentionally preserves valid drafts and regenerates only missing positions.

Zoho was not sent. All generation, image verification and delivery steps were skipped after the false insufficiency failure.

## Root cause

The pre-generation evidence gate used package size (`5`) as the minimum size of the *fresh candidate reserve*. During same-day recovery those are different quantities: the package may already contain valid retained drafts, so only the missing positions need fresh evidence.

## Fix

The evidence gate now queries the current Dublin-date Sanity draft package before deciding volume sufficiency. A retained draft counts only when it is still `morningPackageEligible`, remains inside the human draft/review workflow, has at least two valid source notes from two distinct publishers, and its source usage does not look like a fixture listing, placeholder live page, catalog/product page or generic tables/fixtures/results index.

The required fresh-candidate count is `5 - strict retained count`, with a minimum of one fresh candidate because the current importer requires a non-empty acquisition batch. The evidence-quality tests on every fresh candidate are unchanged: independent editorial-news sources, cross-source person coherence, substantive facts, rugby-specific concrete evidence and match context where relevant all remain fail-closed.

If Sanity credentials are unavailable, the gate defaults safely to requiring five fresh candidates.

## Issue-log record

- ID: `AUTO-004-P22`
- Status: Implemented; merge/deployment/production verification pending at creation
- Priority: Critical
- Area: Editorial Automation / Bounded Recovery
- Root cause: evidence sufficiency confused full package size with missing-slot refill size
- Related PR: retained-aware evidence sufficiency PR
- Deployment status: pending merge
- Verification status: pending bounded production recovery
- Resolution date: pending production verification

## Required production proof

A bounded recovery must show that valid retained slots reduce only the required *quantity* of fresh candidates, never the evidence bar on those candidates; exactly five drafts must then survive freshness, diversity, Publication Review and strict image verification before exactly one Zoho package can be sent. Human publication must remain a Sanity action.
