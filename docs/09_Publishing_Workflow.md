# Publishing Workflow

Sanity Studio is the canonical CMS.

## Session startup checklist

1. Read `docs/07_Project_State.md`.
2. Read `docs/08_Issue_Log.md`.
3. Read `docs/09_Publishing_Workflow.md`.
4. Read `docs/10_New_Chat_Handoff.md`.
5. Read `docs/11_Editorial_Image_Archive.md`.
6. Read `docs/12_Brand_Assets_Library.md` when working on logos, team marks or competition branding.
7. Check available connectors before asking the user to configure anything.

Expected connector surfaces:

- GitHub.
- Vercel.
- Sanity, when available.
- Apify, when available.

## Completion rule

Work is complete only after production or authenticated-Studio verification, depending on the affected surface.

Always distinguish:

- implemented
- committed
- merged
- deployed
- verified in production
- verified in authenticated Sanity Studio

Track unfinished work in `docs/08_Issue_Log.md`.

## Deployment budget rule

The Vercel free plan has a maximum of **100 deployments per day**. Treat every deployment as a constrained resource.

Default approach:

1. Batch related work into one branch.
2. Open one PR.
3. Use one preview deployment where possible.
4. Merge automatically when preview/build is clean and the scope is agreed.
5. Use one production deployment.
6. Verify once in production.

Avoid documentation-only deployments unless the documentation update is important for project continuity or is bundled with code changes.

Only create isolated hotfix PRs for genuine production issues.

## Content publishing checklist

1. Create or update content in Sanity.
2. Confirm slug, category, standfirst and publish date.
3. Add featured image and complete image metadata where available.
4. Link related brand assets only where relevant and already approved.
5. Deploy only when code changes require deployment.
6. Run Validate Live Site where available.
7. Verify production manually when the change affects visible UI or public routes.

## Media workflow

Original Rugby Panda photography is the preferred image source for the website.

Public attribution for original photography:

- `Photo: The Rugby Panda`
- `© The Rugby Panda`

Do not expose the user's personal name or identity on the public website. The brand should remain the visible author/photographer identity.

Every image should have metadata before publication:

- title
- alt text
- caption
- source classification
- creator or public credit
- licence or rights status
- tags
- editorial category
- editorial rating
- suggested use
- lifecycle status

Third-party images must not be used unless source URL, creator, licence and attribution requirements are stored.

## Image lifecycle

Use this status model:

1. Candidate
2. Pending validation
3. Approved
4. Published
5. Archived

## Editorial categories for images

Use these categories unless the project state is updated:

- International
- Club Rugby
- Grassroots
- Schools & Youth
- Rugby Culture
- Photo Stories
- Evergreen
- Women's Rugby
- Officials
- Training
- Equipment

Use `International`, not `Europe`, for the public website category label.

## Brand asset workflow

Brand assets are managed separately from editorial images.

Use the Brand Assets Library for:

- team logos
- competition logos
- league marks
- union / governing-body marks
- official brand colours

Default rights status for rugby logos and marks:

`Editorial / trademark use only`

Before a brand asset is used publicly:

1. Record the source URL.
2. Record the rights holder where known.
3. Select the rights status.
4. Add usage notes.
5. Set `Approved for editorial use` to true through manual review.
6. Prefer uploaded Sanity logo assets over hotlinked external URLs.

Do not treat a logo discovered online as automatically approved. The Brand Assets Library is a controlled editorial reference library, not a generic image-import queue.

## Brand Asset candidate import workflow

GitHub Actions are the mobile-friendly path for importing candidate Brand Asset JSON into Sanity.

Workflow:

`Import Brand Asset Candidates`

Script:

`npm run brand-assets:import-candidates`

Environment input:

`BRAND_ASSET_CANDIDATES_FILE`

The importer now supports:

- top-level `candidates` arrays.
- top-level `targetedResults` arrays.
- creating new candidate records.
- updating existing unapproved candidate records with later logo references.
- skipping already-approved Brand Asset records.
- normalising unsupported acquisition values such as `brandType: club` to the Sanity schema value `team`.

The importer must preserve candidate-only defaults:

```text
approvedForEditorialUse = false
rightsStatus = editorial-trademark-use-only
lifecycleStatus = candidate
```

Never use the import workflow to approve, publish, upload approved logo files, or enable public frontend hotlinking.

## Apify acquisition workflow

Apify is expected to be available for acquisition workflows when the connector is exposed.

Use Apify for structured discovery and collection tasks such as:

- collecting rugby news candidates
- collecting official source URLs
- discovering candidate image or logo assets
- extracting source metadata
- feeding future Sanity import pipelines

Do not use Apify to automatically publish content or approve brand assets. Apify output should create candidates for editorial review unless the project documentation explicitly says otherwise.

## Sprint 5 publishing automation direction

Sprint 5 should focus on turning the completed media foundation into a publishing workflow:

- AI-assisted original photo ingestion.
- AI metadata generation for images.
- Image assignment to articles.
- Article generation and review workflow.
- Editorial categorisation and tagging.
- Search and discovery.
- Homepage/content population using approved CMS content only.
