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
13. any newer handoff, automation, Sprint, launch or FinOps documents.

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
- `AUTO-001 – Morning Editorial Package` is complete and production verified as the delivery receiver.
- Make.com Core is active at USD $10.59/month.
- `Rugby Panda Event Deduplication` is the verified persistent deduplication store for NOTIFY-001, NOTIFY-002 and AUTO-001.
- SOCIAL-001 application foundation is deployed but Meta delivery is not verified.
- AUTO-003 remains in progress for overnight generation, scheduling and repeated on-time operation.
- AUTO-004 is the immediate critical issue: controlled-QA/test drafts can enter a real morning package and current generation does not guarantee story diversity.

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
- a Review in Sanity link opened the exact corresponding draft;
- the temporary Preview-only verifier was removed from its test branch and was never merged to production.

Do not rebuild AUTO-001 delivery.

## AUTO-004 — exact resume point

The successful production package contained five historical controlled-QA documents whose IDs begin `article-controlled-qa-`. All five covered essentially the same World Rugby Law 8 scoring angle.

This is not a Make delivery defect. Next work must:

1. inspect package eligibility and generation metadata;
2. add a maintainable production-eligibility signal that excludes controlled-QA/test artifacts;
3. avoid relying only on document-ID naming if a stronger schema field is appropriate;
4. enforce topic/source/angle diversity across the five morning stories;
5. verify the fix through the already-verified AUTO-001 path using five current, distinct, non-test rugby stories.

Track this under `AUTO-004` in `docs/08_Issue_Log.md`.

## AUTO-003 after AUTO-004

- Complete overnight acquisition/generation so five eligible current drafts exist before package time.
- Configure the daily invocation around 07:50–07:55 Europe/Dublin.
- Verify retry/failure semantics through NOTIFY-002.
- Complete three consecutive deliveries before 08:00.

## Other current priorities

- Launch package: introduction article is live; at least eight additional reviewed, image-backed launch articles remain required.
- Dependabot #146 requires deliberate regression testing before merge.
- Dependabot #147 must not be merged as-is because its TypeScript 7 preview is incompatible with the current Next.js compiler expectation.
- SOCIAL-001 follows only after editorial automation is stable.

## Completion rule

Always report separately: implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity Studio verified, Make verified, Meta verified and documentation updated.
