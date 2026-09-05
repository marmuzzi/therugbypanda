import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

type SocialArticle = {
  _id: string;
  slug?: string;
  instagramPostId?: string;
  instagramCommentId?: string;
  facebookPostId?: string;
};

export type SocialLifecycleResult = {
  status: "completed" | "partial" | "skipped";
  instagram?: { status: "deleted" | "commented" | "skipped" | "failed"; id?: string; error?: string };
  facebook?: { status: "deleted" | "skipped" | "failed"; id?: string; error?: string };
};

const INSTAGRAM_GRAPH_BASE = "https://graph.instagram.com";
const FACEBOOK_GRAPH_BASE = "https://graph.facebook.com/v26.0";

function getClient() {
  const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_AUTH_TOKEN;
  if (!projectId || !dataset || !token) return null;
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
}

function normaliseId(value: string) {
  return value.replace(/^drafts\./, "");
}

function articleUrl(slug?: string) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://therugbypanda.ie").replace(/\/$/, "");
  return slug ? `${siteUrl}/articles/${slug}` : siteUrl;
}

async function readArticle(articleId: string) {
  const client = getClient();
  if (!client) return null;
  const publishedId = normaliseId(articleId);
  const draftId = `drafts.${publishedId}`;
  return client.fetch<SocialArticle | null>(
    `*[_type == "article" && _id in [$draftId, $publishedId]][0]{
      _id,
      "slug": slug.current,
      "instagramPostId": socialDistribution.instagramPostId,
      "instagramCommentId": socialDistribution.instagramFirstCommentId,
      "facebookPostId": socialDistribution.facebookPostId
    }`,
    { draftId, publishedId },
  );
}

async function graphRequest(
  base: string,
  path: string,
  method: "POST" | "DELETE",
  fields: Record<string, string>,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const suffix = method === "DELETE" ? `?${new URLSearchParams(fields)}` : "";
    const response = await fetch(`${base}/${path.replace(/^\//, "")}${suffix}`, {
      method,
      headers: method === "POST" ? { "content-type": "application/x-www-form-urlencoded" } : undefined,
      body: method === "POST" ? new URLSearchParams(fields) : undefined,
      cache: "no-store",
      signal: controller.signal,
    });
    const payload = (await response.json().catch(() => ({}))) as {
      id?: string;
      success?: boolean;
      error?: { message?: string };
    };
    if (!response.ok || (method === "POST" && !payload.id) || (method === "DELETE" && payload.success !== true)) {
      throw new Error(payload.error?.message?.trim() || `HTTP ${response.status}`);
    }
    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

export async function ensureInstagramFirstComment(articleId: string, postId?: string) {
  const client = getClient();
  const article = await readArticle(articleId);
  const targetPostId = postId ?? article?.instagramPostId;
  if (!client || !article || !targetPostId) return { status: "skipped" as const };
  if (article.instagramCommentId) {
    return { status: "skipped" as const, id: article.instagramCommentId };
  }

  const accessToken = process.env.META_INSTAGRAM_ACCESS_TOKEN?.trim();
  if (!accessToken) return { status: "failed" as const, error: "Instagram production credentials are not configured." };

  try {
    const payload = await graphRequest(INSTAGRAM_GRAPH_BASE, `${targetPostId}/comments`, "POST", {
      message: articleUrl(article.slug),
      access_token: accessToken,
    });
    const commentId = payload.id!;
    await client.patch(article._id).set({
      "socialDistribution.instagramFirstCommentId": commentId,
      "socialDistribution.instagramFirstCommentAt": new Date().toISOString(),
    }).commit();
    return { status: "commented" as const, id: commentId };
  } catch (error) {
    return {
      status: "failed" as const,
      error: error instanceof Error ? error.message : "Instagram first comment failed.",
    };
  }
}

export async function removeArticleFromSocial(articleId: string): Promise<SocialLifecycleResult> {
  const client = getClient();
  const article = await readArticle(articleId);
  if (!client || !article) return { status: "skipped" };

  const instagramToken = process.env.META_INSTAGRAM_ACCESS_TOKEN?.trim();
  const facebookToken = process.env.META_FACEBOOK_PAGE_ACCESS_TOKEN?.trim();

  let instagram: SocialLifecycleResult["instagram"] = { status: "skipped" };
  let facebook: SocialLifecycleResult["facebook"] = { status: "skipped" };

  if (article.instagramPostId) {
    if (!instagramToken) {
      instagram = { status: "failed", id: article.instagramPostId, error: "Instagram production credentials are not configured." };
    } else {
      try {
        await graphRequest(INSTAGRAM_GRAPH_BASE, article.instagramPostId, "DELETE", { access_token: instagramToken });
        instagram = { status: "deleted", id: article.instagramPostId };
      } catch (error) {
        instagram = {
          status: "failed",
          id: article.instagramPostId,
          error: error instanceof Error ? error.message : "Instagram deletion failed.",
        };
      }
    }
  }

  if (article.facebookPostId) {
    if (!facebookToken) {
      facebook = { status: "failed", id: article.facebookPostId, error: "Facebook production credentials are not configured." };
    } else {
      try {
        await graphRequest(FACEBOOK_GRAPH_BASE, article.facebookPostId, "DELETE", { access_token: facebookToken });
        facebook = { status: "deleted", id: article.facebookPostId };
      } catch (error) {
        facebook = {
          status: "failed",
          id: article.facebookPostId,
          error: error instanceof Error ? error.message : "Facebook deletion failed.",
        };
      }
    }
  }

  const failures = [instagram, facebook].filter((result) => result?.status === "failed");
  const deleted = [instagram, facebook].filter((result) => result?.status === "deleted");
  const values: Record<string, unknown> = {
    "socialDistribution.status": failures.length ? "cleanup-failed" : "unpublished",
    "socialDistribution.lastAttemptAt": new Date().toISOString(),
    "socialDistribution.lastError": failures.length
      ? failures.map((result) => result?.error).filter(Boolean).join(" | ")
      : null,
  };
  if (instagram.status === "deleted") {
    values["socialDistribution.instagramPostId"] = null;
    values["socialDistribution.instagramFirstCommentId"] = null;
  }
  if (facebook.status === "deleted") values["socialDistribution.facebookPostId"] = null;
  await client.patch(article._id).set(values).commit().catch(() => undefined);

  console.log(JSON.stringify({
    level: failures.length ? "warning" : "info",
    message: "Social unpublish cleanup completed",
    articleId: normaliseId(articleId),
    instagram,
    facebook,
  }));

  return {
    status: failures.length ? "partial" : deleted.length ? "completed" : "skipped",
    instagram,
    facebook,
  };
}
