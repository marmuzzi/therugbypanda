# Publication Preview and AI Image Selection

Status: Contract implemented on PR #101; Make.com orchestration and Studio visual component remain pending.

## Editorial principle

Article approval is the single human approval boundary.

After approval, the system automatically prepares the website and social presentation. The preparation stage is not a second editorial approval and must not require the editor to approve Facebook or Instagram separately.

## Automatic preparation workflow

1. The editor approves the article.
2. The article is published to the website.
3. Make.com receives the controlled publication event.
4. The workflow resolves all usage-approved image candidates relevant to the article.
5. AI ranks the candidates for editorial relevance, visual impact, emotion, subject visibility, crop suitability and platform fit.
6. The workflow selects the website, Facebook and Instagram images. The same image may be used everywhere, but platform-specific choices are allowed.
7. The workflow generates Facebook and Instagram snippets from the approved article.
8. The workflow generates the website preview URL and quality checks.
9. Sanity stores the complete publication preview and readiness result.
10. Social delivery proceeds automatically unless the exception override is enabled.

## Publication preview

The Sanity publication preview must surface:

- website preview URL;
- selected website image;
- selected Facebook image;
- selected Instagram image;
- image alt text;
- Facebook post preview;
- Instagram post preview;
- SEO score;
- accessibility score;
- social-readiness score;
- passed checks, warnings, failures and automatic fixes.

## AI image-selection rules

Only usage-approved editorial images may be considered.

The selector should score:

- direct relevance to the article;
- people, teams, competition and match alignment;
- visual impact and emotional strength;
- face and subject visibility;
- image quality and usable resolution;
- crop suitability for website landscape, Facebook and Instagram;
- rights, licence and attribution completeness;
- duplication or overuse of the same asset;
- historical engagement performance when analytics become available.

The selector must never bypass image rights or usage approval.

## Required checks

The automatic preparation stage should detect and, where safe, fix:

- missing or weak featured image;
- image crop cutting through a face or primary subject;
- missing alt text or credit;
- excessively long headline or standfirst;
- Facebook copy that simply repeats the headline;
- unsuitable Instagram caption or hashtag volume;
- missing canonical link or tracking parameters;
- poor SEO title or description;
- accessibility problems;
- missing public image URL.

## Failure behaviour

Website publication remains independent from downstream presentation and social delivery.

A preparation or social failure must not unpublish or roll back an approved website article. The workflow records an actionable error and may retry automatically.

Text-only social promotion remains prohibited. When no approved usable image exists, social publishing waits until an image is available without requesting a second editorial approval.

## Implementation boundary

PR #101 provides the Sanity data contract for:

- publication preparation status;
- website preview URL;
- platform-specific AI-selected images;
- generated social previews;
- SEO, accessibility and social-readiness scores;
- publication checks and automatic-fix markers.

Still required:

- Make.com scenario implementation;
- AI ranking prompt and structured response contract;
- Sanity visual Publication Preview component;
- website preview rendering and screenshot validation;
- Meta API integration;
- engagement analytics and learning loop.
