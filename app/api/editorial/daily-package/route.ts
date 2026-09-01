import { createHash } from "node:crypto";

import { createClient } from "next-sanity";
import { NextRequest, NextResponse } from "next/server";

import { sendZohoMail } from "@/lib/email/ZohoSmtp";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PACKAGE_SIZE = 5;
const destination = "editor@therugbypanda.ie";
const studioBaseUrl = "https://therugbypanda.sanity.studio";

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
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  return supplied === expected;
}

function getClient() {
  const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_AUTH_TOKEN;
  if (!projectId || !dataset || !token) throw new Error("Sanity automation configuration is unavailable.");
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
}

function operationalDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Dublin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function reviewUrl(articleId: string) {
  const id = articleId.replace(/^drafts\./, "");
  return `${studioBaseUrl}/intent/edit/id=${encodeURIComponent(id)};type=article`;
}

function packageFingerprint(articles: PackageArticle[]) {
  const canonicalPackage = articles
    .map((article) => `${article._id.replace(/^drafts\./, "")}|${article.updatedAt ?? ""}`)
    .sort()
    .join("\n");
  return createHash("sha256").update(canonicalPackage).digest("hex").slice(0, 12);
}

function packageEventId(packageDate: string, articles: PackageArticle[]) {
  return `editorial-daily-package:${packageDate}:${packageFingerprint(articles)}`;
}

function packageLockId(packageDate: string, articles: PackageArticle[]) {
  const safeDate = packageDate.replace(/[^0-9]/g, "");
  return `editorial-daily-package-${safeDate}-${packageFingerprint(articles)}`;
}

function emailSubject(packageDate: string) {
  return `The Rugby Panda — ${PACKAGE_SIZE} articles ready for review — ${packageDate}`;
}

