type DraftCreatedNotification = {
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
  technicalAlertStatus?: "sent" | "skipped" | "failed";
};

type TechnicalAlertInput = {
  sourceEventId: string;
  articleId: string;
  articleTitle: string;
  occurredAt: string;
  failureType: "webhook-not-configured" | "webhook-response-error" | "webhook-request-error";
  failureMessage: string;
  responseStatus?: number;
};

const destination = "editor@therugbypanda.ie";
const technicalDestination = "admin@therugbypanda.ie";
const studioBaseUrl = "https://therugbypanda.sanity.studio";

function buildDraftUrl(articleId: string) {
  const documentId = articleId.replace(/^drafts\./, "");
  const intent = new URL(`${studioBaseUrl}/intent/edit`);
  intent.searchParams.set("id", documentId);
  intent.searchParams.set("type", "article");
  return intent.toString();
}

function logNotification(
  level: "info" | "warn",
  message: string,
  details: Record<string, unknown>,
) {
  console[level](`[editorial-notification] ${message}`, details);
}

async function notifyTechnicalFailure(
  input: TechnicalAlertInput,
): Promise<"sent" | "skipped" | "failed"> {
  const webhookUrl = process.env.EDITORIAL_TECHNICAL_ALERT_WEBHOOK_URL?.trim();
  const webhookSecret = process.env.EDITORIAL_TECHNICAL_ALERT_WEBHOOK_SECRET?.trim();
  const eventId = `editorial-technical-alert:${input.sourceEventId}`;

  if (!webhookUrl) {
    logNotification("warn", "technical-alert-skipped", {
      eventId,
      sourceEventId: input.sourceEventId,
      articleId: input.articleId,
      reason: "technical-alert-webhook-not-configured",
    });
    return "skipped";
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
        event: "editorial.notification.delivery_failed",
        eventId,
        sourceEventId: input.sourceEventId,
        destination: technicalDestination,
        articleId: input.articleId,
        articleTitle: input.articleTitle,
        occurredAt: input.occurredAt,
        failureType: input.failureType,
        failureMessage: input.failureMessage,
        responseStatus: input.responseStatus,
        reviewUrl: buildDraftUrl(input.articleId),
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      logNotification("warn", "technical-alert-failed", {
        eventId,
        sourceEventId: input.sourceEventId,
        articleId: input.articleId,
        responseStatus: response.status,
      });
      return "failed";
    }

    logNotification("info", "technical-alert-sent", {
      eventId,
      sourceEventId: input.sourceEventId,
      articleId: input.articleId,
      responseStatus: response.status,
    });
    return "sent";
  } catch (error) {
    logNotification("warn", "technical-alert-failed", {
      eventId,
      sourceEventId: input.sourceEventId,
      articleId: input.articleId,
      error: error instanceof Error ? error.message : "Technical alert webhook failed.",
    });
    return "failed";
  } finally {
    clearTimeout(timeout);
  }
}

export async function notifyDraftCreated(input: DraftCreatedNotification): Promise<NotificationDelivery> {
  const webhookUrl = process.env.EDITORIAL_NOTIFICATION_WEBHOOK_URL?.trim();
  const webhookSecret = process.env.EDITORIAL_NOTIFICATION_WEBHOOK_SECRET?.trim();
  const eventId = `editorial-draft:${input.articleId}:${input.occurredAt}`;

  logNotification("info", "delivery-started", {
    eventId,
    articleId: input.articleId,
    webhookConfigured: Boolean(webhookUrl),
    webhookSecretConfigured: Boolean(webhookSecret),
  });

  if (!webhookUrl) {
    const error = "Editorial notification webhook is not configured.";
    logNotification("warn", "delivery-skipped", {
      eventId,
      articleId: input.articleId,
      reason: "webhook-not-configured",
    });
    const technicalAlertStatus = await notifyTechnicalFailure({
      sourceEventId: eventId,
      articleId: input.articleId,
      articleTitle: input.articleTitle,
      occurredAt: input.occurredAt,
      failureType: "webhook-not-configured",
      failureMessage: error,
    });
    return { status: "skipped", eventId, error, technicalAlertStatus };
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
        event: "editorial.article.draft_created",
        eventId,
        destination,
        articleId: input.articleId,
        articleTitle: input.articleTitle,
        actor: input.actor,
        occurredAt: input.occurredAt,
        submissionNote: input.submissionNote,
        reviewUrl: buildDraftUrl(input.articleId),
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
      const technicalAlertStatus = await notifyTechnicalFailure({
        sourceEventId: eventId,
        articleId: input.articleId,
        articleTitle: input.articleTitle,
        occurredAt: input.occurredAt,
        failureType: "webhook-response-error",
        failureMessage: error,
        responseStatus: response.status,
      });
      return { status: "failed", eventId, error, technicalAlertStatus };
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
    const technicalAlertStatus = await notifyTechnicalFailure({
      sourceEventId: eventId,
      articleId: input.articleId,
      articleTitle: input.articleTitle,
      occurredAt: input.occurredAt,
      failureType: "webhook-request-error",
      failureMessage: message,
    });
    return { status: "failed", eventId, error: message, technicalAlertStatus };
  } finally {
    clearTimeout(timeout);
  }
}
