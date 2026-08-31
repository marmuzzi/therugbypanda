# P0 — Image verification before Zoho

Date: 1 September 2026
Issues: MEDIA-011 / MEDIA-012 / AUTO-003 / LAUNCH-001
Priority: P0 / Critical
Status: Implemented; pending merge/deployment/production verification

## Production evidence

On 31 August the fresh acquisition workflow sent a five-item Zoho package before the separate image workflow ran. The downstream image workflow then failed because only four true current-package drafts existed. A New Zealand/Springboks story also carried an unrelated Limerick contextual-card image. The email was therefore already delivered before image safety could correct or block the package.

## Root causes

1. Article generation and Zoho delivery were one transaction, but MEDIA-011 ran later as a separate `workflow_run`.
2. The daily image planner selected the five most recently updated eligible drafts rather than the exact current Europe/Dublin package identity.
3. The visual enrichment script still contained hard-coded launch-era editorial input IDs and was not part of the normal daily path.
4. The planner acquired/triaged image candidates but did not guarantee that the exact five articles were assigned and read back with relevant hero + inline imagery before email.

## Fix

- Current-source workflow now executes the existing MEDIA-011 planning, targeted deficit discovery, strict rights/relevance triage, Sanity import, readiness audit and re-plan **before** Zoho.
- Image planning is bound to `current-<Europe/Dublin package date>-*` and exactly five distinct current production drafts.
- Visual enrichment now consumes the exact post-acquisition plan dynamically; hard-coded article IDs are removed.
- Each of the five must receive a verified relevant hero and at least one meaningful inline image from its own approved candidate set. Existing body images are rebuilt from the verified candidate set rather than trusted blindly.
- Team/nation conflict and women-specific safeguards remain fail closed, including New Zealand/All Blacks and South Africa/Springboks identities.
- Contextual-card portraits can only come from the article's own approved candidate set and remain subject to the person-identity protection from PR #331.
- Sanity readback verifies exact editorialInputId, hero asset, inline depth and contextual-card persistence.
- Zoho executes only after all image steps and readback succeed.
- The separate MEDIA-011 workflow no longer triggers after `Current editorial source discovery`, preventing duplicate post-email work; it remains available for manual/legacy acquisition-import use.

## Acceptance

Production complete only when one normal or bounded recovery demonstrates:

1. five unique current-package draft IDs;
2. five production-eligible Sanity drafts;
3. each draft has a relevant local hero and >=1 meaningful inline image;
4. no unrelated contextual portrait such as the Limerick image on a New Zealand story;
5. image readback succeeds for all five;
6. only then does exactly one Zoho email send those exact five.

No image filler and no stale/partial package are permitted.
