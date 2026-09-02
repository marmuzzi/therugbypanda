# 2 September 2026 — Launch-night visual and brand verification

## Scope

This note records measured production evidence for the owner-reported launch defects around Editorial Review package isolation, wrong-team photography, inline-image depth and missing team/competition branding. Social provider integration is deliberately outside this evidence note.

## Editorial Review current-package boundary — PR #352

PR #352 (`e12dd4c23ae80d3afe6b9930c06aeed50a39a7f2`) changed the custom Sanity Editorial Review queue to default to the exact current Europe/Dublin package rather than the historical draft pool. Current-package identity requires `morningPackageEligible == true`, `automationContentClass == "production"` and a current-date `editorialInputId`.

Sanity Studio deployment workflow run `33556586157` completed successfully. Authenticated owner desktop verification then showed **Today's package (5)**, the exact five 1 September accepted drafts, and a current-package article selected in the editor instead of the older Joey Carbery draft. Historical drafts remain available under separate filters. This closes the exact-package selection defect; the broader phone interaction issue remains tracked separately by WEB-013.

## Exact-five visual repair — PRs #353-#355 and #358

The first two repair attempts exposed overly strict metadata assumptions and failed closed rather than mutating the package incorrectly. PR #355 added embedded production hero provenance support. PR #358 hardened primary-team and explicit-person context and made the same constraints reusable for future package selection.

Production GitHub Actions run `33568855778` on merge commit `921d8b6c04305f8bb8aaa68d5771011b464ce68e` completed successfully with `status: verified` and `articleCount: 5`. No GPT generation and no Zoho resend were involved.

Measured production assignments after repair:

| Article | Hero | Inline images |
| --- | --- | ---: |
| WXV / England women | 2025 Women's Rugby World Cup — Canada v England | 2 |
| Ryan Caldwell / Irish rugby | Italy v Ireland, Six Nations 2025 | 2 |
| Erasmus / Springboks v All Blacks | 2024 Autumn Nations — All Blacks | 2 |
| Frankie Sheahan / Munster | Munster crowd at Thomond Park | 2 |
| Kolbe / All Blacks selection | 2024 Autumn Nations — All Blacks | 1 |

The misleading France-v-South-Africa hero previously visible on the Erasmus/South Africa article is no longer assigned. The repaired story now uses All Blacks-context imagery, which is directly relevant to the South Africa/New Zealand matchup and contains no conflicting France context. The repair remains relevance-first: the Kolbe article keeps one meaningful inline image rather than forcing a second filler image.

The production repair artifact is `current-package-visual-repair`, GitHub artifact ID `9824174064`.

## Production web deployment — PR #358

PR #358 is merged and Vercel production deployment `dpl_9TV5ck9V7EGHJPyV3QizAVFtKFYt` is READY. It contains:

- explicit person-aware and primary-team image conflict rejection;
- future-package image-context hardening;
- approved local Brand Asset resolution;
- article brand-mark rendering;
- aliases including Springboks/South Africa and All Blacks/New Zealand;
- corrected brand-image source typing.

Code deployment is verified. Public rendering of a relevant brand mark remains a separate human-publication-dependent verification boundary because the exact five are still drafts and must not be auto-published to manufacture evidence.

## Brand Asset localization — PR #357

PR #357 (`e51a7b7d88638990fd976caab5d9d8d3b0d1bb11`) allows an already reviewed/approved official brand candidate to be localized when an organisation serves that asset through its normal official CDN. It does not relax the approval or local-storage boundary and does not permit public hotlinking.

Production workflow run `33565257032` completed successfully:

- approved Brand Assets: 24;
- locally stored after the run: 17;
- localized by this run: 5;
- failed localizations: 0;
- manual source resolution still required: 7.

Newly localized assets were Leinster Rugby, Munster Rugby, European Rugby Champions Cup, EPCR Challenge Cup and European Professional Club Rugby. South Africa/Springboks and New Zealand/All Blacks are not in the remaining missing-local set and have approved local assets available to the resolver.

The seven approved records still lacking a defensible local full-size source are Connacht Rugby, Fiji Rugby Union, Japan Rugby Football Union, Men's Rugby World Cup 2027, Rugby Australia, Rugby World Cup and World Rugby. Connacht's only currently recorded official-domain candidate is a favicon explicitly marked as unsuitable for public logo use, so the rights/source gate correctly remains fail closed. The UI must use its text fallback rather than a questionable mark until a proper source is reviewed.

## Completion boundary

Closed by this evidence:

- current-package Editorial Review isolation on authenticated desktop;
- the owner-reported wrong France/South Africa image association in the 1 September exact five;
- exact-five production hero/readback and meaningful inline depth for the repaired package.

Still open:

- long-term future-package MEDIA-009 proof on subsequent normal days;
- full Brand Asset coverage, especially Connacht and the six other manual-source records;
- authenticated owner-phone Editorial Review interaction;
- representative public article/homepage rendering after human publication;
- the 2 September normal scheduled morning package and before-08:00 Zoho delivery proof.
