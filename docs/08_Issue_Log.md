# Issue Log

This is the living launch-boundary issue log. Historical rows remain preserved in Git history and dated evidence documents.

## Status lifecycle

Open → In Progress → Implemented → Merged → Pending Deployment → Pending Verification → Closed

## Active launch issues — 8 September 2026

| ID | Status | Priority | Area | Summary | Root cause | Related PRs | Deployment status | Verification status | Resolution date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LAUNCH-001 | In Progress | Critical | Go Live | Five distinct fresh review-ready drafts, >=3 direct Irish connections, mandatory relevant media, progressive delivery and human Sanity publication. | Sequential evidence, retained-state, media and delivery defects. | #442-#447; overnight preflight PR pending | Recovery foundation merged; overnight repair pending | 8 Sep run `34212776773` failed before spend at retained-state Ireland-first gate. | — |
| AUTO-004-P25 | Implemented | Critical | Diversity / Recovery | Evict retained international-only overflow and refill from Irish reserve rather than aborting whole package. | Retained drafts were treated as immutable after concentration checks; 3 international retained drafts caused fail-fast before replacement selection. | Overnight preflight PR pending | Implemented on preflight branch | Production zero-model/current-main proof required after merge. | — |
| MEDIA-010 | Open | Critical | Embedded Media | Require story-specific official social/video embed plus relevant imagery before review-ready/delivery. | Social embed storage/rendering exists but acquisition is a controlled/manual test path, not mandatory automatic candidate qualification. | Prior social-embed foundation; new acquisition PR required | Renderer/schema deployed; automatic enforcement not implemented | Munster Instagram draft mutation/readback proves capability only; per-article automatic qualification unverified. | — |
| EDITORIAL-011 | In Progress | Critical | Diversity / Freshness | Prevent day-after-day repetition of materially same subject/development/angle. | Existing freshness identity exists but owner-observed output remains repetitive; recent-history behavior needs package-level proof. | Prior freshness PRs; new proof/fix pending | Existing freshness code deployed | Five-slot multi-day regression/production proof pending. | — |
| AUTO-003-P24 | Open | Critical | Notifications | Progressive one-by-one review delivery must not depend on exact-five consolidated completion. | Individual and consolidated Zoho semantics coexist. | #437 plus prior AUTO-003 work | Per-draft capability deployed; reconciliation pending | Owner received only four emails on 8 Sep; exact cause not yet production-proven. | — |
| MEDIA-009 | In Progress | Critical | Images | Prevent wrong-person/wrong-context local images. | Semantic matching can still choose irrelevant assets despite large library. | Prior media PRs | Existing planner/verifier deployed | Owner-observed irrelevant imagery on 8 Sep; final five-article semantic proof pending. | — |
| AUTO-005-P22 | Pending Verification | Critical | Cost / Recovery | One paid candidate per missing launch slot under $0.40/day. | Historical replacement queue consumed repeated reservations. | #442, #443 | Merged | Free slot architecture proven previously; next paid package still must remain <= $0.40. | — |
| SOURCE-002 | Pending Verification | Critical | Irish Discovery | Maintain evidence-complete Irish reserve in normal discovery. | Supply is volatile after strict evidence filtering. | #441-#447 | Merged | 8 Sep measured discovery: 241 leads, 37 corroborated, 12 evidence-accepted; retained-state defect blocked later selection. | — |
| AUTO-003 | Pending Verification | Critical | Scheduling | Reliable morning output in Europe/Dublin. | Morning runs historically late/missing and can be blocked by upstream gates. | #438 plus prior work | Merged | Workflow has 04:30/05:30 UTC scheduled attempts; successful full morning path not yet proven. | — |
| SOCIAL-001 | Blocked | Low for launch | Social publishing | Controlled Facebook/Instagram auto-publishing after human publication. | Provider authorization/testing separate. | Prior social PRs | Foundation exists | Explicitly excluded from website launch gate. Article embeds are a separate editorial-media requirement under MEDIA-010. | — |

## Latest evidence

Scheduled production run `34212776773` on 8 September discovered 241 leads after Irish augmentation, built 37 corroborated candidates and accepted 12 through concrete evidence. It failed before model spend because three retained international-only drafts exceeded the two-slot ceiling. All generation/image/delivery steps were skipped.

The overnight repair addresses that exact retained-state failure without weakening the Ireland-first floor: international overflow becomes ineligible and creates replacement slots; insufficient Irish replacements still fail before spend.
