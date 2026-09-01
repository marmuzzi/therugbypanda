# P0 — 5/5 recovery, media no-deficit path and source integrity

Date: 1 September 2026
Issues: AUTO-004-P11, MEDIA-011-P3
Priority: P0 / Critical
Status: Implemented; pending merge/deployment/production verification

## Production evidence

Production recovery run `33452840750` proved the incremental recovery contract end to end through article creation:

- 4 successful 1 September drafts were loaded from production Sanity and retained.
- `missingSlots` was exactly 1.
- Only three bounded candidates were attempted for the missing slot.
- One additional candidate succeeded.
- `packageCreationGate` passed with `createdDrafts: 1` and `totalEligible: 5`.
- The five-story package therefore exists in production Sanity without regenerating the four successful drafts.

Zoho was **not** sent. The exact-package media transaction failed closed before delivery.

## Media defect measured

The current-package image planner found:

- `articleCount: 5`
- `articlesMeetingTarget: 5`
- `totalLocalCandidates: 15`
- `totalDeficit: 0`

The workflow nevertheless executed Wikimedia deficit triage. Because there were correctly zero acquisition candidates, the generic acquisition policy interpreted the empty candidate set as a 0% recent-approval rate and failed. This is a workflow-branching defect, not an image-deficit condition.

### Fix

The image-plan step now emits `total_deficit`. Discovery, Wikimedia triage, import, reconciliation and readiness audit execute only when `total_deficit != 0`. The exact-package re-plan, assignment/readback and Zoho boundary remain mandatory regardless. A package that already has sufficient local candidates therefore proceeds directly to exact-package assignment and verification rather than failing an irrelevant acquisition policy.

## Source-integrity defect measured

The fifth generated draft, a Scarlets–Sharks URC article, passed Publication Review but its evidence cluster contained unrelated Manchester United/Ipswich football and ILCA sailing records. Root cause was ambiguous clustering: generic words such as `United`/`Championship` were allowed to create high similarity against very short/generic source titles.

### Fix

The current-source clustering bridge now:

- removes `united`, `championship`, `match`, `live` and `stats` from identity tokens;
- rejects Manchester United/Ipswich and sailing/ILCA as explicit non-rugby material;
- rejects bare `United Rugby Championship` generic source titles as seeds;
- requires at least two meaningful shared title tokens before a non-explicitly-rugby contextual source may corroborate a seed.

No freshness, originality, Publication Review or image-relevance gate is weakened.

## Cost evidence

Run `33452840750` attempted three GPT-5 candidates to fill one missing slot. The successful bounded recovery therefore preserved four existing drafts and paid generation/review cost only for replacement candidates rather than regenerating five articles. Exact dollar cost is not exposed in GitHub/Vercel logs; token usage is available per request in Vercel runtime evidence.

## Acceptance still pending

Do not call the package launch-ready until production proves all of the following after these fixes:

1. five fresh unique production-eligible drafts remain in Sanity;
2. no retained/current evidence cluster includes unrelated non-rugby provenance;
3. exact-package image assignment/readback proves relevant hero + inline coverage for all five with no filler;
4. only after that verification does Zoho send exactly those five;
5. the published-site human approval boundary remains unchanged.

Resolution date: pending production verification.
