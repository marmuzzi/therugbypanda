# P0 — retained-draft integrity in same-day recovery

Date: 1 September 2026
Issue: AUTO-004-P12
Priority: Critical
Status: Implemented; pending production verification

## Measured defect

Recovery run `33452840750` reached five same-day eligible Sanity drafts by retaining four accepted drafts and generating one missing slot. The newly generated Scarlets–Sharks draft exposed unrelated Manchester United/Ipswich football and ILCA sailing provenance in its fact/card data. PR #337 prevents that cross-sport evidence from entering newly built acquisition clusters, but the existing contaminated draft was already stored in Sanity and the incremental recovery loader would have preserved it as a successful same-day draft.

## Root cause

Same-day preservation validated package date and eligibility state, but did not revalidate persisted source/card provenance before counting a retained draft toward the five-slot package.

## Fix

The retained-draft loader now reads persisted `sourceNotes` and `contextualDataCard`, applies the existing non-rugby integrity signals, and fails the preserve decision for contaminated drafts. A contaminated retained draft is immediately removed from morning-package eligibility and reported as an eviction. Only integrity-passing retained drafts count toward the five slots; recovery then generates only the newly missing slots from the current corroborated/fresh candidate pool.

This preserves the cost-saving incremental model while preventing a previously accepted but later-proven contaminated draft from being grandfathered into Zoho.

## Acceptance

Production verification must prove:

1. the contaminated Scarlets–Sharks draft is evicted from morning-package eligibility;
2. the other valid 1 September drafts remain preserved;
3. bounded recovery fills only the resulting missing slot(s);
4. five current-package drafts pass exact-package image assignment/readback;
5. Zoho sends only after those exact five pass.

Exact OpenAI dollar cost is not available in GitHub logs; bounded recovery continues to preserve accepted drafts and limits model calls to missing/replacement candidates only.

Resolution date: pending production verification.
