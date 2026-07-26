import React from "react";

import { cardStyle } from "./constants";
import { displayConfidence } from "./formatting";

import type { ReviewArticle } from "./types";

type FeaturedImagePanelProps = {
  article: ReviewArticle;
};

export function FeaturedImagePanel({
  article,
}: FeaturedImagePanelProps): React.JSX.Element {
  return (
    <section style={{ ...cardStyle, display: "grid", gap: ".75rem" }}>
      {article.featuredImageUrl ? (
        <figure style={{ margin: 0 }}>
          <img
            src={article.featuredImageUrl}
            alt={article.featuredImageAlt ?? ""}
            style={{
              width: "100%",
              maxHeight: 420,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
          <figcaption style={{ marginTop: ".35rem", color: "#666" }}>
            {[article.featuredImageCaption, article.featuredImageCredit]
              .filter(Boolean)
              .join(" — ")}
          </figcaption>
        </figure>
      ) : (
        <p style={{ margin: 0 }}>
          <strong>Image:</strong> No approved featured image assigned.
        </p>
      )}

      <p style={{ margin: 0 }}>
        <strong>Editorial angle:</strong>{" "}
        {article.editorialAngle ?? "Not recorded"}
      </p>

      <p style={{ margin: 0 }}>
        <strong>Audience promise:</strong>{" "}
        {article.audiencePromise ?? "Not recorded"}
      </p>

      <p style={{ margin: 0 }}>
        <strong>Confidence:</strong>{" "}
        {displayConfidence(article.editorialConfidence)}{" "}
        {article.needsHumanFactCheck ? "— human fact-check required" : ""}
      </p>
    </section>
  );
}
