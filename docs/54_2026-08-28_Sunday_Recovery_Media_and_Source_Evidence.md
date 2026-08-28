# 28 August 2026 — Sunday Recovery Media and Source Evidence

## Purpose

Measured launch-recovery evidence after PRs #289-#291. This document supersedes the older 212-image baseline where the figures below are more recent.

## Source and owner-request foundation — PR #289

- SOURCE-001 foundation merged: versioned editorial source registry with authority tier, owner priority, specialisms, coverage and discovery/evidence policy.
- Primary sources include IRFU/Ireland Rugby, Leinster Rugby, Munster Rugby, Ulster Rugby, Connacht Rugby, RFU, URC, EPCR and Six Nations.
- Irish editorial sources include The42, Irish Times, Irish Independent, Irish Examiner, Business Post, RTÉ, BBC Northern Ireland, TG4, Virgin Media, RugbyPass, Planet Rugby and Off The Ball.
- EDIT-006 foundation merged: Sanity `articleRequest` document for owner-requested additional articles.
- These are foundations only: autonomous morning acquisition still needs to consume the registry dynamically; the article-request worker is not yet end-to-end production verified.

## Current-five media acquisition — PRs #290 and #291

PR #290 changed the launch-gap workflow from discovery-only into discover → strict triage → local Sanity import → metadata reconciliation → publication-readiness audit. PR #291 fixed the first fail-closed run by capping older contextual approvals before import rather than weakening the >=50% recent approval policy.

Production workflow run 33169575155 completed successfully from merge SHA `d6b3a5955a742667ddbd1187991a1b3e5ea58361`.

### Strict triage

- 155 discovered candidates.
- 46 approved, 109 rejected.
- Approved coverage: Connacht 8, Munster 34, Leinster 4.
- Recent approval rate: exactly 50%.
- Owner-review rate: 0%.
- Maximum single-scope share: 73.9%, below configured 80% ceiling.
- All configured policy checks passed.

### Local Sanity import

- 46 approved inputs.
- 28 newly imported local Sanity assets.
- 18 skipped because already present.
- 0 failed imports.
- Import coverage: Munster 22, Connacht 2, Leinster 4.

### Publication-readiness reconciliation and audit

- 23 records patched during metadata reconciliation; 218 unchanged; 0 unresolved.
- **241 strict publication-ready local Sanity Editorial Images** after the run.
- 490 total audited records.
- 249 need attention.
- 266 approved or published.
- 25 approved but not publication-ready.
- 0 duplicate asset groups.
- 2 duplicate source groups remain for follow-up; they do not represent duplicate local asset groups.

This replaces the previous 212 strict-local publication-ready baseline with a measured **241** baseline. The increase is +29 publication-ready assets relative to the documented 212 baseline; 28 were newly imported in this run and the remainder reflects readiness reconciliation.

## Current verification boundary

MEDIA-007 remains closed and the library is now materially deeper at 241 strict publication-ready local assets. MEDIA-009 remains open until the current five drafts are re-enriched/read back and exact hero/inline assignments are measured. MEDIA-011 remains open until article-triggered acquisition automatically ensures >=3 strong relevant candidates where possible.

AUTO-004 freshness remains P0. Static scheduled replay was removed, and a fresh 5/5 recovery exists, but closure still requires consecutive normal scheduled packages with deterministic rejection of duplicate subject + development/event + editorial angle before model generation.

No editorial gate, human Sanity publication boundary, image relevance rule or rights rule was weakened in this recovery.
