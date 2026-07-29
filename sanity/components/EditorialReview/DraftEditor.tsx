import React from "react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { IntentLink } from "sanity/router";

import { cardStyle, inputStyle } from "./constants";
import { displayStatus, normaliseId } from "./formatting";
import { MetadataPanel } from "./MetadataPanel";

import type { EditableDraft, ReviewArticle } from "./types";

type DraftEditorProps = {
  article: ReviewArticle;
  draft: EditableDraft;
  isDirty: boolean;
  isSaving: boolean;
  onChange: (field: keyof EditableDraft, value: string) => void;
  onSave: () => void;
};

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p style={{ margin: "0 0 1rem", lineHeight: 1.75, fontSize: "1.05rem" }}>{children}</p>,
    h1: ({ children }) => <h1>{children}</h1>,
    h2: ({ children }) => <h2 style={{ margin: "1.4rem 0 .65rem", fontWeight: 900 }}>{children}</h2>,
    h3: ({ children }) => <h3 style={{ margin: "1.2rem 0 .55rem", fontWeight: 900 }}>{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote style={{ margin: "1rem 0", paddingLeft: "1rem", borderLeft: "4px solid #2E7D32", fontStyle: "italic" }}>
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong style={{ fontWeight: 900, color: "#111" }}>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <u>{children}</u>,
    link: ({ children, value }) => (
      <a href={typeof value?.href === "string" ? value.href : undefined} target="_blank" rel="noreferrer">
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => <ul style={{ margin: "0 0 1rem", paddingLeft: "1.5rem" }}>{children}</ul>,
    number: ({ children }) => <ol style={{ margin: "0 0 1rem", paddingLeft: "1.5rem" }}>{children}</ol>,
  },
};

export function DraftEditor({
  article,
  draft,
  isDirty,
  isSaving,
  onChange,
  onSave,
}: DraftEditorProps): React.JSX.Element {
  return (
    <>
      <section style={{ ...cardStyle, display: "grid", gap: "0.85rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <small style={{ textTransform: "uppercase", letterSpacing: ".05em" }}>
            {displayStatus(article.workflowStatus)}
          </small>

          <strong style={{ color: isDirty ? "#a15c00" : "#39723b" }}>
            {isDirty ? "● Unsaved changes" : "Saved"}
          </strong>
        </div>

        <div
          style={{
            display: "grid",
            gap: ".45rem",
            padding: "1rem",
            borderRadius: 10,
            border: "1px solid #b7d7b9",
            background: "#f3faf4",
          }}
        >
          <strong>Full article editor</strong>
          <p style={{ margin: 0, color: "#4b5f4d", lineHeight: 1.5 }}>
            Use Sanity&apos;s full Portable Text editor for the article body, headings, bold text, links, lists and images.
          </p>
          <div>
            <IntentLink
              intent="edit"
              params={{ id: normaliseId(article._id), type: "article" }}
              style={{
                display: "inline-block",
                marginTop: ".35rem",
                padding: ".65rem .9rem",
                borderRadius: 8,
                background: "#2E7D32",
                color: "#fff",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Open full Sanity editor
            </IntentLink>
          </div>
        </div>

        <label>
          Headline
          <input
            value={draft.title}
            onChange={(event) => onChange("title", event.target.value)}
            spellCheck={true}
            lang="en-IE"
            style={inputStyle}
          />
        </label>

        <label>
          Standfirst
          <textarea
            value={draft.standfirst}
            onChange={(event) => onChange("standfirst", event.target.value)}
            rows={3}
            spellCheck={true}
            lang="en-IE"
            style={inputStyle}
          />
        </label>

        <div style={{ display: "grid", gap: ".5rem" }}>
          <strong>Formatted article preview</strong>
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: "1rem 1.1rem",
              background: "#fff",
              minHeight: 160,
            }}
          >
            {article.body?.length ? (
              <PortableText value={article.body as any} components={portableTextComponents} />
            ) : (
              <p style={{ margin: 0, color: "#666" }}>No article body is available.</p>
            )}
          </div>
          <small style={{ color: "#666" }}>
            This preview reflects the stored Portable Text. Open the full editor above to change article formatting and structure.
          </small>
        </div>

        <details>
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>SEO</summary>
          <div style={{ display: "grid", gap: ".75rem", marginTop: ".75rem" }}>
            <label>
              SEO title
              <input
                value={draft.seoTitle}
                onChange={(event) => onChange("seoTitle", event.target.value)}
                spellCheck={true}
                lang="en-IE"
                style={inputStyle}
              />
            </label>

            <label>
              SEO description
              <textarea
                value={draft.seoDescription}
                onChange={(event) => onChange("seoDescription", event.target.value)}
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
          <button type="button" onClick={onSave} disabled={!isDirty || isSaving}>
            {isSaving ? "Saving…" : "Save headline and metadata"}
          </button>

          <small>Keyboard shortcut: Ctrl+S / Cmd+S</small>
        </div>
      </section>

      <MetadataPanel article={article} isSaving={isSaving} />
    </>
  );
}