function emailText(packageDate: string, articles: PackageArticle[]) {
  const articleSections = articles.flatMap((article, index) => [
    `${index + 1}. ${article.title ?? "Untitled article"}`,
    [article.category, article.competition].filter(Boolean).join(" · "),
    article.standfirst ?? "",
    `Review: ${reviewUrl(article._id)}`,
    `Status: ${article.workflowStatus ?? "draft"}${article.needsHumanFactCheck ? " · human fact-check flagged" : ""}`,
    article.featuredImageUrl ? "Image: assigned" : "Image: no relevant image assigned",
    "",
  ]);
  return [
    `The Rugby Panda morning editorial package for ${packageDate}.`,
    "",
    "Five production-eligible articles from today's protected exact package are ready for review in Sanity.",
    "",
    ...articleSections,
    "Open each Review link to edit, approve or reject the article.",
  ].join("\n");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

function emailHtml(packageDate: string, articles: PackageArticle[]) {
  const cards = articles.map((article, index) => {
    const title = escapeHtml(article.title ?? "Untitled article");
    const metadata = escapeHtml([article.category, article.competition].filter(Boolean).join(" · "));
    const standfirst = escapeHtml(article.standfirst ?? "");
    const status = escapeHtml(`${article.workflowStatus ?? "draft"}${article.needsHumanFactCheck ? " · human fact-check flagged" : ""}`);
    const imageStatus = article.featuredImageUrl ? "Image assigned" : "No relevant image assigned";
    const url = escapeHtml(reviewUrl(article._id));
    return `
      <tr><td style="padding:0 0 16px 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border:1px solid #d1d5db;border-radius:14px;background:#ffffff;color:#111827;">
          <tr><td style="padding:18px 18px 6px 18px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#2e7d32;">Article ${index + 1}${metadata ? ` · ${metadata}` : ""}</td></tr>
          <tr><td style="padding:0 18px 8px 18px;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.25;font-weight:700;color:#111827;">${title}</td></tr>
          ${standfirst ? `<tr><td style="padding:0 18px 12px 18px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#374151;">${standfirst}</td></tr>` : ""}
          <tr><td style="padding:0 18px 16px 18px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#4b5563;">Status: ${status}<br>${imageStatus}</td></tr>
          <tr><td style="padding:0 18px 18px 18px;"><a href="${url}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;padding:12px 18px;border-radius:10px;">Open in Sanity</a></td></tr>
        </table>
      </td></tr>`;
  }).join("");

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light"></head>
<body style="margin:0;padding:0;background:#f3f4f6;color:#111827;color-scheme:light only;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#f3f4f6;"><tr><td align="center" style="padding:20px 12px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;border-collapse:collapse;background:#ffffff;color:#111827;border-radius:16px;">
      <tr><td style="padding:24px 22px 8px 22px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#2e7d32;">The Rugby Panda</td></tr>
      <tr><td style="padding:0 22px 8px 22px;font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:1.2;font-weight:700;color:#111827;">Five articles ready for review</td></tr>
      <tr><td style="padding:0 22px 22px 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#4b5563;">Protected editorial package for ${escapeHtml(packageDate)}. Open each article in Sanity to review, edit, approve or reject it.</td></tr>
      <tr><td style="padding:0 22px 8px 22px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${cards}</table></td></tr>
      <tr><td style="padding:4px 22px 24px 22px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#6b7280;">This message also contains a plain-text fallback for mail clients that do not render HTML.</td></tr>
    </table>
  </td></tr></table>
</body></html>`;
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
          ? { authorization: `Bearer ${process.env.EDITORIAL_TECHNICAL_ALERT_WEBHOOK_SECRET.trim()}` }
          : {}),
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
    return response.ok ? ("accepted" as const) : ("failed" as const);
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
    destination,
  });
}

export async function POST(request: NextRequest) {
  if (!authorised(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const client = getClient();
    const packageDate = operationalDate();
    const packageInputPrefix = `current-${packageDate}-*`;
    const articles = await client.fetch<PackageArticle[]>(
      `*[
        _type == "article" &&
        _id in path("drafts.**") &&
        morningPackageEligible == true &&
        automationContentClass == "production" &&
        editorialInputId match $packageInputPrefix &&
        (!defined(workflowStatus) || workflowStatus in ["draft", "submitted", "in-review", "review", "under-review", "approved"])
      ] | order(coalesce(editorialGeneratedAt, _updatedAt) desc) {
        _id,title,standfirst,workflowStatus,editorialInputId,editorialGeneratedAt,"updatedAt":_updatedAt,
        "category":category->title,"competition":competition->title,needsHumanFactCheck,
        "featuredImageUrl":featuredImage.asset->url
      }`,
      { packageInputPrefix },
    );

    const incompleteEventId = `editorial-daily-package:${packageDate}`;
    const uniqueArticleIds = new Set(articles.map((article) => article._id.replace(/^drafts\./, "")));
    const inputIds = articles.map((article) => article.editorialInputId?.trim()).filter((value): value is string => Boolean(value));
    const uniqueInputIds = new Set(inputIds);
    const allHaveVerifiedHeroBoundary = articles.every((article) => Boolean(article.featuredImageUrl));
    const exactPackage = articles.length === PACKAGE_SIZE
      && uniqueArticleIds.size === PACKAGE_SIZE
      && inputIds.length === PACKAGE_SIZE
      && uniqueInputIds.size === PACKAGE_SIZE
      && allHaveVerifiedHeroBoundary;

    if (!exactPackage) {
      const technicalAlertStatus = await sendTechnicalAlert(
        "invalid-current-package-cardinality",
        `Current package is not exactly ${PACKAGE_SIZE} unique image-ready production-eligible drafts.`,
        {
          eventId: incompleteEventId,
          packageDate,
          packageInputPrefix,
          eligibleArticles: articles.length,
          uniqueArticleIds: uniqueArticleIds.size,
          editorialInputIds: inputIds.length,
          uniqueEditorialInputIds: uniqueInputIds.size,
          imageReadyArticles: articles.filter((article) => Boolean(article.featuredImageUrl)).length,
          requiredArticles: PACKAGE_SIZE,
          eligibilityRule: "exact current Dublin editorialInputId + morningPackageEligible=true + automationContentClass=production; diversity/freshness/review resolved upstream",
        },
      );
      return NextResponse.json({
        status: "incomplete",
        eventId: incompleteEventId,
        packageDate,
        packageInputPrefix,
        articleCount: articles.length,
        eligibleCandidateCount: articles.length,
        requiredArticleCount: PACKAGE_SIZE,
        reason: "invalid-current-package-cardinality",
        technicalAlertStatus,
      }, { status: 409 });
    }

    const eventId = packageEventId(packageDate, articles);
    const lockId = packageLockId(packageDate, articles);
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
          eventId,
          articleCount: articles.length,
          destination,
          accepted: evidence?.accepted,
          smtpResponse: evidence?.smtpResponse,
          completedAt: evidence?.completedAt,
        }, { status: evidence?.status === "accepted" ? 200 : 409 });
      }
      throw error;
    }

    let smtpResult: Awaited<ReturnType<typeof sendZohoMail>>;
    try {
      smtpResult = await sendZohoMail({
        to: destination,
        subject: emailSubject(packageDate),
        text: emailText(packageDate, articles),
        html: emailHtml(packageDate, articles),
      });
    } catch (error) {
      await client.delete(lockId).catch(() => undefined);
      const message = error instanceof Error ? error.message : "Direct Zoho SMTP delivery failed.";
      const technicalAlertStatus = await sendTechnicalAlert(
        "direct-zoho-smtp-failed",
        message,
        { eventId, packageDate, articleCount: articles.length },
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
      status: "sent",
      eventId,
      packageDate,
      packageInputPrefix,
      articleCount: articles.length,
      eligibleCandidateCount: articles.length,
      articleIds: articles.map((article) => article._id.replace(/^drafts\./, "")),
      editorialInputIds: inputIds,
      destination,
      accepted: smtpResult.accepted,
      smtpResponse: smtpResult.response,
      evidenceStatus,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Daily editorial package failed.";
    const technicalAlertStatus = await sendTechnicalAlert("daily-package-exception", message, {});
    return NextResponse.json({ error: message, technicalAlertStatus }, { status: 500 });
  }
}
