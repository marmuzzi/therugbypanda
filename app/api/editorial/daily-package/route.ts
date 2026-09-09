import { createHash } from "node:crypto";

import { createClient } from "next-sanity";
import { NextRequest, NextResponse } from "next/server";

import { isCurrentPackageEditorialInputId } from "@/lib/editorial/CurrentPackageIdentity";
import { sendZohoMail } from "@/lib/email/ZohoSmtp";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PACKAGE_SIZE = 5;
const destination = "editor@therugbypanda.ie";
const studioBaseUrl = "https://therugbypanda.sanity.studio";
const EMBED_HOSTS = new Set([
  "www.instagram.com", "instagram.com",
  "www.youtube.com", "youtube.com", "youtu.be",
  "x.com", "www.x.com", "twitter.com", "www.twitter.com",
  "facebook.com", "www.facebook.com",
]);

type SocialEmbed = {
  platform?: string;
  url?: string;
  sourceLabel?: string;
  caption?: string;
  isOfficialSource?: boolean;
};

type PackageArticle = {
  _id: string;
  title?: string;
  standfirst?: string;
  workflowStatus?: string;
  editorialInputId?: string;
  editorialGeneratedAt?: string;
  updatedAt?: string;
  category?: string;
  competition?: string;
  needsHumanFactCheck?: boolean;
  featuredImageUrl?: string;
  socialEmbeds?: SocialEmbed[];
};

type DeliveryEvidence = {
  _id: string;
  status?: "sending" | "accepted";
  accepted?: string;
  smtpResponse?: string;
  completedAt?: string;
};

function authorised(request: NextRequest) {
  const expected = process.env.EDITORIAL_AUTOMATION_SECRET?.trim();
  if (!expected) return false;
  return request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() === expected;
}

function getClient() {
  const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_AUTH_TOKEN;
  if (!projectId || !dataset || !token) throw new Error("Sanity automation configuration is unavailable.");
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
}

function operationalDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Dublin", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

function reviewUrl(articleId: string) {
  return `${studioBaseUrl}/intent/edit/id=${encodeURIComponent(articleId.replace(/^drafts\./, ""))};type=article`;
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

function articleHasMandatoryEmbed(article: PackageArticle) {
  return (article.socialEmbeds ?? []).some(verifiedOfficialEmbed);
}

function packageFingerprint(articles: PackageArticle[]) {
  const canonicalPackage = articles
    .map((article) => `${article._id.replace(/^drafts\./, "")}|${article.updatedAt ?? ""}`)
    .sort().join("\n");
  return createHash("sha256").update(canonicalPackage).digest("hex").slice(0, 12);
}

function eventIdFor(packageDate: string, articles: PackageArticle[]) {
  return `editorial-daily-package:${packageDate}:${packageFingerprint(articles)}`;
}

function lockIdFor(packageDate: string, articles: PackageArticle[]) {
  return `editorial-daily-package-${packageDate.replace(/[^0-9]/g, "")}-${packageFingerprint(articles)}`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character] ?? character);
}

function emailText(packageDate: string, articles: PackageArticle[]) {
  return [
    `The Rugby Panda morning editorial package for ${packageDate}.`, "",
    ...articles.flatMap((article, index) => [
      `${index + 1}. ${article.title ?? "Untitled article"}`,
      article.standfirst ?? "",
      `Review: ${reviewUrl(article._id)}`,
      "Image: verified",
      "Embedded media: verified official source",
      "",
    ]),
  ].join("\n");
}

