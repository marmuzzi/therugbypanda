# PR description source

Fixes the exact 27-Aug owner-observed Sanity dark-mode readability regression. Root cause was a forced-white formatted preview inheriting dark-theme light foreground for normal Portable Text. The patch explicitly establishes a high-contrast light proofing surface and makes surrounding helper surfaces theme-aware. No editorial/publishing behavior changes. Requires production deployment and same-phone verification.
