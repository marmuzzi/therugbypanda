# Precision Editorial Image Acquisition — 18 August 2026

## Why this change exists

The first large Apify/Openverse image expansion succeeded technically, but a quick Editorial Image review showed that too many imported records were not useful enough for The Rugby Panda. The economic problem is important: paying to collect hundreds of weak candidates and rejecting most of them afterwards is wasteful.

The acquisition strategy is therefore changing from **broad collection followed by cleanup** to **named-subject acquisition with small result caps and measured yield**.

## Root cause found in the importer

The previous relevance check built its searchable text from both the source image metadata **and the acquisition query/scope**. That meant a result from a `Leinster Rugby` run could satisfy a Leinster relevance test merely because the words `Leinster Rugby` existed in the run metadata, even when the returned image title/tags/source metadata did not establish that the image was actually about Leinster.

This is now fixed on `media/precision-apify-acquisition-v3`:

- relevance tests use source image metadata only;
- acquisition query/scope may still be retained for provenance and later metadata inference, but cannot prove relevance;
- future runs can carry `requiredSignals`, and at least one required subject signal must appear in source metadata before import;
- generic rugby queries are explicitly disallowed by the acquisition target policy.

## Coverage remains broad

Precision does **not** mean Irish-only coverage.

The maintained target list includes:

- all 16 URC clubs;
- all six Men's Six Nations teams;
- the 12 Nations Championship teams: the six northern unions plus Argentina, Australia, Fiji, Japan, New Zealand and South Africa;
- Champions Cup and Challenge Cup coverage through relevant clubs and competition-specific searches;
- Ireland Women and Women's Rugby World Cup / Women's Six Nations coverage;
- current Irish international players and the priority Irish provincial/national coaches;
- relevant rugby venues.

## Cost-control rules

The default Openverse actor result cap is now 6 per query, with an absolute plan cap of 8 per query. Player and coach searches default to 4 results.

Do not expand a query merely to increase candidate count. Expand only after a small run demonstrates a high useful-image yield.

A future paid run should be staged:

1. Tier 1 — Irish provinces, Ireland Men/Women, current priority players/coaches.
2. Review yield.
3. Tier 2 — URC opponents, Six Nations and Nations Championship teams.
4. Review yield.
5. Tier 3 — venues and specific coverage gaps.

The first generated plan contains 86 narrow queries with a theoretical ceiling of 410 returned records if every query is executed. The intent is **not** to execute all 86 automatically; the plan exists so batches can be selected deliberately and cheaply.

## New source files

- `data/editorial-images/acquisition-targets-2026-27.json`
- `scripts/generate-precision-apify-image-plan.mjs`
- package command: `npm run media:plan-precision-acquisition`

The generated plan contains, per query:

- exact keyword;
- scope;
- subject type;
- exact subject;
- competition where applicable;
- `requiredSignals`;
- result cap;
- priority tier.

## Examples

Preferred:

- `Caelan Doris Ireland rugby`
- `Glasgow Warriors United Rugby Championship`
- `France Six Nations rugby`
- `South Africa Nations Championship rugby`
- `Stuart Lancaster Connacht Rugby rugby`
- `Aviva Stadium Dublin rugby`

Avoid:

- `rugby union international`
- `professional rugby player`
- `professional rugby match action`
- `rugby training professional`
- `Champions Cup rugby` without a team/person/event subject

## Approval boundary

The improved collector changes acquisition relevance only. It does not weaken rights/editorial controls.

- Apify/Openverse results remain candidates.
- No candidate is automatically approved.
- Relevance, source/rights metadata and actual visual suitability must be reviewed before approval.
- Clear cases should be approved/rejected by the editorial review process; only genuinely uncertain cases should require owner review.
- Article assignment remains fail-closed under the PR #176 contract.

## Current verification state

- The first 18 August import workflow was reported GREEN after `APIFY_TOKEN` and the rotated `SANITY_API_TOKEN` were configured.
- The importer's hard minimum means that run could not report success with fewer than 200 genuinely new records after its then-current filtering and Sanity deduplication.
- A quick human review exposed low useful-image yield despite technical success.
- The precision acquisition implementation is committed on branch and still requires PR/build verification before it replaces the previous acquisition logic on `main`.
- No further paid Apify image run should be started until this precision change is merged and the next small batch is selected deliberately.
