# Publishing Workflow

Sanity Studio is the canonical CMS and mandatory human approval/publication boundary.

## Session startup

Read `docs/07_Project_State.md`, `docs/08_Issue_Log.md`, this file, `docs/51_2026-08-25_Go_Live_Production_Verification.md` and any newer relevant handoff/evidence documents. Check GitHub, Vercel and available project integrations before asking the owner to configure anything. Use Europe/Dublin for schedules.

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
→ semantic image selection (hero + optional inline subject images) or no image
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

Generation uses validated evidence/fact-ledger material rather than source prose. Source material remains available to the deterministic originality guard. Originality remains fail-closed.

Hard Draft Ready limits: headline <=70 characters, standfirst <=220, SEO title <=60, SEO description <=160, paragraph <=120 words, plus filler/formulaic-writing and qualified-projection safeguards.

Generated article strings are structured content, not Markdown. Raw/escaped Markdown and generic newsroom headings are removed/rejected before acceptance. Mechanical presentation fixes must not trigger a whole new expensive generation when the article body and originality already pass.

Recovery rules:

1. preserve every already-accepted morning position;
2. regenerate only missing/rejected positions;
3. use deterministic sentence/word-boundary metadata normalization for hard character limits where safe;
4. split overlong paragraphs deterministically rather than regenerate an otherwise valid article;
5. after a bounded Publication Review correction, reapply the same metadata/paragraph normalization and rerun Draft Ready + originality;
6. never weaken quality/originality/image gates to obtain 5/5;
7. stop blind retries and diagnose measured failure telemetry.

The five-story package allocates one each of `news-desk`, `analysis-led`, `feature-led`, `notebook`, `explainer` and must remain genuinely varied in voice/structure.

## Morning package — production verified 25 August

Required and now verified behaviour:

1. acquisition/generation runs at **06:30 Europe/Dublin**;
2. five distinct production-eligible Draft Ready/originality-safe drafts exist in Sanity;
3. individual morning draft notifications are suppressed;
4. consolidated delivery runs at **07:45 Europe/Dublin**;
5. `/api/editorial/daily-package` fails closed when fewer than five editorially distinct eligible drafts exist;
6. when complete, it sends exactly one plain-text review package through direct Zoho SMTP to `editor@therugbypanda.ie`;
7. a deterministic Sanity delivery lock keyed to operational date + package fingerprint prevents duplicates;
8. SMTP failure clears a provisional lock; accepted delivery records SMTP response/completion evidence;
9. incomplete/failing packages raise technical failure rather than substituting QA content or silently sending partial mail.

Production evidence on 25 August: first controlled trigger returned HTTP 200, `articleCount:5`, `status:sent`, Zoho `250 Message received`; identical second trigger returned `status:already-sent` using the same persisted event/completion evidence and did not issue a second SMTP send.

Do not use Gmail for Rugby Panda editorial verification.

## Rejection and replacement

A rejection must immediately request a replacement rather than wait for the next morning. #202 emits the replacement-acquisition event after rejection. `/api/editorial/replacement` requires the rejected record to be replacement-required, refuses an identical source set and refuses a repeated normalized editorial angle. Any replacement must pass normal generation/originality/Draft Ready/image safeguards and replenish the review queue.

End-to-end production verification of rejection -> genuinely different replacement remains required.

## Images

Only rights-reviewed, usage-approved **local Sanity assets** are eligible for automatic assignment or for the launch-floor count. External image URLs alone never satisfy readiness.

Assignment is semantic, relevance-first and fail-closed. Priority: exact current fixture/player/coach/team; relevant recent team/event/venue; useful relevant historical/context; approved relevant logo when appropriate; otherwise no image. Never use unrelated fallback imagery.

The same asset must not be reused across the current five-story morning package. If no unused relevant image remains, use no hero image rather than duplicate/substitute. Up to three automatic inline subject images may be used when exact rights-approved images exist for materially discussed subjects.

Wikimedia Commons exact-subject discovery is the primary external route. Preserve creator/licence/date/source metadata, deduplicate, review before import, store approved originals locally in Sanity, reconcile publication metadata and audit readiness. Do not scale the failed broad Openverse/Apify pattern.

**25 August production certification: 200 local assets, 200 strict publication-ready, 200 approved/published publication-ready, gap 0, zero duplicate Sanity asset groups.**

## AI FinOps / model selection

- Existing prepaid OpenAI balance is the spend ceiling until cheaper alternatives are tested; do not add credit to brute-force retries.
- Production generation remains on the configured model unless equivalent quality is evidenced.
- Controlled model benchmarks must use the same representative evidence packs and the same deterministic Draft Ready/originality/Publication Review gates, must not persist benchmark drafts, and must record pass/failure, generation attempts, token usage where available, corrective work and editorial-quality observations.
- GPT-5-mini benchmark evidence is being collected against the canonical 5/5 pack.
- Gemini Flash must not be claimed as tested until a usable Gemini/Google AI integration and real run exist.
- Target steady-state AI spend below USD $10/month if quality permits.
- Temporary benchmark routes/workflows must be removed after evidence capture.

## Public presentation

Article/homepage presentation is content-led. #229 provides article treatments; #230 homepage hierarchy; #241 reusable contextual editorial data cards. Portable Text image blocks must render responsively with alt/caption/credit.

Verify representative desktop/mobile article layouts, hero/inline image relevance and a multi-story homepage in production before closing presentation work. Do not publish a draft solely to manufacture test evidence; human publication remains mandatory.

## Social, mobile upload and major-news check

- SOCIAL-001: after controlled website publication, send image-backed snippets to Facebook/Instagram with idempotency/retry safeguards; production Meta verification remains required.
- MEDIA-004: secure phone-first photo upload remains to be implemented/verified.
- NEWS-001: implement a conditional daily 14:00 check that produces an extra article only when a genuinely significant rugby announcement warrants it.

## Current verification boundary — 25 August 2026

Production-verified: strict 200-image local floor; genuine five-story production morning package; exactly-once direct Zoho consolidated package with SMTP 250 + idempotent re-trigger; cost-bounded partial recovery mechanics.

Still open: cost benchmark completion/cleanup; rejection-to-different-replacement E2E; representative desktop/mobile article/homepage/inline-image proof; authenticated Sanity body edit/save/reload; Meta social provider proof; secure phone upload; 14:00 conditional check; remaining security/backup/accreditation checks; final editorial/go-live acceptance.
