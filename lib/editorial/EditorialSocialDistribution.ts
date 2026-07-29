import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

export type SocialDistributionDelivery = {
  status: "sent" | "skipped" | "failed";
  eventId?: string;
  error?: string;
};

type PublishedArticle = {
  _id: string;
  title?: string;
  standfirst?: string;
  publishedAt?: string;
  slug?: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  category?: string;
  competition?: string;
  province?: string;
  doNotPublishToSocial?: boolean;
  socialFacebookTeaser?: string;
  socialInstagramCaption?: string;
  socialHashtags?: string[];
};

function getClient() {
  const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_AUTH_TOKEN;
  if (!projectId || !dataset || !token) return null;
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false });
}

function articleUrl(slug?: string) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://therugbypanda.ie").replace(/\/$/, "");
  return slug ? `${siteUrl}/articles/${slug}` : siteUrl;
}

function defaultFacebookTeaser(article: PublishedArticle) {
  return article.standfirst?.trim() || article.title?.trim() || "New from The Rugby Panda.";
}

function defaultInstagramCaption(article: PublishedArticle) {
  const headline = article.title?.trim() || "New from The Rugby Panda";
  const teaser = article.standfirst?.trim();
  return teaser ? `${headline}\n\n${teaser}` : headline;
}

async function recordStatus(
  articleId: string,
  values: Record<string, unknown>,
): Promise<void> {
  const client = getClient();
  if (!client) return;
  try {
    await client.patch(articleId).set(values).commit();
  } catch (error) {
    console.warn("[social-distribution] unable to record status", {
      articleId,
      error: error instanceof Error ? error.message : "Unknown Sanity patch error",
    });
  }
}

export async function notifyArticlePublished(
  articleId: string,
): Promise<SocialDistributionDelivery> {
  const client = getClient();
  if (!client) {
    return { status: "failed", error: "Sanity write configuration is unavailable." };
  }

  const article = await client.fetch<PublishedArticle | null>(
    `*[_type == "article" && _id == $articleId][0]{
      _id,
      title,
      standfirst,
      publishedAt,
      "slug": slug.current,
      "featuredImageUrl": featuredImage.asset->url,
      "featuredImageAlt": featuredImage.alt,
      "category": category->title,
      "competition": competition->title,
      "province": province->title,
      doNotPublishToSocial,
      "socialFacebookTeaser": socialDistribution.facebookTeaser,
      "socialInstagramCaption": socialDistribution.instagramCaption,
      "socialHashtags": socialDistribution.hashtags
    }`,
    { articleId },
  );

  if (!article) {
    return { status: "failed", error: `Published article ${articleId} was not found.` };
  }

  if (article.doNotPublishToSocial) {
    await recordStatus(articleId, {
      "socialDistribution.status": "skipped",
      "socialDistribution.lastAttemptAt": new Date().toISOString(),
      "socialDistribution.lastError": "Article opted out of social publishing.",
    });
    return { status: "skipped" };
  }

  const webhookUrl = process.env.SOCIAL_PUBLISHING_WEBHOOK_URL?.trim();
  const webhookSecret = process.env.SOCIAL_PUBLISHING_WEBHOOK_SECRET?.trim();
  const publishedAt = article.publishedAt ?? new Date().toISOString();
  const eventId = `editorial-social:${article._id}:${publishedAt}`;

  if (!webhookUrl) {
    const error = "SOCIAL_PUBLISHING_WEBHOOK_URL is not configured.";
    await recordStatus(articleId, {
      "socialDistribution.status": "failed",
      "socialDistribution.lastEventId": eventId,
      "socialDistribution.lastAttemptAt": new Date().toISOString(),
      "socialDistribution.lastError": error,
    });
    return { status: "failed", eventId, error };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    await recordStatus(articleId, {
      "socialDistribution.status": "queued",
      "socialDistribution.lastEventId": eventId,
      "socialDistribution.lastAttemptAt": new Date().toISOString(),
      "socialDistribution.lastError": null,
    });

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-editorial-event-id": eventId,
        ...(webhookSecret ? { authorization: `Bearer ${webhookSecret}` } : {}),
      },
      body: JSON.stringify({
        event: "editorial.article.published",
        eventId,
        articleId: article._id,
        title: article.title,
        standfirst: article.standfirst,
        publishedAt,
        articleUrl: articleUrl(article.slug),
        featuredImageUrl: article.featuredImageUrl,
        featuredImageAlt: article.featuredImageAlt,
        category: article.category,
        competition: article.competition,
        province: article.province,
        facebook: {
          teaser: article.socialFacebookTeaser?.trim() || defaultFacebookTeaser(article),
        },
        instagram: {
          caption: article.socialInstagramCaption?.trim() || defaultInstagramCaption(article),
          hashtags: article.socialHashtags ?? [],
        },
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = `Social publishing webhook returned ${response.status}.`;
      await recordStatus(articleId, {
        "socialDistribution.status": "failed",
        "socialDistribution.lastError": error,
      });
      return { status: "failed", eventId, error };
    }

    await recordStatus(articleId, {
      "socialDistribution.status": "sent",
      "socialDistribution.lastSentAt": new Date().toISOString(),
      "socialDistribution.lastError": null,
    });
    return { status: "sent", eventId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Social publishing webhook failed.";
    await recordStatus(articleId, {
      "socialDistribution.status": "failed",
      "socialDistribution.lastError": message,
    });
    return { status: "failed", eventId, error: message };
  } finally {
    clearTimeout(timeout);
  }
}
