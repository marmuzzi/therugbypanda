# 3 September 2026 — Second bounded visual recovery P0

## Measured production failure

Production workflow run `33708999666`, attempt 2, successfully rebuilt an exact five-draft package, performed targeted image acquisition, evicted one image-unfulfillable story, refilled that one slot from the fresh reserve pool, and ran targeted replacement-image acquisition.

The machine-readable final image plan then showed that the replacement itself, `current-2026-09-03-9616c23e47c9` (Caelan Doris / Leinster), still had **0 assignment-safe local image candidates** after acquisition. The exact final plan contained five eligible drafts but the final verifier correctly failed closed before Zoho.

The relevant final-plan counts were:

- Doris / Leinster replacement: 0 safe local candidates;
- Suaalii / All Blacks: 3;
- North Harbour Hibiscus: 0 in the final plan produced by that attempt;
- Itoje / England: 1;
- Read / Springbok scrum: 2.

The final assignment step rejected the package and the consolidated Zoho step was skipped. The 3 September exact-one state still had no accepted delivery.

## Root cause

The workflow had exactly one visual substitution cycle:

1. plan and acquire current-package image deficits;
2. evict one article with fewer than two assignment-safe images;
3. generate one fresh replacement;
4. acquire replacement-only image deficits;
5. build the final plan;
6. immediately call final assignment.

If the newly generated replacement was itself image-impossible after targeted acquisition, the workflow had no second bounded substitution opportunity. The final verifier therefore became the first component able to reject that replacement, even though the same existing eviction/recovery machinery could safely replace it.

This is an orchestration-capacity gap, not an image-relevance problem. The final verifier behaved correctly and must remain strict.

## Repair

The current-source workflow now allows **at most one additional visual substitution pass** after the first replacement acquisition.

The second pass:

1. inspects the final image plan for articles with fewer than **two assignment-safe local candidates** — the minimum required for hero plus meaningful inline coverage;
2. does **not** trigger merely because the quality-depth target of three has a deficit;
3. reuses `evict-current-visual-deficit-draft.mjs`, which evicts at most one draft and re-runs the canonical same-team / same-matchup diversity gate before replacement model spend;
4. refills only that one missing slot from the remaining fresh evidence-sufficient reserve pool;
5. runs targeted image discovery, rights/relevance triage, local import, metadata reconciliation and strict readiness audit for the second replacement;
6. rebuilds the exact current-package image plan and then enters the unchanged final verifier.

The workflow remains fail closed after the second substitution. There is no unbounded retry loop and no relaxation of freshness, Publication Review, diversity, image relevance, human publication or exact-one Zoho delivery.

The workflow timeout is raised from 35 to 50 minutes so the extra *bounded* recovery pass can finish without creating a false infrastructure timeout after valid editorial work.

## Required production verification

The repair is incomplete until a production recovery demonstrates that:

1. a first replacement with fewer than two assignment-safe images is detected before final assignment;
2. at most one second visual substitution occurs;
3. the second substitution still runs the existing diversity gate before model spend;
4. exactly five fresh review-ready drafts survive Publication Review and deterministic quality gates;
5. all five pass final hero/inline image verification;
6. exactly one consolidated Zoho package is accepted for those exact five IDs, or exact-package evidence proves it was already sent;
7. no article is automatically published and Meta/social remains untouched.

## Delivery state at diagnosis

3 September Zoho delivery: **not sent**. Run `33708999666` attempt 2 failed at final visual assignment and skipped delivery.