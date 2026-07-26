# Sprint 5 Production State

## Last verified

26 July 2026, Europe/Dublin.

## Production baseline

Repository: `marmuzzi/therugbypanda`

Production website: `https://therugbypanda.ie`

Current verified GitHub `main` commit:

```text
bb3c3fcc08f9d95bc35f2b39cd6dfd76b7cf74ec
```

This is the merge commit for PR #91. The associated Vercel deployment completed successfully. The automatic `Deploy Sanity Studio` workflow ran after merge, and the project owner verified the resulting mobile Editorial Review interface in authenticated Sanity Studio.

For the most recent detailed handoff, also read `docs/32_Sprint_5_State_After_PR_91.md`.

## Sprint status

- Sprint 4 is complete.
- Sprint 5 Editorial & Publishing Automation is in progress.
- Real Sanity-backed website search is merged and production verified.
- The Editorial Review refactor, queue fixes, session authentication and mobile readability improvements are merged and deployed.
- Automatic hosted Sanity Studio deployment after relevant merges is working.
- The Make webhook receives review-ready events.
- A test email reached `editor@therugbypanda.ie`.
- NOTIFY-001 is still pending correctly populated production email mapping, persistent deduplication, duplicate replay and failure-path verification.

## Editorial Review production state

Implemented, merged, deployed and authenticated-Studio verified:

- Editorial Review orchestration and extracted helper/component structure.
- Review Queue with filters, search and status counts.
- Draft Editor.
- Editorial Review Summary and deterministic publication gate.
- On-demand, non-destructive AI Editorial Review.
- Featured Image, Sources, Fact Ledger, Workflow and Audit History panels.
- Studio-session authentication for workflow and AI-review requests.
- Restored submission and rejection note field.
- Manually created unpublished drafts appear before `workflowStatus` exists.
- Draft-aware Sanity client using raw perspective, no CDN and `_id in path("drafts.**")`.
- Mobile-first single-column ordering with Article Quality first and AI Review second.
- Improved contrast and typography across quality findings, metadata and workflow cards.

AI findings remain visible after relevant edits, are marked **Out of date**, and can be refreshed with **Run Review Again**. Switching articles clears the prior article's findings.

## Notification production state

Application-side capabilities:

- emits `editorial.article.ready_for_review` only after a successful submit-to-review transition;
- targets `editor@therugbypanda.ie`;
- supports protected webhook configuration;
- includes stable `eventId` and article identifiers;
- includes `articleTitle`, optional `submissionNote` and the hosted Studio `reviewUrl`;
- applies a timeout and isolates notification failure from the successful Sanity transition;
- records production-safe observability without exposing secrets;
- does not alter approval or publication boundaries.

Verified:

1. A controlled submit reaches the production workflow API.
2. Make receives the webhook.
3. A test email reaches `editor@therugbypanda.ie`.

Still required:

1. Refresh Make sample data from the enriched payload.
2. Map all dynamic email fields correctly.
3. Deliver one correctly populated notification email.
4. Add persistent deduplication keyed by `eventId`.
5. Replay the same event and verify no duplicate email.
6. Verify failure routing while preserving the successful Sanity workflow state.
7. Document final Make scenario inputs, outputs, retries and failure paths.

## Make.com connector status

- Toolbox connection: verified.
- Temporary Health Check: verified.
- Current production webhook reception: verified.
- Direct scenario editing through the currently exposed ChatGPT connector: unavailable.
- Remaining NOTIFY-001 scenario work therefore requires the Make interface unless additional tools are exposed.

## Relevant recent pull requests

- PR #81 — real website search.
- PR #82 — review-ready webhook foundation.
- PR #84 — Studio-session authentication and workflow note restoration.
- PR #85 — notification delivery observability.
- PR #86 — manual draft inclusion and automatic Studio deployment.
- PR #87 — raw draft perspective.
- PR #88 — supported draft path filter.
- PR #89 — enriched notification payload and desktop Make handoff.
- PR #90 — mobile quality-panel readability.
- PR #91 — remaining mobile card and workflow-field contrast.

PR #65 remains superseded and must not be treated as the production source.

## Verification status

- Repository merge state through PR #91: verified.
- Vercel deployment for PR #91 merge commit: successful.
- Automatic Sanity Studio deployment: verified operationally.
- Authenticated mobile Studio result through PR #91: verified by project owner.
- Controlled webhook reception by Make: verified.
- Test email delivery: verified.
- Correctly populated production notification email: pending.
- Persistent duplicate-event protection: pending.
- Notification failure-path verification: pending.
- Full launch-package publication verification: pending under `LAUNCH-001` and `AUTO-001`.

## Mailboxes

- `admin@therugbypanda.ie` — infrastructure, security, billing, workflow failures and technical alerts.
- `hello@therugbypanda.ie` — public contact mailbox.
- `editor@therugbypanda.ie` — review-ready notifications and editorial/media communication.

## Immediate next implementation order

1. Complete NOTIFY-001 mapping and persistent deduplication.
2. Verify one populated email, duplicate replay and failure path.
3. Add NOTIFY-002 technical alert routing.
4. Execute a complete controlled editorial lifecycle through production rendering.
5. Continue persistent orchestration and rejection replacement.
6. Complete and verify the nine-article launch package.

## Non-negotiable editorial boundary

Sanity remains the canonical CMS and mandatory human approval boundary. No acquired or AI-generated content may be automatically approved or published.

## Completion rule

Always report separately implemented, committed, merged, deployed, verified in production, verified in authenticated Sanity Studio and documentation updated. A milestone is not complete until its relevant verification has passed.