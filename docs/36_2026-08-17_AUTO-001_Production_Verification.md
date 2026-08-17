# AUTO-001 Production Verification — 17 August 2026

## Scope

This handoff records the production verification of `AUTO-001 – Morning Editorial Package` and the separate editorial-quality issue discovered during that verification.

## Final verified delivery topology

```text
The Rugby Panda production application
→ POST /api/editorial/daily-package
→ editorial.daily_package.ready
→ Make custom webhook: AUTO-001 – Morning Editorial Package
→ Rugby Panda Event Deduplication: check eventId existence
→ filter: New package only / Exists = false
→ one consolidated HTML email to editor@therugbypanda.ie
→ Rugby Panda Event Deduplication: write successful event record
```

The success record is written only after the email succeeds. Duplicate replay of the same `eventId` is blocked before the email and writes no second success record.

## Verification completed

On 17 August 2026:

- Make controlled five-article sample payload completed successfully.
- The consolidated email rendered five ordered articles.
- Persistent deduplication used incoming `eventId` as the key.
- Replaying `auto001-controlled-test-001` returned `Exists = true`, sent no second email and wrote no second record.
- The production webhook URL was rotated after configuration and stored in Vercel as `EDITORIAL_DAILY_PACKAGE_WEBHOOK_URL`.
- PR #153 corrected generated Sanity review links to the verified intent-route form: `/intent/edit/id=<document>;type=article`.
- PR #153 merged as `4f6d0bd721ce1ddeaedaa48857dfdf9ed652f252`.
- Production was explicitly redeployed after the environment-variable update.
- The real production endpoint returned HTTP 200 with `status: sent`, `eventId: editorial-daily-package:2026-08-17`, `articleCount: 5` and destination `editor@therugbypanda.ie`.
- Vercel runtime logs independently confirmed `POST /api/editorial/daily-package 200` on the production deployment.
- The real five-article Morning Editorial Package arrived at `editor@therugbypanda.ie`.
- A `Review in Sanity` link opened the exact corresponding draft in hosted Sanity Studio.
- The temporary Preview-only verifier was removed from its test branch immediately after verification and was never merged into production.

## Important separation of concerns

AUTO-001 delivery is production verified. The endpoint packages eligible drafts already present in Sanity; it does not generate the articles.

The production package used five historical controlled-QA drafts whose IDs begin `article-controlled-qa-`. All five covered the same Law 8 scoring topic. This is not a Make delivery defect. It exposed an upstream eligibility and editorial-diversity problem.

A separate issue must prevent controlled-QA/test drafts from entering a real Morning Editorial Package and must ensure the upstream acquisition/generation flow produces five genuinely distinct current rugby stories.

## Remaining morning automation work

- Configure and verify the scheduled invocation around 07:50–07:55 Europe/Dublin.
- Complete overnight acquisition/generation so five eligible, current, editorially distinct drafts exist before package time.
- Exclude controlled-QA/test content from production package eligibility.
- Verify three consecutive on-time deliveries before 08:00.

Sanity remains the mandatory human approval boundary. Nothing in AUTO-001 approves or publishes content automatically.
