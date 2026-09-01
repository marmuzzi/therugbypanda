# WEB-014 — public metadata title composition

Date: 1 September 2026
Issue: WEB-014
Priority: High
Status: Closed
Resolution date: 1 September 2026

## Production defect

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

No editorial generation, freshness, Publication Review, image, Sanity, Zoho or human-publication behavior changed.

## Merge and deployment

- PR: #348
- Merge commit: `8e08883263da02a9d4ca8d9793a0bde0e9d815b5`
- Production Vercel deployment: `dpl_BrrCqVwY45MoF1ixD2jX3YV6Phop`
- Deployment state: READY

## Production verification

All WEB-014 closure checks passed on the production domain after deployment:

1. Published introduction article returned HTTP 200 with browser title exactly `Welcome to The Rugby Panda | The Rugby Panda`.
2. Its OpenGraph and Twitter titles were exactly `Welcome to The Rugby Panda | The Rugby Panda`.
3. `/categories/urc` returned HTTP 200 with browser title exactly `URC rugby news | The Rugby Panda`.
4. Its OpenGraph and Twitter titles were exactly `URC rugby news | The Rugby Panda`.
5. Production error/fatal runtime-log query scoped to `dpl_BrrCqVwY45MoF1ixD2jX3YV6Phop` returned no logs for the verification window.

WEB-014 is therefore implemented, committed, merged, deployed and production verified.
