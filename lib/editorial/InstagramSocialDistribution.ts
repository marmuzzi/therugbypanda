import { createHash } from "node:crypto";
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import { relevantSocialHashtags } from "@/lib/editorial/SocialHashtags";

export type InstagramDistributionDelivery = {
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
  featuredImageUrl?: string;
  doNotPublishToSocial?: boolean;
  socialInstagramCaption?: string;
  socialHashtags?: string[];
};

type Attempt = {
  _id: string;
  _rev: string;
  status?: "new" | "processing" | "container-created" | "sent" | "failed";
  updatedAt?: string;
  containerId?: string;
  postId?: string;
};

const GRAPH_BASE = "https://graph.instagram.com";
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

function instagramCaption(article: PublishedArticle) {
  const override = article.socialInstagramCaption?.trim();
  const headline = article.title?.trim() || "New from The Rugby Panda";
  const teaser = article.standfirst?.trim();
  const body = override || (teaser ? `${headline}\n\n${teaser}` : headline);
  const tags = relevantSocialHashtags({ title: article.title, standfirst: article.standfirst, hashtags: article.socialHashtags }, 8);
  const suffix = [`Read the full story: ${articleUrl(article.slug)}`, tags.join(" ")]
    .filter(Boolean)
    .join("\n\n");
  const combined = `${body}\n\n${suffix}`.trim();
  return combined.length <= 2200 ? combined : `${combined.slice(0, 2197).trimEnd()}...`;
}

function attemptId(eventId: string) {
  return `socialDistributionAttempt-instagram-${createHash("sha256").update(eventId).digest("hex").slice(0, 40)}`;
}

async function metaPost(path: string, fields: Record<string, string>) {
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
    const payload = (await response.json().catch(() => ({}))) as { id?: string; error?: { message?: string; code?: number } };
    if (!response.ok || !payload.id) {
      const detail = payload.error?.message?.trim() || `HTTP ${response.status}`;
      throw new Error(`Instagram API request failed: ${detail}`);
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

export async function notifyArticlePublishedToInstagram(articleId: string): Promise<InstagramDistributionDelivery> {
  const client = getClient();
  if (!client) return { status: "failed", error: "Sanity write configuration is unavailable." };

  const article = await client.fetch<PublishedArticle | null>(
    `*[_type == "article" && _id == $articleId][0]{
      _id,
      title,
      standfirst,
      publishedAt,
      "slug": slug.current,
      "featuredImageUrl": featuredImage.asset->url,
      doNotPublishToSocial,
      "socialInstagramCaption": socialDistribution.instagramCaption,
      "socialHashtags": socialDistribution.hashtags
    }`,
    { articleId },
  );

  if (!article) return { status: "failed", error: `Published article ${articleId} was not found.` };

  const publishedAt = article.publishedAt ?? new Date().toISOString();
  const eventId = `editorial-social:instagram:${article._id}:${publishedAt}`;
  const now = new Date().toISOString();

  if (article.doNotPublishToSocial) {
    await recordArticleStatus(articleId, {
      "socialDistribution.status": "skipped",
      "socialDistribution.lastEventId": eventId,
      "socialDistribution.lastAttemptAt": now,
      "socialDistribution.lastError": "Article opted out of social publishing.",
    });
    return { status: "skipped", eventId };
  }

  if (process.env.META_INSTAGRAM_PUBLISH_ENABLED !== "true") {
    return {
      status: "skipped",
      eventId,
      error: "Instagram publishing is safety-disabled until the controlled first post is approved.",
    };
  }

  const accessToken = process.env.META_INSTAGRAM_ACCESS_TOKEN?.trim();
  const accountId = process.env.META_INSTAGRAM_ACCOUNT_ID?.trim();
  if (!accessToken || !accountId) {
    const error = "Instagram production credentials are not configured.";
    await recordArticleStatus(articleId, {
      "socialDistribution.status": "failed",
      "socialDistribution.lastEventId": eventId,
      "socialDistribution.lastAttemptAt": now,
      "socialDistribution.lastError": error,
    });
    return { status: "failed", eventId, error };
  }

  if (!article.featuredImageUrl?.startsWith("https://")) {
    const error = "Instagram publishing requires a public HTTPS featured image.";
    await recordArticleStatus(articleId, {
      "socialDistribution.status": "failed",
      "socialDistribution.lastEventId": eventId,
      "socialDistribution.lastAttemptAt": now,
      "socialDistribution.lastError": error,
    });
    return { status: "failed", eventId, error };
  }

  const lockId = attemptId(eventId);
  await client.createIfNotExists({
    _id: lockId,
    _type: "socialDistributionAttempt",
    provider: "instagram",
    eventId,
    articleId,
    status: "new",
    createdAt: now,
    updatedAt: now,
  });

  let attempt = await client.fetch<Attempt>(`*[_id == $id][0]{_id,_rev,status,updatedAt,containerId,postId}`, { id: lockId });
  if (attempt.status === "sent" && attempt.postId) {
    return { status: "skipped", eventId, postId: attempt.postId };
  }

  if (attempt.status === "processing" && attempt.updatedAt) {
    const age = Date.now() - Date.parse(attempt.updatedAt);
    if (Number.isFinite(age) && age < ACTIVE_ATTEMPT_WINDOW_MS) {
      return { status: "skipped", eventId, error: "Instagram publication is already in progress." };
    }
  }

  try {
    attempt = await client
      .patch(lockId)
      .ifRevisionId(attempt._rev)
      .set({ status: "processing", updatedAt: now, lastError: null })
      .commit() as Attempt;
  } catch {
    return { status: "skipped", eventId, error: "Another Instagram publication worker claimed this event." };
  }

  await recordArticleStatus(articleId, {
    "socialDistribution.status": "queued",
    "socialDistribution.lastEventId": eventId,
    "socialDistribution.lastAttemptAt": now,
    "socialDistribution.lastError": null,
  });

  try {
    let containerId = attempt.containerId;
    if (!containerId) {
      containerId = await metaPost(`${accountId}/media`, {
        image_url: article.featuredImageUrl,
        caption: instagramCaption(article),
        access_token: accessToken,
      });
      const saved = await client.patch(lockId).set({ status: "container-created", containerId, updatedAt: new Date().toISOString() }).commit() as Attempt;
      attempt = saved;
    }

    const postId = await metaPost(`${accountId}/media_publish`, {
      creation_id: containerId,
      access_token: accessToken,
    });

    const sentAt = new Date().toISOString();
    await client.patch(lockId).set({ status: "sent", postId, updatedAt: sentAt, lastError: null }).commit();
    await recordArticleStatus(articleId, {
      "socialDistribution.status": "sent",
      "socialDistribution.lastSentAt": sentAt,
      "socialDistribution.instagramPostId": postId,
      "socialDistribution.lastError": null,
    });

    return { status: "sent", eventId, postId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Instagram publishing failed.";
    const failedAt = new Date().toISOString();
    await client.patch(lockId).set({ status: "failed", updatedAt: failedAt, lastError: message }).commit().catch(() => undefined);
    await recordArticleStatus(articleId, {
      "socialDistribution.status": "failed",
      "socialDistribution.lastAttemptAt": failedAt,
      "socialDistribution.lastError": message,
    }).catch(() => undefined);
    return { status: "failed", eventId, error: message };
  }
}
