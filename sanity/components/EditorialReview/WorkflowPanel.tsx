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
  return (
    <section style={{ ...cardStyle, display: "grid", gap: ".75rem" }}>
      <div style={{ display: "grid", gap: ".2rem" }}>
        <h3 style={{ margin: 0 }}>Workflow action</h3>
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
            style={{ textTransform: "capitalize" }}
          >
            {action}
          </button>
        ))}
      </div>

      {message ? <p style={{ margin: 0 }}>{message}</p> : null}
    </section>
  );
}
