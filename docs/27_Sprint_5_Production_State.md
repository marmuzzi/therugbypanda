# Sprint 5 Production State

## Last verified

26 July 2026, Europe/Dublin.

## Production baseline

Repository: `marmuzzi/therugbypanda`

Production website: `https://therugbypanda.ie`

Current `main` commit:

```text
e934cc7ea8e2fe222eb1f4d06b131c717b5fefb1
```

The latest Vercel production deployment for this commit is `READY`.

## Sprint status

- Sprint 4 is complete.
- Sprint 5 Editorial & Publishing Automation is in progress.
- The Editorial Review refactor is merged into `main` and deployed.
- Production is stable.

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

## Relevant pull requests

- PR #62 — deterministic Editorial Review Intelligence framework; merged.
- PR #63 — AI Editorial Review; merged 24 July 2026 at commit `05193c0c8a49a11cf51a8c8da3c1293a9d2ec6e2`.
- PR #64 — follow-up AI Editorial Review integration; merged but introduced a broken Editorial Review component.
- PR #66 — emergency repair restoring TypeScript parsing, the Sanity Tool contract and Editorial Review behaviour; merged 25 July 2026 at commit `0e036a13d2509237ddf376cd474f51fcb80a0050`.
- PR #67 — Editorial Review component refactor and QA improvements; merged 26 July 2026 at commit `e934cc7ea8e2fe222eb1f4d06b131c717b5fefb1`.

PR #65 remains a superseded duplicate/rework of the AI Editorial Review implementation and must not be treated as the production source.

## Verification status

- Repository merge state: verified.
- Vercel production deployment: verified `READY`.
- Public website availability: production baseline accepted as stable.
- Authenticated Sanity Studio smoke testing: completed for the current Editorial Review workflow as part of the refactor milestone.
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

1. Add the public Contact link for `hello@therugbypanda.ie`.
2. Add article-ready-for-review notifications to `editor@therugbypanda.ie`.
3. Add workflow-failure and technical-alert notifications to `admin@therugbypanda.ie`.
4. Continue persistent orchestration, rejection replacement and launch-content work.

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