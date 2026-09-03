# 3 September 2026 — News evidence boundary P0

## Measured production failure

Recovery run `33711675138` successfully loaded the expanded 25-source registry and reached bounded fifth-slot generation. Publication Review correctly rejected an incoherent IRFU/Exeter candidate, but a later candidate persisted as `current-2026-09-03-04b23e853bbc` with the headline `Exeter’s women’s away replica shirt: what it signals for 26/27`.

Its supplied evidence mixed an Exeter Chiefs merchandise/catalog page with an unrelated RugbyPass Spain team-index page. The final Sanity draft retained only one source note. It was immediately failed closed by setting `morningPackageEligible=false`; no publication occurred. Because the exact-five package was then broken, image planning stopped and Zoho delivery was skipped.

## Root causes

1. The concrete-evidence gate treated commerce/catalog pages and generic team-index pages as admissible editorial evidence when they contained rugby/team tokens.
2. The generated-article boundary did not deterministically require the final article's `sourceNotes` to preserve at least two supplied evidence sources from two distinct publishers before Sanity persistence.

## Repair

- `scripts/filter-current-acquisition-evidence.mjs` now excludes replica-shirt/jersey, merchandise, gift-card, buy-now/add-to-cart/product-page evidence and generic `Rugby Team | ... News, Players & Stats` index pages. Candidates must still retain at least two independent editorial-news sources after that filtering.
- `app/api/editorial/draft/route.ts` adds a final pre-Sanity source-integrity gate. The generated article must contain at least two source notes, all notes must map to supplied source IDs/publishers, and at least two distinct publishers must remain.
- Publication Review, originality, Draft Ready, 36-hour freshness, package diversity, strict image relevance, human publication and exact-one Zoho delivery are unchanged.

## Required production verification

1. the Exeter replica-shirt / RugbyPass Spain evidence combination is rejected before model spend;
2. a generated article whose final source notes collapse below two publishers is rejected before Sanity creation;
3. exactly five fresh review-ready drafts survive all editorial/diversity/image gates;
4. exactly one consolidated Zoho package is accepted for those exact five IDs;
5. no article is automatically published and Meta/social remains untouched.

## Delivery state

3 September Zoho delivery: **not sent**. Run `33711675138` failed before final image assignment and all Zoho steps were skipped.