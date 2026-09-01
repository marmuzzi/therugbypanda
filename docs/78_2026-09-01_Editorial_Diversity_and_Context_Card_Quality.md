# 1 September 2026 — Editorial diversity and contextual-card quality

## Scope

This evidence note records the owner-driven editorial-quality follow-up after the exact-five 1 September production package.

## Contextual cards — PR #350

Owner review identified that contextual cards could look synthetic even when article prose and imagery were acceptable. The specific failure mode was repeated generated labels such as `Key fact 2` and `Next up 2`, plus near-duplicate displayed values.

PR #350 changed the contextual-card builder to prefer fewer distinct editorial facts rather than manufactured numbered rows. Duplicate displayed values are suppressed. The change was merged as `665b2d09f3ef4ede12d593eb18e85ba020695973` and Vercel production deployment `dpl_DgHod6yoA2sUzEAFBu1ujPYcPmuH` is READY.

This does not retroactively rewrite the already-delivered 1 September package and does not cause a second Zoho send. It applies to future card enrichment.

## Package team concentration — PR #351

The existing package-diversity gate already capped any canonical two-team matchup at two positions. Review of the earlier recovery set showed a remaining structural gap: a package could still contain more than two positions focused on the same team if those stories did not resolve to the same matchup pair.

PR #351 extends `scripts/enforce-current-package-diversity.mjs` with an independent same-team concentration boundary:

- maximum two positions for the same recognised team in a five-story package by default;
- primary editorial text is used for team concentration so incidental source-context references do not create false team matches;
- the existing same-matchup maximum of two remains unchanged;
- retained same-day drafts over either cap are evicted individually;
- replacement candidates over either cap are rejected before model generation;
- unaffected valid drafts remain retained;
- the gate still fails closed if fewer candidates remain than missing slots.

The accepted 1 September exact five remains compatible with the new rule: the South Africa/New Zealand positions number two, while WXV/England, Ryan Caldwell/Irish rugby and Frankie Sheahan/Munster provide broader package coverage.

## Safety boundaries unchanged

No GPT model, Draft Ready, originality, Publication Review, image relevance, exact-five cardinality, Zoho delivery or human Sanity publication gate is weakened. The 1 September accepted package is not regenerated or resent solely to exercise this change.

## Verification boundary

PR #351 is code-review/build verifiable immediately. Behavioural production verification requires the next genuine package acquisition/recovery run with current candidates; no paid GPT generation should be manufactured solely for this test. The evidence should include both `matchupCounts` and `teamCounts` from the package-diversity step.
