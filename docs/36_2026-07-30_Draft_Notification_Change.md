# Draft-Created Notification Change

Date: 2026-07-30

## Decision

The editorial operating workflow is now:

Draft created → immediate editor notification → editor reviews or edits → one controlled Publish action.

The obsolete notification boundary at `ready_for_review` is removed from the application event contract.

## Application event

After a successful Sanity article draft write, the application sends:

- event: `editorial.article.draft_created`
- eventId: `editorial-draft:<articleId>:<occurredAt>`
- destination: `editor@therugbypanda.ie`
- articleId
- articleTitle
- actor
- occurredAt
- submissionNote
- reviewUrl

The existing `EDITORIAL_NOTIFICATION_WEBHOOK_URL` and optional bearer secret remain in use, so the current Make custom webhook can be retained.

## Failure isolation

A notification failure does not remove or invalidate the successfully created Sanity draft. Delivery failures continue to use the existing technical-alert webhook path.

## Make completion steps

1. Open `NOTIFY-001 – New Draft Notification`.
2. Click Run once.
3. Trigger one real editorial draft through the authenticated draft pipeline.
4. Confirm Make captures `editorial.article.draft_created` and its `eventId`.
5. Insert Data Store replay protection using `eventId` as the record key.
6. Map the email to the new draft payload.
7. Replay the same event and verify that only one email is delivered.

## FinOps

Make.com Core is an active project cost of USD 10.59 per month, recorded separately in `docs/35_FinOps_Budget_and_Cost_Register.md`.
