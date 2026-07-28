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
  reject: "Reject",
  publish: "Publish article",
  unpublish: "Unpublish article",
  reopen: "Reopen as draft",
  archive: "Archive article",
  restore: "Restore to draft",
  discard: "Discard permanently",
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
        <h3 style={{ margin: 0 }}>{isPublished ? "Published article actions" : "Workflow action"}</h3>
        <small style={{ color: "#666" }}>
          Signed in as {actor}. Authentication uses your Sanity Studio session.
        </small>
      </div>

      {showReviewNote ? (
        <label>
          Submission note / rejection reason
          <textarea
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            rows={3}
            placeholder="Add context for the next editorial step. A reason is required when rejecting."
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
            style={action === "unpublish" ? { fontWeight: 700 } : undefined}
          >
            {actionLabels[action]}
          </button>
        ))}
      </div>

      {isPublished ? (
        <small style={{ color: "#666" }}>
          Unpublishing removes the live article and restores it as an editable draft without deleting its content or audit history.
        </small>
      ) : null}

      {message ? <p style={{ margin: 0 }}>{message}</p> : null}
    </section>
  );
}
