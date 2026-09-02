# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

2 September 2026, after production verification of the exact-five visual repair, approved Brand Asset localization, current-package Editorial Review isolation and PR #358 production deployment.

## Source of truth

Read first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. newest numbered handoff/evidence documents relevant to the task
5. `docs/79_2026-09-02_Launch_Night_Visual_and_Brand_Verification.md`
6. `docs/78_2026-09-01_Editorial_Diversity_and_Context_Card_Quality.md`
7. `docs/77_2026-09-01_WEB014_Metadata_Title_Composition.md`
8. `docs/75_2026-09-01_AUTO003_Zoho_Source_Identity_Fix.md`
9. `docs/74_2026-09-01_P0_Package_Diversity_and_Image_Contract.md`
10. `docs/63_2026-08-31_P0_Incremental_Same_Day_Recovery.md`

Where older documents conflict with later measured production evidence, newer evidence wins. Chat history is not project truth.

## Operating targets

- Timezone: Europe/Dublin.
- Daily contract: exactly five fresh, review-ready production drafts plus exactly one consolidated Zoho editorial notification **delivered before 08:00 Europe/Dublin**.
- Sanity is the canonical CMS and mandatory human publication boundary.
- GitHub is the versioned project source of truth.
- Batch related changes and minimise Vercel deployments.
- OpenAI spend is capped to the existing prepaid balance; no top-up.

## Editorial contract

Articles are original multi-source Rugby Panda synthesis, not rewrites. Freshness identity is subject + event/development + editorial angle. Originality and Draft Ready checks remain deterministic and fail closed. Current hard limits are headline <=70 characters, standfirst <=220, SEO title <=60, SEO description <=160 and paragraph <=120 words, plus filler/formulaic-writing/projection safeguards.

Generated article strings are structured content, not Markdown. Package generation allocates one each of `news-desk`, `analysis-led`, `feature-led`, `notebook`, `explainer`. Style profiles already differ in opening, paragraph rhythm, heading count and presentation and explicitly forbid Markdown/bold markers. Owner review on 1 September found the copy acceptable but somewhat repetitive; future-package style variety remains an editorial-quality verification item rather than a reason to regenerate the accepted 1 September package.

Publication Review is mandatory before a draft becomes production-eligible. Human Sanity publication remains mandatory.

## Editorial automation — current verified state

### Morning package / AUTO-003 / AUTO-004

The scheduled current-source workflow consumes the source registry and runs the protected freshness/evidence/generation/review/image path.

Production recovery run `33505534217` on 1 September proved the current foundations:

- 24/24 current sources succeeded, 0 failed; 102 current leads.
- 45 rugby seeds became 25 clusters and 23 corroborated candidates.
- 19/23 candidates passed the concrete pre-generation evidence gate.
- package diversity rejected excessive same-matchup concentration before generation.
- the final verification retained five valid drafts and generated zero new drafts.
- exact-five image planning found 15 strong local candidates, three per article.
- PR #344 made Zoho an exact-package identity/cardinality handoff.
- Zoho accepted the exact five with SMTP `250 Message received`; event `editorial-daily-package:2026-09-01:fede43938366` recorded the exact article/input IDs.
- an immediate rerun found accepted evidence and skipped acquisition, generation, images and email, proving duplicate suppression.

The exact five delivered were:

1. `current-2026-09-01-cb1f46c78399` — WXV / England Rugby / women's ball development.
2. `current-2026-09-01-ac8539699e76` — Ryan Caldwell and Irish rugby.
3. `current-2026-09-01-7545042164a1` — Frankie Sheahan / Munster.
4. `current-2026-09-01-1df6f8baaaf3` — Kolbe / All Blacks selection pressure.
5. `current-2026-09-01-930d0d48bc05` — Erasmus / Springboks-All Blacks scrum dispute.

A later owner observation exposed that the package could still contain a misleading photo association even though the earlier mechanical readback passed. PRs #353-#355 and #358 hardened the repair and future assignment path. Production Actions run `33568855778` on #358 completed successfully with `status: verified`, `articleCount: 5` and Sanity readback for all five. The France-v-South-Africa hero previously visible on the Erasmus article is gone; that article now uses All Blacks-context imagery. Four current articles have two meaningful inline images and the Kolbe article has one rather than filler.

The next required proof is the 2 September **normal scheduled-day** package, including actual workflow start/package-ready/Zoho-accepted timestamps and delivery before 08:00 Europe/Dublin. Gmail is not part of the editorial path.

### Resilience / AUTO-005

- Same-day recovery preserves valid accepted drafts and fills only missing or evicted slots.
- Evidence insufficiency, package concentration and image impossibility are rejected before avoidable model spend where possible.
- Metadata/mechanical presentation failures are repaired deterministically where safe.
- Publication Review corrections are re-normalized through the same hard Draft Ready/originality boundaries.
- Production generation remains GPT-5; retries remain bounded.
- PR #346 raised only the bounded generation stage to 135 seconds; behavioural proof waits for the next genuine missing-slot generation.

### Rejection / replacement / AUTO-002

The application can emit a replacement request and the replacement endpoint requires a genuinely different source/angle and normal quality gates. End-to-end rejection replacement remains blocked because `EDITORIAL_REPLACEMENT_WEBHOOK_URL` is absent in production. Do not reject a live draft merely to reproduce that known infrastructure gap.

