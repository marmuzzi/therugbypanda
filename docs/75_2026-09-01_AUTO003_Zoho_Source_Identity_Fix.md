# AUTO-003 — Zoho current-package source identity defect

Date: 1 September 2026
Issue: AUTO-003-P14
Priority: Critical
Status: Implemented on `fix/zoho-package-source-identity`; pending PR/merge/deployment/production verification

## Production evidence

Production recovery run `33505534217` proved the upstream recovery path through the final exact-five image gate:

- 24 current sources succeeded, 0 failed, producing 101 current leads;
- 23 corroborated candidates were built and 19 survived the pre-generation evidence-sufficiency gate;
- the same-package diversity gate retained three drafts, evicted two excess South Africa/New Zealand positions and generated only the two missing slots;
- the Dundalk/Tommy Campbell article remained image-unfulfillable after targeted acquisition and was correctly evicted through the bounded visual-substitution path;
- one replacement slot was generated from the remaining fresh evidence pool;
- 21 new rights-triaged local Sanity images were imported with zero import failures, raising the strict publication-ready local baseline from 241 to 262;
- the final exact five all met the three-candidate image-plan target and passed production visual enrichment/readback.

The final Zoho POST then failed closed with HTTP 409:

`eligibleCandidateCount: 5`, `articleCount: 1`, `reason: insufficient-current-package-content`.

No stale or partial editorial package was sent.

## Root cause

`app/api/editorial/daily-package/route.ts` performed an additional delivery-time diversity check. Its source-overlap identity included `sourceRecords[].id` values such as `source-1` and `source-2`.

Those IDs are local labels inside each article, not globally stable source identities. Unrelated articles therefore appeared to share a source whenever both used the same local label. With the five valid current-date candidates, this false collision reduced the delivery selection to one article.

## Fix

The daily-package source-overlap check now compares canonical source URLs only. Local per-article source labels are deliberately ignored for cross-article identity.

This preserves the existing safeguards:

- current Dublin operational-date `editorialInputId` binding;
- `morningPackageEligible == true` and production content class;
- token-similarity diversity check;
- exact five required or fail closed;
- package fingerprint/idempotent Sanity delivery lock;
- direct Zoho SMTP only after package eligibility succeeds.

No generation, Publication Review, image or human-publication gate is weakened.

## Production acceptance

After merge and production deployment, rerun the bounded recovery workflow. Acceptance requires:

1. all five existing valid current-package drafts remain retained unless another current integrity gate rejects one;
2. no unnecessary whole-package GPT regeneration;
3. exact-five image enrichment/readback still passes;
4. the daily-package endpoint returns five selected articles from the five current eligible candidates;
5. Zoho SMTP accepts exactly one consolidated email containing those exact five editorial input IDs;
6. a duplicate trigger returns the existing idempotent `already-sent` result rather than sending a second email.

Resolution date: pending production verification.
