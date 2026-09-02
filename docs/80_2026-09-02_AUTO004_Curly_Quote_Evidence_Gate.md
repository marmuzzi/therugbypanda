# AUTO-004 — Curly-quote evidence gate repair

## Status

Implemented and committed on 2 September 2026; production verification pending at the time of this note.

## Issue

The 2 September recovery run `33636781927` discovered 112 current leads and built 11 corroborated candidates, but the concrete-evidence gate accepted only five. Four otherwise multi-source candidates were rejected solely as `no-concrete-rugby-marker` even though their evidence contained substantive quoted statements written with typographic single quotation marks (`‘…’`).

The evidence gate's `QUOTED` detector recognised straight single/double quotes and typographic double quotes, but not typographic single quotes. This created a deterministic false negative before model spend and contributed to the one-slot recovery reaching `0/1` usable fresh candidates after retained-ID and recent-history checks.

## Repair

The quote detector now recognises typographic single quotation marks in addition to the existing quote forms. This does not weaken source-count, publisher-independence, named-person, substantive-fact, match-context, freshness, diversity, image relevance, Publication Review, Draft Ready or originality gates.

A replay against the rejected-title evidence from run `33636781927` confirms that four candidates previously rejected only for `no-concrete-rugby-marker` are now recognised as carrying a concrete quoted marker. The match-context rejection remains unchanged for candidates that genuinely lack the required date/score/venue/test context.

## Verification boundary

The fix is not complete until a production current-source run proves that the expanded evidence set survives freshness/diversity selection, restores exactly five eligible image-ready drafts, and Zoho accepts exactly one consolidated package. Human Sanity publication remains mandatory.
