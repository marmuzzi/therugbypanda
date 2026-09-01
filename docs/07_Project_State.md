# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

1 September 2026, after production verification of the autonomous current-source workflow, bounded same-day recovery, package-diversity enforcement, exact-five visual enrichment and exact-one Zoho delivery.

## Source of truth

Read first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. newest numbered handoff/evidence documents relevant to the task
5. `docs/75_2026-09-01_AUTO003_Zoho_Source_Identity_Fix.md`
6. `docs/74_2026-09-01_P0_Package_Diversity_and_Image_Contract.md`
7. `docs/63_2026-08-31_P0_Incremental_Same_Day_Recovery.md`

Where older documents conflict with later measured production evidence, newer evidence wins. Chat history is not project truth.

## Operating targets

- Timezone: Europe/Dublin.
- Daily contract: exactly five fresh, review-ready production drafts plus exactly one consolidated editorial notification before 08:00.
- Sanity is the canonical CMS and mandatory human publication boundary.
- GitHub is the versioned project source of truth.
- Batch related changes and minimise Vercel deployments.
- OpenAI spend is capped to the existing prepaid balance; no top-up.

## Editorial contract

Articles are original multi-source Rugby Panda synthesis, not rewrites. Freshness identity is subject + event/development + editorial angle. Originality and Draft Ready checks remain deterministic and fail-closed. Current hard limits are headline <=70 characters, standfirst <=220, SEO title <=60, SEO description <=160 and paragraph <=120 words, plus filler/formulaic-writing/projection safeguards.

Generated article strings are structured content, not Markdown. Package generation allocates one each of `news-desk`, `analysis-led`, `feature-led`, `notebook`, `explainer`. Publication Review is mandatory before a draft becomes production-eligible. Human Sanity publication remains mandatory.

## Editorial automation — current verified state

### Morning package / AUTO-003 / AUTO-004

The previously documented autonomous-scheduler gap is closed. The repository now contains a scheduled current-source workflow that consumes the source registry and runs the protected freshness/evidence/generation/review/image path.

Production recovery run `33505534217` on 1 September proved the current normal-path foundations:

- 24/24 current sources succeeded, 0 failed; verification attempt found 102 current leads.
- 45 rugby seeds became 25 clusters and 23 corroborated candidates.
- 19/23 candidates passed the concrete pre-generation evidence gate; four were rejected before GPT spend.
- same-package diversity limited the same canonical matchup to two positions and rejected 11 excess clustered candidates before generation.
- the existing five valid drafts were retained on verification; `createdDrafts: 0`, so the verification rerun made no GPT generation calls.
- exact-five image planning found 15 strong local candidates, three per article, with zero deficit.
- production Sanity visual enrichment/readback passed for all five.
- PR #343 corrected local source-label collisions in the delivery endpoint; production then exposed that any delivery-time source-overlap selector was itself the wrong boundary.
- PR #344 removed the duplicate editorial re-selection and made Zoho an exact-package identity/cardinality handoff: exactly five current eligible unique drafts, all image-ready, or fail closed.
- after #344 deployed, Zoho accepted the exact five with SMTP `250 Message received`; event `editorial-daily-package:2026-09-01:fede43938366` recorded the five exact article/input IDs.
- an immediate rerun found `acceptedEvidenceCount: 1`, `skip: true` and skipped acquisition, generation, images and email, proving no duplicate resend.

The exact five delivered were:

1. `current-2026-09-01-cb1f46c78399` — WXV / England Rugby / women’s ball development.
2. `current-2026-09-01-ac8539699e76` — Ryan Caldwell and Irish rugby.
3. `current-2026-09-01-7545042164a1` — Frankie Sheahan / Munster.
4. `current-2026-09-01-1df6f8baaaf3` — Kolbe / All Blacks selection pressure.
5. `current-2026-09-01-930d0d48bc05` — Erasmus / All Blacks scrum dispute.

