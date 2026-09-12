# Publishing Workflow

Sanity Studio is the canonical CMS and mandatory human approval/publication boundary.

## Session startup

Read `docs/07_Project_State.md`, `docs/08_Issue_Log.md`, this file and the newest relevant dated evidence. Check GitHub/Vercel/current integrations before asking the owner to configure anything. Use Europe/Dublin for operational dates and schedules.

## Completion discipline

Always distinguish implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity verified and provider/delivery verified. A merge is not production verification.

## Required editorial flow

```text
free standard + targeted Irish source discovery
→ coherent corroboration and concrete story evidence
→ retained exact-day integrity + source-cluster duplicate eviction
→ match-detail parity
→ canonical freshness + same-day paid-attempt eligibility
→ if preferred reserve is thin, one bounded free discovery/corroboration refill
→ final canonical pool
→ Ireland-first + team/matchup diversity
→ match-day editorial priority inside the already-qualified pool
→ free story-specific official-media qualification wherever possible
→ progressive slot budget inside <=$0.30 normal target and <=$0.40 hard ceiling
→ exactly one fresh candidate per selected paid slot
→ Editorial Brain / fact ledger
→ Terra generation
→ deterministic Draft Ready + originality
→ Luna Publication Review + at most one bounded correction
→ deterministic post-review gates
→ exact curated official embed or verified official-source discovery
→ Sanity embed insertion and readback
→ remove weak local imagery when an exact official embed is present
→ individual review delivery immediately when that article is ready
→ human review/edit/publish in Sanity
→ public website
```

Generated content and embedded media are never automatically published.

## Ireland-first package contract

At least three of five stories must have a direct Irish connection: Ireland/IRFU, Leinster, Munster, Ulster, Connacht, Irish women, Irish players/coaches abroad, or European competition materially involving Irish teams. International-only stories are capped at two.

Retained same-day drafts are inputs, not entitlements. Invalid or materially duplicate retained positions must be made package-ineligible and replaced from the evidence reserve. Never weaken the Irish or evidence floor to complete five slots.

On an Irish match day, a current team/selection/squad/fixture development outranks an older Irish profile/interview candidate when both have already passed the same freshness, evidence, diversity and paid-eligibility gates. This is an ordering rule only; it never manufactures eligibility or weakens quality. For Leinster v Zebre Parma on 12 September 2026, the confirmed team-selection phase therefore outranks older profile/build-up material. A later injury, venue/test-event operational development, result or reaction can be separate when independently evidenced. Same-phase rewrites remain duplicates.

## Evidence-before-spend contract

Require at least two substantive sources from at least two publishers, coherent same-development corroboration, concrete rugby facts and no non-rugby contamination. Completed-match stories require the final score. Squad/selection stories require named people and concrete selection detail. Person identity must be coherent between the title/development and fact ledger; surname collisions fail closed.

Explicit non-rugby signals such as Nations League, soccer, GAA, hurling or camogie are rejected before generation even if noisy descriptions contain rugby terms.

A candidate that already consumed a `production-draft:` reservation on the current Dublin day is excluded before capacity/diversity decisions. Failed reservations remain in the authoritative Sanity ledger and are never reset to manufacture headroom.

## Canonical editorial pool and free refill

The canonical pool is the single pre-AI decision boundary for recent-position freshness and same-day paid-attempt eligibility. Downstream package selection consumes that pool and must not reinterpret freshness.

For an incomplete package, the strict minimum is the number of missing slots. Preferred capacity is missing slots plus three reserve candidates. If the preferred reserve is thin, run one bounded free refill, rebuild evidence, rerun match-detail parity and rerun canonical qualification. Reserve shortage alone must not block a fillable five-story package.

The zero-model `launch-reserve-proof.yml` must mirror this canonical sequence. A proof harness that calls the legacy production-history script directly is invalid because `prepare-slot-budget-batch.mjs` requires a canonical-qualified batch.

## Freshness and diversity

Freshness identity is **subject + event/development + editorial angle**. Headline rewriting does not create freshness. Source-cluster overlap with a retained article is also a duplicate signal.

