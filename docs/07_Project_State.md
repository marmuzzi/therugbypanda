# Project State

## Current Version

v0.8 — Go-Live and Editorial Automation Programme

## Last Updated

23 July 2026

## Source of truth

Read these files first in future sessions:

1. `docs/07_Project_State.md`
2. `docs/08_Issue_Log.md`
3. `docs/09_Publishing_Workflow.md`
4. `docs/10_New_Chat_Handoff.md`
5. `docs/11_Editorial_Image_Archive.md`
6. `docs/12_Brand_Assets_Library.md`
7. All later numbered documents, including:
   - `docs/23_Make_Orchestration_Architecture.md`
   - `docs/24_Editorial_Image_Canonical_Metadata_Review.md`
   - `docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md`

Do not rely on chat history for current status.

## Connector status

Verified during the 23 July 2026 session:

- GitHub — available and read/write capable.
- Vercel — available for deployment and production checks.
- Apify — available.
- Sanity direct connector — available for authenticated production data queries.
- Make.com — not connected.

Connector availability must be checked again in every new session.

## Agreed architecture

```text
GitHub source of truth
→ Make.com orchestration
→ Apify acquisition
→ Sanity canonical CMS and editorial review
→ Vercel public website
```

GitHub stores code, prompts, schemas, reusable business logic, workflows and documentation. Make.com provides persistent scheduling, retries, notifications and cross-service coordination. Apify collects approved-scope source candidates. Sanity is the human review and publication boundary. Vercel serves the public site.

No generated article or acquired asset is automatically approved or published.

## Current state

Sprint 4 is complete. Sprint 5 media automation is operational but still requires final Studio verification for PUB-003.

PR #41 was merged to `main` at commit `a63ce10e8d87ac0a9b8b2b3f295cfd48b7fed515` and its Vercel production deployment is READY.

Editorial Image metadata status:

- 40 raw Editorial Image documents.
- 38 canonical records.
- 24 publication-ready.
- 16 needing attention.
- 34 approved or published.
- 10 approved/published but not ready.
- 0 duplicate Sanity asset groups.
- 2 duplicate source groups caused by draft/published pairs.

A controlled canonical metadata dry run and explicit apply completed successfully for two reviewed records. Direct Sanity data verification succeeded; authenticated Studio UI verification remains pending.

## Primary project directive

The immediate priority is **go live**.

The launch minimum is:

1. One introduction article about The Rugby Panda.
2. At least eight additional reviewed articles.
3. Coverage of recent international matches and Leinster, Munster, Ulster and Connacht.
4. Accurate backdating where appropriate to the event date or immediate aftermath.
5. A reviewed and approved image for every story.
6. Production verification of homepage, category pages and article pages.

See `docs/25_Go_Live_Editorial_Automation_and_Security_Plan.md`.

## Daily editorial operating target

After launch:

- Eight review-ready article drafts every day.
- All eight available by 08:00 Europe/Dublin.
- Coverage distributed across active website sections.
- The editor can amend, approve or reject.
- Approved drafts publish through the controlled CMS workflow.
- Rejected drafts are discarded and replaced automatically with a new non-duplicate candidate.
- Human editorial approval remains mandatory.

## Security directive

Protect the project against unauthorised access, copying, destructive changes and accidental deletion.

Security work must cover:

- GitHub repositories and Actions.
- Sanity datasets, roles and tokens.
- Vercel projects and environment variables.
- Cloudflare, DNS and domain ownership.
- Apify and Make.com credentials and spending controls.
- Independent backups.
- Tested restoration and credential-rotation procedures.

A backup is not considered verified until restoration has been tested.

## Mobile photography directive

Original Rugby Panda photos need a secure phone-friendly ingestion path.

The preferred implementation is direct authenticated upload to Sanity Assets, automatic creation of an `editorialImage` draft, metadata assistance and default public attribution:

- `Photo: The Rugby Panda`
- `© The Rugby Panda`

GitHub remains the source of code and metadata contracts, not the primary binary photo library.

## Current priorities

1. Complete `CMS-002`: confirm the article-image contract and assign approved images.
2. Create the nine-article minimum launch package under `LAUNCH-001`.
3. Review, publish and verify the full launch package in production.
4. Implement and verify the security, backup and recovery baseline under `SEC-001`.
5. Build the editor review and controlled publishing workflow under `AUTO-001`.
6. Add rejection-triggered replacement generation under `AUTO-002`.
7. Deliver eight review-ready drafts by 08:00 daily under `AUTO-003`.
8. Build secure mobile photo ingestion under `MEDIA-004`.
9. Implement real website search under `WEB-005`.

## Completion rule

Always distinguish:

- implemented
- committed
- merged
- deployed
- verified in production
- verified in authenticated Sanity Studio
- documentation updated

A feature is not complete until the relevant production or authenticated-Studio verification has happened.

## Deployment budget rule

The Vercel free plan has a maximum of 100 deployments per day. Batch related work into one branch and one production deployment where practical.

## Working principles

- Documentation is the source of truth.
- Prefer maintainable reusable components and workflows.
- Keep `main` deployable.
- Keep the Issue Log current.
- Original Rugby Panda photography is preferred.
- Mobile-first design.
- Reader-first advertising.
- Do not expose AI implementation references publicly on the reader-facing website.
