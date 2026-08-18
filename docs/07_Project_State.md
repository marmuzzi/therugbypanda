# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

18 August 2026, after PR #179 merged the precision Editorial Image acquisition fix and its code was verified on READY Vercel preview deployments; production deployment of the merge commit is currently blocked by the Vercel build-rate limit.

## Source of truth

Read first in future sessions:

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
15. `docs/39_2026-08-18_AUTO-004_Multisource_Image_Handoff.md`
16. `docs/40_2026-08-18_Apify_Editorial_Image_Candidate_Expansion.md`
17. `docs/41_2026-08-18_Precision_Editorial_Image_Acquisition.md`
18. all newer numbered handoff, automation, media, Sprint, launch and FinOps documents relevant to the task.

Where older documentation conflicts with a later reconciled state or handoff, the newer document wins. Do not use chat history as the source of truth.

## Operating context

- Timezone: `Europe/Dublin`.
- Daily editorial deadline: 08:00 Europe/Dublin.
- Daily target: five review-ready drafts and one consolidated editorial email.
- GitHub is the source of truth for versioned project state.
- Sanity is the canonical CMS and mandatory editorial approval boundary.
- No acquired or generated article/image is automatically published.
- Original Rugby Panda photography is preferred where relevant.
- Third-party photographs require documented rights and editorial relevance before approval.

## Architecture

```text
GitHub source of truth
→ Make.com orchestration
→ Apify multi-source acquisition
→ Editorial Brain and structured generation
→ relevant rights-approved Editorial Image assignment
→ Sanity canonical CMS and human editorial review
→ Vercel public website
→ Meta social distribution only after controlled publication
```

## Reconciled live baseline — 18 August 2026

- Production reader site is healthy on Vercel.
- `https://therugbypanda.ie` remains live with the launch introduction as lead article.
- AUTO-001 consolidated five-article delivery, NOTIFY-001, NOTIFY-002 and NOTIFY-003 are production verified.
- AUTO-004 production eligibility/diversity guard is production verified and excludes QA/test drafts.
- A controlled AUTO-004 import successfully created five current production drafts after GitHub/Vercel secret alignment and the Sanity province-taxonomy fix in PR #173.
- PR #174 merged morning notification suppression, concrete reader-facing generation requirements and direct body editing in Editorial Review.
- PR #175 merged richer five-story verification packets.
- PR #176 merged all-source synthesis and fail-closed image relevance; its production deployment is READY, but representative regenerated-story verification remains pending.
- PR #177 merged the 18 August Apify Editorial Image candidate expansion, source/rights metadata enrichment and candidate-only import path.
- After `APIFY_TOKEN` and a rotated replacement `SANITY_API_TOKEN` were configured in GitHub Actions, the `Import Apify Editorial Image Candidates` workflow completed GREEN.
- The importer used by that run had a hard minimum of 200 genuinely new records after filtering and Sanity deduplication and forced every imported record to `lifecycleStatus=candidate` and `usageApproved=false`.
- A quick visual review showed that only a minority of the imported results appeared useful enough. The current problem is acquisition precision and review efficiency, not raw candidate volume.
- PR #179 merged as `1e27411884c108448f8398b71af9c6f92af09b09` with the precision acquisition fix. The individual code commits built READY on Vercel preview deployments, but the merge-to-production deployment was refused because the Vercel account hit its build-rate limit. Therefore #179 is merged and preview-build verified, but not production deployed or production verified.

## Editorial content contract

A Rugby Panda article must be an original synthesis, not a rewrite of one source.

For each story, acquisition should deliberately build a multi-source evidence pack. Use official/primary sources for hard facts and reputable secondary reporting for additional context, interviews, analysis and useful colour. Reconcile conflicts conservatively and preserve source traceability. Generated copy should add Rugby Panda editorial value and avoid close paraphrasing.

Where evidence supports it, articles should name relevant players, coaches, new signings and selection battles, and explain what supporters should watch for. Reader-facing copy must not explain internal sourcing rules, confidence ledgers, AI/process mechanics or why speculation is being handled in a particular way.

## Editorial image contract

Automatic image assignment is relevance-first and fail-closed.

- A province mismatch is not an acceptable fallback.
- Generic or unrelated approved imagery must not be assigned merely because no better image exists.
- Match the article through team, named person, fixture/event, competition or venue where possible.
- If no sufficiently relevant approved image exists, leave the article without an automatically assigned image.
- Ageing Pandas/amateur-veterans imagery must never illustrate a professional province/national-team story unless the story concerns that team/event.

## MEDIA-007 — current precision acquisition state

The first 18 August collection generated 912 raw Openverse records and the subsequent import workflow completed GREEN. The high volume did not translate into sufficiently high editorial value.

### Root cause

The original importer built its relevance text from both source image metadata and `run.query` / `run.scope`. This allowed the search request itself to satisfy its own relevance test. For example, an image returned by a Leinster search could pass a Leinster check because `Leinster` existed in the run metadata even when the image's title/tags/source metadata did not prove a Leinster connection.

### Precision fix merged in PR #179

