# Publishing Workflow

Sanity Studio is the canonical CMS and mandatory human approval/publication boundary.

## Session startup

Read `docs/07_Project_State.md`, `docs/08_Issue_Log.md`, this file and the newest relevant evidence documents. For Meta/social work, also read `docs/34_Daily_Editorial_and_Social_Automation.md` and `docs/101_2026-09-04_Meta_Social_Setup_Reconciliation.md`. Check GitHub, Vercel and available integrations before asking the owner to configure anything. Use Europe/Dublin for schedules.

## Completion discipline

Always distinguish implemented, committed, merged, deployed, production verified, authenticated Sanity verified, orchestration verified, Meta configured, Meta credential verified and Meta post verified. Never infer provider success from configuration screens alone.

## Editorial flow

```text
free current-source discovery/acquisition
→ deterministic evidence/freshness/diversity gates
→ generation only for valid missing positions
→ Publication Review + deterministic quality gates
→ production Sanity draft
→ rights-cleared local image planning with strict relevance
→ one exact-once Zoho email for each new production draft (QA suppressed)
→ human review/edit in Sanity
→ human Publish or reject
→ public website
→ editorial.article.published
→ idempotent Facebook + Instagram distribution
```

Generated content and acquired images are never automatically published.

## Editorial quality and media

Freshness identity remains **subject + event/development + editorial angle**. Retained drafts are not grandfathered around current evidence/quality gates. Image assignment is relevance-first and fail closed: correct named person first, then correct team/event/context; an unrelated person or subject is never an acceptable fallback. Rights metadata and local Sanity storage remain mandatory for automatic assignment.

The image library expanded materially on 4 September through no-OpenAI acquisition. Use newest audit evidence for counts; do not use historical library size as proof that a particular article has safe images.

## Zoho delivery

The owner-approved current contract is **one email per new production draft**, not a requirement to wait for a consolidated five-draft package. Each production draft that reaches the required editorial/image readiness should emit one stable notification event and be delivered exactly once. QA/test drafts are suppressed. The daily target remains five good drafts, with work continuing after 08:00 when fewer than five are ready. Older consolidated-package evidence remains historical proof of Zoho transport/deduplication but no longer defines the desired delivery UX.

Before claiming this contract active, inspect current `main` because a later restoration of consolidated mode may have regressed the per-draft implementation.

## Human publication boundary

Only a successful controlled human `publish` action may emit `editorial.article.published`. Draft creation, review, scheduled acquisition, image import and email delivery must never emit a social publishing event. Social failure must never roll back or mutate a successful website publication.

## SOCIAL-001 — application contract

The established application contract in `docs/34_Daily_Editorial_and_Social_Automation.md` includes a stable event ID, article ID, title/standfirst, public URL, featured-image URL/alt, taxonomy, Facebook teaser and Instagram caption/hashtags. Sanity social controls include opt-out, platform copy overrides, delivery status, event/attempt state, platform post IDs and last error.

The downstream dispatcher must:

1. deduplicate by stable publication event ID before calling Meta;
2. honour `Do not publish to social`;
3. publish to the intended Facebook Page;
4. publish a suitable square/portrait creative to the linked Instagram professional account;
5. record each platform ID/status in Sanity;
6. retry only failed platforms without republishing successful ones;
7. surface unrecoverable failures without altering website publication.

## Meta provider state — reconciled 4 September

The previous blanket `Meta authorization externally blocked` statement is superseded.

Recovered Meta Developer console evidence identifies:

- app ID `1448619013774538`;
- Business ID `1375345774466123`;
- `Manage Pages` use case configured;
- `Instagram API` use case configured;
- Page publishing permission surface includes `pages_manage_posts`;
- Instagram publishing surface includes `instagram_business_content_publish` and `instagram_content_publish`;
- `business_management`, `pages_show_list` and `public_profile` appear **Ready for testing** in the recovered views.

This is **Meta configured**, not yet **Meta post verified**. The recovered evidence does not prove every permission is granted to the production token, does not expose/record any token, and does not prove that the intended Facebook Page + Instagram professional account pair has been resolved or that a provider post succeeded.

Never commit Meta access tokens/app secrets to GitHub.

## Meta completion evidence

`SOCIAL-001` closes only after a genuine owner-approved publication produces:

- one Facebook provider post ID;
- one Instagram provider media/post ID;
- successful Sanity writeback of both platform outcomes;
- opt-out proof;
- replay/duplicate-suppression proof;
- safe partial retry proof where one platform has already succeeded.

Do not publish a synthetic article merely to manufacture this evidence.

## AI FinOps

OpenAI is for editorial generation/review, not source crawling or image acquisition. Application budget ceiling is $0.30 per Europe/Dublin day. Deterministic discovery, filtering, image acquisition and social transport should incur zero OpenAI calls. Do not restore paid generation merely to test social.