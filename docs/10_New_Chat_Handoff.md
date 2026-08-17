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
14. `docs/38_2026-08-17_End_of_Session_Handoff.md`
15. any newer handoff, automation, Sprint, launch or FinOps documents.

Then inspect GitHub `main`, recent PRs/commits, Vercel production/preview state, current Sanity draft state and currently available connectors. Repository documentation is authoritative over chat memory.

## Operating context

- Repository: `marmuzzi/therugbypanda`
- Production: `https://therugbypanda.ie`
- Timezone: `Europe/Dublin`
- Daily target: five review-ready drafts and one consolidated editorial email by 08:00
- Sanity is the mandatory human approval boundary
- Editorial experience: Draft → human review/edit → Publish
- No AI-generated or acquired content is automatically approved or published

## Verified baseline — end of 17 August 2026 session

- Production is healthy on Vercel.
- NOTIFY-001, NOTIFY-002 and NOTIFY-003 are production verified.
- AUTO-001 Morning Editorial Package delivery is production verified.
- AUTO-004 production eligibility/diversity guard is production verified to exclude historical QA/test content; five-current-story generation/delivery remains pending.
- AUTO-005 same-day package identity correction is merged and deployed via PR #161 (`9438a12c162c28a92842ecab5975fd93e8497635`): exact package retries deduplicate, materially changed same-day packages receive a new stable content fingerprint.
- CMS-003 restored the accidentally deleted canonical `Welcome to The Rugby Panda` article. Article route, homepage lead and News archive were verified.
- WEB-009 is production verified: the article detail uses the explicitly assigned featured image rather than silently substituting an unrelated fallback.
- About-page reader positioning was updated in PR #168 and verified in production. Approach is `Context over noise`; Standards is `Independent and accountable`. Do not reintroduce reader-facing discussion of AI/technology or human-controlled publishing mechanics.
- Make.com Core is active at USD $10.59/month.
- SOCIAL-001 application foundation is deployed but Meta delivery is not verified.
- AUTO-003 remains in progress for persistent overnight acquisition/generation, scheduling and repeated on-time operation.

## AUTO-004 — exact resume point

Do not rebuild AUTO-001 delivery, NOTIFY scenarios or the AUTO-004 production guard.

The next work is upstream current-story acquisition/generation so at least five production-eligible, genuinely distinct rugby drafts exist, followed by delivery through AUTO-001.

Five distinct official-source candidate directions were prepared but **must be revalidated before use**:

1. Munster — La Rochelle pre-season fixture.
2. Connacht — pre-season build-up.
3. Ulster — opening URC fixtures.
4. Leinster — South African URC start.
5. Ireland Women — WXV/autumn programme.

A temporary Preview-only generation controller was prepared during the session, but work was interrupted before the five-story sequence was verified. Inspect Sanity first and do not assume any candidate draft exists.

The next chat is expected to expose the Apify connector. Check actual tool availability first. If Apify is available, use it to continue the persistent acquisition layer for AUTO-004/AUTO-003 instead of treating temporary manually structured candidates as the final architecture.

## AUTO-003 after AUTO-004

- Complete persistent overnight acquisition/generation so five eligible current drafts exist before package time.
- Configure the daily invocation around 07:50–07:55 Europe/Dublin.
- Verify retry/failure semantics through the production technical-alert path.
- Complete three consecutive deliveries before 08:00.

## Other current priorities

- Launch package: the restored introduction article is live; at least eight additional reviewed, image-backed launch articles remain required.
- Dependabot #146 requires deliberate regression testing before merge.
- Dependabot #147 must not be merged as-is while its TypeScript 7 upgrade is incompatible with the current Next.js compiler expectation.
- SOCIAL-001 follows only after editorial automation is stable.

## Completion rule

Always report separately: implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity Studio verified, Make verified, Meta verified and documentation updated.
