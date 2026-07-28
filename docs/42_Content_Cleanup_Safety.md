# Content cleanup safety boundary

The production cleanup is ID-based and intentionally narrow.

Only the seven original seed article IDs listed in `scripts/seed-sanity.mjs` are deleted. The script does not issue a broad query deletion and does not remove later editorial drafts, reviewed articles, assets, sources, fact-ledger records or workflow history.

The introduction article uses a stable document ID so rerunning the command updates the same article instead of creating duplicates.