For a developing match/event, a genuine new phase is fresh even when the matchup is unchanged. Recognised phases include preview/build-up, squad/team selection, late injury/personnel change, live development, confirmed result and post-match reaction. Rewording the same phase remains a duplicate.

Package limits are max three same canonical matchup, max three same recognised team, min three Irish-connected and max two international-only. These limits never override freshness, evidence or media relevance.

## Mandatory embed-first media gate

Embedded media is mandatory. Local imagery is not.

An article is not review-ready and must not be delivered unless it contains at least one verified official social/video embed directly relevant to the person, match, announcement, event or development in the article.

Media priority is:

1. exact curated official person/event embed;
2. exact official team/competition video or social post discovered automatically;
3. another independently verified official embed with direct story relevance;
4. block the article.

Generic same-team posts, wrong people, unrelated events and decorative content fail. A local Sanity image may be included only when it independently passes semantic relevance checks. If doubtful, omit it; never use an irrelevant local image to satisfy readiness.

An unavailable individual official feed is skipped and recorded rather than aborting all media discovery. This resilience never waives the relevance requirement.

## Launch slot budget

The application-wide OpenAI reservation hard ceiling is **`$0.40` per Europe/Dublin operational day**. `EDITORIAL_AI_DAILY_BUDGET_USD` may lower this limit but cannot raise it above `$0.40`.

The normal production target is **`<= $0.30/day`**. A production draft reservation is `$0.055`; five empty slots therefore reserve `$0.275`, which is valid.

For an incomplete package, calculate normal-target headroom before any model call. If all missing slots fit, select them normally. If only some fit, select only the fresh slots that fit and run them progressively; never abort an otherwise affordable slot merely because the whole remaining package cannot fit at once. If no `$0.055` slot fits inside the normal target, stop before model spend. The `$0.40` guard is an absolute safety boundary, not permission to exceed the normal target.

No paid retry/replacement loop is permitted. Discovery, evidence, freshness, diversity and media qualification remain free/pre-AI wherever possible.

## Draft Ready and Publication Review

Hard limits remain headline <=70 characters, standfirst <=220, SEO title <=60, SEO description <=160 and paragraph <=120 words, plus filler/formulaic-writing/originality safeguards. Publication Review is mandatory. Critical/high issues block readiness; one bounded correction may use only the supplied fact ledger.

Terra is the generation model. Luna is the Publication Review and bounded correction model. Runtime configuration must be resolved before Publication Review is imported or invoked.

## Progressive delivery

Delivery is one article at a time. As soon as an article passes editorial and mandatory-media gates, send its individual review notification; do not wait for the other four. A later slot failure must not suppress earlier ready articles.

The daily package is complete only when five distinct articles have individually passed and been delivered.

## Human publication boundary

Review-ready drafts are never automatically published. The owner reviews/edits in Sanity and explicitly publishes. Meta auto-sharing is excluded from this launch gate; official embeds inside article bodies are editorial media, not automatic social publishing.

## Morning sequence

1. sanitize exact-day retained state and evict source-cluster duplicates;
2. run free discovery/evidence/match-detail qualification and export recent positions;
3. build the canonical pool using freshness and same-day paid-attempt eligibility;
4. if preferred reserve is thin, run one expanded free refill and repeat deterministic qualification;
5. fail closed only if the strict missing-slot minimum is still short, then enforce Ireland-first/diversity;
6. rank already-qualified candidates so current Irish match/team build-up outranks older Irish profile/interview material;
7. qualify official-media availability wherever possible;
8. calculate normal-target headroom and select only the fresh unpaid slots that fit, with the `$0.40` hard guard still active;
9. generate those selected slots serially with Terra and review/repair with Luna, with zero paid replacements;
10. verify exact official media, read it back from Sanity and omit doubtful local imagery;
11. deliver each article immediately after its complete gate passes;
12. stop only at five delivered articles or a proven launch blocker;
13. owner reviews and explicitly publishes in Sanity.

Do not rerun an old failed workflow SHA after code changes.
