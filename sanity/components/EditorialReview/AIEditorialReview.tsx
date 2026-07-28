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

function riskLabel(value: AiEditorialVoiceAssessment["aiLikeness"]): string {
  if (value === "high") return "High — publication blocked";
  if (value === "moderate") return "Moderate — rewrite required";
  return "Low — editorial checks still required";
}

function riskStyle(value: AiEditorialVoiceAssessment["aiLikeness"]): React.CSSProperties {
  if (value === "high") return { color: "#8b1e1e", background: "#fff0f0", borderColor: "#d99" };
  if (value === "moderate") return { color: "#7a4b00", background: "#fff8dd", borderColor: "#d9b85f" };
  return { color: "#245b2a", background: "#eef8ef", borderColor: "#9bc39f" };
}

export function AIEditorialReview({
  findings,
  voiceAssessment,
  isReviewing,
  isSaving,
  isStale,
  onRunReview,
}: AIEditorialReviewProps): React.JSX.Element {
  const blockingCount = findings?.filter((finding) => finding.severity === "blocking").length ?? 0;
  const warningCount = findings?.filter((finding) => finding.severity === "warning").length ?? 0;

  return (
    <section className="editorial-ai-card" style={{ ...cardStyle, display: "grid", gap: ".85rem" }}>
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
          <h3 style={{ margin: 0 }}>Publication Risk Review</h3>

          <small style={{ color: "#666" }}>
            A deliberately conservative quality gate for factual support, readability, formulaic phrasing and Rugby Panda voice. It does not prove who wrote the copy.
          </small>
        </div>

        <button
          type="button"
          onClick={onRunReview}
          disabled={isReviewing || isSaving}
        >
          {isReviewing
            ? "Running Publication Review…"
            : isStale
              ? "Run Review Again"
              : "Run Publication Review"}
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
          <strong>Out of date:</strong> the article has changed since this review was generated. Publication remains blocked until the review is run again.
        </p>
      ) : null}

      {voiceAssessment ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: ".75rem",
            padding: ".85rem",
            border: "1px solid",
            borderRadius: 8,
            ...riskStyle(voiceAssessment.aiLikeness),
          }}
        >
          <div>
            <small style={{ display: "block", opacity: 0.75 }}>Publication risk</small>
            <strong style={{ fontSize: "1.05rem" }}>{riskLabel(voiceAssessment.aiLikeness)}</strong>
          </div>
          <div>
            <small style={{ display: "block", opacity: 0.75 }}>Rugby Panda tone</small>
            <strong>{labelValue(voiceAssessment.rugbyPandaTone)}</strong>
          </div>
          <div>
            <small style={{ display: "block", opacity: 0.75 }}>Gate findings</small>
            <strong>{blockingCount} blocking · {warningCount} warnings</strong>
          </div>
          <p style={{ gridColumn: "1 / -1", margin: 0 }}>
            {voiceAssessment.explanation}
          </p>
        </div>
      ) : null}

      {findings === null ? (
        <p style={{ margin: 0, padding: ".75rem", border: "1px solid #d9b85f", borderRadius: 6, background: "#fff8dd" }}>
          <strong>Publication review required.</strong> No current risk assessment exists for this draft.
        </p>
      ) : findings.length === 0 ? (
        <p style={{ margin: 0 }}>No publication-risk findings returned. Human editorial judgement is still required.</p>
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

              <ul style={{ margin: 0, paddingLeft: "1.25rem", display: "grid", gap: ".45rem" }}>
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
