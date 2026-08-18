# Multisource Editorial and Image Relevance Contract — 18 August 2026

## Purpose

The Rugby Panda must add editorial value beyond any single source. Production articles should be based on an evidence pack assembled from multiple relevant sources wherever those sources are available, and featured images must be materially relevant to the article rather than merely rugby-related.

## Multisource acquisition contract

Persistent acquisition under AUTO-003/AUTO-004 should build a story-level source set, not a one-page rewrite input.

For each candidate, acquisition should seek:

1. primary/official sources for hard facts: unions, clubs, competitions, official fixture/squad/injury/signing announcements;
2. reputable independent rugby reporting for context, background and competing interpretations;
3. additional corroboration where a claim is material, disputed or speculative;
4. historical/context sources where they add genuine reader value.

The source set is stored in `RawStoryInput.sourceRecords`. The generator must synthesize the evidence across the complete source set, reconcile overlaps/conflicts, prefer primary sources for hard facts and use secondary reporting for context. The finished article must not read as a sequence of source summaries and must not copy distinctive source phrasing.

A single source may still be acceptable for an exclusive official fact when no meaningful independent material exists, but the acquisition engine should attempt enrichment before generation rather than treating one source as the default.

## Editorial output contract

The generated article should combine supported facts into an original angle and add useful context such as named players/coaches/signings, selection questions, tactical implications, recent form/history and what supporters should watch for when those points are supported by the evidence pack.

Reader-facing copy must not explain internal sourcing policy, fact ledgers, confidence scores, AI/automation, human approval mechanics or internal labels such as `speculative but relevant`.

## Featured-image relevance contract

An approved image is not automatically suitable merely because it depicts rugby.

Automatic assignment must fail closed:

- an image tied to a different province/team is rejected;
- generic Rugby Panda/brand imagery is strongly penalised for normal rugby stories;
- an image must reach a minimum relevance score before it may be assigned automatically;
- if no approved relevant image exists, the draft should have no featured image rather than receive a misleading one;
- publication remains subject to rights/usage approval and the human Sanity boundary.

An Ulster article must therefore never receive an Ageing Pandas/amateur veterans image simply because both are rugby-related.

## Image acquisition expansion

The Editorial Image library needs substantially broader rights-reviewable coverage of:

- Leinster, Munster, Ulster and Connacht;
- Ireland Men and Ireland Women;
- URC and EPCR competition contexts;
- major venues;
- current players/coaches where usable rights can be documented;
- generic professional rugby action/training/stadium material that is still entity/context appropriate.

Apify should be used to collect image **candidates and source metadata only** from approved/relevant web sources. Collection never means rights approval. Every candidate must retain source URL, source owner/publisher, page context and enough rights information for human review before a Sanity asset can become `usageApproved`.

## Current session limitation

The Apify connector had been available earlier in AUTO-004 work, but it is not exposed in the current ChatGPT connector set as of this session check. Do not claim a new Apify image crawl has run until the connector is actually available and its run/dataset IDs are recorded.

## Verification required

1. Regenerate a representative multisource story and confirm the copy uses multiple sources as one evidence pack rather than rewriting one source.
2. Verify a province story never receives an image whose metadata identifies another province/team.
3. Verify a story with no sufficiently relevant approved image remains image-less rather than using an unrelated fallback.
4. When Apify becomes available, run a broad candidate crawl, record run/dataset IDs, import candidates for rights review, and expand the approved image pool only after human review.
