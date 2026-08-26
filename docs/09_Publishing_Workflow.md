# Publishing Workflow

Sanity Studio is the canonical CMS and mandatory human approval/publication boundary.

## Session startup

Read `docs/07_Project_State.md`, `docs/08_Issue_Log.md`, this file and the newest relevant handoff/evidence documents. Check GitHub, Vercel and available project integrations before asking the owner to configure anything. Use Europe/Dublin for schedules.

## Completion and deployment discipline

Always distinguish implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity verified, orchestration verified, Meta verified and documentation updated. Batch related changes and minimise unnecessary Vercel deployments.

## Editorial flow

```text
06:30 Europe/Dublin scheduled acquisition/generation
→ multi-source evidence pack
→ Editorial Brain / fact ledger
→ original structured generation
→ deterministic originality + Draft Ready gates
→ Publication Review + bounded correction when needed
→ deterministic post-review normalization + gates
→ relevance-first image selection (hero + optional inline visuals) or no image
→ evidence-backed contextual-card enrichment when useful
→ production-eligible Sanity draft
→ five distinct accepted morning positions
→ 07:45 exactly-once consolidated Zoho editorial email
→ human review/edit in Sanity
→ publish or reject
→ public website
→ controlled social distribution after publication
```

Generated content and acquired images are never automatically published.

## Draft Ready, originality and cost-efficient recovery

Generation uses validated evidence/fact-ledger material rather than source prose. Originality remains fail-closed.

Hard Draft Ready limits: headline <=70 characters, standfirst <=220, SEO title <=60, SEO description <=160, paragraph <=120 words, plus filler/formulaic-writing and qualified-projection safeguards.

Recovery rules:

1. preserve every already-accepted morning position;
2. regenerate only missing/rejected positions;
3. use deterministic sentence/word-boundary normalization where safe;
4. split overlong paragraphs deterministically rather than regenerate an otherwise valid article;
5. after bounded Publication Review correction, rerun normalization + Draft Ready + originality;
6. never weaken editorial or image gates to obtain 5/5;
7. diagnose measured failures instead of blind retry loops.

The five-story package allocates one each of `news-desk`, `analysis-led`, `feature-led`, `notebook`, `explainer`.

## Morning package — production verified

- Acquisition/generation: **06:30 Europe/Dublin**.
- Consolidated delivery: **07:45 Europe/Dublin**.
- Five distinct eligible drafts are required; incomplete packages fail closed.
- Individual morning notifications are suppressed.
- Exactly one consolidated review package is sent through direct Zoho SMTP to `editor@therugbypanda.ie`.
- A Sanity lock keyed to operational date + package fingerprint prevents duplicate delivery.
- Production evidence: one 5/5 trigger returned Zoho SMTP `250 Message received`; identical re-trigger returned `already-sent` with no second SMTP send.
- Gmail is not part of the editorial path.

## Rejection and replacement

A rejection must immediately request a genuinely different replacement. #202 emits the acquisition event; `/api/editorial/replacement` rejects identical source sets/repeated angles and requires normal generation/originality/Draft Ready/image safeguards.

Production E2E remains blocked because `EDITORIAL_REPLACEMENT_WEBHOOK_URL` is not configured. Do not reject a live review draft merely to reproduce this known missing-orchestrator failure.

## Images and article visual breaks

Only rights-reviewed, usage-approved **local Sanity assets** are eligible for automatic assignment. External URLs alone never satisfy readiness.

Priority is current exact-subject photography → relevant recent team/event/venue → useful relevant historical/context → approved relevant logo when appropriate → no image. Relevance is more important than filling a slot.

The same asset must not be reused across the current five-story package. Never use a photograph whose metadata names a person absent from the article. Reject conflicting team/province context. Ireland Women material requires women-specific evidence when an Ireland image is selected.

A story may contain up to three automatic inline images when its text genuinely supports them. Selection may use:

- an exact player/coach/subject match in the paragraph;
- a same-team/venue/context image when that team/context is materially discussed in the paragraph;
- strong paragraph-level semantic overlap with no conflicting named person/team.

