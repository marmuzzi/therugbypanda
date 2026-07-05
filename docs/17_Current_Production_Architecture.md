# Current Production Architecture

## Status

Sprint 4 is complete.

The Rugby Panda now has a verified production media architecture where Editorial Images and Brand Assets are centrally managed in Sanity with review workflows before frontend use.

## Editorial Images

Editorial Images are managed in Sanity using a complete review workflow.

Current capabilities:

- `editorialImage` document type.
- Bulk Image Review tool.
- Needs Review, Approved and Rejected queues.
- Original Rugby Panda images.
- External candidate images.
- Bulk import workflow.
- Images are imported into Sanity as candidates.
- The user manually approves or rejects images inside Sanity before they are used.

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
Apify
↓
GitHub candidate JSON
↓
GitHub Action
↓
Sanity import
↓
Brand Review
↓
Approve / Reject
↓
Available for frontend
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

Every imported logo is created as:

```text
approvedForEditorialUse = false
rightsStatus = editorial-trademark-use-only
lifecycleStatus = candidate
```

Only after editorial review may a logo become approved.

## Import workflow

The Brand Assets import workflow exists.

Candidate JSON is imported through a GitHub Action.

The import creates unapproved Brand Asset records inside Sanity.

After import, the user reviews everything in Studio.

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

## Current state

Sprint 4 is complete.

The entire Brand Asset workflow has been verified:

```text
Apify → GitHub → Sanity → Brand Review → Approval
```

The first candidate batch was successfully imported into Sanity and manually approved.

The next task is Batch 2, expanding the library with:

- Remaining Rugby World Cup-cycle unions.
- Remaining national teams.
- Leinster.
- Munster.
- Ulster.
- Connacht.
- Other professional clubs within the approved editorial scope.

## Sprint 5 priorities

After Brand Assets expansion, priorities are:

- AI-powered bulk upload of original Rugby Panda photos into Sanity.
- AI categorization by stadium, teams, competition, supporters, match action, pubs and related newsroom categories.
- Automatic title, caption, alt text, tags and metadata generation.
- Duplicate detection.
- Event and album creation.
- Fast search of the Editorial Image Library.

## Long-term goal

The long-term goal is for The Rugby Panda to function like a professional newsroom, where both editorial images and brand assets are centrally managed in Sanity with AI-assisted ingestion, review and reuse.
