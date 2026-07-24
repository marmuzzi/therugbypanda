# Publishing Workflow

Sanity Studio is the canonical CMS and the mandatory human review boundary.

## Session startup checklist

1. Read `docs/07_Project_State.md`.
2. Read `docs/08_Issue_Log.md`.
3. Read `docs/09_Publishing_Workflow.md`.
4. Read `docs/10_New_Chat_Handoff.md`.
5. Read `docs/11_Editorial_Image_Archive.md`.
6. Read `docs/12_Brand_Assets_Library.md` when working on logos, team marks or competition branding.
7. Read all later numbered documents relevant to the task.
8. Check available connectors before asking the user to configure anything.

## Timezone

The project owner is based in Dublin, Ireland. Use `Europe/Dublin` for all schedules, editorial deadlines, reports and operational timestamps unless explicitly instructed otherwise.

## Completion rule

Work is complete only after production or authenticated-Studio verification, depending on the affected surface.

Always distinguish:

- implemented
- committed
- merged
- deployed
- verified in production
- verified in authenticated Sanity Studio
- documentation updated

Track unfinished work in `docs/08_Issue_Log.md`.

## Deployment budget rule

The Vercel free plan has a maximum of **100 deployments per day**. Treat every deployment as a constrained resource.

Default approach:

1. Batch related work into one branch.
2. Open one PR.
3. Use one preview deployment where possible.
4. Merge when preview/build is clean and the scope is agreed.
5. Use one production deployment.
6. Verify once in production.

Avoid documentation-only deployments unless the documentation update is important for project continuity or is bundled with code changes.

## Current editorial architecture

```text
Approved-scope source acquisition
→ structured story candidate
→ Editorial Brain classification and scoring
→ source-linked fact ledger
→ OpenAI structured generation
→ approved Editorial Image assignment
→ Sanity draft
→ submit for review
→ editor amend / approve / reject
→ controlled publish / discard
→ Vercel public website
```

The backend foundation for this workflow was merged in PRs #47–#50.

## Editorial Brain rules

The Editorial Brain must:

- classify and score each structured story candidate;
- retain source links and confidence information;
- create a fact ledger containing only usable supported facts;
- distinguish facts from responsible speculation;
- prevent invented facts, quotes, statistics, motives or certainty;
- prevent rewriting or close paraphrasing of a source article;
- preserve human fact-check requirements when uncertainty exists.

A candidate classified as hold or reject must not proceed to article generation.

## Draft generation workflow

Protected endpoint:

`POST /api/editorial/draft`

Authentication:

`Authorization: Bearer <EDITORIAL_AUTOMATION_SECRET>`

The request must contain a structured story and source-linked fact ledger. Generation uses the OpenAI Responses API and produces structured original content that is converted to Sanity Portable Text.

Rules:

- generation creates or replaces a Sanity draft only;
- generation never publishes automatically;
- OpenAI response storage is disabled for editorial generation;
- public reader-facing pages must not disclose AI implementation details.

## Article image assignment

Generated drafts may optionally receive an `editorialImageId`.

The server may assign an Editorial Image only when the record:

- is approved for editorial use;
- is in an approved or published lifecycle state;
- is backed by a Sanity image asset;
- has reviewed rights and public-credit metadata.

The canonical frontend contract remains `article.featuredImage`. Reviewed alt text, caption, public credit and rights metadata are copied into the article draft. Unavailable or unapproved image assignments must be rejected.

## Editorial workflow actions

Protected endpoint:

`POST /api/editorial/workflow`

Authentication:

`Authorization: Bearer <EDITORIAL_AUTOMATION_SECRET>`

Supported actions:

- `submit`
- `approve`
- `reject`
- `publish`
- `discard`

The server must enforce valid state transitions. Every mutation must record the actor, timestamp, action, prior state, resulting state and review notes where provided.

Publishing must occur only from an approved state through the controlled Sanity transaction.

## Rejection and replacement workflow

Current merged behaviour:

1. The editor rejects a draft and records a reason.
2. The workflow stores the rejection in the audit history.
3. The rejection count is incremented.
4. The article is marked as requiring replacement.

Remaining `AUTO-002` behaviour:

1. Exclude the rejected angle and source set.
2. Select a new non-duplicate candidate.
3. Run the candidate through the Editorial Brain.
4. Generate a genuinely new draft rather than rewriting the rejected article.
5. Assign an approved image where available.
6. Return the review queue to its target inventory.
7. Preserve all rejected versions and replacement links internally.

## Sanity Studio review workspace — next implementation

The next operational milestone is an authenticated Studio workspace that exposes the merged workflow without manual API calls.

