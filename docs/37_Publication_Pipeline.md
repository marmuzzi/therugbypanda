# Publication Pipeline

Status: Approved architecture and implementation handoff. The data-contract work is in PR #101; Make.com delivery and the visual Sanity Publication Preview remain to be implemented and verified.

## Purpose

This document is the definitive specification for the one-click publication pipeline used by The Rugby Panda.

The pipeline converts one human editorial approval into:

- controlled website publication;
- automatic publication preparation;
- AI-assisted platform image selection;
- platform-specific copy;
- website and social readiness checks;
- image-backed Facebook and Instagram distribution;
- durable delivery and retry records.

## Non-negotiable editorial boundary

Sanity remains the mandatory human approval boundary.

One article approval authorises:

1. website publication;
2. automatic publication preparation;
3. Facebook and Instagram distribution unless the editor selects **Skip automatic social distribution**.

There is no second social-media approval.

No AI-generated or acquired article is approved without human editorial review.

## End-to-end architecture

```text
Apify / approved acquisition
→ Editorial Brain
→ OpenAI structured article generation
→ Sanity draft
→ human editorial review
→ one approval
→ controlled website publication
→ publication-preparation event
→ Make.com orchestration
→ eligible image collection
→ AI image ranking
→ image transforms and crops
→ platform-specific captions
→ preview and readiness checks
→ idempotent social-publishing event
→ Facebook and Instagram delivery
→ Sanity delivery-state update
→ analytics and future learning
```

## System responsibilities

### Sanity

Sanity is responsible for:

- canonical article content;
- editorial workflow and approval;
- article revision identity;
- eligible Editorial Image records and rights metadata;
- the social skip override;
- publication-preparation state;
- selected image and caption snapshots;
- readiness results;
- platform delivery status;
- platform post IDs and URLs;
- attempt counts and actionable errors;
- audit history.

Workflow-owned delivery and preparation fields should be read-only in Studio except for explicit editorial overrides.

### Vercel / application layer

The application layer is responsible for:

- controlled publication endpoints;
- canonical article URLs;
- website rendering;
- preview URLs or screenshots where implemented;
- secure webhook or API interfaces between Sanity and Make.com;
- secret validation and request timeouts;
- isolating downstream failures from successful website publication.

### Make.com

Make.com is the orchestration layer after publication. It is responsible for:

- receiving or polling publication-preparation events;
- validating secrets and payloads;
- checking the skip override;
- enforcing idempotency;
- collecting eligible image candidates;
- invoking AI image ranking;
- invoking platform caption generation;
- creating platform-specific image variants;
- publishing to Facebook and Instagram;
- handling partial success;
- retrying transient failures;
- writing status and platform results back to Sanity;
- routing terminal failures to `admin@therugbypanda.ie`.

The current connected Make toolbox does not expose scenario-editing functions. Scenario configuration must be performed manually or through a future connection with scenario-management actions.

### OpenAI / AI services

AI services may assist with:

- image ranking;
- crop recommendations;
- platform-specific teaser copy;
- SEO and accessibility suggestions;
- presentation warnings;
- automatic fixes that do not alter approved facts or editorial meaning.

AI services must not:

- invent facts;
- change the approved editorial position;
- infer image rights;
- select unapproved imagery;
- introduce a second approval requirement;
- publish directly without the controlled orchestration layer.

## Publication event lifecycle

Recommended preparation states:

```text
not-prepared
→ preparing
→ ready
→ publishing
→ published
```

Alternative terminal or waiting states:

```text
skipped
waiting-for-image
failed
partially-published
```

Transitions must be explicit and auditable.

## Idempotency

Each publication event must have a stable `eventId`.

The idempotency scope is:

```text
eventId + platform
```

The workflow must check whether a platform post has already succeeded before attempting another publish.

A retry must never duplicate an existing successful Facebook or Instagram post.

## Image eligibility

An image candidate is eligible only when:

- usage is approved;
- lifecycle status permits publication;
- rights metadata is sufficient;
- the image is backed by a Sanity asset or controlled public URL;
- required attribution and credit information is available;
- it is not marked archive-only or otherwise restricted from the intended use.

Original Rugby Panda photography is preferred.

No external candidate image may be assumed safe because it is publicly accessible.

## AI image-ranking inputs

The ranking request should include:

- article headline;
- standfirst;
- key points;
- article category, team, province and competition;
- named players or coaches where safely derived from approved content;
- candidate image URL or controlled asset reference;
- alt text and caption;
- photo type;
- suggested uses;
- source and rights metadata;
- dimensions and orientation;
- hotspot or crop metadata when available.

## AI image-ranking criteria

Each candidate should be scored for:

- editorial relevance;
- visual impact;
- emotion and human interest;
- subject clarity;
- face preservation;
- crop suitability;
- platform orientation;
- website hero suitability;
- Facebook suitability;
- Instagram suitability;
- rights completeness;
- attribution completeness;
- duplicate or near-duplicate risk.

Rights eligibility is a hard gate, not a weighted preference.

## Platform-specific selection

The system may select:

- one image for the website;
- a different image for Facebook;
- a different image for Instagram.

