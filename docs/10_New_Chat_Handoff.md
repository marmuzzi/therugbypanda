# New Chat Handoff

Use this file when continuing The Rugby Panda in a new chat.

## First actions

Read, in order:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/10_New_Chat_Handoff.md`
5. `docs/11_Editorial_Image_Archive.md`
6. `docs/12_Brand_Assets_Library.md`
7. `docs/33_Version_1_Product_Roadmap.md`
8. `docs/35_Automatic_Social_Distribution.md`
9. `docs/36_Publication_Preview_and_AI_Image_Selection.md`
10. `docs/37_Publication_Pipeline.md`
11. All later numbered documents relevant to the work, especially `docs/23_Make_Orchestration_Architecture.md`, `docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md`, `docs/27_Sprint_5_Production_State.md`, `docs/31_NOTIFY_001_Desktop_Completion_Handoff.md` and `docs/32_Sprint_5_State_After_PR_91.md`.

Then inspect live `main`, open pull requests, Vercel status and available connectors before changing anything. Do not rely on chat history for current status.

## User execution instruction

When the project owner says **Proceed**, it is an execution command.

- Continue the agreed implementation immediately.
- Do not restart strategy discussion.
- Use available project tools and connectors.
- Report completed work, verification and genuine blockers only.
- Never claim a change was made unless it was executed and verified at the appropriate level.

## Operating context

- Project owner timezone: `Europe/Dublin`.
- Daily target: eight review-ready drafts by 08:00 Europe/Dublin.
- Repository: `marmuzzi/therugbypanda`.
- Production: `https://therugbypanda.ie`.
- GitHub is the source of truth.
- Sanity is the mandatory human approval boundary.
- No AI-generated or acquired content is automatically approved.
- One article approval authorises website publication and automatic social distribution unless the editor selects the exception override.

## Current baseline

- Sprint 4 is complete; Sprint 5 is in progress.
- Editorial Review, AI Editorial Review, approved-image assignment, workflow endpoints and real website search are merged.
- Automatic hosted Sanity Studio deployment is working.
- The review-ready webhook reaches Make.
- A test email reached `editor@therugbypanda.ie`.
- NOTIFY-001 remains pending correct production field mapping, persistent `eventId` deduplication, duplicate replay and failure-path verification.
- The currently exposed Make connector does not allow scenario editing.
- PR #100, Social Publishing Foundation, is merged.
- PR #101, Publication Preview and AI Image Selection contract, is open and mergeable. It is not yet merged, deployed or production verified.
- `main` includes `docs/35_Automatic_Social_Distribution.md`.
- This documentation handoff is being prepared on branch `docs/sprint-5-publication-pipeline-handoff`.

## Approved publication architecture

The approved workflow is:

```text
AI-assisted draft
→ human editorial review in Sanity
→ one approval
→ controlled website publication
→ automatic publication preparation
→ gather usage-approved image candidates
→ AI image ranking
→ select website, Facebook and Instagram images
→ generate platform-specific captions
→ prepare website preview and readiness checks
→ create idempotent social publishing event
→ Make.com orchestration
→ Facebook and Instagram delivery
→ write back platform IDs, URLs, retries and errors
```

There is no second social-media approval.

The editor may use **Skip automatic social distribution** only as an exception.

Website publication and social delivery remain technically independent. A social, Make.com, Meta or preparation failure must never roll back or unpublish the website article.

## Mandatory image rules

- Every article promotion post must include a picture.
- Text-only article promotion is prohibited.
- Only usage-approved images with adequate rights metadata may be considered.
- AI may select different images for website, Facebook and Instagram.
- Missing-image delivery must wait, record an actionable failure and retry after an eligible image is added.
- Fixing a missing image does not require another editorial approval.

## Publication Preview direction

The visual Sanity Publication Preview is the next major UI component after PR #101. It should surface:

- website preview;
- website image selection;
- Facebook image and copy preview;
- Instagram image and copy preview;
- SEO score;
- accessibility score;
- social-readiness score;
- passed checks;
- warnings;
- failures;
- automatic fixes.

This is an automatic preparation and confidence layer, not another approval gate.

## Make.com implementation direction

The Make.com publication scenario must:

- validate the event and secret;
- enforce stable `eventId` idempotency;
- respect the social skip override;
- gather eligible image candidates;
- run AI image ranking and caption generation;
- transform or crop images for each platform;
- publish to Facebook and Instagram;
- preserve successful platform posts if another platform fails;
- retry only failed platforms;
- write status, platform IDs, URLs, attempts and errors back to Sanity;
- send terminal failures to `admin@therugbypanda.ie`.

The current Make connection cannot edit scenarios. Build instructions must therefore be provided manually unless a future conversation exposes Make scenario-management tools.

## Editorial Review behaviour

The workspace contains Review Queue, Draft Editor, Editorial Review Summary, AI Editorial Review, Featured Image, Sources, Fact Ledger, Workflow and Audit History panels.

Current verified behaviour includes:

- Studio-session authentication without a browser-entered automation secret.
- Submission/rejection notes with mandatory rejection reason.
- Manually created unpublished drafts appear before workflow metadata exists.
- Raw, draft-aware Sanity querying with `_id in path("drafts.**")`.
- Article Quality first on mobile and AI Editorial Review immediately below it.
- Improved mobile contrast across findings, metadata, Sources, Fact Ledger and Workflow fields.
- AI findings become **Out of date** after relevant edits and can be rerun.

## Relevant recent PRs

- PR #84 — Studio-session authentication and workflow note restoration.
- PR #85 — notification delivery observability.
- PR #86 — manual-draft queue support and automatic Studio deployment.
- PR #87 — raw draft perspective.
- PR #88 — supported Sanity draft path filter.
- PR #89 — enriched NOTIFY-001 payload and desktop Make handoff.
- PR #90 — mobile quality-panel readability.
- PR #91 — remaining mobile card and workflow-field contrast.
- PR #100 — Social Publishing Foundation.
- PR #101 — Publication Preview and AI Image Selection contract; open at time of handoff.

## Immediate next tasks

1. Review, merge and verify PR #101.
2. Merge this documentation handoff after confirming it accurately reflects repository state.
3. Build the visual Publication Preview component in Sanity Studio.
4. Define and implement the Make.com publication-preparation and social-distribution scenario.
5. Implement AI image ranking using usage-approved Editorial Images only.
6. Implement platform-specific captions and image transforms.
7. Verify stable idempotency, partial success, retries and missing-image recovery.
8. Complete NOTIFY-001 production mapping and persistent deduplication.
9. Add NOTIFY-002 technical alerts to `admin@therugbypanda.ie`.
10. Run a complete controlled editorial lifecycle through production rendering and downstream preparation.
11. Continue the nine-article launch package.

## Completion rule

Always distinguish implemented, committed, merged, deployed, verified in production, verified in authenticated Sanity Studio and documentation updated. A feature is not complete until its relevant verification has passed.

## Recommended continuation prompt

```text
Continue The Rugby Panda in marmuzzi/therugbypanda. Before doing anything else, read docs/07_Project_State.md through docs/12_Brand_Assets_Library.md, then docs/33_Version_1_Product_Roadmap.md, docs/35_Automatic_Social_Distribution.md, docs/36_Publication_Preview_and_AI_Image_Selection.md and docs/37_Publication_Pipeline.md. Inspect live main, open pull requests, Vercel and available Make tools. Use the repository as the single source of truth. Continue from PR #101 and the one-click publication architecture: one human approval, automatic website publication preparation, AI selection of usage-approved website/Facebook/Instagram images, platform captions, readiness checks and Make.com delivery. Website publication must remain independent from social failures, and text-only social promotion is prohibited. Keep docs/08_Issue_Log.md current and report implemented, committed, merged, deployed and verified separately.
```
