# Newsroom Brand and Analytics Foundation

## Status

Implemented in code on `feat/newsroom-foundation`; deployment and production verification remain pending.

## Brand identity

Public brand:

- Name: **The Rugby Panda**
- Tagline: **The game. The people. The stories.**
- Positioning: independent digital rugby newsroom covering the game from Ireland to the international stage.

The editorial scope includes Irish provincial and national rugby, URC, EPCR competitions, Six Nations, the Nations Championship, Rugby World Cup and selected international rugby coverage.

## Analytics objective

Analytics must create truthful, durable evidence for:

- editorial decision-making;
- audience growth;
- sponsorship and advertising discussions;
- media accreditation applications.

Reported figures must come from named platforms and defined date ranges. Estimates must never be presented as measured traffic.

## Implemented foundation

The public application now includes:

- consent-aware Google Tag Manager loading through `NEXT_PUBLIC_GTM_ID`;
- direct GA4 loading through `NEXT_PUBLIC_GA_MEASUREMENT_ID` when GTM is not configured;
- no analytics scripts before affirmative consent;
- an essential-only choice;
- persistent browser consent state;
- updated global metadata reflecting the international newsroom scope;
- the approved tagline in the public brand lockup.

GTM takes precedence when both environment variables are present so tags are not loaded twice.

## Required production configuration

Configure one of the following in Vercel Production and Preview environments:

```text
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

or, if GTM is not yet available:

```text
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Do not add real IDs to the repository.

## Verification checklist

1. Build succeeds.
2. Consent banner is usable on desktop and mobile.
3. No Google analytics request is made before consent.
4. Accepting analytics loads exactly one implementation: GTM or GA4.
5. Essential-only does not load analytics.
6. Consent persists after reload.
7. GA4 Realtime records a test visit after consent.
8. Traffic source and page-view events appear in GA4.
9. Search Console ownership is verified separately using the production domain.
10. A dated export or screenshot is retained monthly for accreditation evidence.

## Evidence standard

Accreditation reports should state the platform, metric and date range, for example:

> Google Analytics 4 recorded 18,250 active users and 42,100 views between 1 June and 30 June 2027.

Website analytics, Search Console and native social-platform analytics remain separate sources. They may be combined in a media kit, but their metrics must not be added together and labelled as unique people.
