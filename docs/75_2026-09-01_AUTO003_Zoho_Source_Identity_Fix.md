# AUTO-003 — Zoho exact current-package handoff

Date: 1 September 2026
Issue: AUTO-003-P14
Priority: Critical
Status: Closed — implemented, merged in #344, deployed and production verified

## Production evidence

Production recovery run `33505534217` proved the upstream recovery path through the final exact-five image gate:

- 24 current sources succeeded, 0 failed, producing 101 current leads on the initial attempt and 102 on the final acceptance run;
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

PR #344 changed the daily-package endpoint so it:

- queries only current Europe/Dublin `editorialInputId` drafts with `morningPackageEligible=true` and `automationContentClass=production`;
- requires **exactly five** eligible drafts — neither fewer nor more;
- requires five unique article IDs and five unique current editorial input IDs;
- requires all five to have a verified hero-image boundary before delivery;
- sends those exact five rather than deriving a second subset;
- records those exact article IDs and editorial input IDs in the idempotent Sanity delivery lock;
- preserves direct Zoho SMTP and the existing package fingerprint/duplicate protection.

Editorial diversity remains fail-closed upstream in `enforce-current-package-diversity.mjs`; generation can only make a production-eligible draft after the bounded Publication Review cycle and deterministic Draft Ready/originality gates complete. The workflow performs exact-package image planning and production Sanity visual readback before calling Zoho.

No generation, Publication Review, freshness, image, originality or human-publication gate was weakened.

## Production acceptance — passed

After #344 deployed to Vercel production READY, the bounded recovery was rerun:

1. all five current valid drafts were retained;
2. `createdDrafts: 0`, so the acceptance rerun made no GPT generation calls;
3. exact-five image planning returned 15 strong local candidates, five articles meeting target and zero deficit;
4. exact-five Sanity visual enrichment/readback returned `current-package-enriched-and-verified` with articleCount 5;
5. the daily-package endpoint returned `status: sent`, articleCount 5 and eligibleCandidateCount 5;
6. event `editorial-daily-package:2026-09-01:fede43938366` recorded the exact five article IDs and editorial input IDs;
7. Zoho accepted `editor@therugbypanda.ie` with SMTP response `250 Message received` and evidenceStatus `recorded`;
8. an immediate rerun found `acceptedEvidenceCount: 1`, `skip: true` and skipped discovery, generation, image processing and Zoho delivery, proving no duplicate resend.

Exact delivered editorial input IDs:

- `current-2026-09-01-cb1f46c78399`
- `current-2026-09-01-ac8539699e76`
- `current-2026-09-01-7545042164a1`
- `current-2026-09-01-1df6f8baaaf3`
- `current-2026-09-01-930d0d48bc05`

Resolution date: 2026-09-01.
