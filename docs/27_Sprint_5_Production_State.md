# Sprint 5 Production State

## Last verified

26 July 2026, Europe/Dublin.

## Production baseline

Repository: `marmuzzi/therugbypanda`

Production website: `https://therugbypanda.ie`

Current GitHub `main` commit:

```text
39f8e1ddc7ff3d31f07bc3879f2dbeac031360e7
```

This commit is the merge commit for PR #82. Fresh Vercel production verification against this commit is still required in the current work session.

## Sprint status

- Sprint 4 is complete.
- Sprint 5 Editorial & Publishing Automation is in progress.
- The Editorial Review refactor is merged into `main` and deployed.
- PR #81 real website search is merged and was reported verified in production.
- PR #82 editorial review notification webhook foundation is merged.
- The Make.com MCP toolbox is connected; its temporary Health Check tool executed successfully.
- NOTIFY-001 is not yet complete end-to-end.

## Editorial Review production state

Implemented and merged:

- Editorial Review orchestration refactor.
- Focused helper modules for types, constants, formatting, Portable Text and deterministic review logic.
- Review Queue.
- Draft Editor.
- Editorial Review Summary.
- AI Editorial Review.
- Featured Image panel.
- Sources panel.
- Fact Ledger panel.
- Workflow panel.
- Audit History panel.

Current AI-review behaviour:

- AI findings remain visible after the draft is edited.
- Existing findings are marked **Out of date** after relevant edits.
- The action changes to **Run Review Again**.
- Rerunning refreshes the findings against the latest draft.
- Switching articles clears findings from the previous article.

Controlled QA terminology uses **drop goal**, not **dropped goal**.

## Search production state

PR #81 replaced the placeholder search with Sanity-backed published-article search across title, standfirst, category, province and competition. It supports shareable `?q=` URLs, renders results with the existing ArticleCard component and includes empty-query and no-results states.

Repository status: merged at `bc8137f7aa35c2a19a8e09654468a94f0e5bd05a`.

Production status: reported verified on 26 July 2026; retain as a regression check during future production verification.

## Notification production state

PR #82 added the application-side foundation for NOTIFY-001:

- emits `editorial.article.ready_for_review` only after a successful submit-to-review transition;
- targets `editor@therugbypanda.ie`;
- supports `EDITORIAL_NOTIFICATION_WEBHOOK_URL`;
- supports optional `EDITORIAL_NOTIFICATION_WEBHOOK_SECRET` bearer authentication;
- includes a stable event identifier for downstream deduplication;
- applies a 10-second timeout;
- isolates notification failures from successful Sanity workflow transitions;
- does not alter approval or publication boundaries.

Repository status: merged at `39f8e1ddc7ff3d31f07bc3879f2dbeac031360e7`.

Production verification still required:

1. Confirm latest Vercel deployment is `READY` for current `main`.
2. Configure `EDITORIAL_NOTIFICATION_WEBHOOK_URL` in Vercel production.
3. Configure `EDITORIAL_NOTIFICATION_WEBHOOK_SECRET` in Vercel production if the Make webhook validates bearer authentication.
4. Configure the Make scenario to validate, deduplicate and email.
5. Execute a controlled submit-to-review transition.
6. Confirm exactly one email reaches `editor@therugbypanda.ie`.
7. Replay the same stable event identifier and confirm no duplicate email is sent.
8. Confirm a notification failure does not change the successful Sanity workflow transition.
9. Confirm Sanity remains the mandatory human approval boundary.

## Make.com MCP status

- Connector/toolbox availability: verified.
- Temporary Health Check tool: executed successfully on 26 July 2026.
- Currently exposed production Rugby Panda tools: none verified beyond Health Check.
- Production NOTIFY-001 Make scenario: pending configuration and verification.

## Relevant pull requests

- PR #62 — deterministic Editorial Review Intelligence framework; merged.
- PR #63 — AI Editorial Review; merged 24 July 2026 at commit `05193c0c8a49a11cf51a8c8da3c1293a9d2ec6e2`.
- PR #64 — follow-up AI Editorial Review integration; merged but introduced a broken Editorial Review component.
- PR #66 — emergency repair restoring TypeScript parsing, the Sanity Tool contract and Editorial Review behaviour; merged 25 July 2026 at commit `0e036a13d2509237ddf376cd474f51fcb80a0050`.
- PR #67 — Editorial Review component refactor and QA improvements; merged 26 July 2026 at commit `e934cc7ea8e2fe222eb1f4d06b131c717b5fefb1`.
- PR #81 — real Sanity-backed website search; merged 26 July 2026 at commit `bc8137f7aa35c2a19a8e09654468a94f0e5bd05a`.
- PR #82 — editorial review notification webhook foundation; merged 26 July 2026 at commit `39f8e1ddc7ff3d31f07bc3879f2dbeac031360e7`.

PR #65 remains a superseded duplicate/rework of the AI Editorial Review implementation and must not be treated as the production source.

## Verification status

- Repository merge state through PR #82: verified.
- GitHub administrative and push access: verified.
- Make MCP connection: verified through Health Check.
- Vercel production deployment for current `main`: pending fresh verification.
- Vercel notification environment variables: pending verification/configuration.
- Controlled NOTIFY-001 submit test: pending.
- Email delivery to `editor@therugbypanda.ie`: pending.
- Duplicate-event protection: pending.
- Authenticated Sanity Studio smoke testing: completed for the Editorial Review refactor baseline.
- Full launch-package publication verification: still pending under `LAUNCH-001` and `AUTO-001`.

## Mailboxes

### `admin@therugbypanda.ie`

Infrastructure and technical operations only:

- Vercel, GitHub, Cloudflare, OpenAI, Apify, Make.com and Sanity accounts.
- Billing, security, DNS and SSL.
- Workflow failures and technical alerts.
- No public or customer communication.

### `hello@therugbypanda.ie`

Public contact mailbox.

The reader-facing website must include a **Contact us** link using:

```text
mailto:hello@therugbypanda.ie
```

### `editor@therugbypanda.ie`

Editorial mailbox for:

- article-ready-for-review notifications;
- approval requests;
- media and accreditation enquiries;
- press conference invitations;
- outgoing editorial and media communication.

## Immediate next implementation order

1. Merge these documentation corrections.
2. Verify the latest Vercel production deployment for current `main`.
3. Inspect and replace the temporary Make Health Check with production-ready Rugby Panda tooling where supported.
4. Configure and verify NOTIFY-001 end-to-end.
5. Add workflow-failure and technical-alert notifications to `admin@therugbypanda.ie`.
6. Continue persistent orchestration, rejection replacement and launch-content work.

## Non-negotiable editorial boundary

Sanity remains the canonical CMS and mandatory human approval boundary.

No acquired or AI-generated content may be automatically approved or published.

## Completion rule

Always report separately:

- implemented;
- committed;
- merged;
- deployed;
- verified in production;
- verified in authenticated Sanity Studio;
- documentation updated.

A milestone is not complete until its relevant production or authenticated-Studio verification has passed.
