import React, { useEffect, useState } from "react";
import { useClient } from "sanity";

import { cardStyle, inputStyle } from "./constants";
import type { ReviewArticle } from "./types";

type ReferenceOption = {
  _id: string;
  label: string;
};

type OptionSets = {
  categories: ReferenceOption[];
  authors: ReferenceOption[];
  provinces: ReferenceOption[];
  competitions: ReferenceOption[];
  tags: ReferenceOption[];
};

type MetadataPanelProps = {
  article: ReviewArticle;
  isSaving: boolean;
  onUpdated: (articleId: string) => Promise<void> | void;
  onMessage: (message: string) => void;
};

const OPTIONS_QUERY = `{
  "categories": *[_type == "category"] | order(title asc) { _id, "label": title },
  "authors": *[_type == "author"] | order(name asc) { _id, "label": name },
  "provinces": *[_type == "province"] | order(title asc) { _id, "label": title },
  "competitions": *[_type == "competition"] | order(title asc) { _id, "label": title },
  "tags": *[_type == "tag"] | order(title asc) { _id, "label": title }
}`;

export function MetadataPanel({
  article,
  isSaving,
  onUpdated,
  onMessage,
}: MetadataPanelProps): React.JSX.Element {
  const client = useClient({ apiVersion: "2025-01-01" }).withConfig({
    perspective: "raw",
    useCdn: false,
  });
  const [options, setOptions] = useState<OptionSets>({
    categories: [],
    authors: [],
    provinces: [],
    competitions: [],
    tags: [],
  });
  const [categoryId, setCategoryId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [competitionId, setCompetitionId] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [storyType, setStoryType] = useState("");
  const [readingTime, setReadingTime] = useState("");
  const [isLead, setIsLead] = useState(false);
  const [useBrandImage, setUseBrandImage] = useState(false);
  const [isMetadataSaving, setIsMetadataSaving] = useState(false);

  useEffect(() => {
    void client.fetch<OptionSets>(OPTIONS_QUERY).then(setOptions).catch(() => {
      onMessage("Unable to load editorial metadata options.");
    });
  }, []);

  useEffect(() => {
    setCategoryId(article.category?._id ?? "");
    setAuthorId(article.author?._id ?? "");
    setProvinceId(article.province?._id ?? "");
    setCompetitionId(article.competition?._id ?? "");
    setTagIds((article.tags ?? []).flatMap((tag) => (tag._id ? [tag._id] : [])));
    setStoryType(article.editorialStoryType ?? "");
    setReadingTime(article.readingTime ?? "");
    setIsLead(article.isLead === true);
    setUseBrandImage(article.useBrandImage === true);
  }, [article._id]);

  function reference(id: string) {
    return id ? { _type: "reference", _ref: id } : null;
  }

  async function saveMetadata() {
    if (!categoryId) {
      onMessage("Choose a category before saving article metadata.");
      return;
    }

    setIsMetadataSaving(true);
    try {
      const patch = client.patch(article._id).set({
        category: reference(categoryId),
        author: reference(authorId),
        province: reference(provinceId),
        competition: reference(competitionId),
        tags: tagIds.map((id) => ({
          _key: id.replace(/[^a-zA-Z0-9]/g, "").slice(-12),
          _type: "reference",
          _ref: id,
        })),
        editorialStoryType: storyType.trim() || null,
        readingTime: readingTime.trim() || null,
        isLead,
        useBrandImage,
        updatedAt: new Date().toISOString(),
      });

      if (!authorId) patch.unset(["author"]);
      if (!provinceId) patch.unset(["province"]);
      if (!competitionId) patch.unset(["competition"]);

      await patch.commit();
      onMessage("Article metadata saved in Sanity.");
      await onUpdated(article._id);
    } catch (error) {
      onMessage(error instanceof Error ? error.message : "Unable to save article metadata.");
    } finally {
      setIsMetadataSaving(false);
    }
  }

  const disabled = isSaving || isMetadataSaving;

  return (
    <section style={{ ...cardStyle, display: "grid", gap: ".85rem" }}>
      <div>
        <h2 style={{ margin: 0 }}>Article settings</h2>
        <p style={{ margin: ".3rem 0 0", color: "#666" }}>
          Control where the article appears and how it is presented on the website.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: ".75rem" }}>
        <ReferenceSelect label="Category" value={categoryId} options={options.categories} required onChange={setCategoryId} />
        <ReferenceSelect label="Author" value={authorId} options={options.authors} onChange={setAuthorId} />
        <ReferenceSelect label="Province" value={provinceId} options={options.provinces} onChange={setProvinceId} />
        <ReferenceSelect label="Competition" value={competitionId} options={options.competitions} onChange={setCompetitionId} />

        <label>
          Story type
          <input value={storyType} onChange={(event) => setStoryType(event.target.value)} placeholder="News, analysis, opinion…" style={inputStyle} />
        </label>

        <label>
          Reading time
          <input value={readingTime} onChange={(event) => setReadingTime(event.target.value)} placeholder="4 min read" style={inputStyle} />
        </label>
      </div>

      <label>
        Tags
        <select
          multiple
          value={tagIds}
          onChange={(event) => setTagIds(Array.from(event.target.selectedOptions, (option) => option.value))}
          style={{ ...inputStyle, minHeight: 120 }}
        >
          {options.tags.map((option) => (
            <option key={option._id} value={option._id}>{option.label}</option>
          ))}
        </select>
        <small>Use Ctrl/Cmd to select more than one tag.</small>
      </label>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <label style={{ display: "flex", gap: ".45rem", alignItems: "center" }}>
          <input type="checkbox" checked={isLead} onChange={(event) => setIsLead(event.target.checked)} />
          Hero / lead article
        </label>
        <label style={{ display: "flex", gap: ".45rem", alignItems: "center" }}>
          <input type="checkbox" checked={useBrandImage} onChange={(event) => setUseBrandImage(event.target.checked)} />
          Use Rugby Panda branded image
        </label>
      </div>

      <div>
        <button type="button" onClick={() => void saveMetadata()} disabled={disabled}>
          {isMetadataSaving ? "Saving settings…" : "Save article settings"}
        </button>
      </div>
    </section>
  );
}

function ReferenceSelect({
  label,
  value,
  options,
  required = false,
  onChange,
}: {
  label: string;
  value: string;
  options: ReferenceOption[];
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {label}{required ? " *" : ""}
      <select value={value} onChange={(event) => onChange(event.target.value)} style={inputStyle}>
        <option value="">{required ? `Choose ${label.toLowerCase()}` : `No ${label.toLowerCase()}`}</option>
        {options.map((option) => (
          <option key={option._id} value={option._id}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}
