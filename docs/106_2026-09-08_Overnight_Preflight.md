# Overnight preflight — 8 September 2026

## Measured failure

Production scheduled run `34212776773` completed source discovery with 28 successful sources, 241 total leads after Irish augmentation, 37 corroborated candidates and 12 concrete-evidence accepted candidates. It failed at `enforce-current-package-diversity.mjs` before any paid generation because three retained international-only drafts exceeded the two-slot ceiling.

The run therefore skipped generation, image acquisition/assignment and delivery. This confirms the immediate failure was retained-state handling rather than lack of raw discovery supply.

## Root cause

`enforce-current-package-diversity.mjs` treated retained same-day drafts as immutable after concentration checks. When retained state itself violated the Ireland-first ceiling, the script threw instead of evicting international overflow and opening replacement slots for the Irish reserve.

## Repair

The preflight branch changes retained drafts to replaceable package inputs. After concentration eviction, newest international-only overflow is deterministically marked `morningPackageEligible=false`, removed from retained state, concentration counters are rebuilt, and the normal Irish replacement floor is then enforced. If enough evidence-ready Irish candidates do not exist, the workflow still fails before model spend. No evidence, freshness or Ireland-first threshold is weakened.

## Media requirement

Owner requirement on 8 September is now explicit: embedded media is mandatory, not optional. An article is not review-ready without story-relevant imagery and an official social/video embed.

Existing capability evidence: Sanity has `socialEmbed`; public rendering supports allowlisted YouTube, Instagram, X/Twitter and Facebook HTTPS URLs; the controlled 5 September Munster Instagram test mutated an unpublished Sanity draft and verified readback. This proves rendering/storage capability, not automatic story-specific acquisition.

Automatic media qualification remains unverified and is therefore explicitly retained as a blocker. The system must not substitute generic same-team posts or irrelevant library images merely to achieve fill rate.

## Delivery requirement

Review delivery is progressive one-by-one. Existing individual draft notification capability is not sufficient evidence that legacy consolidated package completion cannot interfere. Production reconciliation remains required.

## Cost boundary

No paid generation is required for this preflight. `$0.40` per Europe/Dublin operational day remains the application-wide ceiling. Discovery/evidence/diversity/media qualification must run before model reservation.

## Verification boundary

The code repair is not production-verified until merged main executes a zero-model/current discovery proof demonstrating that international retained overflow is evicted and replacement selection proceeds without weakening the 3/5 Irish floor. Mandatory media acquisition and progressive delivery are separate blockers and must not be marked complete from this repair.
