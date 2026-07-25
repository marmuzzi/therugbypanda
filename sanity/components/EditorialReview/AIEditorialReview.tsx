import React from "react";

import { cardStyle } from "./constants";

import type { AiEditorialFinding } from "./types";

type AIEditorialReviewProps = {
  findings: AiEditorialFinding[] | null;
  isReviewing: boolean;
  isSaving: boolean;
  onRunReview: () => void;
};

const severities = ["blocking", "warning", "suggestion"] as const;

export function AIEditorialReview({
  findings,
  isReviewing,
  isSaving,
  onRunReview,
}: AIEditorialReviewProps): React.JSX.Element {
  return (
    <section style={{ ...cardStyle, display: "grid", gap: ".75rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: ".75rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>AI Editorial Review</h3>

          <small style={{ color: "#666" }}>
            Runs on demand against the current draft and never changes article
            copy.
          </small>
        </div>

        <button
          type="button"
          onClick={onRunReview}
          disabled={isReviewing || isSaving}
        >
          {isReviewing ? "Running AI Review…" : "Run AI Review"}
        </button>
      </div>

      {findings === null ? (
        <p style={{ margin: 0 }}>
          No AI review has been run for the current draft.
        </p>
      ) : findings.length === 0 ? (
        <p style={{ margin: 0 }}>No AI editorial findings returned.</p>
      ) : (
        severities.map((severity) => {
          const severityFindings = findings.filter(
            (finding) => finding.severity === severity,
          );

          if (severityFindings.length === 0) return null;

          const heading =
            severity === "suggestion"
              ? "Suggestions"
              : `${severity[0].toUpperCase()}${severity.slice(1)}s`;

          return (
            <div key={severity} style={{ display: "grid", gap: ".5rem" }}>
              <strong style={{ textTransform: "capitalize" }}>
                {heading} ({severityFindings.length})
              </strong>

              <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                {severityFindings.map((finding, index) => (
                  <li key={`${severity}-${finding.category}-${index}`}>
                    <strong>{finding.category}</strong>: {finding.message}
                    {finding.excerpt
                      ? ` Excerpt: “${finding.excerpt}”`
                      : ""}
                    {finding.recommendation
                      ? ` Recommendation: ${finding.recommendation}`
                      : ""}
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      )}
    </section>
  );
}
