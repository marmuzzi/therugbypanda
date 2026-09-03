# Per-Draft Notification and SEO Warning Contract

Date: 3 September 2026

## Decision

The morning newsroom target remains five fresh production drafts by 08:00 Europe/Dublin. Five is a production target, not an email-delivery prerequisite.

Every newly created production draft that has completed Publication Review and is written to Sanity must trigger its own editorial notification immediately. If fewer than five drafts are ready at 08:00, already-created drafts remain visible to the editor and recovery continues until five new drafts have been produced for the operational day.

QA drafts remain notification-suppressed.

## Exact-once delivery

Draft-created notification event IDs are stable per Sanity article ID (`editorial-draft:<articleId>`). This gives the downstream notification webhook a deterministic idempotency key so a retry or recovery of the same draft does not intentionally create another email.

## SEO description policy

SEO-description length/normalization is advisory. The system should still normalize descriptions to the 160-character target where safe, but an over-limit SEO description is a warning and must not by itself reject an otherwise valid draft.

All substantive editorial, evidence, originality, source-integrity and Publication Review blockers remain fail-closed.

## State distinction

A review-ready draft may be emailed before the overall five-draft daily target is complete. Publication readiness remains separate and continues to require the existing visual/relevance and human publication boundaries.

## Implementation

Branch: `fix/per-draft-notifications-seo-warning`

Changed components:
- `app/api/editorial/draft/route.ts`: package-mode suppression no longer suppresses production draft-created notifications; each production draft triggers notification immediately.
- `lib/editorial/EditorialNotifications.ts`: stable per-article notification event ID.
- `lib/editorial/DraftQualityGuard.ts`: SEO-description length remains reported but is excluded from blocking Draft Ready pass/fail.

## Verification required

This change is not complete until merged, deployed by Vercel, and verified in production with evidence that:
1. a newly generated production draft causes its own Zoho email before the five-draft package is complete;
2. a same-draft retry does not create a duplicate email downstream;
3. an over-limit SEO description is surfaced as a warning but does not reject the draft solely for that condition;
4. same-day recovery continues until five new drafts exist.