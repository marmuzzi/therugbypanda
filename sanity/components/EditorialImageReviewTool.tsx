import React, { useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";

type EditorialImage = {
  _id: string;
  title?: string;
  lifecycleStatus?: string;
  usageApproved?: boolean;
  editorialCategory?: string;
  photoType?: string[] | string;
  thumbnail?: string;
  imageUrl?: string;
  url?: string;
  assetUrl?: string;
};

const NEEDS_REVIEW_QUERY = `*[
  _type == "editorialImage" &&
  (!defined(lifecycleStatus) || lifecycleStatus in ["candidate", "Candidate", "pending-validation", "Pending Validation"])
] | order(_updatedAt desc) {
  _id,
  title,
  lifecycleStatus,
  usageApproved,
  editorialCategory,
  photoType,
  thumbnail,
  imageUrl,
  url,
  "assetUrl": image.asset->url
}`;

function imageSource(image: EditorialImage) {
  return image.assetUrl ?? image.thumbnail ?? image.imageUrl ?? image.url;
}

function normalisePhotoType(value: EditorialImage["photoType"]) {
  if (Array.isArray(value)) return value.join(", ");
  return value ?? "No photo type";
}

export function EditorialImageReviewTool() {
  const client = useClient({ apiVersion: "2025-01-01" });
  const [images, setImages] = useState<EditorialImage[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  async function loadImages() {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await client.fetch<EditorialImage[]>(NEEDS_REVIEW_QUERY);
      setImages(result);
      setSelectedIds((current) => current.filter((id) => result.some((image) => image._id === id)));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load editorial images.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadImages();
  }, []);

  function toggleSelected(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function selectAll() {
    setSelectedIds(images.map((image) => image._id));
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  async function bulkUpdate(action: "approved" | "rejected" | "archived") {
    if (selectedIds.length === 0) {
      setMessage("Select at least one image first.");
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      let transaction = client.transaction();

      for (const id of selectedIds) {
        transaction = transaction.patch(id, (patch) =>
          patch.set({
            lifecycleStatus: action,
            usageApproved: action === "approved",
          }),
        );
      }

      await transaction.commit();
      setMessage(`${selectedIds.length} image${selectedIds.length === 1 ? "" : "s"} updated to ${action}.`);
      setSelectedIds([]);
      await loadImages();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Bulk update failed.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main style={{ padding: "2rem", display: "grid", gap: "1.5rem" }}>
      <header style={{ display: "grid", gap: "0.5rem" }}>
        <h1 style={{ margin: 0 }}>Editorial Image Review</h1>
        <p style={{ margin: 0, maxWidth: "760px", color: "#666" }}>
          Review candidate images in bulk. Approved images become available for editorial use; rejected and archived images leave this review queue.
        </p>
      </header>

      <section style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
        <button type="button" onClick={selectAll} disabled={isLoading || images.length === 0 || isSaving}>
          Select all
        </button>
        <button type="button" onClick={clearSelection} disabled={selectedIds.length === 0 || isSaving}>
          Clear
        </button>
        <button type="button" onClick={() => bulkUpdate("approved")} disabled={selectedIds.length === 0 || isSaving}>
          Approve selected
        </button>
        <button type="button" onClick={() => bulkUpdate("rejected")} disabled={selectedIds.length === 0 || isSaving}>
          Reject selected
        </button>
        <button type="button" onClick={() => bulkUpdate("archived")} disabled={selectedIds.length === 0 || isSaving}>
          Archive selected
        </button>
        <button type="button" onClick={() => loadImages()} disabled={isLoading || isSaving}>
          Refresh
        </button>
        <strong>{selectedIds.length} selected</strong>
      </section>

      {message ? <p style={{ margin: 0, color: "#444" }}>{message}</p> : null}

      {isLoading ? <p>Loading images…</p> : null}

      {!isLoading && images.length === 0 ? <p>No images currently need review.</p> : null}

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {images.map((image) => {
          const src = imageSource(image);
          const selected = selectedSet.has(image._id);

          return (
            <article
              key={image._id}
              style={{
                border: selected ? "3px solid #111" : "1px solid #ddd",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <button
                type="button"
                onClick={() => toggleSelected(image._id)}
                style={{ width: "100%", padding: 0, border: 0, background: "transparent", cursor: "pointer" }}
                aria-pressed={selected}
              >
                {src ? (
                  <img
                    src={src}
                    alt=""
                    style={{ display: "block", width: "100%", aspectRatio: "4 / 3", objectFit: "cover", background: "#f2f2f2" }}
                  />
                ) : (
                  <div style={{ aspectRatio: "4 / 3", display: "grid", placeItems: "center", background: "#f2f2f2" }}>No preview</div>
                )}
              </button>

              <div style={{ padding: "0.75rem", display: "grid", gap: "0.35rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700 }}>
                  <input type="checkbox" checked={selected} onChange={() => toggleSelected(image._id)} />
                  {image.title ?? "Untitled image"}
                </label>
                <small>Status: {image.lifecycleStatus ?? "Candidate"}</small>
                <small>Category: {image.editorialCategory ?? "No category"}</small>
                <small>Type: {normalisePhotoType(image.photoType)}</small>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
