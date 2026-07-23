# Make.com Orchestration Architecture

## Status

Architectural decision agreed on 12 July 2026 and documented on 23 July 2026.

## Purpose

Use Make.com as a persistent orchestration layer so critical workflows do not depend on connector availability in an individual ChatGPT session.

## Target architecture

```text
GitHub
  source of truth for code, business logic, workflow definitions and documentation
    ↓
Make.com
  schedules, webhooks, retries, notifications and service coordination
    ↓
Apify
  acquisition and collection
    ↓
Sanity
  canonical editorial CMS and review state
    ↓
Vercel
  public website deployment and delivery
```

## Responsibilities

### GitHub

- source of truth
- version control
- scripts and reusable business logic
- workflow definitions
- schemas and decision contracts
- documentation and issue status
- CI and controlled GitHub Actions

### Make.com

- persistent scheduling
- webhook handling
- orchestration across services
- retries and failure routing
- operational notifications
- passing validated payloads between services
- triggering GitHub Actions, Apify actors or Sanity API operations where appropriate

Make.com should not become the primary home of complex editorial or transformation logic. Reusable logic must remain version-controlled and testable in GitHub whenever practical.

### Apify

- source acquisition
- approved-scope crawling and extraction
- candidate collection only unless a later reviewed workflow explicitly authorises more

### Sanity

- canonical editorial content and media database
- candidate, review, approval, rejection and archive state
- human editorial review boundary
- approved metadata and publication records

### Vercel

- production website hosting
- preview and production deployments
- frontend delivery

## Editorial safety rules

1. Acquisition does not equal approval.
2. Suggestions do not equal approved metadata.
3. Human review is mandatory before metadata application.
4. Publishing remains a separate explicit approval step.
5. Dry-run-first workflows are required for controlled CMS write-back.
6. Writes must target canonical Sanity IDs and reject `drafts.*` IDs.
7. Existing metadata must not be overwritten unless an explicitly reviewed workflow permits it.
8. External candidate logo or image URLs are review references, not automatically approved public assets.

## Initial Make.com adoption plan

Introduce Make.com incrementally after the current Editorial Image metadata loop is verified.

Recommended first scenarios:

1. Scheduled GitHub Action trigger for read-only audits and suggestion generation.
2. Completion/failure notifications for GitHub Actions and Apify runs.
3. Apify actor execution followed by validated candidate-file creation or controlled repository handoff.
4. Sanity import trigger only through reviewed, schema-valid inputs.
5. Scheduled publishing orchestration only after the article review workflow is implemented and verified.

## Operational rules

- Keep credentials in the relevant service secret store.
- Do not place long-lived secrets in repository files or Make scenario notes.
- Record scenario purpose, trigger, inputs, outputs, retries and failure paths in repository documentation.
- Treat Make scenario changes as architecture changes and document them.
- Prefer idempotent operations and stable external IDs.
- Preserve an auditable trail from acquisition through review and publication.

## Current connector reality

Connector availability in ChatGPT varies by session. Each new chat must check available connectors before assuming GitHub, Vercel, Apify, Sanity or Make.com access.

When a direct Sanity connector is unavailable, GitHub Actions remain the reliable controlled CMS automation path.

## Next implementation checkpoint

Before introducing Make.com into production workflows:

1. Fix canonical-only Editorial Image metadata suggestions.
2. Complete a real dry run using reviewed production IDs.
3. Apply approved metadata through the controlled importer.
4. Re-run the readiness audit.
5. Verify the results in authenticated Sanity Studio.
6. Document the first Make.com scenario before enabling it.
