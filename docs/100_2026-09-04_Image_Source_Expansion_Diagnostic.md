# Image Source Expansion Diagnostic — 4 September 2026

## Owner request

Expand editorial image sourcing beyond Wikimedia Commons with Unsplash, Pexels, Pixabay, Freepik/Magnific, Pikwizard, Pixnio, Flickr CC Search, Canva Free and Stockvault while preserving strict relevance and rights controls.

## No-AI rule

Image discovery, rights triage and deterministic relevance matching must not require OpenAI. OpenAI budget is reserved for article drafting/review only.

## Registry

`data/editorial-images/image-source-registry.json` is the canonical source registry. Sources are classified as API, manual-web or conditional so the production worker does not scrape services whose terms require an API or manual/licence review.

## Immediate external diagnostic

A no-OpenAI discovery probe on 4 September showed materially broader availability than the current Wikimedia-only deficit worker:

- Flickr surfaced multiple 2024 Italy v New Zealand images whose captions explicitly state that Codie Taylor leads the Haka. This is the correct named subject/team context class that the current bad depression image lacks.
- Pexels exposes a very large generic rugby pool: its rugby-player search reports roughly 25K photos; an Ireland-rugby-roster search reports roughly 10K photos. These counts are search-site inventory indicators, not automatically assignment-safe images.
- Unsplash exposes roughly 2.6K rugby photos and 319 rugby-field photos, including recent rugby-stadium imagery. This is useful for generic rugby/stadium fallback, not proof of a named player.
- Pixabay exposes a Leinster-rugby search page reporting hundreds of results. These still require per-asset relevance/licence checks.
- Pikwizard returned commercial-use generic male-rugby-player imagery suitable only for generic fallback.

## Relevance rule

Source breadth must never weaken assignment semantics. Priority remains:

1. correct named person;
2. correct team;
3. correct match/event/venue;
4. genuinely relevant generic rugby fallback;
5. approved relevant logo;
6. no image.

Explicit person/team/gender/context conflicts fail closed. Generic stock imagery must never masquerade as a photograph of a named player.

## Rights rule

Every imported candidate must retain source, creator/photographer, source page, licence, licence URL where available, attribution requirement and any API-specific obligations. Unknown or mixed rights remain owner-review/reject, never auto-approve.

## Production boundary

This diagnostic proves additional supply exists. It does **not** yet claim that all new sources are production-active: Pexels, Pixabay, Unsplash and Flickr require proper API credentials/adapters; manual/conditional sources require licence-safe ingestion rather than scraping. The current production deficit worker remains Wikimedia-based until adapters are merged and production-verified.
