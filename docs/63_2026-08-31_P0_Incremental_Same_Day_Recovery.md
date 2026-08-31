# P0 — Incremental same-day package recovery

Date: 31 August 2026

## Measured production problem

Production run `33429383099` reached current-source discovery, rugby relevance filtering, corroboration and freshness selection successfully, but created only 2/5 eligible Sanity drafts. Three positions failed inside generation/review. The importer then treated the next recovery as an all-five regeneration problem, which would discard useful work, increase wall-clock time and spend, and delay recovery until another full package attempt.

The same run also showed that weak source clusters can still survive discovery into the acquisition batch. Failing them only after GPT-5 generation wastes budget and produces avoidable review failures.

## Recovery contract implemented

- Preserve every same-day `morningPackageEligible` production draft whose `editorialInputId` belongs to the current operational date.
- Compute only the number of missing slots needed to reach five.
- Run a cheap evidence-sufficiency gate before GPT-5. A candidate needs at least two substantive non-generic, non-obviously-non-rugby source records from two publishers plus substantive fact material.
- Run the existing 14-day subject + development + angle freshness gate over the evidence-sufficient pool.
- Generate only missing slots, with controlled concurrency of at most two to reduce wall-clock time.
- A transport/timeout/abort failure receives at most one retry. Editorial rejection does not blindly retry the same position.
- Keep a bounded replacement pool (default two additional fresh candidates) and move to a different candidate when a generated position fails.
- Keep the five-before-Zoho transaction: delivery remains blocked unless retained + newly created eligible drafts equals exactly five.
- Expand the deterministic generic-heading guard to reject `what ... expect next`, including `What supporters should expect next`, before Publication Review.

No freshness, originality, Draft Ready, Publication Review, image or human publication gate is weakened.

## Cost boundary

The recovery path now avoids regenerating successful same-day drafts and rejects weak evidence before model spend. The owner-reported OpenAI spend baseline for 31 August before this change was $0.61. The production recovery result must be compared against that baseline rather than treating retries as free.

## Verification boundary

Implemented and committed is not sufficient. This P0 is production-complete only when a recovery execution proves:

1. previously successful same-day drafts are retained;
2. only missing slots are generated;
3. exactly five fresh eligible drafts exist in Sanity;
4. image enrichment runs against those exact five;
5. exactly one Zoho package contains those exact five;
6. stale or partial packages remain impossible.
