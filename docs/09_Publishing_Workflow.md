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
→ same-package matchup + team concentration gate
→ enough fresh, distinct, evidence-backed candidates for exactly five positions or fail closed
→ multi-source evidence pack
→ Editorial Brain / fact ledger
→ one-each differentiated style profile allocation
→ original structured generation only for missing positions
→ deterministic originality + Draft Ready gates
→ Publication Review + bounded correction when needed
→ deterministic post-review normalization + gates
→ production-eligible Sanity draft
→ local rights-approved image candidate planning with strict person/primary-team context
→ targeted image acquisition only for real deficits
→ exact-package hero/inline enrichment and Sanity readback
→ exactly five current eligible image-ready drafts
→ exactly-once consolidated Zoho editorial email containing those exact five IDs
→ Editorial Review opens on Today's package, with historical drafts separate
→ human review/edit in Sanity
→ publish or reject
→ public website
→ controlled social distribution after publication when provider authorization exists
```

Generated content and acquired images are never automatically published.

## AUTO-004 freshness, evidence and package-diversity gates

The permanent freshness identity is **subject + event/development + editorial angle**. Recent production Sanity drafts/published articles are loaded before generation. Candidate positions that collide with recent history or another position are rejected before model spend.

Before generation:

1. current registry sources are discovered;
2. non-rugby/noise leads are removed and related evidence is clustered;
3. under-specified candidates are rejected by the concrete-evidence gate;
4. production-history freshness is checked;
5. same-package concentration is checked, with a maximum of two positions for the same canonical two-team matchup;
6. PR #351 also caps recognised same-team concentration at two independent of matchup pair;
7. only missing slots are generated.

Production evidence from 1 September: 24/24 sources succeeded, 102 leads produced 23 corroborated candidates, 19 survived evidence sufficiency, and package diversity retained five while rejecting excess clustered candidates. The same-team extension awaits the next genuine normal package for behavioural proof rather than manufacturing paid generation.

## Draft Ready, Publication Review and style diversity

Generation uses validated evidence/fact-ledger material rather than source prose. Originality remains fail closed.

Hard Draft Ready limits: headline <=70 characters, standfirst <=220, SEO title <=60, SEO description <=160, paragraph <=120 words, plus filler/formulaic-writing and qualified-projection safeguards.

The five-story package allocates one each of `news-desk`, `analysis-led`, `feature-led`, `notebook`, `explainer` where generation is required. These profiles intentionally differ in opening style, paragraph rhythm, heading frequency and public presentation. All profiles prohibit Markdown/bold markers. News headings are optional, feature pieces may use one or none, analysis uses a small number of analytical movements, notebook permits characterful compact turns and explainer uses reader-oriented sections. Avoid converging all five into the same repeated bold-break cadence.

Owner review of the 1 September package found the articles acceptable but noted some repetitive visual breaks. Treat this as a future-package quality observation; do not regenerate an otherwise accepted package solely to exercise style changes.

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

## Images and exact-package visual gate

Only rights-reviewed, usage-approved **local Sanity assets** are eligible for automatic assignment. External URLs alone never satisfy readiness.

Priority is current exact-subject photography → relevant recent team/event/venue → useful relevant historical/context → approved relevant logo when appropriate → no image. Relevance is more important than filling a slot.

Image conflict rules now include:

- never use a photograph whose explicit person metadata names a person absent from the article;
- reject a photograph whose recognised primary-team context conflicts with the article's primary headline/standfirst teams;
- a South Africa/New Zealand story must not receive France-context photography merely because South Africa appears in both contexts;
- women-specific stories reject explicit men's imagery; incomplete neutral metadata alone is not treated as proof of conflict;
- package/body asset dedupe remains mandatory.

The operating target is at least three strong relevant local candidates per article where possible. That is a candidate-depth target, not a requirement to force three placements. Up to three automatic inline images may be used only where article text genuinely supports them.

If the local planner exposes a deficit, targeted rights/relevance-triaged acquisition runs only for that deficit. If acquisition still cannot produce a verified hero, the article is evicted and only that slot is replaced.

The strict local publication-ready Editorial Image baseline remains **262**. Production repair run `33568855778` after PR #358 verified all five 1 September heroes and inline assignments and removed the owner-reported wrong France-context hero. Current inline counts are 2, 2, 2, 2 and 1; fewer images remains preferable to filler. That repair made no GPT calls and sent no email.

## Brand Asset gate

Team/competition branding is governed separately from editorial photography.

A public brand mark must satisfy all of the following:

1. `brandAsset` is explicitly approved for editorial use and in approved lifecycle state;
2. source/rights metadata is retained;
3. the image is localized to a Sanity asset; external hotlinking is not a readiness state;
4. article/team aliases resolve deterministically to the approved record;
5. if no approved local mark resolves, render a clean text fallback rather than a questionable logo.

PR #357 permits an already reviewed official candidate to be localized when the rights-holder website serves the asset through its normal CDN; it does not turn an unreviewed URL into an approved logo. Production run `33565257032` left 17/24 approved records local-ready, including South Africa/New Zealand and newly localized Leinster, Munster and EPCR marks. Seven records remain manual-source gaps, including Connacht. Do not use Connacht's favicon fallback as a public logo.

PR #358 adds aliases such as Springboks/South Africa and All Blacks/New Zealand plus approved-local article brand rendering. Vercel production deployment `dpl_9TV5ck9V7EGHJPyV3QizAVFtKFYt` is READY. Public rendering verification still requires normal human-published content.

## Morning delivery — exact package and timing contract

The Zoho endpoint is a delivery boundary, **not another editorial selector**.

It queries only current Europe/Dublin operational-date drafts with:

- `morningPackageEligible == true`;
- `automationContentClass == production`;
- current-date `editorialInputId`;
- an allowed review workflow status.

Delivery requires exactly five records, five unique article IDs, five unique editorial input IDs and a verified hero boundary on all five. Fewer than five, more than five, duplicate identity or missing hero fails closed.

The endpoint sends those exact five; it does not backfill from older drafts or derive another subset based on source overlap. Upstream freshness/diversity/review/image gates are authoritative.

A Sanity lock keyed to operational date + package fingerprint records the exact article IDs and editorial input IDs and prevents duplicate SMTP delivery.

Production acceptance on 1 September:

- event `editorial-daily-package:2026-09-01:fede43938366`;
- exactly five current article/input IDs recorded;
- destination `editor@therugbypanda.ie`;
- Zoho SMTP response `250 Message received`;
- immediate rerun `acceptedEvidenceCount: 1`, `skip: true` and no duplicate send.

Operational requirement is **delivery before 08:00 Europe/Dublin**, not merely starting the workflow near 08:00. The 2 September normal scheduled run must record actual workflow start, package-ready and SMTP-accepted timestamps so late delivery is treated as a measurable failure. Gmail is not part of the editorial path.

## Editorial Review current-package boundary

PR #352 makes the default Editorial Review view `Today's package` rather than the complete historical draft pool. Current-package membership uses the same production/date identity as delivery. `Other drafts` remains available separately.

