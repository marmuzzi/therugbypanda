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
  const instagram = await notifyArticlePublishedToInstagram(articleId);
  const facebook = await notifyArticlePublishedToFacebook(articleId);

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

  return {
    status: overallStatus,
    sentCount,
    failedCount,
    skippedCount,
    instagram,
    facebook,
  };
}
