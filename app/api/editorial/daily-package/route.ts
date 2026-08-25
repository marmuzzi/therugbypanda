import { createHash } from "node:crypto";

import { createClient } from "next-sanity";
import { NextRequest, NextResponse } from "next/server";

import { sendZohoMail } from "@/lib/email/ZohoSmtp";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PACKAGE_SIZE = 5;
const CANDIDATE_POOL_SIZE = 30;
const destination = "editor@therugbypanda.ie";
const studioBaseUrl = "https://therugbypanda.sanity.studio";
const DIVERSITY_SIMILARITY_LIMIT = 0.55;

const STOP_WORDS = new Set([
  "a", "about", "after", "all", "an", "and", "are", "as", "at", "be", "been", "before", "but", "by",
  "for", "from", "has", "have", "here", "how", "in", "into", "is", "it", "its", "more", "new", "of",
  "on", "or", "our", "rugby", "says", "that", "the", "their", "this", "to", "union", "what", "when",
  "why", "will", "with", "you",
]);

type SourceRecord = { id?: string; url?: string };

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
  editorialAngle?: string;
  sourceStoryTitle?: string;
  sourceRecords?: SourceRecord[];
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

function reviewUrl(articleId: string) {
  const id = articleId.replace(/^drafts\./, "");
  return `${studioBaseUrl}/intent/edit/id=${encodeURIComponent(id)};type=article`;
}

function normalisedTokens(article: PackageArticle): Set<string> {
  return new Set(
    [article.title, article.editorialAngle, article.sourceStoryTitle]
      .filter(Boolean).join(" ").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
      .split(/[^a-z0-9]+/).filter((token) => token.length >= 3 && !STOP_WORDS.has(token)),
  );
}

function tokenSimilarity(left: PackageArticle, right: PackageArticle): number {
  const leftTokens = normalisedTokens(left);
  const rightTokens = normalisedTokens(right);
  if (leftTokens.size === 0 || rightTokens.size === 0) return 0;
  let intersection = 0;
  for (const token of leftTokens) if (rightTokens.has(token)) intersection += 1;
  const union = new Set([...leftTokens, ...rightTokens]).size;
  return union === 0 ? 0 : intersection / union;
}

function sourceKeys(article: PackageArticle): Set<string> {
  const keys = new Set<string>();
  for (const source of article.sourceRecords ?? []) {
    if (source.id?.trim()) keys.add(`id:${source.id.trim().toLowerCase()}`);
    if (source.url?.trim()) keys.add(`url:${source.url.trim().toLowerCase()}`);
  }
  return keys;
}

function sharesSource(left: PackageArticle, right: PackageArticle): boolean {
  const leftKeys = sourceKeys(left);
  if (leftKeys.size === 0) return false;
  const rightKeys = sourceKeys(right);
  for (const key of leftKeys) if (rightKeys.has(key)) return true;
  return false;
}

function isDistinctEnough(candidate: PackageArticle, selected: PackageArticle[]): boolean {
  return selected.every((existing) => !sharesSource(candidate, existing) && tokenSimilarity(candidate, existing) < DIVERSITY_SIMILARITY_LIMIT);
}

function selectDiversePackage(candidates: PackageArticle[]): PackageArticle[] {
  const selected: PackageArticle[] = [];
  for (const candidate of candidates) {
    if (isDistinctEnough(candidate, selected)) selected.push(candidate);
    if (selected.length === PACKAGE_SIZE) break;
  }
  return selected;
}

function operationalDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Dublin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function packageFingerprint(articles: PackageArticle[]) {
  const canonicalPackage = articles.map((article) => `${article._id.replace(/^drafts\./, "")}|${article.updatedAt ?? ""}`).sort().join("\n");
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
    `The Rugby Panda morning editorial package for ${packageDate}.`, "",
    "Five production-eligible, editorially distinct articles are ready for review in Sanity.", "",
    ...articleSections,
    "Open each Review link to edit, approve or reject the article.",
  ].join("\n");
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
          ? { authorization: `Bearer ${process.env.EDITORIAL_TECHNICAL_ALERT_WEBHOOK_SECRET?.trim()}` }
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
  return NextResponse.json({ status: "ready", deliveryMode: "direct-zoho-smtp", requiredArticleCount: PACKAGE_SIZE, destination });
}

