import { useState } from "react";
import { useClient, type DocumentActionComponent, type DocumentActionProps } from "sanity";

const EDITORIAL_API_BASE_URL = "https://therugbypanda.ie";

type StudioTokenClient = {
  getToken?: () => Promise<string | undefined>;
  config: () => { token?: string };
};

type WorkflowAction = "publish" | "unpublish";

function normaliseId(value: string) {
  return value.replace(/^drafts\./, "");
}

function createControlledAction(action: WorkflowAction): DocumentActionComponent {
  return function ControlledArticleWorkflowAction(props: DocumentActionProps) {
    const studioClient = useClient({ apiVersion: "2025-01-01" });
    const [busy, setBusy] = useState(false);

    const hasDraft = Boolean(props.draft);
    const hasPublished = Boolean(props.published);
    if (props.type !== "article") return null;
    if (action === "publish" && !hasDraft) return null;
    if (action === "unpublish" && !hasPublished) return null;

    async function getStudioToken() {
      const tokenClient = studioClient as unknown as StudioTokenClient;
      const token = tokenClient.getToken
        ? await tokenClient.getToken()
        : tokenClient.config().token;
      if (!token) throw new Error("Your Sanity Studio session could not be authenticated. Sign in again and retry.");
      return token;
    }

    async function run() {
      if (busy) return;
      if (action === "publish") {
        const title = String((props.draft ?? props.published)?.title ?? "this article");
        if (!window.confirm(`Publish “${title}” and run post-publication social distribution?`)) return;
      }

      setBusy(true);
      try {
        const token = await getStudioToken();
        const response = await fetch(`${EDITORIAL_API_BASE_URL}/api/editorial/workflow`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            articleId: normaliseId(props.id),
            action,
          }),
        });
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        if (!response.ok) throw new Error(payload.error ?? `${action} failed with ${response.status}.`);
        props.onComplete();
      } catch (error) {
        window.alert(error instanceof Error ? error.message : `${action} failed.`);
      } finally {
        setBusy(false);
      }
    }

    return {
      label: busy ? (action === "publish" ? "Publishing…" : "Unpublishing…") : action === "publish" ? "Publish" : "Unpublish",
      tone: action === "unpublish" ? "critical" : "positive",
      disabled: busy,
      onHandle: () => void run(),
    };
  };
}

export const ControlledArticlePublishAction = createControlledAction("publish");
export const ControlledArticleUnpublishAction = createControlledAction("unpublish");
