import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import { notifyArticlePublishedToFacebook } from "@/lib/editorial/FacebookSocialDistribution";
import { notifyArticlePublishedToInstagram } from "@/lib/editorial/InstagramSocialDistribution";

function getClient() {
  const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_AUTH_TOKEN;
  if (!projectId || !dataset || !token) return null;
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false });
}

export async function notifyArticlePublishedToSocial(articleId: string) {
  console.log(JSON.stringify({
    level: "info",
    message: "Social distribution started",
    articleId,
    instagramEnabled: process.env.META_INSTAGRAM_PUBLISH_ENABLED === "true",
    facebookEnabled: process.env.META_FACEBOOK_PUBLISH_ENABLED === "true",
    instagramCredentialsConfigured: Boolean(
      process.env.META_INSTAGRAM_ACCESS_TOKEN?.trim() && process.env.META_INSTAGRAM_ACCOUNT_ID?.trim(),
    ),
    facebookCredentialsConfigured: Boolean(
      process.env.META_FACEBOOK_PAGE_ACCESS_TOKEN?.trim() && process.env.META_FACEBOOK_PAGE_ID?.trim(),
    ),
  }));

  const instagram = await notifyArticlePublishedToInstagram(articleId);
  console.log(JSON.stringify({
    level: instagram.status === "failed" ? "error" : "info",
    message: "Instagram distribution completed",
    articleId,
    status: instagram.status,
    eventId: instagram.eventId,
    postId: instagram.postId,
    error: instagram.error,
  }));

  const facebook = await notifyArticlePublishedToFacebook(articleId);
  console.log(JSON.stringify({
    level: facebook.status === "failed" ? "error" : "info",
    message: "Facebook distribution completed",
    articleId,
    status: facebook.status,
    eventId: facebook.eventId,
    postId: facebook.postId,
    error: facebook.error,
  }));

  const sentCount = [instagram, facebook].filter((result) => result.status === "sent").length;
  const failedCount = [instagram, facebook].filter((result) => result.status === "failed").length;
  const skippedCount = [instagram, facebook].filter((result) => result.status === "skipped").length;

  const overallStatus =
    sentCount === 2
      ? "sent"
      : sentCount === 1
        ? "partially-sent"
        : failedCount > 0
          ? "failed"
          : "skipped";

  const errors = [
    instagram.error ? `Instagram: ${instagram.error}` : null,
    facebook.error ? `Facebook: ${facebook.error}` : null,
  ].filter(Boolean);

  const client = getClient();
  if (client) {
    const values: Record<string, unknown> = {
      "socialDistribution.status": overallStatus,
      "socialDistribution.lastAttemptAt": new Date().toISOString(),
      "socialDistribution.lastError": errors.length ? errors.join(" | ") : null,
    };
    if (sentCount > 0) values["socialDistribution.lastSentAt"] = new Date().toISOString();
    await client.patch(articleId).set(values).commit().catch(() => undefined);
  }

  console.log(JSON.stringify({
    level: overallStatus === "failed" || overallStatus === "partially-sent" ? "warning" : "info",
    message: "Social distribution finished",
    articleId,
    status: overallStatus,
    sentCount,
    failedCount,
    skippedCount,
  }));

  return {
    status: overallStatus,
    sentCount,
    failedCount,
    skippedCount,
    instagram,
    facebook,
  };
}
