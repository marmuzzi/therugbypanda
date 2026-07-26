import React from "react";

import "../../styles/editorial-review-mobile.css";
import { cardStyle } from "./constants";
import { displayConfidence } from "./formatting";

import type {
  EditorialReview,
  ReviewArticle,
} from "./types";

type EditorialReviewSummaryProps = {
  article: ReviewArticle;
  review: EditorialReview | null;
};

function scorePresentation(score: number) {
  if (score >= 85) return { label: "Excellent", background: "#d1fae5", foreground: "#065f46" };
  if (score >= 70) return { label: "Good", background: "#dcfce7", foreground: "#166534" };
  if (score >= 55) return { label: "Needs work", background: "#fef3c7", foreground: "#92400e" };
  return { label: "Not ready", background: "#fee2e2", foreground: "#991b1b" };
}

function scoreStars(score: number) {
  const filled = Math.max(1, Math.min(5, Math.round(score / 20)));
  return `${"★".repeat(filled)}${"☆".repeat(5 - filled)}`;
}

export function EditorialReviewSummary({
  article,
  review,
}: EditorialReviewSummaryProps): React.JSX.Element {
  const presentation = review ? scorePresentation(review.score) : null;

  return (
    <section className="editorial-quality-card" style={{ ...cardStyle, display: "grid", gap: ".75rem" }}>
      <h3 style={{ margin: 0 }}>Article quality</h3>

      {review && presentation ? (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(145px, auto) minmax(0, 1fr)",
              gap: ".75rem",
              alignItems: "center",
            }}
          >
            <div
              aria-label={`Quality score ${review.score} out of 100, ${presentation.label}`}
              style={{
                borderRadius: 10,
                padding: ".8rem 1rem",
                background: presentation.background,
                color: presentation.foreground,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.65rem", fontWeight: 800 }}>{review.score}/100</div>
              <div style={{ fontSize: "1.15rem", letterSpacing: ".08em" }}>{scoreStars(review.score)}</div>
              <strong>{presentation.label}</strong>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: ".5rem",
              }}
            >
              <strong>Readiness: {review.readiness}</strong>
              <span>Words: {review.wordCount}</span>
              <span>Blocking: {review.blockingCount}</span>
              <span>Warnings: {review.warningCount}</span>
              <span>Confidence: {displayConfidence(article.editorialConfidence)}</span>
            </div>
          </div>

          {review.issues.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
              {review.issues.map((issue) => (
                <li key={issue.id}>
                  <strong>{issue.severity}</strong> · {issue.category}: {issue.message}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0 }}>No local editorial issues found.</p>
          )}
        </>
      ) : null}
    </section>
  );
}