Gmail is not part of the editorial path.

### Resilience / AUTO-005

- Same-day recovery preserves valid accepted drafts and fills only missing or evicted slots.
- Evidence insufficiency, package concentration and image impossibility are rejected before avoidable model spend where possible.
- Metadata/mechanical presentation failures are repaired deterministically where safe.
- Publication Review corrections are re-normalized through the same hard Draft Ready/originality boundaries.
- Production generation remains GPT-5; retries remain bounded.

### Rejection / replacement / AUTO-002

- The application can emit a replacement request and the replacement endpoint requires a genuinely different source/angle and normal quality gates.
- End-to-end rejection replacement remains blocked because `EDITORIAL_REPLACEMENT_WEBHOOK_URL` is absent in production. Do not reject a live draft merely to reproduce that known infrastructure gap.

## Image contract and certified media state

Automatic image assignment is relevance-first and fail-closed. Prefer current exact-subject photography, then useful relevant recent team/event/venue material, then relevant historical/context, then an approved relevant logo where appropriate; otherwise no image. Never substitute an unrelated named person or generic filler.

Third-party assets require rights metadata and local Sanity storage. External URLs do not count toward the usable library.

- 28 August baseline: 241 strict publication-ready local Sanity Editorial Images.
- 1 September recovery imported 21 additional rights-triaged local assets with zero import failures.
- **Current measured strict publication-ready local baseline: 262.**
- The Dundalk/Tommy Campbell position proved the fail-closed image contract: after targeted acquisition still produced no verified relevant hero, that one draft was evicted and only that slot was replaced.
- The final five each passed a three-candidate local image plan and production visual readback. Four articles received hero + two inline images; the Ryan Caldwell article received hero + one strong inline image rather than filler.

MEDIA-009 remains open for long-term wrong/duplicate-image prevention across future packages, but the 1 September exact five passed the current-package assignment/readback boundary. MEDIA-011 remains in progress as an operating coverage-depth target rather than a requirement to force three placements.

## Article visual enrichment / mobile CMS

- #229 content-led article treatments: merged/deployed.
- #230 homepage editorial hierarchy: merged/deployed.
- #241 contextual data-card schema/model/public renderer: merged/deployed.
- #276 deterministic contextual-card population plus inline images: merged/deployed.
- #278 responsive mobile Editorial Review: merged/deployed.
- #279 safer paragraph-level image depth: merged/deployed and production-Sanity verified.
- Final authenticated owner-phone interaction and representative published article/homepage rendering remain verification boundaries; do not publish solely to manufacture evidence.

## Social distribution / SOCIAL-001

The controlled publication event contract is deployed, but the downstream production social webhook/orchestrator remains absent. Protected production evidence showed `socialWebhookConfigured:false` and `socialWebhookSecretConfigured:false`. No Facebook/Instagram provider post has been claimed.

## Remaining launch P0 priorities

1. Prove the autonomous morning path on subsequent normal scheduled days, not just recovery reruns, while preserving the 1 September exact-five/fail-closed contracts.
2. Continue targeted rights-approved local media expansion from 262 toward 200-500 useful assets by coverage depth, not raw count.
3. Verify final authenticated mobile Editorial Review interaction and representative public article/homepage rendering.
4. Configure/verify SOCIAL-001 downstream provider orchestration if available authorization permits; otherwise record only the minimal owner-only authorization blocker.

Secondary paths remain AUTO-002 rejection E2E, NEWS-001, secure phone-first upload, security/backup/recovery and accreditation/provider checks.

## Owner-help boundary

Routine implementation, merges, deterministic audits and clear image decisions should not require owner help. Escalate only genuinely ambiguous rights/relevance cases, unavailable external credentials/account authorization, authenticated owner-only verification, final editorial judgement and final go-live acceptance.

## Completion rule

Always distinguish implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity verified, orchestration verified, Meta verified and documentation updated. A feature is not complete until its relevant verification passes.
