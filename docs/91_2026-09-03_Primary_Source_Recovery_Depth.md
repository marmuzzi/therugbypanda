# 3 September 2026 — Primary-source recovery depth P0

## Measured production failure

Serialized recovery run `33709932088` expanded discovery to 175 current leads and built 11 coherent corroborated positions, with 9 surviving the concrete-evidence gate. After four retained IDs and one legitimate 2 September freshness collision, only three fresh replacement positions remained.

All three were correctly rejected by Publication Review for substantive newsroom-quality reasons: missing concrete Brumbies contribution in the James Slipper piece, generic/under-specified Global Series coverage, and insufficient concrete referee/tactical evidence in the Erasmus story. Package creation therefore stopped at 4/5 and Zoho was skipped.

The candidate shortage was not caused by Publication Review being too strict. The source registry had strong Irish, international and competition coverage but no English Premiership club primary feed. Current web verification on 3 September found a fresh example the registry had missed: Exeter Chiefs officially announced Charlie Poynton's 2026/27 signing on 2 September, independently covered by RugbyPass the same evening. That gives the acquisition bridge a named player, named club, concrete signing/development facts and two independent publishers without relaxing the 36-hour freshness window.

## Root cause

The recovery pool was broad in raw lead count but narrow in *distinct, concrete, independently corroborated positions*. The registry's English-club primary-source coverage was missing, while the visual-refill importer attempted at most the missing slot plus two fallback candidates. In the measured one-slot recovery, three weak candidates exhausted that bounded queue even though a stronger current official+editorial story existed outside the registry.

## Repair

1. Add **Exeter Chiefs (`exeterchiefs.co.uk`)** to the versioned source registry as a primary, rumour-rejecting, discovery/evidence-enabled source covering squad news, signings, injuries, Premiership fixtures and European fixtures.
2. Preserve the registry policy requiring independent evidence: an Exeter announcement cannot become a publishable candidate merely because it is official; it still needs cross-domain corroboration.
3. For the two visual-refill generation steps only, raise `MAX_REPLACEMENT_CANDIDATES` from 2 to 3. A one-slot refill can therefore try at most four fresh evidence-sufficient candidates rather than three.
4. Do not change Publication Review, originality, Draft Ready, 36-hour freshness, same-team/matchup diversity, image relevance, human publication, or exact-one Zoho delivery.

This is a bounded source-coverage/candidate-depth repair, not a retry loop and not a manually injected article.

## Required production verification

The change is incomplete until a bounded production recovery proves:

1. the source registry loads Exeter Chiefs successfully and current-source discovery remains healthy;
2. fresh official Exeter evidence can be independently corroborated where another registry publisher reports the same development;
3. visual refill can reach a fourth candidate when the first three are legitimately rejected;
4. exactly five fresh review-ready drafts survive Publication Review, deterministic and package-diversity gates;
5. the first/second bounded visual recovery logic from PR #396 produces five assignment-safe drafts or fails closed;
6. final hero/inline verification passes on all five;
7. exactly one consolidated Zoho editorial package is accepted for those exact five IDs;
8. no article is automatically published and Meta/social remains untouched.

## Delivery state at diagnosis

3 September Zoho delivery: **not sent**. The latest serialized run failed package creation at 4/5 and skipped all downstream delivery steps.