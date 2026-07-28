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
    normal: ({ children }) => <p style={{ margin: "0 0 1rem", lineHeight: 1.65 }}>{children}</p>,
    h1: ({ children }) => <h1>{children}</h1>,
    h2: ({ children }) => <h2 style={{ margin: "1.4rem 0 .65rem" }}>{children}</h2>,
    h3: ({ children }) => <h3 style={{ margin: "1.2rem 0 .55rem" }}>{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote style={{ margin: "1rem 0", paddingLeft: "1rem", borderLeft: "4px solid #bbb" }}>
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
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
            Bold, italic, headings, quotes, lists and links are rendered here exactly from Portable Text.
          </small>
        </div>

        <label>
          Plain-text body editor
          <textarea
            value={draft.bodyText}
            onChange={(event) => onChange("bodyText", event.target.value)}
            rows={18}
            spellCheck={true}
            lang="en-IE"
            style={{ ...inputStyle, lineHeight: 1.55, resize: "vertical" }}
          />
        </label>

        <p style={{ margin: 0, color: "#666" }}>
          Plain-text edits replace body formatting. Use the full Sanity editor when adding or changing bold text,
          headings, links, lists or inline images. Existing formatting remains preserved until the plain-text body is edited.
        </p>

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
            {isSaving ? "Saving…" : "Save draft"}
          </button>

          <small>Keyboard shortcut: Ctrl+S / Cmd+S</small>

          <IntentLink
            intent="edit"
            params={{ id: normaliseId(article._id), type: "article" }}
          >
            Open full Sanity editor for rich formatting
          </IntentLink>
        </div>
      </section>

      <MetadataPanel article={article} isSaving={isSaving} />
    </>
  );
}