Examples:

- Website: context-rich landscape action image.
- Facebook: wide celebration or match moment.
- Instagram: close-up emotion or portrait-oriented image.

Selection decisions and confidence should be stored for audit and future tuning where practical.

## Image transforms

The pipeline should prepare at least:

- website hero landscape;
- Facebook landscape;
- Instagram square;
- Instagram portrait.

Future variants may include Stories and other channel formats.

Transformations must preserve the principal subject, avoid cutting faces or key action, and retain credit or attribution requirements where the platform or licence requires it.

## Caption generation

Facebook and Instagram captions must be generated separately from the approved article.

Requirements:

- faithful to the approved article;
- no new factual claims;
- concise and platform-appropriate;
- clear call to action;
- canonical article link on Facebook where supported;
- approved link-in-bio wording or equivalent on Instagram;
- restrained hashtags;
- no unapproved sensationalism;
- campaign tracking parameters where supported.

Generated copy should be stored as a publication snapshot so the exact published wording is auditable.

## Publication Preview

The Sanity Publication Preview should present:

### Website

- rendered headline and standfirst;
- website image and crop;
- article preview URL;
- image credit and alt text;
- mobile and desktop confidence indicators where implemented.

### Facebook

- selected image;
- generated teaser;
- article link;
- readiness status.

### Instagram

- selected image and crop;
- generated caption;
- link-in-bio call to action;
- hashtags;
- readiness status.

### Quality results

- SEO score;
- accessibility score;
- social-readiness score;
- passed checks;
- warnings;
- failures;
- automatic fixes.

The preview is an information and confidence layer. It is not a second editorial approval gate.

## Failure handling

### Website publication failure

If controlled website publication fails, downstream preparation must not begin.

### Missing image

If no eligible image exists:

1. keep the website article live if publication succeeded;
2. do not create text-only posts;
3. mark the event `waiting-for-image` or failed with `missing-image`;
4. record the reason and timestamp;
5. retry after an eligible image is attached;
6. do not request another editorial approval.

### Caption or ranking failure

If AI preparation fails:

- keep the website article live;
- record the actionable error;
- retry according to policy;
- do not publish incomplete or text-only social content.

### Partial platform success

If Facebook succeeds and Instagram fails, or the reverse:

- preserve the successful post;
- store its platform ID and URL;
- mark the event partially published;
- retry only the failed platform;
- never roll back the successful platform post.

### Terminal failure

After the configured retry limit:

- mark the relevant platform failed;
- preserve all successful platform data;
- send a technical alert to `admin@therugbypanda.ie`;
- provide enough context to diagnose the article, event, platform and failure.

## Retry policy

The implementation should distinguish:

- transient errors, such as rate limits or service outages;
- permanent configuration errors, such as invalid credentials;
- content prerequisites, such as missing image or alt text;
- platform validation errors.

Retries should use bounded backoff and stable idempotency.

The exact retry cadence should be configured in Make.com and documented once implemented.

## Security

- Store secrets only in approved environment or connection stores.
- Never write tokens into Sanity documents or logs.
- Validate webhook signatures or shared secrets.
- Use minimum required Meta permissions.
- Record operational context without exposing credentials.
- Rotate credentials after suspected exposure.
- Treat Make.com, Meta and Sanity write credentials as production secrets.

## Analytics and learning loop

A future learning loop may use aggregate metrics such as:

- reach;
- link clicks;
- click-through rate;
- reactions;
- comments;
- shares;
- saves;
- video or image engagement where relevant.

The system may learn which image and caption characteristics perform best for The Rugby Panda audience.

Learning must remain subordinate to:

- editorial accuracy;
- image rights;
- accessibility;
- platform policy;
- brand standards.

It must not reward misleading or sensational content.

## Implementation sequence

1. Merge and verify PR #101.
2. Build the Sanity Publication Preview component.
3. Finalise the event payload and secure Make.com trigger.
4. Build image-candidate retrieval.
5. Implement AI image ranking.
6. Implement image transformations.
7. Implement Facebook and Instagram caption generation.
8. Configure Meta publishing connections.
9. Implement platform routes, idempotency and partial-success handling.
10. Implement Sanity write-back.
11. Implement retries and technical alerts.
12. Run controlled non-public tests where supported.
13. Run controlled production posts.
14. Verify website independence from social failure.
15. Document the final Make.com scenario and production configuration.

## Verification checklist

The pipeline is complete only when all relevant checks pass:

- PR #101 merged;
- schema compilation succeeds;
- authenticated Studio displays required fields and preview UI;
- one approved article publishes to the website;
- the social skip override prevents distribution;
- eligible images are collected correctly;
- AI selects only approved assets;
- Facebook and Instagram receive image-backed posts;
- no text-only fallback occurs;
- canonical tracking links are correct;
- duplicate event replay creates no duplicate posts;
- partial success retries only the failed platform;
- missing-image recovery succeeds without another approval;
- terminal failures reach `admin@therugbypanda.ie`;
- all platform IDs, URLs, attempts and errors are written back to Sanity;
- documentation and Issue Log are updated.
