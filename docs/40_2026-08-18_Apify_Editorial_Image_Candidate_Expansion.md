# Apify Editorial Image Candidate Expansion — 18 August 2026

## Purpose

This document records the 18 August Editorial Image expansion work that follows `docs/39_2026-08-18_AUTO-004_Multisource_Image_Handoff.md`.

Sanity remains the mandatory human approval boundary. No third-party image discovered here is approved or publishable merely because it was collected or carries open-licence metadata.

## Production baseline checked first

- PR #176 is merged on `main` as `1470df4d9cf5ca0111a0fe1402742ac400b42440`.
- The corresponding Vercel production deployment is now READY.
- Representative regenerated-story verification of #176 remains pending.
- Five current AUTO-004 Sanity drafts still exist. Their stored featured images pre-date #176 and must not be treated as evidence of the new fail-closed selector.

## Apify collection executed

Actor:

`shahidirfan/OpenVerse-Image-Scraper`

The collection ran in multiple targeted batches across:

- Leinster Rugby
- Munster Rugby
- Ulster Rugby
- Connacht Rugby
- Ireland Men
- Ireland Women
- named players and coaches
- URC
- Champions Cup
- Challenge Cup
- international rugby
- professional action
- training
- stadiums / venues

The versioned provenance manifest is:

`data/editorial-images/apify-collection-2026-08-18.json`

It records 32 useful run/dataset pairs and 912 raw results before filtering and deduplication.

## Quality findings

The raw search result quality varies substantially by query.

Strong material includes:

- 2025 Ireland Women Rugby World Cup match photographs with player names, match/date context, creator and CC BY-SA metadata;
- province match/player material for Munster, Ulster and Connacht;
- Leinster material including Leo Cullen and historical Leinster action, although Leinster searches also return considerable livery/kit/flag noise;
- Ireland Rugby World Cup/player archive material;
- Aviva Stadium and other international venue imagery;
- European competition and broader international rugby images.

Raw search hits such as airline livery, kit graphics, flags, school/youth results and unrelated records must not count toward the 200-candidate objective.

## Maintained import path

Branch:

`media/2026-08-18-apify-image-candidates`

Implemented:

- `scripts/import-apify-editorial-image-candidates.mjs`
- `.github/workflows/import-apify-editorial-image-candidates.yml`
- package script `media:import-apify-candidates`
- additive Editorial Image schema fields for team, people, competition/event, event date, source-page metadata and acquisition provenance
- Image Review context display for team/people/event/source/licence

Importer safety rules:

- preferred open-licence identifiers only: `cc0`, `pdm`, `by`, `by-sa`;
- rejects mature content, obvious non-photo/noise records and SVG/GIF results;
- minimum available dimensions when dimensions are supplied;
- rugby/scope relevance checks;
- source ID / direct URL / landing-page deduplication;
- deduplication against existing Sanity `editorialImage` records;
- hard failure if fewer than 200 genuinely new candidates remain;
- every imported document is forced to `lifecycleStatus = candidate` and `usageApproved = false`;
- no third-party image is downloaded into a public Sanity image asset by this import.

## Metadata captured

Where exposed by Openverse/source metadata the importer preserves:

- source / landing page URL
- direct image URL
- provider/source name
- source page title
- creator / photographer
- creator URL
- licence and licence URL
- attribution
- team/squad
- named players/coaches identifiable from title metadata
- competition/event
- reliable event date where derivable
- acquisition scope/query
- source indexing timestamp
- source record ID
- Apify run ID
- Apify dataset ID
- suggested editorial use and photo type

## Current completion state

Implemented and committed on branch, but not yet complete:

- Apify raw collection: complete.
- Versioned run provenance: committed.
- filtering/deduplication/import code: committed.
- Editorial Image metadata/review enrichment: committed.
- docs/Issue Log update: committed.

Still required before MEDIA-007 can move to Pending Verification/Closed:

1. open and merge the image-expansion PR;
2. confirm Vercel and Sanity Studio deployments succeed;
3. confirm the candidate-import workflow succeeds;
4. query Sanity and verify at least 200 genuinely new `editorialImage` records exist from this acquisition and every one is unapproved/candidate-only;
5. verify the expanded Image Review queue in authenticated hosted Sanity Studio;
6. perform human rights/editorial review before approving any image;
7. separately verify #176's fail-closed selector with regenerated representative province/national stories.

## AUTO-004 continuation after image import verification

Do not restart AUTO-001.

After the 200+ candidate import is verified:

1. build deliberate multi-source evidence packs for the five representative stories;
2. regenerate the five AUTO-004 stories;
3. inspect for named people, rugby substance, implications and supporter-facing angles where supported;
4. reject reader-facing sourcing/process/AI/fact-ledger explanations and close paraphrase;
5. verify irrelevant images are not assigned and no image is assigned where no approved relevant asset exists;
6. verify morning batch mode emits no five individual draft emails;
7. verify direct body editing in authenticated Editorial Review;
8. run AUTO-001 and verify exactly one consolidated five-article email.
