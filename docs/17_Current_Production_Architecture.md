# Current Production Architecture

## Status

Sprint 4 is complete.

The Rugby Panda now has a verified production media architecture where Editorial Images and Brand Assets are centrally managed in Sanity with review workflows before frontend use.

## Current architecture

```text
Discovery / acquisition
→ GitHub candidate JSON
→ GitHub Action import
→ Sanity candidate records
→ Review tool
→ Manual approval / rejection / archive
→ Approved CMS records for future editorial use
```

## Editorial Images

Editorial Images are managed in Sanity using a complete review workflow.

Current capabilities:

- `editorialImage` document type.
- Bulk Image Review tool.
- Needs Review, Approved and Rejected queues.
- Original Rugby Panda images.
- External candidate images.
- Bulk import workflow.
- Candidate metadata preservation.
- User manual approval/rejection before use.

Current acquisition priorities:

- Stadiums.
- Rugby supporters.
- Match atmosphere.
- Pubs showing rugby.
- Match action.
- Training.

Do not continue collecting rugby balls or generic equipment unless specifically requested.

## Brand Assets

Brand Assets use the same review philosophy as Editorial Images.

Brand assets are not published directly.

Workflow:

```text
Apify / official-source discovery
↓
GitHub candidate JSON
↓
GitHub Action
↓
Sanity import
↓
Brand Review
↓
Approve / Reject / Archive
↓
Approved CMS record for future frontend use
```

Candidate logos are imported into Sanity as unapproved review records.

Inside Sanity, every candidate can be:

- Candidate.
- Pending Validation.
- Approved.
- Rejected.
- Archived.

Nothing is approved automatically.

## Brand Review Tool

Sanity contains a dedicated Brand Review tool similar to Image Review.

It supports bulk:

- Approve.
- Reject.
- Archive.

Candidate logo URLs are references only.

They must never be hotlinked on the website.

Approved logos should eventually become uploaded Sanity assets before public frontend use.

## Rights policy

Every imported logo candidate starts as:

```text
approvedForEditorialUse = false
rightsStatus = editorial-trademark-use-only
lifecycleStatus = candidate
```

Only after editorial review may a logo record become approved.

Public frontend use requires a further implementation step: upload reviewed logo files into Sanity assets and render only approved Sanity-hosted assets.

## Import workflow

The Brand Assets import workflow exists and is mobile-friendly through GitHub Actions.

Workflow name:

`Import Brand Asset Candidates`

Script:

`npm run brand-assets:import-candidates`

The importer now supports:

- `candidates` arrays.
- `targetedResults` arrays.
- creating new candidate records.
- updating existing unapproved candidate records.
- skipping already-approved records.

## Brand Assets current state

Completed:

- Sprint 4 Brand Assets foundation.
- Batch 1 import and manual approval.
- Batch 2 source coverage.
- Batch 2 import as candidates.
- Batch 2 logo-reference importer fix.
- Batch 2 Brand Review by user.
- 5 Batch 2 records approved by user.

Still required before public logo display:

- Upload final approved logos into Sanity assets.
- Replace external candidate URL references with Sanity asset references.
- Verify public templates do not hotlink external candidate URLs.

## Acquisition scope

Only collect:

- World Rugby.
- Rugby World Cup.
- Six Nations.
- EPCR.
- Champions Cup.
- Challenge Cup.
- United Rugby Championship.
- Rugby unions.
- Rugby World Cup-cycle national teams.
- Irish provinces.
- Professional clubs relevant to URC, Champions Cup or Challenge Cup.

Never collect:

- Sponsors.
- Broadcasters.
- Commercial partners.
- Amateur clubs.
- Schools.
- Grassroots clubs.
- Non-rugby organisations.

## Sprint 5 priorities

After Brand Assets expansion, priorities are:

- AI-powered bulk upload of original Rugby Panda photos into Sanity.
- AI categorization by stadium, teams, competition, supporters, match action, pubs and related newsroom categories.
- Automatic title, caption, alt text, tags and metadata generation.
- Duplicate detection.
- Event and album creation.
- Fast search of the Editorial Image Library.
- Assign approved editorial images to current articles.
- Build real website search.
- Build the article generation / review / scheduled publishing workflow.

## Long-term goal

The long-term goal is for The Rugby Panda to function like a professional newsroom, where editorial images, brand assets and article production are centrally managed in Sanity with AI-assisted ingestion, review and reuse.