Inline images are placed immediately after a materially relevant paragraph. Package/body asset dedupe and the hard three-image cap remain. If no strong candidate passes, use fewer images rather than filler.

Contextual cards are deterministic post-Publication-Review visual breaks built from sourced fact-ledger facts. A card needs at least two supported rows. Player-card portraits remain exact-subject only.

### Measured launch-night visual state — 26 August

After #279 production deployment and Sanity readback:

- Connacht front-row story: 0 inline; team card 4 rows.
- Ireland Women / Finn: 3 inline; Ireland card 4 rows.
- Joey Carbery / Leinster: 1 inline; Carbery card 4 rows + portrait.
- Munster Academy: 3 inline; Munster card 4 rows.
- Iain Henderson / Ulster: 2 inline; Henderson card 2 rows.

This is an improvement, not completion. Connacht and Carbery remain visually shallow, and Henderson’s additional team-context material is older than preferred. Continue targeted current/recent acquisition rather than lowering relevance rules.

The strict local media library reached 212 publication-ready Sanity assets after a targeted 26 August acquisition/import, with 12 new assets, zero failed imports and zero duplicate asset groups in that import.

## Public presentation and mobile review

#229 provides content-led article treatments, #230 homepage hierarchy, #241 reusable contextual cards, #276 card population/inline visual enrichment, #278 responsive mobile Editorial Review, and #279 safer paragraph-level image depth. All are merged; current runtime through #280 is Vercel production READY.

Representative public article/homepage desktop/mobile rendering still needs human-approved published-content verification. Do not publish a draft solely to manufacture evidence.

## Social distribution

Only a successful controlled human `publish` action may emit `editorial.article.published`. The payload contains a stable `eventId`, article URL, featured image, Facebook teaser, Instagram caption/hashtags and taxonomy context. Sanity retains social opt-out/status/event metadata.

The downstream social orchestrator must deduplicate by event ID, respect opt-out, post to the connected Facebook Page and Instagram professional account, store both platform post IDs, retry only failed platforms and never roll back website publication.

PR #280 added a protected production configuration diagnostic. Production evidence on 26 August returned `socialWebhookConfigured:false` and `socialWebhookSecretConfigured:false`. Therefore SOCIAL-001 is blocked before provider delivery: configure the production `SOCIAL_PUBLISHING_WEBHOOK_URL` (and secret if the orchestrator requires it), then run one controlled article publication and verify Facebook + Instagram post IDs plus duplicate/retry behaviour. No Meta post has yet been claimed.

## Other launch paths

- MEDIA-004: secure phone-first image upload remains open.
- NEWS-001: implement/verify a conditional 14:00 Europe/Dublin major-announcement check that creates an extra article only when a genuinely significant event warrants it; no qualifying event means no model/article spend.
- AUTO-002: complete rejection → different replacement after its webhook/orchestrator is configured.
- Authenticated Sanity edit/save/reload and final public presentation proofs remain where owner session is genuinely required.

## AI FinOps

- Existing prepaid OpenAI balance is the ceiling; do not add credit to brute-force retries.
- Production remains GPT-5 while cheaper alternatives fail to prove equivalent editorial quality.
- GPT-5-mini completed a controlled 5/5 benchmark but needed correction/polish; no production switch.
- Gemini must not be claimed as tested until a real integration/credential and controlled run exist.

## Current verification boundary — 26 August 2026 launch night

Production-verified: strict local media floor expanded to 212; five-story package; exactly-once direct Zoho delivery; contextual cards on all five current drafts; richer inline-image assignments with wrong-person fail-close safety; mobile Editorial Review runtime deployment; protected SOCIAL-001 configuration check.

Still open: Connacht/Carbery/fresh-Henderson image depth and representative public rendering; social webhook/orchestrator + real Meta provider proof; rejection replacement E2E; secure phone upload; 14:00 conditional check; authenticated Sanity interaction proofs; remaining security/backup/accreditation checks; final editorial/go-live acceptance.