PR #179 is merged on `main` as `1e27411884c108448f8398b71af9c6f92af09b09`.

Merged implementation:

- relevance proof uses **source image metadata only**;
- acquisition query/scope remain provenance/context only and cannot prove relevance;
- future run records can carry exact `requiredSignals` which must appear in source metadata;
- generic high-noise queries are forbidden by policy;
- `data/editorial-images/acquisition-targets-2026-27.json` provides maintained target entities;
- `scripts/generate-precision-apify-image-plan.mjs` generates narrow, capped search plans;
- package command `media:plan-precision-acquisition` generates the plan without spending on Apify.

Deployment state:

- the underlying code commits each produced READY Vercel preview deployments;
- the merge commit's production deployment is currently blocked by Vercel build-rate limiting;
- do not call #179 deployed or production verified until a production deployment reaches READY.

### Coverage policy

Precision acquisition remains broad enough for Rugby Panda coverage:

- all 16 URC clubs;
- all Six Nations teams;
- all 12 Nations Championship teams;
- Champions Cup and Challenge Cup subjects relevant to coverage;
- Ireland Men and Ireland Women;
- current priority Irish players/coaches;
- new signings as editorial subjects are identified;
- professional match/training action and relevant venues only when tied to an exact subject.

The maintained 2026/27 target list should be refreshed from official competition/team sources before future season-wide runs.

### Cost-control policy

- Default Openverse result cap: 6 per query.
- Absolute plan cap: 8 per query.
- Player/coach searches: normally 4 results.
- Do not execute every generated query automatically.
- Run Tier 1 first, measure useful-image yield, then expand only where justified.
- No further broad paid Apify image crawl should run.
- The next paid run should be a deliberately small Tier-1 precision sample after #179 is production deployed or after deployment is otherwise confirmed not to affect the acquisition code path.

### Review model

The intended operating model is AI-led review for clear cases:

- approve when visual subject, editorial relevance and rights metadata are clear;
- reject obvious irrelevance, poor quality, duplicates or unsuitable rights;
- leave only genuinely uncertain cases for owner review.

Acquisition itself remains candidate-only and never auto-approves third-party imagery.

## AUTO-004 — current state

AUTO-004 remains In Progress.

Verified:

- QA/test exclusion from production packages;
- explicit production eligibility metadata;
- source/topic/angle package diversity guard;
- reusable controlled acquisition-batch import path;
- GitHub/Vercel production authentication path after secret rotation;
- correct Sanity province taxonomy mapping;
- first controlled five-current-story draft import.

Merged/deployed but still requiring representative verification:

- one consolidated morning notification instead of five per-draft emails (#174);
- concrete, player-aware, supporter-focused copy with no internal process language (#174);
- direct article-body editing in Editorial Review (#174);
- deliberate multi-source synthesis across all source records (#176);
- fail-closed relevant image selection (#176).

Still pending:

- production deployment/verification of #179 after the Vercel build-rate limit clears;
- small-batch precision-yield verification;
- AI-led review of the current imported image pool;
- representative production verification of #176 fail-closed selection;
- multi-source acquisition packs and regeneration for the five representative stories;
- authenticated Studio body-edit verification;
- exactly one consolidated AUTO-001 email for the regenerated five-story package.

## AUTO-003 — remaining morning orchestration

After AUTO-004 quality is verified:

1. complete persistent overnight multi-source acquisition/generation;
2. configure and verify scheduled invocation around 07:50–07:55 Europe/Dublin;
3. verify retry/failure handling through the technical-alert path;
4. deliver five eligible, distinct, review-ready drafts before 08:00 for three consecutive days.

## Launch state

The introduction article is live. The minimum launch package still requires at least eight additional reviewed, image-backed articles covering recent internationals and all four Irish provinces, followed by production verification of homepage, News/category and article routes.

## Immediate priority

1. Wait for or retry the Vercel production deployment for PR #179 after the build-rate limit clears, then verify READY.
2. Do not spend on another broad Apify crawl.
3. Review the current candidate pool with AI handling clear approve/reject decisions and owner escalation only for uncertainty when the Sanity review connector is available.
4. Run a deliberately small Tier-1 precision acquisition sample and measure useful-image yield before expansion.
5. Return to AUTO-004 multi-source regeneration and verify #176 fail-closed image behaviour.
6. Verify direct body editing, morning notification suppression and exactly one consolidated AUTO-001 package email.
7. Complete AUTO-004, then finish AUTO-003 scheduling and three-day verification.

## Completion rule

Always distinguish implemented, committed, PR opened, merged, deployed, verified in production, verified in authenticated Sanity Studio, verified in Make.com, verified in Meta and documentation updated. A feature is not complete until its relevant verification has passed.

## Working principles

- Prefer maintainable reusable components.
- Keep `main` deployable.
- Keep `docs/08_Issue_Log.md` current.
- Batch related changes where practical to conserve deployments.
- Keep separate Make scenarios focused on one responsibility.
- Do not expose internal AI/process references on reader-facing pages.
- Do not publish third-party photographs without documented rights.
- Do not hotlink unreviewed external image candidates into public templates.
