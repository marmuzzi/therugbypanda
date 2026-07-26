type ReviewQueueNotification = {
  articleId: string;
  actor: string;
  occurredAt: string;
};

export type NotificationDelivery = {
  status: "sent" | "skipped";
  eventId: string;
};

const destination = "editor@therugbypanda.ie";

export async function notifyReviewQueue(input: ReviewQueueNotification): Promise<NotificationDelivery> {
  const webhookUrl = process.env.EDITORIAL_NOTIFICATION_WEBHOOK_URL?.trim();
  const webhookSecret = process.env.EDITORIAL_NOTIFICATION_WEBHOOK_SECRET?.trim();
  const eventId = `editorial-review:${input.articleId}:${input.occurredAt}`;

  if (!webhookUrl) {
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
        actor: input.actor,
        occurredAt: input.occurredAt,
        reviewUrl: "https://therugbypanda.ie/studio/structure/editorialReview",
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Editorial notification webhook returned ${response.status}.`);
    }

    return { status: "sent", eventId };
  } finally {
    clearTimeout(timeout);
  }
}
