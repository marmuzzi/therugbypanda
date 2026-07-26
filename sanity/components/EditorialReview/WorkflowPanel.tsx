import React from "react";

import { cardStyle, inputStyle } from "./constants";

import type { EditorialAction, EditorialReview } from "./types";

type WorkflowPanelProps = {
  actor: string;
  note: string;
  secret: string;
  showCredentials: boolean;
  needsRejectionReason: boolean;
  availableActions: EditorialAction[];
  editorialReview: EditorialReview | null;
  isSaving: boolean;
  message: string | null;
  onActorChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onSecretChange: (value: string) => void;
  onToggleCredentials: () => void;
  onRunAction: (action: EditorialAction) => void;
};

export function WorkflowPanel({
  actor,
  note,
  secret,
  showCredentials,
  needsRejectionReason,
  availableActions,
  editorialReview,
  isSaving,
  message,
  onActorChange,
  onNoteChange,
  onSecretChange,
  onToggleCredentials,
  onRunAction,
}: WorkflowPanelProps): React.JSX.Element {
  return (
    <section style={{ ...cardStyle, display: "grid", gap: ".75rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <h3 style={{ margin: 0 }}>Workflow action</h3>
        <button type="button" onClick={onToggleCredentials}>
          {showCredentials
            ? "Hide workflow settings"
            : secret
              ? "Change workflow settings"
              : "Set up workflow"}
        </button>
      </div>

      {showCredentials ? (
        <div
          style={{
            display: "grid",
            gap: ".65rem",
            padding: ".75rem",
            background: "#f7f7f7",
            borderRadius: 8,
          }}
        >
          <label>
            Editor / actor
            <input
              value={actor}
              onChange={(event) => onActorChange(event.target.value)}
              style={inputStyle}
            />
          </label>
          <label>
            Workflow authentication
            <input
              type="password"
              value={secret}
              onChange={(event) => onSecretChange(event.target.value)}
              autoComplete="off"
              style={inputStyle}
            />
          </label>
          <small style={{ color: "#666" }}>
            Stored only in this browser tab session and hidden after a successful
            workflow action.
          </small>
        </div>
      ) : secret ? (
        <small style={{ color: "#39723b" }}>
          Workflow authentication is configured for this session.
        </small>
      ) : null}

      {needsRejectionReason ? (
        <label>
          Review note / rejection reason
          <textarea
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            rows={3}
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
