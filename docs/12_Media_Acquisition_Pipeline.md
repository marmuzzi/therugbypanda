# Media Acquisition Pipeline

## Purpose

This pipeline collects external image candidates, keeps them out of production until validated, and prepares approved images for the Sanity Editorial Image Archive.

## Storage model

- Apify stores raw actor run output in its dataset.
- The repository stores normalized candidate metadata in `data/media/apify-candidates.json` when needed for review or import.
- Sanity stores editorial image records.
- Sanity Asset Store stores image files only after approval.
- GitHub must not store downloaded third-party image files.

## Lifecycle

1. `Candidate` — collected from Apify or manual research.
2. `Pending Validation` — shortlisted for source and licence review.
3. `Approved` — safe for CMS use.
4. `Published` — used on the public website.
5. `Archived` — retained but not recommended for future use.

## Recommended Apify sources

Preferred:

1. `shahidirfan/OpenVerse-Image-Scraper`
2. `parseforge/openverse-media-scraper`
3. `parseforge/wikimedia-commons-media-scraper`

Discovery only:

- `solidcode/google-images-scraper`

Google Images results must never be treated as approved assets.

## Initial search themes

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

## Candidate import flow

1. Run an Apify actor with one or more search themes.
2. Export or transform the dataset into `data/media/apify-candidates.json`.
3. Ensure every record follows `data/media/apify-candidates.sample.json`.
4. Run `npm run media:import-candidates` with `SANITY_API_TOKEN` set.
5. Review imported records in Sanity.
6. Move only validated records to `Approved`.
7. Upload the approved image file into Sanity Asset Store.
8. Attach approved images to articles.

## Approval rule

A candidate can only become approved when it has:

- title
- image URL
- source URL
- landing page URL
- creator, when applicable
- licence
- licence URL
- attribution text, when applicable
- source classification
- editorial category
- lifecycle status
- validation notes

Preferred licences for approval consideration:

- `cc0`
- `pdm`
- `by`
- `by-sa`

Avoid for article and hero images:

- non-commercial licences
- no-derivatives licences
- unclear rights
- agency or press photos without explicit commercial terms

## Original Rugby Panda images

Original Rugby Panda photography bypasses Apify acquisition but still belongs in the same Sanity archive.

Public credit:

- `Photo: The Rugby Panda`
- `© The Rugby Panda`

Do not publish the user's personal identity as photographer or founder.
