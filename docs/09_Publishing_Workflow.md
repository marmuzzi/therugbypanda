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
→ retained same-day integrity revalidation
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
→ visual eviction when acquisition cannot make a story assignment-safe
→ reapply same-package diversity against retained four + replacement pool
→ regenerate only the missing visual slot
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
2. non-rugby/noise leads are removed and related evidence is coherently corroborated;
3. under-specified candidates are rejected by the concrete-evidence gate;
4. retained same-day drafts are revalidated before they count toward 5/5;
5. production-history freshness is checked;
6. same-package concentration is checked, with a maximum of two positions for the same canonical two-team matchup;
7. recognised same-team concentration is capped at two independent of matchup pair;
8. only missing slots are generated.

Retained same-day drafts are not grandfathered merely because they were previously generated. They must still be production-class current-date drafts, pass the existing rugby-contamination and position-collision checks, and have at least **two valid source notes from two distinct publishers**. A failing retained draft is marked `morningPackageEligible=false` before recovery counts the package.

Production evidence from 3 September run `33706956178`: 24/24 sources succeeded, 116 leads produced 5 coherent corroborated candidates and the concrete-evidence gate accepted 5/5. The upstream diversity gate passed with max-two team/matchup limits before model spend.

## Draft Ready, Publication Review and style diversity

Generation uses validated evidence/fact-ledger material rather than source prose. Originality remains fail closed.

Hard Draft Ready limits: headline <=70 characters, standfirst <=220, SEO title <=60, SEO description <=160, paragraph <=120 words, plus filler/formulaic-writing and qualified-projection safeguards.

The five-story package allocates one each of `news-desk`, `analysis-led`, `feature-led`, `notebook`, `explainer` where generation is required. These profiles intentionally differ in opening style, paragraph rhythm, heading frequency and public presentation. All profiles prohibit Markdown/bold markers. News headings are optional, feature pieces may use one or none, analysis uses a small number of analytical movements, notebook permits characterful compact turns and explainer uses reader-oriented sections. Avoid converging all five into the same repeated bold-break cadence.

Post-review metadata normalization must preserve complete prose as well as length limits. When standfirst/SEO text exceeds its hard limit, prefer the last complete sentence within the boundary before clause/word fallback. Never make reviewed copy longer merely to approach the character limit. After normalization, rerun deterministic Draft Ready and originality gates.

Owner review of the 1 September package found the articles acceptable but noted some repetitive visual breaks. Treat this as a future-package quality observation; do not regenerate an otherwise accepted package solely to exercise style changes.

Recovery rules:

1. preserve only same-day production drafts that still pass retained evidence integrity, freshness and package-diversity checks;
2. evict the failing/over-clustered/image-impossible position rather than regenerate a healthy package;
3. regenerate only resulting missing slots from remaining fresh corroborated candidates;
4. use deterministic complete-sentence/clause/word-boundary normalization where safe, in that order;
5. split overlong paragraphs deterministically rather than regenerate an otherwise valid article;
6. after bounded Publication Review correction, rerun normalization + Draft Ready + originality;
7. Publication Review #2 blocks on critical/high issues; medium/low observations do not by themselves invalidate an otherwise deterministic-gate-passing draft;
8. after visual eviction, re-run the canonical same-team/same-matchup diversity component against the actual retained package and remaining recovery pool **before replacement model spend**;
9. never weaken editorial or image gates to obtain 5/5;
10. diagnose measured failures instead of blind retry loops;
11. perform evidence/freshness/diversity selection before generation to avoid wasteful model spend.

Generic/formulaic heading protection includes variants such as `What happened`, `Why this matters now`, `What to watch next`, `What happens next` and `what ... expect next` patterns.

## Images and exact-package visual gate

Only rights-reviewed, usage-approved **local Sanity assets** are eligible for automatic assignment. External URLs alone never satisfy readiness.

Priority is current exact-subject photography → relevant recent team/event/venue → useful relevant historical/context → approved relevant logo when appropriate → no image. Relevance is more important than filling a slot.

Image conflict rules include:

- never use a photograph whose explicit person metadata names a person absent from the article;
- reject a photograph whose recognised team context introduces a team absent from the story's relevant headline/standfirst context;
- canonical aliases are equivalent for matching: All Blacks/New Zealand, Springboks/South Africa, Wallabies/Australia and Pumas/Argentina;
- a South Africa/New Zealand story must not receive France-context photography merely because South Africa appears in both contexts;
- women-specific stories reject explicit men's imagery and vice versa; incomplete neutral metadata alone is not treated as proof of conflict;
- package/body asset dedupe remains mandatory.

The planner and final verifier must enforce the same hard team/person/event semantics. A planner candidate that final assignment would necessarily reject must not count toward local depth.

The operating target is at least three strong relevant local candidates per article where possible. That is a candidate-depth target, not a requirement to force three placements. Up to three automatic inline images may be used only where article text genuinely supports them.