function emailHtml(packageDate: string, articles: PackageArticle[]) {
  const cards = articles.map((article, index) => `
    <div style="border:1px solid #d1d5db;border-radius:12px;padding:16px;margin:0 0 14px 0;background:#fff">
      <div style="font:700 12px Arial;color:#2e7d32;text-transform:uppercase">Article ${index + 1}</div>
      <h2 style="font:700 21px Arial;color:#111827;margin:6px 0">${escapeHtml(article.title ?? "Untitled article")}</h2>
      <p style="font:15px/1.5 Arial;color:#374151">${escapeHtml(article.standfirst ?? "")}</p>
      <p style="font:13px Arial;color:#4b5563">Image verified · Official embedded media verified</p>
      <a href="${escapeHtml(reviewUrl(article._id))}" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;font:700 14px Arial;padding:11px 16px;border-radius:9px">Open in Sanity</a>
    </div>`).join("");
  return `<!doctype html><html><body style="margin:0;background:#f3f4f6;padding:20px"><main style="max-width:680px;margin:auto;background:#fff;padding:22px;border-radius:16px"><div style="font:700 13px Arial;color:#2e7d32">THE RUGBY PANDA</div><h1 style="font:700 28px Arial;color:#111827">Five articles ready for review</h1><p style="font:15px Arial;color:#4b5563">Exact Dublin-day package for ${escapeHtml(packageDate)}. Every article passed the image and mandatory official-embed delivery boundary.</p>${cards}</main></body></html>`;
}

async function sendTechnicalAlert(failureCode: string, message: string, details: Record<string, unknown>) {
  const webhookUrl = process.env.EDITORIAL_TECHNICAL_ALERT_WEBHOOK_URL?.trim();
  if (!webhookUrl) return "skipped" as const;
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.EDITORIAL_TECHNICAL_ALERT_WEBHOOK_SECRET?.trim()
          ? { authorization: `Bearer ${process.env.EDITORIAL_TECHNICAL_ALERT_WEBHOOK_SECRET.trim()}` } : {}),
      },
      body: JSON.stringify({
        event: "editorial.daily_package.delivery_failed",
        eventId: `daily-package-failure:${operationalDate()}:${failureCode}`,
        destination: "admin@therugbypanda.ie",
        occurredAt: new Date().toISOString(),
        message,
        details: { failureCode, ...details },
      }),
      cache: "no-store",
    });
    return response.ok ? "accepted" as const : "failed" as const;
  } catch {
    return "failed" as const;
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ready",
    deliveryMode: "direct-zoho-smtp",
    requiredArticleCount: PACKAGE_SIZE,
    packageIdentity: "exact-current-dublin-operational-date",
    mandatoryMedia: "verified-hero-plus-official-social-video-embed",
    destination,
  });
}

