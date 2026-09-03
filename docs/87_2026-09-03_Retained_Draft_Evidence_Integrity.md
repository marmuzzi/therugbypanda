# 3 September 2026 — Retained draft evidence integrity P0

## Measured production findings

After production recovery `33706956178`, two legacy same-day retained drafts were still marked morning-package eligible despite not meeting the current launch evidence/coherence contract:

1. `current-2026-09-03-ca83d5b17644` — `An Irish lens on Jonah Lomu’s story — and why it lands now` had exactly **one** source note, from Business Post Sport. Current acquisition requires multi-source corroboration and at least two independent publishers before model spend.
2. `current-2026-09-03-57772ccaa5cf` — `Why Irish Rugby’s Resource Library matters as Doris out, Hansen back` fused four unrelated source developments into one retained article: the IRFU Resource Library, Caelan Doris’s injury timeline, a Jonah Lomu film, and Mack Hansen’s return. Its contextual card independently exposed the same mixed-story provenance.

Both drafts were failed closed from the 3 September morning package in Sanity by changing only their draft `morningPackageEligible` flags to false. They were not published and Zoho had not been sent.

## Root cause

The same-day retained-draft integrity check validated rugby contamination and duplicate editorial positions, but it did not enforce the same minimum multi-publisher evidence floor already required for newly generated candidates. This allowed an older one-source draft to be grandfathered after the acquisition pipeline became stricter.

The incoherent Resource Library/Doris/Hansen/Lomu draft was produced by an older clustering state. The current coherent-corroboration pipeline already prevents that source fusion from being generated again; this production cleanup removes the legacy retained artifact rather than weakening the newer acquisition logic.

## Repair

`scripts/import-editorial-acquisition-batch.mjs` now requires every retained same-day production draft to have:

- at least two source notes;
- every retained source note with a non-empty publisher and HTTP(S) URL;
- at least two distinct publishers;
- the existing rugby-contamination and duplicate-position checks.

A retained draft that fails this evidence-integrity floor is automatically marked ineligible before it can count toward the exact-five package.

## Required production verification

The repair is incomplete until a bounded recovery proves:

1. the one-source Lomu draft is not retained;
2. the manually excluded incoherent Resource Library/Doris/Hansen/Lomu draft is not counted;
3. missing slots are regenerated only from current fresh evidence-sufficient candidates;
4. the final five still pass freshness, package diversity, Publication Review and strict image relevance;
5. exactly one consolidated Zoho package is accepted, or the exact-package lock proves it was already accepted;
6. all content remains draft-only for human publication and Meta/social is untouched.

## Delivery state

As of this diagnosis, the 3 September Zoho editorial package has **not** been sent.