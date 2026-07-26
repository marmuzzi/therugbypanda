import React from "react";

import { cardStyle } from "./constants";

import type { AiEditorialFinding } from "./types";

type AIEditorialReviewProps = {
  findings: AiEditorialFinding[] | null;
  isReviewing: boolean;
  isSaving: boolean;
  isStale: boolean;
  onRunReview: () => void;
};

const severities = ["blocking", "warning", "suggestion"] as const;

export function AIEditorialReview({
  findings,
  isReviewing,
  isSaving,
  isStale,
  onRunReview,
}: AIEditorialReviewProps): React.JSX.Element {
  return (
    <section className="editorial-ai-card" style={{ ...cardStyle, display: "grid", gap: ".75rem" }}>
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
            Runs on demand against the current draft and never changes article copy.
          </small>
        </div>

        <button
          type="button"
          onClick={onRunReview}
          disabled={isReviewing || isSaving}
        >
          {isReviewing
            ? "Running AI Review…"
            : isStale
              ? "Run Review Again"
              : "Run AI Review"}
        </button>
      </div>

      {isStale ? (
        <p
          role="status"
          style={{
            margin: 0,
            padding: ".65rem .75rem",
            border: "1px solid #d7a900",
            borderRadius: 6,
            background: "#fff8d6",
          }}
        >
          <strong>Out of date:</strong> the article has changed since this AI review was generated. The findings remain visible for reference; run the review again to refresh them.
        </p>
      ) : null}

      {findings === null ? (
        <p style={{ margin: 0 }}>No AI review has been run for the current draft.</p>
      ) : findings.length === 0 ? (
        <p style={{ margin: 0 }}>No AI editorial findings returned.</p>
      ) : (
        severities.map((severity) => {
          const severityFindings = findings.filter((finding) => finding.severity === severity);
          if (severityFindings.length === 0) return null;

          const heading = severity === "suggestion"
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
                    {finding.excerpt ? ` Excerpt: “${finding.excerpt}”` : ""}
                    {finding.recommendation ? ` Recommendation: ${finding.recommendation}` : ""}
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
