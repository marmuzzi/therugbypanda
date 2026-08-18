# Editorial Image Archive

## Purpose

The Rugby Panda image archive is a first-class editorial asset. The goal is to build a searchable, reusable, rights-safe rugby photography library that supports articles, homepage cards, category pages, social posts and future photo stories.

Original Rugby Panda photography should become the dominant source of imagery over time.

## Public identity and attribution

For original Rugby Panda photos, public attribution must be:

- `Photo: The Rugby Panda`
- `© The Rugby Panda`

Internal CMS records may include private operational notes, but public templates must use The Rugby Panda brand identity.

## Source classification

Every image must have one source classification:

- `The Rugby Panda Original` — photos taken by The Rugby Panda.
- `Editorial Partner` — images supplied with explicit permission by clubs, competitions or partners.
- `Open Licence` — third-party image with licence suitable for the site's intended use after review.
- `Historic Archive` — historical material where rights status has been reviewed and recorded.

Original images always take priority when multiple images fit an article.

## Image lifecycle

Use this workflow:

1. `Candidate` — image identified but not reviewed.
2. `Pending Validation` — image selected for review, licence/rights or metadata still being checked.
3. `Approved` — rights/editorial review completed and safe for CMS use.
4. `Published` — used on the website.
5. `Archived` — retained but not recommended for new use.
6. `Rejected` — unsuitable, irrelevant or rights-ineligible; retained for audit/deduplication but removed from normal review.

Acquisition never implies approval. Automatic article assignment may only use records that have passed the existing approval gate and have an eligible Sanity asset.

## Required metadata

Capture as much of the following as the source exposes for every candidate, and complete the required publication metadata during review:

- title / source page title
- direct image URL
- source / landing-page URL
- source organisation/provider
- alt text or source caption where available
- photographer / creator and creator URL
- licence, licence URL, attribution and rights/copyright wording
- team / squad
- named players or coaches pictured when identifiable from metadata
- competition / event
- event date when reliably available
- editorial category and photo type
- suggested editorial use
- source record ID, Apify run ID and dataset ID
- lifecycle status
- usage-approved flag

Approved images should additionally have publication-ready alt text, caption, public credit and copyright line.

## Editorial categories

- International
- Club Rugby
- Grassroots
- Schools & Youth
- Rugby Culture
- Photo Stories
- Evergreen
- Women's Rugby
- Officials
- Training
- Equipment

Public website category naming decision: use `International`, not `Europe`.

## Photo types

Useful photo types include action, stadium, crowd, supporter culture, rugby ball, goalposts, corner flag, boots, lineout, scrum, tackle, ruck, maul, kick, try, celebration, national anthem, team photo, portrait, training, referee, behind the scenes and historical.

## Editorial rating

Use a 1 to 5 rating:

- 5 — hero-quality, suitable for homepage or lead article.
- 4 — strong article header or major card image.
- 3 — useful supporting or gallery image.
- 2 — archive only unless needed.
- 1 — reject unless historically important.

## Editorial value

Use one of:

- `Evergreen`
- `Seasonal`
- `Historical`
- `Exclusive`

## Suggested use

An image can have multiple suggested uses: hero image, article header, homepage card, category banner, gallery, social media, evergreen fallback or archive only.

## Current original Rugby Panda image review

The strongest original categories already include international rugby, Aviva Stadium, Ireland match atmosphere, stadium panorama, national anthems, historical Irish rugby context, veterans rugby, grassroots/amateur rugby, rugby culture, ball/corner-flag imagery, night matches, sideline details and team photos.

Original Rugby Panda assets remain preferred wherever they are genuinely relevant to the article subject.

## External candidate acquisition — 18 August 2026

A new Apify/Openverse collection was executed on 18 August 2026 using `shahidirfan/OpenVerse-Image-Scraper`.

Collection goals:

