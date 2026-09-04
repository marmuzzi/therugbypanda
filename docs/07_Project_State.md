# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

4 September 2026. This reconciliation incorporates the recovered Meta Developer setup evidence in `docs/101_2026-09-04_Meta_Social_Setup_Reconciliation.md`. For editorial/media/FinOps details, newer numbered evidence documents supersede the older 3 September measurements below where they conflict.

## Source of truth

Read first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. newest numbered handoff/evidence documents relevant to the task, especially `docs/101_2026-09-04_Meta_Social_Setup_Reconciliation.md` for social state

Where older documents conflict with later measured production/provider evidence, newer evidence wins. Chat history is not project truth.

## Operating targets

- Timezone: Europe/Dublin.
- Sanity is the canonical CMS and mandatory human publication boundary. Generated content remains draft-only until a human publishes it.
- GitHub is the versioned project source of truth.
- Batch related changes and minimise Vercel deployments.
- OpenAI application budget ceiling is $0.30 per Europe/Dublin day; do not brute-force retries.
- Gmail and Google Drive are not part of the editorial path; Zoho is editorial email.
- Social distribution is post-publication only and must never bypass human publication.

## Editorial contract

Articles are original multi-source Rugby Panda synthesis, not rewrites. Freshness identity is **subject + event/development + editorial angle**. Evidence/freshness/diversity and deterministic quality gates remain fail closed. Publication Review is mandatory before a generated draft becomes production-eligible. No generated article is automatically published.

## Media state

Automatic image assignment remains relevance-first and fail closed. Third-party assets require rights metadata and local Sanity storage. Explicit person/team/gender conflicts must be rejected rather than forcing an image.

4 September bulk acquisition materially expanded the Sanity Editorial Image library; use the newest image-import/audit evidence rather than the historical 354-image 3 September baseline when reporting current counts. Library size alone does not prove article-image assignment relevance; named-person and team-context matching remains a P0 safety requirement.

## Editorial delivery

Zoho is the editorial delivery boundary. The owner-approved current requirement is one email per new production draft, with QA/test drafts suppressed and exact-once/idempotent delivery per article. Older consolidated-package wording in historical evidence is superseded by this owner decision; implementation/production verification must be checked against current `main` before claiming it is active.

## Editorial Review / human publication boundary

Sanity Studio is the mandatory review/edit/publish boundary. Generated/acquired material remains draft-only. Do not publish content merely to manufacture evidence.

## Social distribution — recovered 4 September state

The previous statement that Meta developer authorization is wholly externally blocked is **stale**.

Recovered Meta Developer evidence identifies app `1448619013774538` under Business `1375345774466123`, with both `Manage Pages` and `Instagram API` use cases configured. Meta exposes the Page publishing permission surface including `pages_manage_posts`, and the Instagram publishing surface including `instagram_business_content_publish` / `instagram_content_publish`. `business_management`, `pages_show_list` and `public_profile` are visibly marked **Ready for testing** in the recovered console views.

This proves meaningful Meta configuration has been completed, but it does **not** yet prove that a production token has every required permission, that the intended Facebook Page/Instagram professional account pair has been resolved by the application, or that a Rugby Panda publication has successfully created both provider posts. Do not claim production social posting until provider post IDs/responses are captured.

The application-side contract remains:

`human Publish in Sanity -> editorial.article.published -> idempotent social dispatcher -> Facebook + Instagram -> store platform IDs/status in Sanity`

Social failure must never roll back website publication. Draft creation, scheduled discovery, image acquisition and Zoho delivery must never post to social.

See `docs/34_Daily_Editorial_and_Social_Automation.md` for the established application contract and `docs/101_2026-09-04_Meta_Social_Setup_Reconciliation.md` for the recovered provider evidence and verification checklist.

## Current social gate

Before `SOCIAL-001` can close:

1. resolve/verify the intended Facebook Page and linked Instagram professional account using the existing Meta setup;
2. verify the active production credential has the minimum publishing permissions;
3. verify the downstream social dispatcher/runtime configuration;
4. on a genuine owner-approved published article, obtain one Facebook post ID and one Instagram post/media ID;
5. replay the same event and prove duplicate suppression;
6. retain the human-publication boundary throughout.

No Meta access token or app secret belongs in repository documentation.