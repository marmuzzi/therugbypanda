# Publishing Workflow

Sanity Studio is the canonical CMS and mandatory human approval/publication boundary.

## Session startup

Read `docs/07_Project_State.md`, `docs/08_Issue_Log.md`, this file and newest relevant dated evidence. Check GitHub/Vercel/current integrations before asking the owner to configure anything. Use Europe/Dublin for schedules.

## Completion discipline

Always distinguish implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity verified and provider/delivery verified. A code merge is not production verification.

## Required editorial flow

```text
free standard + targeted Irish source discovery
→ coherent corroboration and story-type concrete evidence
→ retained exact-day integrity + source-cluster duplicate eviction
→ recent-position freshness and multi-day repetition rejection
→ Ireland-first + team/matchup diversity
→ free story-specific official embed qualification wherever possible
→ exactly one fresh candidate per missing paid slot
→ Editorial Brain / fact ledger
→ Terra generation
→ deterministic Draft Ready + originality
→ Luna Publication Review + at most one bounded correction
→ deterministic post-review gates
→ exact curated official embed or verified official-source discovery
→ Sanity embed insertion and readback
→ remove weak local imagery when an exact official embed is present
→ individual review notification immediately when that article is ready
→ human review/edit/publish in Sanity
→ public website
```

Generated content and embedded media are never automatically published.

## Ireland-first package contract

At least three of five stories must have a direct Irish connection: Ireland/IRFU, Leinster, Munster, Ulster, Connacht, Irish women, Irish players/coaches abroad, or European competition materially involving Irish teams. International-only stories are capped at two.

Retained same-day drafts are inputs, not entitlements. Invalid or materially duplicate retained positions must be made package-ineligible and replaced from the evidence reserve. Never weaken the Irish floor or evidence floor to complete five slots.

## Evidence-before-spend contract

Require at least two substantive sources from at least two publishers, coherent same-development corroboration, concrete rugby facts, and no non-rugby contamination. Completed-match stories require the final score; squad/selection stories require actual named people; exact-person coherence rejects surname collisions. Match-like stories must satisfy the same concrete-detail classes before model spend that the generation API enforces.

A candidate that already consumed a paid reservation on the current Dublin day is excluded from another paid slot.

## Freshness and diversity

Freshness identity is **subject + event/development + editorial angle** and is checked against recent production positions. Headline rewriting does not make a repeated position fresh. Source-cluster overlap with a retained article is also a duplicate signal.

Package limits remain max two same canonical matchup, max two same recognised team, min three Irish-connected and max two international-only.

## Mandatory embed-first media gate

Embedded media is mandatory. Local imagery is not.

An article is not review-ready and must not be notified unless it contains at least one verified official social/video embed directly relevant to the person, match, announcement, event or development in the article.

The `socialEmbed` renderer supports allowlisted YouTube, Instagram, X/Twitter and Facebook HTTPS URLs. Official-source status is mandatory. Generic same-team posts, wrong people, wrong teams, unrelated events and decorative content fail the gate.

Media priority is:

1. exact curated official person/event embed;
2. exact official team/competition video or social post discovered automatically;
3. another independently verified official embed with direct story relevance;
4. block the article and select another candidate.

A local Sanity image may be included only when it independently passes semantic relevance checks. A large image library is not evidence of relevance. If the local image is doubtful and an exact official embed exists, omit the local image. For curated exact embeds the media workflow removes existing featured and inline local images and verifies the resulting embed-only article in Sanity.

The 9 September production run `34327661508` proves this path for Tom Wood/Munster and Fintan Gunne/Leinster. The Waratahs/Brumbies article remained blocked because no exact official media was verified; that is correct fail-closed behavior.

Media availability should be established before paid generation wherever possible. Media-only recovery can be run independently of generation and does not require AI budget.

## Launch slot budget

The application-wide OpenAI reservation ceiling is `$0.40` per Europe/Dublin operational day. A production draft reservation is `$0.055`. Discovery, evidence, freshness, diversity and media qualification run before paid reservation. Generation is serial, one selected candidate per missing slot, with zero paid replacement candidates in the normal scheduled workflow. The Sanity daily guard remains authoritative.

## Draft Ready and Publication Review

Hard limits remain headline <=70 characters, standfirst <=220, SEO title <=60, SEO description <=160 and paragraph <=120 words, plus filler/formulaic-writing/originality safeguards. Publication Review is mandatory. Critical/high issues block readiness; one bounded correction may use only the supplied fact ledger.

## Progressive notifications and Zoho

Delivery is one article at a time. As soon as an article has passed editorial and mandatory embed gates, send its individual review notification; do not wait for the other four. Failure of a later slot must not suppress already-ready earlier articles.

The daily package is complete only when five distinct articles have individually passed and been delivered. Package-mode generation notifications remain suppressed until media verification.

## Human publication boundary

Review-ready drafts are never automatically published. The owner reviews/edits in Sanity and explicitly publishes. Meta/social auto-publishing is excluded from the launch gate; official social/video embeds inside article bodies are editorial media.

## Morning sequence

1. sanitize exact-day retained state and evict source-cluster duplicates;
2. run free discovery/evidence/freshness/diversity and verify >=3 Irish-connected package capacity;
3. qualify official embed availability wherever possible;
4. assign one candidate to each missing paid slot, excluding already-paid IDs;
5. reserve/generate serially under `$0.40/day`, with no paid replacement loop;
6. apply exact curated embeds first, then official-source fallback discovery;
7. read back the embed in Sanity and remove doubtful local imagery when an exact embed exists;
8. notify each article immediately after its complete gate passes;
9. continue until five distinct review-ready articles are delivered;
10. owner reviews and publishes in Sanity.

Do not rerun an old failed workflow SHA after code changes.
