# Editorial Image Review Update

Date: 4 July 2026

## Implemented

- Added `Rejected` to the Editorial Image lifecycle.
- Added Studio review queues:
  - Needs Review
  - Approved
  - Published
  - Rugby Panda Originals
  - Rejected
  - All Editorial Images
- Changed `photoType` to support multiple values and made it optional for review.
- Added larger previews for imported image URL records.
- Added event/album, venue and teams fields.
- Added a metadata manifest for 22 original Rugby Panda photos:
  - `data/media/rugby-panda-originals-2026-07-04-manifest.json`

## Original image attribution

Original Rugby Panda photos must use:

- Source classification: `The Rugby Panda Original`
- Public credit: `Photo: The Rugby Panda`
- Copyright: `© The Rugby Panda`
- Lifecycle status: `Approved`
- Usage approved: `true`

## Verification required

After redeploying Sanity Studio:

1. Confirm the new Editorial Images queues are visible.
2. Confirm imported images show a large preview.
3. Confirm `photoType` accepts multiple values and no longer blocks review.
4. Confirm setting lifecycle status to `Rejected` removes the item from Needs Review.
5. Confirm original photo metadata can be applied from the manifest.
