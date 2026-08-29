# 29 August 2026 — AUTO-004 Normal Scheduler Gap

## P0 finding

The first normal-morning proof window exposed a launch-critical gap: the repository currently has no autonomous 06:30 acquisition/generation schedule that discovers current editorial positions.

The production `.github/workflows/import-editorial-acquisition-batch.yml` workflow has only `workflow_dispatch` and a `push` trigger on `.github/auto004-import-trigger.txt`. It has no `schedule:` trigger. Its dispatch/default input also resolves to a reviewed repository batch (`data/editorial-acquisition/auto004-2026-08-24-fresh.json`) unless another batch path is supplied.

Therefore the statements in `docs/07_Project_State.md` and `docs/09_Publishing_Workflow.md` that describe 06:30 acquisition/generation as an existing persistent normal schedule are stale and must not be used as proof of AUTO-004 completion.

## What is deployed and still valid

PRs #293-#295 remain valid and deployed foundations:

- editorial-position identity is subject + development/event + editorial angle;
- same-story rewrites and within-package duplicates are rejected before model generation;
- exactly five fresh positions are required or the path fails closed;
- recent production Sanity editorial history is exported before the selector runs;
- originality, factual, style-diversity, Draft Ready, Publication Review, image relevance and human Sanity publication boundaries remain unchanged.

The problem is upstream of those protections: there is not yet a normal autonomous current-source discovery/selection scheduler feeding fresh candidate positions into them.

## Safe recovery decision

Do **not** add a cron trigger to `import-editorial-acquisition-batch.yml` as it stands. Scheduling that workflow would automate a static/reviewed batch input and could only replay old candidates (which the freshness gate should reject) rather than discover five new current positions. That would create a misleading scheduler without satisfying the newsroom contract.

The correct P0 implementation is a normal scheduled acquisition stage that:

1. consumes the versioned editorial source registry;
2. discovers current candidate developments before generation;
3. builds evidence sufficient to identify subject + event/development + editorial angle;
4. exports recent production Sanity positions;
5. applies the #293-#295 freshness selector before any model call;
6. requires exactly five distinct survivors or fails closed;
7. only then invokes the existing evidence/fact-ledger, generation, originality, Draft Ready and Publication Review path;
8. preserves the 07:45 exactly-once Zoho package and human Sanity publication boundary.

## Acceptance boundary

AUTO-004 remains **In Progress / Critical**. The 27 August fresh 5/5 recovery is useful evidence but is not a normal scheduled-day proof. Consecutive normal scheduled days cannot begin to count until the autonomous current-source acquisition scheduler above is implemented, merged, deployed and production-run.

No OpenAI credit was spent to manufacture evidence during this finding. No stale batch was generated. No editorial or image gate was weakened.

## Related measured media state

The newer production-certified media baseline remains **241 strict publication-ready local Sanity Editorial Images** per `docs/54_2026-08-28_Sunday_Recovery_Media_and_Source_Evidence.md`; older 212 references are stale where they conflict with that evidence.
