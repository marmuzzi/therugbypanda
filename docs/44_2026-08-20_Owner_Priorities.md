# Owner Priorities — 20 August 2026

## Purpose

This document records the approved execution order for The Rugby Panda. Where older roadmap sequencing conflicts with these priorities, this document wins until the roadmap is reconciled.

## Go-live milestone

**Meaningful production go-live target: Thursday 27 August 2026.**

The essential launch system should be substantially ready by **Wednesday 26 August**, leaving 27 August primarily for production verification, controlled launch actions and issue resolution rather than unfinished core development.

The owner is unavailable Saturday 22 and Sunday 23 August. Work should therefore be batched efficiently, avoid unnecessary deployments, and prioritise launch blockers over non-essential polish.

A meaningful go-live does not require every future roadmap item to be complete. It does require a credible automated newsroom, safe/original editorial output, a useful relevant media pool, and a production website/social workflow that can be operated sustainably.

## Priority 1 — Five quality articles in one mailbox package by 08:00 every day

The daily editorial system must automatically deliver one consolidated email to the editor by 08:00 Europe/Dublin containing five distinct, current, production-eligible, review-ready Rugby Panda articles.

Completion requires all of the following together:

- five genuinely current stories are acquired automatically;
- each story uses sufficiently independent source material;
- each generated article is materially original and passes the fail-closed originality gate;
- copy is concrete, player/coach/signing-aware and useful to supporters when evidence supports it;
- no QA/test content enters the package;
- article image assignment is relevant or deliberately left blank;
- five per-draft emails are suppressed;
- exactly one consolidated editorial package reaches the mailbox by 08:00;
- retries/failures raise the technical-alert path;
- successful automatic delivery is verified on multiple consecutive mornings.

### Mandatory style diversity inside Priority 1

The five articles must not read as if one template or one journalist produced all of them.

The generator and public renderer should deliberately vary, within Rugby Panda editorial standards:

- headline construction and length;
- opening style;
- paragraph rhythm and length;
- article structure and section count;
- use or omission of subheadings;
- selective bold emphasis where editorially useful;
- analytical versus news-led framing;
- concluding style;
- sentence cadence and vocabulary;
- image placement/presentation and other supported article-layout treatments where appropriate.

Variation must never weaken factual accuracy, originality, readability or the no-process-language rule. The public author identity may remain The Rugby Panda; style variation must not falsely attribute work to named real journalists.

## Priority 2 — Automatic Facebook and Instagram snippets after publication

After controlled website publication, automatically prepare and publish platform-appropriate snippets to Facebook and Instagram.

Requirements:

- website publication remains the prerequisite;
- use an approved relevant image;
- generate platform-specific copy rather than posting the article body;
- preserve the article-level social opt-out control;
- store provider post IDs, timestamps, success/failure state and retry information;
- social failure must not roll back a successful website publication;
- verify real production delivery through Meta before completion.

## Priority 3 — Large, relevant and reusable media pool

Build a varied media library suitable for likely Rugby Panda stories while controlling acquisition cost.

### Readiness targets

The combined usable-media target includes approved Editorial Images plus approved Brand Assets such as team, union and competition logos.

- **200 usable approved media assets** = minimum launch-ready library.
- **500 usable approved media assets** = strong operating target.

For reporting, always show both the combined total and the split between Editorial Images and Brand Assets. Brand Assets remain technically separate because logo/trademark controls differ from photography rights.

A media item counts as usable only when it is relevant, rights-reviewed for its intended editorial use, stored in the approved Sanity workflow and genuinely suitable for publication. Candidate records, weak placeholders, unrelated images and unreviewed third-party assets do not count toward 200/500.

Coverage should include:

- Leinster, Munster, Ulster and Connacht;
- Ireland Men and Ireland Women;
- current players and coaches;
- new signings;
- all URC clubs;
- Six Nations teams;
- Nations Championship/international sides;
- Champions Cup and Challenge Cup subjects;
- professional match action, training and relevant venues;
- approved team, union and competition logos needed for reader-facing coverage.

Acquisition should be precision-first: exact team/player/event searches, small result caps and measured useful-image yield. Apify is a metered service and must not be used to chase volume. The first paid batch after a query redesign should remain small; expand only after useful-image yield is strong.

The assistant performs first-pass relevance review for clear approve/reject decisions, escalating only genuinely uncertain cases to the owner. Old images should be retained only when deliberately useful as historical/context or evergreen venue imagery; current-season subjects should prefer current imagery where reliable date metadata exists.

Automatic article assignment remains fail-closed: no unrelated image is better than a wrong image.

### Logo editorial-use rule

Approved team, union and competition logos may be used when the article is genuinely about that specific team, union or competition. Logos must not be used as unrelated decoration or in a way that implies sponsorship, endorsement or official affiliation. Brand Assets remain separately governed and rights-recorded even though approved logos count toward the combined 200/500 readiness target.

Preferred article-media fallback order is:

1. relevant approved current photo;
2. relevant approved historical/context or evergreen venue photo where editorially appropriate;
3. relevant approved team/union/competition logo;
4. no image rather than an unrelated image.

## Priority 4 — Very easy phone-first photo upload

Create a secure mobile workflow that makes original Rugby Panda photo upload fast enough to use at matches and events.

Target experience:

1. open a phone-friendly upload page;
2. select or take one or many photos;
3. optionally choose team/event/competition and add a short note;
4. upload directly into the controlled media workflow;
5. automatically preserve orientation and useful metadata;
6. create review-ready Sanity media records with sensible caption/tag suggestions.

The flow should require minimal typing and no GitHub/manual desktop steps.

## Priority 5 — 14:00 major-announcement check and conditional article generation

Every day at 14:00 Europe/Dublin, automatically check approved rugby news sources for major developments that materially justify new Rugby Panda coverage.

Examples include:

- major squad or team announcements;
- coaching changes;
- significant signings/departures;
- competition/fixture changes;
- disciplinary decisions;
- major injuries where responsibly reported;
- IRFU/province/URC/EPCR/World Rugby announcements;
- other high-impact developments relevant to Irish, URC, European or international rugby coverage.

The check must be conditional: do not create filler articles merely because the 14:00 job ran. When a major development is detected, build a multi-source evidence pack and create a new review-ready draft through the same originality, image-relevance and Sanity approval boundaries as the morning workflow.

## Execution order to 27 August

1. Finish and production-verify Priority 1, including originality, independent-source synthesis, meaningful style/layout diversity and exactly-one-email delivery.
2. In parallel, improve the relevant media pool toward the 200 launch minimum using precision/cost-controlled acquisition and assistant-led review.
3. Complete and production-verify automatic Meta social distribution after website publication.
4. Build the phone-first Media Desk upload path if it can be completed without jeopardising the first three launch gates.
5. Add the 14:00 major-announcement watcher and conditional generation path if the core morning newsroom is stable; otherwise it is the first immediate post-launch enhancement.

The image/media pool may continue incrementally throughout because it supports both morning articles and social distribution, but broad high-cost acquisition runs are not permitted.

## Completion rule

For every priority distinguish: implemented, committed, PR opened, merged, deployed, verified in production, and provider-specific verification where relevant. A priority is not complete until the user-facing production outcome has been verified.
