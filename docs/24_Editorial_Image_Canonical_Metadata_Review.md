# Editorial Image Canonical Metadata Review

## Status

Implemented and verified against the production Sanity dataset on 23 July 2026 under `PUB-002` and `PUB-003`.

## Connector state

Verified during this work session:

- GitHub — available and read/write capable.
- Vercel — available.
- Apify — available.
- Sanity — direct authenticated query access available.
- Make.com — not connected.

## PR #40 verification

PR #40 was confirmed merged at commit `cd442f47eee73237f935bdad9848f789ca7c618d`.

The associated production Vercel deployment `dpl_Hu5TA2PFvdbcnJFcL8zkfsEdv9Zb` was confirmed `READY`.

## Canonical metadata suggestions fix

The metadata suggestions query now excludes `drafts.*` documents with:

```groq
*[_type == "editorialImage" && !(_id in path("drafts.**"))]
```

A runtime guard also fails the generator if a draft ID is unexpectedly returned.

The production dataset contains:

- 40 raw Editorial Image documents.
- 38 canonical Editorial Image documents.
- 2 draft/published document pairs.

## Reviewed decision file

Decision file:

- `data/editorial-image-metadata/review-decisions-2026-07-23.json`

Reviewed canonical IDs:

- `media-candidate-37cb2e9b2ab4af54`
- `media-candidate-ec5cdf173d079e58`

Both were approved, usage-approved records with stored creator, source URL and licence metadata.

## Controlled dry run

GitHub Actions run:

- `30042466296`

Result:

- Decisions: 2.
- Applicable: 2.
- Applied: 0.
- No change: 0.
- Rejected: 0.
- Skipped fields: 0.

The dry run proposed only the four reviewed missing fields for each record:

- `altText`
- `caption`
- `publicCredit`
- `copyrightLine`

## Explicit apply

GitHub Actions run:

- `30042718915`

Result:

- Decisions: 2.
- Applicable: 2.
- Applied: 2.
- No change: 0.
- Rejected: 0.
- Skipped fields: 0.

Direct authenticated Sanity queries confirmed both canonical production records contain the reviewed values and remain `approved` with `usageApproved = true`.

## Readiness audit rerun

GitHub Actions run:

- `30042908343`

Updated result:

- Total records: 40.
- Publication ready: 24, previously 22.
- Needs attention: 16, previously 18.
- Approved or published: 34.
- Approved/published but not ready: 10, previously 12.
- Duplicate asset groups: 0.
- Duplicate source groups: 2, still caused by draft/published pairs.

## CMS-002 discovery

Seven published article records were inspected. All currently have no assigned `featuredImage`, `heroImage`, `mainImage`, `editorialImage` or `image` value.

Image assignment remains pending until the canonical article image field and frontend query contract are confirmed from the article schema. The first recommended assignment is an approved Rugby Panda original relevant to the Ireland article, followed by a controlled assignment workflow for the remaining articles.

## Completion interpretation

- `PUB-002` canonical filtering is implemented and ready to merge.
- `PUB-003` has completed a real dry run, explicit reviewed apply, readiness-audit rerun and authenticated production-data verification.
- Authenticated Sanity Studio UI verification remains required before closing `PUB-003` under the project completion rule.
- `CMS-002` remains open; article records have been inspected but no image references have yet been written.
