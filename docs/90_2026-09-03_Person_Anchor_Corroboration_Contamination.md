# 3 September 2026 — Person-anchor corroboration contamination

## Measured production issue

Recovery run `33708999666` generated `current-2026-09-03-2859df16cff8` from an acquisition bundle that incorrectly combined:

- Reuters: `Australian prop Slipper signs up for 17th Super Rugby season`
- RugbyPass Ireland: `Record-breaking Wallaby James Slipper makes call on Super Rugby future`
- BBC Sport Northern Ireland: `Thun vs Lausanne-Sport: Swiss Super League stats & head-to-head`

Publication Review corrected the draft into a readable article, but the resulting standfirst still explicitly mixed the James Slipper rugby development with the Swiss football result. This is not acceptable evidence coherence for a review-ready Rugby Panda draft.

The draft was failed closed in Sanity by setting only `morningPackageEligible=false`. It was not published. Zoho had not been reached at the point of exclusion.

## Root cause

`build-current-editorial-acquisition-batch.mjs` uses `sharedPersonAnchor()` as one of the strict same-story paths. `surnameTokens()` interpreted the capitalised pair `Swiss Super` as a person-like two-token name and therefore treated `super` as a surname. Because `super` was also retained as a normal similarity token, the Reuters James Slipper headline and the BBC Swiss Super League headline satisfied the `sharedPerson && sharedTitle >= 1` shortcut even though they shared no person and described different sports.

This was a deterministic entity-matching bug, not a model-writing problem.

## Repair

Generic competition words `super` and `league` are now excluded from story-similarity tokens. As a result:

- Reuters Slipper vs BBC Swiss Super League shares zero eligible story tokens and cannot use the person-anchor shortcut;
- Reuters Slipper vs RugbyPass James Slipper still shares the real surname token `slipper` and remains corroboratable;
- no freshness, publisher-count, evidence, diversity, Publication Review, image, human-publication or Zoho exact-one gate is weakened.

The acquisition provenance version advances from corroboration `v8` to `v9` so production evidence can identify runs using the repaired matcher.

## Regression evidence

Against the exact measured titles:

- before repair: Reuters Slipper ↔ BBC Swiss Super League incorrectly matched;
- after repair: shared eligible tokens are `[]`;
- after repair: Reuters Slipper ↔ RugbyPass James Slipper still shares `["slipper"]`.

## Required production verification

1. `current-2026-09-03-2859df16cff8` remains ineligible;
2. a fresh acquisition run cannot attach the BBC Swiss Super League item to the James Slipper story;
3. exactly five genuinely coherent current drafts pass all existing editorial/diversity/image gates;
4. exactly one consolidated Zoho package is accepted for those exact five IDs;
5. no article is automatically published and Meta/social remains untouched.

## Delivery state

3 September Zoho delivery remains **not sent** at the time this repair is implemented.