import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "hvg4b508";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  throw new Error("SANITY_API_TOKEN is required.");
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });

const articleId = "article-welcome-to-the-rugby-panda";
const draftId = `drafts.${articleId}`;

function block(text, style = "normal") {
  const key = crypto.randomUUID().replaceAll("-", "").slice(0, 12);
  return {
    _type: "block",
    _key: key,
    style,
    markDefs: [],
    children: [{ _type: "span", _key: `${key}span`, text, marks: [] }],
  };
}

function ref(_ref) {
  return { _type: "reference", _ref };
}

function stripSystemFields(document) {
  if (!document) return null;
  const { _rev, _createdAt, _updatedAt, ...rest } = document;
  return rest;
}

const existingPublished = await client.getDocument(articleId);
if (existingPublished) {
  console.log(JSON.stringify({ status: "no-op", reason: "published-document-already-exists", articleId }, null, 2));
  process.exit(0);
}

const survivingDraft = await client.getDocument(draftId);
const restoredAt = new Date().toISOString();

const canonical = {
  _id: articleId,
  _type: "article",
  title: "Welcome to The Rugby Panda",
  slug: { _type: "slug", current: "welcome-to-the-rugby-panda" },
  standfirst: "Independent rugby coverage, thoughtful analysis and stories from the game we all love.",
  seoTitle: "Welcome to The Rugby Panda | Independent Irish Rugby Coverage",
  seoDescription: "Welcome to The Rugby Panda. Independent coverage, thoughtful analysis and stories from Leinster, Munster, Ulster, Connacht, the URC, Ireland and the international game.",
  readingTime: "2 min read",
  isLead: true,
  useBrandImage: false,
  author: ref("author-rugby-panda-newsroom"),
  category: ref("category-news"),
  tags: [ref("tag-introduction")],
  keyPoints: [
    "Independent rugby coverage with context, clarity and thoughtful analysis.",
    "Coverage across the provinces, the URC, Ireland and the international game.",
    "Stories written for supporters who want to understand why things happen, not only what happened.",
  ],
  body: [
    block("Why we built The Rugby Panda", "h2"),
    block("If you're reading this, there's a good chance you love rugby as much as we do. Not because every match is perfect. Quite the opposite."),
    block("We love the Monday morning debates after a European weekend, spotting the next academy player before everyone knows their name, and the tactical battles that never make the highlights. And yes, we occasionally think the referee got it wrong too."),
    block("What we want to explain", "h2"),
    block("Rugby has never lacked people telling us what happened. What we've always wanted is someone to explain why: why a selection mattered, why momentum shifted, and why one decision changed an entire match."),
    block("That's what you'll find here: clear reporting, thoughtful analysis, and stories that respect the intelligence of rugby supporters."),
    block("The rugby we care about", "h2"),
    block("Our focus is Leinster, Munster, Ulster, Connacht, the URC, the Ireland national team and the biggest stories from the international game."),
    block("Whether you've found us before kick-off, after the final whistle or somewhere in between, we're delighted you're here."),
    block("Now, let's talk rugby."),
    block("— The Rugby Panda Team"),
  ],
  publishedAt: survivingDraft?.publishedAt ?? restoredAt,
  updatedAt: restoredAt,
  workflowStatus: "published",
  workflowUpdatedAt: restoredAt,
  workflowHistory: [
    ...(Array.isArray(survivingDraft?.workflowHistory) ? survivingDraft.workflowHistory : []),
    {
      _key: crypto.randomUUID().replaceAll("-", "").slice(0, 12),
      _type: "object",
      action: "restore-published-article",
      fromStatus: survivingDraft?.workflowStatus ?? "deleted",
      toStatus: "published",
      actor: "production-recovery",
      note: "Restored the previously approved launch introduction after accidental deletion.",
      occurredAt: restoredAt,
    },
  ],
};

const restored = {
  ...(stripSystemFields(survivingDraft) ?? {}),
  ...canonical,
  _id: articleId,
};

await client.createOrReplace(restored);

const verification = await client.getDocument(articleId);
if (!verification || verification.slug?.current !== "welcome-to-the-rugby-panda" || verification.isLead !== true) {
  throw new Error("Launch introduction recovery verification failed after write.");
}

console.log(JSON.stringify({
  status: "restored",
  articleId,
  slug: verification.slug?.current,
  publishedAt: verification.publishedAt,
  isLead: verification.isLead,
  source: survivingDraft ? "surviving-draft-plus-canonical-copy" : "canonical-repository-copy",
}, null, 2));
