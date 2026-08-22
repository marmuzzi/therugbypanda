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
- The verified local approved Editorial Image baseline entering this work remains 22 against the 200 launch floor. Wikimedia discovery results are not yet counted.
- Do not spend more on the failed broad Openverse/Apify pattern. Use exact-subject Commons discovery and other legally reusable, rights/date-aware sources.

## Highest-priority implementation order

1. Add a bounded mechanical-repair path for an originality-passing draft when failures are limited to headline/standfirst/SEO field lengths or other safely repairable Draft Ready metadata. Preserve the accepted body; rerun both Draft Ready and originality checks on the repaired complete draft before return. Fall back to full recomposition for body-quality or originality failures.
2. Rerun the controlled five-story package and require 5/5 Draft Ready + originality pass, five distinct style profiles, package notification suppression and relevant-image-or-no-image behaviour.
3. Implement/verify immediate rejection replacement end-to-end through `/api/editorial/replacement` with a different source/angle identity.
4. Complete persistent morning orchestration so five eligible drafts and one consolidated notification are ready by 08:00 Europe/Dublin. The Make schedule was never implemented; absence of the schedule is a missing feature, not a regression.
5. Run measured Wikimedia candidate discovery, visually triage clear cases, ingest rights-cleared approvals as local Sanity assets, deduplicate, and re-audit the local approved count. Scale only if relevance and recency yield remain strong and owner escalation stays <=5%.
6. Reconcile `docs/07_Project_State.md`, `docs/08_Issue_Log.md` and `docs/09_Publishing_Workflow.md` with #195-#201 and subsequent weekend evidence in the same functional batch.
7. After priorities 1-5 are stable, continue SOCIAL-001, MEDIA-004 and remaining launch blockers.

## Completion discipline

Always distinguish implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity verified, Make verified and Meta verified. Keep `main` deployable and batch related work to avoid unnecessary Vercel deployments.