If the local planner exposes a deficit, targeted rights/relevance-triaged acquisition runs only for that deficit. If acquisition still cannot produce at least the assignment-safe hero + meaningful-inline floor, the article is evicted and only that slot is replaced. The canonical package-diversity gate then runs again before replacement generation.

Production run `33706956178` exercised the #385 planner repair: only 2/5 articles initially met candidate depth and 7 genuine deficits were exposed; targeted acquisition/reconciliation raised strict local publication-ready Editorial Images to **354**. The same run production-exercised visual eviction and the post-eviction diversity recheck before exactly one replacement was generated. Final exact-five visual assignment remains pending because a separate editorial-quality fail-close deliberately reduced package eligibility before the last visual step.

## Brand Asset gate

Team/competition branding is governed separately from editorial photography.

A public brand mark must satisfy all of the following:

1. `brandAsset` is explicitly approved for editorial use and in approved lifecycle state;
2. source/rights metadata is retained;
3. the image is localized to a Sanity asset; external hotlinking is not a readiness state;
4. article/team aliases resolve deterministically to the approved record;
5. if no approved local mark resolves, render a clean text fallback rather than a questionable logo.

Production localization `33565257032` left 17/24 approved records local-ready, including South Africa/New Zealand, Leinster, Munster and EPCR marks. Seven records remain manual-source gaps, including Connacht. Do not use Connacht's favicon fallback as a public logo. These remaining brand gaps are not allowed to weaken editorial image relevance and are not the current morning-package P0.

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

For 3 September, exact-one evidence at the start of run `33706956178` was `acceptedEvidenceCount: 0`, `skip: false`. That run did **not** send Zoho: the final image/delivery path was skipped after a measured bad standfirst was failed closed and the exact-five image-plan step saw only four eligible drafts. Therefore the next successful package remains eligible for exactly one consolidated delivery.

Operational requirement is delivery before 08:00 Europe/Dublin when running normally. Gmail is not part of the editorial path.

## Editorial Review current-package boundary

The default Editorial Review view is `Today's package` rather than the complete historical draft pool. Current-package membership uses the same production/date identity as delivery. `Other drafts` remains available separately.

Authenticated desktop owner verification previously showed `Today's package (5)` and a current-package story selected. Responsive phone usability remains separately tracked by WEB-013.

## Rejection and replacement

A human rejection should request a genuinely different replacement. The application trigger and `/api/editorial/replacement` endpoint reject identical source sets/repeated angles and preserve normal quality gates.

Production E2E remains blocked because `EDITORIAL_REPLACEMENT_WEBHOOK_URL` is not configured. Do not reject a live review draft merely to reproduce this known missing-orchestrator failure. Autonomous current-source same-day recovery is a separate path and must not weaken this boundary.

## Public presentation and mobile review

#229 provides content-led article treatments, #230 homepage hierarchy, #241 reusable contextual cards, #276 contextual-card/inline visual enrichment, #278 responsive mobile Editorial Review and #279 safer paragraph-level image depth. #350 suppresses synthetic duplicate contextual-card labels/values. #358 adds approved local article brand marks.

Representative public article/homepage desktop/mobile rendering still needs human-approved published-content verification. Final authenticated phone interaction in Editorial Review remains pending. Do not publish a draft solely to manufacture evidence.

## Social distribution

Only a successful controlled human `publish` action may emit `editorial.article.published`. The downstream provider remains externally blocked by Meta authorization and is explicitly excluded from the website go-live gate. No Meta provider post has been claimed, and no Meta/social work belongs in the current morning-package recovery.

## AI FinOps

- Existing prepaid OpenAI balance is the ceiling; do not add credit to brute-force retries.
- Production remains GPT-5 while cheaper alternatives fail to prove equivalent editorial quality.
- Evidence, freshness and package-diversity selection happen before generation.
- Same-day recovery reuses only positions that still meet current integrity; do not regenerate the entire package for one failure.
- Deterministic visual/brand repair must not call GPT.
- Do not use blind retries to manufacture five accepted positions.

## Current verification boundary — 3 September 2026

Production-verified foundations now include autonomous current-source discovery; coherent corroboration and pre-generation evidence/freshness protection; matchup/team concentration protection; incremental recovery; strict local Editorial Image baseline **354**; planner/final-verifier context parity exercised in production; post-visual-eviction diversity recheck exercised in production; exact-current-package Zoho delivery and duplicate suppression proven on 1 September; Editorial Review current-package isolation; and approved Brand Asset localization.

Current P0 before the 3 September package can be declared successful: merge/deploy the complete-sentence post-review normalization and stronger retained multi-publisher integrity rules; refill the deliberately excluded weak legacy slots from current evidence; pass final exact-five visual assignment; and obtain exactly one Zoho acceptance record for the exact verified package. Human publication remains mandatory and social remains excluded.