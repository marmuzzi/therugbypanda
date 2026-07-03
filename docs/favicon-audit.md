# Favicon Audit

Date: 3 July 2026

## Findings

- Chrome can request `/favicon.ico` directly even when metadata advertises another icon URL.
- The repository had an `app/favicon.ico` binary file, so Next could serve that conventional icon independently of the metadata changes.
- The generated `app/icon.tsx` and `app/apple-icon.tsx` RP placeholder routes were removed in the previous favicon pass.
- A temporary RP SVG favicon asset was removed because it did not match the approved panda logo.

## Current fix

- Root metadata now advertises `/favicon.ico?v=7` first and the approved `/rugby-panda-logo.png?v=7` logo asset second.
- `app/favicon.ico` has been removed.
- `app/favicon.ico/route.ts` redirects `/favicon.ico` requests to `/rugby-panda-logo.png?v=7`.
- The live validation workflow checks both `/favicon.ico?v=7` and `/rugby-panda-logo.png?v=7`.

## Verification

After Vercel deploys this change, run **Validate Live Site** from GitHub Actions. Then open Chrome Incognito and visit `https://therugbypanda.ie/?favicon=7`.
