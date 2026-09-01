# AUTO-005 — generation time-budget recovery

Date: 1 September 2026
Issue: AUTO-005-P15
Priority: High
Status: Implemented; pending merge/deployment/production verification

## Production evidence

Vercel production runtime logs on 1 September exposed one remaining avoidable recovery failure in `/api/editorial/draft`:

- request `1a3d1dd1-83ed-4d0d-91f1-ccec65908bb9` failed after 120013 ms with `OpenAI generation exceeded the 120-second safety timeout.`
- successful GPT-5 article generations in the same recovery typically completed in roughly 53-60 seconds, followed by Publication Review and Sanity persistence; representative total successful route durations were approximately 135-162 seconds.
- the current route budget is 240 seconds, so the 120-second generation abort could discard a near-complete GPT-5 generation and force a different candidate/recovery cycle even though sufficient route budget remained.

## Root cause

The generation safety budget had not been reconciled with the route's expanded 240-second maximum duration. The 120-second generation cutoff was conservative enough to create a false timeout without improving editorial quality or reducing paid model work.

## Fix

`app/api/editorial/draft/route.ts` raises only the GPT-5 generation safety budget from 120 seconds to 135 seconds.

This is deliberately bounded:

- GPT-5 remains the production generation model;
- target article length is unchanged;
- originality, Draft Ready, Publication Review and Sanity gates are unchanged;
- the generator's shared attempt budget and retry bounds remain unchanged;
- the route maximum duration remains 240 seconds;
- the additional 15 seconds is intended to prevent borderline generation aborts, reducing end-to-end recovery wall-clock and wasted regeneration rather than permitting unbounded waiting.

## Verification boundary

Deployment readiness can be verified immediately after merge. Full production verification requires the next real missing-slot generation to complete through GPT-5 generation, Publication Review and Sanity without reproducing the 120-second false-timeout failure. Do not manufacture an unnecessary paid article solely to test this change.

Resolution date: pending production verification.
