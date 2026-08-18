# AUTO-004 Multisource and Editorial Image Handoff — 18 August 2026

## Purpose

This is the authoritative continuation note for the next Rugby Panda chat. It supersedes the AUTO-004 resume point in `docs/38_2026-08-17_End_of_Session_Handoff.md` where later work described here conflicts with it.

Repository: `marmuzzi/therugbypanda`

Production: `https://therugbypanda.ie`

Timezone: `Europe/Dublin`

Sanity remains the mandatory human approval boundary. Acquired or generated content and image candidates must never be automatically approved or published.

## What happened on 18 August

The controlled AUTO-004 five-story production import succeeded after two infrastructure defects were fixed:

- GitHub Actions initially lacked `EDITORIAL_AUTOMATION_SECRET`; the secret was safely rotated/configured in GitHub and Vercel.
- the draft writer incorrectly expected `Munster`, `Leinster`, `Ulster` and `Connacht` to be Sanity categories. PR #173 fixed this by mapping province stories to category `Provinces` plus the correct province reference.

The successful run created five current production drafts, but editorial review exposed three important defects:

1. five individual draft emails were sent, while the intended morning experience is one consolidated email containing the five articles;
2. generated articles were too generic, lacked enough named players/new signings/selection interest, and exposed internal sourcing/speculation/process language to readers;
3. the article body could not be edited directly in Editorial Review.

PR #174 fixed these mechanics and merged as `acac0fab15fd208a3609ca8eeac6ea70509c9e7d`:

- morning batch imports suppress per-draft NOTIFY-001 messages so AUTO-001 can be the single consolidated morning notification;
- generation instructions require concrete rugby substance, named people and what-to-watch angles when supported by evidence, and prohibit reader-facing internal sourcing/process explanations;
- Editorial Review supports direct body editing with heading preservation.

PR #175 merged as `11a0adac765b6d4050dc67cd772d23b420d4e396` and enriched the five controlled AUTO-004 story packets with more concrete squad/player context. These packets are test fixtures for AUTO-004, not the desired final acquisition architecture.

## New editorial requirement: multi-source synthesis

The owner clarified that a Rugby Panda article must not be a rewrite of one source. The acquisition engine should gather multiple relevant sources from around the internet and build one evidence pack for each story. The generator should synthesize the useful facts, context and angles from that source set into an original Rugby Panda article that is more useful and interesting than any individual input article.

PR #176 implements the generation-side contract and merged as `1470df4d9cf5ca0111a0fe1402742ac400b42440`:

- all available `sourceRecords` must be synthesized rather than treating the first source as the article;
- primary/official sources should anchor hard facts;
- reputable secondary reporting can add context, interviews, analysis and useful colour;
- overlapping or conflicting claims must be reconciled conservatively;
- the output must add editorial value and must not closely paraphrase a source.

At handoff time the PR #176 production deployment had started and was still BUILDING. The next chat must check its actual final Vercel state before claiming production deployment/verification.

## New image requirement: relevance before fallback

The owner explicitly rejected the existing behaviour where an Ulster article could receive an unrelated Ageing Pandas amateur/veterans image.

PR #176 changes automatic image assignment to fail closed:

- province mismatches are rejected;
- generic or unrelated imagery must not be selected merely because it is approved;
- an image must clear a positive relevance threshold based on the story/entity/content;
- if no sufficiently relevant approved image exists, leave the article without an automatically assigned image rather than assigning a misleading one.

This code is implemented and merged but still requires production verification after the #176 deployment reaches READY.

## Immediate Apify task — at least 200 relevant image candidates

The owner explicitly requested: **use Apify to get at least another 200 relevant pictures for Rugby Panda articles**.

The current chat could not execute that crawl because developer MCP execution for Apify became unavailable in the conversation. Do not interpret that as the underlying Apify service being unconfigured. The next chat should check `@Apify` availability immediately and, if available, execute this task before returning to the five-story regeneration.

### Collection objective

Collect at least 200 genuinely useful editorial-image **candidates**, with broad coverage of:

- Leinster Rugby;
- Munster Rugby;
- Ulster Rugby;
- Connacht Rugby;
- Ireland Men;
- Ireland Women;
- named current players and coaches;
- new signings and squad features;
- professional match action;
- training sessions;
- URC, Champions Cup, Challenge Cup and relevant international rugby;
- major relevant venues/stadiums.

Prefer images that can be matched to the actual article subject: team, named player/coach, fixture, competition, venue or event.

### Rights and safety boundary

Apify collection creates **candidates only**. Do not mark third-party images approved merely because they were discovered. Preserve source URL, image URL, source organisation/site, page context, caption/alt text where available, and any rights/licensing/permission metadata that can be established. Existing Rugby Panda original photography remains preferred. Third-party photographs require documented rights or explicit permission before publication/automatic assignment.

Do not hotlink unreviewed third-party assets into public pages.

### Quality rule

Do not chase 200 by adding irrelevant rugby imagery. The target is at least 200 candidates that improve article matching. Amateur/veterans-team photographs such as Ageing Pandas must not be eligible for professional province/national-team stories unless the story is actually about that team/event.

After collection, deduplicate candidates, import/store them through the existing Editorial Image candidate/review path, and keep them unapproved until rights/editorial review is complete.

## AUTO-004 exact resume point

1. Check GitHub `main` and confirm PR #176 is merged at `1470df4d9cf5ca0111a0fe1402742ac400b42440`.
2. Check the corresponding Vercel production deployment and wait for/confirm READY.
3. Check whether Apify is available in the new chat.
4. If available, collect at least 200 relevant image candidates under the scope above and preserve rights/source metadata.
5. Inspect the existing Editorial Image candidate/import tooling and use the maintained path rather than inventing a second library.
6. Verify the PR #176 fail-closed image selector in production with representative province/national stories.
7. Move acquisition from manually enriched single-source-ish packets toward deliberate multi-source evidence packs per story.
8. Regenerate the five AUTO-004 stories using multiple relevant sources per story.
9. Inspect the generated copy before package delivery: named people and concrete rugby detail where supported; useful analysis/what-to-watch; no internal sourcing/process explanations; no close paraphrase.
10. Verify morning batch generation sends no five individual draft emails.
11. Verify Editorial Review body editing in authenticated hosted Sanity Studio.
12. Run the real AUTO-001 package and verify exactly one consolidated five-article email.
13. Only then close AUTO-004/EDIT-001/NOTIFY-004/CMS-004 as appropriate and update documentation.

## Do not regress

- Do not rebuild AUTO-001, NOTIFY-001/002/003 or the AUTO-004 production eligibility guard; those foundations are already verified.
- Do not auto-publish generated articles.
- Do not auto-approve acquired images.
- Do not expose internal AI/process/sourcing-policy explanations in reader-facing copy.
- Do not assign a merely available image when it is not relevant to the article.
- Do not treat a single-source rewrite as the final acquisition/generation design.

## Session completion discipline

Always distinguish implemented, committed, PR opened, merged, deployed, production verified, authenticated Sanity Studio verified, Make verified and documentation updated. A feature is not complete until its relevant verification passes.