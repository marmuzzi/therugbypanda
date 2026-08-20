# 20 August 2026 — Editorial style and safety verification

## Purpose

Record the production verification work performed after PR #188 and the issues exposed by the controlled five-story AUTO-004 batch. This document is a handoff/source-of-truth supplement for the next session.

## Go-live dates remain unchanged

- Core readiness target: 26 August 2026.
- Meaningful go-live target: 27 August 2026.

## PR #188

PR #188, `Editorial: diversify article voice, layout and media launch rules`, was verified green in Vercel preview and merged to `main` as commit `a1ae569bad4f4e4a279dcb947b3f4cd9e5f594f5`.

The exact production deployment reached READY, received the `therugbypanda.ie` / `www.therugbypanda.ie` aliases without error, and the production homepage returned HTTP 200.

The change introduced five deterministic generation style profiles and three deterministic article-page presentation variants, removed the forced minimum three-section structure, locked the 26/27 August readiness/go-live dates, set the 200 approved-media launch floor and 500 strong operating target, and tightened precision acquisition limits.

## Controlled five-story AUTO-004 verification

The existing independent-source batch remained the verification input:

`data/editorial-acquisition/auto004-2026-08-18-independent.json`

The existing importer and production editorial API were reused. AUTO-001 was not restarted or rebuilt.

### First run after #188

The first Munster article regenerated successfully under the `news-desk` style profile and passed the originality gate. It showed a materially less templated structure than the earlier output: fewer headings, a direct lead and a more natural section count.

The second article, Connacht, selected the `feature` style profile but exceeded the old hard-coded 90-second OpenAI safety timeout. Because the importer is fail-fast, the remaining three stories were not regenerated.

### PR #190 — timeout alignment

PR #190, `AUTO-004: align generation timeout with route budget`, increased the editorial-generation safety timeout from 90 seconds to 110 seconds while keeping the route's existing 120-second maximum duration. It was preview-verified, merged as `836563e7050662a21fbe36c2623dcc66abcb2ea5`, deployed and reached production READY.

### Originality guard production proof

A subsequent controlled run generated a Munster draft that crossed the deterministic originality thresholds. The gate rejected it before the Sanity writer:

- 13 consecutive normalized words shared with `munster-preseason-squad-2026`.
- 28.6% six-word phrase coverage.

The API returned an error and Sanity retained the prior draft revision. This is direct production evidence that the originality gate is fail-closed before CMS write.

### Image relevance production failure

The prior successful Munster draft had automatically received `editorialImage-original-1000090450`, titled `Sevilla veterans rugby portrait`, with a grassroots Sevilla caption. It has no Munster or La Rochelle subject relationship.

Root cause: the automatic relevance score allowed generic rugby vocabulary and article-use metadata to contribute enough points to clear the minimum threshold. A generic rugby photo could therefore be selected even when it did not mention the article's actual province or subject.

This does not meet the launch rule. For province-specific stories, an automatic image must contain positive evidence of the same province; otherwise the system must return no image.

### PR #192 — bounded originality retry and strict subject evidence

PR #192, `Editorial: retry originality failures and tighten image relevance`, was preview-verified and merged as `3540757e305d71c9889f4fec1350d1147c6f6d05`. The production deployment reached READY with the production aliases attached.

It made two contained changes:

1. The deterministic originality thresholds remain unchanged and fail-closed. A first originality rejection may trigger one bounded fresh recomposition attempt using the rejection reasons; a second rejection still fails the request before Sanity write.
2. Automatic image selection now requires positive subject evidence. Province stories require the same province to appear in image metadata, Ireland stories require Ireland, and generic rugby/layout terms no longer earn relevance points. No qualifying approved image means no image.

Production verification then proved the bounded retry also remains fail-closed: Munster attempt 1 failed at 13 shared words / 28.6% six-gram coverage, a second recomposition ran, and attempt 2 still failed at 13 shared words / 32.1% coverage. The request failed and did not overwrite the Sanity draft.

## Remaining AUTO-004 blocker

The controlled Munster evidence pack contains one unusually short primary-source excerpt (`munster-preseason-squad-2026`) with a dense list of new signings and academy promotions. Even a genuinely recomposed article can reproduce enough unavoidable names/facts to cross the current six-gram-coverage rule.

The originality threshold must not be weakened simply to make the test pass. The next corrective action should improve the source material used for originality comparison (for example, richer independent/body-text evidence or explicitly separating unavoidable factual/name lists from prose-overlap detection), while preserving a deterministic fail-closed plagiarism safeguard.

Until that is resolved, the complete five-article side-by-side production verification remains **not complete**.

## Style-distribution observation

The current generation profile hash for the five stable AUTO-004 IDs maps to:

- Munster: `news-desk`
- Connacht: `feature`
- Ulster: `match-notebook`
- Leinster: `feature`
- Ireland Women: `feature`

This is deterministic but not sufficiently balanced for a guaranteed five-story daily package: three of five land on `feature`. Before closing the style-diversity requirement, package-level profile allocation should prevent excessive duplication while retaining deterministic/reproducible behaviour.

The public article page currently has three deterministic slug-based layout variants. These vary content width, image height/frame and Key Points placement, but are independent of the five generation style profiles.

## Media baseline and precision sample

Sanity production baseline measured on 20 August 2026:

- 278 Editorial Image documents total.
- 22 Editorial Images currently `usageApproved == true`, lifecycle `approved/published`, with local Sanity image assets.
- 35 Brand Asset records total.
- 24 Brand Asset records are marked approved for editorial use, but 0 currently have a local `logo.asset` reference; 22 still rely on external candidate URLs. These must not be counted as launch-ready local logo assets until properly imported/governed.

A deliberately small Openverse/Apify precision sample was run, capped at three requested results per query:

1. `Munster Rugby La Rochelle` — 0 candidates.
2. `Connacht Rugby Will Connors` — 0 candidates.
3. `Ulster Rugby Jamie Benson` — 0 candidates.
4. `Leinster Rugby South Africa` — 1 candidate, but it was a completely unrelated Lord Killanin/Howth Village photograph matched through loose metadata/tags.

Measured useful yield: **0 useful assets from 1 returned candidate; 0 useful assets from a maximum requested 12**.

Conclusion: do **not** scale this Openverse query pattern. The sample is below the 60% useful-yield continuation threshold and demonstrates that exact named-subject Openverse search has either zero recall or false-positive metadata matches for these current stories. Future acquisition should change source strategy/query design before additional Apify spend.

## Current lifecycle state

- PR #188: implemented, committed, merged, deployed, production-verified for build/reachability.
- PR #190: implemented, committed, merged, deployed, production-verified for the 110-second timeout being active in runtime.
- PR #192: implemented, committed, merged, deployed; production-verified that the bounded retry runs and still fails closed after a second originality failure. Image subject-evidence logic is deployed but still requires a successful story write/no-image production example to close representative verification.
- PRs #189, #191 and #193: controlled trigger-only changes merged; their purpose was verification, not new product functionality.
- Complete five-article style comparison: pending because the first story currently fails the originality gate and the sequential importer stops.
- AUTO-001: unchanged and remains production verified.
- Precision media expansion: paused after measured 0 useful yield from the small sample.

## Recommended next step

Do not run another broad image scrape and do not weaken originality thresholds. First make the five-story verification batch compatible with the originality contract by improving the protected source material/overlap model for unavoidable factual lists, then rerun all five. In the same pass, introduce package-level style-profile balancing so a five-story morning package cannot deterministically cluster three stories into the same feature style. Once all five pass and unrelated images demonstrably resolve to no image, resume media acquisition using a different high-precision source strategy and another very small measured sample.
