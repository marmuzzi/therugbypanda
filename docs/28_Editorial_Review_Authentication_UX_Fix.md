# Editorial Review Authentication UX Fix

Date: 2026-07-26
Status: Implemented on branch; pending PR, deployment and authenticated Studio verification.

## Regression

The Editorial Review workflow exposed `EDITORIAL_AUTOMATION_SECRET` as a browser-entered **Workflow authentication** field and stored it in session storage. The refactor also hid the editorial note unless rejection was available. This was a UX and security regression: editors could enter an incorrect secret, the workflow request could resolve against the hosted Studio origin, and the normal submission/rejection reason field was no longer consistently available.

## Required behaviour

- Sanity Studio editors must never type or store the automation secret in the browser.
- Studio workflow and AI-review requests must authenticate with the editor's existing Sanity session.
- Machine callers may continue to use `EDITORIAL_AUTOMATION_SECRET`.
- The authenticated Sanity user is the workflow actor.
- The Workflow panel must show a review note for submit and reject actions.
- A rejection reason remains mandatory; a submission note is optional.
- Workflow requests must target the deployed Rugby Panda API rather than the hosted Sanity origin.
- The PR #82 review-ready notification webhook must remain unchanged and fire only after a successful submit transition.

## Completion contract

This fix is complete only after:

1. TypeScript/build validation passes.
2. The Vercel preview is READY.
3. The visible authentication field is absent in authenticated Sanity Studio.
4. The note field is visible for submit/reject.
5. Submit succeeds using the Sanity session and Make detects the webhook payload.
6. Reject without a reason is blocked and reject with a reason succeeds.
7. No automation secret is written to browser storage.
