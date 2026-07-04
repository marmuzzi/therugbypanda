# Editorial Image Archive

## Purpose

The Rugby Panda image archive is a first-class editorial asset. The goal is to build a searchable, reusable, rights-safe rugby photography library that supports articles, homepage cards, category pages, social posts and future photo stories.

Original Rugby Panda photography should become the dominant source of imagery over time.

## Public identity and attribution

The user does not want their personal identity exposed publicly.

For original photos uploaded by the user, public attribution must be:

- `Photo: The Rugby Panda`
- `© The Rugby Panda`

Do not publish the user's personal name as photographer, founder or owner unless the user explicitly changes this decision later.

Internal CMS records may include private operational notes, but public templates must only show The Rugby Panda brand identity.

## Source classification

Every image must have one source classification:

- `The Rugby Panda Original` — photos taken by The Rugby Panda.
- `Editorial Partner` — images supplied with explicit permission by clubs, competitions or partners.
- `Open Licence` — third-party image with licence suitable for the site's intended use.
- `Historic Archive` — historical material where rights status has been reviewed and recorded.

Original images always take priority when multiple images fit an article.

## Image lifecycle

Use this workflow:

1. `Candidate` — image identified but not reviewed.
2. `Pending Validation` — image selected for review, licence/rights or metadata still being checked.
3. `Approved` — safe and ready for CMS use.
4. `Published` — used on the website.
5. `Archived` — retained but not recommended for new use.

## Required metadata

Every approved image should have:

- title
- alt text
- caption
- public credit
- copyright line
- source classification
- source URL, when applicable
- original landing page URL, when applicable
- creator, when applicable
- creator URL, when applicable
- licence, when applicable
- licence URL, when applicable
- attribution text, when applicable
- editorial category
- photo type
- tags
- search keywords
- orientation
- editorial rating
- editorial value
- suggested use
- lifecycle status

## Editorial categories

Use these categories for media organisation:

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

Public website category naming decision:

- Use `International`, not `Europe`.

## Photo types

Useful photo type tags include:

- action
- stadium
- crowd
- supporter culture
- rugby ball
- goalposts
- corner flag
- boots
- lineout
- scrum
- tackle
- ruck
- maul
- kick
- try
- celebration
- national anthem
- team photo
- portrait
- training
- referee
- behind the scenes
- historical

## Editorial rating

Use a 1 to 5 rating:

- 5 — hero-quality, suitable for homepage or lead article.
- 4 — strong article header or major card image.
- 3 — useful supporting or gallery image.
- 2 — archive only unless needed.
- 1 — reject unless historically important.

## Editorial value

Use one of:

- `Evergreen` — reusable for years.
- `Seasonal` — useful for a season, competition or campaign.
- `Historical` — useful because of archive or historical context.
- `Exclusive` — original Rugby Panda asset with unique brand value.

## Suggested use

An image can have multiple suggested uses:

- hero image
- article header
- homepage card
- category banner
- gallery
- social media
- evergreen fallback
- archive only

## Current original Rugby Panda image review

The user uploaded two batches of original rugby photos in chat. All uploaded photos were taken by The Rugby Panda.

Observed categories in the uploaded batches:

- international rugby
- Aviva Stadium
- Ireland match atmosphere
- Ireland vs Italy lineout
- stadium panorama
- national anthems
- Brian O'Driscoll tribute / historical Irish rugby context
- veterans rugby
- Sevilla veterans rugby ball
- grassroots or amateur rugby
- rugby culture and pub/supporter atmosphere
- corner flag and ball
- night match
- sideline and behind-the-scenes details
- team photos

Current review summary:

- 20+ original images reviewed visually.
- 8 hero-quality images identified.
- 5 evergreen images identified.
- The strongest generic/evergreen images include rugby ball, corner flag, stadium panorama, team atmosphere and behind-the-scenes equipment shots.

## Starter external image library

Target: 100 approved starter images.

Current tracker from chat-based discovery:

- Candidates found: 27
- Pending licence validation: 26
- Verified and ready: 1 / 100

Important: all external candidates must be revalidated before import into Sanity. Do not rely on chat memory alone.

Preferred approval licences:

- `cc0`
- `pdm`
- `by`
- `by-sa`

Avoid:

- non-commercial licences
- no-derivatives images for hero/article use
- agency photos without a commercial licence
- unknown or unclear rights status

## Acquisition sources

Preferred sources for external candidates:

1. Openverse-based sources.
2. Wikimedia Commons.
3. Other reputable archives with clear rights metadata.

Google Images may be used only for discovery. It must never be treated as automatic approval.

## Apify strategy

When Apify is available, use it to collect structured image candidates, then validate and enrich them before CMS import.

Recommended actors discussed:

1. `shahidirfan/OpenVerse-Image-Scraper`
2. `parseforge/openverse-media-scraper`
3. `parseforge/wikimedia-commons-media-scraper`
4. `solidcode/google-images-scraper` only for discovery, never automatic approval

Recommended initial search themes:

- rugby
- rugby union
- rugby stadium
- rugby ball
- rugby posts
- grassroots rugby
- women's rugby
- rugby training
- rugby referee
- rugby supporters

Minimum fields required before approval:

- title
- image URL
- source URL
- original landing page URL
- creator
- creator URL
- licence
- licence URL
- attribution
- dimensions when available
- usage approved flag

## Future CMS feature: Media Acquisition page

Planned future workflow:

1. Search candidate images.
2. Review licence and attribution.
3. Generate metadata.
4. Score editorial quality.
5. Detect duplicates or near-duplicates.
6. Suggest crops for homepage, article hero, mobile and social.
7. Approve into Sanity.
8. Make images searchable and reusable across articles.

The CMS should eventually suggest images automatically based on article metadata. For example, an article tagged `Ireland` and `International` should surface Aviva Stadium, Ireland atmosphere or relevant original Rugby Panda images first.

## Wanted image list

Use this list to guide both external sourcing and future match photography.

High priority:

- women's rugby action
- referee / match official close-up
- trophy presentation
- training session
- youth/schools rugby
- grassroots coaching

Medium priority:

- floodlit stadium
- empty pitch
- rugby boots
- goalposts
- crowd/supporters
- clubhouse/pub culture

Already started through original images:

- rugby ball
- corner flag
- Aviva Stadium
- international match atmosphere
- veterans rugby
- grassroots atmosphere
- behind-the-scenes details

## Long-term milestones

- Phase 1: 100 approved starter images.
- Phase 2: 200 curated images.
- Phase 3: 500 searchable images.
- Phase 4: 1,000+ images, mostly Rugby Panda originals.
- Phase 5: 5,000+ images as a major editorial asset.
