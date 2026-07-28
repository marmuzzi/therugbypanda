import React from "react";

import { cardStyle, inputStyle } from "./constants";

import type { EditorialAction, EditorialReview } from "./types";

type WorkflowPanelProps = {
  actor: string;
  note: string;
  showReviewNote: boolean;
  availableActions: EditorialAction[];
  editorialReview: EditorialReview | null;
  isSaving: boolean;
  message: string | null;
  onNoteChange: (value: string) => void;
  onRunAction: (action: EditorialAction) => void;
};

const actionLabels: Record<EditorialAction, string> = {
  submit: "Submit",
  approve: "Approve",
  reject: "Reject article",
  publish: "Publish article",
  unpublish: "Move back to drafts",
  reopen: "Move back to drafts",
  archive: "Archive article",
  restore: "Move back to drafts",
  discard: "Remove article",
};

export function WorkflowPanel({
  actor,
  note,
  showReviewNote,
  availableActions,
  editorialReview,
  isSaving,
  message,
  onNoteChange,
  onRunAction,
}: WorkflowPanelProps): React.JSX.Element {
  const isPublished = availableActions.includes("unpublish");

  return (
    <section style={{ ...cardStyle, display: "grid", gap: ".75rem" }}>
      <div style={{ display: "grid", gap: ".2rem" }}>
        <h3 style={{ margin: 0 }}>{isPublished ? "Published article actions" : "Article actions"}</h3>
        <small style={{ color: "#666" }}>
          Signed in as {actor}. Authentication uses your Sanity Studio session.
        </small>
      </div>

      {showReviewNote ? (
        <label>
          Rejection reason
          <textarea
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            rows={3}
            placeholder="A reason is required when rejecting an article."
            style={inputStyle}
          />
        </label>
      ) : null}

      <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
        {availableActions.map((action) => (
          <button
            type="button"
            key={action}
            disabled={
              isSaving ||
              ((action === "approve" || action === "publish") &&
                Boolean(editorialReview?.blockingCount))
            }
            onClick={() => onRunAction(action)}
            style={action === "unpublish" || action === "publish" ? { fontWeight: 700 } : undefined}
          >
            {actionLabels[action]}
          </button>
        ))}
      </div>

      {isPublished ? (
        <small style={{ color: "#666" }}>
          Moving an article back to drafts removes it from the public website and keeps its content and audit history editable.
        </small>
      ) : null}

      {message ? <p style={{ margin: 0 }}>{message}</p> : null}
    </section>
  );
}
