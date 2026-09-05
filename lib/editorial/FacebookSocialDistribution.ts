import { createHash } from "node:crypto";
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import { relevantSocialHashtags } from "@/lib/editorial/SocialHashtags";

export type FacebookDistributionDelivery = {
  status: "sent" | "skipped" | "failed";
  eventId?: string;
  postId?: string;
  error?: string;
};

type PublishedArticle = {
  _id: string;
  title?: string;
  standfirst?: string;
  publishedAt?: string;
  slug?: string;
  doNotPublishToSocial?: boolean;
  socialFacebookTeaser?: string;
  socialHashtags?: string[];
};

type Attempt = {
  _id: string;
  _rev: string;
  status?: "new" | "processing" | "sent" | "failed";
  updatedAt?: string;
  postId?: string;
};

const GRAPH_BASE = "https://graph.facebook.com/v26.0";
const ACTIVE_ATTEMPT_WINDOW_MS = 10 * 60 * 1000;

function getClient() {
  const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_AUTH_TOKEN;
  if (!projectId || !dataset || !token) return null;
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false });
}

function articleUrl(slug?: string) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://therugbypanda.ie").replace(/\/$/, "");
  return slug ? `${siteUrl}/articles/${slug}` : siteUrl;
}

function facebookMessage(article: PublishedArticle) {
  const override = article.socialFacebookTeaser?.trim();
  const headline = article.title?.trim() || "New from The Rugby Panda";
  const teaser = article.standfirst?.trim();
  const body = override || (teaser ? `${headline}\n\n${teaser}` : headline);
  const tags = relevantSocialHashtags({ title: article.title, standfirst: article.standfirst, hashtags: article.socialHashtags }, 4);
  return `${body}\n\n${tags.join(" ")}`.trim();
}

function attemptId(eventId: string) {
  return `socialDistributionAttempt-facebook-${createHash("sha256").update(eventId).digest("hex").slice(0, 40)}`;
}

async function facebookPost(path: string, fields: Record<string, string>) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(`${GRAPH_BASE}/${path.replace(/^\//, "")}`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(fields),
      cache: "no-store",
      signal: controller.signal,
    });
    const payload = (await response.json().catch(() => ({}))) as {
      id?: string;
      error?: { message?: string; code?: number };
    };
    if (!response.ok || !payload.id) {
      const detail = payload.error?.message?.trim() || `HTTP ${response.status}`;
      throw new Error(`Facebook API request failed: ${detail}`);
    }
    return payload.id;
  } finally {
    clearTimeout(timeout);
  }
}

async function recordArticleStatus(articleId: string, values: Record<string, unknown>) {
  const client = getClient();
  if (!client) return;
  await client.patch(articleId).set(values).commit();
}

export async function notifyArticlePublishedToFacebook(
  articleId: string,
): Promise<FacebookDistributionDelivery> {
  const client = getClient();
  if (!client) return { status: "failed", error: "Sanity write configuration is unavailable." };

  const article = await client.fetch<PublishedArticle | null>(
    `*[_type == "article" && _id == $articleId][0]{
      _id,
      title,
      standfirst,
      publishedAt,
      "slug": slug.current,
      doNotPublishToSocial,
      "socialFacebookTeaser": socialDistribution.facebookTeaser,
      "socialHashtags": socialDistribution.hashtags
    }`,
    { articleId },
  );

  if (!article) return { status: "failed", error: `Published article ${articleId} was not found.` };

  const publishedAt = article.publishedAt ?? new Date().toISOString();
  const eventId = `editorial-social:facebook:${article._id}:${publishedAt}`;
  const now = new Date().toISOString();

  if (article.doNotPublishToSocial) {
    return { status: "skipped", eventId, error: "Article opted out of social publishing." };
  }

  if (process.env.META_FACEBOOK_PUBLISH_ENABLED !== "true") {
    return {
      status: "skipped",
      eventId,
      error: "Facebook publishing is safety-disabled until the controlled first post is approved.",
    };
  }

  const accessToken = process.env.META_FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
  const pageId = process.env.META_FACEBOOK_PAGE_ID?.trim();
  if (!accessToken || !pageId) {
    return { status: "failed", eventId, error: "Facebook production credentials are not configured." };
  }

  const lockId = attemptId(eventId);
  await client.createIfNotExists({
    _id: lockId,
    _type: "socialDistributionAttempt",
    provider: "facebook",
    eventId,
    articleId,
    status: "new",
    createdAt: now,
    updatedAt: now,
  });

  let attempt = await client.fetch<Attempt>(
    `*[_id == $id][0]{_id,_rev,status,updatedAt,postId}`,
    { id: lockId },
  );

  if (attempt.status === "sent" && attempt.postId) {
    return { status: "skipped", eventId, postId: attempt.postId };
  }

  if (attempt.status === "processing" && attempt.updatedAt) {
    const age = Date.now() - Date.parse(attempt.updatedAt);
    if (Number.isFinite(age) && age < ACTIVE_ATTEMPT_WINDOW_MS) {
      return { status: "skipped", eventId, error: "Facebook publication is already in progress." };
    }
  }

  try {
    attempt = (await client
      .patch(lockId)
      .ifRevisionId(attempt._rev)
      .set({ status: "processing", updatedAt: now, lastError: null })
      .commit()) as Attempt;
  } catch {
    return { status: "skipped", eventId, error: "Another Facebook publication worker claimed this event." };
  }

  try {
    const postId = await facebookPost(`${pageId}/feed`, {
      message: facebookMessage(article),
      link: articleUrl(article.slug),
      access_token: accessToken,
    });

    const sentAt = new Date().toISOString();
    await client.patch(lockId).set({ status: "sent", postId, updatedAt: sentAt, lastError: null }).commit();
    await recordArticleStatus(articleId, {
      "socialDistribution.facebookPostId": postId,
      "socialDistribution.lastSentAt": sentAt,
    });

    return { status: "sent", eventId, postId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Facebook publishing failed.";
    const failedAt = new Date().toISOString();
    await client.patch(lockId).set({ status: "failed", updatedAt: failedAt, lastError: message }).commit().catch(() => undefined);
    return { status: "failed", eventId, error: message };
  }
}
