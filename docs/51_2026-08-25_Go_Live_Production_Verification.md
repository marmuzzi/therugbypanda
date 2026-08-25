# 25 August 2026 — Go-Live Production Verification

## Purpose

Record measured evidence for the launch-critical work completed on 25 August: strict local media floor, AUTO-004 five-story recovery, exactly-once Zoho morning delivery and controlled lower-cost model benchmark. This document supersedes older counts/status claims where they conflict.

## 1. Strict Editorial Image floor — verified

The older readiness audit allowed a record with an external `imageUrl` to count as renderable. The launch contract requires third-party public assets to be local Sanity assets, so a stricter local-only audit was added before claiming the 200 floor.

PRs #246, #247, #249, #251 and #254 performed a measured audit, localized only already-approved rights-cleared Wikimedia records, selected the exact remaining gap under rights/recency/relevance/diversity constraints, reconciled derived publication metadata and made the workflow idempotent.

Final production certification:

- local Editorial Image assets: **200**
- strict local publication-ready: **200**
- local approved/published publication-ready: **200**
- gap to target: **0**
- records needing strict-local attention: **0**
- duplicate Sanity asset groups: **0**

No Openverse/Flickr reject/owner-review candidates were promoted to hit the number, no hotlinked external URL counted toward the floor and no readiness criterion was weakened.

## 2. AUTO-004 five-story package — verified

Recovery was deliberately partial to protect the prepaid model balance. Already-accepted package positions were preserved; only missing positions were generated.

Measured root-cause fixes included:

- deterministic metadata-boundary repair instead of full GPT-5 regeneration for length-only failures (#248);
- tighter analysis-led lede/standfirst guidance after measured Publication Review failures (#252);
- post-Publication Review normalization so a mini correction could not create an over-120-word paragraph and fail an otherwise valid article (#257);
- a final bounded recovery generated only the missing Ulster/analysis-led position (#259/#260 path).

Final controlled run:

- reused Carbery / news-desk
- reused Connacht / feature-led
- reused Munster / notebook
- reused Ireland Women / explainer
- generated Ulster / analysis-led only
- Ulster passed deterministic originality
- Ulster passed Draft Ready
- Ulster passed Publication Review #2
- production Sanity draft created with `morningPackageEligible=true`
- package-mode individual notification suppressed
- final import `failedCount: 0`

This is the first hard production 5/5 evidence for AUTO-004 under the current quality/originality contract.

## 3. Exactly-one consolidated Zoho delivery — verified

#261 ported the direct-Zoho/idempotent daily-package implementation onto current `main` after the genuine 5/5 package existed. The route remains fail-closed below five editorially distinct production-eligible drafts.

Schedules:

- acquisition/generation: **06:30 Europe/Dublin**
- consolidated delivery: **07:45 Europe/Dublin**

First controlled production delivery (#263):

- HTTP 200
- `status: sent`
- `articleCount: 5`
- destination: `editor@therugbypanda.ie`
- Zoho SMTP response: **`250 Message received`**
- delivery evidence recorded in Sanity
- event: `editorial-daily-package:25/08/2026:23c24b1f79c7`
- completion evidence: `2026-08-25T16:52:16.450Z`

Second identical production trigger (#265):

- HTTP 200
- `status: already-sent`
- same event identity
- same original completion/SMTP evidence
- no second SMTP-send path executed

Therefore AUTO-003 exactly-once consolidated delivery is production-verified. Gmail is not part of this workflow.

## 4. Controlled GPT-5-mini benchmark — complete, no production switch

### Method

The benchmark used the same canonical five AUTO-004 evidence packs and one-of-each style allocation. It invoked the same Editorial Brain, article generator, deterministic Draft Ready/originality gates and Publication Review cycle. Benchmark outputs were never persisted to Sanity and generated no notifications.

A temporary authenticated benchmark route/workflow was merged in #266. The initial job hit one deployment-handover HTTP 404 on candidate 0 before any model call; candidates 1-4 passed. #267 reran Carbery only. #268 removed the temporary benchmark API/workflows/triggers immediately after evidence capture.

Effective model result: **5/5 benchmark-passed**. All five GPT-5-mini generation stages completed on generation attempt 1.

### Measured token usage

The generator plus the two logged Publication Review calls produced the following measured usage. The bounded correction call is currently a telemetry gap and is therefore excluded from the measured token/cost floor below.

| Story | Logged input tokens | Logged output tokens | Generation attempts | Review correction |
| --- | ---: | ---: | ---: | --- |
| Carbery / news-desk | 8,889 | 6,216 | 1 | yes |
| Ulster / analysis-led | 9,676 | 5,750 | 1 | yes |
| Connacht / feature-led | 8,890 | 5,726 | 1 | yes |
| Munster / notebook | 9,047 | 6,185 | 1 | yes |
| Ireland Women / explainer | 8,534 | 5,531 | 1 | yes |
| **Package** | **45,036** | **29,408** | **5 total** | **5/5** |

At the 25 August GPT-5-mini standard rates ($0.25/M input, $2/M output), those logged calls cost approximately **$0.0701 for the five-story package before the five unlogged correction calls**. A conservative allowance for the correction calls puts a normal package around **$0.09-$0.10**, or roughly **$2.70-$3.00 for 30 daily packages**, comfortably below the owner target of $10/month.

### Same-story GPT-5 comparison

A clean production Ulster GPT-5 generation on the same evidence/style used:

- generation: 2,698 input / 3,667 output tokens (2,560 input tokens cached)
- review 1 mini: 3,596 input / 1,660 output
- review 2 mini: 3,311 input / 1,417 output
- one bounded correction call (usage not currently logged)

Using 25 August API rates, this is approximately **$0.05 for the article including a conservative correction allowance**, compared with approximately **$0.018-$0.019 for the mini benchmark version**. Mini is materially cheaper, but the root-cause efficiency work also means a clean five-article GPT-5 production day projects around **$0.25/day / ~$7.50 per 30 days** at this measured profile, already near/below the $10 steady-state target without a quality downgrade.

### Editorial quality finding

GPT-5-mini is **not approved as the production replacement yet**, despite 5/5 gate pass:

- all five benchmark articles required Publication Review correction;
- Carbery's accepted output still ended its standfirst with the incomplete phrase `reshapes the province's.` after deterministic clipping;
- the Ulster benchmark headline `Henderson out puts Ulster's pack leadership under an early test` was awkward;
- multiple mini drafts initially produced generic headings or overlong metadata that deterministic repair removed;
- non-blocking Review #2 findings remained on all measured samples.

This shows that current deterministic gates protect hard structure/originality well, but do not yet guarantee equivalent editorial polish. Production therefore remains on GPT-5. The next cost work should close correction-call telemetry and improve semantic completeness checks before any repeat mini benchmark or production switch.

## 5. Gemini Flash benchmark — genuine blocker

Gemini 2.5 Flash pricing is materially lower than GPT-5, but no usable Gemini/Google AI API connector/plugin or credential is exposed in the current project integrations. A real same-pack Gemini run could not be performed without external authorization. No Gemini quality/cost result is claimed.

## 6. Remaining launch boundary

Completed/verified on 25 August:

- MEDIA-007 strict >=200 local image floor
- AUTO-004 genuine five-story production package
- AUTO-003 persistent 06:30/07:45 schedule and exactly-once consolidated Zoho delivery
- AUTO-005 cost-bounded partial recovery mechanics
- controlled GPT-5-mini benchmark and cleanup; production model deliberately unchanged

Still pending:

- AUTO-002 rejection -> genuinely different replacement E2E
- representative production desktop/mobile article/homepage/inline-image visual proof
- Meta Facebook/Instagram provider verification after controlled publication
- secure phone-first image upload
- 14:00 major-announcement conditional check
- authenticated Sanity edit/save/reload proof
- remaining security/backup/recovery/accreditation/provider checks
- final editorial review and owner go-live acceptance
