import React, { useMemo, useState } from "react";
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

type QueueFilter = "all" | "drafts" | "published" | "rejected";

const filterLabels: Array<{ value: QueueFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "drafts", label: "Drafts" },
  { value: "published", label: "Published" },
  { value: "rejected", label: "Rejected" },
];

function matchesFilter(article: ReviewArticle, filter: QueueFilter): boolean {
  if (filter === "all") return true;
  if (filter === "published") return article.workflowStatus === "published";
  if (filter === "rejected") return article.workflowStatus === "rejected";

  return !["published", "rejected"].includes(article.workflowStatus ?? "draft");
}

function formatUpdatedAt(value?: string): string | null {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Dublin",
  }).format(date);
}

export function ReviewQueue({
  articles,
  selectedId,
  isDirty,
  isLoading,
  isSaving,
  onRefresh,
  onSelect,
}: ReviewQueueProps): React.JSX.Element {
  const [filter, setFilter] = useState<QueueFilter>("drafts");
  const [searchTerm, setSearchTerm] = useState("");

  const counts = useMemo(
    () =>
      Object.fromEntries(
        filterLabels.map(({ value }) => [
          value,
          articles.filter((article) => matchesFilter(article, value)).length,
        ]),
      ) as Record<QueueFilter, number>,
    [articles],
  );

  const visibleArticles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return articles.filter((article) => {
      if (!matchesFilter(article, filter)) return false;
      if (!query) return true;

      return [
        article.title,
        article.standfirst,
        displayStatus(article.workflowStatus),
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query));
    });
  }, [articles, filter, searchTerm]);

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
        <strong>Articles ({articles.length})</strong>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading || isSaving}
        >
          Refresh
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gap: "0.65rem",
          padding: "0.75rem",
          borderBottom: "1px solid #ddd",
          background: "#fafafa",
        }}
      >
        <label style={{ display: "grid", gap: "0.3rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>
            Search articles
          </span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
            placeholder="Title, standfirst or status"
            aria-label="Search editorial articles"
            style={{
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: "0.55rem 0.65rem",
              background: "#fff",
            }}
          />
        </label>

        <div
          aria-label="Filter editorial articles"
          style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}
        >
          {filterLabels.map(({ value, label }) => {
            const active = filter === value;

            return (
              <button
                type="button"
                key={value}
                aria-pressed={active}
                onClick={() => setFilter(value)}
                style={{
                  border: active ? "1px solid #227a3b" : "1px solid #ccc",
                  borderRadius: 999,
                  padding: "0.35rem 0.6rem",
                  background: active ? "#e8f5eb" : "#fff",
                  color: active ? "#155c2b" : "inherit",
                  fontSize: "0.75rem",
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                }}
              >
                {label} ({counts[value]})
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? <p style={{ padding: "0.75rem" }}>Loading…</p> : null}

      {!isLoading && articles.length === 0 ? (
        <p style={{ padding: "0.75rem" }}>No articles are currently available.</p>
      ) : null}

      {!isLoading && articles.length > 0 && visibleArticles.length === 0 ? (
        <p style={{ padding: "0.75rem" }}>
          No articles match the current search and filter.
        </p>
      ) : null}

      {visibleArticles.map((article) => {
        const updatedAt = formatUpdatedAt(article.workflowUpdatedAt);

        return (
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
            <strong>{article.title ?? "Untitled article"}</strong>

            <small style={{ textTransform: "capitalize" }}>
              {displayStatus(article.workflowStatus)}
            </small>

            {updatedAt ? (
              <small style={{ color: "#666" }}>Updated {updatedAt}</small>
            ) : null}
          </button>
        );
      })}
    </aside>
  );
}
