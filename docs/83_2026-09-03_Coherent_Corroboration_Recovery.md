# 3 September 2026 — coherent corroboration recovery

## Status

Implemented on branch `fix/sep3-coherent-corroboration`; production verification required after merge.

## Measured trigger

Bounded production run `33698101024` proved that evidence-strength ordering alone was insufficient. Candidate `current-2026-09-03-57772ccaa5cf` passed Publication Review and created a Sanity draft, but its evidence cluster combined unrelated headlines about the IRFU Resource Library, Caelan Doris, a Jonah Lomu film and Mack Hansen. Candidate `current-2026-09-03-30aff06ff619` was rejected by Publication Review because a similarly broad cluster could not support the concrete disciplinary detail the generated article attempted to discuss.

A technically passing article built from unrelated source stories is not acceptable. This is therefore a P0 acquisition-integrity failure, not a Publication Review threshold problem.

## Root cause

The v7 acquisition bridge used minimum-set lexical similarity over short Google News headline/description text. Broad rugby vocabulary and short generic pages could therefore be treated as corroboration for a different story. Generic pages such as `Discipline - Irish Rugby`, `Resource Library - Irish Rugby`, competition landing pages and generic radio index pages were able to satisfy the second-source requirement even though they did not independently report the same development.

At the same time, discovery only performed per-domain `rugby site:<domain>` searches. That surfaces current leads but does not deliberately search the registry for independent coverage of each promising story.

## Fix

The recovery makes discovery and clustering complementary rather than weakening the two-source rule.

### Story-specific corroboration discovery

`discover-current-editorial-sources.mjs` now performs a bounded second pass for up to 16 current seeds. It searches Google News for each story and accepts additional results only when Google identifies the publisher as a domain already present in the approved source registry. Same-domain duplicates are ignored. Corroboration discovery is bounded, parallelised and recorded in the machine-readable discovery evidence.

### Entity-coherent clustering

`build-current-editorial-acquisition-batch.mjs` now:

1. excludes known generic/index/landing headlines from corroboration;
2. requires cross-domain corroboration to share a genuine person/surname anchor, or substantially stronger multi-token lexical overlap;
3. requires corroborating items to fall inside the 36-hour story window;
4. fixes primary-source role detection for registry values such as `primary-evidence`;
5. records the clustering contract as `entity-coherent+independent-cross-domain-corroboration-v8`;
6. fails closed before model spend if fewer than five genuinely coherent cross-source candidates remain.

The stricter v8 bridge was syntax-checked locally. Against the previous run's discovery evidence, it intentionally reduces the old broad candidate set below five rather than recreating the known false clusters; the new story-specific discovery pass is what is intended to replenish that pool with real independent corroboration in production.

## Gates preserved

No freshness, package diversity, originality, Publication Review, image rights/relevance, exact-five, exact-one Zoho or human publication boundary is relaxed.

## Verification required

The next bounded production run must demonstrate at least five coherent corroborated candidates, with sourceRecords referring to the same development, before generation. The final acceptance gate remains exactly five fresh review-ready drafts, strict image verification and exactly one consolidated Zoho package.
