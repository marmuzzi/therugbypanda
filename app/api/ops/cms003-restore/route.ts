import { createClient } from "next-sanity";
import { NextRequest, NextResponse } from "next/server";

import { apiVersion, dataset, projectId } from "@/sanity/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ARTICLE_ID = "article-welcome-to-the-rugby-panda";
const DRAFT_ID = `drafts.${ARTICLE_ID}`;
const CONFIRMATION = "RESTORE-INTRO-20260817";

function block(text: string, style: "normal" | "h2" = "normal") {
  const key = crypto.randomUUID().replaceAll("-", "").slice(0, 12);
  return {
    _type: "block",
    _key: key,
    style,
    markDefs: [],
    children: [{ _type: "span", _key: `${key}span`, text, marks: [] }],
  };
}

function ref(_ref: string) {
  return { _type: "reference", _ref };
}

function stripSystemFields(document: Record<string, unknown> | null) {
  if (!document) return null;
  const { _rev, _createdAt, _updatedAt, ...rest } = document;
  void _rev;
  void _createdAt;
  void _updatedAt;
  return rest;
}

function writeClient() {
  const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_AUTH_TOKEN;
  if (!projectId || !dataset || !token) {
    throw new Error("Sanity write configuration is unavailable in this Preview deployment.");
  }
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
}

export async function GET(request: NextRequest) {
  if (process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ error: "Preview only" }, { status: 403 });
  }
  if (request.nextUrl.searchParams.get("confirm") !== CONFIRMATION) {
    return NextResponse.json({ error: "Confirmation missing" }, { status: 400 });
  }

  const client = writeClient();
  const existingPublished = await client.getDocument(ARTICLE_ID);
  if (existingPublished) {
    return NextResponse.json({ status: "no-op", reason: "published-document-already-exists", articleId: ARTICLE_ID });
  }

  const survivingDraft = await client.getDocument(DRAFT_ID) as Record<string, unknown> | null;
  const restoredAt = new Date().toISOString();
  const survivingWorkflowHistory = Array.isArray(survivingDraft?.workflowHistory) ? survivingDraft.workflowHistory : [];
  const survivingPublishedAt = typeof survivingDraft?.publishedAt === "string" ? survivingDraft.publishedAt : restoredAt;
  const survivingWorkflowStatus = typeof survivingDraft?.workflowStatus === "string" ? survivingDraft.workflowStatus : "deleted";

  const canonical = {
    _id: ARTICLE_ID,
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
    publishedAt: survivingPublishedAt,
    updatedAt: restoredAt,
    workflowStatus: "published",
    workflowUpdatedAt: restoredAt,
    workflowHistory: [
      ...survivingWorkflowHistory,
      {
        _key: crypto.randomUUID().replaceAll("-", "").slice(0, 12),
        _type: "object",
        action: "restore-published-article",
        fromStatus: survivingWorkflowStatus,
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
    _id: ARTICLE_ID,
  };

  await client.createOrReplace(restored);
  const verification = await client.getDocument(ARTICLE_ID) as Record<string, unknown> | null;
  const slug = verification && typeof verification.slug === "object" && verification.slug && "current" in verification.slug
    ? (verification.slug as { current?: string }).current
    : undefined;

  if (!verification || slug !== "welcome-to-the-rugby-panda" || verification.isLead !== true) {
    throw new Error("Recovery write verification failed.");
  }

  return NextResponse.json({
    status: "restored",
    articleId: ARTICLE_ID,
    slug,
    publishedAt: verification.publishedAt,
    isLead: verification.isLead,
    source: survivingDraft ? "surviving-draft-plus-canonical-copy" : "canonical-repository-copy",
  });
}
