import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

export type EditorialAction = "submit" | "approve" | "reject" | "publish" | "discard";

type WorkflowInput = {
  articleId: string;
  action: EditorialAction;
  actor: string;
  note?: string;
};

type ArticleState = {
  _id: string;
  workflowStatus?: string;
};

const transitions: Record<EditorialAction, { from: string[]; to: string }> = {
  submit: { from: ["draft", "amendment-required"], to: "under-review" },
  approve: { from: ["under-review"], to: "approved" },
  reject: { from: ["under-review", "approved"], to: "rejected" },
  publish: { from: ["approved"], to: "published" },
  discard: { from: ["draft", "under-review", "approved", "rejected", "amendment-required"], to: "discarded" },
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

export async function applyEditorialAction(input: WorkflowInput) {
  if (!input.actor?.trim()) throw new Error("actor is required");

  const writeClient = getClient();
  const publishedId = normaliseId(input.articleId);
  const draftId = `drafts.${publishedId}`;
  const article = await writeClient.fetch<ArticleState | null>(
    `*[_type == "article" && _id in [$draftId, $publishedId]][0]{_id, workflowStatus}`,
    { draftId, publishedId },
  );

  if (!article) throw new Error(`Article ${input.articleId} was not found.`);

  const current = article.workflowStatus ?? (article._id.startsWith("drafts.") ? "draft" : "published");
  const transition = transitions[input.action];
  if (!transition.from.includes(current)) throw new Error(`Cannot ${input.action} an article in ${current} status.`);

  const now = new Date().toISOString();
  const event = {
    _key: crypto.randomUUID().replaceAll("-", "").slice(0, 12),
    _type: "object",
    action: input.action,
    fromStatus: current,
    toStatus: transition.to,
    actor: input.actor.trim(),
    note: input.note?.trim() || undefined,
    occurredAt: now,
  };

  if (input.action === "publish") {
    const draft = await writeClient.getDocument(draftId);
    if (!draft) throw new Error("The approved draft no longer exists.");
    const published = { ...draft, _id: publishedId, workflowStatus: "published", workflowUpdatedAt: now, publishedAt: now };
    delete (published as { _rev?: string })._rev;
    await writeClient.transaction().createOrReplace(published).delete(draftId).commit();
  } else if (input.action === "discard") {
    await writeClient.delete(article._id);
  } else {
    const patch = writeClient
      .patch(article._id)
      .set({ workflowStatus: transition.to, workflowUpdatedAt: now })
      .setIfMissing({ workflowHistory: [] })
      .append("workflowHistory", [event]);

    if (input.action === "reject") {
      patch
        .set({ rejectionReason: input.note?.trim() || "Rejected by editor", replacementRequired: true })
        .setIfMissing({ rejectionCount: 0 })
        .inc({ rejectionCount: 1 });
    }
    await patch.commit();
  }

  return {
    articleId: publishedId,
    previousStatus: current,
    status: transition.to,
    action: input.action,
    replacementRequired: input.action === "reject",
  };
}
