import { createClient } from "next-sanity";
import { NextRequest, NextResponse } from "next/server";

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
  editorialGeneratedAt?: string;
  updatedAt?: string;
  category?: string;
  competition?: string;
  needsHumanFactCheck?: boolean;
  featuredImageUrl?: string;
};

function authorised(request: NextRequest) {
  const expected = process.env.EDITORIAL_AUTOMATION_SECRET?.trim();
  if (!expected) return false;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  return supplied === expected;
}

function getClient() {
  const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_AUTH_TOKEN;
  if (!projectId || !dataset || !token) {
    throw new Error("Sanity automation configuration is unavailable.");
  }
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
}

function reviewUrl(articleId: string) {
  const id = articleId.replace(/^drafts\./, "");
  return `${studioBaseUrl}/intent/edit/id=${encodeURIComponent(id)};type=article`;
}

async function sendTechnicalAlert(message: string, details: Record<string, unknown>) {
  const webhookUrl = process.env.EDITORIAL_TECHNICAL_ALERT_WEBHOOK_URL?.trim();
  if (!webhookUrl) return "skipped" as const;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.EDITORIAL_TECHNICAL_ALERT_WEBHOOK_SECRET?.trim()
          ? { authorization: `Bearer ${process.env.EDITORIAL_TECHNICAL_ALERT_WEBHOOK_SECRET?.trim()}` }
          : {}),
      },
      body: JSON.stringify({
        event: "editorial.daily_package.delivery_failed",
        eventId: `daily-package-failure:${new Date().toISOString().slice(0, 10)}`,
        destination: "admin@therugbypanda.ie",
        occurredAt: new Date().toISOString(),
        message,
        details,
      }),
      cache: "no-store",
    });
    return response.ok ? ("sent" as const) : ("failed" as const);
  } catch {
    return "failed" as const;
  }
}

export async function POST(request: NextRequest) {
  if (!authorised(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const webhookUrl = process.env.EDITORIAL_DAILY_PACKAGE_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    await sendTechnicalAlert("Daily editorial package webhook is not configured.", {});
    return NextResponse.json(
      { error: "EDITORIAL_DAILY_PACKAGE_WEBHOOK_URL is not configured." },
      { status: 503 },
    );
  }

  try {
    const client = getClient();
    const articles = await client.fetch<PackageArticle[]>(
      `*[
        _type == "article" &&
        _id in path("drafts.**") &&
        (!defined(workflowStatus) || workflowStatus in ["draft", "submitted", "in-review", "review", "under-review", "approved"])
      ] | order(coalesce(editorialGeneratedAt, _updatedAt) desc)[0...$limit] {
        _id,
        title,
        standfirst,
        workflowStatus,
        editorialGeneratedAt,
        "updatedAt": _updatedAt,
        "category": category->title,
        "competition": competition->title,
        needsHumanFactCheck,
        "featuredImageUrl": featuredImage.asset->url
      }`,
      { limit: PACKAGE_SIZE },
    );

    const packageDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Dublin",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    const eventId = `editorial-daily-package:${packageDate}`;

    if (articles.length < PACKAGE_SIZE) {
      const technicalAlertStatus = await sendTechnicalAlert(
        `Only ${articles.length} of ${PACKAGE_SIZE} required articles are ready for the 08:00 package.`,
        { eventId, packageDate, availableArticles: articles.length, requiredArticles: PACKAGE_SIZE },
      );
      return NextResponse.json(
        {
          status: "incomplete",
          eventId,
          articleCount: articles.length,
          requiredArticleCount: PACKAGE_SIZE,
          technicalAlertStatus,
        },
        { status: 409 },
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-editorial-event-id": eventId,
        ...(process.env.EDITORIAL_DAILY_PACKAGE_WEBHOOK_SECRET?.trim()
          ? { authorization: `Bearer ${process.env.EDITORIAL_DAILY_PACKAGE_WEBHOOK_SECRET?.trim()}` }
          : {}),
      },
      body: JSON.stringify({
        event: "editorial.daily_package.ready",
        eventId,
        packageDate,
        destination,
        requiredArticleCount: PACKAGE_SIZE,
        articleCount: articles.length,
        generatedAt: new Date().toISOString(),
        articles: articles.map((article, index) => ({
          position: index + 1,
          articleId: article._id.replace(/^drafts\./, ""),
          title: article.title ?? "Untitled article",
          standfirst: article.standfirst,
          workflowStatus: article.workflowStatus ?? "draft",
          editorialGeneratedAt: article.editorialGeneratedAt,
          updatedAt: article.updatedAt,
          category: article.category,
          competition: article.competition,
          needsHumanFactCheck: article.needsHumanFactCheck ?? false,
          featuredImageUrl: article.featuredImageUrl,
          reviewUrl: reviewUrl(article._id),
        })),
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const technicalAlertStatus = await sendTechnicalAlert(
        `Daily editorial package webhook returned ${response.status}.`,
        { eventId, responseStatus: response.status },
      );
      return NextResponse.json(
        { status: "failed", eventId, responseStatus: response.status, technicalAlertStatus },
        { status: 502 },
      );
    }

    return NextResponse.json({
      status: "sent",
      eventId,
      articleCount: articles.length,
      destination,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Daily editorial package failed.";
    const technicalAlertStatus = await sendTechnicalAlert(message, {});
    return NextResponse.json(
      { error: message, technicalAlertStatus },
      { status: 500 },
    );
  }
}
