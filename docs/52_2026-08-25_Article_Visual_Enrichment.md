# 2026-08-25 — Article visual enrichment evidence

## Objective

Close the gap between the agreed article presentation contract and the production draft pipeline: articles should not default to one hero image followed by an uninterrupted wall of text. Use relevant inline photography and evidence-backed contextual cards where they genuinely add value, while preserving the relevance-first / no-image fallback rule.

## Implementation

PR #276 adds a deterministic post-Publication-Review contextual-card enrichment stage. It derives cards only from confirmed/strongly-reported fact-ledger facts with source IDs and sufficient confidence, persists the card to the Sanity article, and reads it back for verification. Where the card is a player card, an optional portrait is attached only when an approved local Sanity image matches the exact named subject. No additional AI call is used.

The same PR includes an idempotent current-package enrichment workflow. It may add up to three inline images, but only when an approved local asset has exact-subject descriptive evidence and the article has a paragraph materially discussing that subject. Assets already used as heroes or elsewhere in the current package are reserved and cannot be reused. No unrelated filler image is allowed.

## Production Sanity verification

GitHub Actions workflow `Enrich Current Morning Visuals` ran directly against production Sanity using the existing protected token. Run #7 completed the enrichment and read-back checks successfully after the contextual-card name parser was tightened to reject incomplete particle-led player names.

Verified current package state:

| Article | Contextual card | Rows | Inline images |
| --- | --- | ---: | ---: |
| Connacht front-row depth | Connacht team snapshot | 4 | 0 |
| Ireland Women / Caitríona Finn | Ireland team snapshot | 4 | 0 |
| Joey Carbery / Leinster | Joey Carbery player snapshot | 4 | 1 |
| Munster academy | Munster team snapshot | 4 | 1 |
| Iain Henderson / Ulster | Iain Henderson player snapshot | 2 | 0 |

The absence of extra inline images on three stories is intentional, not a failure: no additional unused exact-subject approved asset was available that met the strict placement rule. The system therefore keeps the article free of irrelevant visual filler.

## Acceptance boundary

- Current five production drafts: contextual-card persistence and read-back verified in Sanity.
- Current five production drafts: two exact-subject inline visual breaks already present; no article exceeds the three-inline-image cap.
- Future normal `/api/editorial/draft` and replacement paths: contextual-card enrichment is implemented in PR #276, pending merged production deployment.
- Public card renderer already exists from #241.
- Representative live desktop/mobile rendering remains pending because the current drafts are not auto-published and the Vercel Hobby build-rate limit may delay the merged runtime deployment.

## Cost

OpenAI spend for this enrichment work: **$0.00**. Card derivation and current-package enrichment are deterministic.
