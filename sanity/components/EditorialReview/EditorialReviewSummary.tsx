import React from "react";

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

export function EditorialReviewSummary({
  article,
  review,
}: EditorialReviewSummaryProps): React.JSX.Element {
  return (
    <section style={{ ...cardStyle, display: "grid", gap: ".75rem" }}>
      <h3 style={{ margin: 0 }}>Editorial Review</h3>

      {review ? (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: ".65rem",
            }}
          >
            <strong>Quality score: {review.score}/100</strong>
            <strong>Readiness: {review.readiness}</strong>
            <span>Words: {review.wordCount}</span>
            <span>Blocking: {review.blockingCount}</span>
            <span>Warnings: {review.warningCount}</span>
            <span>
              Confidence: {displayConfidence(article.editorialConfidence)}
            </span>
          </div>

          {review.issues.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
              {review.issues.map((issue) => (
                <li key={issue.id}>
                  <strong>{issue.severity}</strong> · {issue.category}:{" "}
                  {issue.message}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0 }}>
              No local editorial issues found.
            </p>
          )}
        </>
      ) : null}
    </section>
  );
}