- Leinster Rugby
- Munster Rugby
- Ulster Rugby
- Connacht Rugby
- Ireland Men
- Ireland Women
- named players and coaches
- URC
- Champions Cup / Challenge Cup
- international rugby
- professional match action
- training
- stadiums and relevant venues

The acquisition manifest is stored at:

`data/editorial-images/apify-collection-2026-08-18.json`

Raw collection result:

- 32 recorded Apify runs
- 912 raw records before relevance, file-type and duplicate filtering
- deliberately over-collected so the project does not satisfy the 200-candidate target with irrelevant imagery

Strongest observed source sets include:

- 2025 Ireland Women Rugby World Cup match photographs with named players and fixture/date context
- Irish province match/action/player material
- Ireland player and Rugby World Cup archive photographs
- Aviva Stadium and other relevant venue imagery
- European competition and international rugby photographs

Raw results are **not** the candidate count and are **not** approved. The maintained importer must filter and deduplicate them and must create at least 200 genuinely new `editorialImage` records with `lifecycleStatus = candidate` and `usageApproved = false` before this acquisition milestone is considered complete.

## Apify import safety contract

The maintained importer is `scripts/import-apify-editorial-image-candidates.mjs`.

It must:

1. fetch the recorded Apify datasets;
2. accept only preferred open-licence identifiers (`cc0`, `pdm`, `by`, `by-sa`);
3. reject obvious non-photo/noise results such as SVGs, kits, flags, livery, school/youth noise and irrelevant records;
4. reject tiny assets where dimensions are available;
5. deduplicate by source record ID, direct image URL and landing-page URL;
6. deduplicate against existing Sanity Editorial Images;
7. preserve source, creator, licence, attribution, run/dataset IDs and editorial subject context;
8. create candidate-only records in the existing `editorialImage` collection;
9. never set `usageApproved` to true;
10. never download or hotlink an unreviewed third-party image into public templates.

The importer is designed to fail rather than report success if fewer than 200 genuinely new candidates remain after filtering/Sanity deduplication.

## Rights policy

Preferred approval licences:

- `cc0`
- `pdm`
- `by`
- `by-sa`

Avoid or reject:

- non-commercial licences
- no-derivatives images for hero/article use
- agency photos without a commercial licence
- unknown or unclear rights status

Openverse licence metadata is evidence for review, not an automatic approval decision. Third-party photographs still require human rights/editorial validation before publication.

## Acquisition sources

Preferred sources for external candidates:

1. Openverse-based sources.
2. Wikimedia Commons.
3. Other reputable archives with clear rights metadata.

Google Images may be used only for discovery and must never be treated as automatic approval.

## Editorial relevance policy

Article imagery is relevance-first and fail-closed.

- Province mismatches are invalid.
- An unrelated approved image must not be used merely because it exists.
- Team/player/fixture/competition/venue matches are preferred.
- Amateur/veterans images such as Ageing Pandas are not valid fallbacks for professional province or national-team stories.
- If no relevant approved asset exists, the article should have no automatically assigned image.

The expanded candidate pool improves the probability of a relevant match; it does not weaken this rule.

## Review workflow

New Apify records feed the existing Sanity `Editorial Images` / `Image Review` workflow. Candidate cards expose team/people/competition/source/licence context where available so rights and editorial relevance can be reviewed together.

Bulk approval remains a human action. The import pipeline never approves records itself.

## Wanted image list

High priority after this collection:

- current Leinster/Munster/Ulster/Connacht players and coaches
- current Ireland Men players and coaches
- new 2026/27 signings
- current URC and European competition action
- training sessions
- trophy presentations

The 2025 Ireland Women Rugby World Cup set substantially improves women's-rugby coverage but still requires rights/editorial review.

## Long-term milestones

- Phase 1: 100 approved starter images.
- Phase 2: 200 curated images.
- Phase 3: 500 searchable images.
- Phase 4: 1,000+ images, mostly Rugby Panda originals.
- Phase 5: 5,000+ images as a major editorial asset.
