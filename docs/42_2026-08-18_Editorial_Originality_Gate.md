# Editorial Originality Gate — 18 August 2026

## Why this gate exists

The Rugby Panda must never rely on close rewriting of a source article. Multi-source acquisition is necessary but is not, by itself, sufficient protection against copying or source-shaped paraphrasing. A reader-facing article must be an independently composed Rugby Panda piece that uses source material as evidence, not as prose to be rewritten.

## Editorial contract

For every generated article:

- facts may come from source material, but wording, structure, transitions and analysis must be independently composed;
- do not copy source sentences;
- do not follow a source article's sentence order, paragraph order or rhetorical structure;
- do not lightly paraphrase a single source while preserving its shape;
- synthesize facts from multiple independent publishers where available;
- add supported Rugby Panda value: implications, selection questions, tactical context, consequences and what supporters should watch;
- reader-facing copy must not describe the sourcing process, AI, fact ledgers or internal editorial mechanics.

## Fail-closed implementation

`lib/editorial/OriginalityGuard.ts` performs a deterministic overlap check before a generated article can be returned to the draft writer.

The guard compares the generated headline, standfirst, key points and article body against:

- each structured source record's title, excerpt and, when available, full `bodyText`; and
- the raw acquired story material supplied to generation (`story.title`, `story.summary` and `story.bodyText`).

The second comparison is important because raw acquisition text may contain prose that is sent to the generator but is not duplicated inside a structured source record. No source prose supplied to generation should bypass the originality check merely because it arrived through a different field.

A draft is rejected when either of these safety thresholds is breached:

1. more than 11 consecutive normalized words are shared with one protected source text; or
2. for a protected source with enough text, more than 28% of its six-word sequences appear in the generated article with at least three matching six-word sequences.

These are protective engineering thresholds, not a legal definition of plagiarism. They deliberately fail closed and should be tightened if production review shows that they allow source-shaped writing.

If the originality guard rejects a draft, the pipeline throws before the Sanity draft write. The story must be recomposed; it must not be silently accepted or published.

## Generator instructions

`OpenAIArticleGenerator.ts` explicitly requires independent composition and prohibits:

- rewriting or lightly paraphrasing a source article;
- copying source sentences;
- preserving a source's sentence/paragraph/rhetorical order;
- using eight or more consecutive source words except unavoidable proper names or official titles.

The deterministic gate is separate from these prompt instructions so the safety boundary does not depend solely on model compliance.

## Acquisition requirement

`SourceRecord` supports optional `bodyText`. Future acquisition should capture the useful article text for every source where technically and legally appropriate, so originality comparison is not limited to headlines/excerpts.

The preferred evidence pack for a story is:

- primary/official source(s) for hard facts;
- at least one genuinely independent reputable publisher for context or corroboration;
- opposing-team, competition-organiser or other independent primary source where useful;
- enough captured source text to support a meaningful originality comparison.

Multiple URLs from the same club or union do not by themselves satisfy the project's independent multi-source verification goal.

## Current AUTO-004 verification state

The successful enriched five-story run after the Sanity token recovery proved that all five drafts could be generated and written with package-mode notification suppression. Review of the evidence pack then showed a remaining gap: each story still relied predominantly on multiple records from the same official publisher.

PR #183 introduced the independent-source verification batch and first fail-closed originality guard. Post-merge Codex review identified a P1 gap: raw `story.bodyText` could be supplied to generation without being included in the deterministic comparison. PR #184 closes that gap and protects all raw story material (`title`, `summary`, `bodyText`) as an additional originality source.

An intermediate Vercel branch deployment failed TypeScript because `OriginalityGuard.ts` referenced `SourceRecord.bodyText` before the corresponding type change had landed in that branch snapshot. Current `main` now includes `bodyText?: string` on `SourceRecord`; a later #184 branch commit built READY. This documentation commit intentionally triggers one fresh deployment from current `main` so production verification uses the complete merged state rather than that intermediate snapshot.

A new controlled verification batch, `data/editorial-acquisition/auto004-2026-08-18-independent.json`, adds genuinely independent publishers to each of the five representative stories while keeping the same stable candidate IDs so regenerated Sanity drafts replace the previous versions.

Do not treat EDIT-002/AUTO-004 as production-verified until:

1. the originality gate including raw story material is merged and deployed;
2. the independent-source batch regenerates successfully;
3. the generated text passes the deterministic originality gate;
4. editorial inspection confirms the articles are materially independent compositions rather than source-shaped paraphrases;
5. image assignment still behaves fail-closed under PR #176;
6. only one consolidated morning package notification is delivered.
