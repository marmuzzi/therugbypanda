# Batch 2 Completion Attempt

## Status

Created on 5 July 2026 after PR #33 was merged and production verified.

## Goal

Continue Batch 2 of the Brand Assets candidate collector for remaining approved-scope rugby-union organisations.

## Connector status

At the start of this follow-up, GitHub remained available and the repository documentation was read from `main`.

Apify had been available earlier in the same session and was used for `docs/18_Apify_Targeted_Logo_Extraction.md`, but after the user requested Batch 2 completion the connector discovery surface no longer exposed Apify. The active connector list exposed GitHub, Gmail, Google Calendar, Google Contacts and Vercel only.

Because Apify was not available at this point, no additional Apify actor runs were started in this attempt.

## Candidate-only rules preserved

No candidate was approved.

No Sanity asset upload was performed.

No Sanity import was performed.

No public template use or hotlinking was introduced.

## Current Batch 2 files already available

- `data/brand-assets/candidate-collection-batch-2-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-2026-07-05.json`
- `data/brand-assets/candidate-logo-extraction-apify-2026-07-05.json`

## Remaining targets from the latest Apify extraction doc

- Japan Rugby Football Union.
- Fiji Rugby Union.
- Samoa Rugby Union.
- Tonga Rugby Union.
- Georgia Rugby Union.
- USA Rugby.
- Rugby Canada.
- Uruguay Rugby Union.
- Chile Rugby.
- Portugal Rugby.
- Spain Rugby.
- Romania Rugby.
- Namibia Rugby Union.
- World Rugby.
- Rugby World Cup.

## Required next action

When Apify is visible again, continue targeted browser extraction for the remaining targets above, writing candidate-only output to a new JSON file and updating `docs/18_Apify_Targeted_Logo_Extraction.md` or a new follow-up handoff document.

Do not import or approve anything automatically.
