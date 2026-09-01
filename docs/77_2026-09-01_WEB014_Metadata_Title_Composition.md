# WEB-014 — public metadata title composition

Date: 1 September 2026
Issue: WEB-014
Priority: High
Status: Implemented in PR #348; pending merge/deployment/production verification

## Production evidence

A direct production fetch of `https://therugbypanda.ie/articles/welcome-to-the-rugby-panda` returned HTTP 200 but exposed a duplicated browser title:

`Welcome to The Rugby Panda | The Rugby Panda | The Rugby Panda`

The article's OpenGraph/Twitter title was separately rendered as `Welcome to The Rugby Panda | The Rugby Panda`.

## Root cause

`app/layout.tsx` already defines the global Next.js title template `%s | The Rugby Panda`. Dynamic article and category metadata also supplied leaf `title` values that were already suffixed with `| The Rugby Panda`, so Next applied the global template a second time to the browser document title.

## Fix

PR #348 keeps the global title template as the single browser-title branding boundary:

- article leaf title is now the article title only;
- category leaf title is now `<category> rugby news` only;
- not-found leaf titles are unbranded and inherit the global template once;
- OpenGraph/Twitter titles remain explicitly branded once because they are independent metadata fields.

No editorial generation, freshness, Publication Review, image, Sanity, Zoho or human-publication behavior is changed.

## Verification boundary

Before closing WEB-014:

1. PR #348 must merge and deploy to production;
2. the published introduction article must return a browser `<title>` with exactly one `| The Rugby Panda` suffix;
3. a category route must do the same;
4. OpenGraph/Twitter titles must retain exactly one brand suffix;
5. production runtime must remain error-free for the changed routes.

Resolution date: pending production verification.
