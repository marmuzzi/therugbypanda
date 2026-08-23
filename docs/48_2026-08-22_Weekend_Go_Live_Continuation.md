# 2026-08-22 Weekend Go-Live Continuation

## Purpose

Operational continuation point for autonomous go-live work through 24 August. This document supplements the older 20 August reconciliation in `docs/07_Project_State.md` / `docs/08_Issue_Log.md`; those files must be reconciled in the next batched functional PR rather than via a documentation-only production deployment.

## Verified baseline entering the weekend

- PR #195 merged: generation uses validated fact-ledger evidence plus source provenance, while source prose remains withheld from generation and retained for deterministic originality checking.
- PR #196 merged: overlap-fragment feedback and package-level one-of-each style allocation (`news-desk`, `analysis-led`, `feature-led`, `notebook`, `explainer`). Originality thresholds unchanged.
- PR #197 merged/deployed: deterministic Draft Ready limits and retry feedback are active.
- PR #199 merged/deployed: editorial route max duration 240 seconds; OpenAI generation safety budget 220 seconds; three attempts retained.
- PR #200 merged/deployed: controlled five-story verification trigger. Extended budget was exercised successfully by long-running retries; originality and image safeguards remained fail-closed. The latest known remaining five-of-five blocker is a mechanical Draft Ready field-length failure after otherwise successful generation, so the next implementation should repair only failing mechanical fields rather than regenerate an acceptable body.
- PR #201 merged/deployed READY: Wikimedia Commons precision discovery path exists. It is discovery/triage only; discovered files do not count toward the 200 local approved-media launch floor until visually reviewed, rights-cleared and imported into Sanity.
- Representative post-#192 writes have resolved to no image where no subject-relevant approved image exists. Do not reintroduce generic fallback behaviour.

## 23 August continuation evidence

- PR #202 is merged and deployed: rejecting an article now emits an immediate replacement-acquisition trigger after the workflow transition. End-to-end completion still requires the persistent orchestrator endpoint to consume that event and create a genuinely different replacement draft.
- Wikimedia discovery, assistant triage, local Sanity ingestion, readiness reconciliation and diversity controls are now implemented through PRs #203-#218.
- The latest persisted production audit before the current provincial rerun shows 174 publication-ready Editorial Images, 184 approved/published local Editorial Images and zero duplicate Sanity asset groups. The remaining Editorial Image gap to the 200 floor is 26.
- Recent Commons triage evidence remains strongly current-season/last-season and below the <=5% owner-escalation ceiling; discovered URLs still never count until rights-cleared and stored locally.
- PR #218 merged on 23 August and retriggers the targeted provincial wave with a minimum of eight approvals, a 40% maximum share per province, and mandatory approved coverage for Leinster, Munster, Ulster and Connacht. Broad-library diversity defaults remain unchanged.
- The current functional branch adds bounded metadata-only Draft Ready repair. When originality passes and the only failures are headline, standfirst, SEO-title or SEO-description lengths, the accepted body is preserved and only failing metadata fields are rewritten. The repaired complete article must then pass both originality and Draft Ready checks; body-quality/originality failures still use full recomposition.

## Owner-approved editorial rules to preserve

- Daily package target remains five review-ready production drafts and exactly one consolidated morning notification.
- Women's rugby and other underrepresented/non-core rugby coverage is welcome but should normally total no more than 3-4 articles per week unless a genuinely major news event warrants more.
- Rejecting an article must immediately trigger acquisition/generation of a genuinely different eligible replacement; do not wait for the next scheduled morning batch.
- Originality and Draft Ready safeguards are fail-closed and must not be weakened to make a run pass.

## Owner-approved media rules to preserve

- Relevance is mandatory: direct team/player/coach/event/competition/venue evidence is preferred.
- The majority of approved editorial photography should be current season or immediately previous season where reliable date metadata exists.
- Historical/contextual and generic rugby/venue imagery is a smaller deliberate pool and must not displace a better recent subject-specific image.
- Relevant image or no image; never use an unrelated fallback merely to fill a slot.
- Assistant handles at least 95% of clear approve/reject decisions. Owner escalation is reserved for genuinely ambiguous rights/relevance cases and should remain at or below 5%.
- Third-party public use requires rights metadata and a local Sanity asset; do not hotlink source originals.
- Do not bulk-import deep collections from one match. Use per-event/player/team/scope caps and measure coverage distribution as well as totals.
- Do not spend more on the failed broad Openverse/Apify pattern. Use exact-subject Commons discovery and other legally reusable, rights/date-aware sources.

## Highest-priority implementation order

1. Production-verify bounded mechanical metadata repair, then rerun the controlled five-story package and require 5/5 Draft Ready + originality pass, five distinct style profiles, package notification suppression and relevant-image-or-no-image behaviour.
2. Complete immediate rejection replacement end-to-end through `/api/editorial/replacement` with a different source/angle identity.
3. Complete persistent morning orchestration so five eligible drafts and one consolidated notification are ready by 08:00 Europe/Dublin. The Make schedule was never implemented; absence of the schedule is a missing feature, not a regression.
4. Continue targeted diverse Wikimedia acquisition, assistant triage and local Sanity ingestion until the publication-ready library reaches the 200 floor without lowering relevance, recency, rights or diversity standards.
5. Reconcile `docs/07_Project_State.md`, `docs/08_Issue_Log.md` and `docs/09_Publishing_Workflow.md` with the full weekend evidence in the next batched production change.
6. After priorities 1-4 are stable, continue SOCIAL-001, MEDIA-004 and remaining launch blockers.

## Completion discipline

Always distinguish implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity verified, Make verified and Meta verified. Keep `main` deployable and batch related work to avoid unnecessary Vercel deployments.
