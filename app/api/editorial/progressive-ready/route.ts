import { createClient } from "next-sanity";
import { NextRequest, NextResponse } from "next/server";

import { isCurrentPackageEditorialInputId } from "@/lib/editorial/CurrentPackageIdentity";
import { notifyDraftCreated } from "@/lib/editorial/EditorialNotifications";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PACKAGE_SIZE = 5;
const EMBED_HOSTS = new Set([
  "www.instagram.com", "instagram.com",
  "www.youtube.com", "youtube.com", "youtu.be",
  "x.com", "www.x.com", "twitter.com", "www.twitter.com",
  "facebook.com", "www.facebook.com",
]);

type SocialEmbed = {
  url?: string;
  sourceLabel?: string;
  isOfficialSource?: boolean;
};

type ReadyArticle = {
  _id: string;
  title?: string;
  editorialInputId?: string;
  editorialGeneratedAt?: string;
  featuredImageUrl?: string;
  socialEmbeds?: SocialEmbed[];
};

function authorised(request: NextRequest) {
  const expected = process.env.EDITORIAL_AUTOMATION_SECRET?.trim();
  return Boolean(expected && request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() === expected);
}

function operationalDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Dublin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function verifiedOfficialEmbed(embed: SocialEmbed | undefined) {
  if (!embed?.isOfficialSource || !embed.url || !embed.sourceLabel?.trim()) return false;
  try {
    const url = new URL(embed.url);
    return url.protocol === "https:" && EMBED_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function mediaReady(article: ReadyArticle) {
  return Boolean(article.featuredImageUrl) && (article.socialEmbeds ?? []).some(verifiedOfficialEmbed);
}

function evidenceId(articleId: string) {
  return `editorial-progressive-ready-${articleId.replace(/^drafts\./, "").replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function packageEvidenceId(packageDate: string) {
  return `editorial-progressive-package-${packageDate.replace(/[^0-9]/g, "")}`;
}

export async function GET() {
  return NextResponse.json({
    status: "ready",
    deliveryMode: "progressive-one-by-one",
    requiredMedia: "verified-featured-image-plus-official-social-video-embed",
    packageSize: PACKAGE_SIZE,
  });
}

export async function POST(request: NextRequest) {
  if (!authorised(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_AUTH_TOKEN;
  if (!projectId || !dataset || !token) return NextResponse.json({ error: "Sanity automation configuration unavailable." }, { status: 500 });

  const packageDate = operationalDate();
  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
  const eligible = await client.fetch<ReadyArticle[]>(`*[
    _type == "article" &&
    _id in path("drafts.**") &&
    morningPackageEligible == true &&
    coalesce(automationContentClass, "production") == "production" &&
    (!defined(workflowStatus) || workflowStatus in ["draft","submitted","in-review","review","under-review","approved"])
  ] | order(coalesce(editorialGeneratedAt,_updatedAt) asc) {
    _id,title,editorialInputId,editorialGeneratedAt,
    "featuredImageUrl":featuredImage.asset->url,
    "socialEmbeds":body[_type == "socialEmbed"]{url,sourceLabel,isOfficialSource}
  }`);
  const current = (Array.isArray(eligible) ? eligible : []).filter((article) => isCurrentPackageEditorialInputId(article.editorialInputId, packageDate));
  const ready = current.filter(mediaReady);
  const results: Array<Record<string, unknown>> = [];

  for (const article of ready) {
    const lockId = evidenceId(article._id);
    const existing = await client.fetch<{status?: string} | null>(`*[_id == $id][0]{status}`, { id: lockId });
    if (existing?.status === "accepted") {
      results.push({ articleId: article._id, title: article.title, status: "already-sent" });
      continue;
    }

    if (!existing) {
      await client.create({
        _id: lockId,
        _type: "editorialAutomationEvidence",
        kind: "progressive-media-gated-review-delivery",
        status: "sending",
        packageDate,
        articleId: article._id.replace(/^drafts\./, ""),
        editorialInputId: article.editorialInputId,
        mediaVerified: true,
        createdAt: new Date().toISOString(),
      });
    }

    const delivery = await notifyDraftCreated({
      articleId: article._id,
      articleTitle: article.title ?? "Untitled article",
      actor: "editorial-media-gate",
      occurredAt: new Date().toISOString(),
      submissionNote: "This draft passed editorial review, relevant image verification and mandatory official embedded-media verification.",
    });
    if (delivery.status !== "sent") {
      await client.delete(lockId).catch(() => undefined);
      results.push({ articleId: article._id, title: article.title, status: "failed", error: delivery.error });
      continue;
    }

    await client.patch(lockId).set({
      status: "accepted",
      eventId: delivery.eventId,
      completedAt: new Date().toISOString(),
    }).commit();
    results.push({ articleId: article._id, title: article.title, status: "sent", eventId: delivery.eventId });
  }

  const acceptedDeliveries = await client.fetch<number>(`count(*[
    _type == "editorialAutomationEvidence" &&
    kind == "progressive-media-gated-review-delivery" &&
    packageDate == $packageDate &&
    status == "accepted"
  ])`, { packageDate });

  if (acceptedDeliveries >= PACKAGE_SIZE) {
    await client.createIfNotExists({
      _id: packageEvidenceId(packageDate),
      _type: "editorialAutomationEvidence",
      kind: "daily-package-direct-zoho",
      status: "accepted",
      packageDate,
      deliveryMode: "progressive-one-by-one",
      articleCount: PACKAGE_SIZE,
      completedAt: new Date().toISOString(),
    });
  }

  const failed = results.filter((item) => item.status === "failed").length;
  return NextResponse.json({
    status: failed > 0 ? "partial-failure" : acceptedDeliveries >= PACKAGE_SIZE ? "complete" : "progressive",
    packageDate,
    currentArticleCount: current.length,
    mediaReadyArticleCount: ready.length,
    acceptedDeliveryCount: acceptedDeliveries,
    requiredArticleCount: PACKAGE_SIZE,
    results,
  }, { status: failed > 0 ? 502 : 200 });
}
