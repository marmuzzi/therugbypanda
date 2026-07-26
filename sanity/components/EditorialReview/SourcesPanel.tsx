import React from "react";

import { cardStyle } from "./constants";

import type { ReviewArticle } from "./types";

type SourcesPanelProps = {
  article: ReviewArticle;
};

export function SourcesPanel({
  article,
}: SourcesPanelProps): React.JSX.Element {
  return (
    <section style={cardStyle}>
      <h3 style={{ marginTop: 0 }}>Sources</h3>

      {(article.sourceRecords ?? []).length === 0 ? (
        <p>No source records stored.</p>
      ) : (
        <ol>
          {article.sourceRecords?.map((source) => (
            <li key={source.id ?? source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                {source.publisher ?? source.title ?? source.url}
              </a>
              {source.isPrimarySource ? " — primary source" : ""}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
