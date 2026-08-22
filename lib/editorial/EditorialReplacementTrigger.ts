export type EditorialReplacementRequest = {
  articleId: string;
  actor: string;
  note?: string;
  requestedAt: string;
};

export type EditorialReplacementTriggerResult =
  | { status: "requested"; endpoint: "configured" }
  | { status: "not-configured"; endpoint: "missing" };

/**
 * Emit a rejection replacement request to the persistent orchestrator.
 *
 * The workflow route deliberately does not invent a replacement story itself: acquisition
 * must choose a genuinely different angle/source set before /api/editorial/replacement is
 * called. This event is the immediate bridge between the editor's rejection and that
 * acquisition step.
 */
export async function requestEditorialReplacement(
  request: EditorialReplacementRequest,
): Promise<EditorialReplacementTriggerResult> {
  const endpoint = process.env.EDITORIAL_REPLACEMENT_WEBHOOK_URL?.trim();
  if (!endpoint) {
    console.error("Editorial replacement trigger is not configured", {
      articleId: request.articleId,
      requestedAt: request.requestedAt,
    });
    return { status: "not-configured", endpoint: "missing" };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventType: "editorial.article.rejected.replacement-requested",
      eventId: `replacement-request:${request.articleId}:${request.requestedAt}`,
      ...request,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Replacement acquisition trigger failed (${response.status})${detail ? `: ${detail.slice(0, 240)}` : ""}`,
    );
  }

  return { status: "requested", endpoint: "configured" };
}
