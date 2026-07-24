import React, { useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";

type WorkflowHistoryEvent = {
  _key?: string;
  action?: string;
  fromStatus?: string;
  toStatus?: string;
  actor?: string;
  note?: string;
  occurredAt?: string;
};

type SourceRecord = {
  id?: string;
  title?: string;
  publisher?: string;
  url?: string;
  publishedAt?: string;
  isPrimarySource?: boolean;
};

type FactRecord = {
  id?: string;
  claim?: string;
  status?: string;
  confidence?: number;
  sourceIds?: string[];
  notes?: string;
  usableInDraft?: boolean;
};

type ReviewArticle = {
  _id: string;
  title?: string;
  standfirst?: string;
  workflowStatus?: string;
  workflowUpdatedAt?: string;
  rejectionReason?: string;
  rejectionCount?: number;
  replacementRequired?: boolean;
  editorialConfidence?: number;
  needsHumanFactCheck?: boolean;
  editorialAngle?: string;
  audiencePromise?: string;
  sourceRecords?: SourceRecord[];
  factLedger?: {
    facts?: FactRecord[];
    unsupportedClaims?: string[];
    conflicts?: string[];
  };
  workflowHistory?: WorkflowHistoryEvent[];
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  featuredImageCaption?: string;
  featuredImageCredit?: string;
  slug?: string;
};

type EditorialAction = "submit" | "approve" | "reject" | "publish" | "discard";

const QUEUE_QUERY = `*[
  _type == "article" &&
  _id match "drafts.*" &&
  workflowStatus in ["draft", "under-review", "approved", "rejected", "amendment-required"]
] | order(workflowUpdatedAt desc, _updatedAt desc) {
  _id,
  title,
  standfirst,
  workflowStatus,
  workflowUpdatedAt,
  rejectionReason,
  rejectionCount,
  replacementRequired,
  editorialConfidence,
  needsHumanFactCheck,
  editorialAngle,
  audiencePromise,
  sourceRecords,
  factLedger,
  workflowHistory,
  "featuredImageUrl": featuredImage.asset->url,
  "featuredImageAlt": featuredImage.alt,
  "featuredImageCaption": featuredImage.caption,
  "featuredImageCredit": featuredImage.photographer,
  "slug": slug.current
}`;

const actionMap: Record<string, EditorialAction[]> = {
  draft: ["submit", "discard"],
  "amendment-required": ["submit", "discard"],
  "under-review": ["approve", "reject", "discard"],
  approved: ["publish", "reject", "discard"],
  rejected: ["discard"],
};

function normaliseId(id: string) {
  return id.replace(/^drafts\./, "");
}

function displayStatus(status?: string) {
  return (status ?? "draft").replaceAll("-", " ");
}

export function EditorialReviewTool() {
  const client = useClient({ apiVersion: "2025-01-01" });
  const [articles, setArticles] = useState<ReviewArticle[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actor, setActor] = useState("The Rugby Panda editor");
  const [note, setNote] = useState("");
  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const selected = useMemo(() => articles.find((article) => article._id === selectedId) ?? articles[0], [articles, selectedId]);

  async function loadQueue() {
    setIsLoading(true);
    setMessage(null);
    try {
      const result = await client.fetch<ReviewArticle[]>(QUEUE_QUERY);
      setArticles(result);
      setSelectedId((current) => current && result.some((article) => article._id === current) ? current : result[0]?._id ?? null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load the editorial queue.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const savedSecret = window.sessionStorage.getItem("rugby-panda-editorial-secret");
    if (savedSecret) setSecret(savedSecret);
    void loadQueue();
  }, []);

  async function runAction(action: EditorialAction) {
    if (!selected) return;
    if (!secret.trim()) {
      setMessage("Enter the editorial automation secret before using workflow actions.");
      return;
    }
    if (!actor.trim()) {
      setMessage("Enter the editor name or role.");
      return;
    }
    if (action === "reject" && !note.trim()) {
      setMessage("A rejection reason is required so replacement generation can avoid the same angle.");
      return;
    }
    if ((action === "discard" || action === "publish") && !window.confirm(`Confirm ${action} for “${selected.title ?? "this article"}”?`)) return;

    setIsSaving(true);
    setMessage(null);
    window.sessionStorage.setItem("rugby-panda-editorial-secret", secret.trim());

    try {
      const response = await fetch("/api/editorial/workflow", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${secret.trim()}`,
        },
        body: JSON.stringify({
          articleId: normaliseId(selected._id),
          action,
          actor: actor.trim(),
          note: note.trim() || undefined,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? `Workflow action failed with ${response.status}.`);
      setMessage(`${action} completed. Article status: ${payload.status}.`);
      setNote("");
      await loadQueue();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Workflow action failed.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main style={{ padding: "1.5rem", display: "grid", gap: "1rem" }}>
      <header style={{ display: "grid", gap: "0.35rem" }}>
        <h1 style={{ margin: 0 }}>Editorial Review</h1>
        <p style={{ margin: 0, color: "#666", maxWidth: 900 }}>
          Review generated drafts, inspect evidence and imagery, then use the protected editorial workflow to submit, approve, reject, publish or discard.
        </p>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(260px, 360px) minmax(0, 1fr)", gap: "1rem", alignItems: "start" }}>
        <aside style={{ border: "1px solid #ddd", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
          <div style={{ padding: "0.75rem", borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "center" }}>
            <strong>Review queue ({articles.length})</strong>
            <button type="button" onClick={() => loadQueue()} disabled={isLoading || isSaving}>Refresh</button>
          </div>
          {isLoading ? <p style={{ padding: "0.75rem" }}>Loading…</p> : null}
          {!isLoading && articles.length === 0 ? <p style={{ padding: "0.75rem" }}>No drafts currently need review.</p> : null}
          {articles.map((article) => (
            <button
              type="button"
              key={article._id}
              onClick={() => setSelectedId(article._id)}
              style={{
                width: "100%", textAlign: "left", padding: "0.8rem", border: 0, borderBottom: "1px solid #eee",
                background: selected?._id === article._id ? "#f0f0f0" : "#fff", cursor: "pointer", display: "grid", gap: "0.25rem",
              }}
            >
              <strong>{article.title ?? "Untitled draft"}</strong>
              <small style={{ textTransform: "capitalize" }}>{displayStatus(article.workflowStatus)}</small>
              {article.replacementRequired ? <small>Replacement required</small> : null}
            </button>
          ))}
        </aside>

        {selected ? (
          <article style={{ display: "grid", gap: "1rem" }}>
            <section style={{ border: "1px solid #ddd", borderRadius: 10, padding: "1rem", background: "#fff", display: "grid", gap: "0.75rem" }}>
              <div>
                <small style={{ textTransform: "uppercase", letterSpacing: ".05em" }}>{displayStatus(selected.workflowStatus)}</small>
                <h2 style={{ margin: "0.25rem 0" }}>{selected.title}</h2>
                <p style={{ margin: 0 }}>{selected.standfirst}</p>
              </div>
              {selected.featuredImageUrl ? (
                <figure style={{ margin: 0 }}>
                  <img src={selected.featuredImageUrl} alt={selected.featuredImageAlt ?? ""} style={{ width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 8 }} />
                  <figcaption style={{ marginTop: ".35rem", color: "#666" }}>
                    {[selected.featuredImageCaption, selected.featuredImageCredit].filter(Boolean).join(" — ")}
                  </figcaption>
                </figure>
              ) : <p style={{ margin: 0 }}><strong>Image:</strong> No approved featured image assigned.</p>}
              <p style={{ margin: 0 }}><strong>Editorial angle:</strong> {selected.editorialAngle ?? "Not recorded"}</p>
              <p style={{ margin: 0 }}><strong>Audience promise:</strong> {selected.audiencePromise ?? "Not recorded"}</p>
              <p style={{ margin: 0 }}><strong>Confidence:</strong> {selected.editorialConfidence == null ? "Not recorded" : `${Math.round(selected.editorialConfidence * 100)}%`} {selected.needsHumanFactCheck ? "— human fact-check required" : ""}</p>
              <a href={`/intent/edit/id=${selected._id};type=article/`}>Open full article editor</a>
            </section>

            <section style={{ border: "1px solid #ddd", borderRadius: 10, padding: "1rem", background: "#fff" }}>
              <h3 style={{ marginTop: 0 }}>Sources</h3>
              {(selected.sourceRecords ?? []).length === 0 ? <p>No source records stored.</p> : (
                <ol>{selected.sourceRecords?.map((source) => <li key={source.id ?? source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.publisher ?? source.title ?? source.url}</a>{source.isPrimarySource ? " — primary source" : ""}</li>)}</ol>
              )}
            </section>

            <section style={{ border: "1px solid #ddd", borderRadius: 10, padding: "1rem", background: "#fff" }}>
              <h3 style={{ marginTop: 0 }}>Fact ledger</h3>
              {(selected.factLedger?.facts ?? []).length === 0 ? <p>No fact ledger stored.</p> : (
                <div style={{ display: "grid", gap: ".65rem" }}>{selected.factLedger?.facts?.map((fact) => (
                  <div key={fact.id ?? fact.claim} style={{ borderBottom: "1px solid #eee", paddingBottom: ".65rem" }}>
                    <strong>{fact.claim}</strong>
                    <div><small>{fact.status} · {fact.confidence == null ? "no confidence" : `${Math.round(fact.confidence * 100)}%`} · {fact.usableInDraft ? "usable" : "not usable"}</small></div>
                    {fact.notes ? <div>{fact.notes}</div> : null}
                  </div>
                ))}</div>
              )}
              {(selected.factLedger?.unsupportedClaims ?? []).length ? <p><strong>Unsupported claims:</strong> {selected.factLedger?.unsupportedClaims?.join("; ")}</p> : null}
              {(selected.factLedger?.conflicts ?? []).length ? <p><strong>Conflicts:</strong> {selected.factLedger?.conflicts?.join("; ")}</p> : null}
            </section>

            <section style={{ border: "1px solid #ddd", borderRadius: 10, padding: "1rem", background: "#fff" }}>
              <h3 style={{ marginTop: 0 }}>Workflow action</h3>
              <div style={{ display: "grid", gap: ".65rem" }}>
                <label>Editor / actor<input value={actor} onChange={(event) => setActor(event.target.value)} style={{ display: "block", width: "100%", padding: ".55rem", marginTop: ".25rem" }} /></label>
                <label>Editorial automation secret<input type="password" value={secret} onChange={(event) => setSecret(event.target.value)} style={{ display: "block", width: "100%", padding: ".55rem", marginTop: ".25rem" }} /></label>
                <label>Review note / rejection reason<textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} style={{ display: "block", width: "100%", padding: ".55rem", marginTop: ".25rem" }} /></label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
                  {(actionMap[selected.workflowStatus ?? "draft"] ?? []).map((action) => <button type="button" key={action} disabled={isSaving} onClick={() => runAction(action)} style={{ textTransform: "capitalize" }}>{action}</button>)}
                </div>
                {message ? <p style={{ margin: 0 }}>{message}</p> : null}
              </div>
            </section>

            <section style={{ border: "1px solid #ddd", borderRadius: 10, padding: "1rem", background: "#fff" }}>
              <h3 style={{ marginTop: 0 }}>Audit history</h3>
              {(selected.workflowHistory ?? []).length === 0 ? <p>No workflow events recorded.</p> : (
                <ol>{selected.workflowHistory?.slice().reverse().map((event, index) => <li key={event._key ?? `${event.occurredAt}-${index}`}><strong>{event.action}</strong> {event.fromStatus} → {event.toStatus} by {event.actor} {event.occurredAt ? `at ${new Date(event.occurredAt).toLocaleString("en-IE", { timeZone: "Europe/Dublin" })}` : ""}{event.note ? ` — ${event.note}` : ""}</li>)}</ol>
              )}
            </section>
          </article>
        ) : null}
      </section>
    </main>
  );
}
