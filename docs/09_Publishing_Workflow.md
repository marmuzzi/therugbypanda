# Publishing Workflow

Sanity Studio is the canonical CMS and mandatory human approval/publication boundary.

## Session startup

Read `docs/07_Project_State.md`, `docs/08_Issue_Log.md`, this file and the newest relevant handoff/evidence documents. Check GitHub, Vercel and available project integrations before asking the owner to configure anything. Use Europe/Dublin for schedules.

## Completion and deployment discipline

Always distinguish implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity verified, orchestration verified, Meta verified and documentation updated. Batch related changes and minimise unnecessary Vercel deployments.

## Editorial flow — required normal contract

```text
scheduled current-source discovery/acquisition
→ versioned source registry + current developments
→ evidence sufficient to identify subject + event/development + editorial angle
→ recent production Sanity editorial-position history
→ pre-generation freshness selector
→ same-package diversity/concentration gate
→ enough fresh, distinct, evidence-backed candidates for exactly five positions or fail closed
→ multi-source evidence pack
→ Editorial Brain / fact ledger
→ original structured generation only for missing positions
→ deterministic originality + Draft Ready gates
→ Publication Review + bounded correction when needed
→ deterministic post-review normalization + gates
→ production-eligible Sanity draft
→ local rights-approved image candidate planning
→ targeted image acquisition only for real deficits
→ exact-package hero/inline enrichment and Sanity readback
→ exactly five current eligible image-ready drafts
→ exactly-once consolidated Zoho editorial email containing those exact five IDs
→ human review/edit in Sanity
→ publish or reject
→ public website
→ controlled social distribution after publication
```

Generated content and acquired images are never automatically published.

## AUTO-004 freshness, evidence and package-diversity gates

The permanent freshness identity is **subject + event/development + editorial angle**. Recent production Sanity drafts/published articles are loaded before generation. Candidate positions that collide with recent history or another position are rejected before model spend.

The autonomous current-source workflow is now implemented and production-exercised. The older scheduler-gap documentation is historical and must not be treated as the current state.

Before generation:

1. current registry sources are discovered;
2. non-rugby/noise leads are removed and related evidence is clustered;
3. under-specified candidates are rejected by the concrete-evidence gate;
4. production-history freshness is checked;
5. same-package concentration is checked, with a current maximum of two positions for the same canonical two-team matchup;
6. only missing slots are generated.

Production evidence from 1 September: 24/24 sources succeeded, 102 leads produced 23 corroborated candidates, 19 survived evidence sufficiency, and the package-diversity gate retained five while rejecting 11 excess clustered candidates.

## Draft Ready, Publication Review and cost-efficient recovery

Generation uses validated evidence/fact-ledger material rather than source prose. Originality remains fail-closed.

Hard Draft Ready limits: headline <=70 characters, standfirst <=220, SEO title <=60, SEO description <=160, paragraph <=120 words, plus filler/formulaic-writing and qualified-projection safeguards.

Recovery rules:

1. preserve every same-day production draft that still passes integrity and package-diversity checks;
2. evict only the failing/over-clustered/image-impossible position;
3. regenerate only the resulting missing slot from remaining fresh corroborated candidates;
4. use deterministic sentence/word-boundary normalization where safe;
5. split overlong paragraphs deterministically rather than regenerate an otherwise valid article;
6. after bounded Publication Review correction, rerun normalization + Draft Ready + originality;
7. Publication Review #2 blocks on critical/high issues; medium/low observations do not by themselves invalidate an otherwise deterministic-gate-passing draft;
8. never weaken editorial or image gates to obtain 5/5;
9. diagnose measured failures instead of blind retry loops;
10. perform evidence/freshness/diversity selection before generation to avoid wasteful model spend.

Generic/formulaic heading protection includes variants such as `What happened`, `Why this matters now`, `What to watch next`, `What happens next` and `what ... expect next` patterns.

The five-story package allocates one each of `news-desk`, `analysis-led`, `feature-led`, `notebook`, `explainer` where generation is required.

## Images and exact-package visual gate

Only rights-reviewed, usage-approved **local Sanity assets** are eligible for automatic assignment. External URLs alone never satisfy readiness.

Priority is current exact-subject photography → relevant recent team/event/venue → useful relevant historical/context → approved relevant logo when appropriate → no image. Relevance is more important than filling a slot.

Never use a photograph whose metadata names a person absent from the article. Reject conflicting team/province context. Women-specific articles require women-specific evidence where appropriate. Package/body asset dedupe remains mandatory.

