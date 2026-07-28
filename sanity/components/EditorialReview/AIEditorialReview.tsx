import React from "react";

import { cardStyle } from "./constants";

import type {
  AiEditorialFinding,
  AiEditorialVoiceAssessment,
} from "./types";

type AIEditorialReviewProps = {
  findings: AiEditorialFinding[] | null;
  voiceAssessment: AiEditorialVoiceAssessment | null;
  isReviewing: boolean;
  isSaving: boolean;
  isStale: boolean;
  onRunReview: () => void;
};

const severities = ["blocking", "warning", "suggestion"] as const;

function labelValue(value: string): string {
  return value
    .split("-")
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
    .join(" ");
}

export function AIEditorialReview({
  findings,
  voiceAssessment,
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
            Reviews accuracy, editorial quality, AI-like phrasing and Rugby Panda tone. It never changes article copy.
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

      {voiceAssessment ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: ".75rem",
            padding: ".75rem",
            border: "1px solid #ddd",
            borderRadius: 6,
          }}
        >
          <div>
            <small style={{ display: "block", color: "#666" }}>AI-likeness</small>
            <strong>{labelValue(voiceAssessment.aiLikeness)}</strong>
          </div>
          <div>
            <small style={{ display: "block", color: "#666" }}>Rugby Panda tone</small>
            <strong>{labelValue(voiceAssessment.rugbyPandaTone)}</strong>
          </div>
          <p style={{ gridColumn: "1 / -1", margin: 0 }}>
            {voiceAssessment.explanation}
          </p>
        </div>
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
                    <strong>{labelValue(finding.category)}</strong>: {finding.message}
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
