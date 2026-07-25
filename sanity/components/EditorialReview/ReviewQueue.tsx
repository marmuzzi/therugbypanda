import { displayStatus } from "./formatting";

import type { ReviewArticle } from "./types";

type ReviewQueueProps = {
  articles: ReviewArticle[];
  selectedId: string | null;
  isDirty: boolean;
  isLoading: boolean;
  isSaving: boolean;
  onRefresh: () => void;
  onSelect: (articleId: string) => void;
};

export function ReviewQueue({
  articles,
  selectedId,
  isDirty,
  isLoading,
  isSaving,
  onRefresh,
  onSelect,
}: ReviewQueueProps): React.JSX.Element {
  return (
    <aside
      style={{
        border: "1px solid #ddd",
        borderRadius: 10,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <div
        style={{
          padding: "0.75rem",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        <strong>Review queue ({articles.length})</strong>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading || isSaving}
        >
          Refresh
        </button>
      </div>

      {isLoading ? <p style={{ padding: "0.75rem" }}>Loading…</p> : null}

      {!isLoading && articles.length === 0 ? (
        <p style={{ padding: "0.75rem" }}>
          No drafts currently need review.
        </p>
      ) : null}

      {articles.map((article) => (
        <button
          type="button"
          key={article._id}
          onClick={() => {
            if (
              isDirty &&
              !window.confirm(
                "Discard unsaved changes and open another article?",
              )
            ) {
              return;
            }

            onSelect(article._id);
          }}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "0.8rem",
            border: 0,
            borderBottom: "1px solid #eee",
            background: selectedId === article._id ? "#f0f0f0" : "#fff",
            cursor: "pointer",
            display: "grid",
            gap: "0.25rem",
          }}
        >
          <strong>{article.title ?? "Untitled draft"}</strong>

          <small style={{ textTransform: "capitalize" }}>
            {displayStatus(article.workflowStatus)}
          </small>

          {article.replacementRequired ? (
            <small>Replacement required</small>
          ) : null}
        </button>
      ))}
    </aside>
  );
}