Sanity Studio run `33556586157` succeeded. Authenticated desktop owner verification showed `Today's package (5)` and a current-package story selected, closing the stale-selection launch defect. Responsive phone usability remains separately tracked by WEB-013.

## Rejection and replacement

A human rejection should request a genuinely different replacement. The application trigger and `/api/editorial/replacement` endpoint reject identical source sets/repeated angles and preserve normal quality gates.

Production E2E remains blocked because `EDITORIAL_REPLACEMENT_WEBHOOK_URL` is not configured. Do not reject a live review draft merely to reproduce this known missing-orchestrator failure.

## Public presentation and mobile review

#229 provides content-led article treatments, #230 homepage hierarchy, #241 reusable contextual cards, #276 contextual-card/inline visual enrichment, #278 responsive mobile Editorial Review and #279 safer paragraph-level image depth. #350 suppresses synthetic duplicate contextual-card labels/values. #358 adds approved local article brand marks.

The 1 September exact-five production readback showed contextual cards on all five accepted drafts. Representative public article/homepage desktop/mobile rendering still needs human-approved published-content verification. Final authenticated phone interaction in Editorial Review remains pending. Do not publish a draft solely to manufacture evidence.

## Social distribution

Only a successful controlled human `publish` action may emit `editorial.article.published`. The downstream provider remains externally blocked by Meta authorization and is explicitly excluded from the 2 September website go-live gate. No Meta provider post has been claimed.

## AI FinOps

- Existing prepaid OpenAI balance is the ceiling; do not add credit to brute-force retries.
- Production remains GPT-5 while cheaper alternatives fail to prove equivalent editorial quality.
- Evidence, freshness and package-diversity selection happen before generation.
- Same-day recovery reuses accepted positions; do not regenerate the entire package for one failure.
- Deterministic visual/brand repair must not call GPT.
- Do not use blind retries to manufacture five accepted positions.

## Current verification boundary — 2 September 2026

Production-verified foundations include autonomous current-source discovery; pre-generation evidence/freshness protection; matchup concentration protection; incremental recovery; strict local Editorial Image baseline 262; exact-five current visual repair with wrong-team image removal; exact-current-package Zoho delivery and duplicate suppression; Editorial Review current-package isolation on authenticated desktop; approved Brand Asset localization; and #358 production deployment.

Still open at P0: the 2 September normal scheduled 5/5 before-08:00 proof; same-team diversity behavioural proof; future-package image-context proof; final authenticated phone interaction; representative human-published public article/homepage rendering; and safe source resolution for remaining core brand gaps such as Connacht. Social is an explicit external exception.
