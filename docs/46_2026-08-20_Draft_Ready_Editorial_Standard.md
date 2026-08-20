# 46 — 2026-08-20 Draft Ready Editorial Standard

## Purpose

Convert recurring Publication Risk Review findings into an upstream standard so the owner reviews editorial exceptions rather than repairing predictable mechanical defects article by article.

## Owner-approved baseline

The Connacht controlled draft exposed recurring deterministic warnings: headline >70 characters, standfirst >220, SEO title >60, SEO description >160, paragraph >120 words and repeated filler word usage. The owner confirmed the review recommendations were valid and asked for them to become the standard for every automated article.

## Draft Ready contract

Before an automatically generated article may be written to Sanity as a production-eligible draft:

- headline <=70 characters;
- standfirst <=220 characters;
- SEO title <=60 characters;
- SEO description <=160 characters;
- every body paragraph <=120 words;
- common filler words must not recur as verbal tics;
- tactical projections and causal analysis must not be presented as established fact;
- concrete rugby detail must come from supported evidence; statistics, quotes, targets and historical comparisons must never be invented;
- sentence and paragraph rhythm should vary naturally;
- stacked metaphors, slogan-like fragments, generic clever conclusions and repeated rhetorical contrasts should be avoided.

Deterministic limits are enforced by `lib/editorial/DraftQualityGuard.ts`. Generation receives the same limits up front. If either the originality gate or Draft Ready gate fails, the generator may make a bounded retry using the exact failure diagnostics. Originality thresholds are not weakened.

## Featured image rule

A missing featured image is not automatically repaired with a weak fallback. Existing fail-closed relevance remains authoritative: relevant current photo -> relevant historical/context/venue photo -> relevant approved logo -> no image. A missing relevant image remains an explicit media action for the editor.

## Publication Risk Review role

The AI Publication Risk Review remains the judgement layer for AI-likeness, unsupported claims, speculation presented as fact, rugby voice, awkward terminology, originality and overall editorial value. It should not repeatedly discover basic length/readability defects that can be prevented deterministically.

## Verification required

1. Build/preview must be green.
2. Merge and production deployment must be READY.
3. Re-run the controlled five-story independent AUTO-004 batch once.
4. Confirm all successful Sanity writes pass the deterministic Draft Ready contract.
5. Confirm originality remains fail-closed and image relevance remains fail-closed.
6. Inspect the five stories side-by-side and re-run Publication Risk Review on representative drafts; remaining findings should be editorial judgement, not repeated mechanical limit failures.

## Deployment discipline

The project is on Vercel free plan with a 100-deployments-per-24-hours constraint. This change must use one batched implementation commit, one preview deployment, one merge deployment and one controlled trigger only if verification is required. Do not make file-by-file branch commits.
