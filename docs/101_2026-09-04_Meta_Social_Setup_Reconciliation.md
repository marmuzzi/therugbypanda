# Meta Social Setup Reconciliation — 4 September 2026

## Purpose

This document reconciles the newest recoverable owner-session evidence for The Rugby Panda social-media setup. It supersedes older project statements that Meta authorization is wholly blocked or that no Meta work has been performed.

## Evidence recovered

Recent Meta Developer console captures identify:

- Meta app ID: `1448619013774538`
- Meta Business ID: `1375345774466123`
- configured use cases visible in the app: `Manage Pages` and `Instagram API`
- the console shows `business_management`, `pages_show_list` and `public_profile` as **Ready for testing** in the relevant use-case views.

The Manage Pages permission catalogue visible for this app includes:

- `pages_manage_posts` — create/edit/delete Page posts
- `pages_manage_metadata` — Page subscriptions/webhooks and settings
- `pages_manage_engagement`
- `pages_read_engagement`
- `pages_read_user_content`
- `pages_show_list`
- `business_management`
- `public_profile`

The Instagram API permission catalogue visible for this app includes:

- `instagram_business_basic`
- `instagram_business_content_publish` — create organic feed photo/video posts for a business user
- `instagram_content_publish`
- `instagram_business_manage_comments`
- `instagram_business_manage_insights`
- `instagram_business_manage_messages`
- `instagram_manage_comments`
- `instagram_manage_contents`
- `instagram_manage_engagement`
- `instagram_manage_insights`
- `instagram_manage_messages`
- `pages_read_engagement`
- `pages_show_list`
- `business_management`
- `public_profile`

## What this evidence proves

The Meta app exists and has both Page-management and Instagram API use cases configured far enough for Meta to expose the required publishing permission surfaces and mark several prerequisite permissions/features ready for testing. Therefore the previous blanket statement `Meta developer authorization externally blocked` is stale.

## What this evidence does NOT yet prove

Do not infer any of the following without fresh provider/API evidence:

- that every listed permission has been granted to a production access token;
- that a long-lived Page token is installed in production;
- that the Facebook Page and Instagram professional account IDs have been resolved by the application;
- that an Instagram account is linked to the intended Facebook Page;
- that a webhook/callback is installed and receiving events;
- that Make.com, Vercel or another downstream social dispatcher is configured;
- that a Facebook post has been successfully created by the Rugby Panda application;
- that an Instagram media container has been created and published by the Rugby Panda application;
- that App Review / Live-mode requirements, where applicable, have been completed.

No access token or secret is recorded in repository documentation.

## Required publication boundary

The human-publication boundary is unchanged:

`draft -> human review/edit in Sanity -> human Publish -> public article -> social distribution event -> Facebook/Instagram`

Draft generation, Publication Review, image acquisition, morning email delivery and scheduled discovery must never post to social media. A social delivery attempt must be idempotent per published article/platform and must not republish an article on retry.

## Current status

Status: **Meta configuration recovered; provider end-to-end verification pending.**

This is materially ahead of the older `externally blocked` state, but it is not yet evidence of a working production social publisher.

## Next verification

Without publishing a draft merely for testing:

1. verify the intended Facebook Page and linked Instagram professional account via Meta API using existing configured credentials;
2. verify the production credential has the minimum required Page/Instagram publishing permissions;
3. inspect the repository/runtime for the existing downstream `editorial.article.published` social dispatcher and its configured provider variables;
4. when there is a genuine owner-approved published article, perform a controlled Facebook + Instagram post and capture provider IDs/responses;
5. verify duplicate suppression by replaying the same publication event without creating a second post;
6. only then move `SOCIAL-001` to Closed.

## Security

Never commit Meta access tokens, app secrets, Page tokens or Instagram credentials. Repository docs may record non-secret app/business identifiers and evidence/status only.