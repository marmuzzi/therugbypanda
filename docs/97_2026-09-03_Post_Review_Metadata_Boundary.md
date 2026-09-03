# 3 September 2026 — Post-Review Metadata Boundary

## Production evidence

Production recovery run `33722049593` retained four valid same-day positions and attempted the bounded fresh replacement pool. The James Slipper candidate reached generation and Publication Review but failed the final deterministic Draft Ready gate with `SEO description exceeds the Draft Ready character limit.` The final image transaction and Zoho delivery steps were therefore skipped.

Inspection of `lib/editorial/PublicationReviewCycle.ts` found a deterministic off-by-one in `clipAtNaturalBoundary()`: for an over-limit string it inspected `trimmed.slice(0, max + 1)`. When punctuation occurred at index `max`, the sentence-boundary branch could return `candidate.slice(0, sentenceBoundary + 1)`, producing `max + 1` characters. With the SEO-description hard limit of 160 this permits a 161-character normalized value to reach the deterministic gate.

## Repair

The natural-boundary inspection window is now exactly `max` characters. This keeps sentence/clause/word-boundary normalization inside the existing hard metadata limit rather than relaxing the limit or bypassing Publication Review.

No freshness, corroboration, source-integrity, package-diversity, originality, Publication Review, image-relevance, exact-five, human-publication or exact-one Zoho control is weakened.

## Issue-log record

- ID: `AUTO-004-P24`
- Status: Implemented; merge/deployment/production verification pending at creation
- Priority: Critical
- Area: Editorial Automation / Publication Review
- Root cause: post-review natural-boundary normalization inspected one character beyond the hard metadata limit and could return that extra character when it was punctuation.
- Related PR: current post-review metadata-boundary PR
- Deployment status: pending
- Verification status: pending fresh production recovery
- Resolution date: —

## Verification required

1. The repaired main branch must deploy READY in Vercel production.
2. A fresh bounded recovery must no longer fail a reviewed draft solely because `clipAtNaturalBoundary()` returned 161 characters for the 160-character SEO-description contract.
3. The package must reach exactly five current, fresh, review-ready production drafts.
4. All five must survive strict assignment-safe image verification.
5. Exactly one consolidated Zoho editorial email must be accepted for the exact five IDs.
6. Sanity remains the human publication boundary; no article is auto-published and Meta/social remains untouched.
