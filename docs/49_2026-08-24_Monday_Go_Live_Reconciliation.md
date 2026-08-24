# 2026-08-24 Monday Go-Live Reconciliation

## Purpose

This is the current continuation/evidence document for the 26 August core-readiness and 27 August meaningful-go-live targets. It supersedes stale operational statements in the 20 August reconciliation where later evidence exists.

## Owner rules currently in force

- Five review-ready production drafts every morning and exactly one consolidated editorial notification by 08:00 Europe/Dublin.
- The persistent morning schedule was never implemented; this is missing go-live functionality, not a regression.
- Rejecting an article must immediately trigger acquisition/generation of a genuinely different eligible replacement.
- Women's rugby and other underrepresented/non-core rugby coverage is welcome but should normally total no more than 3-4 articles per week unless major news warrants more.
- Originality, Draft Ready and image relevance remain fail-closed.
- Images: relevance first; majority current/previous season; broad team/competition diversity; no single-match padding; local Sanity storage and rights metadata required; assistant handles >=95% of clear approve/reject decisions and owner escalation should remain <=5%; relevant image or no image.
- Batch related changes and minimise Vercel deployments.

## Editorial automation state

- #195 merged: generation uses fact-ledger evidence/provenance rather than source prose; originality source text remains available to the deterministic guard.
- #196 merged: targeted overlap retry feedback and one-of-each package styles: news-desk, analysis-led, feature-led, notebook, explainer.
- #197 merged/deployed: Draft Ready standard (headline <=70, standfirst <=220, SEO title <=60, SEO description <=160, paragraph <=120 words plus writing-quality checks).
- #199 merged/deployed: route max duration 240s; generation safety budget 220s; three attempts retained.
- #202 merged/deployed: application-side rejection now emits an immediate replacement-acquisition event. End-to-end completion still requires a persistent orchestrator endpoint and a production rejection/replacement proof.
- #219 merged/deployed: metadata-only Draft Ready repair preserves an originality-passing body and repairs only failing headline/standfirst/SEO fields, then reruns originality and Draft Ready checks.
- #220 merged as the controlled five-story verification trigger. A new hard 5/5 production runtime result is still required before AUTO-004 closes.

## Media state

The failed broad Openverse/Apify pattern is retired for scaling. Wikimedia Commons exact-subject acquisition is the primary current route.

Merged media work #201-#228 now provides: exact-subject discovery; creator/licence/date metadata; recency preference; strict relevance; assistant triage; local Sanity ingestion; publication metadata reconciliation; duplicate controls; per-query/team/event/scope diversity caps; provincial, European-club, URC-club and international-team gap waves; persisted evidence; and production-environment binding for Sanity-writing workflows.

Last certified strict production evidence before #228: **186 publication-ready local Editorial Images, 196 approved/published local Editorial Images, zero duplicate Sanity asset groups**. Therefore the certified gap to the 200 Editorial Image launch floor is **14**. #228 merged on 24 August to retrigger the corrected URC and international waves; do not claim a higher count until their post-import readiness evidence lands.

The library must remain diverse and mostly current/last-season. Candidate/discovery counts never count toward the 200 floor until rights-cleared, approved and stored locally in Sanity.

## Public presentation state

- #229 merged on 24 August: replaces slug-hash article-layout randomness with content-led news, analysis, feature, notebook and explainer presentation treatments.
- #230 merged on 24 August: homepage gains editorial hierarchy (lead, spotlights, compact news wire, province module, analysis/notebook treatment) and reusable card variants. It also removes the unrelated fallback-photo behaviour from ArticleCard so homepage rendering follows the canonical relevant-image-or-no-image rule.
- Production verification of representative article variants and the multi-story homepage remains required. The currently published content set may be too small for a meaningful multi-story visual proof until reviewed articles are published.

## Remaining go-live work, ordered

1. MEDIA-007: certify >=200 publication-ready local Editorial Images after #228 workflows; continue diverse rights-safe acquisition if still below 200.
2. AUTO-004: obtain a hard 5/5 production Draft Ready + originality-passing batch with five distinct styles, correct Sanity drafts and relevant-image-or-no-image behaviour.
3. AUTO-002: connect/verify persistent replacement orchestration and prove one rejection immediately produces a genuinely different replacement draft.
4. AUTO-003: implement persistent morning orchestration so five drafts plus one consolidated notification are ready by 08:00 Europe/Dublin; verify failure alerting and repeated daily operation.
5. WEB presentation: production-verify #229/#230 representative article and homepage layouts on desktop/mobile.
6. SOCIAL-001: production-verify Facebook and Instagram snippets after controlled publication, including idempotency/retry behaviour.
7. MEDIA-004: implement/verify secure phone-first photo upload.
8. Implement/verify the 14:00 major-announcement check that creates an additional article only when editorially warranted.
9. CMS-004: authenticated Sanity body edit/save/reload verification.
10. Reconcile remaining launch/security/accreditation items and publish enough reviewed content for meaningful go-live.

## Where owner help is actually required

At this point, normal code/media/editorial work should continue without owner intervention. Owner help is only required for:

- genuinely ambiguous image rights/relevance cases (target <=5% of candidates);
- credentials/configuration that are not already available to the connected automation environment, particularly external persistent orchestration/Meta if a required secret or account authorization is absent;
- final editorial judgement on reviewed drafts and final go-live acceptance.

Do not ask the owner to perform GitHub merges or routine image approvals that can be completed autonomously.

## Completion discipline

Always distinguish implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity verified, orchestration verified and Meta verified. No feature is complete merely because code merged.