# 3 September 2026 — targeted corroboration recovery

## Status

Implemented on branch `fix/sep3-targeted-corroboration`; production verification required after merge.

## Measured trigger

Production Actions run `33698936673` executed the coherent-clustering contract from PR #377 and failed closed in `Build corroborated acquisition evidence` before any OpenAI generation, image work or Zoho delivery.

The run's discovery artifact showed:

- 117 initial current leads;
- 16 corroboration searches;
- only 1 extra registry-approved corroboration lead.

Inspection of the machine-readable corroboration queries showed that the second pass had selected the first 16 raw headlines rather than the first 16 rugby stories. Several searches therefore targeted cycling, GAA, football and other non-rugby items. The rugby searches also used nearly the entire source headline, making cross-publisher matches unnecessarily narrow.

## Root cause

The first corroboration implementation improved the architecture but seeded the second pass before applying a rugby-specific relevance filter and used full-headline queries. The strict v8 cluster gate then correctly refused to recreate the old false clusters, leaving fewer than five independently corroborated coherent stories.

## Fix

`discover-current-editorial-sources.mjs` now:

1. de-duplicates initial source leads before selecting corroboration seeds;
2. selects up to 24 corroboration seeds only when the lead is rugby-relevant and not explicitly non-rugby or a generic landing/index page;
3. de-duplicates corroboration queries so duplicate BBC registry entries cannot consume seed capacity;
4. reduces each query to a high-signal rugby entity, preferring a named person such as `Caelan Doris`, `Maro Itoje`, `Rassie Erasmus` or `Jonah Lomu` rather than the entire headline;
5. removes source bylines such as `Cian Tracey:` before extracting the story entity;
6. keeps the approved-source-registry restriction, same-domain exclusion, freshness window and bounded parallel search.

No editorial quality, freshness, diversity, image, exact-five, exact-one Zoho or human publication boundary is relaxed.

## Verification required

The next bounded recovery must show a materially larger story-specific corroboration pool and at least five coherent cross-domain candidates before model generation. If it does not, the next P0 is discovery coverage rather than a reason to weaken the corroboration contract.
