# NOTIFY-001 Desktop Completion Handoff

## Last verified

26 July 2026, Europe/Dublin.

## Verified production flow

The following path has been verified end-to-end through email delivery:

```text
Sanity Editorial Review submit
→ POST /api/editorial/workflow
→ editorial.article.ready_for_review webhook
→ Make custom webhook
→ Zoho SMTP email
→ editor@therugbypanda.ie
```

Verified facts:

- manually created Sanity drafts now appear in Editorial Review;
- the hosted Studio uses the authenticated Sanity session rather than a visible workflow secret;
- the submission/rejection note field is restored;
- Make detected the webhook payload;
- Zoho SMTP authentication succeeded using the EU SMTP endpoint and an app password;
- Make sent an email to `editor@therugbypanda.ie`;
- the email body rendered but mapped webhook values were empty because the Make mobile mapper did not bind the downstream tokens correctly.

## Repository corrections through PR #88

- PR #84 restored Sanity-session authentication and the review-note UX.
- PR #85 added safe notification delivery observability.
- PR #86 treated missing `workflowStatus` as `draft` and added automatic hosted-Studio deployment for Studio changes.
- PR #87 configured the Editorial Review client with authenticated `raw` perspective and disabled CDN use.
- PR #88 replaced string matching with `_id in path("drafts.**")` for reliable draft selection.

## Payload enhancement in progress

The current branch adds:

- `articleTitle`;
- `submissionNote`;
- the correct hosted Studio review URL: `https://therugbypanda.sanity.studio/structure/editorialReview`.

Existing payload fields remain:

- `event`;
- `eventId`;
- `destination`;
- `articleId`;
- `actor`;
- `occurredAt`;
- `reviewUrl`.

## Desktop-only Make step remaining

On a desktop browser:

1. Open the existing Make scenario.
2. Put the custom webhook into **Run once** or **Detect new values** mode.
3. Submit a fresh draft from Sanity so Make refreshes the payload schema, including `articleTitle` and `submissionNote`.
4. Open the Email module.
5. Remove the existing empty/orphaned mapping tokens.
6. Insert each field specifically from **Webhooks — Custom webhook**.
7. Use `articleTitle` in the subject and body.
8. Use `reviewUrl` as the link target.
9. Save the module and scenario.
10. Turn the scenario on.
11. Submit one fresh draft and confirm the populated email arrives.

Recommended subject:

```text
Editorial Review Required: {{articleTitle}}
```

Recommended HTML body:

```html
<h2>Editorial Review Required</h2>
<p><strong>{{articleTitle}}</strong> has been submitted for editorial review.</p>
<ul>
  <li><strong>Submitted by:</strong> {{actor}}</li>
  <li><strong>Submitted at:</strong> {{occurredAt}}</li>
  <li><strong>Article ID:</strong> {{articleId}}</li>
  <li><strong>Submission note:</strong> {{submissionNote}}</li>
</ul>
<p><a href="{{reviewUrl}}">Open Editorial Review</a></p>
```

The braces above describe mapping positions. In Make, insert the actual webhook tokens rather than typing literal braces.

## Completion criteria

NOTIFY-001 is complete only when all of the following are verified:

1. a new submission sends one populated email;
2. the review link opens the hosted Sanity Editorial Review tool;
3. the same `eventId` cannot produce a duplicate email;
4. webhook or email failure does not reverse a successful Sanity transition;
5. approval and publication remain separate manual actions.

## Remaining deduplication work

Make still requires persistent duplicate-event protection keyed by `eventId`. Email delivery has been verified, but duplicate suppression has not yet been verified and must not be claimed complete.
