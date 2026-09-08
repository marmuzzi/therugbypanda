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
→ retained same-day integrity revalidation
→ recent-position freshness and multi-day repetition rejection
→ Ireland-first + team/matchup diversity
→ evict retained state that violates package policy
→ free story-specific media qualification
→ exactly one fresh candidate per missing paid slot
→ Editorial Brain / fact ledger
→ Terra generation
→ deterministic Draft Ready + originality
→ Luna Publication Review + at most one bounded correction
→ critical/high Review #2 blockers fail
→ deterministic post-review gates
→ relevant local/inline image assignment and verification
→ verified official social/video embed insertion and readback
→ individual review notification immediately when that article is ready
→ Editorial Review
→ human edit/approve/publish in Sanity
→ public website
```

Generated content, acquired images and social embeds are never automatically published.

## Ireland-first package contract

At least three of five stories must have a direct Irish connection: Ireland/IRFU, Leinster, Munster, Ulster, Connacht, Irish women, Irish players/coaches abroad, or European competition materially involving Irish teams. International-only stories are capped at two.

Retained same-day drafts are inputs, not entitlements. If retained state contains more than two international-only drafts, newest overflow must be made package-ineligible and those slots refilled from the Irish reserve. If the free evidence stage cannot supply the Irish floor, fail before paid generation; never weaken the quota or evidence floor.

## Evidence-before-spend contract

All normal evidence rules remain: at least two substantive sources from at least two publishers, coherent same-development corroboration, concrete rugby facts, and no non-rugby contamination. Completed-match stories require the final score; squad/selection stories require at least two actual named people; exact-person coherence must reject surname collisions.

The model must never reconstruct basic factual payload that deterministic acquisition failed to supply.

## Freshness and diversity

Freshness identity is **subject + event/development + editorial angle** and must be checked against recent production positions, not merely the current package. Headline rewriting does not make a repeated position fresh.

Package limits: max two same canonical matchup; max two same recognised team; min three Irish-connected; max two international-only. Owner-observed multi-day repetition means this boundary remains pending production proof until five genuinely distinct positions are demonstrated.

## Mandatory media gate

Embedded media is mandatory. It is not an optional enrichment.

An article is not review-ready and must not be notified to the owner unless it has both:

1. story-relevant rights-reviewed local/inline imagery; and
2. at least one verified official social/video embed directly relevant to the person, match, announcement, event or development in the article.

The existing `socialEmbed` renderer supports allowlisted YouTube, Instagram, X/Twitter and Facebook HTTPS URLs. Official-source status is mandatory. Generic same-team posts, wrong people, wrong teams, unrelated events and merely decorative social content fail the gate. If candidate A has no valid media, choose another evidence-qualified candidate rather than forcing irrelevant media.

Media availability should be established during free candidate qualification before model reservation wherever possible. Provider disappearance after generation must fail delivery and trigger a bounded candidate/media recovery path without auto-publication.

The controlled 5 September Munster Instagram mutation/readback proves the Sanity embed mechanism, but automatic story-specific acquisition and mandatory enforcement are not production-verified and remain tracked under MEDIA-010.

## Launch slot budget

The application-wide OpenAI reservation ceiling is `$0.40` per Europe/Dublin operational day. A production draft pipeline reservation is `$0.055`. Discovery, evidence, freshness, diversity and media qualification run before paid reservation. Generation is serial and replacement must not become an unbounded paid loop. The Sanity daily guard remains authoritative.

## Draft Ready and Publication Review

Hard limits remain headline <=70 characters, standfirst <=220, SEO title <=60, SEO description <=160 and paragraph <=120 words, plus filler/formulaic-writing/originality safeguards. Publication Review is mandatory. Critical/high issues block readiness; medium/low observations are advisory unless a deterministic hard gate independently fails; one bounded correction may use only the supplied fact ledger.

## Images

Only rights-reviewed, usage-approved local Sanity assets are eligible for automatic assignment. Relevance beats fill rate. Priority: exact person → correct team/event/venue → genuinely relevant rugby context → approved relevant brand fallback → no image. Hard conflicts fail closed: wrong named person, conflicting team, men/women mismatch, unrelated event context, duplicate package/body assets.

A large image library is not evidence of relevance. Semantic verification is required on each article.

## Progressive notifications and Zoho

Delivery is one article at a time. As soon as one article has passed editorial, image and mandatory embed gates, send its individual review notification; do not wait for the other four. Failure of a later slot must not suppress already-ready earlier articles.

The daily package is complete only when five distinct articles have individually passed and been delivered. The historical consolidated exact-five Zoho path must not be allowed to redefine readiness or suppress progressive notifications. This coexistence remains pending production reconciliation under AUTO-003-P24.

## Human publication boundary

Review-ready drafts are never automatically published. The owner reviews/edits in Sanity and explicitly publishes. Meta/social auto-publishing is excluded from the launch gate; official social/video embeds inside article bodies are editorial media and are required by the media gate.

## Morning sequence

1. run free discovery/evidence/freshness/diversity;
2. evict invalid retained state and verify >=3 Irish-connected package capacity;
3. qualify relevant local imagery and official social/video embed availability for candidate slots;
4. reserve paid budget only for qualified missing slots under `$0.40/day`;
5. generate/review serially;
6. assign and verify imagery, insert and read back official embed;
7. notify each article immediately after its complete gate passes;
8. continue until exactly five distinct review-ready articles are delivered;
9. owner reviews and publishes in Sanity.

Do not rerun an old failed workflow SHA after code changes.
