# 3 September 2026 — Recovery candidate reserve P0

## Measured production failure

Production run `33708215106` started with exactly two retained review-eligible current drafts and therefore needed three new drafts.

Discovery itself was healthy: 24/24 configured sources succeeded, producing 116 current leads. The acquisition bridge produced six coherent corroborated candidates and the concrete-evidence gate accepted all six. Two candidate IDs were already represented by the two retained drafts. Of the four remaining positions, one James O'Connor position was rejected by the existing 14-day freshness gate because the identical position had already been generated on 2 September.

That left exactly three fresh candidates for exactly three missing slots — no reserve.

All three were then correctly rejected by Publication Review #2 for substantive evidence/context gaps:

- Caelan Doris: no named Leinster back-row contenders or concrete squad context for who would take his minutes;
- Joseph-Aukuso Suaalii: central Waratahs/pathway context was not explicitly supported by the supplied evidence;
- James Slipper: the draft did not identify the Super Rugby club he had signed for, an essential supporter-facing fact.

The package therefore remained 2/5. Image planning and Zoho delivery were skipped. The exact-one check at run start showed `acceptedEvidenceCount: 0`, so the 3 September package has not been sent.

## Root cause

The pipeline had quality/freshness/diversity gates but no explicit **candidate-capacity reserve** before model spend. `enforce-current-package-diversity.mjs` only required the number of surviving candidates to equal the number of missing slots. That is sufficient only when every candidate passes Publication Review, which is not a safe assumption for an autonomous newsroom.

Discovery also used a bounded corroboration search that stopped after 24 unique rugby seed queries, even though run `33708215106` had 44 rugby seeds. This left potentially useful no-model corroboration capacity unused while the downstream recovery had no reserve.

## Repair

The recovery keeps all existing editorial gates unchanged and expands capacity before model spend:

1. `discover-current-editorial-sources.mjs` raises the bounded defaults from 8 to 12 items per registry source, 24 to 48 unique corroboration seeds, and 5 to 8 registry-backed corroborators per seed. The 36-hour freshness window is unchanged.
2. `enforce-current-package-diversity.mjs` now requires a default reserve of two additional diversity-safe candidates whenever the package has missing slots. A three-slot recovery therefore needs at least five surviving candidate positions before generation starts.
3. The reserve check happens after retained-state and package-diversity filtering, so reserve stories are genuinely usable alternatives rather than raw leads.
4. Publication Review, originality, Draft Ready, freshness, max-two same-team/matchup limits, strict image relevance, human publication and exact-one Zoho delivery remain unchanged.

This repair deliberately spends more **source discovery/corroboration work**, not more model calls, to avoid entering expensive generation with no fallback path.

## Required production verification

The repair is incomplete until a bounded production recovery proves:

1. expanded discovery yields enough current coherent corroborated positions to satisfy the missing-slot + two-candidate reserve after freshness/diversity filtering;
2. only missing slots are generated and valid retained drafts are preserved;
3. Publication Review may reject weak candidates without preventing the importer from trying the reserve candidates;
4. exactly five fresh review-ready drafts survive deterministic and package-diversity gates;
5. final strict image planning/assignment verifies all five;
6. exactly one consolidated Zoho package is accepted for those exact five IDs;
7. no article is automatically published and Meta/social remains untouched.

## Delivery state at diagnosis

3 September Zoho delivery: **not sent**. Run `33708215106` skipped all image and delivery steps after package creation failed closed at 2/5.