export async function POST(request: NextRequest) {
  if (!authorised(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const client = getClient();
    const packageDate = operationalDate();
    const packageInputPrefix = `current-${packageDate}-`;

    // Fetch eligible production drafts without GROQ `match`; exact Dublin-day identity is
    // enforced in application code to prevent historical IDs leaking into today's package.
    const eligible = await client.fetch<PackageArticle[]>(`*[
      _type == "article" &&
      _id in path("drafts.**") &&
      morningPackageEligible == true &&
      automationContentClass == "production" &&
      (!defined(workflowStatus) || workflowStatus in ["draft", "submitted", "in-review", "review", "under-review", "approved"])
    ] | order(coalesce(editorialGeneratedAt, _updatedAt) desc) {
      _id,title,standfirst,workflowStatus,editorialInputId,editorialGeneratedAt,"updatedAt":_updatedAt,
      "category":category->title,"competition":competition->title,needsHumanFactCheck,
      "featuredImageUrl":featuredImage.asset->url,
      "socialEmbeds":body[_type == "socialEmbed"]{platform,url,sourceLabel,caption,isOfficialSource}
    }`);
    const articles = (Array.isArray(eligible) ? eligible : [])
      .filter((article) => isCurrentPackageEditorialInputId(article.editorialInputId, packageDate));

    const incompleteEventId = `editorial-daily-package:${packageDate}`;
    const uniqueArticleIds = new Set(articles.map((article) => article._id.replace(/^drafts\./, "")));
    const inputIds = articles.map((article) => article.editorialInputId?.trim()).filter((value): value is string => Boolean(value));
    const uniqueInputIds = new Set(inputIds);
    const imageReadyArticles = articles.filter((article) => Boolean(article.featuredImageUrl));
    const embedReadyArticles = articles.filter(articleHasMandatoryEmbed);
    const exactPackage = articles.length === PACKAGE_SIZE
      && uniqueArticleIds.size === PACKAGE_SIZE
      && inputIds.length === PACKAGE_SIZE
      && uniqueInputIds.size === PACKAGE_SIZE
      && imageReadyArticles.length === PACKAGE_SIZE
      && embedReadyArticles.length === PACKAGE_SIZE;

    if (!exactPackage) {
      const technicalAlertStatus = await sendTechnicalAlert(
        "invalid-current-package-media-readiness",
        `Current package is not exactly ${PACKAGE_SIZE} unique exact-day image-and-embed-ready drafts.`,
        {
          eventId: incompleteEventId,
          packageDate,
          packageInputPrefix,
          eligibleArticles: articles.length,
          uniqueArticleIds: uniqueArticleIds.size,
          uniqueEditorialInputIds: uniqueInputIds.size,
          imageReadyArticles: imageReadyArticles.length,
          mandatoryEmbedReadyArticles: embedReadyArticles.length,
          requiredArticles: PACKAGE_SIZE,
        },
      );
      return NextResponse.json({
        status: "incomplete",
        eventId: incompleteEventId,
        packageDate,
        packageInputPrefix,
        articleCount: articles.length,
        requiredArticleCount: PACKAGE_SIZE,
        imageReadyArticleCount: imageReadyArticles.length,
        mandatoryEmbedReadyArticleCount: embedReadyArticles.length,
        reason: "invalid-current-package-media-readiness",
        technicalAlertStatus,
      }, { status: 409 });
    }

    const eventId = eventIdFor(packageDate, articles);
    const lockId = lockIdFor(packageDate, articles);
    try {
      await client.create({
        _id: lockId,
        _type: "editorialAutomationEvidence",
        kind: "daily-package-direct-zoho",
        status: "sending",
        eventId,
        packageDate,
        packageInputPrefix,
        destination,
        articleIds: articles.map((article) => article._id.replace(/^drafts\./, "")),
        editorialInputIds: inputIds,
        mandatoryEmbedVerified: true,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/already exists|document.*exists|conflict/i.test(message)) {
        const evidence = await client.fetch<DeliveryEvidence | null>(
          `*[_id == $lockId][0]{_id,status,accepted,smtpResponse,completedAt}`,
          { lockId },
        );
        return NextResponse.json({
          status: evidence?.status === "accepted" ? "already-sent" : "delivery-in-progress",
          eventId, articleCount: articles.length, destination,
          accepted: evidence?.accepted, smtpResponse: evidence?.smtpResponse, completedAt: evidence?.completedAt,
        }, { status: evidence?.status === "accepted" ? 200 : 409 });
      }
      throw error;
    }

    let smtpResult: Awaited<ReturnType<typeof sendZohoMail>>;
    try {
      smtpResult = await sendZohoMail({
        to: destination,
        subject: `The Rugby Panda — ${PACKAGE_SIZE} articles ready for review — ${packageDate}`,
        text: emailText(packageDate, articles),
        html: emailHtml(packageDate, articles),
      });
    } catch (error) {
      await client.delete(lockId).catch(() => undefined);
      const message = error instanceof Error ? error.message : "Direct Zoho SMTP delivery failed.";
      const technicalAlertStatus = await sendTechnicalAlert(
        "direct-zoho-smtp-failed", message, { eventId, packageDate, articleCount: articles.length },
      );
      return NextResponse.json({ status: "failed", eventId, error: message, technicalAlertStatus }, { status: 502 });
    }

    let evidenceStatus: "recorded" | "record-failed" = "recorded";
    try {
      await client.patch(lockId).set({
        status: "accepted",
        accepted: smtpResult.accepted,
        smtpResponse: smtpResult.response,
        completedAt: new Date().toISOString(),
      }).commit();
    } catch (error) {
      evidenceStatus = "record-failed";
      console.error("Daily package SMTP was accepted but evidence update failed", error);
    }

    return NextResponse.json({
      status: "sent", eventId, packageDate, packageInputPrefix,
      articleCount: articles.length,
      articleIds: articles.map((article) => article._id.replace(/^drafts\./, "")),
      editorialInputIds: inputIds,
      mandatoryEmbedVerified: true,
      destination, accepted: smtpResult.accepted, smtpResponse: smtpResult.response, evidenceStatus,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Daily editorial package failed.";
    const technicalAlertStatus = await sendTechnicalAlert("daily-package-exception", message, {});
    return NextResponse.json({ error: message, technicalAlertStatus }, { status: 500 });
  }
}
