# 3 September 2026 — Cross-source evidence coherence P0

## Measured production failure

Production run `33712482593` discovered 183 leads from 25 successful sources and reached the second bounded visual refill, but failed closed at four eligible drafts. The remaining reserve contained two candidates that should not have reached model generation:

- `current-2026-09-03-551659a66fa0` was a generic RugbyPass fixtures index corroborated by a Planet Rugby tables/fixtures/results index. Publication Review correctly rejected the generated story as lacking a concrete news development.
- `current-2026-09-03-9616c23e47c9` incorrectly paired the Irish Independent Caelan Doris injury/availability story with an unrelated RugbyPass Triston Reilly / First Nations & Pasifika XV captaincy story. Publication Review correctly rejected the resulting article because the second source did not support the Doris development.

Sanity production inspection also showed retained draft `current-2026-09-03-99303bf45e0f` is built from an NPC fixture listing and a Farah Palmer Cup live-match page rather than a defensible editorial-news development. It remains a separate retained-integrity follow-up and must not be used as justification to weaken current-source evidence gates.

Zoho was not sent by run `33712482593`; final image verification and delivery were skipped after the exact-five recovery failed closed.

## Root cause

The concrete-evidence gate rejected catalog and generic team-index pages but still treated generic fixture/index pages as editorial news. It also required named people somewhere in the combined evidence but did not require the same person identity to be corroborated across at least two independent editorial sources. This allowed unrelated source bundles to survive the pre-generation gate when both pages contained superficially rugby-shaped language.

## Fix

`filter-current-acquisition-evidence.mjs` now:

1. excludes generic fixture/index pages from editorial-news evidence;
2. filters generic competition/index words out of person-name extraction; and
3. requires at least one genuine named person identity to be present across at least two independent editorial sources before a candidate may reach model generation.

The gate still requires two independent publishers, two substantive facts, concrete rugby markers and match context where applicable. No Publication Review, freshness, diversity, image, human-publication or exact-one-delivery rule is weakened.

## Issue-log record

- ID: `AUTO-004-P21`
- Status: Implemented; merge/deployment/production verification pending at creation
- Priority: Critical
- Area: Editorial Acquisition / Evidence Coherence
- Root cause: generic fixture pages and uncorroborated person identities could satisfy the pre-generation evidence gate
- Related PR: current cross-source evidence coherence PR
- Deployment status: pending merge
- Verification status: production recovery must reject the two measured bad candidates before model spend and still produce enough coherent fresh candidates to recover exactly five
- Resolution date: pending production verification

## Required production proof

A bounded recovery after merge must show all of the following before this issue can close:

- the generic RugbyPass/Planet Rugby fixture-index candidate is rejected before model spend;
- the Doris/Reilly mixed-source candidate is rejected before model spend unless acquisition independently rebuilds it with genuinely Doris-corroborating sources;
- no evidence gate is weakened to force five;
- exactly five fresh review-ready drafts survive strict image verification;
- Zoho accepts exactly one consolidated package; and
- publication remains a human action in Sanity.
