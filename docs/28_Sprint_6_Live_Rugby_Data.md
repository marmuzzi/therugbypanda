# Sprint 6 — Live Rugby Data Platform

## Objective

Build an automatically maintained Scores & Tables product for The Rugby Panda covering the active season of each supported competition.

The platform must publish fixtures, results and standings without editorial approval while preserving Sanity as the mandatory approval boundary for editorial content.

## Product scope

Primary route:

- `/scores`

Initial competition scope:

- United Rugby Championship (URC)
- Men's Six Nations
- Nations Championship
- Investec Champions Cup
- EPCR Challenge Cup

The page must support:

- current-season fixtures
- completed results
- current standings, pools or competition rankings
- competition tabs
- round filters
- team filters where useful
- Irish local time display
- competition-specific table formats
- clear season labels such as `2026/27` or `2027`

Only the current active or next confirmed season is displayed publicly. Historical archive support is out of scope for the initial release.

## Approval boundary

### Editorial content — approval required

The existing controlled workflow remains unchanged:

`Acquire → Generate → Editorial Review → Sanity Approval → Publish`

This applies to:

- previews
- match reports
- analysis
- opinion
- player ratings
- headlines
- editorial images
- SEO copy

### Structured sports data — no editorial approval

Fixtures, scores and standings use a separate automated pipeline:

`Trusted data source → Scheduled ingestion → Validation → Upsert → Website cache → Public display`

This data must not enter Editorial Review and must not require manual approval after each match.

## Update behaviour

The synchronisation schedule must be aware of known match times.

Baseline behaviour:

1. Import the confirmed season schedule.
2. Refresh future fixtures periodically for date, venue and kick-off changes.
3. Increase polling around scheduled kick-off.
4. Refresh during and immediately after each match.
5. Mark the match final only when the source confirms the completed status.
6. Recalculate or ingest standings after final results.
7. Run a later reconciliation pass to capture disciplinary decisions, bonus-point corrections or source amendments.

The implementation must be idempotent: repeated ingestion of the same source record must update the existing match rather than create duplicates.

## Core entities

### Competition

- stable internal ID
- name
- slug
- season label
- competition format
- logo or brand reference
- active/public flag
- source metadata

### Team

- stable internal ID
- name
- short name
- slug
- crest reference
- country or region
- source identifiers

### Match

- stable internal ID
- source fixture ID
- competition and season
- round or stage
- home team
- away team
- scheduled kick-off
- venue
- status: scheduled, live, postponed, cancelled, completed
- home score
- away score
- source-updated timestamp
- last-synchronised timestamp

### Standing row

- competition and season
- stage or pool
- position
- team
- played
- won
- drawn
- lost
- points for
- points against
- points difference
- bonus points where applicable
- competition points
- source-updated timestamp

## Match pages

Each fixture becomes a permanent match hub:

- `/matches/[match-slug]`

The page displays:

- fixture or final score
- match status
- competition, season, round and venue
- kick-off in Irish time
- relevant standings context where available
- related editorial articles

The match URL must remain stable when a scheduled fixture becomes a completed result.

## Article-to-match relationship

Sanity articles must be able to reference one or more match records.

Supported article relationships include:

- preview
- team news
- match report
- player ratings
- tactical analysis
- reaction
- opinion

The editor remains responsible for confirming the relationship. The system may suggest a match based on teams, competition and date, but must not silently attach an article when the match is ambiguous.

Once confirmed, the article is automatically surfaced on:

- the match page
- the relevant fixture or result card
- competition pages
- team pages where supported
- homepage modules where editorially selected

## Data quality and safety requirements

- Use a licensed, permitted or official structured source.
- Do not rely on brittle page scraping as the production source without documented permission and fallback handling.
- Preserve source IDs for reconciliation.
- Validate team identity, score shape, match status and timestamps before publishing.
- Never infer a final score from elapsed time alone.
- Never overwrite a newer trusted record with older source data.
- Record ingestion failures and send operational alerts.
- Keep the last valid public data available during a source outage.
- Display a last-updated timestamp where useful.

## Sanity responsibility

Sanity remains responsible for editorial and presentation controls only:

- competition visibility
- display names and descriptions
- logos and brand assets
- featured matches
- article-to-match associations

Sanity is not the source of truth for automated scores or standings.

## Delivery sequence

### S6-001 — Provider and rights assessment

- evaluate structured coverage for all target competitions
- document licensing, cost, limits and update latency
- select a primary source and fallback strategy

### S6-002 — Canonical data model

- implement competition, season, team, match and standings schemas
- define stable source-to-internal identity mapping

### S6-003 — Ingestion and validation

- schedule fixture imports and match-aware updates
- implement idempotent upserts, validation and reconciliation
- add failure notifications

### S6-004 — Scores & Tables page

- build `/scores`
- add competition, fixture/result and standings views
- support responsive tables and filters

### S6-005 — Match hubs

- build stable `/matches/[match-slug]` pages
- display fixture, status, result and competition context

### S6-006 — Editorial linking

- add Sanity match references and match suggestion assistance
- surface confirmed related articles on match and competition pages

### S6-007 — Homepage modules

- next matches
- latest results
- live scores where the selected provider and update latency support them

## Initial acceptance criteria

Sprint 6 is considered production-ready when:

- at least URC and one international competition are live
- fixtures appear before the season begins
- completed matches update without human approval
- standings update after completed matches
- duplicate ingestion does not create duplicate fixtures
- source failure leaves the last valid data visible and triggers an alert
- a Sanity article can be manually linked to a match
- linked articles appear automatically on the correct match page
- all displayed times use Europe/Dublin local time
- mobile and desktop layouts are verified

## Explicit non-goals for the first release

- historical season archive
- fantasy rugby
- betting odds
- user accounts or personalised team alerts
- automatically generated editorial articles
- unapproved publication of editorial copy
