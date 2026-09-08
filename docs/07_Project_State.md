# Project State

## Current version

v1.0 — Launch Experience and Digital Newsroom Foundation

## Last reconciled

8 September 2026 overnight preflight after the measured scheduled-run failure `34212776773`.

## Read first

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/106_2026-09-08_Overnight_Preflight.md`
5. `docs/102_2026-09-07_Final_Launch_Recovery_Status.md`
6. `docs/99_2026-09-04_AI_Cost_Routing_And_Daily_Budget.md`

Newer measured evidence supersedes older state statements where they conflict; Git history and dated evidence preserve historical decisions.

## Launch contract

- Europe/Dublin operational day.
- Five fresh review-ready drafts, delivered individually as each becomes ready.
- At least 3/5 direct Irish connections; at most 2 international-only.
- Mandatory story-relevant inline/local imagery and verified official social/video embed before an article is considered review-ready.
- Sanity human publication boundary; never auto-publish.
- OpenAI application reservation ceiling `$0.40/day`.
- Terra generation, Luna review/repair.
- Free discovery/evidence/freshness/diversity/media qualification/slot planning before model spend.
- Meta auto-publishing remains excluded; official third-party embeds inside articles are editorial media and are not Meta publishing automation.

## 8 September measured production state

Scheduled run `34212776773` discovered 241 leads, produced 37 corroborated candidates and accepted 12 through the concrete evidence gate. It then failed before model spend because 3 retained international-only drafts exceeded the 2-slot ceiling. Generation, image work and delivery were skipped. This was a retained-state recovery defect, not a discovery outage.

The overnight repair changes retained drafts from entitlements into replaceable inputs: newest international-only overflow is made ineligible and its slots are refilled from the Irish reserve, while the 3/5 quota remains fail closed. The evidence floor is not weakened.

## Media state

The site and Sanity schema already support official `socialEmbed` blocks for YouTube, Instagram, X/Twitter and Facebook, and the 5 September controlled Munster Instagram draft mutation/readback proved the Sanity embed path. However, automatic story-specific social/video discovery and mandatory per-article embed qualification are not yet production-verified. Therefore embedded-media enforcement remains a launch blocker until a deterministic acquisition/validation path is merged and proven.

Local image relevance also remains fail closed. Historical James O'Connor and Codie Taylor semantic-image defects are not considered resolved merely because the library is large.

## Notifications

The owner requires progressive one-by-one review delivery: article 1 must not wait for article 5. Existing individual draft notification exists, but coexistence with the legacy consolidated exact-five Zoho completion path remains pending production reconciliation.

## Budget

The hard application-wide ceiling remains `$0.40` per Europe/Dublin operational day. Overnight preflight must not manufacture paid OpenAI calls. Free discovery, evidence, diversity, freshness and media qualification must succeed before paid generation.

## Current launch blockers

1. Production verification of the retained-international overflow repair.
2. Mandatory story-specific embedded media acquisition/validation before review delivery.
3. Production reconciliation of progressive individual delivery versus legacy consolidated completion semantics.
4. Final semantic image relevance verification on all five articles.

## Go-live states

1. green evidence-complete Ireland-first reserve proof;
2. five distinct fresh positions with recent-position repetition protection;
3. mandatory relevant local/inline image plus official social/video embed verified for every article;
4. each article delivered individually only after its media and editorial gates pass;
5. owner reviews and publishes in Sanity.
