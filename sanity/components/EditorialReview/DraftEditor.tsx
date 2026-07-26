import React from "react";

import { cardStyle, inputStyle } from "./constants";
import { displayStatus, normaliseId } from "./formatting";

import type {
  EditableDraft,
  ReviewArticle,
} from "./types";

type DraftEditorProps = {
  article: ReviewArticle;
  draft: EditableDraft;
  isDirty: boolean;
  isSaving: boolean;
  onChange: (field: keyof EditableDraft, value: string) => void;
  onSave: () => void;
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
          style={{
            textTransform: "uppercase",
            letterSpacing: ".05em",
          }}
        >
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

      <label>
        Article body
        <textarea
          value={draft.bodyText}
          onChange={(event) => onChange("bodyText", event.target.value)}
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
              onChange={(event) =>
                onChange("seoDescription", event.target.value)
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
          onClick={onSave}
          disabled={!isDirty || isSaving}
        >
          {isSaving ? "Saving…" : "Save draft"}
        </button>

        <small>Keyboard shortcut: Ctrl+S / Cmd+S</small>

        <a
          href={`/intent/edit/id=${normaliseId(article._id)};type=article/`}
        >
          Open full Sanity editor
        </a>
      </div>
    </section>
  );
}
