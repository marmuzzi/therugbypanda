# 3 September 2026 — Headline fragment Draft Ready gate

## Measured production issue

Recovery run `33708999666` persisted `current-2026-09-03-62317c12fbc0` with the headline:

`Kieran Read wades into Suaalii-to-All Blacks debate — here’s why it`

The stored headline is within the 70-character Draft Ready limit but is visibly truncated and not independently readable. It was immediately failed closed in Sanity by setting only `morningPackageEligible=false`; it was not published and Zoho delivery was not reached.

## Root cause

`OpenAIArticleGenerator.applyDeterministicPresentationRepair()` shortens over-limit headlines at a word boundary before the final Draft Ready assessment. That mechanical repair can create a dangling final connector/pronoun even though the resulting string now satisfies the character limit. The existing Draft Quality Guard checked headline length but did not detect this fragment shape, and Publication Review did not block it.

## Repair

`lib/editorial/DraftQualityGuard.ts` adds deterministic `headline-fragment` validation. A headline ending with a dangling connector/pronoun such as `and`, `for`, `from`, `in`, `it`, `of`, `the`, `to`, `what`, `why` or `with` fails Draft Ready even when it is under 70 characters.

Because `headline-fragment` is deliberately not classified as a metadata-only length failure, the generator must perform its existing bounded full Draft Ready retry rather than accepting another mechanical truncation. No headline-length limit, Publication Review rule, originality gate, freshness gate, diversity gate, image gate, human publication boundary or Zoho exact-one rule is weakened.

## Required production verification

1. the measured truncated Suaalii headline cannot pass Draft Ready unchanged;
2. a fresh or bounded replacement persists with a complete independently readable headline;
3. exactly five current drafts pass the existing editorial/diversity/image gates;
4. exactly one consolidated Zoho package is accepted for those exact five IDs;
5. no article is automatically published and Meta/social remains untouched.

## Delivery state

3 September Zoho delivery remains **not sent**. Run `33708999666` failed at package creation and skipped all image/delivery steps.