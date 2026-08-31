# P0 — Stable editorial candidate identity

Date: 31 August 2026
Issue: AUTO-004-P7
Priority: P0 / Critical
Status: In progress pending production verification

## Production root cause

During recovery run `33443459968`, the expanded corroboration pool correctly exposed more fresh positions, but candidate IDs were still assigned from the candidate's ordinal list position (`current-YYYY-MM-DD-5`, etc.). Because the list changes between discovery runs, a different story reused an ID already held by a retained same-day Sanity draft. The draft writer uses the input ID in its document ID, so a valid retained draft could be overwritten even though incremental recovery intended to preserve it.

This is an identity-contract defect, not a freshness defect.

## Fix

- Candidate IDs are now derived from a SHA-256 fingerprint of normalized subject + development and date, not list order.
- Reordering or expanding the candidate pool no longer changes the ID of a story solely because its position changed.
- The importer independently reserves every retained same-day `editorialInputId` and refuses to generate any candidate that collides with one, even if malformed/legacy upstream data reuses that ID.
- Collision evidence is logged explicitly.
- Existing rugby relevance, evidence sufficiency, freshness, originality, Draft Ready, Publication Review and five-before-Zoho gates remain unchanged.

## Related work

- PR #327 — incremental same-day recovery.
- PR #328 — independent-seed corroboration candidate pool.
- PR #329 — stable candidate identity and retained-ID collision guard.

## Deployment / verification

Implemented and committed on the P0 branch. Production verification requires a new recovery execution proving retained IDs are untouched while missing slots use fingerprinted IDs, followed by exact-five Sanity validation before Zoho delivery.

Resolution date: pending production verification.
