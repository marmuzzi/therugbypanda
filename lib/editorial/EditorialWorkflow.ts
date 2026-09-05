import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

export type EditorialAction =
  | "submit"
  | "approve"
  | "reject"
  | "publish"
  | "unpublish"
  | "reopen"
  | "archive"
  | "restore"
  | "discard";

type WorkflowInput = {
  articleId: string;
  action: EditorialAction;
  actor: string;
  note?: string;
};

type ArticleState = {
  _id: string;
  title?: string;
  workflowStatus?: string;
};

const transitions: Record<EditorialAction, { from: string[]; to: string }> = {
  submit: { from: ["draft", "amendment-required"], to: "draft" },
  approve: { from: ["under-review", "approved"], to: "draft" },
  reject: {
    from: ["draft", "under-review", "approved", "amendment-required", "published"],
    to: "rejected",
  },
  publish: {
    from: ["draft", "under-review", "approved", "amendment-required", "rejected"],
    to: "published",
  },
  unpublish: { from: ["published"], to: "draft" },
  reopen: { from: ["rejected", "archived"], to: "draft" },
  archive: { from: ["draft", "rejected", "published"], to: "archived" },
  restore: { from: ["archived"], to: "draft" },
  discard: {
    from: [
      "draft",
      "under-review",
      "approved",
      "published",
      "rejected",
      "amendment-required",
      "archived",
    ],
    to: "discarded",
  },
};

function getClient() {
  const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_AUTH_TOKEN;
  if (!projectId || !dataset) throw new Error("Sanity project configuration is missing.");
  if (!token) throw new Error("SANITY_API_TOKEN or SANITY_AUTH_TOKEN is not configured.");
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
}

function normaliseId(value: string) {
  return value.replace(/^drafts\./, "");
}

function workflowEvent(input: WorkflowInput, fromStatus: string, toStatus: string, now: string) {
  return {
    _key: crypto.randomUUID().replaceAll("-", "").slice(0, 12),
    _type: "object",
    action: input.action,
    fromStatus,
    toStatus,
    actor: input.actor.trim(),
    note: input.note?.trim() || undefined,
    occurredAt: now,
  };
}

export async function applyEditorialAction(input: WorkflowInput) {
  if (!input.actor?.trim()) throw new Error("actor is required");

  const writeClient = getClient();
  const publishedId = normaliseId(input.articleId);
  const draftId = `drafts.${publishedId}`;
  const articles = await writeClient.fetch<ArticleState[]>(
    `*[_type == "article" && _id in [$draftId, $publishedId]]{_id, title, workflowStatus}`,
    { draftId, publishedId },
  );
  const article =
    articles.find((candidate) => candidate._id === draftId) ??
    articles.find((candidate) => candidate._id === publishedId) ??
    null;

  if (!article) throw new Error(`Article ${input.articleId} was not found.`);

  const current = article.workflowStatus ?? (article._id.startsWith("drafts.") ? "draft" : "published");
  const transition = transitions[input.action];
  if (!transition.from.includes(current)) {
    throw new Error(`Cannot ${input.action} an article in ${current} status.`);
  }

  const now = new Date().toISOString();
  const event = workflowEvent(input, current, transition.to, now);

  if (input.action === "publish") {
    const source =
      (await writeClient.getDocument(draftId)) ?? (await writeClient.getDocument(publishedId));
    if (!source) throw new Error("The article document no longer exists.");

    const history = Array.isArray(source.workflowHistory)
      ? [...source.workflowHistory, event]
      : [event];
    const published = {
      ...source,
      _id: publishedId,
      workflowStatus: "published",
      workflowUpdatedAt: now,
      publishedAt: source.publishedAt ?? now,
      replacementRequired: false,
      workflowHistory: history,
    };
    delete (published as { _rev?: string })._rev;

    const transaction = writeClient.transaction().createOrReplace(published);
    if (await writeClient.getDocument(draftId)) transaction.delete(draftId);
    await transaction.commit();
  } else if (input.action === "unpublish") {
    const published = await writeClient.getDocument(publishedId);
    if (!published) throw new Error("The published article no longer exists.");

    const history = Array.isArray(published.workflowHistory)
      ? [...published.workflowHistory, event]
      : [event];
    const draft = {
      ...published,
      _id: draftId,
      workflowStatus: "draft",
      workflowUpdatedAt: now,
      replacementRequired: false,
      workflowHistory: history,
    };
    // A later republish is a new publication event. This produces fresh provider
    // idempotency keys after the old social posts have been removed.
    delete (draft as { _rev?: string })._rev;
    delete (draft as { publishedAt?: string }).publishedAt;
    await writeClient.transaction().createOrReplace(draft).delete(publishedId).commit();
  } else if (input.action === "discard") {
    const transaction = writeClient.transaction();
    if (await writeClient.getDocument(draftId)) transaction.delete(draftId);
    if (await writeClient.getDocument(publishedId)) transaction.delete(publishedId);
    await transaction.commit();
  } else {
    const patch = writeClient
      .patch(article._id)
      .set({ workflowStatus: transition.to, workflowUpdatedAt: now })
      .setIfMissing({ workflowHistory: [] })
      .append("workflowHistory", [event]);

    if (input.action === "reject") {
      patch
        .set({
          rejectionReason: input.note?.trim() || "Rejected by editor",
          replacementRequired: true,
        })
        .setIfMissing({ rejectionCount: 0 })
        .inc({ rejectionCount: 1 });
    }

    if (["reopen", "restore", "submit", "approve"].includes(input.action)) {
      patch.set({ replacementRequired: false });
    }

    await patch.commit();
  }

  return {
    articleId: publishedId,
    articleTitle: article.title?.trim() || "Untitled article",
    previousStatus: current,
    status: transition.to,
    action: input.action,
    replacementRequired: input.action === "reject",
  };
}
