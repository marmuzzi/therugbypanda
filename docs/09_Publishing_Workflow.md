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

## Content publishing checklist

1. Create or update content in Sanity.
2. Confirm slug, category, standfirst and publish date.
3. Add featured image and complete image metadata where available.
4. Link related brand assets where relevant and already approved.
5. Deploy only when code changes require deployment.
6. Run Validate Live Site.
7. Verify production manually when the change affects visible UI or public routes.

## Deployment budget rule

Vercel has a daily deployment limit. Treat deployments as a constrained resource.

Default approach:

1. Batch related work into one branch.
2. Open one PR.
3. Use one preview deployment where possible.
4. Merge automatically when preview/build is clean and the scope is agreed.
5. Use one production deployment.
6. Verify once in production.

Only create an isolated hotfix PR when production is broken or the risk of waiting is higher than the deployment cost.

## Completion rule

Work is complete only after production verification.

Always distinguish:

- implemented
- committed
- merged
- deployed
- verified in production

Track unfinished work in `docs/08_Issue_Log.md`.

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
5. Set `Approved for editorial use` to true.
6. Prefer uploaded Sanity logo assets over hotlinked external URLs.

Do not treat a logo discovered online as automatically approved. The Brand Assets Library is a controlled editorial reference library, not a generic image-import queue.
