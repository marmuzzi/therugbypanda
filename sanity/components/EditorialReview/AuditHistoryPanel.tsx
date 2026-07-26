import React from "react";

import { cardStyle } from "./constants";

import type { ReviewArticle } from "./types";

type AuditHistoryPanelProps = {
  article: ReviewArticle;
};

export function AuditHistoryPanel({
  article,
}: AuditHistoryPanelProps): React.JSX.Element {
  return (
    <section style={cardStyle}>
      <h3 style={{ marginTop: 0 }}>Audit history</h3>

      {(article.workflowHistory ?? []).length === 0 ? (
        <p>No workflow events recorded.</p>
      ) : (
        <ol>
          {article.workflowHistory
            ?.slice()
            .reverse()
            .map((event, index) => (
              <li key={event._key ?? `${event.occurredAt}-${index}`}>
                <strong>{event.action}</strong> {event.fromStatus} →{" "}
                {event.toStatus} by {event.actor}{" "}
                {event.occurredAt
                  ? `at ${new Date(event.occurredAt).toLocaleString("en-IE", { timeZone: "Europe/Dublin" })}`
                  : ""}
                {event.note ? ` — ${event.note}` : ""}
              </li>
            ))}
        </ol>
      )}
    </section>
  );
}