It should show:

- drafts awaiting review;
- headline, standfirst, category and body;
- Editorial Brain classification and score;
- fact ledger and confidence information;
- source links;
- assigned Editorial Image and rights metadata;
- audit history and prior rejection reasons;
- review notes;
- amend, submit, approve, reject, publish and discard controls appropriate to the current state.

The Studio UI must call or reuse the protected server-side workflow. It must not bypass transition validation.

## Editorial Review Intelligence — PR #62 framework

Merged at commit `6791877`; authenticated-Studio verification remains pending.

The Editorial Review panel recalculates locally as an editor changes the headline, standfirst, body and SEO fields. It reports the deterministic 0–100 quality score, readiness, word count, blocking and warning counts, existing editorial confidence and typed issues. Native browser spellchecking is enabled with `spellCheck={true}` and `lang="en-IE"` on all editable editorial text fields.

Approval and publication are unavailable while any blocking issue remains. The same condition is enforced in `runAction`, so the UI cannot bypass it. Submit, Reject and Discard retain their existing workflow rules. This framework performs no AI calls and does not persist review history.

## AI Editorial Review — PR #63

Implemented on the current branch; not yet merged, deployed or verified in authenticated Sanity Studio.

The AI Editorial Review panel appears directly below the deterministic Editorial Review panel. It runs only when the editor selects **Run AI Review**; it never runs while the editor is typing. It sends its protected request to the Next.js/Vercel application at `POST https://therugbypanda.ie/api/editorial/review`, matching the existing protected editorial API base URL pattern and never resolving `/api` against the hosted Sanity Studio origin. The endpoint uses the existing OpenAI Responses API, `store: false`, and strict JSON-schema output. The editor's current headline, standfirst, article body and SEO fields, together with retained source and fact-ledger context, are reviewed for:
The AI Editorial Review panel appears directly below the deterministic Editorial Review panel. It runs only when the editor selects **Run AI Review**; it never runs while the editor is typing. The protected `POST /api/editorial/review` endpoint uses the existing OpenAI Responses API, `store: false`, and strict JSON-schema output. The editor's current headline, standfirst, article body and SEO fields, together with retained source and fact-ledger context, are reviewed for:

- spelling mistakes;
- grammar mistakes;
- awkward phrasing;
- unsupported claims;
- speculative statements presented as facts;
- readability issues;
- SEO improvements;
- headline improvements; and
- standfirst improvements.

The panel groups returned findings into **Blocking**, **Warnings** and **Suggestions**. It never applies edits, persists review history, changes deterministic review checks, changes workflow transitions or changes publishing logic. Human editorial review and the existing approval/publication gate remain mandatory.

## Content publishing checklist

1. Confirm the article passed the Editorial Brain and has source-linked facts.
2. Confirm headline, slug, category, standfirst and intended publish date.
3. Confirm body accuracy, originality and uncertainty wording.
4. Add a reviewed featured image with complete rights metadata.
5. Confirm public author and image attribution use The Rugby Panda brand identity.
6. Submit and review in Sanity Studio.
7. Approve only after factual, editorial and rights checks.
8. Publish through the controlled workflow.
9. Verify homepage cards, category pages and article pages in production.
10. Record any issue in `docs/08_Issue_Log.md`.

## Daily editorial target

The target is eight review-ready drafts available by 08:00 Europe/Dublin every day.

The future orchestration must include:

- Apify approved-scope acquisition;
- section-mix rules;
- duplicate and rejected-angle prevention;
- retries and failure notification;
- deadline monitoring;
- automatic replacement after rejection;
- no automatic approval or publication.

## Analytics and accreditation evidence

Publishing must create durable evidence suitable for accreditation and commercial reporting.

The analytics layer must retain or export:

- publication cadence and timestamp history;
- editorial approval and audit history;
- GA4 users, sessions, page views and engagement;
- returning-reader trends;
- article-level performance;
- search, social, referral and direct traffic;
- Google Search Console clicks, impressions and rankings;
- reproducible monthly reports and accreditation evidence packs.

This work is tracked under `ACCRED-001` and must be designed as a core platform capability.

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

1. Candidate
2. Pending validation
3. Approved
4. Published
5. Archived

## Brand asset workflow

Brand assets are managed separately from editorial images. A logo discovered online is never automatically approved. Source, rights holder, rights status, usage notes and manual editorial approval are required before public use.

## Apify acquisition workflow

Use Apify for structured discovery and collection tasks such as rugby news candidates, official source URLs, candidate image or logo assets and source metadata. Apify output creates candidates only. It must not automatically approve assets or publish content.
