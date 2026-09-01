# AUTO-003 — Zoho exact current-package handoff

Date: 1 September 2026
Issue: AUTO-003-P14
Priority: Critical
Status: Implemented on `fix/zoho-exact-package-handoff`; pending PR/merge/deployment/production verification

## Production evidence

Production recovery run `33505534217` proved the upstream recovery path through the final exact-five image gate:

- 24 current sources succeeded, 0 failed, producing 101 current leads on attempt 1 and 102 on verification attempt 2;
- 23 corroborated candidates were built and 19 survived the pre-generation evidence-sufficiency gate;
- the same-package diversity gate removed excess South Africa/New Zealand concentration during recovery and later retained the resulting five without regeneration;
- the Dundalk/Tommy Campbell article remained image-unfulfillable after targeted acquisition and was correctly evicted through the bounded visual-substitution path;
- one replacement slot was generated from the remaining fresh evidence pool;
- 21 new rights-triaged local Sanity images were imported with zero import failures, raising the strict publication-ready local baseline from 241 to 262;
- the resulting exact five all met the three-candidate image-plan target and passed production visual enrichment/readback.

The first Zoho POST failed closed with HTTP 409 despite five eligible drafts:

`eligibleCandidateCount: 5`, `articleCount: 1`, `reason: insufficient-current-package-content`.

PR #343 removed one false-collision source: local labels such as `source-1` and `source-2` were no longer treated as global source IDs. After #343 was merged and deployed, production attempt 2 retained all five, created zero drafts, passed the 15-candidate image plan and exact-five visual enrichment, but Zoho still failed closed:

`eligibleCandidateCount: 5`, `articleCount: 4`, `reason: insufficient-current-package-content`.

No stale or partial editorial package was sent in either failure.

## Final root cause

`app/api/editorial/daily-package/route.ts` was independently re-selecting a "diverse" subset after the current package had already passed the authoritative upstream freshness, evidence, package-diversity, Publication Review and image gates.

The first implementation also used per-article source labels as global identities. PR #343 corrected that identifier bug, but production then demonstrated the deeper contract conflict: two legitimately distinct package articles may share a canonical corroborating source URL. A delivery-time rule that rejects any shared source therefore cannot faithfully hand off the already-approved exact package.

The email endpoint must validate package identity and cardinality, not rerun a competing editorial selector.

## Exact-package fix

The daily-package endpoint now:

- queries only current Europe/Dublin `editorialInputId` drafts with `morningPackageEligible=true` and `automationContentClass=production`;
- requires **exactly five** eligible drafts — neither fewer nor more;
- requires five unique article IDs and five unique current editorial input IDs;
- requires all five to have a verified hero-image boundary before delivery;
- sends those exact five rather than deriving a second subset;
- records those exact article IDs and editorial input IDs in the idempotent Sanity delivery lock;
- preserves direct Zoho SMTP and the existing package fingerprint/duplicate protection.

Editorial diversity remains fail-closed upstream in `enforce-current-package-diversity.mjs`; generation can only make a production-eligible draft after the bounded Publication Review cycle and deterministic Draft Ready/originality gates complete. The workflow still performs exact-package image planning and production Sanity visual readback before calling Zoho.

No generation, Publication Review, freshness, image, originality or human-publication gate is weakened.

## Production acceptance

After merge and production deployment, rerun the bounded recovery workflow. Acceptance requires:

1. all five existing valid current-package drafts remain retained unless another current integrity gate rejects one;
2. no unnecessary whole-package GPT regeneration;
3. exact-five image enrichment/readback still passes;
4. the daily-package endpoint sees exactly five unique current eligible image-ready drafts;
5. Zoho SMTP accepts exactly one consolidated email containing those exact five editorial input IDs;
6. a subsequent recovery trigger observes the accepted package evidence and does not send another email.

Resolution date: pending production verification.
