# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

18 August 2026, after PR #176 reached a READY production deployment and the 200+ Editorial Image candidate expansion was implemented from a 912-record Apify/Openverse collection.

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
16. all newer numbered handoff, automation, media, Sprint, launch and FinOps documents relevant to the task.

Where older documentation conflicts with a later reconciled state or handoff, the newer document wins. Do not use chat history as the current source of truth.

## Operating context

- Timezone: `Europe/Dublin`.
- Daily editorial deadline: 08:00 Europe/Dublin.
- Daily target: five review-ready drafts and one consolidated editorial email.
- GitHub is the source of truth for versioned project state.
- Sanity is the canonical CMS and mandatory human approval boundary.
- No acquired or generated article/image is automatically approved or published.
- Original Rugby Panda photography is preferred.
- Third-party photographs require documented rights or explicit permission before public use.

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
- PR #174 merged as `acac0fab15fd208a3609ca8eeac6ea70509c9e7d` and fixes morning notification suppression, concrete reader-facing generation requirements and direct body editing in Editorial Review.
- PR #175 merged as `11a0adac765b6d4050dc67cd772d23b420d4e396` with richer controlled five-story source packets for verification.
- PR #176 merged as `1470df4d9cf5ca0111a0fe1402742ac400b42440`. Its Vercel production deployment is now READY. Representative regenerated-story verification is still required before calling the new synthesis/image-selection behaviour production verified.
- The existing five AUTO-004 drafts pre-date #176 and still contain some historical image assignments, so they are not valid evidence for or against the new fail-closed selector.
- Apify is available and was used on 18 August for the explicit image-candidate expansion task.

## Editorial content contract

A Rugby Panda article must be an original synthesis, not a rewrite of one source.

For each story, acquisition should deliberately build a multi-source evidence pack. Use official/primary sources for hard facts and reputable secondary reporting for additional context, interviews, analysis and useful colour. Reconcile conflicts conservatively and preserve source traceability. Generated copy should add Rugby Panda editorial value and avoid close paraphrasing.

Where evidence supports it, articles should name relevant players, coaches, new signings and selection battles, and explain what supporters should watch for. Reader-facing copy must not explain internal sourcing rules, confidence ledgers, AI/process mechanics or why speculation is being handled in a particular way.

## Editorial image contract

Automatic image assignment is relevance-first and fail-closed.

- A province mismatch is not an acceptable fallback.
- Generic or unrelated approved imagery must not be assigned merely because no better image exists.
- The image should match the article subject through team, named person, fixture/event, competition or venue where possible.
- If no sufficiently relevant approved image exists, leave the article without an automatically assigned image.
- Ageing Pandas/amateur-veterans imagery must never illustrate a professional province/national-team story unless the story is actually about that team/event.

## Editorial Image candidate expansion — current state

Apify/Openverse acquisition on 18 August produced 912 raw records across 32 recorded runs covering the requested province, national-team, European competition, international, match-action, training and venue scopes.

The raw result count is deliberately not treated as the candidate count. On branch `media/2026-08-18-apify-image-candidates` the project now has:

- a versioned Apify run/dataset manifest at `data/editorial-images/apify-collection-2026-08-18.json`;
- `scripts/import-apify-editorial-image-candidates.mjs`, which filters licence/file/noise/relevance problems and deduplicates source records plus existing Sanity entries;
- a hard minimum of 200 genuinely new candidates before the importer can report success;
- candidate-only import semantics: `lifecycleStatus = candidate`, `usageApproved = false`;
- enriched Editorial Image fields for source page, creator, team, named people, competition/event, event date and acquisition provenance;
- Image Review cards that surface subject and rights context during human review.

The collection milestone is **implemented but not yet complete** until the branch is merged, its import workflow succeeds, and a Sanity query verifies at least 200 genuinely new candidate-only records. No acquired image becomes approved automatically.

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

- merge/deploy/import verification for the 200+ Editorial Image candidate expansion;
- representative production verification of #176 fail-closed selection;
- multi-source acquisition packs for the five representative stories;
- regeneration and editorial inspection of those five stories;
- authenticated Sanity Studio verification of body editing and expanded Image Review;
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

1. Merge/deploy the Editorial Image expansion and verify at least 200 genuinely new candidate-only records in Sanity.
2. Verify the expanded authenticated Image Review queue and preserve the human rights/editorial approval boundary.
3. Build multi-source evidence packs and regenerate the five AUTO-004 stories.
4. Verify #176 fail-closed image behaviour with representative province/national stories.
5. Verify editorial quality, direct body editing and suppression of five individual morning draft emails.
6. Run AUTO-001 and verify exactly one consolidated five-article email.
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