export async function POST(request: NextRequest) {
  if (!authorised(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const client = getClient();
    const candidates = await client.fetch<PackageArticle[]>(
      `*[
        _type == "article" && _id in path("drafts.**") && morningPackageEligible == true && automationContentClass == "production" &&
        (!defined(workflowStatus) || workflowStatus in ["draft", "submitted", "in-review", "review", "under-review", "approved"])
      ] | order(coalesce(editorialGeneratedAt, _updatedAt) desc)[0...$limit] {
        _id,title,standfirst,workflowStatus,editorialGeneratedAt,"updatedAt":_updatedAt,
        "category":category->title,"competition":competition->title,needsHumanFactCheck,
        "featuredImageUrl":featuredImage.asset->url,editorialAngle,sourceStoryTitle,sourceRecords[]{id,url}
      }`,
      { limit: CANDIDATE_POOL_SIZE },
    );
    const articles = selectDiversePackage(candidates);
    const packageDate = operationalDate();
    const incompleteEventId = `editorial-daily-package:${packageDate}`;

    if (articles.length < PACKAGE_SIZE) {
      const technicalAlertStatus = await sendTechnicalAlert(
        "insufficient-production-eligible-diverse-content",
        `Only ${articles.length} of ${PACKAGE_SIZE} required production-eligible, editorially distinct articles are ready for the 08:00 package.`,
        { eventId: incompleteEventId, packageDate, eligibleCandidates: candidates.length, distinctArticles: articles.length, requiredArticles: PACKAGE_SIZE,
          eligibilityRule: "morningPackageEligible=true and automationContentClass=production", diversitySimilarityLimit: DIVERSITY_SIMILARITY_LIMIT },
      );
      return NextResponse.json({ status: "incomplete", eventId: incompleteEventId, articleCount: articles.length,
        eligibleCandidateCount: candidates.length, requiredArticleCount: PACKAGE_SIZE,
        reason: "insufficient-production-eligible-diverse-content", technicalAlertStatus }, { status: 409 });
    }

    const eventId = packageEventId(packageDate, articles);
    const lockId = packageLockId(packageDate, articles);
    try {
      await client.create({
        _id: lockId, _type: "editorialAutomationEvidence", kind: "daily-package-direct-zoho", status: "sending",
        eventId, packageDate, destination,
        articleIds: articles.map((article) => article._id.replace(/^drafts\./, "")),
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/already exists|document.*exists|conflict/i.test(message)) {
        const evidence = await client.fetch<DeliveryEvidence | null>(`*[_id == $lockId][0]{_id,status,accepted,smtpResponse,completedAt}`, { lockId });
        return NextResponse.json({
          status: evidence?.status === "accepted" ? "already-sent" : "delivery-in-progress",
          eventId, articleCount: articles.length, destination, accepted: evidence?.accepted,
          smtpResponse: evidence?.smtpResponse, completedAt: evidence?.completedAt,
        }, { status: evidence?.status === "accepted" ? 200 : 409 });
      }
      throw error;
    }

    let smtpResult: Awaited<ReturnType<typeof sendZohoMail>>;
    try {
      smtpResult = await sendZohoMail({ to: destination, subject: emailSubject(packageDate), text: emailText(packageDate, articles) });
    } catch (error) {
      await client.delete(lockId).catch(() => undefined);
      const message = error instanceof Error ? error.message : "Direct Zoho SMTP delivery failed.";
      const technicalAlertStatus = await sendTechnicalAlert("direct-zoho-smtp-failed", message, { eventId, articleCount: articles.length });
      return NextResponse.json({ status: "failed", eventId, error: message, technicalAlertStatus }, { status: 502 });
    }

    let evidenceStatus: "recorded" | "record-failed" = "recorded";
    try {
      await client.patch(lockId).set({ status: "accepted", accepted: smtpResult.accepted,
        smtpResponse: smtpResult.response, completedAt: new Date().toISOString() }).commit();
    } catch (error) {
      evidenceStatus = "record-failed";
      console.error("Daily package SMTP was accepted but evidence update failed", error);
    }

    return NextResponse.json({
      status: "sent", eventId, articleCount: articles.length, eligibleCandidateCount: candidates.length,
      destination, accepted: smtpResult.accepted, smtpResponse: smtpResult.response, evidenceStatus,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Daily editorial package failed.";
    const technicalAlertStatus = await sendTechnicalAlert("daily-package-exception", message, {});
    return NextResponse.json({ error: message, technicalAlertStatus }, { status: 500 });
  }
}
