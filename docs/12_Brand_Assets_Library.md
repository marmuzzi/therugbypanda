# Brand Assets Library

## Purpose

The Brand Assets Library is the canonical home for reusable rugby branding assets such as team logos, competition logos, league marks and union / governing-body marks.

Brand assets must stay separate from the Editorial Image Archive because logos and marks carry trademark and brand-use considerations that are different from photography rights.

## Current Sprint 4 scope

Sprint 4 starts with the CMS foundation:

- `brandAsset` Sanity document type.
- Dedicated `Brand Assets` Studio section.
- Filtered Studio queues for active brands, teams, competitions / leagues, unions and rights review.
- Rights metadata for editorial / trademark use.
- Logo variants for primary, light-background and dark-background use.
- Colour metadata for future frontend UI, cards and team / competition pages.

## Brand asset fields

Each brand record should include:

- official name
- short name
- slug
- brand type
- active / retired / superseded status
- country and region
- competition level
- primary, light and dark logo variants
- external source URL when used for research/reference
- primary, secondary and accent colours
- official website
- related competition or team/province where applicable
- tags
- rights status
- editorial-use approval flag
- rights holder
- source URL
- usage notes
- review date

## Rights policy

Default rights status is:

`Editorial / trademark use only`

Most rugby logos should be treated this way unless The Rugby Panda receives explicit permission or the asset is clearly owned by The Rugby Panda.

A logo should not be used in public templates until:

1. The source URL is recorded.
2. The rights holder is recorded where known.
3. The rights status is selected.
4. `Approved for editorial use` is set to true.
5. Usage notes explain any limitations.

## Starter library targets

Initial brand records should prioritise:

- World Rugby
- Six Nations Rugby
- United Rugby Championship
- European Professional Club Rugby
- Premiership Rugby
- Top 14
- Super Rugby Pacific
- Irish Rugby Football Union
- Rugby Football Union
- Welsh Rugby Union
- Scottish Rugby
- South African Rugby Union
- Rugby Australia
- New Zealand Rugby
- Connacht Rugby
- Leinster Rugby
- Munster Rugby
- Ulster Rugby

Do not bulk-import third-party logos until the source and usage workflow has been verified in Studio.

## Completion rule

Sprint 4 is not complete until the Brand Assets Studio section is deployed and verified in production, and at least one safe test brand record has been created or reviewed in the authenticated Studio.
