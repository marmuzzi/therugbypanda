# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

20 August 2026, after production verification of PR #188 style diversity, PR #190 generation-timeout alignment, PR #192 bounded originality retry / subject-evidence image relevance, and a deliberately small measured Apify precision sample.

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
11. `docs/41_2026-08-18_Precision_Editorial_Image_Acquisition.md`
12. `docs/42_2026-08-18_Editorial_Originality_Gate.md`
13. `docs/43_2026-08-20_AUTO-004_Resume.md`
14. `docs/44_2026-08-20_Owner_Priorities.md`
15. `docs/45_2026-08-20_Editorial_Style_and_Safety_Verification.md`
16. all newer numbered handoff, automation, media, Sprint, launch and FinOps documents relevant to the task.

Where older documentation conflicts with a later reconciled state or handoff, the newer document wins. Do not use chat history as the source of truth.

## Operating context

- Timezone: `Europe/Dublin`.
- Daily editorial deadline: 08:00 Europe/Dublin.
- Daily target: five review-ready drafts and exactly one consolidated editorial email.
- Core readiness target: 26 August 2026.
- Meaningful go-live target: 27 August 2026.
- GitHub is the source of truth for versioned project state.
- Sanity is the canonical CMS and mandatory editorial approval boundary.
- No acquired or generated article/image is automatically published.
- Original Rugby Panda photography is preferred where relevant.
- Third-party photographs require documented rights and editorial relevance before approval.

## Architecture

```text
GitHub source of truth
→ Make.com orchestration
→ precision acquisition
→ Editorial Brain and structured generation
→ deterministic originality gate
→ subject-relevant rights-approved image assignment or no image
→ Sanity canonical CMS and human editorial review
→ Vercel public website
→ Meta social distribution only after controlled publication
```

## Reconciled live baseline — 20 August 2026

- Production reader site is healthy on Vercel and `https://therugbypanda.ie` is live.
- AUTO-001 consolidated five-article delivery, NOTIFY-001, NOTIFY-002 and NOTIFY-003 remain production verified. AUTO-001 was not restarted during the 20 August quality work.
- PR #188 merged as `a1ae569bad4f4e4a279dcb947b3f4cd9e5f594f5`, reached production READY and was verified reachable through the production domain. It introduced deterministic editorial style profiles, three article presentation variants, removed the forced three-section shape, locked the 26/27 August launch dates, set the 200 approved-media launch floor / 500 operating target and tightened precision-acquisition caps.
- PR #190 merged as `836563e7050662a21fbe36c2623dcc66abcb2ea5`, reached production READY and production runtime confirmed a 110-second OpenAI generation safety budget inside the route's existing 120-second maximum.
- PR #192 merged as `3540757e305d71c9889f4fec1350d1147c6f6d05`, reached production READY and introduced one bounded originality recomposition attempt without changing any originality thresholds, plus strict positive subject evidence for automatic image assignment.
- Controlled trigger PRs #189, #191 and #193 were merged only to rerun the established AUTO-004 verification path; they do not represent new product functionality.

## Editorial content contract

A Rugby Panda article must be an original synthesis, not a rewrite of one source.

For each story, acquisition should deliberately build a multi-source evidence pack. Use official/primary sources for hard facts and reputable secondary reporting for additional context, interviews, analysis and useful colour. Reconcile conflicts conservatively and preserve source traceability. Generated copy should add Rugby Panda editorial value and avoid close paraphrasing.

Where evidence supports it, articles should name relevant players, coaches, new signings and selection battles, and explain what supporters should watch for. Reader-facing copy must not explain internal sourcing rules, confidence ledgers, AI/process mechanics or why speculation is being handled in a particular way.

### Originality verification state

The deterministic originality gate is now directly production-proven fail-closed before Sanity write.

On the 20 August controlled Munster story:

- attempt 1 was rejected for 13 consecutive normalized shared words and 28.6% six-word phrase coverage against `munster-preseason-squad-2026`;
- after PR #192, one fresh recomposition attempt was permitted without weakening thresholds;
- attempt 2 was again rejected at 13 shared words and 32.1% six-word coverage;
- the API failed and the prior Sanity revision remained unchanged.

Therefore the guard itself is working. The current blocker is that one short dense primary-source excerpt contains a concentrated list of names/facts that repeatedly trips the coverage metric even after recomposition. Do not weaken originality thresholds merely to pass the batch. Correct the protected source material/overlap treatment for unavoidable factual lists while preserving deterministic fail-closed plagiarism protection.

## Editorial style-diversity state

PR #188 style machinery is active in production, but the complete five-story quality sign-off is not yet complete because the first Munster story currently fails the originality gate and the sequential importer stops.

The current deterministic generation-profile mapping for the stable AUTO-004 IDs is:

- Munster: `news-desk`
- Connacht: `feature`
- Ulster: `match-notebook`
- Leinster: `feature`
- Ireland Women: `feature`

The first successful post-#188 Munster output showed real improvement over the old template: a direct lead, fewer headings and a more natural section count. However, three of five stable IDs map to `feature`, so package-level balancing is required before the five-story daily package can be considered genuinely varied by design.

The public article page has three deterministic slug-based presentation variants that vary content width, image dimensions/frame and Key Points placement. Those layout variants are independent of the five generation styles.

## Editorial image contract

Automatic image assignment is relevance-first and fail-closed.

- A province mismatch is not an acceptable fallback.
- A province-specific story now requires positive image metadata for the same province before automatic assignment.
- An Ireland story now requires image metadata that explicitly identifies Ireland.
- Generic rugby, article-layout and usage terms do not count as subject evidence.
- Generic or unrelated approved imagery must not be assigned merely because no better image exists.
- Match the article through team, named person, fixture/event, competition or venue where possible.
- If no sufficiently relevant approved image exists, leave the article without an automatically assigned image.
- Ageing Pandas/amateur-veterans imagery must never illustrate a professional province/national-team story unless the story concerns that team/event.

### 20 August production diagnosis

A prior post-#188 Munster draft had received `editorialImage-original-1000090450`, titled `Sevilla veterans rugby portrait`. The image is grassroots veterans rugby in Sevilla and has no Munster or La Rochelle relationship.

Root cause: the old score allowed generic rugby vocabulary and article-use metadata to cross the relevance threshold.

PR #192 removes that path and requires positive subject evidence. The fix is merged and production READY; representative successful proof that a regenerated province story now resolves to no image when no matching approved image exists is still pending because the Munster generation currently fails originality before reaching the Sanity writer.

Legacy AUTO-004 drafts still contain known unrelated images from before #192 and require cleanup/replacement; do not treat them as valid launch media.

## Media baseline — 20 August 2026

Sanity production currently contains:

- 278 Editorial Image documents total.
- 22 Editorial Images with `usageApproved == true`, lifecycle `approved/published`, and a local Sanity image asset.
- 35 Brand Asset records total.
- 24 Brand Asset records marked approved for editorial use.
- 0 Brand Assets currently with a local `logo.asset` reference; 22 of the approved records still point at external candidate URLs.

The 24 approved Brand Asset records must therefore remain separately governed and should not be counted as launch-ready local logo assets until their actual logo files are imported and no-hotlink/public-use requirements are verified.

The project is materially below the 200 approved usable media launch floor.

## MEDIA-007 — precision acquisition state

The broad 18 August Openverse collection produced high raw volume but low editorial value. PR #179 fixed source-metadata relevance proof and prohibited broad query metadata from proving its own relevance.

PR #188 further tightened the operational acquisition rules:

- default result cap: 3 per query;
- hard cap: 5 per query;
- initial paid/test batch: no more than 12 queries and no more than 40 total returned results;
- continuation threshold: at least 60% useful approval yield;
- current/relevant imagery preferred; old material is acceptable only for genuine historical/context/venue use;
- assistant performs first-pass clear approve/reject decisions; only uncertainty is escalated.

