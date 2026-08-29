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
→ exactly five genuinely new distinct positions or fail closed
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

## AUTO-004 freshness gate

The permanent freshness identity is **subject + event/development + editorial angle**. Recent production Sanity drafts/published articles are loaded before generation. Candidate positions that collide with recent history or with another candidate in the same package are rejected before model spend. Exactly five fresh survivors are required; otherwise the morning acquisition path fails closed.

PRs #293-#295 implemented and deployed that protection. PR #297 additionally removed the old default repository-batch fallback, so the importer cannot silently replay a stale five-pack when no explicit batch is supplied.

### Launch-critical scheduler boundary

The repository does **not** currently contain a normal autonomous 06:30 current-source discovery/acquisition schedule. The existing `import-editorial-acquisition-batch.yml` is an importer, not a current-news discovery worker. Earlier documentation that described 06:30 acquisition/generation as production-verified is superseded by `docs/56_2026-08-29_AUTO004_Normal_Scheduler_Gap.md`.

Do not add a cron around the importer alone. The correct scheduled worker must consume the source registry, discover current developments, build evidence-backed candidate identities, run the production-history freshness selector before generation, require exactly five survivors, and only then invoke the existing generation/review/import path. Consecutive normal-day AUTO-004 proof cannot begin until that worker is implemented, merged, deployed and actually scheduled.

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
7. diagnose measured failures instead of blind retry loops;
8. perform freshness/source selection before generation to avoid wasteful model spend.

The five-story package allocates one each of `news-desk`, `analysis-led`, `feature-led`, `notebook`, `explainer`.

## Morning delivery — production verified portion

- Consolidated delivery: **07:45 Europe/Dublin**.
- Five distinct eligible drafts are required; incomplete packages fail closed.
- Individual morning notifications are suppressed.
- Exactly one consolidated review package is sent through direct Zoho SMTP to `editor@therugbypanda.ie`.
- A Sanity lock keyed to operational date + package fingerprint prevents duplicate delivery.
- Production evidence: one 5/5 trigger returned Zoho SMTP `250 Message received`; identical re-trigger returned `already-sent` with no second SMTP send.
- Gmail is not part of the editorial path.

The 07:45 delivery proof must not be conflated with proof of autonomous 06:30 acquisition; the latter remains absent as described above.

## Rejection and replacement

A rejection must immediately request a genuinely different replacement. #202 emits the acquisition event; `/api/editorial/replacement` rejects identical source sets/repeated angles and requires normal generation/originality/Draft Ready/image safeguards.

Production E2E remains blocked because `EDITORIAL_REPLACEMENT_WEBHOOK_URL` is not configured. Do not reject a live review draft merely to reproduce this known missing-orchestrator failure.

## Images and article visual breaks

Only rights-reviewed, usage-approved **local Sanity assets** are eligible for automatic assignment. External URLs alone never satisfy readiness.

Priority is current exact-subject photography → relevant recent team/event/venue → useful relevant historical/context → approved relevant logo when appropriate → no image. Relevance is more important than filling a slot.

The same asset must not be reused across the current five-story package. Never use a photograph whose metadata names a person absent from the article. Reject conflicting team/province context. Ireland Women material requires women-specific evidence when an Ireland image is selected.

A story may contain up to three automatic inline images when its text genuinely supports them. Inline images are placed immediately after a materially relevant paragraph. Package/body asset dedupe and the hard three-image cap remain. If no strong candidate passes, use fewer images rather than filler.

Contextual cards are deterministic post-Publication-Review visual breaks built from sourced fact-ledger facts. A card needs at least two supported rows. Player-card portraits remain exact-subject only.

### Certified media baseline

The 28 August production audit supersedes the earlier 212 figure:

- **241 strict publication-ready local Sanity Editorial Images**;
- 490 total records audited;
- 28 genuinely new local imports in the targeted run;
- zero failed imports;
- zero duplicate local-asset groups.

Continue expansion toward 200-500 genuinely useful assets by coverage depth, not raw count. Classify subject/team/event/date/rights before counting an asset usable. For each real new article, MEDIA-011 targets at least three strong relevant candidates where possible; this is a candidate-depth target, never a requirement to force three placements.

For the current five drafts, audit hero and inline assignments through production Sanity readback. Exact/relevant images are preferred; no image is correct when no strong candidate passes.

## Public presentation and mobile review

#229 provides content-led article treatments, #230 homepage hierarchy, #241 reusable contextual cards, #276 card population/inline visual enrichment, #278 responsive mobile Editorial Review, and #279 safer paragraph-level image depth. These runtime foundations are merged/deployed.

Representative public article/homepage desktop/mobile rendering still needs human-approved published-content verification. Final authenticated phone interaction in Editorial Review remains pending. Do not publish a draft solely to manufacture evidence.

## Social distribution

Only a successful controlled human `publish` action may emit `editorial.article.published`. The payload contains a stable `eventId`, article URL, featured image, Facebook teaser, Instagram caption/hashtags and taxonomy context. Sanity retains social opt-out/status/event metadata.

The downstream social orchestrator must deduplicate by event ID, respect opt-out, post to the connected Facebook Page and Instagram professional account, store both platform post IDs, retry only failed platforms and never roll back website publication.

PR #280 added a protected production configuration diagnostic. Production evidence on 26 August returned `socialWebhookConfigured:false` and `socialWebhookSecretConfigured:false`. Therefore SOCIAL-001 is blocked before provider delivery. Use existing authorized integrations if they permit configuration; if provider/Meta authorization is genuinely owner-only, record only the smallest required owner action and continue all other work.

## AI FinOps

- Existing prepaid OpenAI balance is the ceiling; do not add credit to brute-force retries.
- Production remains GPT-5 while cheaper alternatives fail to prove equivalent editorial quality.
- Freshness and source selection must happen before generation.
- Do not use blind retries to manufacture five accepted positions.

## Current verification boundary — 29 August 2026

Production-verified foundations: pre-generation production-history freshness protection; stale default-batch fallback removed; 241 strict local media baseline; exactly-once Zoho delivery; contextual-card/image safety foundations; mobile Editorial Review runtime deployment; protected SOCIAL-001 configuration check.

Still open at P0: real scheduled current-source acquisition worker and consecutive normal 5/5 proof; current-five exact/relevant media depth and Sanity readback; final mobile/public rendering verification; social downstream/provider connection or sole minimal owner-authorized exception.
