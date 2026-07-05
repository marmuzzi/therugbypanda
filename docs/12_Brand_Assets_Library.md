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

Sprint 4 Task 4 has now started as candidate-only acquisition output:

- Candidate records are stored in `data/brand-assets/candidate-collection-2026-07-05.json`.
- Collection used Apify `apify/rag-web-browser` against official rugby source pages.
- Candidate records are not approved, not published and not imported into Sanity as usable logo assets.
- `approvedForEditorialUse` must remain false until a manual editorial/rights review is completed.

## Acquisition scope

Do not collect brand assets outside the rugby-union editorial scope.

Approved scope:

- Rugby union governing bodies and unions.
- National teams that normally participate in Rugby World Cup qualification cycles or Rugby World Cup finals.
- Teams and competitions that participate in, organise, or are directly relevant to top-level international rugby, Champions Cup or Challenge Cup coverage.
- Irish provinces and other professional clubs only when they are relevant to United Rugby Championship, Champions Cup or Challenge Cup coverage.

Out of scope unless explicitly approved later:

- Random grassroots clubs.
- Schools, youth teams or amateur clubs.
- Sponsors, broadcasters or commercial partners.
- Teams from competitions outside the Rugby World Cup / international rugby / Champions Cup / Challenge Cup editorial lane.
- Generic sports brands or non-rugby organisations.

National-team collection should stay focused on countries that normally participate in Rugby World Cup cycles. That is already enough for the first national-team library.

## Connector rule

Apify is expected to be available for acquisition workflows.

Use Apify for structured discovery and collection tasks such as:

- official logo/source-page discovery,
- official website discovery,
- candidate asset metadata extraction,
- candidate source URL collection,
- future acquisition pipelines for images and article candidates.

Always check active connector availability at the start of a session before assuming Apify can be used directly.

## Brand asset candidate collector

The first candidate collector pass ran on 5 July 2026.

Apify runs used for the first candidate file:

- `kfrzGA4W4OiRtPHDU` / dataset `cHRH5MKA4jY0OpceD` — Six Nations Rugby corporate/media source discovery.
- `rL7g9OFGSJL3PQQY0` / dataset `yuz5P6lIMwBZXmzba` — EPCR, Champions Cup and Challenge Cup source discovery.
- `QqjyFgqiiapbmRTkg` / dataset `Icm5UGA8rd2jV05MR` — URC media-centre source discovery.
- `gpBny1OiiU55jOFVI` / dataset `enqhstkkWdCoARsLU` — World Rugby and Rugby World Cup source discovery.

Initial candidates collected:

- Six Nations Rugby.
- Irish Rugby Football Union / Ireland Rugby.
- Rugby Football Union / England Rugby.
- Scottish Rugby Union / Scottish Rugby.
- Fédération Française de Rugby / France Rugby.
- Federazione Italiana Rugby / Italy Rugby.
- Welsh Rugby Union / Wales Rugby.
- European Professional Club Rugby.
- European Rugby Champions Cup.
- EPCR Challenge Cup.
- United Rugby Championship.
- World Rugby.
- Men's Rugby World Cup 2027.

Candidate collector limitations:

- Some records have logo URL candidates but no extracted colour values yet.
- World Rugby and Rugby World Cup candidate records currently confirm official source pages but still need a follow-up extraction pass for reliable logo URLs and colour values.
- Sponsor, broadcaster and commercial partner marks found on official pages must be ignored.
- External logo URLs are references for review only. Do not hotlink them in frontend templates.

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

Do not bulk-import third-party logos until the source and usage workflow has been verified in Studio.

## Starter library targets

Initial brand records should prioritise:

### Governing bodies and unions

- World Rugby
- Irish Rugby Football Union
- Rugby Football Union
- Welsh Rugby Union
- Scottish Rugby
- South African Rugby Union
- Rugby Australia
- New Zealand Rugby
- Fédération Française de Rugby
- Federazione Italiana Rugby
- Unión Argentina de Rugby
- Japan Rugby Football Union
- Fiji Rugby Union
- Samoa Rugby Union
- Tonga Rugby Union
- Georgia Rugby Union
- USA Rugby
- Rugby Canada
- Uruguay Rugby Union
- Chile Rugby
- Portugal Rugby
- Spain Rugby
- Romania Rugby
- Namibia Rugby Union

### Competitions

- Rugby World Cup
- Six Nations Rugby
- United Rugby Championship
- European Professional Club Rugby
- European Rugby Champions Cup
- EPCR Challenge Cup

### Irish provinces

- Connacht Rugby
- Leinster Rugby
- Munster Rugby
- Ulster Rugby

Do not add broad rugby clubs outside this editorial scope unless they are directly relevant to Champions Cup, Challenge Cup or current international coverage.

## Completion rule

Sprint 4 foundation is complete because the Brand Assets Studio section is deployed and the user verified the `Brand Assets` category is visible in authenticated Sanity Studio after redeploying the Studio through GitHub Action.

Sprint 4 Task 4 is implemented as a candidate-only data/docs branch, but it is not complete until the candidate output is reviewed, merged if accepted, and any later Sanity import workflow is verified.
