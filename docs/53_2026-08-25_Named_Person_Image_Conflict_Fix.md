# 25 August 2026 — Named-person image conflict fix

## Owner-observed defect

The verified morning package exposed a semantic image-assignment false positive: the Iain Henderson / Ulster article was assigned a photograph whose metadata identified Paddy Jackson. The image matched the province, but not the materially discussed named person.

## Root cause

`SanityDraftWriter` allowed province-level relevance to satisfy the minimum evidence rule when no exact subject match existed. That meant an image of a different named player from the same province could accumulate enough relevance score to become the hero image.

## Permanent selector fix — PR #273

The selector now extracts likely named-person phrases from image title/alt/caption metadata and fails the candidate closed when the image names a person who is not present in the article and there is no exact article-subject match. Common rugby organizations, competitions, provinces and venues are excluded from the named-person detector so legitimate team/venue fallback photography remains available.

This does not loosen any rights, usage, locality, diversity or relevance requirement. The fallback remains: relevant subject/team/venue image when valid, otherwise no image.

PR #273 passed preview, merged as `f63593106dc7b353f40414556d39fdb9eafa5a27`, and the exact commit reached Vercel production READY. A fresh generated production selection is still required before the general MEDIA-009 rule can be considered fully regression-proven.

## Current Henderson draft repair — PR #274

A separate fail-closed one-shot production repair was merged as `f13a22e7031d43a222dac41e21a07f570a25fa0d`. It only mutates the current morning-package Henderson draft if the featured image metadata explicitly identifies Paddy Jackson while the article itself does not discuss him. It then uses an approved exact Henderson image if one exists; otherwise it removes the wrong hero rather than substituting an unrelated image.

GitHub Actions run `32884915047` completed successfully. The production read-back result was:

- article: `drafts.article-auto004-fresh-ulster-henderson-depth-20260824`
- old image: `Paddy Jackson 2015.jpg`
- exact approved Henderson replacement available: no
- action: wrong featured image removed
- verified featured asset after mutation: none

The current Henderson draft is therefore corrected in production Sanity and now correctly fails closed to no hero image.

## Deployment boundary

The selector runtime fix from #273 is deployed production READY. The #274 one-shot Sanity repair itself is production-verified through the successful mutation/read-back workflow and does not require Vercel runtime code to execute. The repository commit containing the one-shot workflow hit the Vercel Hobby build-rate limit, so that commit must not be described as Vercel-deployed. This does not undo either the already-deployed #273 selector fix or the verified Sanity mutation.

The already-sent 25 August consolidated email is not resent merely to test styling or image changes because the package delivery lock is intentionally exactly-once.