The current operating target is at least three strong relevant local candidates per article where possible. That is a candidate-depth target, not a requirement to force three placements. Up to three automatic inline images may be used only where the article text genuinely supports them.

If the local planner exposes a deficit, targeted rights/relevance-triaged acquisition runs only for that deficit. If acquisition still cannot produce a verified hero, the article is evicted and only that slot is replaced. The Dundalk/Tommy Campbell story on 1 September production-proved this fail-closed path.

After the recovery acquisition, the strict local publication-ready baseline is **262**. The accepted 1 September exact five each had three strong local candidates. Final Sanity readback verified all five heroes and inline assignments before delivery.

## Morning delivery — exact package contract

The Zoho endpoint is a delivery boundary, **not another editorial selector**.

It queries only current Europe/Dublin operational-date drafts with:

- `morningPackageEligible == true`;
- `automationContentClass == production`;
- current-date `editorialInputId`;
- an allowed review workflow status.

Delivery requires exactly five records, exactly five unique article IDs, exactly five unique editorial input IDs and a verified hero boundary on all five. Fewer than five, more than five, duplicate identity or missing hero fails closed.

The endpoint sends those exact five; it does not backfill from older drafts or derive another subset based on source overlap. Upstream freshness/diversity/review/image gates are authoritative.

A Sanity lock keyed to operational date + package fingerprint records the exact article IDs and editorial input IDs and prevents duplicate SMTP delivery.

Production acceptance on 1 September:

- event: `editorial-daily-package:2026-09-01:fede43938366`;
- exactly five current article/input IDs recorded;
- destination: `editor@therugbypanda.ie`;
- Zoho SMTP response: `250 Message received`;
- evidence update: recorded;
- immediate rerun: `acceptedEvidenceCount: 1`, `skip: true`; acquisition, generation, image and email steps all skipped.

Gmail is not part of the editorial path.

## Rejection and replacement

A human rejection should request a genuinely different replacement. The application trigger and `/api/editorial/replacement` endpoint reject identical source sets/repeated angles and preserve normal quality gates.

Production E2E remains blocked because `EDITORIAL_REPLACEMENT_WEBHOOK_URL` is not configured. Do not reject a live review draft merely to reproduce this known missing-orchestrator failure.

## Public presentation and mobile review

#229 provides content-led article treatments, #230 homepage hierarchy, #241 reusable contextual cards, #276 contextual-card/inline visual enrichment, #278 responsive mobile Editorial Review and #279 safer paragraph-level image depth. These foundations are merged/deployed.

The 1 September exact-five production readback showed contextual cards on all five accepted drafts. Representative public article/homepage desktop/mobile rendering still needs human-approved published-content verification. Final authenticated phone interaction in Editorial Review remains pending. Do not publish a draft solely to manufacture evidence.

## Social distribution

Only a successful controlled human `publish` action may emit `editorial.article.published`. The payload contains stable event identity, article URL, featured image and social copy metadata. Sanity retains opt-out/status/event metadata.

The downstream social orchestrator must deduplicate by event ID, respect opt-out, post to the connected Facebook Page and Instagram professional account, store both platform post IDs, retry only failed platforms and never roll back website publication.

Production diagnostic evidence still shows the downstream social webhook/secret absent. Therefore SOCIAL-001 remains blocked before provider delivery. No Meta post has been claimed.

## AI FinOps

- Existing prepaid OpenAI balance is the ceiling; do not add credit to brute-force retries.
- Production remains GPT-5 while cheaper alternatives fail to prove equivalent editorial quality.
- Evidence, freshness and package-diversity selection happen before generation.
- Same-day recovery reuses accepted positions; do not regenerate the entire package for one failure.
- Do not use blind retries to manufacture five accepted positions.
- The 1 September final acceptance rerun retained five and created zero drafts, so it made no new GPT generation calls. Exact earlier recovery dollar/token cost was not emitted and must not be invented.

## Current verification boundary — 1 September 2026

Production-verified foundations now include: autonomous current-source discovery; pre-generation evidence/freshness protection; same-package matchup concentration protection; incremental same-day recovery; strict local media baseline 262; targeted visual-deficit acquisition and bounded visual slot replacement; exact-five visual Sanity readback; exact-current-package Zoho delivery; and duplicate suppression.

Still open at P0: consecutive normal scheduled-day proof; final owner editorial judgement on representative current drafts; authenticated mobile Editorial Review interaction; representative public article/homepage rendering; and the social downstream/provider connection or sole minimal owner-authorized exception.
