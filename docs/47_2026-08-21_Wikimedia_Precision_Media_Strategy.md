# 2026-08-21 Wikimedia Precision Media Strategy

## Decision

The 20 August Openverse precision sample returned zero useful assets and must not be scaled. Wikimedia Commons is the next measured acquisition source because subject/category identity, source page, creator, date and licence metadata can be retained together and clear free-licence cases can be triaged automatically.

## Owner-approved editorial rules

- Relevance is mandatory. Prefer direct team, player, coach, fixture/event, competition or venue matches.
- The majority of the approved editorial pool should be from the current or immediately previous season where reliable event/photo dates exist.
- Historical/contextual and generic rugby/venue images are useful as a smaller deliberate pool, but must not displace a better recent subject-specific image.
- If no sufficiently relevant approved image exists, use no image rather than an unrelated fallback.
- The assistant owns clear approve/reject decisions. Owner escalation is for genuinely ambiguous rights/relevance cases only, with a target of no more than 5% of candidates.
- Third-party discovery never bypasses rights review or the Sanity publication boundary.
- Public pages must use locally stored Sanity assets rather than hotlinking third-party originals.

## Discovery implementation

`scripts/discover-wikimedia-editorial-images.mjs` performs exact-subject Commons discovery for Ireland Men/Women, Leinster, Munster, Ulster, Connacht, URC and Six Nations targets. It retains source/licence/date/creator metadata, rejects non-raster/low-resolution/obviously unsuitable assets, marks recent imagery, deduplicates by image URL and reports the owner-review rate.

This first implementation is discovery/triage only. `approve-candidate` means sufficiently clear for assistant-led review; it does not itself publish or assign an image. The next controlled step is to inspect a small measured output, tighten false positives, then add local Sanity asset ingestion for approved candidates with attribution preserved.

## Fresh-source evidence

A live Commons check on 21 August found materially better recall than the failed Openverse sample, including a 2025 Six Nations category with 96 files for Italy v Ireland, 2025 Ireland Women's Rugby World Cup match categories with 100+ high-resolution images, and current named-player categories such as Garry Ringrose containing 2025 match photography. Individual checked files expose creator, event date and CC BY-SA licensing on their description pages.

## Verification boundary

Implemented and committed on `media/wikimedia-commons-acquisition`. Not yet merged, deployed or production verified. Do not count discovered files toward the 200 approved local-media launch floor until they are visually reviewed, rights-cleared and imported as local Sanity assets.