### Measured precision sample on 20 August

A deliberately small Apify/Openverse sample was run at three requested results per query:

1. `Munster Rugby La Rochelle` — 0 returned candidates.
2. `Connacht Rugby Will Connors` — 0 returned candidates.
3. `Ulster Rugby Jamie Benson` — 0 returned candidates.
4. `Leinster Rugby South Africa` — 1 returned candidate, but it was an unrelated Lord Killanin/Howth Village photograph matched through loose metadata/tags.

Measured useful yield: **0 useful assets**. Three searches had zero recall and the single returned image was rejected as unrelated.

Do not scale this Openverse query pattern. It is far below the 60% continuation threshold. Change source/query strategy before any further meaningful Apify spend, then run another tiny measured sample.

## AUTO-004 — current state

AUTO-004 remains In Progress.

Verified:

- QA/test exclusion from production packages;
- explicit production eligibility metadata;
- source/topic/angle package diversity guard;
- reusable controlled acquisition-batch import path;
- production authentication and Sanity taxonomy path;
- package notification suppression on a successful controlled story;
- deterministic originality gate failing before Sanity write;
- bounded second originality attempt also remaining fail-closed;
- style-profile selection active in production;
- #192 strict image subject-evidence code deployed.

Still pending:

- correct the Munster protected-source/overlap problem without weakening originality safety;
- add package-level style balancing so five stories do not cluster three into `feature`;
- regenerate all five controlled stories successfully;
- inspect all five side-by-side for headline construction, opening, paragraph rhythm, subheadings, overall structure, conclusion and layout;
- production-prove #192 image fail-closed behaviour with a successful draft reaching the Sanity writer and receiving no unrelated fallback;
- clean legacy wrong image assignments;
- authenticated Studio body-edit verification;
- verify exactly one consolidated AUTO-001 email for a complete regenerated five-story package.

## AUTO-003 — remaining morning orchestration

After AUTO-004 quality is verified:

1. complete persistent overnight multi-source acquisition/generation;
2. configure and verify scheduled invocation around 07:50–07:55 Europe/Dublin;
3. verify retry/failure handling through the technical-alert path;
4. deliver five eligible, distinct, review-ready drafts before 08:00 for three consecutive days.

## Launch state

- Core readiness target remains 26 August 2026.
- Meaningful go-live target remains 27 August 2026.
- Introduction article is live.
- Minimum media floor is 200 approved usable assets; 500 is the stronger operating target.
- Current locally usable approved Editorial Image count is 22, so the launch-media gap is significant.
- Approved Brand Asset records are not yet locally imported logo assets and must remain separately reported.

## Immediate priority

1. Preserve the working originality thresholds; fix the short dense source-excerpt/overlap-model problem rather than weakening the gate.
2. Add package-level style-profile balancing for a five-story batch.
3. Rerun the same controlled five-story independent-source batch and complete side-by-side editorial inspection.
4. Verify in production that unrelated approved images now resolve to no image after a successful story reaches Sanity.
5. Clean the legacy wrong image assignments on the five old AUTO-004 drafts.
6. Do not run another broad image scrape. Redesign the precision source/query strategy, then run another tiny measured sample only.
7. Move separately governed approved logos into local Sanity assets before counting them toward launch-ready usable media.
8. Then continue the remaining priorities: Facebook/Instagram publication snippets, phone-first upload and the 14:00 major-announcement check.

## Completion rule

Always distinguish implemented, committed, PR opened, merged, deployed, verified in production, verified in authenticated Sanity Studio, verified in Make.com, verified in Meta and documentation updated. A feature is not complete until its relevant verification has passed.

## Working principles

- Prefer maintainable reusable components.
- Keep `main` deployable.
- Keep `docs/08_Issue_Log.md` current.
- Batch related changes when appropriate to reduce unnecessary deployments.
- Never restart a verified workflow merely to recreate state that is already proven.
