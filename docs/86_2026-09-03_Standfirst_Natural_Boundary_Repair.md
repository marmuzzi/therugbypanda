# 3 September 2026 — Standfirst natural-boundary repair

## Measured production issue

During bounded recovery run `33706956178`, the retained draft `current-2026-09-03-303865f55eeb` was still morning-package eligible with this standfirst ending:

`...With even Kieran Read highlighting Erasmus’s influence on officials, the margins around.`

That is visibly truncated and is not review-ready. The draft was therefore failed closed from the 3 September package before Zoho delivery by setting only its draft `morningPackageEligible` flag to false. No content was published.

## Root cause

`PublicationReviewCycle.clipAtNaturalBoundary()` repairs over-limit metadata after Publication Review. It preferred a sentence boundary only when that boundary occurred after 60% of the metadata limit. When a complete earlier sentence existed but fell just below that threshold, the fallback could cut at an arbitrary word boundary and append a period. That could convert previously reviewed prose into a grammatically incomplete standfirst after the final review pass.

## Repair

The clipping helper now prefers any complete sentence ending after 35% of the configured limit before considering clause/word fallback. This preserves the hard metadata limit while preferring complete reviewed prose over a longer artificial fragment.

The existing final deterministic Draft Ready/originality gates remain unchanged and fail closed. No editorial, freshness, diversity, image, publication or delivery gate is weakened.

## Required verification

The repair is not complete until a fresh bounded production generation demonstrates that:

1. the manually excluded truncated draft is not counted toward the exact five;
2. its replacement completes Publication Review and persists with a grammatically complete standfirst within the 220-character limit;
3. exactly five fresh review-ready drafts survive diversity and image relevance verification;
4. exactly one consolidated Zoho package is accepted (or exact-package evidence proves it was already sent);
5. no article is automatically published and Meta/social remains untouched.

## Delivery state at diagnosis

Zoho had **not** been sent for 3 September when this issue was identified. The active recovery was still upstream of the delivery step.