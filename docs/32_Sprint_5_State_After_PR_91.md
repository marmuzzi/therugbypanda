# Sprint 5 State After PR #91

## Last verified

26 July 2026, Europe/Dublin.

## Repository and deployment baseline

- Repository: `marmuzzi/therugbypanda`.
- Production website: `https://therugbypanda.ie`.
- Current verified `main` commit: `bb3c3fcc08f9d95bc35f2b39cd6dfd76b7cf74ec`.
- This is the merge commit for PR #91.
- The Vercel deployment associated with this commit completed successfully.
- The automatic `Deploy Sanity Studio` workflow ran after the merge.
- The project owner verified the resulting Editorial Review interface in authenticated Sanity Studio on a phone.

## Editorial Review state

The mobile Editorial Review workflow is now operational and readable enough for practical phone use.

Implemented, merged, deployed and authenticated-Studio verified through PR #91:

- Studio-session authentication for workflow and AI-review requests; no browser-entered automation secret is required.
- Submission and rejection note field restored; rejection reason remains mandatory.
- Manually created unpublished Sanity drafts appear in the queue even before `workflowStatus` exists.
- Draft queries use `perspective: "raw"`, disable CDN use and filter drafts with `_id in path("drafts.**")`.
- Article Quality appears first on mobile.
- AI Editorial Review appears immediately after Article Quality.
- Single-column mobile layout is preserved.
- Quality metrics, findings, status summaries, metadata, Sources, Fact Ledger and Workflow fields use improved contrast and typography.
- Hosted Sanity Studio deploys automatically after relevant merges to `main`.

Relevant pull requests:

- PR #84 — restore reason field and Studio-session authentication.
- PR #85 — add NOTIFY-001 delivery observability.
- PR #86 — include manually created drafts and add automatic Studio deployment.
- PR #87 — load drafts using raw perspective.
- PR #88 — use the supported Sanity draft path filter.
- PR #89 — enrich the review-ready notification payload and add the desktop Make handoff.
- PR #90 — improve mobile Article Quality and issue readability.
- PR #91 — improve remaining mobile card and workflow-field contrast.

## NOTIFY-001 state

Verified so far:

- A controlled submit-to-review transition reaches the production workflow API.
- The Make webhook receives the event.
- The application emits stable event and article identifiers.
- The payload now includes `articleTitle`, optional `submissionNote` and the hosted Studio `reviewUrl`.
- An email module test successfully delivered an email to `editor@therugbypanda.ie`.

Still required before NOTIFY-001 can be closed:

1. Refresh the Make webhook sample from the enriched PR #89 payload.
2. Confirm every dynamic field is mapped correctly in the production email.
3. Deliver one correctly populated controlled notification email.
4. Add persistent deduplication keyed by `eventId`.
5. Replay the same event and prove no second email is sent.
6. Verify the failure path and routing without changing the successful Sanity workflow state.
7. Record the final Make scenario design and verification evidence in the repository.

The current connector available in ChatGPT does not expose Make scenario editing, so these remaining scenario changes require the Make interface unless additional Make tools become available.

## Immediate next implementation order

1. Complete and verify NOTIFY-001 mapping and deduplication.
2. Implement NOTIFY-002 workflow-failure and technical-alert routing to `admin@therugbypanda.ie`.
3. Execute a complete controlled editorial lifecycle test: draft → submit → notification → amend/review → approve → publish → production rendering.
4. Continue persistent Make orchestration for eight review-ready drafts by 08:00 Europe/Dublin.
5. Verify automatic rejection replacement with a genuinely different angle and source set.
6. Complete the nine-article launch package and production verification.

## Non-negotiable editorial boundary

Sanity remains the canonical CMS and mandatory human approval boundary. Notifications and orchestration must never approve or publish an article automatically.

## Completion rule

Always distinguish implemented, committed, merged, deployed, verified in production, verified in authenticated Sanity Studio and documentation updated.