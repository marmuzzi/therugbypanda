import React, { useEffect, useMemo, useState } from "react";
import { useClient, type Tool } from "sanity";

import {
  EDITORIAL_API_BASE_URL,
  QUEUE_QUERY,
  actionMap,
  inputStyle,
  cardStyle,
} from "./EditorialReview/constants";

import {
  normaliseId,
  displayStatus,
  displayConfidence,
  countWords,
} from "./EditorialReview/formatting";

import { textToBody } from "./EditorialReview/portableText";

import {
  createEditorialReview,
  articleToEditable,
} from "./EditorialReview/editorialReview";

import { ReviewQueue } from "./EditorialReview/ReviewQueue";
import { EditorialReviewSummary } from "./EditorialReview/EditorialReviewSummary";

import type {
  WorkflowHistoryEvent,
  SourceRecord,
  FactRecord,
  ReviewArticle,
  EditorialAction,
  EditorialReview,
  AiEditorialFinding,
  EditableDraft,
} from "./EditorialReview/types";

export function EditorialReviewTool({ tool: _tool }: { tool: Tool }): React.JSX.Element {
  const client = useClient({ apiVersion: "2025-01-01" });
  const [articles, setArticles] = useState<ReviewArticle[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditableDraft | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [actor, setActor] = useState("The Rugby Panda editor");
  const [note, setNote] = useState("");
  const [secret, setSecret] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [aiFindings, setAiFindings] = useState<AiEditorialFinding[] | null>(null);
  const [isAiReviewing, setIsAiReviewing] = useState(false);

  const selected = useMemo(
    () => articles.find((article) => article._id === selectedId) ?? articles[0],
    [articles, selectedId],
  );

  const availableActions = actionMap[selected?.workflowStatus ?? "draft"] ?? [];
  const needsRejectionReason = availableActions.includes("reject");
  const editorialReview = useMemo(
    () => (selected && draft ? createEditorialReview(selected, draft) : null),
    [selected, draft],
  );

  async function loadQueue(preferredId?: string) {
    setIsLoading(true);
    setMessage(null);
    try {
      const result = await client.fetch<ReviewArticle[]>(QUEUE_QUERY);
      setArticles(result);
      setSelectedId((current) => {
        const candidate = preferredId ?? current;
        return candidate && result.some((article) => article._id === candidate)
          ? candidate
          : (result[0]?._id ?? null);
      });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load the editorial queue.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const savedSecret = window.sessionStorage.getItem(
      "rugby-panda-editorial-secret",
    );
    const savedActor = window.sessionStorage.getItem(
      "rugby-panda-editorial-actor",
    );
    if (savedSecret) setSecret(savedSecret);
    if (savedActor) setActor(savedActor);
    setShowCredentials(!savedSecret);
    void loadQueue();
  }, []);

  useEffect(() => {
    if (!selected) {
      setDraft(null);
      setIsDirty(false);
      setAiFindings(null);
      return;
    }
    setDraft(articleToEditable(selected));
    setIsDirty(false);
    setAiFindings(null);
  }, [selected?._id]);

  function updateDraft(field: keyof EditableDraft, value: string) {
    setDraft((current) => (current ? { ...current, [field]: value } : current));
    setIsDirty(true);
    setAiFindings(null);
  }

  async function runAiReview() {
    if (!selected || !draft) return;
    if (!secret.trim()) {
      setShowCredentials(true);
      setMessage(
        "Workflow authentication is required before running the AI Editorial Review.",
      );
      return;
    }

    setIsAiReviewing(true);
    setMessage(null);
    try {
      const response = await fetch(`${EDITORIAL_API_BASE_URL}/api/editorial/review`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${secret.trim()}`,
        },
        body: JSON.stringify({
          title: draft.title,
          standfirst: draft.standfirst,
          bodyText: draft.bodyText,
          seoTitle: draft.seoTitle,
          seoDescription: draft.seoDescription,
          sourceRecords: selected.sourceRecords ?? [],
          factLedger: {
            facts: selected.factLedger?.facts ?? [],
            unsupportedClaims: selected.factLedger?.unsupportedClaims ?? [],
            conflicts: selected.factLedger?.conflicts ?? [],
          },
        }),
      });
      const payload = (await response.json()) as {
        findings?: AiEditorialFinding[];
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? `AI review failed with ${response.status}.`);
      }
      setAiFindings(payload.findings ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "AI editorial review failed.");
    } finally {
      setIsAiReviewing(false);
    }
  }

  async function saveDraft() {
    if (!selected || !draft) return false;
    if (!draft.title.trim() || !draft.standfirst.trim()) {
      setMessage("Headline and standfirst are required.");
      return false;
    }

    setIsSaving(true);
    setMessage(null);
    try {
      await client
        .patch(selected._id)
        .set({
          title: draft.title.trim(),
          standfirst: draft.standfirst.trim(),
          body: textToBody(draft.bodyText, selected.body),
          seoTitle: draft.seoTitle.trim() || null,
          seoDescription: draft.seoDescription.trim() || null,
          updatedAt: new Date().toISOString(),
        })
        .commit();
      setIsDirty(false);
      setMessage("Draft changes saved in Sanity.");
      await loadQueue(selected._id);
      return true;
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to save the draft.",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (isDirty && !isSaving) void saveDraft();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDirty, isSaving, selected?._id, draft]);

  useEffect(() => {
    function warnBeforeUnload(event: BeforeUnloadEvent) {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [isDirty]);

  async function runAction(action: EditorialAction) {
    if (!selected || !draft) return;
    if (
      (action === "approve" || action === "publish") &&
      editorialReview?.blockingCount
    ) {
      setMessage(
        "Resolve all blocking Editorial Review issues before approval or publication.",
      );
      return;
    }
    if (isDirty && action !== "discard") {
      const saved = await saveDraft();
      if (!saved) return;
    }
    if (!secret.trim()) {
      setShowCredentials(true);
      setMessage(
        "Workflow authentication is required. Open Workflow settings and enter the secret once for this browser session.",
      );
      return;
    }
    if (!actor.trim()) {
      setShowCredentials(true);
      setMessage("Enter the editor name or role in Workflow settings.");
      return;
    }
    if (action === "reject" && !note.trim()) {
      setMessage(
        "A rejection reason is required so replacement generation can avoid the same angle.",
      );
      return;
    }
    if (
      (action === "discard" || action === "publish") &&
      !window.confirm(
        `Confirm ${action} for “${draft?.title || selected.title || "this article"}”?`,
      )
    )
      return;

    setIsSaving(true);
    setMessage(null);
    window.sessionStorage.setItem(
      "rugby-panda-editorial-secret",
      secret.trim(),
    );
    window.sessionStorage.setItem("rugby-panda-editorial-actor", actor.trim());

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
      if (!response.ok)
        throw new Error(
          payload.error ?? `Workflow action failed with ${response.status}.`,
        );
      setMessage(`${action} completed. Article status: ${payload.status}.`);
      setNote("");
      setShowCredentials(false);
      await loadQueue();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Workflow action failed.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main style={{ padding: "1.5rem", display: "grid", gap: "1rem" }}>
      <header style={{ display: "grid", gap: "0.35rem" }}>
        <h1 style={{ margin: 0 }}>Editorial Review</h1>
        <p style={{ margin: 0, color: "#666", maxWidth: 900 }}>
          Edit generated drafts, inspect evidence and imagery, save changes,
          then use the protected editorial workflow.
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(260px, 360px) minmax(0, 1fr)",
          gap: "1rem",
          alignItems: "start",
        }}
      >
        <ReviewQueue
          articles={articles}
          selectedId={selected?._id ?? null}
          isDirty={isDirty}
          isLoading={isLoading}
          isSaving={isSaving}
          onRefresh={() => void loadQueue()}
          onSelect={setSelectedId}
        />

        {selected && draft ? (
          <article style={{ display: "grid", gap: "1rem" }}>
            <section style={{ ...cardStyle, display: "grid", gap: "0.85rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <small
                  style={{ textTransform: "uppercase", letterSpacing: ".05em" }}
                >
                  {displayStatus(selected.workflowStatus)}
                </small>
                <strong style={{ color: isDirty ? "#a15c00" : "#39723b" }}>
                  {isDirty ? "● Unsaved changes" : "Saved"}
                </strong>
              </div>
              <label>
                Headline
                <input
                  value={draft.title}
                  onChange={(event) => updateDraft("title", event.target.value)}
                  spellCheck={true}
                  lang="en-IE"
                  style={inputStyle}
                />
              </label>
              <label>
                Standfirst
                <textarea
                  value={draft.standfirst}
                  onChange={(event) =>
                    updateDraft("standfirst", event.target.value)
                  }
                  rows={3}
                  spellCheck={true}
                  lang="en-IE"
                  style={inputStyle}
                />
              </label>
              <label>
                Article body
                <textarea
                  value={draft.bodyText}
                  onChange={(event) =>
                    updateDraft("bodyText", event.target.value)
                  }
                  rows={18}
                  spellCheck={true}
                  lang="en-IE"
                  style={{
                    ...inputStyle,
                    lineHeight: 1.55,
                    resize: "vertical",
                  }}
                />
              </label>
              <details>
                <summary style={{ cursor: "pointer", fontWeight: 600 }}>
                  SEO
                </summary>
                <div
                  style={{
                    display: "grid",
                    gap: ".75rem",
                    marginTop: ".75rem",
                  }}
                >
                  <label>
                    SEO title
                    <input
                      value={draft.seoTitle}
                      onChange={(event) =>
                        updateDraft("seoTitle", event.target.value)
                      }
                      spellCheck={true}
                      lang="en-IE"
                      style={inputStyle}
                    />
                  </label>
                  <label>
                    SEO description
                    <textarea
                      value={draft.seoDescription}
                      onChange={(event) =>
                        updateDraft("seoDescription", event.target.value)
                      }
                      rows={3}
                      spellCheck={true}
                      lang="en-IE"
                      style={inputStyle}
                    />
                  </label>
                </div>
              </details>
              <div
                style={{
                  display: "flex",
                  gap: ".75rem",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  onClick={() => void saveDraft()}
                  disabled={!isDirty || isSaving}
                >
                  {isSaving ? "Saving…" : "Save draft"}
                </button>
                <small>Keyboard shortcut: Ctrl+S / Cmd+S</small>
                <a
                  href={`/intent/edit/id=${normaliseId(selected._id)};type=article/`}
                >
                  Open full Sanity editor
                </a>
              </div>
            </section>

            <EditorialReviewSummary
              article={selected}
              review={editorialReview}
            />

            <section style={{ ...cardStyle, display: "grid", gap: ".75rem" }}>
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
                    Runs on demand against the current draft and never changes article copy.
                  </small>
                </div>
                <button
                  type="button"
                  onClick={() => void runAiReview()}
                  disabled={isAiReviewing || isSaving}
                >
                  {isAiReviewing ? "Running AI Review…" : "Run AI Review"}
                </button>
              </div>
              {aiFindings === null ? (
                <p style={{ margin: 0 }}>No AI review has been run for the current draft.</p>
              ) : aiFindings.length === 0 ? (
                <p style={{ margin: 0 }}>No AI editorial findings returned.</p>
              ) : (
                (["blocking", "warning", "suggestion"] as const).map((severity) => {
                  const findings = aiFindings.filter((finding) => finding.severity === severity);
                  if (findings.length === 0) return null;
                  return (
                    <div key={severity} style={{ display: "grid", gap: ".5rem" }}>
                      <strong style={{ textTransform: "capitalize" }}>
                        {severity === "suggestion" ? "Suggestions" : `${severity[0].toUpperCase()}${severity.slice(1)}s`} ({findings.length})
                      </strong>
                      <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                        {findings.map((finding, index) => (
                          <li key={`${severity}-${finding.category}-${index}`}>
                            <strong>{finding.category}</strong>: {finding.message}
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

            <section style={{ ...cardStyle, display: "grid", gap: ".75rem" }}>
              {selected.featuredImageUrl ? (
                <figure style={{ margin: 0 }}>
                  <img
                    src={selected.featuredImageUrl}
                    alt={selected.featuredImageAlt ?? ""}
                    style={{
                      width: "100%",
                      maxHeight: 420,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <figcaption style={{ marginTop: ".35rem", color: "#666" }}>
                    {[
                      selected.featuredImageCaption,
                      selected.featuredImageCredit,
                    ]
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
                {selected.editorialAngle ?? "Not recorded"}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Audience promise:</strong>{" "}
                {selected.audiencePromise ?? "Not recorded"}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Confidence:</strong>{" "}
                {displayConfidence(selected.editorialConfidence)}{" "}
                {selected.needsHumanFactCheck
                  ? "— human fact-check required"
                  : ""}
              </p>
            </section>

            <section style={cardStyle}>
              <h3 style={{ marginTop: 0 }}>Sources</h3>
              {(selected.sourceRecords ?? []).length === 0 ? (
                <p>No source records stored.</p>
              ) : (
                <ol>
                  {selected.sourceRecords?.map((source) => (
                    <li key={source.id ?? source.url}>
                      <a href={source.url} target="_blank" rel="noreferrer">
                        {source.publisher ?? source.title ?? source.url}
                      </a>
                      {source.isPrimarySource ? " — primary source" : ""}
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <section style={cardStyle}>
              <h3 style={{ marginTop: 0 }}>Fact ledger</h3>
              {(selected.factLedger?.facts ?? []).length === 0 ? (
                <p>No fact ledger stored.</p>
              ) : (
                <div style={{ display: "grid", gap: ".65rem" }}>
                  {selected.factLedger?.facts?.map((fact) => (
                    <div
                      key={fact.id ?? fact.claim}
                      style={{
                        borderBottom: "1px solid #eee",
                        paddingBottom: ".65rem",
                      }}
                    >
                      <strong>{fact.claim}</strong>
                      <div>
                        <small>
                          {fact.status} · {displayConfidence(fact.confidence)} ·{" "}
                          {fact.usableInDraft ? "usable" : "not usable"}
                        </small>
                      </div>
                      {fact.notes ? <div>{fact.notes}</div> : null}
                    </div>
                  ))}
                </div>
              )}
              {(selected.factLedger?.unsupportedClaims ?? []).length ? (
                <p>
                  <strong>Unsupported claims:</strong>{" "}
                  {selected.factLedger?.unsupportedClaims?.join("; ")}
                </p>
              ) : null}
              {(selected.factLedger?.conflicts ?? []).length ? (
                <p>
                  <strong>Conflicts:</strong>{" "}
                  {selected.factLedger?.conflicts?.join("; ")}
                </p>
              ) : null}
            </section>

            <section style={{ ...cardStyle, display: "grid", gap: ".75rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <h3 style={{ margin: 0 }}>Workflow action</h3>
                <button
                  type="button"
                  onClick={() => setShowCredentials((current) => !current)}
                >
                  {showCredentials
                    ? "Hide workflow settings"
                    : secret
                      ? "Change workflow settings"
                      : "Set up workflow"}
                </button>
              </div>

              {showCredentials ? (
                <div
                  style={{
                    display: "grid",
                    gap: ".65rem",
                    padding: ".75rem",
                    background: "#f7f7f7",
                    borderRadius: 8,
                  }}
                >
                  <label>
                    Editor / actor
                    <input
                      value={actor}
                      onChange={(event) => setActor(event.target.value)}
                      style={inputStyle}
                    />
                  </label>
                  <label>
                    Workflow authentication
                    <input
                      type="password"
                      value={secret}
                      onChange={(event) => setSecret(event.target.value)}
                      autoComplete="off"
                      style={inputStyle}
                    />
                  </label>
                  <small style={{ color: "#666" }}>
                    Stored only in this browser tab session and hidden after a
                    successful workflow action.
                  </small>
                </div>
              ) : secret ? (
                <small style={{ color: "#39723b" }}>
                  Workflow authentication is configured for this session.
                </small>
              ) : null}

              {needsRejectionReason ? (
                <label>
                  Review note / rejection reason
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={3}
                    style={inputStyle}
                  />
                </label>
              ) : null}

              <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
                {availableActions.map((action) => (
                  <button
                    type="button"
                    key={action}
                    disabled={
                      isSaving ||
                      ((action === "approve" || action === "publish") &&
                        Boolean(editorialReview?.blockingCount))
                    }
                    onClick={() => void runAction(action)}
                    style={{ textTransform: "capitalize" }}
                  >
                    {action}
                  </button>
                ))}
              </div>
              {message ? <p style={{ margin: 0 }}>{message}</p> : null}
            </section>

            <section style={cardStyle}>
              <h3 style={{ marginTop: 0 }}>Audit history</h3>
              {(selected.workflowHistory ?? []).length === 0 ? (
                <p>No workflow events recorded.</p>
              ) : (
                <ol>
                  {selected.workflowHistory
                    ?.slice()
                    .reverse()
                    .map((event, index) => (
                      <li key={event._key ?? `${event.occurredAt}-${index}`}>
                        <strong>{event.action}</strong> {event.fromStatus} →{" "}
                        {event.toStatus} by {event.actor}{" "}
                        {event.occurredAt
                          ? `at ${new Date(event.occurredAt).toLocaleString("en-IE", { timeZone: "Europe/Dublin" })}`
                          : ""}
                        {event.note ? ` — ${event.note}` : ""}
                      </li>
                    ))}
                </ol>
              )}
            </section>
          </article>
        ) : null}
      </section>
    </main>
  );
}
