# New Chat Handoff

Use this file when continuing The Rugby Panda in a new chat.

## Read first

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/10_New_Chat_Handoff.md`
5. `docs/11_Editorial_Image_Archive.md`
6. `docs/12_Brand_Assets_Library.md`
7. `docs/23_Make_Orchestration_Architecture.md`
8. `docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md`
9. `docs/27_Sprint_5_Production_State.md`
10. `docs/33_Version_1_Product_Roadmap.md`
11. `docs/34_2026-07-29_Automation_Handoff.md`
12. `docs/36_2026-08-17_AUTO-001_Production_Verification.md`
13. `docs/37_2026-08-17_AUTO-004_NOTIF-003_Verification.md`
14. any newer handoff, automation, Sprint, launch or FinOps documents.

Then inspect GitHub `main`, recent PRs/commits, Vercel production/preview state and currently available connectors. Repository documentation is authoritative over chat memory.

## Operating context

- Repository: `marmuzzi/therugbypanda`
- Production: `https://therugbypanda.ie`
- Timezone: `Europe/Dublin`
- Daily target: five review-ready drafts and one consolidated editorial email by 08:00
- Sanity is the mandatory human approval boundary
- Editorial experience: Draft → human review/edit → Publish
- No AI-generated or acquired content is automatically approved or published

## Verified baseline — 17 August 2026

- Production is healthy on Vercel.
- NOTIFY-001 is complete and production verified.
- NOTIFY-002 is complete and production verified.
- NOTIFY-003 is complete and production verified.
- `AUTO-001 – Morning Editorial Package` is complete and production verified as the delivery receiver.
- AUTO-004 production eligibility protection is merged, deployed and production verified to exclude historical controlled-QA/test content.
- AUTO-004 remains open only for the five-current-story diversity/generation verification.
- Make.com Core is active at USD $10.59/month.
- `Rugby Panda Event Deduplication` is the verified persistent deduplication store for NOTIFY-001, NOTIFY-002 and AUTO-001.
- SOCIAL-001 application foundation is deployed but Meta delivery is not verified.
- AUTO-003 remains in progress for overnight generation, scheduling and repeated on-time operation.

## AUTO-001 verified state

Final delivery path:

```text
Production POST /api/editorial/daily-package
→ editorial.daily_package.ready
→ Make AUTO-001 custom webhook
→ check eventId in Rugby Panda Event Deduplication
→ New package only / Exists = false
→ one consolidated HTML email to editor@therugbypanda.ie
→ persist successful package record
```

Verification completed:

- controlled five-article Make send succeeded;
- duplicate replay sent no second email and wrote no second record;
- the webhook URL was rotated before production use and Vercel was updated;
- PR #153 corrected package Sanity links to the verified intent-route form and merged as `4f6d0bd721ce1ddeaedaa48857dfdf9ed652f252`;
- production was redeployed after the environment-variable update;
- real production `POST /api/editorial/daily-package` returned HTTP 200 with five articles;
- Vercel runtime logs confirmed the production HTTP 200;
- the real five-article package arrived at `editor@therugbypanda.ie`;
- a Review in Sanity link opened the exact corresponding draft.

Do not rebuild AUTO-001 delivery.

## AUTO-004 — exact resume point

The first real production package contained five historical controlled-QA documents whose IDs began `article-controlled-qa-`, all covering essentially the same World Rugby Law 8 scoring angle.

PR #156 has already fixed the eligibility/selector side:

- generated drafts now carry explicit `automationContentClass` and `morningPackageEligible` metadata;
- `qaMode` drafts are classified as QA and marked ineligible;
- normal production drafts are classified as production and marked eligible;
- the production package query requires explicit production eligibility;
- the selector rejects same-source and materially similar title/angle/source candidates.

PR #156 merged as `d1f651726987fda2c2f36ac9d07b7d7d6fb93eea` and deployed successfully.

Production verification then returned:

```json
{
  "status": "incomplete",
  "articleCount": 0,
  "eligibleCandidateCount": 0,
  "requiredArticleCount": 5,
  "reason": "insufficient-production-eligible-diverse-content"
}
```

This is expected and proves historical QA/test drafts are no longer eligible.

Next work must focus on upstream current-story acquisition/generation so at least five production-eligible, genuinely distinct rugby drafts exist. Then verify those five through the already-proven AUTO-001 path.

Track this under `AUTO-004` in `docs/08_Issue_Log.md`.

## NOTIFY-003 — complete

PR #159 corrected the technical-alert event identity and delivery-status semantics.

Before the fix, every daily-package failure on a given day used `daily-package-failure:YYYY-MM-DD`, so different failures could collide in Make deduplication, and any Make 2xx response was incorrectly reported as `technicalAlertStatus: sent`.

After PR #159:

- materially different failure types use distinct stable daily deduplication IDs;
- exact retries of the same failure type reuse the same ID;
- a Make 2xx response is reported as `technicalAlertStatus: accepted` rather than claiming email delivery.

Production verification passed:

1. the first `insufficient-production-eligible-diverse-content` failure returned HTTP 409 / `technicalAlertStatus: accepted` and delivered one email to `admin@therugbypanda.ie`;
2. replaying the exact same production failure returned the same 409 / `accepted` result and produced no second email;
3. the temporary Preview-only verifier was removed from its unmerged test branch.

PR #159 merged as `f07383c5e15c74f5b537f73de787d75a25942b96`.

## AUTO-003 after AUTO-004

- Complete overnight acquisition/generation so five eligible current drafts exist before package time.
- Configure the daily invocation around 07:50–07:55 Europe/Dublin.
- Verify retry/failure semantics through NOTIFY-002/NOTIFY-003.
- Complete three consecutive deliveries before 08:00.

## Other current priorities

- Launch package: introduction article is live; at least eight additional reviewed, image-backed launch articles remain required.
- Dependabot #146 requires deliberate regression testing before merge.
- Dependabot #147 must not be merged as-is because its TypeScript 7 preview is incompatible with the current Next.js compiler expectation.
- SOCIAL-001 follows only after editorial automation is stable.

## Completion rule

Always report separately: implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity Studio verified, Make verified, Meta verified and documentation updated.
