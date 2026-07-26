type ReviewQueueNotification = {
  articleId: string;
  articleTitle: string;
  actor: string;
  occurredAt: string;
  submissionNote?: string;
};

export type NotificationDelivery = {
  status: "sent" | "skipped" | "failed";
  eventId: string;
  error?: string;
};

const destination = "editor@therugbypanda.ie";
const reviewUrl = "https://therugbypanda.sanity.studio/structure/editorialReview";

function logNotification(
  level: "info" | "warn",
  message: string,
  details: Record<string, unknown>,
) {
  console[level](`[editorial-notification] ${message}`, details);
}

export async function notifyReviewQueue(input: ReviewQueueNotification): Promise<NotificationDelivery> {
  const webhookUrl = process.env.EDITORIAL_NOTIFICATION_WEBHOOK_URL?.trim();
  const webhookSecret = process.env.EDITORIAL_NOTIFICATION_WEBHOOK_SECRET?.trim();
  const eventId = `editorial-review:${input.articleId}:${input.occurredAt}`;

  logNotification("info", "delivery-started", {
    eventId,
    articleId: input.articleId,
    webhookConfigured: Boolean(webhookUrl),
    webhookSecretConfigured: Boolean(webhookSecret),
  });

  if (!webhookUrl) {
    logNotification("warn", "delivery-skipped", {
      eventId,
      articleId: input.articleId,
      reason: "webhook-not-configured",
    });
    return { status: "skipped", eventId };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-editorial-event-id": eventId,
        ...(webhookSecret ? { authorization: `Bearer ${webhookSecret}` } : {}),
      },
      body: JSON.stringify({
        event: "editorial.article.ready_for_review",
        eventId,
        destination,
        articleId: input.articleId,
        articleTitle: input.articleTitle,
        actor: input.actor,
        occurredAt: input.occurredAt,
        submissionNote: input.submissionNote,
        reviewUrl,
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = `Editorial notification webhook returned ${response.status}.`;
      logNotification("warn", "delivery-failed", {
        eventId,
        articleId: input.articleId,
        responseStatus: response.status,
        error,
      });
      return {
        status: "failed",
        eventId,
        error,
      };
    }

    logNotification("info", "delivery-sent", {
      eventId,
      articleId: input.articleId,
      responseStatus: response.status,
    });
    return { status: "sent", eventId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Editorial notification webhook failed.";
    logNotification("warn", "delivery-failed", {
      eventId,
      articleId: input.articleId,
      error: message,
    });
    return {
      status: "failed",
      eventId,
      error: message,
    };
  } finally {
    clearTimeout(timeout);
  }
}
