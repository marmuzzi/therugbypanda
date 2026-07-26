import React, { useCallback, useEffect, useState } from "react";
import type { Tool } from "sanity";
import { useClient } from "sanity";

type DashboardMetrics = {
  totalArticles: number;
  publishedArticles: number;
  reviewQueue: number;
  rejectedArticles: number;
  replacementRequired: number;
  publishedThisMonth: number;
  publishedToday: number;
  originalPhotoArticles: number;
  competitionsCovered: number;
};

type RecentArticle = {
  _id: string;
  title: string;
  workflowStatus?: string;
  publishedAt?: string;
  category?: string;
  competition?: string;
};

const query = `{
  "totalArticles": count(*[_type == "article" && !(_id in path("drafts.**"))]),
  "publishedArticles": count(*[_type == "article" && !(_id in path("drafts.**")) && workflowStatus == "published"]),
  "reviewQueue": count(*[_type == "article" && workflowStatus in ["submitted", "in-review", "review"]]),
  "rejectedArticles": count(*[_type == "article" && workflowStatus == "rejected"]),
  "replacementRequired": count(*[_type == "article" && replacementRequired == true]),
  "publishedThisMonth": count(*[_type == "article" && workflowStatus == "published" && publishedAt >= $monthStart]),
  "publishedToday": count(*[_type == "article" && workflowStatus == "published" && publishedAt >= $dayStart]),
  "originalPhotoArticles": count(*[_type == "article" && workflowStatus == "published" && featuredImage.source match "*Rugby Panda*"]),
  "competitionsCovered": count(array::unique(*[_type == "article" && workflowStatus == "published" && defined(competition._ref)].competition._ref)),
  "recent": *[_type == "article"] | order(_updatedAt desc)[0...8] {
    _id,
    title,
    workflowStatus,
    publishedAt,
    "category": category->title,
    "competition": competition->title
  }
}`;

function startOfDayIso() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

function startOfMonthIso() {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

const cardStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid #d8e2dc",
  borderRadius: 12,
  padding: 18,
  boxShadow: "0 4px 14px rgba(0, 61, 43, 0.06)",
};

export function NewsroomDashboardTool(_props: { tool: Tool }) {
  const client = useClient({ apiVersion: "2026-07-26" });
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recent, setRecent] = useState<RecentArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await client.fetch<DashboardMetrics & { recent: RecentArticle[] }>(query, {
        dayStart: startOfDayIso(),
        monthStart: startOfMonthIso(),
      });
      const { recent: recentArticles, ...metricValues } = result;
      setMetrics(metricValues);
      setRecent(recentArticles);
      setUpdatedAt(new Date());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load newsroom metrics.");
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    void load();
  }, [load]);

  const cards = metrics
    ? [
        ["Published today", metrics.publishedToday],
        ["In review", metrics.reviewQueue],
        ["Published this month", metrics.publishedThisMonth],
        ["All published", metrics.publishedArticles],
        ["Original-photo stories", metrics.originalPhotoArticles],
        ["Competitions covered", metrics.competitionsCovered],
        ["Replacement required", metrics.replacementRequired],
        ["Rejected", metrics.rejectedArticles],
      ]
    : [];

  return (
    <main style={{ minHeight: "100%", background: "#f5f8f6", padding: 24, color: "#13231d" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <header style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "#005c2f", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".12em", fontSize: 12 }}>The Rugby Panda</p>
            <h1 style={{ margin: "4px 0 0", fontSize: 32, color: "#003d2b" }}>Newsroom Dashboard</h1>
            <p style={{ margin: "6px 0 0", color: "#51645b" }}>Editorial operations and accreditation evidence from Sanity.</p>
          </div>
          <button type="button" onClick={() => void load()} disabled={loading} style={{ border: 0, borderRadius: 8, background: "#003d2b", color: "white", padding: "11px 16px", fontWeight: 700, cursor: loading ? "wait" : "pointer" }}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </header>

        {error ? <div style={{ ...cardStyle, borderColor: "#b42318", color: "#b42318", marginBottom: 18 }}>{error}</div> : null}

        <section aria-label="Newsroom metrics" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 22 }}>
          {cards.map(([label, value]) => (
            <article key={String(label)} style={cardStyle}>
              <p style={{ margin: 0, color: "#627269", fontSize: 13, fontWeight: 700 }}>{label}</p>
              <p style={{ margin: "8px 0 0", fontSize: 34, lineHeight: 1, fontWeight: 900, color: "#003d2b" }}>{value}</p>
            </article>
          ))}
        </section>

        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            <h2 style={{ margin: 0, color: "#003d2b" }}>Recent editorial activity</h2>
            <small style={{ color: "#6b7a72" }}>{updatedAt ? `Updated ${updatedAt.toLocaleTimeString()}` : ""}</small>
          </div>
          <div style={{ overflowX: "auto", marginTop: 14 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
              <thead>
                <tr>
                  {["Article", "Status", "Category", "Competition", "Publication"].map((heading) => (
                    <th key={heading} style={{ textAlign: "left", padding: "10px 8px", borderBottom: "2px solid #d8e2dc", color: "#51645b", fontSize: 12, textTransform: "uppercase", letterSpacing: ".08em" }}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((article) => (
                  <tr key={article._id}>
                    <td style={{ padding: "12px 8px", borderBottom: "1px solid #e5ebe7", fontWeight: 700 }}>{article.title}</td>
                    <td style={{ padding: "12px 8px", borderBottom: "1px solid #e5ebe7" }}>{article.workflowStatus ?? "Not set"}</td>
                    <td style={{ padding: "12px 8px", borderBottom: "1px solid #e5ebe7" }}>{article.category ?? "—"}</td>
                    <td style={{ padding: "12px 8px", borderBottom: "1px solid #e5ebe7" }}>{article.competition ?? "—"}</td>
                    <td style={{ padding: "12px 8px", borderBottom: "1px solid #e5ebe7" }}>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-IE") : "—"}</td>
                  </tr>
                ))}
                {!loading && recent.length === 0 ? <tr><td colSpan={5} style={{ padding: 18, color: "#6b7a72" }}>No article activity found.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