## Image contract and certified media state

Automatic image assignment is relevance-first and fail closed. Prefer current exact-subject photography, then useful relevant recent team/event/venue material, then relevant historical/context, then an approved relevant logo where appropriate; otherwise no image. Never substitute an unrelated named person, conflicting primary team or generic filler.

Third-party assets require rights metadata and local Sanity storage. External URLs do not count toward the usable library.

- 28 August baseline: 241 strict publication-ready local Sanity Editorial Images.
- 1 September recovery imported 21 additional rights-triaged local assets.
- **Current measured strict publication-ready local Editorial Image baseline: 262.**
- Production run `33568855778` revalidated and repaired the exact five after the owner-reported wrong-team image defect.
- Current exact-five image depth after that run is hero+2 inline for WXV, Ryan Caldwell, Erasmus and Frankie Sheahan; hero+1 inline for Kolbe.
- The visual repair made no GPT calls and did not resend Zoho.

MEDIA-009 remains open for long-term future-package proof, but the specific 1 September wrong-team association is closed by measured production evidence. MEDIA-011 remains an operating coverage-depth target, not a mandate to force image count.

## Brand Asset state

Brand marks are separately governed from Editorial Images. Public components may use only approved local Brand Assets and must fall back to text when a defensible mark is unavailable.

PR #357 allowed already-reviewed official marks served through an organisation's normal CDN to be localized without relaxing approval or local-storage requirements. Production workflow `33565257032` succeeded:

- 24 approved Brand Assets;
- 17 now local-ready;
- 5 newly localized in that run;
- 0 localization failures;
- 7 records still need manual source resolution.

Newly localized: Leinster Rugby, Munster Rugby, European Rugby Champions Cup, EPCR Challenge Cup and European Professional Club Rugby.

South Africa/Springboks and New Zealand/All Blacks have approved local assets and are supported by PR #358 aliases. Remaining missing-local approved records are Connacht Rugby, Fiji Rugby Union, Japan Rugby Football Union, Men's Rugby World Cup 2027, Rugby Australia, Rugby World Cup and World Rugby. Connacht currently has only an official-domain favicon candidate explicitly marked unsuitable as a public logo; retain text fallback until a proper reviewed source exists.

PR #358 added reusable approved-local brand resolution and article brand-mark rendering. Vercel production deployment `dpl_9TV5ck9V7EGHJPyV3QizAVFtKFYt` is READY. The code is deployed; public brand-mark rendering still requires representative human-published content to verify without violating the publication boundary.

## Article visual enrichment / CMS

- #229 content-led article treatments: merged/deployed.
- #230 homepage editorial hierarchy: merged/deployed.
- #241 contextual data-card schema/model/public renderer: merged/deployed.
- #276 deterministic contextual-card population plus inline images: merged/deployed.
- #278 responsive mobile Editorial Review: merged/deployed.
- #279 safer paragraph-level image depth: merged/deployed and production-Sanity verified.
- #348 public metadata title composition: merged/deployed/production verified.
- #350 contextual-card duplicate-label/value suppression: merged/deployed.
- #351 same-team package concentration cap: merged; next normal-day behavioural proof pending.
- #352 Editorial Review exact-current-package default: merged; Sanity Studio workflow `33556586157` succeeded; authenticated desktop verification showed `Today's package (5)` and a current package selection.
- #355 production hero provenance repair: merged/deployed.
- #356 production launch content audit: merged/deployed.
- #357 Brand Asset CDN localization: merged/deployed/production workflow verified.
- #358 strict image context + approved local article branding: merged, Vercel production READY, exact-five Sanity repair production verified.

Authenticated owner-phone interaction and representative public article/homepage rendering remain verification boundaries; do not publish solely to manufacture evidence.

## Social distribution / SOCIAL-001

The controlled publication event contract is deployed, but the downstream production social webhook/orchestrator remains absent. Social is explicitly excluded from the 2 September website go-live gate while Meta developer authorization remains externally blocked. No Facebook/Instagram provider post has been claimed.

## Remaining launch P0 priorities

1. Prove the 2 September normal scheduled morning path with five genuinely new positions and one Zoho package delivered before 08:00 Europe/Dublin.
2. Verify final authenticated owner-phone Editorial Review interaction and representative public article/homepage rendering after normal human publication.
3. Continue Brand Asset source resolution, with Connacht the highest-priority core-province gap; use text fallback until a proper approved source exists.
4. Observe #358 image-context safeguards on subsequent normal packages; do not weaken them to manufacture image depth.
5. Revisit social only when Meta authorization is available.

Secondary paths remain AUTO-002 rejection E2E, NEWS-001, secure phone-first upload, security/backup/recovery and accreditation/provider checks.

## Owner-help boundary

Routine implementation, merges, deterministic audits and clear image decisions should not require owner help. Escalate only genuinely ambiguous rights/relevance cases, unavailable external credentials/account authorization, authenticated owner-only verification, final editorial judgement and final go-live acceptance.

## Completion rule

Always distinguish implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity verified, orchestration verified, Meta verified and documentation updated. A feature is not complete until its relevant verification passes.
