# P0 — Contextual card image identity

Date: 1 September 2026
Issue: MEDIA-012
Priority: P0 / Critical
Status: Implemented; pending merge, deployment and production verification

## Production evidence

Recovery run `33443459968` created a Springboks / All Blacks article whose contextual card was classified as `kind: player` with title `All Blacks`. The portrait lookup then selected an approved Sanity image because its alt text mentioned Munster's 1978 win over the All Blacks. The image itself depicted a figure/window near Thomond Park in Limerick and was unrelated to the current New Zealand/South Africa story.

The downstream daily image workflow separately failed closed because only four true current-package drafts existed; therefore the bad contextual-card image was not corrected by the article-specific image pipeline before the email was sent.

## Root cause

`ContextualDataCardBuilder` could treat international team names such as `All Blacks` as person names because the non-person vocabulary covered Irish teams/competitions but not common international team identities.

`ContextualDataCardEnricher` then used a broad title/alt/caption substring lookup for every `player` card. Once `All Blacks` was misclassified as a player, any approved image whose metadata happened to mention those words could be selected as a portrait.

## Fix

- International team and nation names are excluded from person-subject inference in the contextual-card builder.
- The contextual-card enricher adds an independent non-person guard before any player portrait lookup.
- A player portrait lookup now requires a plausible two- or three-token person name and rejects known team/competition identities.
- The existing relevance-first rule remains unchanged: when identity is not sufficiently specific, no portrait is preferable to a misleading image.

## Related package-identity fixes

- PR #329: stable story-fingerprinted candidate IDs prevent retained drafts being overwritten during same-day recovery.
- PR #330: Zoho delivery is bound to the current Europe/Dublin package and can no longer backfill a current gap with historical drafts.

## Verification boundary

Complete only after merge/deployment and a production recovery demonstrates that a team-labelled contextual card cannot acquire an unrelated player/venue image, the exact five current drafts proceed through article-specific image validation, and Zoho receives only the exact current five.

Resolution date: pending production verification.
