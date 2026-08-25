# 25 August 2026 — Mobile Editorial Email Readability Fix

## Problem

Owner review of the first verified consolidated five-article Zoho package found the message difficult to read on a phone using a dark background. The sender was plain-text only, leaving presentation entirely to the mail client.

## Change

The direct Zoho SMTP sender now supports multipart/alternative email with both a plain-text fallback and an HTML version. The consolidated morning package supplies a mobile-first, high-contrast HTML layout with explicit light color-scheme metadata, white content cards, dark text and high-contrast Sanity review buttons. The text fallback remains unchanged for clients that do not render HTML.

## Safety

- The exactly-once package delivery lock is unchanged.
- Destination remains `editor@therugbypanda.ie`.
- No article generation or OpenAI call is added.
- No quality/originality/image gate is weakened.
- SMTP transport remains direct Zoho EU SMTP over implicit TLS.

## Verification boundary

Implementation is complete on the branch. Preview/build verification and production deployment are required before this can be considered merged/deployed. Final mail-client verification requires observing the next real consolidated package (or another explicitly authorized non-duplicate test message); the already-sent 25 August package must not be re-sent merely to test styling.
