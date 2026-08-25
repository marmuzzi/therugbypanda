# 25 August 2026 — Named-person image conflict fix

## Owner-observed defect

The verified morning package exposed a semantic image-assignment false positive: the Iain Henderson / Ulster article was assigned a photograph whose metadata identified Paddy Jackson. The image matched the province, but not the materially discussed named person.

## Root cause

`SanityDraftWriter` allowed province-level relevance to satisfy the minimum evidence rule when no exact subject match existed. That meant an image of a different named player from the same province could accumulate enough relevance score to become the hero image.

## Fix

The selector now extracts likely named-person phrases from image title/alt/caption metadata and fails the candidate closed when the image names a person who is not present in the article and there is no exact article-subject match. Common rugby organizations, competitions, provinces and venues are excluded from the named-person detector so legitimate team/venue fallback photography remains available.

This does not loosen any rights, usage, locality, diversity or relevance requirement. The fallback remains: relevant subject/team/venue image when valid, otherwise no image.

## Verification boundary

Implementation must compile in preview, merge, deploy and then be exercised by a fresh production draft/image-selection path before MEDIA-009 can be considered closed. The already-sent 25 August email is not resent merely to test this change.
