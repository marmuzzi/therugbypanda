# P0 — AUTO-004 source-record contract repair

Date: 31 August 2026

## Production failure

Scheduled run `33388368389` successfully completed current-source discovery, corroboration and the pre-generation freshness gate, selecting exactly five fresh positions. All five calls to `/api/editorial/draft` then failed before generation with `Cannot read properties of undefined (reading 'toLowerCase')`.

## Root cause

The current-source acquisition bridge emitted `sourceRecords[].name`, while the canonical `SourceRecord` contract and `StoryScorer` require `sourceRecords[].publisher`. `StoryScorer` lower-cases `publisher`, so the bridge/importer contract mismatch caused the same deterministic 500 for all five positions.

The bridge also emitted `suggestedCategory: "Rugby"`, which is outside the canonical category enum.

## Repair

- emit canonical `publisher`, `excerpt`, `bodyText` and `isPrimarySource` fields from current-source discovery evidence;
- infer only valid canonical editorial categories and otherwise omit the suggestion so the normal classifier runs;
- normalize legacy `name` to `publisher` at the importer boundary;
- fail closed before API/model calls when publisher/title/url are absent;
- drop invalid suggested categories at the importer boundary.

No freshness, originality, Draft Ready, Publication Review, image or human publication gate is weakened.

## Verification boundary

The repair is not production-complete until the production chain is exercised after deployment and the five selected positions move past Editorial Brain into successful eligible Sanity draft creation. A recovery run can prove the defect is fixed but does not count as a normal scheduled-day freshness proof.
